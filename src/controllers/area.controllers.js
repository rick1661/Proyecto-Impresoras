import {getConnection, sql} from '../database/connection.js';

//Consulta general
export const getAreas = async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM area');
    res.json(result.recordset);
}

//Consulta unica
export const getOneArea = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT * FROM area WHERE areaID = @id');
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Area no encontrada' });
        }
        return res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error en getOneArea:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};


//Creacion unica
export const postOneArea = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('nombre', sql.VarChar, req.body.nombre)
            .input('empresaID', sql.Int, req.body.empresaID)
            .query('INSERT INTO area (nombre, empresaID) VALUES (@nombre, @empresaID); SELECT SCOPE_IDENTITY() AS id;');
        
        res.json({
            id: result.recordset[0].id,
            nombre: req.body.nombre,
            empresaID: req.body.empresaID
        });
    } catch (error) {
        console.error('Error en postOneArea:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}

//Actualizacion unica
export const putOneArea = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('nombre', sql.VarChar, req.body.nombre)
            .input('id', sql.Int, req.params.id)
            .query('UPDATE area SET nombre = @nombre WHERE areaID = @id');
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Area no encontrada' });
        }
        return res.json({ message: 'Area actualizada' });
    } catch (error) {
        console.error('Error en putOneArea:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}

//Eliminacion unica
export const deleteOneArea = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('DELETE FROM area WHERE areaID = @id');
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Area no encontrada' });
        }
        return res.json({ message: 'Area eliminada' });
    } catch (error) {
        console.error('Error en deleteOneArea:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};




