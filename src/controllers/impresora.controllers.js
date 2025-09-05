
//Importacion de la conexion a la BD
import { getConnection } from '../database/connection.js';
import sql from 'mssql';

//Funciones para los metodos get y put

//Consulta general
export const getImpresoras = async (req, res) => {


    const pool = await getConnection();
    const result = await pool.request().query('SELECT impresoraID, serie, impresora.nombre, marca, modelo, direccionIp, area.nombre, contrato.nombre FROM impresora INNER JOIN area ON impresora.areaID = area.areaID INNER JOIN contrato ON impresora.contratoID = contrato.contratoID');
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
    const result = await pool.request()
        .input("id", sql.Int, req.params.id)
        .input("serie", sql.VarChar, req.body.serie)
        .input("nombre", sql.VarChar, req.body.nombre)
        .input("marca", sql.VarChar, req.body.marca)
        .input("modelo", sql.VarChar, req.body.modelo)
        .input("direccionIp", sql.VarChar, req.body.direccionIp)
        .input("areaID", sql.Int, req.body.area)
        .input("contratoID", sql.Int, req.body.contrato)
        .query(`INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID) VALUES (@serie, @nombre, @marca, @modelo, @direccionIp, @areaID, @contratoID); SELECT SCOPE_IDENTITY() AS id;`);
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
        .query("UPDATE impresora SET serie = @serie, nombre = @nombre, marca = @marca, modelo = @modelo, direccionIp = @direccionIp, areaID = @areaID, contratoID = @contratoID WHERE impresoraID = @id ")

    if (result.rowsAffected === 0) {
        return res.status(404).json({ message: "Impresora no encontrada" });
    }
    else {
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