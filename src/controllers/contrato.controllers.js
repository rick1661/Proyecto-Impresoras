//consulta contratos
export const getContratos = (req, res) => {
    res.send('Obteniendo contratos');
};

//Consulta unica
export const getOneContrato = (req, res) => {
    res.send('Obteniendo una sola consulta');
};

//Actualizacion umica
export const putOneContrato = (req, res) =>{
    res.send('Actualizando contrato');
};

//Eliminacion unica
export const deleteOneContrato =(req, res) =>{
    res.send('Eliminando contrato');
}
