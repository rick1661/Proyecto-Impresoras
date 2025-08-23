import {getConnection} from '../database/connection.js';

//Consulta general
export const getAreas = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM area');
    res.json(result.recordset);
}

//Consulta unica
export const getOneArea = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query(`SELECT * FROM area WHERE areaID = ${req.params.id}`);
    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'Area no encontrada' });
    }
    return res.json(result.recordset[0]);
};


//Creacion unica
export const postOneArea = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query(`INSERT INTO area (nombre, empresaID) VALUES ('${req.body.nombre}', ${req.body.empresaID}); SELECT SCOPE_IDENTITY() AS id;`);
    res.json({
        id: result.recordset[0].id,
        nombre: req.body.nombre,
        empresaID: req.body.empresaID
    });
}

//Actualizacion unica
export const putOneArea = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query(`UPDATE area SET nombre = '${req.body.nombre}' WHERE areaID = ${req.params.id}`);
    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'Area no encontrada' });
    }
    return res.json({ message: 'Area actualizada' });
}

//Eliminacion unica
export const deleteOneArea = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query(`DELETE FROM area WHERE areaID = ${req.params.id}`);
    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'Area no encontrada' });
    }
    return res.json({ message: 'Area eliminada' });
};




