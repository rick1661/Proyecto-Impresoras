//Seleccionar elementos del DOM
const modal = document.getElementById('modalForm');
const btn = document.getElementsByClassName('addImpresoraBtn')[0];
const span = document.querySelector('.close');
const inputSerie = document.querySelector('#formImpresora input[name="serie"]');
const inputNombre = document.querySelector('#formImpresora input[name="nombre"]');
const inputMarca = document.querySelector('#formImpresora input[name="marca"]');
const inputModelo = document.querySelector('#formImpresora input[name="modelo"]');
const inputDireccionIp = document.querySelector('#formImpresora input[name="direccionIp"]')
const selectArea = document.querySelector('#formImpresora select[name="area"]');
const selectContrato = document.querySelector('#formImpresora select[name="contrato"]');
const formulario = document.getElementById('formImpresora');

//------Eventos onclick------//
btn.onclick = function () {
  modal.style.display = 'block';

  // Cargar las áreas y contratos al abrir el modal
  getAreas();
  // Cargar las áreas y contratos al abrir el modal
  getContratos();
  //console.log(inputSerie);
  // Asignar eventos
  inputSerie.value = '';
  inputNombre.value = '';
  inputMarca.value = '';
  inputModelo.value = '';
  inputDireccionIp.value = '';
  inputSerie.addEventListener('blur', validacionCampos);
  inputNombre.addEventListener('blur', validacionCampos);
  inputMarca.addEventListener('blur', validacionCampos);
  inputModelo.addEventListener('blur', validacionCampos);
  inputDireccionIp.addEventListener('blur', validacionCampos);
  selectArea.addEventListener('blur', validacionSelect);
  selectContrato.addEventListener('blur', validacionSelect);
  formulario.addEventListener('submit', formularioEnvio);

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

  //Limpiar los select
  selectArea.value = "n";
  selectContrato.value = "n";

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
function getAreas() {
  fetch('http://localhost:3000/area')
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
      // <option value="oficina">Oficina</option>

      //Eliminar opciones previas
      // while(select.firstChild) {
      //      contenedorCarrito.removeChild(contenedorCarrito.firstChild);
      // }

    })
    .catch(error => {
      console.error('Error al cargar Areas:', error);
    });
}

function getContratos() {
  fetch('http://localhost:3000/contrato')
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
      // <option value="oficina">Oficina</option>

      //Eliminar opciones previas
      // while(select.firstChild) {
      //      contenedorCarrito.removeChild(contenedorCarrito.firstChild);
      // }

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


//Funcion Para enviar datos

async function formularioEnvio(formulario) {

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
    const ObjetodatosDelFormulario = Object.fromEntries(datosFormulario);
    console.log(ObjetodatosDelFormulario);

    // Convertir el objeto JavaScript a una cadena JSON
    const jsonString = JSON.stringify(ObjetodatosDelFormulario);
    console.log(jsonString);
   

    try {
      const respuesta = await fetch('http://localhost:3000/impresora/1', {
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
      resetFormulario();
    }
    catch (error) {

      console.error('Error al enviar datos:', error);
      alert('Hubo un error al enviar los datos.');
    };


  }

};


function resetFormulario() {
  inputSerie.value = '';
  inputNombre.value = '';
  inputMarca.value = '';
  inputModelo.value = '';
  inputDireccionIp.value = '';
  selectArea.value = 'n';
  selectContrato.value = 'n';

}