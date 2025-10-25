import {Router} from 'express';
import {getTonerNegro} from '../controllers/toner.controllers.js'; 
import {getTonersColor} from '../controllers/toner.controllers.js';
import {getTonerScraping } from '../controllers/toner.controllers.js';  
import rateLimit from 'express-rate-limit';

// Importar middleware y esquemas de validación
import { validateParams } from '../middleware/validation.js';
import { 
    tonerIpParamsSchema, 
    tonerIpStrictParamsSchema 
} from '../middleware/schemas/toner.schema.js';

// Configura el límite: máximo 30 peticiones por minuto por IP
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 200, // máximo 200 peticiones
  message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
});

const router = Router();

//Tóner negro - SNMP (validación estricta sin puerto)
router.get('/tonerNegro/:ip', 
    validateParams(tonerIpStrictParamsSchema),  // Valida IP sin puerto
    limiter, 
    getTonerNegro
);

//Tóner color - SNMP (validación estricta sin puerto)
router.get('/tonersColor/:ip', 
    validateParams(tonerIpStrictParamsSchema),  // Valida IP sin puerto
    limiter, 
    getTonersColor
);

//Tóner scraping - Web (validación flexible con puerto opcional)
router.get('/tonerScraping/:ip', 
    validateParams(tonerIpParamsSchema),  // Valida IP con puerto opcional
    limiter, 
    getTonerScraping 
);

export default router;