//Consulta unica
export const getConsumibles =  (req, res) => {
    res.send('Obteniendo consumibles');
}

//Consulta unica
export const getOneConsumible =  (req, res) => {
    res.send('Obteniendo una sola consulta');
}

//Actualizacion unica
export const putOneConsumible = (req, res) => {
    res.send('Actualizando consumible');
}

//Eliminacion unica
export const deleteOneConsumible = (req, res) =>{
    res.send('Eliminado consumible');
}