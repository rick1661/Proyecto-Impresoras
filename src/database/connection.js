import sql from 'mssql'
import 'dotenv/config';

// Exportar sql para que pueda ser usado en los controladores
export { sql };



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

// Pool de conexiones global
let pool = null;

// Funcion de conexion
export const getConnection = async () => {
    try {
        if (!pool) {
            pool = new sql.ConnectionPool(dbSettings);
            await pool.connect();
            
            // Manejar eventos del pool
            pool.on('error', err => {
                console.error('Database pool error:', err);
                pool = null;
            });
        }
        return pool;
    } catch (error) {
        console.error('Error connecting to database:', error);
        pool = null;
        throw error;
    }
}

// Función para cerrar el pool cuando sea necesario
export const closeConnection = async () => {
    if (pool) {
        await pool.close();
        pool = null;
    }
}

