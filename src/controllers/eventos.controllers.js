// src/controllers/eventos.controllers.js
// Controlador para obtener eventos de auditoría desde la tabla EventosAuditoria

import { getConnection } from '../database/connection.js';
import sql from 'mssql';

/**
 * Obtener eventos de auditoría
 * GET /api/eventos-auditoria
 */
export const getEventosAuditoria = async (req, res) => {
    try {
        const { limit = 100, offset = 0 } = req.query;

        const pool = await getConnection();
        
        // Query optimizado para la estructura real de EventosAuditoria
        const query = `
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
        `;
        
        console.log('🔍 Obteniendo eventos de auditoría...');

        const result = await pool.request()
            .input('limit', sql.Int, parseInt(limit))
            .query(query);

        // Normalizar los datos para que el frontend los entienda
        const eventosNormalizados = result.recordset.map(evento => ({
            AuditoriaID: evento.AuditoriaID,
            Tipo: evento.Tipo || 'UNKNOWN',
            Recurso: evento.Recurso || 'unknown',
            RecursoId: evento.RecursoId || null,
            UsuarioId: evento.UsuarioId || null,
            UsuarioNombre: evento.UsuarioNombre || 'Sistema',
            Detalles: evento.Detalles || null,
            IP: evento.IP || null,
            UserAgent: evento.UserAgent || null,
            RequestId: evento.RequestId || null,
            Resultado: evento.Resultado || 'UNKNOWN',
            FechaHora: evento.CreadoEn, // Mapear CreadoEn a FechaHora para compatibilidad frontend
            CreadoEn: evento.CreadoEn
        }));

        console.log(`✅ ${eventosNormalizados.length} eventos de auditoría obtenidos`);
        res.json(eventosNormalizados);
        
    } catch (err) {
        console.error('❌ Error getEventosAuditoria:', err);
        res.status(500).json({ 
            error: 'Error obteniendo eventos de auditoría',
            details: err.message 
        });
    }
};

/**
 * Obtener estadísticas de eventos
 * GET /api/eventos-auditoria/estadisticas
 */
export const getEstadisticasEventos = async (req, res) => {
    try {
        const { dias = 30 } = req.query;
        
        const pool = await getConnection();
        
        // Query optimizado para estadísticas usando CreadoEn
        const query = `
            SELECT 
                Tipo,
                Recurso,
                COUNT(*) as TotalEventos,
                COUNT(CASE WHEN Resultado = 'SUCCESS' THEN 1 END) as Exitosos,
                COUNT(CASE WHEN Resultado != 'SUCCESS' THEN 1 END) as Fallidos
            FROM dbo.EventosAuditoria
            WHERE CreadoEn >= DATEADD(day, -@dias, GETDATE())
            GROUP BY Tipo, Recurso 
            ORDER BY TotalEventos DESC
        `;
        
        const result = await pool.request()
            .input('dias', sql.Int, parseInt(dias))
            .query(query);

        console.log(`📊 Estadísticas obtenidas para los últimos ${dias} días`);
        
        res.json({
            periodoConsultado: `Últimos ${dias} días`,
            estadisticas: result.recordset
        });
        
    } catch (err) {
        console.error('❌ Error getEstadisticasEventos:', err);
        res.status(500).json({ 
            error: 'Error obteniendo estadísticas de eventos',
            details: err.message 
        });
    }
};