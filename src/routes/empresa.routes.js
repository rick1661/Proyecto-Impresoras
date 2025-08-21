import {Router} from 'express';

const router = Router();

// Consulta general
router.get('/empresa', (req, res) =>{
    res.send('Obteniendo empresas');
});

//Consulta unica
router.get('/empres:id', (req,res) => {

    res.send('Obteniendo una sola empresa')

});

//Actualizando impresora
router.put('/empresa:id', (req, res) => {
    res.send("Actualizando empresa");
});

//Eliminacion de impresora
router.delete('/empresa/:id', (req,res)=>{
    res.send('Eliminando empresa');
});

export default router;

