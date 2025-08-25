import { getConnection} from "../database/connection.js";
import sql from 'mssql';

//Consulta General
export const getConsumibles =  async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM consumible');
    res.json(result.recordset);
};

//Consulta unica
export const getOneConsumible =  async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input('id', sql.Int, req.params.id)
        .query('SELECT * FROM consumible WHERE consumibleID = @id');

    if(result.rowsAffected[0]===0){
        return res.status(404).json({message:"Consumible no encontrado"});
    }else{
        return res.json(result.recordset[0]);
    }
};

//Creacion unica;
export const postOneConsumible = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input("tipo", sql.VarChar, req.body.tipo)
        .input("modelo", sql.VarChar, req.body.modelo)
        .input("impresoraID", sql.Int, req.body.impresoraID)
        .input("tij", sql.Int, req.body.tij)
        .query("INSERT INTO consumible (tipo, modelo, impresoraID, tij) VALUES (@tipo, @modelo, @impresoraID, @tij); SELECT SCOPE_IDENTITY() AS id;");
    res.json({
        id: result.recordset[0].id,
        tipo: req.body.tipo,
        modelo: req.body.modelo,
        impresoraID: req.body.impresoraID,
        tij: req.body.tij
    });
};

//Actualizacion unica
export const putOneConsumible = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input("consumibleID", sql.Int, req.params.id)
        .input("tipo", sql.VarChar, req.body.tipo)
        .input("modelo", sql.VarChar, req.body.modelo)
        .input("impresoraID", sql.Int, req.body.impresoraID)
        .input("tij", sql.Int, req.body.tij)
        .query("UPDATE consumible SET tipo = @tipo, modelo = @modelo, impresoraID = @impresoraID, tij = @tij WHERE consumibleID = @consumibleID");

    if(result.rowsAffected[0] === 0){
        return res.status(404).json({message: "Consumible no encontrado"});
    }
    else{
        res.json('Consumible actualizado');
    }
};

//Eliminacion unica
export const deleteOneConsumible = async (req, res) =>{
    const pool = await getConnection();
    const result = await pool.request()
        .input('id', sql.Int, req.params.id)
        .query("DELETE FROM consumible WHERE consumibleID = @id");

    if(result.rowsAffected[0] === 0){
        return res.status(404).json({message: "Consumible no encontrado"});
    }else{
        return res.json({message: "Consumible eliminado"});
    }
};
