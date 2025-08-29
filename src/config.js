// export const postOneImpresora = async (req, res) => {

//     console.log('llegamos aqui');
//     const pool = await getConnection();
//     const result = await pool.request().query(`INSERT INTO impresora (serie, nombre, marca, modelo, direccionIp, areaID, contratoID) VALUES ('${req.body.serie}', '${req.body.nombre}', '${req.body.marca}', '${req.body.modelo}', '${req.body.direccionIP}', ${req.body.areaID}, ${req.body.contratoID}); SELECT SCOPE_IDENTITY() AS id;`);
//     console.log(result);
//     res.json({
//         id: result.recordset[0].id,
//         serie: req.body.serie,
//         nombre: req.body.nombre,
//         marca: req.body.marca,
//         modelo: req.body.modelo,
//         direccionIP: req.body.direccionIP,
//         areaID: req.body.areaID,
//         contratoID: req.body.contratoID
//     })
    
// }
