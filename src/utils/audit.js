// src/utils/audit.js
// Helper para insertar eventos de auditoría en la base de datos (SQL Server)
// Usa el driver `mssql` y el pool proporcionado por `getConnection`.
import sql from 'mssql';
import { getConnection } from '../database/connection.js';

/**
 * Insertar un evento de auditoría.
 *
 * Parámetros:
 *  - evento: objeto con las propiedades a persistir (tipo, recurso, recursoId, usuarioId, etc.).
 *  - transaction: opcional, una instancia de sql.Transaction; si se pasa, la inserción
 *                 usará esa transacción (permite atomicidad cuando el caller controla la transacción).
 *
 * Retorno: Promise que resuelve { auditoriaId } con el id insertado (BIGINT), o rechaza con un error.
 */
export async function insertarEvento(evento, transaction = null) {
  // Obtener el pool de conexiones (reutilizable) desde el módulo de conexión
  const pool = await getConnection();

  // tx será la transacción usada por esta función; si el caller pasó una, la usamos; si no, la creamos.
  let tx = transaction;

  // closeTransaction indica si debemos commitear/rollbackear la transacción (true si la función la creó)
  const closeTransaction = !tx;

  try {
    // Si no se recibió transacción, crear una nueva y comenzarla
    if (!tx) {
      tx = new sql.Transaction(pool); // crear objeto Transaction ligado al pool
      await tx.begin(); // iniciar la transacción en la BD
    }

    // Crear una Request ligada a la transacción tx (todo lo ejecutado con `req` será parte de la tx)
    const req = new sql.Request(tx);

    // Ejecutar la inserción usando parámetros seguros (.input) para evitar inyección SQL
    // y para enlazar tipos SQL apropiados.
    const result = await req
      .input('Tipo', sql.NVarChar(100), evento.tipo)
      .input('Recurso', sql.NVarChar(100), evento.recurso)
      // Convertir recursoId a string si existe; si no, pasar null
      .input('RecursoId', sql.NVarChar(200), evento.recursoId?.toString() ?? null)
      .input('UsuarioId', sql.NVarChar(200), evento.usuarioId ?? null)
      .input('UsuarioNombre', sql.NVarChar(200), evento.usuarioNombre ?? null)
      // Serializar 'detalles' como JSON si es objeto; guardar en NVARCHAR(MAX)
      .input('Detalles', sql.NVarChar(sql.MAX), evento.detalles ? JSON.stringify(evento.detalles) : null)
      .input('IP', sql.NVarChar(100), evento.ip ?? null)
      .input('UserAgent', sql.NVarChar(500), evento.userAgent ?? null)
      .input('RequestId', sql.NVarChar(200), evento.requestId ?? null)
      .input('Resultado', sql.NVarChar(50), evento.resultado ?? null)
      .input('Mensaje', sql.NVarChar(1000), evento.mensaje ?? null)
      .query(`
        INSERT INTO dbo.EventosAuditoria
          (Tipo, Recurso, RecursoId, UsuarioId, UsuarioNombre, Detalles, IP, UserAgent, RequestId, Resultado, Mensaje)
        VALUES
          (@Tipo,@Recurso,@RecursoId,@UsuarioId,@UsuarioNombre,@Detalles,@IP,@UserAgent,@RequestId,@Resultado,@Mensaje);

        -- Devolver el id insertado (SCOPE_IDENTITY()) convertido a BIGINT
        SELECT CONVERT(BIGINT, SCOPE_IDENTITY()) AS AuditoriaID;
      `);

    // Extraer el id insertado del resultado (si existe)
    const auditoriaId = result.recordset && result.recordset[0] ? result.recordset[0].AuditoriaID : null;

    // Si la función creó la transacción, cerrarla con commit
    if (closeTransaction) {
      await tx.commit();
    }

    // Retornar el id insertado para quien llame la función
    return { auditoriaId };
  } catch (err) {
    // Si hubo error y esta función creó la transacción, intentar rollback para dejar la BD consistente
    if (tx && closeTransaction) {
      try {
        await tx.rollback();
      } catch (e) {
        // Si el rollback falla, registrar/loguear el error aquí (no se reemplaza el error original)
        // console.error('Rollback failed in insertarEvento:', e);
      }
    }
    // Re-lanzar el error al caller para que lo maneje
    throw err;
  }
}