

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

// Variables para el ordenamiento
let sortOrder = 'asc'; // 'asc' para ascendente, 'desc' para descendente
let currentData = []; // Para almacenar los datos actuales




// Variables para caché de datos
let cacheImpresoras = null;
let cacheConsumibles = null;

// Caché con TTL para niveles de tóner
const cacheConTTL = {
  datos: {},

  set(clave, valor, ttlMinutos = 11) {
    this.datos[clave] = {
      valor,
      expiracion: Date.now() + (ttlMinutos * 60 * 1000)
    };
  },

  get(clave) {
    const entrada = this.datos[clave];
    if (!entrada) return null;

    if (Date.now() > entrada.expiracion) {
      delete this.datos[clave]; // Limpia datos expirados
      return null;
    }

    return entrada.valor;
  },

  limpiarExpirados() {
    const ahora = Date.now();
    for (const clave in this.datos) {
      if (ahora > this.datos[clave].expiracion) {
        delete this.datos[clave];
      }
    }
  }
};

// Cola de peticiones para nivel de tóner
const tonerQueue = [];
let tonerQueueActive = 0;
const tonerQueueMax = 3;

//********************* Funciones auxiliares para manejo de estado de edición *********************

// Función auxiliar para verificar si está en modo edición
function estaModoEdicion() {
  return editarBtn.firstElementChild.textContent.trim() === "Salir edicion";
}

// Función auxiliar para obtener el estado actual del botón
function obtenerEstadoEdicion() {
  return editarBtn.firstElementChild.textContent.trim();
}

// Función auxiliar para cambiar el estado del botón de edición
function cambiarEstadoEdicion(nuevoEstado) {
  editarBtn.firstElementChild.textContent = nuevoEstado;
}

// Función auxiliar para alternar entre estados de edición
function alternarModoEdicion() {
  const nuevoEstado = estaModoEdicion() ? "Editar" : "Salir edicion";
  cambiarEstadoEdicion(nuevoEstado);
}

// Función auxiliar para aplicar visibilidad de elementos editables
function aplicarVisibilidadElementosEditables() {
  const elementos = document.querySelectorAll('.elementoEditable');
  elementos.forEach(elemento => {
    if (estaModoEdicion()) {
      elemento.classList.remove('toggleHiddenEdicion');
    } else {
      elemento.classList.add('toggleHiddenEdicion');
    }
  });
}

//********************* Fin de funciones auxiliares *********************

// Función auxiliar para agregar event listener al botón de ordenamiento
function agregarEventListenerOrdenamiento() {
  setTimeout(() => {
    const sortBtn = document.getElementById('sortTonerBtn');
    if (sortBtn) {
      // Remover event listener previo si existe
      sortBtn.removeEventListener('click', ordenarPorToner);
      // Agregar nuevo event listener
      sortBtn.addEventListener('click', ordenarPorToner);
      console.log('✅ Event listener de ordenamiento agregado');
    } else {
      console.warn('❌ Botón de ordenamiento no encontrado - verificando HTML...');
      // Debug: verificar si el HTML contiene el botón
      const tableHTML = document.querySelector('.styled-table thead');
      if (tableHTML) {
        console.log('HTML de la tabla:', tableHTML.innerHTML);
      }
    }
  }, 100);
}

//Funcion para cargar listeners
cargarEventListeners();

function cargarEventListeners() {

  document.addEventListener('DOMContentLoaded', () => {
    // Primero cargar la estructura de la tabla de impresoras
    cargarTablaimpresoras();
  });
  btnImpresora.addEventListener('click', cargarTablaimpresoras);
  btnConsumible.addEventListener('click', cargarTablaConsumibles);
  tabla.addEventListener('click', modificacionElemento);
  buscador.addEventListener('input', buscarElemento);
  tablaToner.addEventListener('click', eliminacionTonerEspecifico);
  editarBtn.addEventListener('click', activarEdicion);


}


//*********************************************************************************************************Funciones*************************************************************************//

//***********************Funciona para modificar la estructura de la tabla a impresoras *************************************/
// Agregar evento click al botón de impresoras
function cargarTablaimpresoras() {

  // Establecer la sección a impresoras


  // Cambiar el contenido de la tabla para mostrar las columnas de impresoras 

  if (estaModoEdicion()) {
  tabla.innerHTML = `
              <thead>
                  <tr>
                      <th>Serie</th>
                      <th>Nombre</th>
                      <th>Porcentaje <button id="sortTonerBtn" class="sort-btn" title="Ordenar por nivel de tóner">↕️</button></th>
                      <th>Marca</th>
                      <th>Modelo</th>
                      <th>IP</th>
                      <th>Área</th>
                      <th>Contrato</th>
                      <th>Tóner</th>
                      <th class="elementoEditable ">Editar</th>
                      <th class="elementoEditable ">Eliminar</th>
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
                      <th>Porcentaje <button id="sortTonerBtn" class="sort-btn" title="Ordenar por nivel de tóner">↕️</button></th>
                      <th>Marca</th>
                      <th>Modelo</th>
                      <th>IP</th>
                      <th>Área</th>
                      <th>Contrato</th>
                      <th>Tóner</th>
                      <th class="elementoEditable toggleHiddenEdicion">Editar</th>
                      <th class="elementoEditable toggleHiddenEdicion">Eliminar</th>
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
  
  // Agregar event listener al botón de ordenamiento después de crear la tabla
  setTimeout(() => {
    const sortBtn = document.getElementById('sortTonerBtn');
    if (sortBtn) {
      sortBtn.addEventListener('click', ordenarPorToner);
    }
  }, 100);
};

//***********************************funcion para obtener e insertar las impresoras en la tabla principal****************************************


async function getImpresoras(guardarCache = false) {
  try {
    const response = await fetch(buildApiUrl('/impresora')); // Carga todos
    const data = await response.json();
    const impresoras = data.impresoras || data;
    if (guardarCache) {
      cacheImpresoras = impresoras;
    }
    renderImpresoras(impresoras);
    
    // Agregar event listener al botón de ordenamiento
    agregarEventListenerOrdenamiento();
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
  // Almacenar los datos actuales para el ordenamiento
  currentData = [...impresoras];
  
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

    if (estaModoEdicion()) {
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
          <td class="elementoEditable"><button value="${impresora.impresoraID}" class="editBtn">Editar</button></td>
          <td class="elementoEditable"><button type="button" value="${impresora.impresoraID}" class="deleteBtn">Eliminar</button></td>
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
          <td id="${impresora.serie}" class="toner-cell">${impresora.toner}</td>
          <td class="elementoEditable toggleHiddenEdicion"><button value="${impresora.impresoraID}" class="editBtn">Editar</button></td>
          <td class="elementoEditable toggleHiddenEdicion"><button type="button" value="${impresora.impresoraID}" class="deleteBtn">Eliminar</button></td>
        `;
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


  // Cambiar el contenido de la tabla para mostrar las columnas de consumibles

  if (estaModoEdicion()) {
  tabla.innerHTML = `
      <thead>
                  <tr>
                      <th>Tipo</th>
                      <th>Modelo</th>
                      <th>TIJ</th>
                      <th>Fecha</th>
                      <th>Impresora</th>
                      <th>Serie</th>
                      <th class="elementoEditable ">Editar</th>
                      <th class="elementoEditable ">Salir</th>
                  </tr>
              </thead>
              <tbody>
                  <!-- Aquí puedes agregar filas de datos -->
                  <tr>
                  
                  </tr>
                  <!-- Más filas aquí -->
              </tbody>`;
  } else {

      tabla.innerHTML = ` <thead>
                  <tr>
                      <th>Tipo</th>
                      <th>Modelo</th>
                      <th>TIJ</th>
                      <th>Fecha</th>
                      <th>Impresora</th>
                      <th>Serie</th>
                      <th class="elementoEditable toggleHiddenEdicion">Editar</th>
                      <th class="elementoEditable toggleHiddenEdicion">Salir</th>
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
  fetch(buildApiUrl('/consumible'))
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

    if (estaModoEdicion()) {
    row.innerHTML = `
        <td>${consumible.tipo}</td>
        <td>${consumible.modelo}</td>
        <td>${consumible.tij}</td>
        <td class="fecha">${consumible.fecha.slice(0, 10)}</td>
        <td>${consumible.nombre}</td>
        <td>${consumible.serie}</td>
        <td class="elementoEditable "><button  value="${consumible.consumibleID}" class="editBtn">Editar</button></td>
        <td class="elementoEditable "><button type="button" value="${consumible.consumibleID}" class="deleteBtn">Eliminar</button></td>
      `;
    
    } else {

       row.innerHTML = `
        <td>${consumible.tipo}</td>
        <td>${consumible.modelo}</td>
        <td>${consumible.tij}</td>
        <td class="fecha">${consumible.fecha.slice(0, 10)}</td>
        <td>${consumible.nombre}</td>
        <td>${consumible.serie}</td>
        <td class="elementoEditable toggleHiddenEdicion"><button  value="${consumible.consumibleID}" class="editBtn">Editar</button></td>
        <td class="elementoEditable toggleHiddenEdicion"><button type="button" value="${consumible.consumibleID}" class="deleteBtn">Eliminar</button></td>
      `;
    }
    tbody.appendChild(row);
  });
}

//*************************funcion para Editar y eliminar elementos***********************************//

function modificacionElemento(e) {

  //prevenir el comportamiento por defecto
  //e.preventDefault();
  const target = e.target;
  console.log('Click detectado en:', target);
  console.log('Clases del elemento:', target.classList);
  console.log('Contiene toner-cell?', target.classList.contains('toner-cell'));
  
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
    console.log('🎯 Click en celda de toner detectado!');
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
    const response = await fetch(buildApiUrl(`/impresora/${idEliminar}`), {

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

  // Obtener el nombre de la impresora y TIJ según el contexto
  let nombreImpresora = '';
  let tijConsumible = '';

  if (botonADD.textContent.trim() === 'Agregar impresora' && serieConsultaToner) {
    // Si estamos eliminando desde el modal de tóner, usar el nombre del modal
    const tituloH1 = document.getElementById('TituloH1');
    if (tituloH1) {
      const textoCompleto = tituloH1.textContent;
      // Extraer el nombre después de "Tóners de la impresora: "
      nombreImpresora = textoCompleto.replace('Tóners de la impresora: ', '');
    }

    // Obtener TIJ desde la fila del modal de tóner que se está eliminando
    const filasToner = document.querySelectorAll('.tablaToner tbody tr');
    for (const fila of filasToner) {
      const btnEliminar = fila.querySelector('.eliminar-btn');
      const idFila = fila.querySelector('.eliminar-td').classList[1];
      if (btnEliminar && parseInt(idFila) === idEliminar) {
        const celdas = fila.querySelectorAll('td');
        if (celdas.length > 2) {
          tijConsumible = celdas[2].textContent.trim(); // Columna "TIJ" en modal
        }
        break;
      }
    }
  } else if (botonADD.textContent.trim() === 'Agregar consumible') {
    // Si estamos eliminando desde la tabla de consumibles, buscar en la fila
    const filas = document.querySelectorAll('.styled-table tbody tr');
    for (const fila of filas) {
      const btnEliminar = fila.querySelector('.deleteBtn');
      if (btnEliminar && btnEliminar.value == idEliminar) {
        const celdas = fila.querySelectorAll('td');
        if (celdas.length > 4) {
          nombreImpresora = celdas[4].textContent.trim(); // Columna "Impresora"
          tijConsumible = celdas[2].textContent.trim(); // Columna "TIJ"
        }
        break;
      }
    }
  }

  console.log('Nombre de impresora para auditoría:', nombreImpresora);
  console.log('TIJ para auditoría:', tijConsumible);

  //Enviar los datos a la API
  try {
    const response = await fetch(buildApiUrl(`/consumible/${idEliminar}`), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombreImpresora: nombreImpresora,
        tij: tijConsumible
      })
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
    } else if (botonADD.textContent.trim() === 'Agregar impresora') {
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
      // Guardar el texto actual del área para seleccionarlo después
      const areaActual = elemento.textContent.trim();
      
      elemento.innerHTML = `
                          <select class="selectEdit" name="area" id="selectArea" required>
                            <option value="">Seleccionar área...</option>
                            <!-- Agrega más opciones según necesites -->
                          </select>`
      //cargar las areas
      getAreasEdit(elemento.firstElementChild, areaActual);

      //Convertir el campo contrato en un select
    } else if (elemento.firstElementChild === null && index === 7) {
      // Guardar el texto actual del contrato para seleccionarlo después
      const contratoActual = elemento.textContent.trim();
      
      elemento.innerHTML = `
                          <select class="selectEdit" name="contrato" id="selectContrato" required>
                            <option value="">Seleccionar contrato...</option>
                            <!-- Agrega más opciones según necesites -->
                          </select>`

      //cargar los contratos
      getContratosEdit(elemento.firstElementChild, contratoActual);
    }
  });
}


//*************************Funcion para obtener las areas de la edificion************************************
//Consultar Areas
async function getAreasEdit(elemento, areaActual = null) {
  fetch(buildApiUrl('/area'))
    .then(response => response.json()) // Convierte la respuesta a JSON
    .then(data => { // en data se guardan la información de la consulta

      data.forEach(area => {
        const option = document.createElement('option');
        option.value = area.areaID;
        option.textContent = area.nombre;
        elemento.appendChild(option);
      });

      // Seleccionar el área actual después de cargar todas las opciones
      if (areaActual) {
        for (let option of elemento.options) {
          if (option.textContent.trim() === areaActual) {
            elemento.value = option.value;
            break;
          }
        }
      }

    })
    .catch(error => {
      console.error('Error al cargar Areas:', error);
    });
}

//************************Funcion para obtener los contratos de la edicion**********************

async function getContratosEdit(elemento, contratoActual = null) {
  fetch(buildApiUrl('/contrato'))
    .then(response => response.json()) // Convierte la respuesta a JSON
    .then(data => { // en data se guardan la información de la consulta
      data.forEach(contrato => {
        const option = document.createElement('option');
        option.value = contrato.contratoID;
        option.textContent = contrato.nombre;
        elemento.appendChild(option);
      });

      // Seleccionar el contrato actual después de cargar todas las opciones
      if (contratoActual) {
        for (let option of elemento.options) {
          if (option.textContent.trim() === contratoActual) {
            elemento.value = option.value;
            break;
          }
        }
      }

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
                          <option value="CF226JC">CF226JC</option>
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
  fetch(buildApiUrl('/impresora'))
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
          
          // Debug: Log de los valores antes de procesarlos
          console.log('Elementos TD:', elementosTd);
          elementosTd.forEach((td, index) => {
            console.log(`TD[${index}]:`, td.textContent, 'firstElementChild:', td.firstElementChild);
            if (td.firstElementChild) {
              console.log(`  - Tipo: ${td.firstElementChild.tagName}, Valor: "${td.firstElementChild.value}"`);
            }
          });
          
          console.log('Area element:', elementosTd[6].firstElementChild);
          console.log('Area value:', elementosTd[6].firstElementChild?.value);
          console.log('Contrato element:', elementosTd[7].firstElementChild);
          console.log('Contrato value:', elementosTd[7].firstElementChild?.value);
          
          const areaValue = elementosTd[6].firstElementChild?.value?.trim() || '';
          const contratoValue = elementosTd[7].firstElementChild?.value?.trim() || '';
          
          console.log('=== DEBUGGING VALUES ===');
          console.log('areaValue (raw):', `"${areaValue}"`);
          console.log('contratoValue (raw):', `"${contratoValue}"`);
          
          // Validar que los valores no estén vacíos antes de hacer parseInt
          const areaID = areaValue === '' ? null : parseInt(areaValue);
          const contratoID = contratoValue === '' ? null : parseInt(contratoValue);
          
          console.log('Area parsed:', areaID, 'isNaN:', isNaN(areaID));
          console.log('Contrato parsed:', contratoID, 'isNaN:', isNaN(contratoID));
          console.log('========================');
          
          // Verificar si los IDs son válidos
          if (!areaValue || isNaN(areaID) || areaID === null) {
            console.error('❌ Area validation failed:', { areaValue, areaID, isNaN: isNaN(areaID) });
            alert('Por favor, seleccione un área válida');
            return;
          }
          
          if (!contratoValue || isNaN(contratoID) || contratoID === null) {
            console.error('❌ Contrato validation failed:', { contratoValue, contratoID, isNaN: isNaN(contratoID) });
            alert('Por favor, seleccione un contrato válido');
            return;
          }
          
          const datosActualizadosI = {
            id: parseInt(e.target.value),
            serie: elementosTd[0].firstElementChild.value.trim(),
            nombre: elementosTd[1].firstElementChild.value.trim(),
            marca: elementosTd[3].firstElementChild.value.trim(),
            modelo: elementosTd[4].firstElementChild.value.trim(),
            direccionIp: elementosTd[5].firstElementChild.value.trim(),
            areaID: areaID,
            contratoID: contratoID,
            toner: elementosTd[8].firstElementChild.value.trim()
          };

          console.log('🔍 OBJETO ANTES DE ENVIAR:');
          console.log('datosActualizadosI:', datosActualizadosI);
          console.log('areaID en objeto:', datosActualizadosI.areaID, typeof datosActualizadosI.areaID);
          console.log('contratoID en objeto:', datosActualizadosI.contratoID, typeof datosActualizadosI.contratoID);
          //convertimos el objeto a JSON
          const datosJSON = JSON.stringify(datosActualizadosI);
          console.log('📤 JSON A ENVIAR:', datosJSON);
          console.log('📤 JSON PARSEADO:', JSON.parse(datosJSON));

          //Enviar los datos a la API
          try {
            const response = await fetch(buildApiUrl(`/impresora/${datosActualizadosI.id}`), {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: datosJSON
            });

            if (!response.ok) {
              // Intentar obtener el error detallado del servidor
              const errorData = await response.json().catch(() => null);
              const errorMessage = errorData?.error || errorData?.details || 'Error al actualizar la impresora';
              throw new Error(errorMessage);
            }

            const resultado = await response.json();
            console.log('Respuesta de la API:', resultado);
            alert('Impresora actualizada correctamente');

            //Volver a cargar la tabla de impresoras
            cacheImpresoras = null;

            getImpresoras();
            agregarEventListenerOrdenamiento();
            vacio = false;

          } catch (error) {
            console.error('Error al enviar los datos:', error);
            
            // Intentar obtener detalles del error del servidor
            if (error.message && error.message.includes('Error al actualizar la impresora')) {
              // Este es el error genérico, intentar obtener más detalles de la respuesta
              console.log('Error genérico detectado, verificando respuesta...');
            }
            
            // Mostrar mensaje más específico
            alert(`Error al actualizar la impresora: ${error.message}`);
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
            const response = await fetch(buildApiUrl(`/consumible/${datosActualizadosC.id}`), {

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

function activarEdicion() {
  const elementosEditables = document.querySelectorAll('.elementoEditable');
  const estadoActual = obtenerEstadoEdicion();

  // Alternar el estado del botón usando la función auxiliar
  alternarModoEdicion();

  // Aplicar el toggle a todos los elementos editables
  elementosEditables.forEach(elemento => {
    elemento.classList.toggle('toggleHiddenEdicion');
  });
  
  console.log('Toggle aplicado a', elementosEditables.length, 'elementos. Nuevo estado:', obtenerEstadoEdicion());
}



//-----------------------------------------funciones para extraer nivel de toner---------------------------------------------------------

async function obtenerNivelTonerNegro(ip) {
  const cacheKey = `toner_negro_${ip}`;
  const cached = cacheConTTL.get(cacheKey);

  if (cached !== null) {
    return cached;
  }

  console.log('Extrayendo nivel de tóner Negro...');
  try {
    const tonerResp = await fetch(buildApiUrl(`/tonerNegro/${ip}`));
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

    // Guardar en caché
    cacheConTTL.set(cacheKey, nivel);
    return nivel;
  } catch (err) {
    return '-';
  }
}

async function obtenerNivelTonerColor(ip) {
  const cacheKey = `toner_color_${ip}`;
  const cached = cacheConTTL.get(cacheKey);

  if (cached !== null) {
    return cached;
  }

  console.log('Extrayendo nivel de tóner Color...');
  try {
    const tonerResp = await fetch(buildApiUrl(`/tonersColor/${ip}`));
    const tonerData = await tonerResp.json();
    let nivel = '-';
    if (tonerData.tonerLevels && typeof tonerData.tonerLevels === 'object') {
      nivel = tonerData.tonerLevels;
    }

    // Guardar en caché
    cacheConTTL.set(cacheKey, nivel);
    return nivel;
  } catch (err) {
    return '-';
  }
}

async function obtenerNivelTonerScraping(ip) {
  const cacheKey = `toner_scraping_${ip}`;
  const cached = cacheConTTL.get(cacheKey);

  if (cached !== null) {
    return cached;
  }

  console.log('Extrayendo nivel de tóner por scraping...');
  try {
    const tonerResp = await fetch(buildApiUrl(`/tonerScraping/${ip}`));
    const tonerData = await tonerResp.json();
    let nivel = '-';
    if (Array.isArray(tonerData.niveles)) {
      const [black, image] = tonerData.niveles.map(v => parseInt(v));
      nivel = { black, image };
    } else if (tonerData.tonerLevels && typeof tonerData.tonerLevels === 'object') {
      nivel = tonerData.tonerLevels;
    }

    // Guardar en caché con TTL de 5 minutos
    cacheConTTL.set(cacheKey, nivel);
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
  // Limpiar todo el caché de tóner
  cacheConTTL.datos = {};
}

// Función para extraer el valor numérico del porcentaje de tóner
function extraerValorToner(fila) {
  const celdaPorcentaje = fila.cells[2]; // Columna de porcentaje (índice 2)
  
  if (!celdaPorcentaje) return -1;
  
  // Buscar elementos con clase 'textoNivel' que contienen el porcentaje
  const textosNivel = celdaPorcentaje.querySelectorAll('.textoNivel');
  
  if (textosNivel.length === 0) {
    // Si no hay textoNivel, buscar texto que contenga %
    const texto = celdaPorcentaje.textContent;
    const match = texto.match(/(\d+)%/);
    return match ? parseInt(match[1]) : -1;
  }
  
  // Para impresoras monocromáticas (un solo valor)
  if (textosNivel.length === 1) {
    const valor = textosNivel[0].textContent.replace('%', '').trim();
    return parseInt(valor) || -1;
  }
  
  // Para impresoras de color o con múltiples cartuchos, usar el promedio
  let suma = 0;
  let count = 0;
  
  textosNivel.forEach(elemento => {
    const valor = parseInt(elemento.textContent.replace('%', '').trim());
    if (!isNaN(valor)) {
      suma += valor;
      count++;
    }
  });
  
  return count > 0 ? Math.round(suma / count) : -1;
}

// Función para ordenar la tabla por nivel de tóner
function ordenarPorToner() {
  const tbody = document.querySelector('.styled-table tbody');
  const filas = Array.from(tbody.querySelectorAll('tr'));
  
  // Alternar el orden
  sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  
  // Ordenar las filas basándose en el valor del tóner
  filas.sort((a, b) => {
    const valorA = extraerValorToner(a);
    const valorB = extraerValorToner(b);
    
    if (sortOrder === 'asc') {
      return valorA - valorB;
    } else {
      return valorB - valorA;
    }
  });
  
  // Limpiar y re-insertar las filas ordenadas
  tbody.innerHTML = '';
  filas.forEach(fila => tbody.appendChild(fila));
  
  // Actualizar el icono del botón
  const sortBtn = document.getElementById('sortTonerBtn');
  if (sortBtn) {
    sortBtn.textContent = sortOrder === 'asc' ? '↑' : '↓';
    sortBtn.title = sortOrder === 'asc' ? 'Ordenar descendente' : 'Ordenar ascendente';
  }
  
  console.log(`Tabla ordenada por tóner en orden ${sortOrder === 'asc' ? 'ascendente' : 'descendente'}`);
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
    const response = await fetch(buildApiUrl(`/consumible/${serie}`));

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
      const row = document.createElement('tr'); row.innerHTML = `
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

// Limpieza automática del caché cada 10 minutos
setInterval(() => {
  cacheConTTL.limpiarExpirados();
  console.log('Cache de tóner limpiado automáticamente');
}, 10 * 60 * 1000);
