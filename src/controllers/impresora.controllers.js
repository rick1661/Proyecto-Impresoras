
//Importacion de la conexion a la BD
import {getConnection} from '../database/connection.js'
import {sql} from 'mssql';

//Funciones para los metodos get y put

//Consulta general
export const getImpresoras = async (req, res) => {

    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM impresora');
    console.log(result);
    res.json(result.recordset);
}

//Consulta unica
export const getOneImpresora = (req, res) => {
    res.send('Obteniendo una sola consulta');
}

//Creacion unica
export const postOneImpresora = async (req, res) => {

    console.log(req.body);
    const pool = await getConnection();
    pool.request()
        .input('serie', sql.Varchar, req.body.serie)
        .input('nombre', sql.Varchar, req.body.nombre)
        .input('marca', sql.Varchar, req.body.marca)
        .input('modelo', sql.Varchar, req.modelo)
    .query('INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID) VALUES (@serie, @nombre, @marca. @modelo, @direccionIP, @areaID, @contratoID)');
    
    res.send('Creando impresora');
}

//Actualizacion unica
export const putOneimpresora = (req, res) => {
    res.send('Actualizando impresora');
}

//Eliminacion unica
export const deleteOneimpresora =(req, res) =>{
    res.send('Eliminado impresora');
}