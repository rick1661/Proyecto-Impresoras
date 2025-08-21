import {Router} from 'express';

const router = Router();

// Consulta general
router.get('/impresora', (req, res) => {
    res.send('Obteniendo impresoras');
});

//Consulta unica
router.get('/impresora/:serie', (req, res) => {
    res.send('Obteniendo una sola consulta');
});

//Actualizando impresora
router.put('/impresora/:serie', (req, res) => {
    res.send('Actualizando impresora');
});

// eliminacion de impresora
router.delete('/impresora/:serie', (req, res) =>{
    res.send('Eliminado impresora');
});

export default router;