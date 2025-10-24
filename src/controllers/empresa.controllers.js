import {getConnection, sql} from '../database/connection.js';

//Funciones metodos de servidor

//Consulta general
export const getEmpresas = async (req, res) =>{
    
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM empresa');
    res.json(result.recordset);
    
};

//Consulta unica
export const getOneEmpresa = async(req,res) => {
    try {
        console.log(req.params.id);
        const pool = await getConnection();
        const resultado = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT * FROM empresa WHERE empresaID = @id');
        console.log(resultado);

        if (resultado.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        return res.json(resultado.recordset[0]);
    } catch (error) {
        console.error('Error en getOneEmpresa:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

//Creacion unica                
export const postOneEmpresa = async (req, res) => {
    try {
        console.log(req.body);
        const pool = await getConnection();
        const result = await pool.request()
            .input('nombre', sql.VarChar, req.body.nombre)
            .input('empresaID', sql.Int, req.body.empresaID)
            .query('INSERT INTO empresa (nombre, empresaID) VALUES (@nombre, @empresaID); SELECT SCOPE_IDENTITY() AS id;');
        console.log(result);
        
        res.json({
            id: result.recordset[0].id,
            nombre: req.body.nombre,
            empresaID: req.body.empresaID
        });
    } catch (error) {
        console.error('Error en postOneEmpresa:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};


//Actualizacion unica
 export const putOneEmpresa = async (req, res) => {
    try {
        console.log(req.params.id);
        const pool = await getConnection();
        const result = await pool.request()
            .input('nombre', sql.VarChar, req.body.nombre)
            .input('id', sql.Int, req.params.id)
            .query('UPDATE empresa SET nombre = @nombre WHERE empresaID = @id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        return res.json({ message: 'Empresa actualizada' });
    } catch (error) {
        console.error('Error en putOneEmpresa:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}

//Eliminacion Unica
export const deleteOneEmpresa = async (req,res)=>{
    try {
        console.log(req.params.id);
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('DELETE FROM empresa WHERE empresaID = @id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }
        return res.json({ message: 'Empresa eliminada' });
    } catch (error) {
        console.error('Error en deleteOneEmpresa:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}