// src/routes/eventos.routes.js
// Rutas para consultar eventos de auditoría

import { Router } from 'express';
import { getEventosAuditoria, getEstadisticasEventos } from '../controllers/eventos.controllers.js';
import { getEventosSimple, getEstructuraTabla } from '../controllers/eventos-simple.controllers.js';

const router = Router();

// 📋 **Obtener eventos de auditoría**
// GET /api/eventos-auditoria?limit=100&offset=0
router.get('/eventos-auditoria', getEventosAuditoria);

// � **Obtener eventos de auditoría - Versión simple**
// GET /api/eventos-auditoria-simple?limit=100
router.get('/eventos-auditoria-simple', getEventosSimple);

// �📊 **Obtener estadísticas de eventos**
// GET /api/eventos-auditoria/estadisticas?dias=30
router.get('/eventos-auditoria/estadisticas', getEstadisticasEventos);

// 🔍 **Obtener estructura de la tabla**
// GET /api/eventos-estructura
router.get('/eventos-estructura', getEstructuraTabla);

export default router;