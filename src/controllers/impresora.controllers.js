
//Importacion de la conexion a la BD
import { getConnection } from '../database/connection.js';
import { insertarEvento } from '../utils/audit.js';
import sql from 'mssql';

//Funciones para los metodos get y put

//Consulta general
export const getImpresoras = async (req, res) => {


    const pool = await getConnection();
    const result = await pool.request().query('SELECT impresoraID, serie, impresora.nombre, marca, modelo, direccionIp, area.nombre, contrato.nombre, impresora.toner FROM impresora INNER JOIN area ON impresora.areaID = area.areaID INNER JOIN contrato ON impresora.contratoID = contrato.contratoID');
    console.log(result);
    res.json(result.recordset);
}

//Consulta unica
export const getOneImpresora = async (req, res) => {

    console.log(req.params.id);
    const pool = await getConnection();
    const result = await pool.request()
        .input('id', sql.Int, req.params.id)
        .query('SELECT * FROM impresora WHERE impresoraID = @id');

    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "Impresora no encontrada" });

    } else {
        return res.json(result.recordset[0]);
    }

}

//Creacion unica
export const postOneImpresora = async (req, res) => {

    console.log(req.body);
    const pool = await getConnection();
    const transaction = new sql.Transaction(pool);
    try {
        await transaction.begin();
        const reqT = new sql.Request(transaction);

        //INSERT para la tabla impresora
        const result = await reqT
            .input("serie", sql.VarChar, req.body.serie)
            .input("nombre", sql.VarChar, req.body.nombre)
            .input("marca", sql.VarChar, req.body.marca)
            .input("modelo", sql.VarChar, req.body.modelo)
            .input("direccionIp", sql.VarChar, req.body.direccionIp)
            .input("areaID", sql.Int, req.body.areaID)           // ✅ Corregido: usar areaID
            .input("contratoID", sql.Int, req.body.contratoID)   // ✅ Corregido: usar contratoID
            .input("toner", sql.VarChar, req.body.toner)
            .query(`
                INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID, toner)
                 VALUES (@serie, @nombre, @marca, @modelo, @direccionIp, @areaID, @contratoID, @toner); 
                 SELECT SCOPE_IDENTITY() AS id;
                 `);

        console.log(result);
        const impresoraId = result.recordset[0].id;

        //Insertar Evento
        await insertarEvento({
            tipo: 'CREATE_IMPRESORA',
            recurso: 'impresora',
            recursoId: impresoraId,
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
        
        // Una sola respuesta al final
        res.status(201).json({
            id: impresoraId,
            serie: req.body.serie,
            nombre: req.body.nombre,
            marca: req.body.marca,
            modelo: req.body.modelo,
            direccionIp: req.body.direccionIp,
            areaID: req.body.areaID,        // ✅ Corregido: usar areaID
            contratoID: req.body.contratoID, // ✅ Corregido: usar contratoID
            toner: req.body.toner
        });
    } catch (err) {
        // intentar rollback de forma segura
        try {
            await transaction.rollback();
        } catch (rbErr) {
            console.error('Rollback failed:', rbErr);
        }
        
        console.error('Error crearImpresoraController:', err);
        
        // 🔍 Manejo específico de errores
        if (err.number === 547) { // Foreign key constraint violation
            if (err.message.includes('areaID')) {
                return res.status(400).json({ 
                    error: 'El área seleccionada no existe',
                    message: 'Por favor seleccione un área válida de la lista'
                });
            } else if (err.message.includes('contratoID')) {
                return res.status(400).json({ 
                    error: 'El contrato seleccionado no existe',
                    message: 'Por favor seleccione un contrato válido de la lista'
                });
            } else {
                return res.status(400).json({ 
                    error: 'Referencia inválida',
                    message: 'El área o contrato seleccionado no existe'
                });
            }
        } else if (err.number === 2627) { // Unique constraint violation (duplicate serie)
            return res.status(409).json({ 
                error: 'Serie duplicada',
                message: 'Ya existe una impresora con esa serie'
            });
        }
        
        res.status(500).json({ error: 'Error creando impresora' });
    }

}



//Actualizacion unica
export const putOneImpresora = async (req, res) => {

    const pool = await getConnection();
    const transaction = new sql.Transaction(pool);
    try {
        await transaction.begin();
        const reqT = new sql.Request(transaction);

        // Validar que los campos requeridos no sean null o undefined
        console.log('Request body:', req.body);
        console.log('Request params:', req.params);
        
        // 📋 **NUEVO: Obtener datos actuales antes de la actualización para auditoría**
        const datosAnteriores = await reqT
            .input("idConsulta", sql.Int, req.params.id)
            .query(`
                SELECT i.serie, i.nombre, i.marca, i.modelo, i.direccionIp, i.toner,
                       i.areaID, a.nombre as areaNombre,
                       i.contratoID, c.nombre as contratoNombre
                FROM impresora i
                LEFT JOIN area a ON i.areaID = a.areaID
                LEFT JOIN contrato c ON i.contratoID = c.contratoID
                WHERE i.impresoraID = @idConsulta
            `);

        if (datosAnteriores.recordset.length === 0) {
            await transaction.rollback();
            return res.status(404).json({ message: "Impresora no encontrada" });
        }

        const valoresAnteriores = datosAnteriores.recordset[0];
        
        // Los campos ya fueron validados por Joi middleware, no necesitamos validación adicional

        //Actualización para la tabla impresora
        const result = await reqT
            .input("id", sql.Int, req.params.id)
            .input("serie", sql.VarChar, req.body.serie)
            .input("nombre", sql.VarChar, req.body.nombre)
            .input("marca", sql.VarChar, req.body.marca)
            .input("modelo", sql.VarChar, req.body.modelo)
            .input("direccionIp", sql.VarChar, req.body.direccionIp)
            .input("areaID", sql.Int, req.body.areaID)
            .input("contratoID", sql.Int, req.body.contratoID)
            .input("toner", sql.VarChar, req.body.toner)
            .query("UPDATE impresora SET serie = @serie, nombre = @nombre, marca = @marca, modelo = @modelo, direccionIp = @direccionIp, areaID = @areaID, contratoID = @contratoID, toner = @toner WHERE impresoraID = @id ");

        // Verificar si se actualizó algún registro
        if (result.rowsAffected[0] === 0) {
            await transaction.rollback();
            return res.status(404).json({ message: "Impresora no encontrada" });
        }

        // 📋 **NUEVO: Preparar datos de auditoría con valores anteriores y nuevos**
        const valoresNuevos = {
            serie: req.body.serie,
            nombre: req.body.nombre,
            marca: req.body.marca,
            modelo: req.body.modelo,
            direccionIp: req.body.direccionIp,
            areaID: req.body.areaID,
            contratoID: req.body.contratoID,
            toner: req.body.toner
        };

        // 🔍 **Detectar qué campos específicamente cambiaron**
        const cambios = {};
        Object.keys(valoresNuevos).forEach(campo => {
            const valorAnterior = valoresAnteriores[campo];
            const valorNuevo = valoresNuevos[campo];
            
            // Comparar valores (considerando que algunos pueden ser null/undefined)
            if (valorAnterior !== valorNuevo) {
                cambios[campo] = {
                    anterior: valorAnterior,
                    nuevo: valorNuevo
                };
            }
        });

        //insertar Evento con información completa de cambios
        await insertarEvento({
            tipo: 'UPDATE_IMPRESORA',
            recurso: 'impresora',
            recursoId: req.params.id,
            usuarioId: req.user?.id ?? null,
            usuarioNombre: req.user?.name ?? null,
            detalles: { 
                valoresAnteriores: valoresAnteriores,
                valoresNuevos: valoresNuevos,
                cambiosDetectados: cambios,
                totalCambios: Object.keys(cambios).length,
                metadatos: {
                    timestamp: new Date().toISOString(),
                    source: 'web_interface'
                }
            },
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            requestId: req.headers['x-request-id'] ?? null,
            resultado: 'SUCCESS',
            mensaje: `Impresora actualizada. ${Object.keys(cambios).length} campos modificados: ${Object.keys(cambios).join(', ')}`
        }, transaction);

        await transaction.commit();
        res.status(200).json({ 
            message: "Impresora actualizada", 
            cambios: Object.keys(cambios).length,
            camposModificados: Object.keys(cambios)
        });
    } catch (err) {
        // intentar rollback de forma segura
        try {
            await transaction.rollback();
        } catch (rbErr) {
            console.error('Rollback failed:', rbErr);
        }
        console.error('Error putOneImpresora:', err);
        
        // Enviar error más específico basado en el tipo de error
        if (err.number === 515) { // NULL constraint violation
            return res.status(400).json({ 
                error: 'Datos faltantes o inválidos',
                details: 'Uno o más campos requeridos están vacíos o son inválidos',
                originalError: err.message
            });
        }
        
        if (err.number === 547) { // Foreign key constraint violation
            return res.status(400).json({ 
                error: 'Referencias inválidas',
                details: 'El área o contrato especificado no existe',
                originalError: err.message
            });
        }
        
        res.status(500).json({ 
            error: 'Error actualizando impresora',
            details: err.message,
            number: err.number
        });
    }
}

//Eliminacion unica
export const deleteOneImpresora = async (req, res) => {

    const pool = await getConnection();
    const transaction = new sql.Transaction(pool)

    try {
        await transaction.begin();
        const reqT = new sql.Request(transaction);

        //Sentencias SQL para la eliminacion
        const result = await reqT
            .input('id', sql.Int, req.params.id)
            .query("DELETE FROM impresora WHERE impresoraID = @id");

        // Verificar si se eliminó algún registro
        if (result.rowsAffected[0] === 0) {
            await transaction.rollback();
            return res.status(404).json({ message: "Impresora no encontrada" });
        }

        const impresoraId = req.params.id;
        //Insertar Evento
        await insertarEvento({
            tipo: 'DELETE_IMPRESORA',
            recurso: 'impresora',
            recursoId: impresoraId,
            usuarioId: req.user?.id ?? null,
            usuarioNombre: req.user?.name ?? null,
            detalles: { 
                impresoraId: impresoraId,
                body: req.body 
            },
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            requestId: req.headers['x-request-id'] ?? null,
            resultado: 'SUCCESS',
            mensaje: null
        }, transaction);
        
        await transaction.commit();
        res.status(200).json({ message: "Impresora eliminada correctamente" });
    } catch (err) {
        // intentar rollback de forma segura
        try {
            await transaction.rollback();
        } catch (rbErr) {
            console.error('Rollback failed:', rbErr);
        }
        console.error('Error deleteOneImpresora:', err);
        res.status(500).json({ error: 'Error eliminando impresora' });

    }
}

// cargar impresoras y modelo de consulta desde la base de datos
export async function impresoraIpModelo() {
    // Consulta tu base de datos y devuelve un array de impresoras: [{ direccionIp, Modelo }]
    const pool = await getConnection();
    const result = await pool.request().query('SELECT direccionIp, modelo FROM impresora');
    console.log(result);
    return result.recordset;
    // Ejemplo estático:
    // return [
    //     { direccionIp: '        192.168.1.1', modelo: 'HP LaserJet Pro' },
    //     { direccionIp: '        192.168.1.2', modelo: 'Canon PIXMA' },
    //     { direccionIp: '        192.168.1.3', modelo: 'Epson EcoTank' }
    // ];       
}
