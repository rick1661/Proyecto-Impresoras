
import sql from 'mssql'
//"ITTJCDSTEC-17/SQLEXPRESS",
//objeto de conexion
const dbSettings = {

    user:"sa",
    password:"Hidden*2030",
    server:"localhost",
    database:"ImpresorasBD",
    dialect: "mssql",
    //port: 1433,
    options:{
        encrypt: true, // Usar cifrado si es necesario
        trustServerCertificate: true // Opcional, para evitar problemas de certificado en desarrollo
    }
}

// Funcion de conexion

export const getConnection = async () =>{

    try{

        const pool = await sql.connect(dbSettings);
        return pool;

    }catch (error){

        console.error(error);
    }

}

