import sql from 'mssql'
import 'dotenv/config';


//"ITTJCDSTEC-17/SQLEXPRESS",
//objeto de conexion
const dbSettings = {

    user:"sa" ,//process.env.DB_USER,
    password:"Hidden*2030" ,//process.env.DB_PASSWORD,
    server:"192.168.80.9/SQLEXPRESS" ,//process.env.DB_HOST,
    database:"ImpresorasBD" ,//process.env.DB_NAME,
    dialect: "mssql",
    port: 1433,
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

