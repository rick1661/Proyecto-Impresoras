import sql from 'mssql'
import 'dotenv/config';



//"ITTJCDSTEC-17/SQLEXPRESS",
//objeto de conexion
const dbSettings = {
    
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
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

