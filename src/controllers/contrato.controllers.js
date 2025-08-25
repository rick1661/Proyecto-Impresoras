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
    const result = await pool.request().query()
    res.send('Obteniendo una sola consulta');
};

//Creacion unica
export const postOneContrato = (req, res) =>{
    res.send('Creando contrato');
}

//Actualizacion unica
export const putOneContrato = (req, res) =>{
    res.send('Actualizando contrato');
};

//Eliminacion unica
export const deleteOneContrato =(req, res) =>{
    res.send('Eliminando contrato');
}
