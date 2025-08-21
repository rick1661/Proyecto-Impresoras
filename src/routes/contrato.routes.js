import {Router} from 'express';
import {getContratos} from '../controllers/contrato.controllers.js';
import {getOneContrato} from '../controllers/contrato.controllers.js';
import {postOneContrato} from '../controllers/contrato.controllers.js';
import {putOneContrato} from '../controllers/contrato.controllers.js';
import {deleteOneContrato} from '../controllers/contrato.controllers.js';

const router = Router();

//Consulta general
router.get('/contrato', getContratos);

//Consulta unica
router.get('/contrato/:id', getOneContrato);

//Creacion unica
router.post('/contrato/:id', postOneContrato);

//Actualizacion unica
router.put('/contrato/:id', putOneContrato );

//Eliminacion unica
router.delete('/contrato/:id', deleteOneContrato);

export default router;