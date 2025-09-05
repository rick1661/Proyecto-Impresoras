import { getConnection} from "../database/connection.js";
import sql from 'mssql';


// Crea una nueva instancia del objeto Date para obtener la fecha actual
const fechaActual = new Date();

//Consulta General
export const getConsumibles =  async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT consumibleID, tipo, consumible.modelo, tij, fecha, impresora.nombre, impresora.serie FROM consumible INNER JOIN impresora ON consumible.impresoraID = impresora.impresoraID;');
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
        .input("tij", sql.VarChar, req.body.tij)
        .input("fecha", sql.Date, fechaActual)
        .input("impresoraID", sql.Int, req.body.impresoraID)
        .query("INSERT INTO consumible (tipo, modelo, tij , fecha, impresoraID) VALUES (@tipo, @modelo, @tij, @fecha, @impresoraID); SELECT SCOPE_IDENTITY() AS id;");
    res.json({
        id: result.recordset[0].id,
        tipo: req.body.tipo,
        modelo: req.body.modelo,
        impresoraID: req.body.impresoraID,
        tij: req.body.tij,
        fecha: req.body.fecha
    });
};

//Actualizacion unica
export const putOneConsumible = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request()
        .input("consumibleID", sql.Int, req.params.id)
        .input("tipo", sql.VarChar, req.body.tipo)
        .input("modelo", sql.VarChar, req.body.modelo)
        .input("tij", sql.VarChar, req.body.tij)
        .input("fecha", sql.Date, req.body.fecha)
        .input("impresoraID", sql.Int, req.body.impresoraID)
        .query("UPDATE consumible SET tipo = @tipo, modelo = @modelo, tij = @tij, fecha = @fecha, impresoraID = @impresoraID WHERE consumibleID = @consumibleID");

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
