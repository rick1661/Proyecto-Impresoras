import {getConnection} from '../database/connection.js';

//consulta contratos
export const getContratos = async (req, res) => {

    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM contrato');
    res.json(result.recordset);

    res.send('Obteniendo contratos');
};

//Consulta unica
export const getOneContrato = async (req, res) => {

    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM contrato WHERE contratoID = " + req.params.id);
    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'Contrato no encontrado' });
    }
    return res.json(result.recordset[0]);
};

//Creacion unica
export const postOneContrato = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query(`INSERT INTO contrato (nombre, empresaID) VALUES ('${req.body.nombre}', ${req.body.empresaID}); SELECT SCOPE_IDENTITY() AS id;`);
    res.json({
        id: result.recordset[0].id,
        nombre: req.body.nombre,
        empresaID: req.body.empresaID
    });
}

//Actualizacion unica
export const putOneContrato = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query(`UPDATE contrato SET nombre = '${req.body.nombre}', empresaID = ${req.body.empresaID} WHERE contratoID= ${req.params.id}`);
    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'Contrato no encontrado' });
    }
    return res.json({ message: 'Contrato actualizado' });
};

//Eliminacion unica
export const deleteOneContrato = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query(`DELETE FROM contrato WHERE contratoID = ${req.params.id}`);
    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'Contrato no encontrado' });
    }
    return res.json({ message: 'Contrato eliminado' });
};

