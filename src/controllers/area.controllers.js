//Consulta general
export const getAreas = (req, res) => {
    res.send('Obteniendo areas');
}

//Consulta unica
export const getOneArea = (req, res) => {
    res.send('Obteniendo una sola area');
}

//Actualizacion unica
export const putOneArea = (req, res) => {
    res.send('Actualizando area');
}

//Eliminacion unica
export const deleteOneArea =  (req, res) =>{
    res.send('Eliminado area');
}



