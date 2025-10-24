import {getConnection, sql} from '../database/connection.js';

//consulta contratos
export const getContratos = async (req, res) => {

    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM contrato');
    res.json(result.recordset);

};

//Consulta unica
export const getOneContrato = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT * FROM contrato WHERE contratoID = @id');
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Contrato no encontrado' });
        }
        return res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error en getOneContrato:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

//Creacion unica
export const postOneContrato = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('nombre', sql.VarChar, req.body.nombre)
            .input('empresaID', sql.Int, req.body.empresaID)
            .query('INSERT INTO contrato (nombre, empresaID) VALUES (@nombre, @empresaID); SELECT SCOPE_IDENTITY() AS id;');
        
        res.json({
            id: result.recordset[0].id,
            nombre: req.body.nombre,
            empresaID: req.body.empresaID
        });
    } catch (error) {
        console.error('Error en postOneContrato:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}

//Actualizacion unica
export const putOneContrato = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('nombre', sql.VarChar, req.body.nombre)
            .input('empresaID', sql.Int, req.body.empresaID)
            .input('id', sql.Int, req.params.id)
            .query('UPDATE contrato SET nombre = @nombre, empresaID = @empresaID WHERE contratoID = @id');
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Contrato no encontrado' });
        }
        return res.json({ message: 'Contrato actualizado' });
    } catch (error) {
        console.error('Error en putOneContrato:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

//Eliminacion unica
export const deleteOneContrato = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('DELETE FROM contrato WHERE contratoID = @id');
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Contrato no encontrado' });
        }
        return res.json({ message: 'Contrato eliminado' });
    } catch (error) {
        console.error('Error en deleteOneContrato:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

