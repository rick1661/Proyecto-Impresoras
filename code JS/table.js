//Seleccionamos elementos del DOOM
const btnImpresora = document.getElementById('btnImpresoras');
const btnConsumible = document.getElementById('btnConsumibles');
const tabla = document.querySelector('.styled-table');

// Agregar evento click al botón de impresoras
btnImpresora.addEventListener('click', function() {

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
                </tr>
            </thead>
            <tbody>
                <!-- Aquí puedes agregar filas de datos -->
                <tr>
                 
                </tr>
                <!-- Más filas aquí -->
            </tbody>`;

  console.log('Botón de impresoras clickeado');

  // Llamar a la función para obtener e insertar las impresoras en la tabla
  getImpresoras();
});

btnConsumible.addEventListener('click', function() {
  console.log('Botón de consumibles clickeado');
  
  // Cambiar el contenido de la tabla para mostrar las columnas de consumibles
  tabla.innerHTML = `
    <thead>
                <tr>
                    <th>Tipo</th>
                    <th>Modelo</th>
                    <th>Marca</th>
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
  // Llamar a la función para obtener e insertar los consumibles en la tabla
  getConsumibles();

});

document.addEventListener('DOMContentLoaded', function() {

   getImpresoras();
});

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
          <td>${consumible.marca}</td>
          <td>${consumible.tij}</td>
          <td>${consumible.fecha}</td>
          <td>${consumible.impresoraID}</td>
          <td>${consumible.serie}</td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error al cargar consumibles:', error);
    });
}