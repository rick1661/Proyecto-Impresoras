import {Router} from 'express';
import {getTonerNegro} from '../controllers/toner.controllers.js'; 
import {getTonersColor} from '../controllers/toner.controllers.js';
import {getTonerScraping } from '../controllers/toner.controllers.js';  
import rateLimit from 'express-rate-limit';

// Configura el límite: máximo 30 peticiones por minuto por IP
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 86, // máximo 86 peticiones
  message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
});

const router = Router();

//General
router.get('/tonerNegro/:ip', limiter, getTonerNegro);

router.get('/tonersColor/:ip', limiter, getTonersColor);

router.get('/tonerScraping/:ip', limiter, getTonerScraping );

export default router;