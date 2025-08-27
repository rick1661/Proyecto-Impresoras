
document.addEventListener('DOMContentLoaded', function() {
  getImpresoras();
});


function getImpresoras() {
  fetch('http://localhost:3000/impresora')
    .then(response => response.json()) // Convierte la respuesta a JSON
    .then(data => { // en data se guardan la información de la consulta
      console.log(data);
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