//Funciones metodos de servidor

//Consulta general
export const getEmpresas = (req, res) =>{
    res.send('Obteniendo empresas');
};

//Consulta unica
export const getOneEmpresa = (req,res) => {
    res.send('Obteniendo una sola empresa');
};

//Actualizacion unica
 export const putOneEmpresa = (req, res) => {
    res.send("Actualizando empresa");
}

//Eliminacion Unica
export const deleteOneEmpresa = (req,res)=>{
    res.send('Eliminando empresa');
}