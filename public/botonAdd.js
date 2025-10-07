//Variables Globales

//const e = require("cors");

//Seleccionar elementos del DOM
const modal = document.getElementById('modalForm');
const btn = document.getElementById('agregarBtn');
const span = document.querySelector('.close');
const formulario = document.querySelector('#form');
const TituloH2 = document.querySelector('#TituloH2');
const selectImpresora = document.querySelector('#selectImpresora');
const root = document.documentElement; // root css

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
                    <select name="area" class="js-example-basic-single" id="selectArea" required>
                        <option value="n">Selecciona un área</option>
                        <!-- Agrega más opciones según necesites -->
                    </select>
                    <label for="area">contrato:</label>
                    <select name="contrato" class="js-example-basic-single" id="selectContrato" required>
                        <option value="n">Selecciona un contrato</option>
                        <!-- Agrega más opciones según necesites -->
                    </select>
                    <button id="btnGuardar" type="submit">Guardar</button>`

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
      //const btnGuardar = document.querySelector('#btnGuardar');

      // Asignar eventos

      inputSerie.addEventListener('blur', validacionCampos);
      inputNombre.addEventListener('blur', validacionCampos);
      inputMarca.addEventListener('blur', validacionCampos);
      inputModelo.addEventListener('blur', validacionCampos);
      inputDireccionIp.addEventListener('blur', validacionCampos);
      selectArea.addEventListener('blur', validacionSelect);
      selectContrato.addEventListener('blur', validacionSelect);


      //Validar Select 2 en tiempo real

      // $('#selectArea').on('select2:close', function (e) {
      //   // Tu código para validar o ejecutar alguna acción aquí
      //   // console.log('Select2 se cerró');
      //   // if (selectArea.value === "n") {

      //   //   root.style.setProperty('--BordeSelect2', 'red');
      //   // }
      // });

      //Llamar a la función para enviar el formulario

      formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log(e.target);
        const esvalido = validarFormulario(e.target);
        if (!esvalido) {
          alert('Por favor, complete todos los campos correctamente antes de enviar el formulario.');
        } else {
          formularioImpresoraEnvio(e.target)
        }
      });



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
                    <select  name="impresoraID" class="js-example-basic-single" id="selectImpresora"  required>
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
                        <option value="W9008MC">W9008MC</option>
                        <option value="W1330XCc">W1330XC</option>
                        <option value="W1330X">W1330X</option>
                        <option value="CF258XC">CF258XC</option>
                        <option value="CF258X">CF258X</option>
                        <option value="CF280XC">CF280XC</option>
                        <option value="CF280X">CF280X</option>
                        <option value="CE285AC">CE285AC</option>
                        <option value="131A Y">131A Y</option>
                        <option value="131A M">131A M</option>
                        <option value="131A C">131A C</option>
                        <option value="131A K">131A K</option>
                        <option value="CE255XC">CE255XC</option>
                        <option value="976YC Y">976YC Y</option>
                        <option value="976YC M">976YC M</option>
                        <option value="976YC C">976YC C</option>
                        <option value="976YC K">976YC K</option>
                        <option value="W9090MC Y">W9090MC Y</option>
                        <option value="W9090MC M">W9090MC M</option>
                        <option value="W9090MC C">W9090MC C</option>
                        <option value="W9090MC K">W9090MC K</option>
                        <option value="206X Y">206X Y</option>
                        <option value="206X M">206X M</option>
                        <option value="206X C">206X C</option>
                        <option value="206X K">206X K</option>
                        <option value="W132AC">W132AC</option>
                        <option value="CF287JC">CF287JC</option>
                    </select>
                    <button type="submit">Guardar</button>`
      // Cargar las impresoras al abrir el modal
      getImpresoraSelect();

      //Seleccionar los elementos del forms para la validación
      const inputTij = document.querySelector('#form input[name="tij"]');
      const selectImpresora = document.querySelector('#selectImpresora');
      const selectTipo = document.querySelector('#form select[name="tipo"]');
      const selectModelo = document.querySelector('#form select[name="modelo"]');
      // const select2 = document.querySelector('.select2-container--default');


      // Asignar eventos para validar los input y select en tiempo real
      inputTij.addEventListener('blur', validacionCampos);
      //selectImpresora.addEventListener('blur', validacionSelect); este ya no funciona por el select2
      selectTipo.addEventListener('blur', validacionSelect);
      selectModelo.addEventListener('blur', validacionSelect);


      // //funcion para validar el select2 en tiempo real
      // $('#selectImpresora').on('select2:close', function (e) {
      //   // Tu código para validar o ejecutar alguna acción aquí
      //   console.log('Select2 se cerró');
      //   if (selectImpresora.value === "n") {


      //     root.style.setProperty('--BordeSelect2', 'red');
      //   }
      // });

      // Validar que todos los campos sean correctos antes de enviar

      formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log(e.target);
        const esvalido = validarFormulario(e.target);
        if (!esvalido) {
          alert('Por favor, complete todos los campos correctamente antes de enviar el formulario.');
        } else {
          formularioConsumibleEnvio(e.target)
        }
      });
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

  fetch('https://192.168.80.180:5500/impresora')
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

  //  //asignamos la propiedad select2

  $('#selectImpresora').select2();

}


//Consultar Areas
function getAreas() {
  fetch('https://192.168.80.180:5500/area')
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
  //  //asignamos la propiedad select2
  $('#selectArea').select2();
}
//Consultar contratos

function getContratos() {
  fetch('https://192.168.80.180:5500/contrato')
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

  $('#selectContrato').select2();
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
  console.log(select.target);
  console.log(select.target.value);
  if (select.target.value === "n") {
    select.target.classList.remove('selectOk');
    select.target.classList.add('selectError');

  } else {

    select.target.classList.add('selectOk');
  }
}

//Funcion para validar formulario
function validarFormulario(formulario) {
  let valido = true;
  const elementos = formulario.querySelectorAll('input, select');
  elementos.forEach(elemento => {
    if (elemento.type === 'text' && elemento.value.trim() === '') {
      valido = false;
    }
    if (elemento.tagName === 'SELECT' && elemento.value === 'n') {
      valido = false;
    }
  });
  return valido;
}


//Funcione Para enviar datos

async function formularioImpresoraEnvio(formulario) {
  console.log(formulario);
  //preventDefault(); // Evitar el envío del formulario
  // Validar que todos los campos sean correctos antes de enviar

  //console.log(formulario.target.value);
  const datosFormulario = new FormData(formulario); // 2. Crear FormData
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
    const respuesta = await fetch('https://192.168.80.180:5500/impresora/1', {
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
      throw new Error(`Error https: ${respuesta.status}`);
    };
    const resultado = await respuesta.json(); // 5. Procesar la respuesta (ejemplo JSON)
    console.log('Datos enviados exitosamente:', resultado);
    alert('Datos recibidos correctamente.');

    resetFormulario(formulario);
    //Volver a cargar la tabla de impresoras
    getImpresoras();
  }
  catch (error) {
    console.error('Error al enviar datos:', error);
    alert('Hubo un error al enviar los datos.');
  };

}




//función para enviar el formulario de consumible
async function formularioConsumibleEnvio(formulario) {


  const datosFormulario = new FormData(formulario); // 2. Crear FormData

  // Convertir FormData a un objeto JavaScript
  const objetoDatosDelFormulario = Object.fromEntries(datosFormulario)

  //Convertimos el valor de impresoraID a entero
  objetoDatosDelFormulario.impresoraID = parseInt(objetoDatosDelFormulario.impresoraID);

  // Agregamos el prefijo 'TIJ ' al campo tij si no lo tiene ya
  if (objetoDatosDelFormulario.tij && !objetoDatosDelFormulario.tij.startsWith('TIJ')) {
    objetoDatosDelFormulario.tij = `TIJ${objetoDatosDelFormulario.tij}`;
  }

  const jsonString = JSON.stringify(objetoDatosDelFormulario);
  console.log(jsonString);


  try {
    const respuesta = await fetch('https://192.168.80.180:5500/consumible/1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonString
    });

    // if (!respuesta.ok) {
    //   throw new Error(`Error https: ${respuesta.status}`);
    // }
    const resultado = await respuesta.json();
    console.log('Datos enviados exitosamente:', resultado);
    alert('Datos recibidos correctamente.');

    //Volver a cargar la tabla de consumibles
    getConsumibles();
    resetFormulario(formulario);
  } catch (error) {
    console.error('Error al enviar datos:', error);
    alert('Hubo un error al enviar los datos.');
  }
}

function resetFormulario(e) {
  console.log(e);
  //resetea los campos del formulario
  e.reset();

  // Quitar la clase inputError de todos los inputs y selects
  const elementos = e.querySelectorAll('input, select');
  elementos.forEach(elemento => {
    elemento.classList.remove('inputError');
    elemento.classList.remove('inputOk');
    if (elemento.tagName === 'SELECT' && elemento.name === "area") {
      $('#selectArea').val('n').trigger('change');
    }
    if (elemento.tagName === 'SELECT' && elemento.name === "contrato") {
      $('#selectContrato').val('n').trigger('change');
    }
    if (elemento.tagName === 'SELECT' && elemento.name === "impresoraID") {
      $('#selectImpresora').val('n').trigger('change');
    }
  });
}



//----------------------------------------------Fin funciones---------------------------------------------//


