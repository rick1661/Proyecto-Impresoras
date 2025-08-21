//Funciones para los metodos get y put

//Consulta general
export const getImpresoras = (req, res) => {
    res.send('Obteniendo impresoras');
}

//Consulta unica
export const getOneImpresora = (req, res) => {
    res.send('Obteniendo una sola consulta');
}

//Creacion unica
export const postOneImpresora = (req, res) => {
    res.send('Creando impresora');
}

//Actualizacion unica
export const putOneimpresora = (req, res) => {
    res.send('Actualizando impresora');
}

//Eliminacion unica
export const deleteOneimpresora =(req, res) =>{
    res.send('Eliminado impresora');
}