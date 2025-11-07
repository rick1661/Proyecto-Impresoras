// src/controllers/eventos-simple.controllers.js
// Controlador simplificado para eventos que funciona con cualquier estructura

import { getConnection } from '../database/connection.js';
import sql from 'mssql';

/**
 * Obtener eventos de auditoría - Versión simplificada
 * GET /api/eventos-auditoria-simple
 */
export const getEventosSimple = async (req, res) => {
    try {
        const { limit = 100 } = req.query;

        const pool = await getConnection();
        
        // Query optimizado para la estructura real
        const result = await pool.request()
            .input('limit', sql.Int, parseInt(limit))
            .query(`
                SELECT TOP (@limit)
                    AuditoriaID,
                    Tipo,
                    Recurso,
                    RecursoId,
                    UsuarioId,
                    UsuarioNombre,
                    Detalles,
                    IP,
                    UserAgent,
                    RequestId,
                    Resultado,
                    CreadoEn
                FROM dbo.EventosAuditoria 
                ORDER BY CreadoEn DESC
            `);

        // Agregar compatibilidad con el frontend
        const eventos = result.recordset.map(evento => ({
            ...evento,
            FechaHora: evento.CreadoEn // Mapear para compatibilidad
        }));

        console.log(`✅ ${eventos.length} eventos obtenidos (simple)`);
        
        res.json({
            success: true,
            eventos: eventos,
            total: eventos.length
        });
        
    } catch (err) {
        console.error('❌ Error getEventosSimple:', err);
        res.status(500).json({ 
            error: 'Error obteniendo eventos de auditoría',
            details: err.message 
        });
    }
};

/**
 * Obtener estructura de la tabla
 * GET /api/eventos-estructura
 */
export const getEstructuraTabla = async (req, res) => {
    try {
        const pool = await getConnection();
        
        const result = await pool.request()
            .query(`
                SELECT 
                    COLUMN_NAME,
                    DATA_TYPE,
                    IS_NULLABLE,
                    CHARACTER_MAXIMUM_LENGTH
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = 'EventosAuditoria'
                ORDER BY ORDINAL_POSITION
            `);

        res.json({
            tabla: 'EventosAuditoria',
            columnas: result.recordset
        });
        
    } catch (err) {
        console.error('Error getEstructuraTabla:', err);
        res.status(500).json({ 
            error: 'Error obteniendo estructura de tabla',
            details: err.message 
        });
    }
};