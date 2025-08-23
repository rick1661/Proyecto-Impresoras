
//Importacion de la conexion a la BD
import {getConnection} from '../database/connection.js';
import sql from 'mssql';

//Funciones para los metodos get y put

//Consulta general
export const getImpresoras = async (req, res) => {

    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM impresora');
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
    
    if(result.rowsAffected[0]===0){
        return res.status(404).json({message:"Impresora no encontrada"});
        
    }else{
        return res.json(result.recordset[0]);
    }

    res.send('Obteniendo una sola consulta');
}

//Creacion unica
export const postOneImpresora = async (req, res) => {

    console.log(req.body);
    const pool = await getConnection();
    const result = await pool.request()
        .input('serie', sql.VarChar, req.body.serie)
        .input('nombre', sql.VarChar, req.body.nombre)
        .input('marca', sql.VarChar, req.body.marca)
        .input('modelo', sql.VarChar, req.body.modelo)
        .input('direccionIP', sql.VarChar, req.direccionIP)
        .input('areaID', sql.Int, req.body.areaID)
        .input('contratoID', sql.Int, req.body.contratoID)
    .query('INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID) VALUES (@serie, @nombre, @marca. @modelo, @direccionIP, @areaID, @contratoID); SELECT empresaID AS id');
    
    console.log(result);
    res.send('Creando impresora');
    res.json({

        id: (await result).recordset[0].id,
        serie: req.body.serie,
        nombre: req.body.nombre,
        marca: req.body.marca,
        modelo: req.body.modelo,
        direccionIP: req.direccionIP,
        areaID: req.body.areaID,
        contratoID: req.body.contratoID,
    })
}



//Actualizacion unica
export const putOneImpresora = async (req, res) => {

    const pool = await getConnection();
    const result = await pool.request()
        .input("id", sql.Int, req.params.id)
        .input("serie", sql.VarChar, req.body.serie)
        .input("nombre",sql.VarChar, req.body.nombre)
        .input("marca",sql.VarChar, req.body.marca)
        .input("modelo",sql.VarChar, req.body.modelo)
        .input("direccionIP",sql.VarChar, req.body.direccionIP)
        .input("areaID",sql.VarChar, req.body.areaID)
        .input("contratoID",sql.VarChar, req.body.contratoID)
    .query("UPDATE impresora SET impresoraID = @id,  serie = @serie, nombre = @nombre, marca = @marca, modelo = @modelo, direccionIP = @direccionIP, areaID = @areaID, contratoID = @contratoID, impresoraID = @id ")

    if(result.rowsAffected === 0){
        return res.status(404).json({message: "Impresora no encontrada"});
    }
    else{
        res.json('Impresora actualizada');
    }
    res.send('Actualizando impresora');
    
}

//Eliminacion unica
export const deleteOneImpresora = async(req, res) =>{

    const pool = await getConnection();
    const result = await pool.request()
        .input('id', sql.Int, req.params.id)
    .query("DELETE FROM impresora WHERE impresoraID = @id");

    if(result.rowsAffected[0] === 0){
        return res.status(404).json({message: "Impresora no encontrada"});
    }else{
        return res.json({message: "Producto eliminado"});
    }

    res.send('Eliminado impresora');
}