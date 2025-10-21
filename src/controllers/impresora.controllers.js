
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

        //INsert para la tabla impresora
        const result = await reqT

            .input("id", sql.Int, req.params.id)
            .input("serie", sql.VarChar, req.body.serie)
            .input("nombre", sql.VarChar, req.body.nombre)
            .input("marca", sql.VarChar, req.body.marca)
            .input("modelo", sql.VarChar, req.body.modelo)
            .input("direccionIp", sql.VarChar, req.body.direccionIp)
            .input("areaID", sql.Int, req.body.area)
            .input("contratoID", sql.Int, req.body.contrato)
            .input("toner", sql.VarChar, req.body.toner)
            .query(`
                INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID, toner)
                 VALUES (@serie, @nombre, @marca, @modelo, @direccionIp, @areaID, @contratoID, @toner); 
                 SELECT SCOPE_IDENTITY() AS id;
                 `);

        console.log(result);
        res.json({
            id: result.recordset[0].id,
            serie: req.body.serie,
            nombre: req.body.nombre,
            marca: req.body.marca,
            modelo: req.body.modelo,
            direccionIP: req.body.direccionIP,
            areaID: req.body.areaID,
            contratoID: req.body.contratoID
        })

        const impresoraId = result.recordset[0].id;

        //Insetar Evento
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
        res.status(201).json({ id: impresoraId });
    } catch (err) {
        // intentar rollback de forma segura
        try {
            await transaction.rollback();
        } catch (rbErr) {
            console.error('Rollback failed:', rbErr);
        }
        console.error('Error crearImpresoraController:', err);
        res.status(500).json({ error: 'Error creando impresora' });
    }

}



//Actualizacion unica
export const putOneImpresora = async (req, res) => {

    const pool = await getConnection();
    const result = await pool.request()
        .input("id", sql.Int, req.params.id)
        .input("serie", sql.VarChar, req.body.serie)
        .input("nombre", sql.VarChar, req.body.nombre)
        .input("marca", sql.VarChar, req.body.marca)
        .input("modelo", sql.VarChar, req.body.modelo)
        .input("direccionIp", sql.VarChar, req.body.direccionIp)
        .input("areaID", sql.Int, req.body.areaID)
        .input("contratoID", sql.Int, req.body.contratoID)
        .input("toner", sql.VarChar, req.body.toner)
        .query("UPDATE impresora SET serie = @serie, nombre = @nombre, marca = @marca, modelo = @modelo, direccionIp = @direccionIp, areaID = @areaID, contratoID = @contratoID, toner = @toner WHERE impresoraID = @id ")

    if (result.rowsAffected === 0) {
        return res.status(404).json({ message: "Impresora no encontrada" });
    } else {
        res.json('Impresora actualizada');
    }
    res.send('Actualizando impresora');

}

//Eliminacion unica
export const deleteOneImpresora = async (req, res) => {

    const pool = await getConnection();
    const result = await pool.request()
        .input('id', sql.Int, req.params.id)
        .query("DELETE FROM impresora WHERE impresoraID = @id");

    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: "Impresora no encontrada" });
    } else {
        return res.json({ message: "Producto eliminado" });
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
