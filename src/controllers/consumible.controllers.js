import { getConnection} from "../database/connection.js";
import { insertarEvento } from '../utils/audit.js';
import sql from 'mssql';

/**
 * 🗓️ Obtiene la fecha actual en formato YYYY-MM-DD para México (UTC-6)
 * Esto evita problemas de desfase de zona horaria al guardar en SQL Server
 */
function obtenerFechaActualMexico() {
    const ahora = new Date();
    
    // Ajustar a zona horaria de México (UTC-6)
    // Durante horario de verano puede ser UTC-5, pero manejamos UTC-6 como estándar
    const offsetMexico = -6 * 60; // -6 horas en minutos
    const utc = ahora.getTime() + (ahora.getTimezoneOffset() * 60000);
    const fechaMexico = new Date(utc + (offsetMexico * 60000));
    
    // Convertir a formato YYYY-MM-DD para SQL Server DATE
    return fechaMexico.toISOString().split('T')[0];
}

//Consulta General
export const getConsumibles =  async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT consumibleID, tipo, consumible.modelo, tij, fecha, impresora.nombre, impresora.serie FROM consumible INNER JOIN impresora ON consumible.impresoraID = impresora.impresoraID;');
    res.json(result.recordset);
};

//Consulta unica
export const getOneConsumible =  async (req, res) => {
    try {
        const pool = await getConnection();
        const serieParam = (req.params.id || '').trim();

        const result = await pool.request()
            // ajustar tamaño si lo deseas, por ejemplo VarChar(50)
            .input('serie', sql.VarChar(50), serieParam)
            .query(`
                SELECT c.consumibleID, c.tipo, c.modelo, c.tij, c.fecha
                FROM consumible c
                INNER JOIN impresora i ON c.impresoraID = i.impresoraID
                WHERE UPPER(RTRIM(LTRIM(i.serie))) = UPPER(@serie);
            `);

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).json({ message: 'Consumible no encontrado', consumibles: [] });
        }

        // Devolver array bajo la clave consumibles para mantener compatibilidad con el frontend
        return res.json({ consumibles: result.recordset });
    } catch (error) {
        console.error('Error en getOneConsumible:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};



//Creacion unica;
export const postOneConsumible = async (req, res) => {
    const pool = await getConnection();
    const transaction = new sql.Transaction(pool);
    try {
        await transaction.begin();
        const reqT = new sql.Request(transaction);

        // 🗓️ Obtener fecha actual corregida para México
        const fechaActual = obtenerFechaActualMexico();

        const result = await reqT
            .input("tipo", sql.VarChar, req.body.tipo)
            .input("modelo", sql.VarChar, req.body.modelo)
            .input("tij", sql.VarChar, req.body.tij)
            .input("fecha", sql.Date, fechaActual)
            .input("impresoraID", sql.Int, req.body.impresoraID)
            .query("INSERT INTO consumible (tipo, modelo, tij , fecha, impresoraID) VALUES (@tipo, @modelo, @tij, @fecha, @impresoraID); SELECT SCOPE_IDENTITY() AS id;");

        const consumibleId = result.recordset[0].id;

        // Insertar evento
        await insertarEvento({
            tipo: 'CREATE_CONSUMIBLE',
            recurso: 'consumible',
            recursoId: consumibleId,
            usuarioId: req.user?.id ?? null,
            usuarioNombre: req.user?.name ?? null,
            detalles: { body: req.body },
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            requestId: req.headers['x-request-id'] ?? null,
            resultado: 'SUCCESS',
            mensaje: null
        }, transaction);

        await transaction.commit();
        res.status(201).json({
            id: consumibleId,
            tipo: req.body.tipo,
            modelo: req.body.modelo,
            impresoraID: req.body.impresoraID,
            tij: req.body.tij,
            fecha: fechaActual
        });
    } catch (err) {
        try {
            await transaction.rollback();
        } catch (rbErr) {
            console.error('Rollback failed:', rbErr);
        }
        console.error('Error postOneConsumible:', err);
        res.status(500).json({ error: 'Error creando consumible' });
    }
};

//Actualizacion unica
export const putOneConsumible = async (req, res) => {
    const pool = await getConnection();
    const transaction = new sql.Transaction(pool);
    try {
        await transaction.begin();
        const reqT = new sql.Request(transaction);

        const result = await reqT
            .input("consumibleID", sql.Int, req.params.id)
            .input("tipo", sql.VarChar, req.body.tipo)
            .input("modelo", sql.VarChar, req.body.modelo)
            .input("tij", sql.VarChar, req.body.tij)
            .input("fecha", sql.Date, req.body.fecha)
            .input("impresoraID", sql.Int, req.body.impresoraID)
            .query("UPDATE consumible SET tipo = @tipo, modelo = @modelo, tij = @tij, fecha = @fecha, impresoraID = @impresoraID WHERE consumibleID = @consumibleID");

        if(result.rowsAffected[0] === 0){
            await transaction.rollback();
            return res.status(404).json({message: "Consumible no encontrado"});
        }

        // Insertar evento
        await insertarEvento({
            tipo: 'UPDATE_CONSUMIBLE',
            recurso: 'consumible',
            recursoId: req.params.id,
            usuarioId: req.user?.id ?? null,
            usuarioNombre: req.user?.name ?? null,
            detalles: { body: req.body },
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            requestId: req.headers['x-request-id'] ?? null,
            resultado: 'SUCCESS',
            mensaje: null
        }, transaction);

        await transaction.commit();
        res.status(200).json({ message: 'Consumible actualizado' });
    } catch (err) {
        try {
            await transaction.rollback();
        } catch (rbErr) {
            console.error('Rollback failed:', rbErr);
        }
        console.error('Error putOneConsumible:', err);
        res.status(500).json({ error: 'Error actualizando consumible' });
    }
};  

//Eliminacion unica
export const deleteOneConsumible = async (req, res) => {
    const pool = await getConnection();
    const transaction = new sql.Transaction(pool);
    try {
        await transaction.begin();
        const reqT = new sql.Request(transaction);

        const result = await reqT
            .input('id', sql.Int, req.params.id)
            .query("DELETE FROM consumible WHERE consumibleID = @id");

        if(result.rowsAffected[0] === 0){
            await transaction.rollback();
            return res.status(404).json({message: "Consumible no encontrado"});
        }

        const consumibleId = req.params.id;
        // Insertar evento
        await insertarEvento({
            tipo: 'DELETE_CONSUMIBLE',
            recurso: 'consumible',
            recursoId: consumibleId,
            usuarioId: req.user?.id ?? null,
            usuarioNombre: req.user?.name ?? null,
            detalles: { 
                consumibleId: consumibleId,
                body: req.body 
            },
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            requestId: req.headers['x-request-id'] ?? null,
            resultado: 'SUCCESS',
            mensaje: null
        }, transaction);

        await transaction.commit();
        res.status(200).json({message: "Consumible eliminado correctamente"});
    } catch (err) {
        try {
            await transaction.rollback();
        } catch (rbErr) {
            console.error('Rollback failed:', rbErr);
        }
        console.error('Error deleteOneConsumible:', err);
        res.status(500).json({ error: 'Error eliminando consumible' });
    }
};
