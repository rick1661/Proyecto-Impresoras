

//Seleccionamos elementos del DOOM
const btnImpresora = document.getElementById('btnImpresoras');
const btnConsumible = document.getElementById('btnConsumibles');
const tabla = document.querySelector('.styled-table');
const botonADD = document.getElementById('agregarBtn');
let botonGuardar;
const tituloH2 = document.querySelector('#TituloH2');
const decision = document.getElementById('decisionModal')
const aceptarBtn = document.getElementById('aceptarBtn');
const cancelarBtn = document.getElementById('cancelarBtn');
const buscador = document.getElementById('busquedaInput');
const editarBtn = document.getElementById('editarBtn');
const tonerModal = document.getElementById('tonerModal');
const nombreImpresora = document.querySelector('.nombreImpresora');
const cerrarModal = document.getElementById('cerrarTonerModal');
const tablaToner = document.querySelector('.tablaToner tbody');

//Variable que guarda la tabla de consulta de toner a modificar
let tablaConsultaToner;

//variable que almacena la serie a consultar
let serieConsultaToner;

//variables
let vacio = false;
let eliminar = false;
let idEliminar;


// Variables para caché de datos
let cacheImpresoras = null;
let cacheConsumibles = null;

// Caché para niveles de tóner por IP
const cacheToner = {};

// Cola de peticiones para nivel de tóner
const tonerQueue = [];
let tonerQueueActive = 0;
const tonerQueueMax = 3;

//Funcion para cargar listeners
cargarEventListeners();

function cargarEventListeners() {

  document.addEventListener('DOMContentLoaded', getImpresoras);
  btnImpresora.addEventListener('click', cargarTablaimpresoras);
  btnConsumible.addEventListener('click', cargarTablaConsumibles);
  tabla.addEventListener('click', modificacionElemento);
  buscador.addEventListener('input', buscarElemento);
  tablaToner.addEventListener('click', eliminacionTonerEspecifico);
  editarBtn.addEventListener('click', edicion);

}


//*********************************************************************************************************Funciones*************************************************************************//

//***********************Funciona para modificar la estructura de la tabla a impresoras *************************************/
// Agregar evento click al botón de impresoras
function cargarTablaimpresoras() {

  // Establecer la sección a impresoras


  // Cambiar el contenido de la tabla para mostrar las columnas de impresoras 

  if (editarBtn.firstElementChild.textContent.trim() === "Salir edicion") {

    tabla.innerHTML = `
              <thead>
                  <tr>
                      <th>Serie</th>
                      <th>Nombre</th>
                      <th>Pocentaje</th>
                      <th>Marca</th>
                      <th>Modelo</th>
                      <th>IP</th>
                      <th>Área</th>
                      <th>Contrato</th>
                      <th>Tóner</th>
                      <th>Editar</th>
                      <th>Eliminar</th>
                  </tr>
              </thead>
              <tbody>
                  <!-- Aquí puedes agregar filas de datos -->
                  <tr>
                  
                  </tr>
                  <!-- Más filas aquí -->
              </tbody>`;

  } else {

    tabla.innerHTML = `
              <thead>
                  <tr>
                      <th>Serie</th>
                      <th>Nombre</th>
                      <th>Pocentaje</th>
                      <th>Marca</th>
                      <th>Modelo</th>
                      <th>IP</th>
                      <th>Área</th>
                      <th>Contrato</th>
                      <th>Tóner</th>
                  </tr>
              </thead>
              <tbody>
                  <!-- Aquí puedes agregar filas de datos -->
                  <tr>
                  
                  </tr>
                  <!-- Más filas aquí -->
              </tbody>`;


  }




  // Cambiar el texto del botón para agregar impresoras
  botonADD.innerHTML = `<span>Agregar impresora</span>`;
  console.log('Botón de impresoras clickeado');

  // Llamar a la función para obtener e insertar las impresoras en la tabla
  if (cacheImpresoras) {
    renderImpresoras(cacheImpresoras);
  } else {
    getImpresoras(true);
  }
};

//***********************************funcion para obtener e insertar las impresoras en la tabla principal****************************************


async function getImpresoras(guardarCache = false) {
  try {
    const response = await fetch(`https://192.168.80.180:5500/impresora`); // Carga todos
    const data = await response.json();
    const impresoras = data.impresoras || data;
    if (guardarCache) {
      cacheImpresoras = impresoras;
    }
    renderImpresoras(impresoras);
  } catch (error) {
    console.error('Error al cargar impresoras:', error);
  }
}

function enqueueTonerRequest(fn) {
  tonerQueue.push(fn);
  processTonerQueue();

}

function processTonerQueue() {
  while (tonerQueueActive < tonerQueueMax && tonerQueue.length > 0) {
    const fn = tonerQueue.shift();
    tonerQueueActive++;
    fn().finally(() => {
      tonerQueueActive--;
      processTonerQueue();
    });
  }
}

function renderImpresoras(impresoras) {
  const tbody = document.querySelector('.styled-table tbody');
  tbody.innerHTML = '';
  for (const impresora of impresoras) {
    // Creamos la url de la IP de forma segura (evitar excepción si ip inválida)
   
    const ip = impresora.direccionIp || '';
    let ipHref = null;
    try {
      // Si la dirección ya contiene protocolo, úsala; si no, prepende http://
      const candidate = ip.startsWith('http://') || ip.startsWith('https://') ? ip : `http://${ip}`;
      const urlObj = new URL(candidate);
      ipHref = urlObj.href;
    } catch (err) {
      // dirección inválida -> no crear enlace, mostrar solo texto
      console.warn('IP inválida, no se creará enlace:', impresora.direccionIp);
      ipHref = null;
    }
    const row = document.createElement('tr');
    // Generar un id único para la celda de tóner
    const tonerCellId = `toner-${impresora.impresoraID}`;
    let obtenerToner;

    if (editarBtn.firstElementChild.textContent.trim() === "Salir edicion") {
      row.innerHTML = `
          <td>${impresora.serie}</td>
          <td>${impresora.nombre[0]}</td>
          <td id="${tonerCellId}">Cargando...</td>
          <td>${impresora.marca}</td>
          <td>${impresora.modelo}</td>
          <td>${ipHref ? `<a href="${ipHref}" target="_blank">${impresora.direccionIp}</a>` : `${impresora.direccionIp}`}</td>
          <td>${impresora.nombre[1]}</td>
          <td>${impresora.nombre[2]}</td>
          <td id="${impresora.serie}" class="toner-cell">${impresora.toner}</td>
          <td><button value="${impresora.impresoraID}" class="editBtn">Editar</button></td>
          <td><button type="button" value="${impresora.impresoraID}" class="deleteBtn">Eliminar</button></td>
        `;
    } else {
      row.innerHTML = `
          <td>${impresora.serie}</td>
          <td>${impresora.nombre[0]}</td>
          <td id="${tonerCellId}">Cargando...</td>
          <td>${impresora.marca}</td>
          <td>${impresora.modelo}</td>
          <td>${ipHref ? `<a href="${ipHref}" target="_blank">${impresora.direccionIp}</a>` : `${impresora.direccionIp}`}</td>
          <td>${impresora.nombre[1]}</td>
          <td>${impresora.nombre[2]}</td>
          <td id="${impresora.serie}" class="toner-cell">${impresora.toner}</td>`;
    }
    tbody.appendChild(row);

    // Modelos que usan tóner color
    const modelosColor = [
      'E47528',
      'P57750 XC',
      'MFP M283fdw',
      'MFP P57750',
      'MFP P57750 XC',
      'MFP E47528'
    ];

    // Modelo 408
    const modelo408 = ["408dn", "MFP M232", "MFP 432", "M432", "MFP M432"];

    // Si el modelo es uno de los de color, usa la función de color, si no, la de negro
    const modelo = (impresora.modelo || '').toUpperCase();
    const esColor = modelosColor.some(m => modelo.includes(m.toUpperCase()));
    const es408 = modelo408.some(m => modelo.includes(m.toUpperCase()));
    if (esColor) {
      obtenerToner = obtenerNivelTonerColor
    } else if (es408) {

      obtenerToner = obtenerNivelTonerScraping

    }
    else {
      obtenerToner = obtenerNivelTonerNegro
    }
    //const obtenerToner = esColor ? obtenerNivelTonerColor : obtenerNivelTonerNegro;

    enqueueTonerRequest(() => obtenerToner(impresora.direccionIp).then(nivelTonerValue => {
      // Normalizar IP para scraping (sin sufijos ni puertos)
      const ipSolo = impresora.direccionIp.split(':')[0];

      // Intercambio de colores solo para modelo P57750
      if (modelo.includes('P57750')) {
        if (nivelTonerValue && typeof nivelTonerValue === 'object') {
          nivelTonerValue = {
            black: nivelTonerValue.yellow,
            cyan: nivelTonerValue.magenta,
            magenta: nivelTonerValue.cyan,
            yellow: nivelTonerValue.black
          };
        }
      }

      const tonerCell = document.getElementById(tonerCellId);
      if (tonerCell) {
        tonerCell.innerHTML = renderBarraToner(nivelTonerValue);
      }

    }));
  }
}

//************************Funcion para  modificar la estrutura de la tabla a consumibles*****************************/
function cargarTablaConsumibles() {

  // Establecer la sección a consumibles

  console.log('Botón de consumibles clickeado');

  // Cambiar el contenido de la tabla para mostrar las columnas de consumibles

  if (editarBtn.firstElementChild.textContent.trim() === "Salir edicion") {
    tabla.innerHTML = `
      <thead>
                  <tr>
                      <th>Tipo</th>
                      <th>Modelo</th>
                      <th>TIJ</th>
                      <th>Fecha</th>
                      <th>Impresora</th>
                      <th>Serie</th>
                      <th>Editar</th>
                      <th>Salir</th>
                  </tr>
              </thead>
              <tbody>
                  <!-- Aquí puedes agregar filas de datos -->
                  <tr>
                  
                  </tr>
                  <!-- Más filas aquí -->
              </tbody>`;
  } else {

    tabla.innerHTML = `
      <thead>
                  <tr>
                      <th>Tipo</th>
                      <th>Modelo</th>
                      <th>TIJ</th>
                      <th>Fecha</th>
                      <th>Impresora</th>
                      <th>Serie</th>
                  </tr>
              </thead>
              <tbody>
                  <!-- Aquí puedes agregar filas de datos -->
                  <tr>
                  
                  </tr>
                  <!-- Más filas aquí -->
              </tbody>`;

  }
  // Cambiar el texto del botón para agregar consumibles
  botonADD.innerHTML = `<span>Agregar consumible</span>`;
  // Llamar a la función para obtener e insertar los consumibles en la tabla
  if (cacheConsumibles) {
    renderConsumibles(cacheConsumibles);
  } else {
    getConsumibles(true);
  }
};

//**************************************funcion para obtener e insertar los consumibles en la tabla principal**************************************
function getConsumibles(guardarCache = false) {
  fetch(`https://192.168.80.180:5500/consumible`)
    .then(response => response.json())
    .then(data => {
      const consumibles = data.consumibles || data;
      if (guardarCache) {
        cacheConsumibles = consumibles;
      }
      renderConsumibles(consumibles);
    })
    .catch(error => {
      console.error('Error al cargar consumibles:', error);
    });
}

function renderConsumibles(consumibles) {
  const tbody = document.querySelector('.styled-table tbody');
  tbody.innerHTML = '';
  consumibles.forEach(consumible => {
    const row = document.createElement('tr');
    if (editarBtn.firstElementChild.textContent.trim() === "Salir edicion") {
      row.innerHTML = `
        <td>${consumible.tipo}</td>
        <td>${consumible.modelo}</td>
        <td>${consumible.tij}</td>
        <td class="fecha">${consumible.fecha.slice(0, 10)}</td>
        <td>${consumible.nombre}</td>
        <td>${consumible.serie}</td>
        <td><button  value="${consumible.consumibleID}" class="editBtn">Editar</button></td>
        <td><button type="button" value="${consumible.consumibleID}" class="deleteBtn">Eliminar</button></td>
      `;
    }
    else {
      row.innerHTML = `
        <td>${consumible.tipo}</td>
        <td>${consumible.modelo}</td>
        <td>${consumible.tij}</td>
        <td class="fecha">${consumible.fecha.slice(0, 10)}</td>
        <td>${consumible.nombre}</td>
        <td>${consumible.serie}</td>`

    }

    tbody.appendChild(row);
  });
}

//*************************funcion para Editar y eliminar elementos***********************************//

function modificacionElemento(e) {

  //prevenir el comportamiento por defecto
  //e.preventDefault();
  const target = e.target;
  console.log(target);
  //Identificar si se dio click en el boton de editar o eliminar

  if (target.classList.contains('editBtn')) {
    const id = target.value;
    // Lógica para editar el elemento con el ID correspondiente
    e.target.textContent = 'Guardar';
    e.target.style.backgroundColor = 'green';
    e.target.setAttribute('class', 'guardarBtn');
    botonGuardar = document.getElementById('guardarBtn');
    const abuelo = target.parentElement.parentElement;
    const elementosTd = abuelo.querySelectorAll('td');
    console.log(elementosTd);

    //Evaluar si se esta editando una impresora o un consumible

    switch (botonADD.textContent.trim()) {

      case 'Agregar impresora':
        console.log("entro aqui");
        modificarCamposImpresora(elementosTd);
        break;

      case 'Agregar consumible':

        console.log("entro aca");
        modificarCamposConsumible(elementosTd);
        break;

    }

  } else if (target.classList.contains('deleteBtn')) {
    idEliminar = target.value;
    console.log('Botón eliminar clickeado para ID:', target);
    // Lógica para eliminar el elemento con el ID correspondiente
    decision.style.display = 'block';
    cancelarBtn.addEventListener('click', cancelarEliminar);
    aceptarBtn.addEventListener('click', indentificarEliminar);

    console.log('Eliminar elemento con ID:', idEliminar);

  } else if (target.classList.contains('guardarBtn')) {

    console.log('Guardando cambios...');

    enviarCambios(e);

  }

  //Mostrar toner al dar click en la celda de toner
  if (target.classList.contains('toner-cell')) {
    consultaToner(e);
  }



}

//Fucnion para cerrar el modal de desicion despues de darle click al boton cancelar
function cancelarEliminar() {

  decision.style.display = 'none';

}

//Funcion para definir si se esta eliminando una impresora o un consumible
function indentificarEliminar() {

  switch (botonADD.textContent.trim()) {

    case 'Agregar impresora':

      console.log('entro a la funcion de identificar')
      //Funcion para eliminar impresora
      eliminarImpresora();


      break;

    case 'Agregar consumible':

      //Funcion para eliminar impresora
      eliminarConsumible();

      break;

  }

}


//*************************************Funcion eliminar impresora*************************//


async function eliminarImpresora(e) {
  console.log('entro a la funcion eliminar impresora');

  //Enviar los datos a la API
  try {
    const response = await fetch(`https://192.168.80.180:5500/impresora/${idEliminar}`, {

      method: 'DELETE',
      //headers: {
      //    'Content-Type': 'application/json'
      //  },
      //body: datosJSONC
    });

    if (!response.ok) {
      throw new Error('Error al eliminar la impresora');
    }

    const resultado = await response.json();
    console.log('Respuesta de la API:', resultado);
    alert('impresora eliminada correctamente');

    //Volver a cargar la tabla de impresoras
    decision.style.display = 'none';
    limpiarCacheToner()
    cacheImpresoras = null;
    getImpresoras();


  } catch (error) {
    console.error('Error al enviar los datos:', error);
    alert('Error al eliminar la impresora');
  }
}

async function eliminarConsumible(e) {
  console.log('entro a la funcion eliminar consumible')
  //Enviar los datos a la API
  try {
    const response = await fetch(`https://192.168.80.180:5500/consumible/${idEliminar}`, {

      method: 'DELETE',
      //headers: {
      //    'Content-Type': 'application/json'
      //  },
      //body: datosJSONC
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el consumible');
    }

    const resultado = await response.json();
    console.log('Respuesta de la API:', resultado);
    alert('consumible eliminada correctamente');

    //Volver a cargar la tabla de consumibles
    decision.style.display = 'none';
    cacheConsumibles = null;

    if (botonADD.textContent.trim() === 'Agregar consumible') {
      getConsumibles();
    }else if (botonADD.textContent.trim() === 'Agregar impresora') {    
      getImpresoras();
      getTonerEspecifico(serieConsultaToner);
    }
  } catch (error) {
    console.error('Error al enviar los datos:', error);
    alert('Error al eliminar el consumible');
  }
}



//**************************Funcion para mofificar los campos de en la edicion de una impresora************************
function modificarCamposImpresora(elementosTd) {

  //Recorrer los elementos td y convertirlos en campos editables
  elementosTd.forEach((elemento, index) => {

    //Hacer los pimeros 5 campos en input
    if (index <= 8 && index !== 2 && index !== 6 && index !== 7) {

      elemento.innerHTML = `<input class="inputEdit" type="text" value="${elemento.textContent}">`;

      //Convertir el campo area en un select
    } else if (elemento.firstElementChild === null && index === 6) {

      elemento.innerHTML = `
                          <select class="selectEdit" name="area" id="selectArea" required>
                            <option value="">${elemento.textContent}</option>
                            <!-- Agrega más opciones según necesites -->
                          </select>`
      //cargar las areas
      getAreasEdit(elemento.firstElementChild);

      //Convertir el campo contrato en un select
    } else if (elemento.firstElementChild === null && index === 7) {
      elemento.innerHTML = `
                          <select class="selectEdit" name="contrato" id="selectContrato" required>
                            <option value="">${elemento.textContent}</option>
                            <!-- Agrega más opciones según necesites -->
                          </select>`

      //cargar los contratos
      getContratosEdit(elemento.firstElementChild);
    }
  });
}


//*************************Funcion para obtener las areas de la edificion************************************
//Consultar Areas
async function getAreasEdit(elemento) {
  fetch('https://192.168.80.180:5500/area')
    .then(response => response.json()) // Convierte la respuesta a JSON
    .then(data => { // en data se guardan la información de la consulta

      data.forEach(area => {
        const option = document.createElement('option');
        option.value = area.areaID;
        option.textContent = area.nombre;
        elemento.appendChild(option);

        //Asignamos el valor seleccionado en el select Areas
        if (elemento.options[elemento.selectedIndex].textContent === area.nombre.trim()) {
          elemento.value = area.areaID;
        };

      });

    })
    .catch(error => {
      console.error('Error al cargar Areas:', error);
    });
}

//************************Funcion para obtener los contratos de la edicion**********************

async function getContratosEdit(elemento) {
  fetch('https://192.168.80.180:5500/contrato')
    .then(response => response.json()) // Convierte la respuesta a JSON
    .then(data => { // en data se guardan la información de la consulta
      data.forEach(contrato => {
        const option = document.createElement('option');
        option.value = contrato.contratoID;
        option.textContent = contrato.nombre;
        elemento.appendChild(option);

        //Asignamos el valor seleccionado en el select Contratos
        if (elemento.options[elemento.selectedIndex].textContent === contrato.nombre.trim()) {
          elemento.value = contrato.contratoID;
        }


      });

    })
    .catch(error => {
      console.error('Error al cargar Contratos:', error);
    });
}

// ********************Funcion para modificar los campos en la edicion de un consumible********************
function modificarCamposConsumible(elementosTd) {

  //Recorrer los elementos td y convertirlos en campos editables
  console.log("Funcion moficarCampos Consumible")
  elementosTd.forEach((elemento, index) => {

    //Convertir los primeros dos campos a Input

    switch (index) {

      case 0:

        elemento.innerHTML = `
                            <select class="selectEdit" name="tipo" id="selectTipo" required>
                              <option value = "${elemento.textContent}"> ${elemento.textContent}</option>
                              <!-- Agregar mas opciones segun necesites -->
                                <option value=1>Toner</option>
                                <option value=2>Tambor</option>
                            </select>`;
        break;

      case 1:

        elemento.innerHTML = `
                              <select class="selectEdit" name="modelo" id="selecModelo" required>
                                <option value = "${elemento.textContent}"> ${elemento.textContent}</option>
                                <!-- Agregar mas opciones segun necesites -->
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
                              </select>`;

        break;

      case 2:
        elemento.innerHTML = `<input class="inputEdit" type="text" value="${elemento.textContent}">`;
        break;

      case 4:
        elemento.innerHTML = `
                            <select class="selectEdit" name="impresoraID" id="seleImpresora" required>
                              <option value = "${elemento.textContent}"> ${elemento.textContent}</option>
                              <!-- Agregar mas opciones segun necesites -->
                              
                            </select>`;

        //cargar impresoras en el edit
        getImpresoraSelectEdit(elemento.firstElementChild)

        break;

    }

  })

}

//obtener impresoras 

//Consltar Impresoras
async function getImpresoraSelectEdit(elemento) {
  fetch('https://192.168.80.180:5500/impresora')
    .then(response => response.json()) // Convierte la respuesta a JSON
    .then(data => { // en data se guardan la información de la consulta

      data.forEach(impresora => {
        const option = document.createElement('option');
        option.value = impresora.impresoraID;
        option.textContent = `${impresora.nombre[0]} - ${impresora.serie}`;
        elemento.appendChild(option);

        //Asignamos el valor seleccionado en el select de edit impresora
        // console.log('antes del if para asignar el valor impresora ID al select');
        // console.group("elementos")
        // console.log(elemento.options[elemento.selectedIndex].textContent.trim())
        // console.log(impresora.nombre[0])
        if (elemento.options[elemento.selectedIndex].textContent.trim() === impresora.nombre[0]) {

          console.log("entro a la asignacion del ID de la impresora ")
          console.log(elemento.value);
          console.log(impresora.impresoraID);
          elemento.value = impresora.impresoraID;
          console.log(elemento.value);

        }
      });
    })
    .catch(error => {
      console.error('Error al cargar impresoras:', error);
    });
}

//****************************************Funciones para enviar los cambios a la BD************************************/
async function enviarCambios(e) {
  e.preventDefault();
  console.log('enviando cambios');
  console.log(e)
  //Seleccionar los elementos editables
  const abuelo = e.target.parentElement.parentElement;
  const elementosTd = abuelo.querySelectorAll('td');

  //Validar que no haya campos vacios

  elementosTd.forEach(elemento => {
    console.log(elemento);
    console.log(elemento.firstElementChild)

    if (elemento.firstElementChild != null) {

      if (!elemento.firstElementChild.classList.contains('barra')) {
        console.log('entro al for each de validacion')
        if (elemento.firstElementChild !== null && elemento.firstElementChild.value.trim() === '') {
          vacio = true
          elemento.firstElementChild.style.border = '2px solid red';
        } else {

          if (elemento.firstElementChild !== null)
            elemento.firstElementChild.style.border = '1px solid green';
        }

      }


    }

  });

  switch (vacio) {

    case true:

      alert('Por favor, complete todos los campos antes de guardar.');
      break;

    case false:
      //***************************************Modificiacion impresoras**************************************** */
      switch (botonADD.textContent.trim()) {

        case 'Agregar impresora':

          console.log("entro a la preparacion de envio de impresora")
          //Crear el objeto con los nuevos datos
          const datosActualizadosI = {
            id: parseInt(e.target.value),
            serie: elementosTd[0].firstElementChild.value.trim(),
            nombre: elementosTd[1].firstElementChild.value.trim(),
            marca: elementosTd[3].firstElementChild.value.trim(),
            modelo: elementosTd[4].firstElementChild.value.trim(),
            direccionIp: elementosTd[5].firstElementChild.value.trim(),
            areaID: parseInt(elementosTd[6].firstElementChild.value.trim()),
            contratoID: parseInt(elementosTd[7].firstElementChild.value.trim()),
            toner: elementosTd[8].firstElementChild.value.trim()
          };

          console.log('Datos actualizados:', datosActualizadosI);
          //convertimos el objeto a JSON
          const datosJSON = JSON.stringify(datosActualizadosI);
          console.log(datosJSON);

          //Enviar los datos a la API
          try {
            const response = await fetch(`https://192.168.80.180:5500/impresora/${datosActualizadosI.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: datosJSON
            });

            if (!response.ok) {
              throw new Error('Error al actualizar la impresora');
            }

            const resultado = await response.json();
            console.log('Respuesta de la API:', resultado);
            alert('Impresora actualizada correctamente');

            //Volver a cargar la tabla de impresoras
            cacheImpresoras = null;

            getImpresoras();
            vacio = false;

          } catch (error) {
            console.error('Error al enviar los datos:', error);
            alert('Error al actualizar la impresora');
          }
          // }
          break;
        //***************************************Modificiacion consumible**************************************** */
        case 'Agregar consumible':

          //Crear el objeto con los nuevos datos
          console.log("entro a la preparacion de envio de consumible");

          const datosActualizadosC = {

            id: parseInt(e.target.value),
            tipo: elementosTd[0].firstElementChild.value.trim(),
            modelo: elementosTd[1].firstElementChild.value.trim(),
            tij: elementosTd[2].firstElementChild.value.trim(),
            fecha: elementosTd[3].textContent.trim(),
            impresoraID: parseInt(elementosTd[4].firstElementChild.value.trim())
          };

          console.log('Datos actualizadosC')
          console.log(datosActualizadosC)

          //convertimos el objeto a JSON
          const datosJSONC = JSON.stringify(datosActualizadosC);
          console.log(datosJSONC);

          //Enviar los datos a la API
          try {
            const response = await fetch(`https://192.168.80.180:5500/consumible/${datosActualizadosC.id}`, {

              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: datosJSONC
            });

            if (!response.ok) {
              throw new Error('Error al actualizar el consumible');
            }

            const resultado = await response.json();
            console.log('Respuesta de la API:', resultado);
            alert('Consumible actualizado correctamente');

            //Volver a cargar la tabla de impresoras
            cacheConsumibles = null;
            getConsumibles();
            vacio = false;

          } catch (error) {
            console.error('Error al enviar los datos:', error);
            alert('Error al actualizar el consumible');
          }

          break;

      }
      break;

  }

  console.log(`vacio ${vacio}`);


}

//--------------Funcion de busqueda --------------------
function buscarElemento() {
  const filtro = this.value.toLowerCase();
  const filas = document.querySelectorAll('.styled-table tbody tr');
  filas.forEach(fila => {
    const textoFila = fila.textContent.toLowerCase();
    fila.style.display = textoFila.includes(filtro) ? '' : 'none';
  });
}


//-----------------------------------------Funcion Editar---------------------------------------------------------
function edicion() {

  switch (editarBtn.firstElementChild.textContent.trim()) {

    case "Editar":

      editarBtn.firstElementChild.textContent = "Salir edicion";
      break;

    case "Salir edicion":

      editarBtn.firstElementChild.textContent = "Editar";
      break;
  }

  switch (botonADD.firstElementChild.textContent.trim()) {

    case "Agregar impresora":

      

      // Llamar a la función para obtener e insertar las impresoras en la tabla
      cargarTablaimpresoras();

      break;

    case "Agregar consumible":

      

      //Llamar funcion para obtener e insertar los consumibles a la tabla
      cargarTablaConsumibles()
      break;

  }
}



//-----------------------------------------funciones para extraer nivel de toner---------------------------------------------------------

async function obtenerNivelTonerNegro(ip) {
  if (cacheToner[ip] && cacheToner[ip].negro !== undefined) {
    return cacheToner[ip].negro;
  }
  
  try {
    const tonerResp = await fetch(`https://192.168.80.180:5500/tonerNegro/${ip}`);
    const tonerData = await tonerResp.json();
    let nivel;
    if (tonerData.tonerLevels && tonerData.tonerLevels.length > 0) {
      nivel = tonerData.tonerLevels.map(t => t.value).join(', ');
    } else if (tonerData.tonerLevel !== undefined && tonerData.tonerLevel !== null) {
      if (tonerData.tonerLevel < 0) {
        tonerData.tonerLevel = 0;
      }
      nivel = tonerData.tonerLevel;
    } else {
      nivel = "No accesible";
    }
    if (!cacheToner[ip]) cacheToner[ip] = {};
    cacheToner[ip].negro = nivel;
    return nivel;
  } catch (err) {
    return '-';
  }
}

async function obtenerNivelTonerColor(ip) {
  if (cacheToner[ip] && cacheToner[ip].color !== undefined) {
    return cacheToner[ip].color;
  }
  
  try {
    const tonerResp = await fetch(`https://192.168.80.180:5500/tonersColor/${ip}`);
    const tonerData = await tonerResp.json();
    let nivel = '-';
    if (tonerData.tonerLevels && typeof tonerData.tonerLevels === 'object') {
      nivel = tonerData.tonerLevels;
    }
    if (!cacheToner[ip]) cacheToner[ip] = {};
    cacheToner[ip].color = nivel;
    return nivel;
  } catch (err) {
    return '-';
  }
}

async function obtenerNivelTonerScraping(ip) {
  if (cacheToner[ip] && cacheToner[ip].scraping !== undefined) {
    return cacheToner[ip].scraping;
  }
  
  try {
    const tonerResp = await fetch(`https://192.168.80.180:5500/tonerScraping/${ip}`);
    const tonerData = await tonerResp.json();
    let nivel = '-';
    if (Array.isArray(tonerData.niveles)) {
      const [black, image] = tonerData.niveles.map(v => parseInt(v));
      nivel = { black, image };
    } else if (tonerData.tonerLevels && typeof tonerData.tonerLevels === 'object') {
      nivel = tonerData.tonerLevels;
    }
    if (!cacheToner[ip]) cacheToner[ip] = {};
    cacheToner[ip].scraping = nivel;
    return nivel;
  } catch (error) {
    return '-';
  }
}

// Renderiza una barra de porcentaje para el nivel de tóner
function renderBarraToner(valor) {
  // Si es un número, renderiza una sola barra (impresora monocromática)
  if (typeof valor === 'number' || (!isNaN(valor) && valor !== null && valor !== undefined && valor !== '')) {
    const num = Number(valor);
    if (isNaN(num)) return '-';
    return `
        <div class="barraTonerNegro barra">
          <div class="nivel" style="width:${num}%;">
            <span class="textoNivel">${num}%</span>
          </div>
        </div>
      `;
  }
  // Si es un objeto (impresora color o monocromo con drum), renderiza barras según las propiedades presentes
  if (typeof valor === 'object' && valor !== null) {
    // Si solo tiene black e image, mostrar etiquetas personalizadas
    const keys = Object.keys(valor);
    if (keys.length === 2 && keys.includes('black') && keys.includes('image')) {
      const etiquetas = [
        { key: 'black', label: 'Tóner', color: '#4caf50' },
        { key: 'image', label: 'Tambor', color: '#888' }
      ];
      return etiquetas.map(e => {
        const num = Number(valor[e.key]);
        if (isNaN(num)) return '';
        return `
            <div class="barraScrapingContenedor barra" style="margin-bottom:2px;">
              <span class="textoEtiqueta" style="color:${e.color};">${e.label}</span>
              <div class="barraScraping">
                <div class="nivel" style="background:${e.color}; width:${num}%;"></div>
                <span class="textoNivel">
                  ${num}%
                </span>
              </div>
            </div>
          `;
      }).join('');
    } else {
      // Si es color, mostrar las barras CMYK
      const colores = [
        { key: 'black', label: 'K', color: '#222' },
        { key: 'cyan', label: 'C', color: '#00bcd4' },
        { key: 'magenta', label: 'M', color: '#e91e63' },
        { key: 'yellow', label: 'Y', color: '#ffeb3b' }
      ];
      return colores.map(c => {
        const num = Number(valor[c.key]);
        if (isNaN(num)) return '';
        return `
            <div style="margin-bottom:2px;" class="barra">
              <span style="font-size:11px; width:18px; display:inline-block; color:${c.color === '#ffeb3b' ? '#222' : c.color};">${c.label}</span>
              <div style="background:#eee; border-radius:4px; width:80px; height:14px; display:inline-block; position:relative; vertical-align:middle;">
                <div style="background:${c.color}; width:${num}%; height:100%; border-radius:4px;"></div>
                <span style="position:absolute; left:0; right:0; top:0; bottom:0; text-align:center; line-height:14px; font-size:11px; color:#222;">
                  ${num}%
                </span>
              </div>
            </div>
          `;
      }).join('');
    }
  }
  return '-';
}

function limpiarCacheToner() {

  for (const ip in cacheToner) {
    delete cacheToner[ip];
  }

}

function consultaToner(e) {
  console.log('consulta toner');
  console.log(e.target);
  tonerModal.style.display = 'block';

  //Definimos el ID de la impresora
   serieConsultaToner = e.target.id;
  console.log('Impresora serie:', serieConsultaToner);

  //Definimos el nombre de la impresora
  const fila = e.target.parentElement;
  const nombre = fila.children[1].textContent;
  document.getElementById('TituloH1').textContent = `Tóners de la impresora: ${nombre}`;

  // Llamar a la función para obtener el tóner específico

  getTonerEspecifico(serieConsultaToner);

}

cerrarModal.onclick = function () {
  tonerModal.style.display = 'none';

}

async function getTonerEspecifico(serie) {

  //Limpiar la tabla antes de agregar nuevos datos
  const tbody = document.querySelector('.tablaToner tbody');
  tbody.innerHTML = '';

  try {
    console.log('Obteniendo tóner específico para serie:', serie);
    // Aquí iría la lógica para obtener el tóner específico
    const response = await fetch(`https://192.168.80.180:5500/consumible/${serie}`);

    // Si la respuesta no es OK, devolver null
    if (!response.ok) {
      console.warn('Respuesta no OK al solicitar consumible:', response.status);
      renderTonerUnico(null);
      return null;
    }

    const data = await response.json();
    const tonerEspecifico = data.consumibles || data;

    // Si no hay datos válidos, devolver null
    if (!tonerEspecifico || (Array.isArray(tonerEspecifico) && tonerEspecifico.length === 0)) {
      console.warn('No se encontraron consumibles para la impresora serie:', serie);
        renderTonerUnico(null);
        return null;
    }

    renderTonerUnico(tonerEspecifico);
    return tonerEspecifico;
  } catch (error) {
    console.error('Error al obtener tóner específico:', error);
    renderTonerUnico(null);
    return null;
  }

}

function renderTonerUnico(tonerEspecifico) {
  console.log('Renderizando tóner específico:', tonerEspecifico);
  // Asegurarnos de limpiar antes de renderizar
  const tbody = document.querySelector('.tablaToner tbody');
   tbody.innerHTML = '';

  // No renderizar si no se recibió dato (undefined o null)
  if (tonerEspecifico === undefined || tonerEspecifico === null) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td colspan="4" style="text-align:center;">No existen consumibles para la impresora seleccionada.</td>
    `;
    tbody.appendChild(row);

  } else {
    if (Array.isArray(tonerEspecifico)) {

      console.log("Entro al for each de toner especifico")
      tonerEspecifico.forEach(toner => {
        const row = document.createElement('tr');
        console.log(toner.fecha);
        row.innerHTML = `
        <td>${toner.tipo}</td>
        <td>${toner.modelo}</td>
        <td>${toner.tij}</td>
        <td>${toner.fecha.slice(0, 10)}</td>
        <td class="eliminar-td ${toner.consumibleID}"><button class="eliminar-btn">X</button></td>
      `;
        tbody.appendChild(row);
      });
    } else {

      console.log("Noooo Entro al for each de toner especifico")
      const row = document.createElement('tr');      row.innerHTML = `
      <td>${tonerEspecifico.tipo}</td>
      <td>${tonerEspecifico.modelo}</td>
      <td>${tonerEspecifico.tij}</td>
      <td>${tonerEspecifico.fecha.slice(0, 10)}</td>
      <td class="eliminar-td ${tonerEspecifico.consumibleID}"><button class="eliminar-btn">X</button></td>
    `;
      tbody.appendChild(row);
    }
  }
}

function eliminacionTonerEspecifico(event) {
  if (event.target.classList.contains('eliminar-btn')) {
    const fila = event.target.closest('tr');
    let id = fila.querySelector('.eliminar-td').classList[1];
    id = parseInt(id);
    console.log('Eliminar tóner específico con ID:', id);
    // Aquí iría la lógica para eliminar el tóner específico
    idEliminar = id;
    eliminarConsumible();
  
  }
}
