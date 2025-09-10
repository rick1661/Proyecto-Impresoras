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


////////////////////////////////

      // const inputSerie = elementosTd[0].firstElementChild.value;
      // const inputNombre = elementosTd[1].firstElementChild.value;
      // const inputMarca = elementosTd[2].firstElementChild.value;
      // const inputModelo = elementosTd[3].firstElementChild.value;
      // const inputIp = elementosTd[4].firstElementChild.value;
      // const selectArea = elementosTd[5].firstElementChild.value;
      // const selectContrato = elementosTd[6].firstElementChild.value;



      // if (inputSerie.trim() === '' || inputNombre.trim() === '' || inputMarca.trim() === '' || inputModelo.trim() === '' || inputIp.trim() === '' || selectArea === 'n' || selectContrato === '') {

      //   elementosTd.forEach(elemento => {
      //     if (elemento.firstElementChild.value.trim() === '') {
      //       elemento.firstElementChild.style.border = '2px solid red';
      //     } else {
      //       elemento.firstElementChild.style.border = '1px solid #ccc';
      //     }
      //   });
       


      // } else {