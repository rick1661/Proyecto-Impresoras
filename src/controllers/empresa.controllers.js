import {getConnection} from '../database/connection.js';

//Funciones metodos de servidor

//Consulta general
export const getEmpresas = async (req, res) =>{
    
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM empresa');
    res.json(result.recordset);
    
};

//Consulta unica
export const getOneEmpresa = async(req,res) => {
    console.log(req.params.id);
    const pool = await getConnection();
    const resultado = await pool.request().query(`SELECT * FROM empresa WHERE empresaID = ${req.params.id}`);
    console.log(resultado);

    if (resultado.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'Empresa no encontrada' });
        
    }
    return res.json(resultado.recordset[0]);
};

//Creacion unica                
export const postOneEmpresa = async (req, res) => {

    console.log(req.body);
    const pool = await getConnection();
    const result = await pool.request().query(`INSERT INTO empresa (nombre, empresaID) VALUES ('${req.body.nombre}', ${req.body.empresaID}); SELECT SCOPE_IDENTITY() AS id;`);
    console.log(result);
    res.json({
        id: result.recordset[0].id,
        nombre: req.body.nombre,
        empresaID: req.body.empresaID
    });
};


//Actualizacion unica
 export const putOneEmpresa = async (req, res) => {

    console.log(req.params.id);
    const pool = await getConnection();
    const result = await pool.request().query(`UPDATE empresa SET nombre = '${req.body.nombre}' WHERE empresaID = ${req.params.id}`);

    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'Empresa no encontrada' });
    }
    return res.json({ message: 'Empresa actualizada' });
}

//Eliminacion Unica
export const deleteOneEmpresa = async (req,res)=>{
    console.log(req.params.id);
    const pool = await getConnection();
    const result = await pool.request().query(`DELETE FROM empresa WHERE empresaID = ${req.params.id}`);

    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'Empresa no encontrada' });
    }
    return res.json({ message: 'Empresa eliminada' });
}