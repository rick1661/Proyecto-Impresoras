import {Router} from 'express';
import {getTonerNegro} from '../controllers/toner.controllers.js'; 
import {getTonersColor} from '../controllers/toner.controllers.js';
import {getTonerScraping } from '../controllers/toner.controllers.js';  

const router = Router();

//General
router.get('/tonerNegro/:ip', getTonerNegro);

router.get('/tonersColor/:ip', getTonersColor);

router.get('/tonerScraping/:ip', getTonerScraping );

export default router;