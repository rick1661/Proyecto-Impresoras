import {Router} from 'express';
import {getEmpresas} from '../controllers/empresa.controllers.js';
import {getOneEmpresa} from '../controllers/empresa.controllers.js';
import {postOneEmpresa} from '../controllers/empresa.controllers.js';
import {putOneEmpresa} from '../controllers/empresa.controllers.js';
import {deleteOneEmpresa} from '../controllers/empresa.controllers.js';

const router = Router();

// Consulta general
router.get('/empresa', getEmpresas);

//Consulta unica
router.get('/empresa/:id', getOneEmpresa);

//Creacion unica
router.post('/empresa/:id', postOneEmpresa);

//Actualizando impresora
router.put('/empresa/:id', putOneEmpresa);

//Eliminacion de impresora
router.delete('/empresa/:id', deleteOneEmpresa  );

export default router;

