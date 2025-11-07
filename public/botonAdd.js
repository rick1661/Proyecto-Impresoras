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

//Seleccionar los inputs para la validación
const inputSerie = document.querySelector('#form input[name="serie"]');
const inputNombre = document.querySelector('#form input[name="nombre"]');
const inputMarca = document.querySelector('#form input[name="marca"]');
const inputModelo = document.querySelector('#form input[name="modelo"]');
const inputDireccionIp = document.querySelector('#form input[name="direccionIp"]')
const selectArea = document.querySelector('#form select[name="area"]');
const selectContrato = document.querySelector('#form select[name="contrato"]');
const selectToner = document.querySelector('#form select[name="toner"]');
//const btnGuardar = document.querySelector('#btnGuardar');

let tipoFormulario = null;

// Asignar eventos

inputSerie.addEventListener('blur', validacionCampos);
inputNombre.addEventListener('blur', validacionCampos);
inputMarca.addEventListener('blur', validacionCampos);
inputModelo.addEventListener('blur', validacionCampos);
inputDireccionIp.addEventListener('blur', validacionCampos);
selectArea.addEventListener('blur', validacionSelect);
selectContrato.addEventListener('blur', validacionSelect);
selectToner.addEventListener('blur', validacionSelect);

//------Eventos onclick------//
btn.onclick = function () {
  // 🎨 Mostrar modal con animación suave
  showModalWithAnimation();

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
                    <label for="area">Contrato:</label>
                    <select name="contrato" class="js-example-basic-single" id="selectContrato" required>
                        <option value="n">Selecciona un contrato</option>
                        <!-- Agrega más opciones según necesites -->
                    </select>
                    <label for="toner">Toner:</label>
                      <select name="toner" id="selectToner" required>
                        <option value="n">Selecciona un tóner</option>
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
                        <option value="W1332AC">W1332AC</option>
                        <option value="CF287XC">CF287XC</option>
                        <option value="CF287JC">CF287JC</option>
                        <option value="CF226X">CF226X</option>
                        <option value="CF226JC">CF226JC</option>
                    </select>
                    <button id="btnGuardar" type="submit">Guardar</button>`

      // Cargar las áreas y contratos al abrir el modal
      getAreas();
      // Cargar las áreas y contratos al abrir el modal
      getContratos();

      //Llamar a la función para enviar el formulario
      tipoFormulario = 'impresora';

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
                        <option value="W1332AC">W1332AC</option>
                        <option value="CF287XC">CF287XC</option>
                        <option value="CF287JC">CF287JC</option>
                        <option value="CF226X">CF226X</option>
                        <option value="CF226JC">CF226JC</option>
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
      
      tipoFormulario = 'consumible';
    
      break;
  }

}

formulario.addEventListener('submit', (e) => {
  e.preventDefault();
  const esvalido = validarFormulario(e.target);
  if (!esvalido) {
    alert('Por favor, complete todos los campos correctamente antes de enviar el formulario.');
    return;
  }
  if (tipoFormulario === 'impresora') {
    formularioImpresoraEnvio(e.target);
  } else if (tipoFormulario === 'consumible') {
    formularioConsumibleEnvio(e.target);
  }
});


span.onclick = function () {
  // 🎨 Cerrar modal con animación suave
  hideModalWithAnimation();
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

  fetch(buildApiUrl('/impresora'))
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
  fetch(buildApiUrl('/area'))
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
  fetch(buildApiUrl('/contrato'))
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

  // 🔧 Convertir nombres de campos del frontend al formato esperado por el backend
  // El frontend usa 'area' y 'contrato', pero el backend espera 'areaID' y 'contratoID'
  
  // 🔧 Normalizar modelo para que coincida con la base de datos
  let modeloNormalizado = ObjetoDatosDelFormulario.modelo.trim();
  if (modeloNormalizado === '432') {
    modeloNormalizado = 'MFP 432';
  } else if (modeloNormalizado === 'M432') {
    modeloNormalizado = 'MFP M432';
  }
  // Agregar más normalizaciones según sea necesario
  
  const datosParaBackend = {
    serie: ObjetoDatosDelFormulario.serie,
    nombre: ObjetoDatosDelFormulario.nombre,
    marca: ObjetoDatosDelFormulario.marca,
    modelo: modeloNormalizado,                              // ✅ modelo normalizado
    direccionIp: ObjetoDatosDelFormulario.direccionIp,
    areaID: parseInt(ObjetoDatosDelFormulario.area),        // ✅ area → areaID
    contratoID: parseInt(ObjetoDatosDelFormulario.contrato), // ✅ contrato → contratoID
    toner: ObjetoDatosDelFormulario.toner || ''              // ✅ campo opcional
  };

  // 🔍 Validar que los campos requeridos estén presentes
  const camposRequeridos = ['serie', 'nombre', 'marca', 'modelo', 'direccionIp'];
  const camposVacios = camposRequeridos.filter(campo => !datosParaBackend[campo] || datosParaBackend[campo].trim() === '');
  
  if (camposVacios.length > 0) {
    alert(`Por favor complete los siguientes campos: ${camposVacios.join(', ')}`);
    return;
  }
  
  if (!datosParaBackend.areaID || datosParaBackend.areaID <= 0) {
    alert('Por favor seleccione un área válida');
    return;
  }
  
  if (!datosParaBackend.contratoID || datosParaBackend.contratoID <= 0) {
    alert('Por favor seleccione un contrato válido');
    return;
  }

  console.log('Datos corregidos para el backend:', datosParaBackend);

  // Convertir el objeto JavaScript a una cadena JSON
  const jsonString = JSON.stringify(datosParaBackend);
  console.log('JSON que se enviará:', jsonString);
  console.log(jsonString);

  try {
    const respuesta = await fetch(buildApiUrl('/impresora'), {
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
      // toner: datosFormulario.get('toner')
      //})
    });

    if (!respuesta.ok) {
      // 🔍 Intentar obtener información más detallada del error
      let mensajeError = `Error HTTP: ${respuesta.status}`;
      try {
        const errorData = await respuesta.json();
        if (errorData.message) {
          mensajeError += ` - ${errorData.message}`;
        }
        if (errorData.details) {
          mensajeError += ` - Detalles: ${JSON.stringify(errorData.details)}`;
        }
      } catch (e) {
        // Si no se puede parsear el JSON del error, usar mensaje genérico
        mensajeError += ` - ${respuesta.statusText}`;
      }
      throw new Error(mensajeError);
    };
    const resultado = await respuesta.json(); // 5. Procesar la respuesta (ejemplo JSON)
    console.log('Datos enviados exitosamente:', resultado);
    alert('Datos recibidos correctamente.');

    resetFormulario(formulario);
    
    // 🎨 Cerrar modal con animación después del éxito
    hideModalWithAnimation();
    
    //Volver a cargar la tabla de impresoras
    limpiarCacheToner()
    cacheImpresoras = null;
    getImpresoras();
  }
  catch (error) {
    console.error('Error al enviar datos:', error);
    
    // 🚨 Mostrar error más detallado al usuario
    let mensajeUsuario = 'Error al guardar la impresora: ';
    if (error.message.includes('400')) {
      mensajeUsuario += 'Datos inválidos. Verifique que todos los campos estén completos y correctos.';
    } else if (error.message.includes('409')) {
      mensajeUsuario += 'Ya existe una impresora con esa serie.';
    } else if (error.message.includes('500')) {
      mensajeUsuario += 'Error interno del servidor. Contacte al administrador.';
    } else {
      mensajeUsuario += error.message;
    }
    
    alert(mensajeUsuario);
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
    const respuesta = await fetch(buildApiUrl('/consumible'), {
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
    cacheConsumibles = null;
    getConsumibles();
    resetFormulario(formulario);
    
    // 🎨 Cerrar modal con animación después del éxito
    hideModalWithAnimation();
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

// 🎨 ==================== FUNCIONES DE ANIMACIÓN MODAL ====================

/**
 * Muestra el modal con animación suave de fade + scale
 */
function showModalWithAnimation() {
  // Mostrar el modal (display: block)
  modal.style.display = 'block';
  
  // Aplicar animación después de un frame para asegurar que el CSS se aplique
  requestAnimationFrame(() => {
    modal.classList.add('show');
  });
  
  // Focus en el primer campo después de que termine la animación
  setTimeout(() => {
    const firstInput = modal.querySelector('input[type="text"]');
    if (firstInput) {
      firstInput.focus();
    }
  }, 400); // 400ms = tiempo total de animación + delay
}

/**
 * Oculta el modal con animación suave
 */
function hideModalWithAnimation() {
  // Remover la clase show para iniciar animación de salida
  modal.classList.remove('show');
  
  // Ocultar el modal después de que termine la animación
  setTimeout(() => {
    modal.style.display = 'none';
    // Resetear cualquier estado del formulario si es necesario
    resetFormState();
  }, 300); // 300ms = duración de la transición CSS
}

/**
 * Resetea el estado visual del formulario
 */
function resetFormState() {
  // Remover cualquier clase de error de validación
  const errorInputs = modal.querySelectorAll('.inputError');
  errorInputs.forEach(input => {
    input.classList.remove('inputError');
  });
  
  // Resetear opciones de select2 si están inicializadas
  try {
    $('#selectArea').val('n').trigger('change');
    $('#selectContrato').val('n').trigger('change');
    $('#selectImpresora').val('n').trigger('change');
  } catch (e) {
    // Ignorar errores si select2 no está inicializado
  }
}

// 🎨 ==================== EVENTOS DE ANIMACIÓN ====================


