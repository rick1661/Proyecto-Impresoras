//Seleccionar elementos del DOM
const modal = document.getElementById('modalForm');
const btn = document.getElementsByClassName('addImpresoraBtn')[0];
const span = document.querySelector('.close');

console.log("Click");
btn.onclick = function () {
    modal.style.display = 'block';

    // Cargar las áreas y contratos al abrir el modal
    getAreas();
    // Cargar las áreas y contratos al abrir el modal
    getContratos();



}
span.onclick = function () {
    modal.style.display = 'none';
}
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
        
    }
}

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