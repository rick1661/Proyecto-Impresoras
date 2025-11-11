

//Seleccionamos elementos del DOOM
const btnImpresora = document.getElementById('btnImpresoras');
const btnConsumible = document.getElementById('btnConsumibles');
const btnEventos = document.getElementById('btnEventos');
const btnInventario = document.getElementById('btnInventario');
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

// 💾 Variables para guardar valores originales en modo edición
let valoresOriginales = new Map(); // Almacena los valores originales por fila
let filasEnEdicion = new Set(); // Rastrea qué filas están siendo editadas

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
    // Asegurar que los botones estén visibles al cargar
    botonADD.style.display = 'block';
    editarBtn.style.display = 'block';
    
    // Primero cargar la estructura de la tabla de impresoras
    cargarTablaimpresoras();
  });
  btnImpresora.addEventListener('click', cargarTablaimpresoras);
  btnConsumible.addEventListener('click', cargarTablaConsumibles);
  btnEventos.addEventListener('click', cargarTablaEventos);
  btnInventario.addEventListener('click', cargarInventario);
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
  
  // Aplicar estilos activos
  btnImpresora.classList.add('active');
  btnConsumible.classList.remove('active');
  btnEventos.classList.remove('active');
  btnInventario.classList.remove('active');
  
  // Actualizar navegación móvil
  updateMobileNavigation('impresoras');
  
  // Ocultar inventario y restaurar tabla
  const tableContainer = document.getElementById('tableContainer');
  const inventarioContainer = document.getElementById('inventarioContainer');
  if (inventarioContainer) inventarioContainer.style.display = 'none';
  tableContainer.style.display = 'block';
  
  // Mostrar botones inferiores (pueden estar ocultos por eventos)
  botonADD.style.display = 'block';
  editarBtn.style.display = 'block';
  
  // Restaurar barra de búsqueda superior
  const contenedorBuscadorPrincipal = document.getElementById('contenedorBuscadorPrincipal');
  if (contenedorBuscadorPrincipal) {
    contenedorBuscadorPrincipal.style.display = 'flex';
  }

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
    // 🔍 Aplicar filtro de búsqueda si hay texto en el buscador
    aplicarFiltroActual();
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
    
    // 🔍 Aplicar filtro de búsqueda si hay texto en el buscador
    aplicarFiltroActual();
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
  
  // Aplicar estilos activos
  btnImpresora.classList.remove('active');
  btnConsumible.classList.add('active');
  btnEventos.classList.remove('active');
  btnInventario.classList.remove('active');
  
  // Actualizar navegación móvil
  updateMobileNavigation('consumibles');
  
  // Ocultar inventario y restaurar tabla
  const tableContainer = document.getElementById('tableContainer');
  const inventarioContainer = document.getElementById('inventarioContainer');
  if (inventarioContainer) inventarioContainer.style.display = 'none';
  tableContainer.style.display = 'block';
  
  // Mostrar botones inferiores (pueden estar ocultos por eventos)
  botonADD.style.display = 'block';
  editarBtn.style.display = 'block';
  
  // Restaurar barra de búsqueda superior
  const contenedorBuscadorPrincipal = document.getElementById('contenedorBuscadorPrincipal');
  if (contenedorBuscadorPrincipal) {
    contenedorBuscadorPrincipal.style.display = 'flex';
  }

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
    // 🔍 Aplicar filtro de búsqueda si hay texto en el buscador
    aplicarFiltroActual();
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
      
      // 🔍 Aplicar filtro de búsqueda si hay texto en el buscador
      aplicarFiltroActual();
    })
    .catch(error => {
      console.error('Error al cargar consumibles:', error);
    });
}

// Función para agregar icono de gotita al modelo específico
function addDropIcon(modelo) {
  if (modelo === 'W9008MC') {
    return `${modelo} <span style="color: #000000; font-size: 1.1em; margin-left: 5px; filter: grayscale(100%) brightness(0%);">�</span>`;
  }
  return modelo;
}

function renderConsumibles(consumibles) {
  const tbody = document.querySelector('.styled-table tbody');
  tbody.innerHTML = '';
  consumibles.forEach(consumible => {
    const row = document.createElement('tr');
    
    // Función auxiliar para aplicar gotitas de color por modelo (reutilizable)
    function aplicarGotitaPorModelo(modelo) {
      // Gotitas negras para modelos específicos
      if (modelo === 'W9008MC' || modelo === 'MC9008' || modelo === 'W1332AC' || modelo === 'CF287JC' || modelo === '976YC K' || modelo === 'W2110X' || modelo === 'W1330XC' || modelo === 'CF287XC' || modelo === 'CF258XC' || modelo === 'CF226JC') {
        return `${modelo} <span style="color: #000000; font-size: 1.2em; margin-left: 5px;">●</span>`;
      }
      // Gotita cyan para 976YC C y W2111X
      else if (modelo === '976YC C' || modelo === 'W2111X') {
        return `${modelo} <span style="color: #00BFFF; font-size: 1.2em; margin-left: 5px;">●</span>`;
      }
      // Gotita magenta para 976YC M y W2113X
      else if (modelo === '976YC M' || modelo === 'W2113X') {
        return `${modelo} <span style="color: #FF1493; font-size: 1.2em; margin-left: 5px;">●</span>`;
      }
      // Gotita amarilla para 976YC Y y W2112X
      else if (modelo === '976YC Y' || modelo === 'W2112X') {
        return `${modelo} <span style="color: #FFD700; font-size: 1.2em; margin-left: 5px;">●</span>`;
      }
      return modelo;
    }

    // Agregar gotita según el modelo específico
    let modeloConIcono = aplicarGotitaPorModelo(consumible.modelo);

    if (estaModoEdicion()) {
    row.innerHTML = `
        <td>${consumible.tipo}</td>
        <td>${modeloConIcono}</td>
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
        <td>${modeloConIcono}</td>
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

  //Mostrar toner al dar click en la celda de toner o elementos dentro de ella
  if (target.classList.contains('toner-cell') || target.closest('.toner-cell')) {
    console.log('🎯 Click en celda de toner detectado!');
    // Si el click fue en un elemento hijo, usar la celda padre
    const tonerCell = target.classList.contains('toner-cell') ? target : target.closest('.toner-cell');
    // Crear un evento sintético con el target correcto
    const syntheticEvent = {
      target: tonerCell,
      preventDefault: e.preventDefault.bind(e),
      stopPropagation: e.stopPropagation.bind(e)
    };
    consultaToner(syntheticEvent);
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

// 💾 **************************Funciones para preservar valores originales************************

// Función para obtener un ID único de la fila
function obtenerIdFila(elemento) {
  const fila = elemento.closest('tr');
  if (fila) {
    // Usar la posición de la fila como ID único
    const filas = Array.from(fila.parentElement.children);
    return `fila_${filas.indexOf(fila)}`;
  }
  return null;
}

// Función para guardar los valores originales de una fila antes de editarla
function guardarValoresOriginales(fila) {
  const filaId = obtenerIdFila(fila.firstElementChild);
  if (filaId && !valoresOriginales.has(filaId)) {
    const valores = {};
    const celdas = fila.querySelectorAll('td');
    
    // Determinar qué tipo de tabla estamos editando basándonos en el botón ADD
    const esImpresora = botonADD.textContent.trim() === 'Agregar impresora';
    
    celdas.forEach((celda, index) => {
      if (esImpresora) {
        // Para impresoras: índices 0-8 excepto el 2 (que es la imagen)
        if (index <= 8 && index !== 2) {
          valores[index] = celda.textContent.trim();
        }
      } else {
        // Para consumibles: índices 0, 1, 2, 4 (tipo, modelo, tij, impresoraID)
        if (index === 0 || index === 1 || index === 2 || index === 4) {
          valores[index] = celda.textContent.trim();
        }
      }
    });
    
    valoresOriginales.set(filaId, valores);
    filasEnEdicion.add(filaId);
    console.log('Valores originales guardados para fila:', filaId, valores, 'Tipo:', esImpresora ? 'Impresora' : 'Consumible');
  }
}

// Función para restaurar los valores originales de una fila
function restaurarValoresOriginales(fila) {
  const filaId = obtenerIdFila(fila.firstElementChild);
  if (filaId && valoresOriginales.has(filaId)) {
    const valoresGuardados = valoresOriginales.get(filaId);
    const celdas = fila.querySelectorAll('td');
    
    celdas.forEach((celda, index) => {
      if (valoresGuardados.hasOwnProperty(index)) {
        celda.textContent = valoresGuardados[index];
      }
    });
    
    console.log('Valores originales restaurados para fila:', filaId, valoresGuardados);
  }
}

// Función para limpiar el registro de una fila específica
function limpiarRegistroValoresOriginales(fila) {
  const filaId = obtenerIdFila(fila.firstElementChild);
  if (filaId) {
    valoresOriginales.delete(filaId);
    filasEnEdicion.delete(filaId);
    console.log('Registro limpiado para fila:', filaId);
  }
}

//**************************Funcion para mofificar los campos de en la edicion de una impresora************************
function modificarCamposImpresora(elementosTd) {

  // 💾 Guardar valores originales antes de modificar
  const fila = elementosTd[0]?.parentElement;
  if (fila) {
    guardarValoresOriginales(fila);
  }

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

  // 💾 Guardar valores originales antes de modificar
  const fila = elementosTd[0]?.parentElement;
  if (fila) {
    guardarValoresOriginales(fila);
  }

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
                          <option value="W1330XC">W1330XC</option>
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
            
            // Limpiar los valores preservados ya que se guardó exitosamente
            const filaId = obtenerIdFila(elementosTd[0]);
            if (filaId) {
              valoresOriginales.delete(filaId);
              filasEnEdicion.delete(filaId);
            }

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
            
            // Limpiar los valores preservados ya que se guardó exitosamente
            const filaId = obtenerIdFila(elementosTd[0]);
            if (filaId) {
              valoresOriginales.delete(filaId);
              filasEnEdicion.delete(filaId);
            }

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
  aplicarFiltroActual();
}

// 🔍 Función para aplicar el filtro actual sin depender del evento 'this'
function aplicarFiltroActual() {
  const filtro = buscador.value.toLowerCase().trim();
  const filas = document.querySelectorAll('.styled-table tbody tr');
  const tablas = document.querySelectorAll('.styled-table');
  
  if (filtro === '') {
    // Sin filtro - mostrar todas las filas y quitar clase de búsqueda
    filas.forEach(fila => {
      fila.style.display = '';
    });
    tablas.forEach(tabla => {
      tabla.classList.remove('searching');
    });
    actualizarIndicadorFiltro(false);
    return;
  }
  
  // Agregar clase de búsqueda para mostrar más columnas
  tablas.forEach(tabla => {
    tabla.classList.add('searching');
  });
  
  // Aplicar filtro
  let filasVisibles = 0;
  filas.forEach(fila => {
    const textoFila = fila.textContent.toLowerCase();
    const esVisible = textoFila.includes(filtro);
    fila.style.display = esVisible ? '' : 'none';
    if (esVisible) filasVisibles++;
  });
  
  // 📊 Actualizar indicador visual y mostrar información
  actualizarIndicadorFiltro(true, filasVisibles, filas.length);
  console.log(`🔍 Filtro aplicado: "${filtro}" - ${filasVisibles} de ${filas.length} filas mostradas`);
}

// 🎨 Función para actualizar el indicador visual del filtro
function actualizarIndicadorFiltro(activo, visibles = 0, total = 0) {
  // Agregar/quitar clase CSS para estilo visual del input
  if (activo) {
    buscador.style.backgroundColor = '#e3f2fd'; // Azul claro
    buscador.style.border = '2px solid #2196f3'; // Borde azul
    buscador.title = `Mostrando ${visibles} de ${total} resultados`;
  } else {
    buscador.style.backgroundColor = '';
    buscador.style.border = '';
    buscador.title = 'Buscar en la tabla...';
  }
}


//-----------------------------------------Funcion Editar---------------------------------------------------------

function activarEdicion() {
  const elementosEditables = document.querySelectorAll('.elementoEditable');
  const estadoActual = obtenerEstadoEdicion();

  // 🔧 Si estamos saliendo del modo edición, restablecer todos los campos editables
  if (estaModoEdicion()) {
    restablecerCamposEditables();
  }

  // Alternar el estado del botón usando la función auxiliar
  alternarModoEdicion();

  // Aplicar el toggle a todos los elementos editables
  elementosEditables.forEach(elemento => {
    elemento.classList.toggle('toggleHiddenEdicion');
  });
  
  console.log('Toggle aplicado a', elementosEditables.length, 'elementos. Nuevo estado:', obtenerEstadoEdicion());
}

// 🔧 Función para restablecer todos los campos que están siendo editados
function restablecerCamposEditables() {
  console.log('Restableciendo campos editables...');
  
  // 💾 Primero restaurar los valores originales de todas las filas en edición
  const filasEditadas = document.querySelectorAll('tr');
  filasEditadas.forEach(fila => {
    // Si la fila tiene campos de edición activos, restaurar valores originales
    if (fila.querySelector('.inputEdit, .selectEdit')) {
      restaurarValoresOriginales(fila);
      // Limpiar el registro de esta fila ya que se cancela la edición
      limpiarRegistroValoresOriginales(fila);
    }
  });
  
  // Restablecer botones de "Guardar" a "Editar"
  const botonesGuardar = document.querySelectorAll('.guardarBtn');
  botonesGuardar.forEach(btn => {
    btn.textContent = 'Editar';
    btn.style.backgroundColor = ''; // Quitar color verde
    btn.setAttribute('class', 'editBtn');
    btn.removeAttribute('id'); // Remover id guardarBtn si existe
  });
  
  console.log('Campos restablecidos y valores originales restaurados');
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
  
  // 🔍 Aplicar filtro de búsqueda después del ordenamiento
  aplicarFiltroActual();
  
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
        
        // Aplicar gotitas de color al modelo en el modal
        function aplicarGotitaPorModelo(modelo) {
          // Gotitas negras para modelos específicos
          if (modelo === 'W9008MC' || modelo === 'MC9008' || modelo === 'W1332AC' || modelo === 'CF287JC' || modelo === '976YC K' || modelo === 'W2110X' || modelo === 'W1330XC' || modelo === 'CF287XC' || modelo === 'CF258XC' || modelo === 'CF226JC') {
            return `${modelo} <span style="color: #000000; font-size: 1.2em; margin-left: 5px;">●</span>`;
          }
          // Gotita cyan para 976YC C y W2111X
          else if (modelo === '976YC C' || modelo === 'W2111X') {
            return `${modelo} <span style="color: #00BFFF; font-size: 1.2em; margin-left: 5px;">●</span>`;
          }
          // Gotita magenta para 976YC M y W2113X
          else if (modelo === '976YC M' || modelo === 'W2113X') {
            return `${modelo} <span style="color: #FF1493; font-size: 1.2em; margin-left: 5px;">●</span>`;
          }
          // Gotita amarilla para 976YC Y y W2112X
          else if (modelo === '976YC Y' || modelo === 'W2112X') {
            return `${modelo} <span style="color: #FFD700; font-size: 1.2em; margin-left: 5px;">●</span>`;
          }
          return modelo;
        }
        
        const modeloConGotita = aplicarGotitaPorModelo(toner.modelo);
        
        row.innerHTML = `
        <td>${toner.tipo}</td>
        <td>${modeloConGotita}</td>
        <td>${toner.tij}</td>
        <td>${toner.fecha.slice(0, 10)}</td>
        <td class="eliminar-td ${toner.consumibleID}"><button class="eliminar-btn">X</button></td>
      `;
        tbody.appendChild(row);
      });
    } else {

      console.log("Noooo Entro al for each de toner especifico")
      
      // Aplicar gotitas de color al modelo en el modal (caso único)
      function aplicarGotitaPorModelo(modelo) {
        // Gotitas negras para modelos específicos
        if (modelo === 'W9008MC' || modelo === 'MC9008' || modelo === 'W1332AC' || modelo === 'CF287JC' || modelo === '976YC K' || modelo === 'W2110X' || modelo === 'W1330XC' || modelo === 'CF287XC' || modelo === 'CF258XC' || modelo === 'CF226JC') {
          return `${modelo} <span style="color: #000000; font-size: 1.2em; margin-left: 5px;">●</span>`;
        }
        // Gotita cyan para 976YC C y W2111X
        else if (modelo === '976YC C' || modelo === 'W2111X') {
          return `${modelo} <span style="color: #00BFFF; font-size: 1.2em; margin-left: 5px;">●</span>`;
        }
        // Gotita magenta para 976YC M y W2113X
        else if (modelo === '976YC M' || modelo === 'W2113X') {
          return `${modelo} <span style="color: #FF1493; font-size: 1.2em; margin-left: 5px;">●</span>`;
        }
        // Gotita amarilla para 976YC Y y W2112X
        else if (modelo === '976YC Y' || modelo === 'W2112X') {
          return `${modelo} <span style="color: #FFD700; font-size: 1.2em; margin-left: 5px;">●</span>`;
        }
        return modelo;
      }
      
      const modeloConGotita = aplicarGotitaPorModelo(tonerEspecifico.modelo);
      
      const row = document.createElement('tr'); 
      row.innerHTML = `
      <td>${tonerEspecifico.tipo}</td>
      <td>${modeloConGotita}</td>
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

// 📋 **************************Funciones para Eventos de Auditoría************************

// Variable para caché de eventos
let cacheEventos = null;

/**
 * Función auxiliar para obtener el nombre de la impresora a la que pertenece un consumible
 * (Solo para uso en detalles del modal)
 */
function obtenerNombreImpresoraPorConsumible(consumibleId) {
  if (!cacheConsumibles || !consumibleId) {
    return `Tóner #${consumibleId}`;
  }
  
  // Buscar el consumible en el caché
  const consumible = cacheConsumibles.find(cons => 
    cons.consumibleID == consumibleId || cons.id == consumibleId || cons.ID == consumibleId
  );
  
  if (consumible) {
    const impresoraId = consumible.impresoraID || consumible.impresoraId || consumible.ImpresoraId;
    if (impresoraId) {
      const nombreImpresora = obtenerNombreImpresoraPorId(impresoraId);
      return `${nombreImpresora} (Tóner)`;
    }
  }
  
  return `Tóner #${consumibleId}`;
}

/**
 * Función principal para cargar la tabla de eventos
 */
function cargarTablaEventos() {
  console.log('Cargando tabla de eventos...');
  
  // Cambiar el título
  tituloH2.textContent = 'Eventos de Auditoría';
  
  // Ocultar botones inferiores (no aplicables para eventos - solo lectura)
  botonADD.style.display = 'none';
  editarBtn.style.display = 'none';
  
  // Aplicar estilos activos
  btnImpresora.classList.remove('active');
  btnConsumible.classList.remove('active');
  btnEventos.classList.add('active');
  btnInventario.classList.remove('active');
  
  // Actualizar navegación móvil
  updateMobileNavigation('eventos');
  
  // Restaurar barra de búsqueda superior
  const contenedorBuscadorPrincipal = document.getElementById('contenedorBuscadorPrincipal');
  if (contenedorBuscadorPrincipal) {
    contenedorBuscadorPrincipal.style.display = 'flex';
  }
  
  // Ocultar inventario y restaurar tabla
  const tableContainer = document.getElementById('tableContainer');
  const inventarioContainer = document.getElementById('inventarioContainer');
  if (inventarioContainer) inventarioContainer.style.display = 'none';
  tableContainer.style.display = 'block';
  
  // Obtener eventos de auditoría
  getEventosDeAuditoria();
}

/**
 * Obtener eventos de auditoría directamente de la base de datos
 */
async function getEventosDeAuditoria() {
  try {
    // Si hay caché válido, usarlo
    if (cacheEventos) {
      mostrarTablaEventos(cacheEventos);
      return;
    }
    
    console.log('Obteniendo eventos de auditoría desde base de datos...');
    
    // Asegurar que las impresoras estén cargadas para mostrar nombres
    if (!cacheImpresoras) {
      console.log('Cargando impresoras para mostrar nombres en eventos...');
      try {
        const impresorasResponse = await fetch(buildApiUrl('/impresora'));
        const impresorasData = await impresorasResponse.json();
        cacheImpresoras = impresorasData.impresoras || impresorasData;
        console.log('✅ Impresoras cargadas para eventos');
      } catch (error) {
        console.warn('⚠️ No se pudieron cargar impresoras para eventos:', error);
      }
    }
    
    // Asegurar que los consumibles estén cargados para mostrar nombres en detalles
    if (!cacheConsumibles) {
      console.log('Cargando consumibles para mostrar nombres en detalles...');
      try {
        const consumiblesResponse = await fetch(buildApiUrl('/consumible'));
        const consumiblesData = await consumiblesResponse.json();
        cacheConsumibles = consumiblesData.consumibles || consumiblesData;
        console.log('✅ Consumibles cargados para detalles');
      } catch (error) {
        console.warn('⚠️ No se pudieron cargar consumibles para detalles:', error);
      }
    }
    
    // Primero intentar con la versión normal
    let response;
    try {
      response = await fetch(buildApiUrl('/eventos-auditoria?limit=100'));
    } catch (error) {
      console.log('Versión normal falló, intentando versión simple...');
      // Si falla, usar la versión simple
      response = await fetch(buildApiUrl('/eventos-auditoria-simple?limit=100'));
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Eventos de auditoría obtenidos:', data);
    
    // Guardar en caché
    cacheEventos = data || [];
    
    // Mostrar la tabla
    mostrarTablaEventos(cacheEventos);
    
  } catch (error) {
    console.error('Error obteniendo eventos de auditoría:', error);
    
    // Mostrar mensaje de error en la tabla
    tabla.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; color: #e74c3c; padding: 20px;">
          <i class="fas fa-exclamation-triangle"></i>
          Error cargando eventos de auditoría: ${error.message}
          <br><small>Verifica que la tabla EventosAuditoria existe en la base de datos</small>
        </td>
      </tr>
    `;
  }
}

/**
 * Función auxiliar para obtener el nombre de la impresora por ID
 */
function obtenerNombreImpresoraPorId(impresoraId) {
  if (!cacheImpresoras || !impresoraId) {
    return `Impresora #${impresoraId}`;
  }
  
  const impresora = cacheImpresoras.find(imp => imp.impresoraID == impresoraId);
  if (impresora && impresora.nombre && impresora.nombre[0]) {
    return impresora.nombre[0];
  }
  
  return `Impresora #${impresoraId}`;
}

/**
 * Mostrar los eventos de auditoría en la tabla
 */
function mostrarTablaEventos(eventos) {
  console.log('Mostrando tabla de eventos con', eventos.length, 'eventos');
  
  // Crear encabezado específico para eventos
  const encabezado = `
    <tr>
      <th style="color: #ffffff !important;">ID</th>
      <th style="color: #ffffff !important;">Fecha/Hora</th>
      <th style="color: #ffffff !important;">Tipo</th>
      <th style="color: #ffffff !important;">Recurso</th>
      <th style="color: #ffffff !important;">Usuario</th>
      <th style="color: #ffffff !important;">Resultado</th>
      <th style="color: #ffffff !important;">Cambios</th>
      <th style="color: #ffffff !important;">Acciones</th>
    </tr>
  `;
  
  // Crear filas de datos
  let filas = '';
  
  if (eventos.length === 0) {
    filas = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 20px; color: #7f8c8d;">
          <i class="fas fa-info-circle"></i>
          No hay eventos de auditoría disponibles
        </td>
      </tr>
    `;
  } else {
    eventos.forEach(evento => {
      // Manejar diferentes nombres de columnas de forma flexible
      const auditoriaId = evento.AuditoriaID || evento.id || evento.ID || 'N/A';
      const tipo = evento.Tipo || evento.tipo || evento.Type || 'UNKNOWN';
      const recurso = evento.Recurso || evento.recurso || evento.Resource || 'unknown';
      const recursoId = evento.RecursoId || evento.recursoId || evento.ResourceId || 'N/A';
      const usuario = evento.UsuarioNombre || evento.usuario || evento.User || evento.UsuarioId || 'Sistema';
      const resultado = evento.Resultado || evento.resultado || evento.Result || evento.Status || 'UNKNOWN';
      const mensaje = evento.Mensaje || evento.mensaje || evento.Message || '';
      
      // Manejar fecha de forma flexible
      let fecha = 'N/A';
      if (evento.CreadoEn) fecha = new Date(evento.CreadoEn).toLocaleString('es-MX');
      else if (evento.FechaHora) fecha = new Date(evento.FechaHora).toLocaleString('es-MX');
      else if (evento.Fecha) fecha = new Date(evento.Fecha).toLocaleString('es-MX');
      else if (evento.Created) fecha = new Date(evento.Created).toLocaleString('es-MX');
      else if (evento.CreatedAt) fecha = new Date(evento.CreatedAt).toLocaleString('es-MX');
      else if (evento.Timestamp) fecha = new Date(evento.Timestamp).toLocaleString('es-MX');
      
      // Parsear detalles JSON si existe
      let totalCambios = '-';
      try {
        const detallesTexto = evento.Detalles || evento.detalles || evento.Details || null;
        if (detallesTexto) {
          const detalles = JSON.parse(detallesTexto);
          totalCambios = detalles.totalCambios || detalles.cambiosDetectados ? Object.keys(detalles.cambiosDetectados).length : '-';
        }
      } catch (e) {
        // Si no se puede parsear, mostrar '-'
      }
      
      const resultadoFormateado = resultado === 'SUCCESS' ? 
        '<span style="color: #27ae60;"><i class="fas fa-check-circle"></i> Éxito</span>' :
        '<span style="color: #e74c3c;"><i class="fas fa-times-circle"></i> Error</span>';
      
      // Determinar el color del tipo de evento
      let tipoColor = '#3498db'; // azul por defecto
      if (tipo.includes('CREATE')) tipoColor = '#27ae60'; // verde
      if (tipo.includes('UPDATE')) tipoColor = '#f39c12'; // naranja
      if (tipo.includes('DELETE')) tipoColor = '#e74c3c'; // rojo
      
      // Obtener el nombre apropiado del recurso
      let nombreRecurso = '';
      if (recurso === 'impresora' && recursoId && recursoId !== 'N/A') {
        nombreRecurso = obtenerNombreImpresoraPorId(recursoId);
      } else {
        nombreRecurso = `${recurso} #${recursoId}`;
      }
      
      filas += `
        <tr data-evento-id="${auditoriaId}">
          <td>${auditoriaId}</td>
          <td>${fecha}</td>
          <td>
            <span style="color: ${tipoColor}; font-weight: bold;">
              ${tipo.replace('_', ' ')}
            </span>
          </td>
          <td>
            <i class="fas fa-${recurso === 'impresora' ? 'print' : 'tint'}"></i>
            ${nombreRecurso}
          </td>
          <td>${usuario}</td>
          <td>${resultadoFormateado}</td>
          <td>
            ${totalCambios !== '-' ? `<span class="badge-eventos">${totalCambios}</span>` : '-'}
          </td>
          <td>
            <button class="btn-detalle-evento" data-evento-id="${auditoriaId}">
              <i class="fas fa-eye"></i> Ver
            </button>
          </td>
        </tr>
      `;
    });
  }
  
  // Actualizar la tabla
  tabla.innerHTML = encabezado + filas;
  
  // Forzar color blanco en encabezados después del renderizado
  setTimeout(() => {
    const headers = tabla.querySelectorAll('th');
    headers.forEach(th => {
      th.style.color = '#ffffff';
      th.style.setProperty('color', '#ffffff', 'important');
    });
    
    // Forzar color principal en botones "Ver"
    const botonesVer = tabla.querySelectorAll('.btn-detalle-evento');
    botonesVer.forEach(btn => {
      btn.style.setProperty('background', '#00669c', 'important');
      btn.style.setProperty('color', 'white', 'important');
    });
  }, 100);
  
  // Agregar event listeners para los botones de detalle
  agregarEventListenersEventos();
}

/**
 * Agregar event listeners específicos para eventos
 */
function agregarEventListenersEventos() {
  const botonesDetalle = document.querySelectorAll('.btn-detalle-evento');
  
  botonesDetalle.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const eventoId = e.target.closest('button').dataset.eventoId;
      mostrarDetalleEvento(eventoId);
    });
  });
}

/**
 * Mostrar detalles completos de un evento
 */
function mostrarDetalleEvento(eventoId) {
  const evento = cacheEventos.find(e => e.AuditoriaID == eventoId);
  
  if (!evento) {
    alert('Evento no encontrado');
    return;
  }
  
  // Parsear detalles JSON
  let detalles = null;
  try {
    if (evento.Detalles) {
      detalles = JSON.parse(evento.Detalles);
    }
  } catch (e) {
    console.error('Error parseando detalles:', e);
  }
  
  // Preparar el contenido del modal con los detalles
  let detalleHTML = `
    <div class="evento-detail-modal">
      <div class="evento-header">
        <h3><i class="fas fa-clipboard-list"></i> Detalle del Evento #${evento.AuditoriaID}</h3>
        <p><strong>Fecha:</strong> ${new Date(evento.CreadoEn || evento.FechaHora).toLocaleString('es-MX')}</p>
      </div>
      
      <div class="evento-info">
        <div class="info-row">
          <span class="label">Tipo:</span>
          <span class="value">${evento.Tipo}</span>
        </div>
        <div class="info-row">
          <span class="label">Recurso:</span>
          <span class="value">${
            evento.Recurso === 'impresora' ? 
              obtenerNombreImpresoraPorId(evento.RecursoId) : 
              evento.Recurso === 'consumible' ? 
                obtenerNombreImpresoraPorConsumible(evento.RecursoId) :
                `${evento.Recurso} #${evento.RecursoId}`
          }</span>
        </div>
        <div class="info-row">
          <span class="label">Usuario:</span>
          <span class="value">${evento.UsuarioNombre || 'Sistema'}</span>
        </div>
        <div class="info-row">
          <span class="label">IP:</span>
          <span class="value">${evento.IP || 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="label">Resultado:</span>
          <span class="value">${evento.Resultado}</span>
        </div>
        <div class="info-row">
          <span class="label">Mensaje:</span>
          <span class="value">${evento.Mensaje || 'N/A'}</span>
        </div>
      </div>
  `;
  
  // Agregar detalles específicos si existen
  if (detalles && detalles.cambiosDetectados) {
    detalleHTML += `
      <div class="changes-section">
        <h4><i class="fas fa-exchange-alt"></i> Cambios Realizados</h4>
        <div class="changes-grid">
    `;
    
    Object.entries(detalles.cambiosDetectados).forEach(([campo, cambio]) => {
      detalleHTML += `
        <div class="change-item">
          <div class="field-name">${campo}</div>
          <div class="change-values">
            <span class="old-value">
              <i class="fas fa-arrow-left"></i>
              ${cambio.anterior || 'N/A'}
            </span>
            <span class="new-value">
              <i class="fas fa-arrow-right"></i>
              ${cambio.nuevo || 'N/A'}
            </span>
          </div>
        </div>
      `;
    });
    
    detalleHTML += `
        </div>
      </div>
    `;
  } else if (detalles) {
    // Mostrar detalles raw si no hay cambiosDetectados
    detalleHTML += `
      <div class="raw-details">
        <h4><i class="fas fa-code"></i> Detalles Raw</h4>
        <pre class="json-display">${JSON.stringify(detalles, null, 2)}</pre>
      </div>
    `;
  }
  
  detalleHTML += `
      <div class="evento-actions">
        <button id="btnCerrarModalEvento" class="btn-close">
          <i class="fas fa-times"></i> Cerrar
        </button>
      </div>
    </div>
  `;
  
  // Mostrar el modal
  mostrarModalEvento(detalleHTML);
}

/**
 * Mostrar modal con contenido de evento
 */
function mostrarModalEvento(contenido) {
  let modal = document.getElementById('eventoDetailModal');
  
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'eventoDetailModal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }
  
  modal.innerHTML = `
    <div class="modal-content evento-modal">
      ${contenido}
    </div>
  `;
  
  modal.style.display = 'flex';
  
  // Agregar event listener al botón cerrar
  setTimeout(() => {
    const btnCerrar = document.getElementById('btnCerrarModalEvento');
    if (btnCerrar) {
      btnCerrar.addEventListener('click', cerrarModalEvento);
    }
  }, 50);
  
  // Cerrar modal con tecla Escape
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      cerrarModalEvento();
    }
  };
  
  // Remover listeners previos y agregar nuevos
  document.removeEventListener('keydown', window.modalEscapeHandler);
  window.modalEscapeHandler = handleEscape;
  document.addEventListener('keydown', handleEscape);
  
  // Cerrar modal al hacer clic fuera
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      cerrarModalEvento();
    }
  });
}

/**
 * Cerrar modal de evento
 */
function cerrarModalEvento() {
  const modal = document.getElementById('eventoDetailModal');
  if (modal) {
    modal.style.display = 'none';
    
    // Limpiar event listeners para evitar memory leaks
    const btnCerrar = document.getElementById('btnCerrarModalEvento');
    if (btnCerrar) {
      btnCerrar.removeEventListener('click', cerrarModalEvento);
    }
    
    // Remover listener de escape
    if (window.modalEscapeHandler) {
      document.removeEventListener('keydown', window.modalEscapeHandler);
      window.modalEscapeHandler = null;
    }
    
    // Opcional: remover el modal del DOM completamente
    // modal.remove();
  }
}

// Hacer la función disponible globalmente
window.cerrarModalEvento = cerrarModalEvento;

// Función para invalidar caché cuando sea necesario
function invalidarCacheEventos() {
  cacheEventos = null;
  console.log('Caché de eventos invalidado');
}

// 📊 **************************Funciones para Inventario************************

/**
 * Función principal para cargar el inventario de tóners
 */
function cargarInventario() {
  console.log('Cargando inventario...');
  
  // Cambiar el título
  tituloH2.textContent = 'Inventario de Tóners';
  
  // Ocultar botones inferiores (no aplicables para inventario - solo lectura)
  botonADD.style.display = 'none';
  editarBtn.style.display = 'none';
  
  // Ocultar la barra de búsqueda superior (no necesaria en inventario)
  const contenedorBuscadorPrincipal = document.getElementById('contenedorBuscadorPrincipal');
  if (contenedorBuscadorPrincipal) {
    contenedorBuscadorPrincipal.style.display = 'none';
  }
  
  // Ocultar la tabla principal y mostrar contenedor de inventario
  const tableContainer = document.getElementById('tableContainer');
  const inventarioContainer = document.getElementById('inventarioContainer');
  
  tableContainer.style.display = 'none';
  inventarioContainer.style.display = 'block';
  
  // Aplicar estilos activos
  btnImpresora.classList.remove('active');
  btnConsumible.classList.remove('active');
  btnEventos.classList.remove('active');
  btnInventario.classList.add('active');
  
  // Actualizar navegación móvil
  updateMobileNavigation('inventario');
  
  // Cargar datos del inventario
  getInventarioData();
}

/**
 * Obtener datos del inventario y generar métricas
 */
async function getInventarioData() {
  try {
    // Mostrar indicador de carga
    const inventarioContainer = document.getElementById('inventarioContainer');
    inventarioContainer.innerHTML = `
      <div class="loading-message" style="text-align: center; padding: 40px; color: var(--colorPrincipal);">
        <i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
        Cargando datos del inventario...
      </div>
    `;
    
    // Cargar impresoras y consumibles
    await Promise.all([
      cargarImpresorasParaInventario(),
      cargarConsumiblesParaInventario()
    ]);
    
    // Generar y mostrar el inventario
    mostrarInventario();
    
  } catch (error) {
    console.error('❌ Error al obtener datos del inventario:', error);
    const inventarioContainer = document.getElementById('inventarioContainer');
    inventarioContainer.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        Error al cargar el inventario: ${error.message}
        <br><small>Revisa la consola para más detalles</small>
      </div>
    `;
  }
}

/**
 * Cargar impresoras para el inventario
 */
async function cargarImpresorasParaInventario() {
  try {
    if (!cacheImpresoras) {
      const response = await fetch(buildApiUrl('/impresora'));
      const data = await response.json();
      cacheImpresoras = data.impresoras || data;
      console.log('✅ Impresoras cargadas para inventario:', cacheImpresoras.length);
    }
  } catch (error) {
    console.error('❌ Error cargando impresoras:', error);
    throw error;
  }
}

/**
 * Cargar consumibles para el inventario
 */
async function cargarConsumiblesParaInventario() {
  try {
    if (!cacheConsumibles) {
      const response = await fetch(buildApiUrl('/consumible'));
      const data = await response.json();
      cacheConsumibles = data.consumibles || data;
      console.log('✅ Consumibles cargados para inventario:', cacheConsumibles.length);
    }
  } catch (error) {
    console.error('❌ Error cargando consumibles:', error);
    throw error;
  }
}

/**
 * Mostrar el inventario con métricas y gráficos
 */
function mostrarInventario() {
  console.log('Generando vista de inventario...');
  
  // Generar estadísticas
  const estadisticas = generarEstadisticasInventario();
  
  // Obtener el contenedor de inventario
  const inventarioContainer = document.getElementById('inventarioContainer');
  
  // Crear HTML del inventario
  const inventarioHTML = `
    <div class="inventario-stats">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-tint"></i>
        </div>
        <div class="stat-info">
          <h3>${estadisticas.totalToners}</h3>
          <p>Total tóners</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-print"></i>
        </div>
        <div class="stat-info">
          <h3>${estadisticas.totalImpresoras}</h3>
          <p>Impresoras</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-palette"></i>
        </div>
        <div class="stat-info">
          <h3>${estadisticas.modelos.length}</h3>
          <p>Modelos diferentes</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-shield-alt"></i>
        </div>
        <div class="stat-info">
          <h3>${Math.round((Object.keys(estadisticas.tonersPorImpresora).length / estadisticas.totalImpresoras) * 100)}%</h3>
          <p>Cobertura de stock</p>
        </div>
      </div>
    </div>
    
    <div class="inventario-tables">
      <div class="table-section">
        <h3><i class="fas fa-exclamation-triangle" style="color: #e74c3c;"></i> Impresoras críticas sin stock</h3>
        <div class="search-container">
          <input type="text" id="busquedaCriticos" class="search-input" placeholder="Buscar impresora crítica...">
          <i class="fas fa-search search-icon"></i>
        </div>
        <div class="tabla-inventario-wrapper">
          <div id="tablaTonersCriticos">Cargando impresoras críticas...</div>
        </div>
      </div>
      
      <div class="table-section">
        <h3><i class="fas fa-list"></i> Tóners por modelo</h3>
        <div class="search-container">
          <input type="text" id="busquedaModelos" class="search-input" placeholder="Buscar modelo...">
          <i class="fas fa-search search-icon"></i>
        </div>
        <div class="tabla-inventario-wrapper">
          ${generarTablaTonersPorModelo(estadisticas)}
        </div>
      </div>
      
      <div class="table-section">
        <h3><i class="fas fa-building"></i> Tóners por impresora</h3>
        <div class="search-container">
          <input type="text" id="busquedaImpresoras" class="search-input" placeholder="Buscar impresora...">
          <i class="fas fa-search search-icon"></i>
        </div>
        <div class="tabla-inventario-wrapper">
          ${generarTablaTonersPorImpresora(estadisticas)}
        </div>
      </div>
    </div>
  `;
  
  inventarioContainer.innerHTML = inventarioHTML;
  
  // Agregar event listeners para las búsquedas independientes
  agregarEventListenersBusquedaInventario();
  
  // Cargar impresoras críticas sin stock de forma asíncrona
  cargarTonersCriticos();
}

/**
 * Agregar event listeners para las búsquedas independientes
 */
function agregarEventListenersBusquedaInventario() {
  const busquedaCriticos = document.getElementById('busquedaCriticos');
  const busquedaModelos = document.getElementById('busquedaModelos');
  const busquedaImpresoras = document.getElementById('busquedaImpresoras');
  
  if (busquedaCriticos) {
    busquedaCriticos.addEventListener('input', () => {
      filtrarTablaInventario('busquedaCriticos', '.inventario-tables .table-section:first-child .styled-table tbody tr');
    });
  }
  
  if (busquedaModelos) {
    busquedaModelos.addEventListener('input', () => {
      filtrarTablaInventario('busquedaModelos', '.inventario-tables .table-section:nth-child(2) .styled-table tbody tr');
    });
  }
  
  if (busquedaImpresoras) {
    busquedaImpresoras.addEventListener('input', () => {
      filtrarTablaInventario('busquedaImpresoras', '.inventario-tables .table-section:nth-child(3) .styled-table tbody tr');
    });
  }
}

/**
 * Filtrar tabla de inventario
 */
function filtrarTablaInventario(inputId, filaSelector) {
  const input = document.getElementById(inputId);
  const filtro = input.value.toLowerCase().trim();
  const filas = document.querySelectorAll(filaSelector);
  
  let filasVisibles = 0;
  
  filas.forEach(fila => {
    const textoFila = fila.textContent.toLowerCase();
    const esVisible = textoFila.includes(filtro);
    fila.style.display = esVisible ? '' : 'none';
    if (esVisible) filasVisibles++;
  });
  
  // Actualizar indicador visual
  actualizarIndicadorBusquedaInventario(input, filtro !== '', filasVisibles, filas.length);
}

/**
 * Actualizar indicador visual de búsqueda
 */
function actualizarIndicadorBusquedaInventario(input, activo, visibles, total) {
  if (activo) {
    input.style.backgroundColor = '#e3f2fd';
    input.style.border = '2px solid #2196f3';
    input.title = `Mostrando ${visibles} de ${total} resultados`;
  } else {
    input.style.backgroundColor = '';
    input.style.border = '';
    input.title = '';
  }
}

/**
 * Generar estadísticas del inventario
 */
function generarEstadisticasInventario() {
  console.log('🔍 Generando estadísticas de inventario...');
  
  const stats = {
    totalToners: cacheConsumibles ? cacheConsumibles.length : 0,
    totalImpresoras: cacheImpresoras ? cacheImpresoras.length : 0,
    modelos: [],
    tonersPorModelo: {},
    tonersPorImpresora: {},
    promedioTonersPorImpresora: 0
  };
  
  // Contar los tóners por cada impresora y modelo
  if (cacheConsumibles && cacheImpresoras) {
    cacheConsumibles.forEach((consumible) => {
      // Contar por modelo de tóner
      const modelo = consumible.modelo || 'Sin modelo';
      stats.tonersPorModelo[modelo] = (stats.tonersPorModelo[modelo] || 0) + 1;
      
      if (!stats.modelos.includes(modelo)) {
        stats.modelos.push(modelo);
      }
      
      // Contar por impresora
      const impresora = consumible.nombre || 'Sin nombre';
      stats.tonersPorImpresora[impresora] = (stats.tonersPorImpresora[impresora] || 0) + 1;
    });
    
    // Calcular promedio
    const impresorasConToners = Object.keys(stats.tonersPorImpresora).length;
    stats.promedioTonersPorImpresora = impresorasConToners > 0 ? stats.totalToners / impresorasConToners : 0;
  }
  
  return stats;
}

/**
 * Generar tabla de tóners por modelo
 */
function generarTablaTonersPorModelo(estadisticas) {
  let html = `
    <table class="styled-table">
      <thead>
        <tr>
          <th><i class="fas fa-tag"></i> Modelo</th>
          <th><i class="fas fa-tint"></i> Cantidad</th>
          <th><i class="fas fa-percentage"></i> Porcentaje</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  // Verificar si hay datos
  const entriesModelos = Object.entries(estadisticas.tonersPorModelo);
  if (entriesModelos.length === 0) {
    html += `
      <tr>
        <td colspan="3" style="text-align: center; color: #6c757d; padding: 30px;">
          <i class="fas fa-inbox"></i><br>
          No se encontraron tóners por modelo
        </td>
      </tr>
    `;
  } else {
    // Ordenar modelos por cantidad (descendente)
    const modelosOrdenados = entriesModelos.sort(([,a], [,b]) => b - a);
    
    modelosOrdenados.forEach(([modelo, cantidad]) => {
      const porcentaje = Math.round((cantidad / estadisticas.totalToners) * 100);
      html += `
        <tr>
          <td><strong>${modelo}</strong></td>
          <td><span class="badge-count">${cantidad}</span></td>
          <td>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${porcentaje}%"></div>
              <span class="progress-text">${porcentaje}%</span>
            </div>
          </td>
        </tr>
      `;
    });
  }
  
  html += `
      </tbody>
    </table>
  `;
  
  return html;
}

/**
 * Generar tabla de tóners por impresora
 */
function generarTablaTonersPorImpresora(estadisticas) {
  let html = `
    <table class="styled-table">
      <thead>
        <tr>
          <th><i class="fas fa-print"></i> Impresora</th>
          <th><i class="fas fa-tint"></i> Tóners</th>
          <th><i class="fas fa-chart-line"></i> Estado</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  // Verificar si hay datos
  const entriesImpresoras = Object.entries(estadisticas.tonersPorImpresora);
  if (entriesImpresoras.length === 0) {
    html += `
      <tr>
        <td colspan="3" style="text-align: center; color: #6c757d; padding: 30px;">
          <i class="fas fa-inbox"></i><br>
          No se encontraron tóners por impresora
        </td>
      </tr>
    `;
  } else {
    // Ordenar impresoras por cantidad de tóners (descendente)
    const impresorasOrdenadas = entriesImpresoras.sort(([,a], [,b]) => b - a);
    
    impresorasOrdenadas.forEach(([nombre, cantidad]) => {
      // Determinar estado basado en la regla solicitada:
      // - si tiene más de 1 tóner -> 'Stock Alto'
      // - si tiene exactamente 1 tóner -> 'Stock Normal'
      // - si no tiene ninguno -> 'Sin stock' (caso añadido para claridad)
      let estadoClase = 'estado-normal';
      let estadoTexto = 'Stock Normal';
      let estadoIcono = 'check-circle';

      if (cantidad > 1) {
        estadoClase = 'estado-alto';
        estadoTexto = 'Stock Alto';
        estadoIcono = 'arrow-up';
      } else if (cantidad === 1) {
        estadoClase = 'estado-normal';
        estadoTexto = 'Stock Normal';
        estadoIcono = 'check-circle';
      } else if (cantidad === 0) {
        estadoClase = 'estado-vacio';
        estadoTexto = 'Sin stock';
        estadoIcono = 'times-circle';
      }
      
      html += `
        <tr>
          <td><strong>${nombre}</strong></td>
          <td><span class="badge-count">${cantidad}</span></td>
          <td>
            <span class="estado-badge ${estadoClase}">
              <i class="fas fa-${estadoIcono}"></i>
              ${estadoTexto}
            </span>
          </td>
        </tr>
      `;
    });
  }
  
  html += `
      </tbody>
    </table>
  `;
  
  return html;
}
/**
 * Cargar y mostrar impresoras críticas sin stock
 */
async function cargarTonersCriticos() {
  console.log('🚨 Cargando impresoras críticas sin stock...');
  
  const tablaContainer = document.getElementById('tablaTonersCriticos');
  
  try {
    // Mostrar mensaje de carga
    tablaContainer.innerHTML = `
      <div style="text-align: center; padding: 20px; color: #6c757d;">
        <i class="fas fa-spinner fa-spin"></i> Analizando niveles de tóner...
      </div>
    `;
    
    // Obtener impresoras críticas
    const impresorasCriticas = await obtenerImpresorasCriticas();
    
    // Generar y mostrar la tabla
    tablaContainer.innerHTML = generarTablaTonersCriticos(impresorasCriticas);
    
  } catch (error) {
    console.error('❌ Error cargando impresoras críticas:', error);
    tablaContainer.innerHTML = `
      <div style="text-align: center; padding: 20px; color: #e74c3c;">
        <i class="fas fa-exclamation-triangle"></i> Error cargando impresoras críticas
      </div>
    `;
  }
}

/**
 * Obtener impresoras con situación crítica de tóner
 */
async function obtenerImpresorasCriticas() {
  console.log('🔍 Analizando impresoras para encontrar situaciones críticas...');
  
  const impresorasCriticas = [];
  
  if (!cacheImpresoras || !cacheConsumibles) {
    console.warn('⚠️ No hay datos de impresoras o consumibles disponibles');
    return impresorasCriticas;
  }
  
  // Crear mapa de stock por impresora (contar tóners disponibles)
  const stockPorImpresora = {};
  cacheConsumibles.forEach(consumible => {
    const nombre = consumible.nombre || 'Sin nombre';
    stockPorImpresora[nombre] = (stockPorImpresora[nombre] || 0) + 1;
  });
  
  // Analizar cada impresora
  for (const impresora of cacheImpresoras) {
    const nombre = impresora.nombre?.[0] || 'Sin nombre';
    const stockDisponible = stockPorImpresora[nombre] || 0;
    
    // Solo verificar si no tiene stock disponible
    if (stockDisponible === 0) {
      try {
        // Obtener nivel de tóner actual
        const nivelToner = await obtenerNivelTonerImpresora(impresora);
        
        // Verificar si algún cartucho está por debajo del 10%
        if (tieneNivelCritico(nivelToner)) {
          impresorasCriticas.push({
            ...impresora,
            nivelToner: nivelToner,
            stockDisponible: stockDisponible,
            nombreCompleto: nombre
          });
        }
      } catch (error) {
        console.warn(`⚠️ No se pudo obtener nivel de tóner para ${nombre}:`, error.message);
      }
    }
  }
  
  console.log(`🚨 Encontradas ${impresorasCriticas.length} impresoras en situación crítica`);
  return impresorasCriticas;
}

/**
 * Obtener nivel de tóner de una impresora específica
 */
async function obtenerNivelTonerImpresora(impresora) {
  const ip = impresora.direccionIp || '';
  const modelo = (impresora.modelo || '').toUpperCase();
  
  // Determinar el tipo de función a usar según el modelo
  const modelosColor = ['E47528', 'P57750 XC', 'MFP M283fdw', 'MFP P57750', 'MFP P57750 XC', 'MFP E47528'];
  const modelo408 = ["408dn", "MFP M232", "MFP 432", "M432", "MFP M432"];
  
  const esColor = modelosColor.some(m => modelo.includes(m.toUpperCase()));
  const es408 = modelo408.some(m => modelo.includes(m.toUpperCase()));
  
  let obtenerToner;
  if (esColor) {
    obtenerToner = obtenerNivelTonerColor;
  } else if (es408) {
    obtenerToner = obtenerNivelTonerScraping;
  } else {
    obtenerToner = obtenerNivelTonerNegro;
  }
  
  return await obtenerToner(ip);
}

/**
 * Verificar si un nivel de tóner está en estado crítico (<10%)
 */
function tieneNivelCritico(nivelToner) {
  const UMBRAL_CRITICO = 10;
  
  // Si es un número simple (monocromático)
  if (typeof nivelToner === 'number' || (!isNaN(nivelToner) && nivelToner !== null && nivelToner !== undefined && nivelToner !== '')) {
    const nivel = Number(nivelToner);
    return !isNaN(nivel) && nivel < UMBRAL_CRITICO;
  }
  
  // Si es un objeto (color o scraping)
  if (typeof nivelToner === 'object' && nivelToner !== null) {
    const valores = Object.values(nivelToner);
    return valores.some(valor => {
      const nivel = Number(valor);
      return !isNaN(nivel) && nivel < UMBRAL_CRITICO;
    });
  }
  
  // Si es string o no válido, no es crítico
  return false;
}

/**
 * Generar tabla HTML para impresoras críticas sin stock
 */
function generarTablaTonersCriticos(impresorasCriticas) {
  let html = `
    <table class="styled-table">
      <thead>
        <tr>
          <th><i class="fas fa-print"></i> Impresora</th>
          <th><i class="fas fa-network-wired"></i> IP</th>
          <th><i class="fas fa-tint"></i> Nivel Actual</th>
          <th><i class="fas fa-exclamation-circle"></i> Estado</th>
          <th><i class="fas fa-warehouse"></i> Stock</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  if (impresorasCriticas.length === 0) {
    html += `
      <tr>
        <td colspan="5" style="text-align: center; color: #27ae60; padding: 30px;">
          <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
          ¡Excelente! No hay impresoras en situación crítica
        </td>
      </tr>
    `;
  } else {
    impresorasCriticas.forEach(impresora => {
      const ip = impresora.direccionIp || 'N/A';
      const nivelTexto = formatearNivelCritico(impresora.nivelToner);
      
      html += `
        <tr style="background-color: #ffeaa7; border-left: 4px solid #e74c3c;">
          <td>
            <strong>${impresora.nombreCompleto}</strong>
            <br><small>${impresora.serie}</small>
          </td>
          <td>${ip}</td>
          <td>${nivelTexto}</td>
          <td>
            <span style="color: #e74c3c; font-weight: bold;">
              <i class="fas fa-exclamation-triangle"></i>
              CRÍTICO
            </span>
          </td>
          <td>
            <span style="color: #e74c3c; font-weight: bold;">
              <i class="fas fa-times-circle"></i>
              Sin stock
            </span>
          </td>
        </tr>
      `;
    });
  }
  
  html += `
      </tbody>
    </table>
  `;
  
  return html;
}

/**
 * Formatear nivel de tóner para mostrar en la tabla críticos
 */
function formatearNivelCritico(nivelToner) {
  // Si es un número simple
  if (typeof nivelToner === 'number' || (!isNaN(nivelToner) && nivelToner !== null && nivelToner !== undefined && nivelToner !== '')) {
    const nivel = Number(nivelToner);
    if (!isNaN(nivel)) {
      return `<span style="color: ${nivel < 10 ? '#e74c3c' : '#27ae60'}; font-weight: bold;">${nivel}%</span>`;
    }
  }
  
  // Si es un objeto (color o scraping)
  if (typeof nivelToner === 'object' && nivelToner !== null) {
    const colores = {
      black: 'K',
      cyan: 'C', 
      magenta: 'M',
      yellow: 'Y',
      image: 'Tambor'
    };
    
    let resultado = [];
    for (const [color, valor] of Object.entries(nivelToner)) {
      const nivel = Number(valor);
      if (!isNaN(nivel)) {
        const etiqueta = colores[color] || color;
        const colorTexto = nivel < 10 ? '#e74c3c' : '#f39c12';
        resultado.push(`<span style="color: ${colorTexto}; font-weight: bold;">${etiqueta}: ${nivel}%</span>`);
      }
    }
    return resultado.join('<br>');
  }
  
  return '<span style="color: #6c757d;">No disponible</span>';
}


// ====================== FUNCIONALIDAD M�VIL ======================

/**
 * Actualizar título móvil
 */
function updateMobileTitle(title) {
  const mobileTitle = document.getElementById('mobileTitle');
  if (mobileTitle && window.innerWidth <= 768) {
    mobileTitle.textContent = title;
  }
}

/**
 * Actualizar navegación móvil activa
 */
function updateMobileNavigation(section) {
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
  mobileNavItems.forEach(item => item.classList.remove('active'));
  
  const mobileImpresoras = document.getElementById('mobileImpresoras');
  const mobileConsumibles = document.getElementById('mobileConsumibles');
  const mobileInventario = document.getElementById('mobileInventario');
  const mobileEventos = document.getElementById('mobileEventos');
  
  switch(section) {
    case 'impresoras':
      if (mobileImpresoras) mobileImpresoras.classList.add('active');
      updateMobileTitle('Impresoras');
      break;
    case 'consumibles':
      if (mobileConsumibles) mobileConsumibles.classList.add('active');
      updateMobileTitle('Consumibles');
      break;
    case 'inventario':
      if (mobileInventario) mobileInventario.classList.add('active');
      updateMobileTitle('Inventario');
      break;
    case 'eventos':
      if (mobileEventos) mobileEventos.classList.add('active');
      updateMobileTitle('Eventos');
      break;
  }
}

/**
 * Inicializar funcionalidad m�vil
 */
function initMobileFunctionality() {
  const mobileHeader = document.querySelector('.mobile-header');
  const mobileNav = document.querySelector('.mobile-nav');
  const sidebar = document.querySelector('.sidebar');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  
  // Detectar si es m�vil
  function isMobile() {
    return window.innerWidth <= 768;
  }
  
  // Mostrar/ocultar elementos m�viles
  function toggleMobileElements() {
    if (isMobile()) {
      mobileHeader.style.display = 'flex';
      mobileNav.style.display = 'flex';
      sidebar.classList.remove('mobile-open');
    } else {
      mobileHeader.style.display = 'none';
      mobileNav.style.display = 'none';
      sidebar.classList.remove('mobile-open');
      mobileOverlay.classList.remove('active');
    }
  }
  
  // Abrir/cerrar sidebar m�vil
  function toggleMobileSidebar() {
    if (isMobile()) {
      sidebar.classList.toggle('mobile-open');
      mobileOverlay.classList.toggle('active');
    }
  }
  
  // Cerrar sidebar m�vil
  function closeMobileSidebar() {
    if (isMobile()) {
      sidebar.classList.remove('mobile-open');
      mobileOverlay.classList.remove('active');
    }
  }
  
  // Event listeners
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileSidebar);
  }
  
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileSidebar);
  }
  
  // Cerrar sidebar al hacer clic en un enlace del men�
  const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', closeMobileSidebar);
  });
  
  // Navegaci�n m�vil
  const mobileImpresoras = document.getElementById('mobileImpresoras');
  const mobileConsumibles = document.getElementById('mobileConsumibles');
  const mobileInventario = document.getElementById('mobileInventario');
  const mobileEventos = document.getElementById('mobileEventos');
  
  if (mobileImpresoras) {
    mobileImpresoras.addEventListener('click', (e) => {
      e.preventDefault();
      updateMobileNavigation('impresoras');
      cargarTablaimpresoras();
    });
  }
  
  if (mobileConsumibles) {
    mobileConsumibles.addEventListener('click', (e) => {
      e.preventDefault();
      updateMobileNavigation('consumibles');
      cargarTablaConsumibles();
    });
  }
  
  if (mobileInventario) {
    mobileInventario.addEventListener('click', (e) => {
      e.preventDefault();
      updateMobileNavigation('inventario');
      cargarInventario();
    });
  }
  
  if (mobileEventos) {
    mobileEventos.addEventListener('click', (e) => {
      e.preventDefault();
      updateMobileNavigation('eventos');
      cargarTablaEventos();
    });
  }
  
  // Hacer tablas m�s m�vil-friendly
  function optimizeTablesForMobile() {
    if (isMobile()) {
      const tables = document.querySelectorAll('.styled-table');
      tables.forEach(table => {
        // Agregar clase para estilos m�viles
        table.classList.add('mobile-optimized');
        
        // Crear versi�n simplificada para m�vil si es necesario
        if (table.querySelectorAll('th').length > 5) {
          table.classList.add('mobile-essential');
        }
      });
    }
  }
  
  // Ajustar modales para m�vil
  function optimizeModalsForMobile() {
    if (isMobile()) {
      const modals = document.querySelectorAll('.modal-content');
      modals.forEach(modal => {
        modal.style.width = '95%';
        modal.style.maxHeight = '90vh';
        modal.style.margin = '5vh auto';
      });
    }
  }
  
  // Inicializar en carga de p�gina
  toggleMobileElements();
  
  // Actualizar en resize
  window.addEventListener('resize', () => {
    toggleMobileElements();
    optimizeTablesForMobile();
    optimizeModalsForMobile();
  });
  
  // Mejorar manejo táctil en móviles
  function enhanceTouchInteraction() {
    if (isMobile()) {
      // Delegación de eventos para mejor detección táctil en tóner
      document.addEventListener('touchend', (e) => {
        const target = e.target;
        const tonerCell = target.classList.contains('toner-cell') ? target : target.closest('.toner-cell');
        
        if (tonerCell && !e.defaultPrevented) {
          e.preventDefault();
          console.log('🎯 Touch en celda de tóner detectado!');
          
          // Crear evento sintético para consultaToner
          const syntheticEvent = {
            target: tonerCell,
            preventDefault: () => {},
            stopPropagation: () => {}
          };
          consultaToner(syntheticEvent);
        }
      }, { passive: false });
    }
  }
  
  // Inicializar mejoras táctiles
  enhanceTouchInteraction();
  
  // Inicializar navegaci�n m�vil con impresoras por defecto
  updateMobileNavigation('impresoras');
}

// Inicializar cuando el DOM est� listo
document.addEventListener('DOMContentLoaded', initMobileFunctionality);

// Tambi�n inicializar si ya est� cargado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileFunctionality);
} else {
  initMobileFunctionality();
}
