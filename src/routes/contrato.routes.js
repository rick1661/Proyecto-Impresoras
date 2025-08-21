import {Router} from 'express';
import {getContratos} from '../controllers/contrato.controllers.js';
import {getOneContrato} from '../controllers/contrato.controllers.js';
import {putOneContrato} from '../controllers/contrato.controllers.js';
import {deleteOneContrato} from '../controllers/contrato.controllers.js';

const router = Router();

//Consulta general
router.get('/contrato', getContratos);

//Consulta unica
router.get('/contrato/:id', getOneContrato);

//Actualizacion unica
router.put('/contrato/:id', putOneContrato );

//Eliminacion unica
router.put('/contrato/:id', deleteOneContrato);

export default router;