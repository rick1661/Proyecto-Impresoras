//Variables Globales


//Seleccionar elementos del DOM
const modal = document.getElementById('modalForm');
const btn = document.getElementById('agregarBtn');
const span = document.querySelector('.close');
const formulario = document.querySelector('#form');
const TituloH2 = document.querySelector('#TituloH2');

// document.addEventListener('DOMContentLoaded', function() {


// });

//------Eventos onclick------//
btn.onclick = function () {
  modal.style.display = 'block';


  //console.log(btn.textContent);
  switch (btn.textContent.trim()) {
    case 'Agregar impresora':


      console.log("Agregar impresora");

      //Modificamos el titulo del formulario
      TituloH2.textContent = "Agregar impresora";

      //Modificamos la estructura del form para impresora
      formulario.innerHTML = `<input type="text" name="serie" placeholder="Serie" required>
                    <input type="text" name="nombre" placeholder="Nombre" required>
                    <input type="text" name="marca" placeholder="Marca" required>
                    <input type="text" name="modelo" placeholder="Modelo" required>
                    <input type="text" name="direccionIp" placeholder="Dirección IP" required>
                    <label for="area">Área:</label>
                    <select name="area" id="selectArea" required>
                        <option value="n">Selecciona un área</option>
                        <!-- Agrega más opciones según necesites -->
                    </select>
                    <label for="area">contrato:</label>
                    <select name="contrato" id="selectContrato" required>
                        <option value="n">Selecciona un contrato</option>
                        <!-- Agrega más opciones según necesites -->
                    </select>
                    <button type="submit">Guardar</button>`

      // Cargar las áreas y contratos al abrir el modal
      getAreas();
      // Cargar las áreas y contratos al abrir el modal
      getContratos();

      //Seleccionar los inputs para la validación
      const inputSerie = document.querySelector('#form input[name="serie"]');
      const inputNombre = document.querySelector('#form input[name="nombre"]');
      const inputMarca = document.querySelector('#form input[name="marca"]');
      const inputModelo = document.querySelector('#form input[name="modelo"]');
      const inputDireccionIp = document.querySelector('#form input[name="direccionIp"]')
      const selectArea = document.querySelector('#form select[name="area"]');
      const selectContrato = document.querySelector('#form select[name="contrato"]');

      // Asignar eventos

      inputSerie.addEventListener('blur', validacionCampos);
      inputNombre.addEventListener('blur', validacionCampos);
      inputMarca.addEventListener('blur', validacionCampos);
      inputModelo.addEventListener('blur', validacionCampos);
      inputDireccionIp.addEventListener('blur', validacionCampos);
      selectArea.addEventListener('blur', validacionSelect);
      selectContrato.addEventListener('blur', validacionSelect);
      formulario.addEventListener('submit', formularioImpresoraEnvio);

      //Funcione Para enviar datos

      async function formularioImpresoraEnvio(formulario) {

        formulario.preventDefault(); // Evitar el envío del formulario
        // Validar que todos los campos sean correctos antes de enviar
        if (inputSerie.value.trim() === '' || inputNombre.value.trim() === '' || inputMarca.value.trim() === '' || inputModelo.value.trim() === '' || inputDireccionIp.value.trim() === '' || selectArea.value === "n" || selectContrato.value === "n") {
          // Si algún campo no es válido, mostrar un mensaje de error o realizar alguna acción
          alert('Por favor, complete todos los campos correctamente antes de enviar el formulario.');

        } else {
          //console.log(formulario.target.value);
          const datosFormulario = new FormData(formulario.target); // 2. Crear FormData
          console.log(datosFormulario);
          // Convertir FormData a un objeto JavaScript
          const ObjetoDatosDelFormulario = Object.fromEntries(datosFormulario);
          console.log(ObjetoDatosDelFormulario);

          //Convertir el valor de areaID y contratoID a enteros
          ObjetoDatosDelFormulario.area = parseInt(ObjetoDatosDelFormulario.area);
          ObjetoDatosDelFormulario.contrato = parseInt(ObjetoDatosDelFormulario.contrato);



          console.log(ObjetoDatosDelFormulario.area);
          console.log(ObjetoDatosDelFormulario.contrato);


          // Convertir el objeto JavaScript a una cadena JSON
          const jsonString = JSON.stringify(ObjetoDatosDelFormulario);
          console.log(jsonString);


          try {
            const respuesta = await fetch('http://192.168.80.9:3000/impresora/1', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json' // Importante para JSON
              },
              body: jsonString // Convierte el objeto a JSON
              // serie: datosFormulario.get('serie'),
              // nombre: datosFormulario.get('nombre'),
              // marca: datosFormulario.get('marca'),
              // modelo: datosFormulario.get('modelo'),
              // direccionIp: datosFormulario.get('direccionIp'),
              // areaID: datosFormulario.get('area'),
              // contratoID: datosFormulario.get('contrato')
              //})
            });

            if (!respuesta.ok) {
              throw new Error(`Error HTTP: ${respuesta.status}`);
            };
            const resultado = await respuesta.json(); // 5. Procesar la respuesta (ejemplo JSON)
            console.log('Datos enviados exitosamente:', resultado);
            alert('Datos recibidos correctamente.');

            resetImpresoraFormulario();
            //Volver a cargar la tabla de impresoras
            getImpresoras();
          }
          catch (error) {

            console.error('Error al enviar datos:', error);
            alert('Hubo un error al enviar los datos.');
          };


        }

      };

            //Funcion para resetear el formulario
      function resetImpresoraFormulario() {
        inputSerie.value = '';
        inputNombre.value = '';
        inputMarca.value = '';
        inputModelo.value = '';
        inputDireccionIp.value = '';
        selectArea.value = 'n';
        selectContrato.value = 'n';

        //Quitar estilos de error 
        inputSerie.classList.remove('inputError');
        inputNombre.classList.remove('inputError');
        inputMarca.classList.remove('inputError');
        inputModelo.classList.remove('inputError');
        inputDireccionIp.classList.remove('inputError');
        selectArea.classList.remove('selectError');
        selectContrato.classList.remove('selectError');

        //Quitar estilos de OK
        inputSerie.classList.remove('inputOk');
        inputNombre.classList.remove('inputOk');
        inputMarca.classList.remove('inputOk');
        inputModelo.classList.remove('inputOk');
        inputDireccionIp.classList.remove('inputOk');
        selectArea.classList.remove('selectOk');
        selectContrato.classList.remove('selectOk');

      }

      break;
    case 'Agregar consumible':
      // Cargar datos de la impresora seleccionada
      console.log("Agregar consumibles");

      //Modificamos el titulo del formulario
      TituloH2.textContent = "Agregar consumible";
      //Modificanmos la estructura del formulario para Consumible
      formulario.innerHTML = `
                    <input type="text" name="tij" placeholder="TIJ" required>
                    <label for="impresoraID">Impresora:</label>
                    <select name="impresoraID" id="selectImpresora" required>
                        <option value="n">Selecciona una impresora</option>
                        <!-- Agrega más opciones según necesites -->
                    </select>
                    <label for="modelo">Tipo</label>
                    <select name="tipo" id="selectTipo" required>
                        <option value="n">Selecciona un Tipo</option>
                        <!-- Agrega más opciones según necesites -->
                        <option value="Toner">Toner</option>
                        <option value="Tambor">Tambor</option>
                    </select>
                    <label for="modelo">Modelo</label>
                    <select name="modelo" id="selectModelo" required>
                        <option value="n">Selecciona un modelo</option>
                        <!-- Agrega más opciones según necesites -->
                        <option value="w9008">w9008</option>
                        <option value="w1330xc">w1330xc</option>
                        <option value="w1330x">w1330x</option>
                        <option value="cf258xc">cf258xc</option>
                        <option value="cf258x">cf258x</option>
                        <option value="cf280xc">cf280xc</option>
                        <option value="cf280x">cf280x</option>
                        <option value="ce285ac">ce285ac</option>
                        <option value="131a Y">131a Y</option>
                        <option value="131a M">131a M</option>
                        <option value="131a C">131a C</option>
                        <option value="131a K">131a K</option>
                        <option value="ce255xc">ce255xc</option>
                        <option value="976yc Y">976yc Y</option>
                        <option value="976yc M">976yc M</option>
                        <option value="976yc C">976yc C</option>
                        <option value="976yc K">976yc K</option>
                        <option value="w9090mc Y">w9090mc Y</option>
                        <option value="w9090mc M">w9090mc M</option>
                        <option value="w9090mc C">w9090mc C</option>
                        <option value="w9090mc K">w9090mc K</option>
                        <option value="206X Y">206X Y</option>
                        <option value="206X M">206X M</option>
                        <option value="206X C">206X C</option>
                        <option value="206X K">206X K</option>
                        <option value="w132ac">w132ac</option>
                        <option value="cf287jc">cf287jc</option>
                    </select>
                    <button type="submit">Guardar</button>`
      // Cargar las impresoras al abrir el modal
      getImpresoraSelect();

      //Seleccionar los elementos del forms para la validación
      const inputTij = document.querySelector('#form input[name="tij"]');
      const selectImpresora = document.querySelector('#form select[name="impresoraID"]');
      const selectTipo = document.querySelector('#form select[name="tipo"]');
      const selectModelo = document.querySelector('#form select[name="modelo"]');

      // Asignar eventos
      inputTij.addEventListener('blur', validacionCampos);
      selectImpresora.addEventListener('blur', validacionSelect);
      selectTipo.addEventListener('blur', validacionSelect);
      selectModelo.addEventListener('blur', validacionSelect);
      formulario.addEventListener('submit', formularioConsumibleEnvio);

      async function formularioConsumibleEnvio(formulario) {

        formulario.preventDefault(); // Evitar el envío del formulario
        console.log("envio formilario");
        console.log(formulario.target);

        // Validar que todos los campos sean correctos antes de enviar
        if (inputTij.value.trim() === '' || selectImpresora.value === "n" || selectTipo.value === "n" || selectModelo.value === "n") {
          // Si algún campo no es válido, mostrar un mensaje de error o realizar alguna acción
          alert('Por favor, complete todos los campos correctamente antes de enviar el formulario.');

        } else {
          
          const datosFormulario = new FormData(formulario.target); // 2. Crear FormData

          // Convertir FormData a un objeto JavaScript
          const objetoDatosDelFormulario = Object.fromEntries(datosFormulario)
          
          //Convertimos el valor de impresoraID a entero
          objetoDatosDelFormulario.impresoraID = parseInt(objetoDatosDelFormulario.impresoraID);

          const jsonString = JSON.stringify(objetoDatosDelFormulario);
          console.log(jsonString);
        

          try {
            const respuesta = await fetch('http://192.168.80.9:3000/consumible/1', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: jsonString
            });

            if (!respuesta.ok) {
              throw new Error(`Error HTTP: ${respuesta.status}`);
            }
            const resultado = await respuesta.json();
            console.log('Datos enviados exitosamente:', resultado);
            alert('Datos recibidos correctamente.');

            //Volver a cargar la tabla de consumibles
            getConsumibles();
            //resetFormulario();
          } catch (error) {
            console.error('Error al enviar datos:', error);
            alert('Hubo un error al enviar los datos.');
          }
        }

        resetConsumibleFormulario();

      }

      //Funcion para resetear el formulario
      function resetConsumibleFormulario() {
        inputTij.value = '';
        selectImpresora.value = 'n';
        selectTipo.value = 'n';
        selectModelo.value = 'n';

        //Quitar estilos de error 
        inputTij.classList.remove('inputError');
        selectImpresora.classList.remove('selectError');
        selectTipo.classList.remove('selectError');
        selectModelo.classList.remove('selectError');
   
        //Quitar estilos de OK
        inputTij.classList.remove('inputOk');
        selectImpresora.classList.remove('selectOk');
        selectTipo.classList.remove('selectOk');
        selectModelo.classList.remove('selectOk');
      }

      break;
  }


}
span.onclick = function () {
  modal.style.display = 'none';
}

// Quita el formulario dandole click a cualquier parte fuera de la ventana
// window.onclick = function (event) {
//   if (event.target == modal) {
//     modal.style.display = 'none';

//   }
// }

//----------------------------------------------Funciones---------------------------------------------//

//Consltar Impresoras
function getImpresoraSelect() {
  fetch('http://192.168.80.9:3000/impresora')
    .then(response => response.json()) // Convierte la respuesta a JSON
    .then(data => { // en data se guardan la información de la consulta
      console.log(data);
      const select = document.querySelector('#selectImpresora');
      data.forEach(impresora => {
        const option = document.createElement('option');
        option.value = impresora.impresoraID;
        option.textContent = `${impresora.nombre[0]} - ${impresora.serie}`;
        select.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error al cargar impresoras:', error);
    });
}


//Consultar Areas
function getAreas() {
  fetch('http://192.168.80.9:3000/area')
    .then(response => response.json()) // Convierte la respuesta a JSON
    .then(data => { // en data se guardan la información de la consulta
      console.log(data);
      const select = document.querySelector('#selectArea');
      data.forEach(area => {
        const option = document.createElement('option');
        option.value = area.areaID;
        option.textContent = area.nombre;
        select.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error al cargar Areas:', error);
    });
}

//Consultar contratos

function getContratos() {
  fetch('http://192.168.80.9:3000/contrato')
    .then(response => response.json()) // Convierte la respuesta a JSON
    .then(data => { // en data se guardan la información de la consulta
      console.log(data);
      const select = document.querySelector('#selectContrato');
      data.forEach(contrato => {
        const option = document.createElement('option');
        option.value = contrato.contratoID;
        option.textContent = contrato.nombre;
        select.appendChild(option);
      });

    })
    .catch(error => {
      console.error('Error al cargar Contratos:', error);
    });
}




//Funcion para validar los Input

function validacionCampos(input) {

  // Validar campos requeridos
  if (input.target.value.trim() === '') {
    input.target.placeholder = (`Ingrese ${input.target.name}`);
    input.target.classList.remove('inputOk');
    input.target.classList.add('inputError');
  } else {
    input.target.classList.add('inputOk');
  }
}

//Funciona para validar los Select
function validacionSelect(select) {
  //console.log(select.target);
  //console.log(select.target.value);
  if (select.target.value === "n") {
    select.target.classList.remove('selectOk');
    select.target.classList.add('selectError');

  } else {

    select.target.classList.add('selectOk');
  }
}








