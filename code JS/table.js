

//Seleccionamos elementos del DOOM
const btnImpresora = document.getElementById('btnImpresoras');
const btnConsumible = document.getElementById('btnConsumibles');
const tabla = document.querySelector('.styled-table');
const botonADD = document.querySelector('.addBtn');


//Cargar listeners
cargarEventListeners();

function cargarEventListeners() {

  document.addEventListener('DOMContentLoaded', getImpresoras);
  btnImpresora.addEventListener('click', cargarTablaimpresoras);
  btnConsumible.addEventListener('click', cargarTablaConsumibles);
  tabla.addEventListener('click', modificacionElemento);

}
// Agregar evento click al botón de impresoras
function cargarTablaimpresoras() {

  // Establecer la sección a impresoras


  // Cambiar el contenido de la tabla para mostrar las columnas de impresoras  
  tabla.innerHTML = `
    <thead>
                <tr>
                    <th>Serie</th>
                    <th>Nombre</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>IP</th>
                    <th>Área</th>
                    <th>Contrato</th>
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

  // Cambiar el texto del botón para agregar impresoras
  botonADD.innerHTML = `<span>Agregar impresora</span>`;
  console.log('Botón de impresoras clickeado');

  // Llamar a la función para obtener e insertar las impresoras en la tabla
  getImpresoras();
};


function cargarTablaConsumibles() {

  // Establecer la sección a consumibles

  console.log('Botón de consumibles clickeado');

  // Cambiar el contenido de la tabla para mostrar las columnas de consumibles
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
                    <th>Eliminar</th>
                </tr>
            </thead>
            <tbody>
                <!-- Aquí puedes agregar filas de datos -->
                <tr>
                 
                </tr>
                <!-- Más filas aquí -->
            </tbody>`;
  // Cambiar el texto del botón para agregar consumibles
  botonADD.innerHTML = `<span>Agregar consumible</span>`;
  // Llamar a la función para obtener e insertar los consumibles en la tabla
  getConsumibles();

};
//----------------------------------------------Funciones---------------------------------------------//

//Funcion para obtener e insertar las impresoras en la tabla
function getImpresoras() {
  fetch('http://localhost:3000/impresora')
    .then(response => response.json()) // Convierte la respuesta a JSON
    .then(data => { // en data se guardan la información de la consulta
      //console.log(data);
      const tbody = document.querySelector('.styled-table tbody');
      tbody.innerHTML = ''; // Limpia el contenido actual
      data.forEach(impresora => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${impresora.serie}</td>
          <td>${impresora.nombre[0]}</td>
          <td>${impresora.marca}</td>
          <td>${impresora.modelo}</td>
          <td>${impresora.direccionIp}</td>
          <td>${impresora.nombre[1]}</td>
          <td>${impresora.nombre[2]}</td>
          <td><button value="${impresora.impresoraID}" class="editBtn">Editar</button></td>
          <td><button value="${impresora.impresoraID}" class="deleteBtn">Eliminar</button></td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error al cargar impresoras:', error);
    });
}

//funcion para obtener e insertar los consumibles en la tabla
function getConsumibles() {
  fetch('http://localhost:3000/consumible')
    .then(response => response.json()) // Convierte la respuesta a JSON
    .then(data => { // en data se guardan la información de la consulta
      console.log(data);
      const tbody = document.querySelector('.styled-table tbody');
      tbody.innerHTML = ''; // Limpia el contenido actual
      data.forEach(consumible => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${consumible.tipo}</td>
          <td>${consumible.modelo}</td>
          <td>${consumible.tij}</td>
          <td>${consumible.fecha.slice(0, 10)}</td>
          <td>${consumible.nombre}</td>
          <td>${consumible.serie}</td>
          <td><button value="${consumible.consumibleID}" class="editBtn">Editar</button></td>
          <td><button value="${consumible.consumibleID}" class="deleteBtn">Eliminar</button></td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error al cargar consumibles:', error);
    });
}

//funcion para Editar y eliminar elementos

function modificacionElemento(e) {
  console.log(e.target);
  console.log(e.targer.previousElementSibling);
  const target = e.target;
  if (target.classList.contains('editBtn')) {
    const id = target.value;
    // Lógica para editar el elemento con el ID correspondiente
    e.target.textContent =  'Guardar';
    e.target.style.backgroundColor = 'green';



    console.log('Editar elemento con ID:', id);
  } else if (target.classList.contains('deleteBtn')) {
    const id = target.value;
    // Lógica para eliminar el elemento con el ID correspondiente
    console.log('Eliminar elemento con ID:', id);
  }
}