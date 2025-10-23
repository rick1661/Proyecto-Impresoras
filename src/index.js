import app from './app.js';
import {getConnection, closeConnection} from "./database/connection.js";

// Inicializar conexión a la base de datos
getConnection();

// Manejo de cierre limpio de la aplicación
process.on('SIGINT', async () => {
    console.log('Cerrando aplicación...');
    try {
        await closeConnection();
        console.log('Conexiones de base de datos cerradas');
        process.exit(0);
    } catch (error) {
        console.error('Error al cerrar conexiones:', error);
        process.exit(1);
    }
});

process.on('SIGTERM', async () => {
    console.log('Señal SIGTERM recibida, cerrando aplicación...');
    try {
        await closeConnection();
        console.log('Conexiones de base de datos cerradas');
        process.exit(0);
    } catch (error) {
        console.error('Error al cerrar conexiones:', error);
        process.exit(1);
    }
});

// Manejo de errores no capturados
process.on('uncaughtException', async (error) => {
    console.error('Error no capturado:', error);
    try {
        await closeConnection();
    } catch (closeError) {
        console.error('Error al cerrar conexiones:', closeError);
    }
    process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
    console.error('Promesa rechazada no manejada:', reason);
    try {
        await closeConnection();
    } catch (closeError) {
        console.error('Error al cerrar conexiones:', closeError);
    }
    process.exit(1);
});
  