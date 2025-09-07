

//Seleccionamos elementos del DOOM
const btnImpresora = document.getElementById('btnImpresoras');
const btnConsumible = document.getElementById('btnConsumibles');
const tabla = document.querySelector('.styled-table');
const botonADD = document.querySelector('.addBtn');
let botonGuardar;
const tituloH2 = document.querySelector('#TituloH2');

//Cargar listeners
cargarEventListeners();

function cargarEventListeners() {

  document.addEventListener('DOMContentLoaded', getImpresoras);
  btnImpresora.addEventListener('click', cargarTablaimpresoras);
  btnConsumible.addEventListener('click', cargarTablaConsumibles);
  tabla.addEventListener('click', modificacionElemento);
  botonGuardar,addEventListener('click', enviarCambios);

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
          <td><button type="submit" value="${impresora.impresoraID}" class="deleteBtn">Eliminar</button></td>
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
          <td><button  value="${consumible.consumibleID}" class="editBtn">Editar</button></td>
          <td><button type="submit" value="${consumible.consumibleID}" class="deleteBtn">Eliminar</button></td>
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

  //prevenir el comportamiento por defecto
  e.preventDefault();


  const target = e.target;
  console.log(target);
  //Identificar si se dio click en el boton de editar o eliminar

  if (target.classList.contains('editBtn')) {
    const id = target.value;
    // Lógica para editar el elemento con el ID correspondiente
    e.target.textContent = 'Guardar';
    e.target.style.backgroundColor = 'green';
    e.target.setAttribute('id', 'guardarBtn');
    botonGuardar = document.getElementById('guardarBtn');
    const abuelo = target.parentElement.parentElement;
    const elementosTd = abuelo.querySelectorAll('td');
    console.log('estos son los elementos td');
    console.log(elementosTd);

    ///Indexs
    //0  Serie
    //1  Nombre
    //2  Marca
    //3  Modelo
    //4  IP
    //5  Área
    //6  Contrato
    elementosTd.forEach((elemento, index) => {

      if (elemento.firstElementChild === null && index <= 4) {
        elemento.innerHTML = `<input class="inputEdit" type="text" value="${elemento.textContent}">`;
      } else if (elemento.firstElementChild === null && index === 5) {
        //value = elemento.firstElementChild.value;
      
        elemento.innerHTML = `
                        <select class="selectEdit" name="area" id="selectArea" required>
                          <option value="${elemento.value}">${elemento.textContent}</option>
                          <!-- Agrega más opciones según necesites -->
                        </select>`
        //cargar las areas
        getAreas(elemento);
      }else if (elemento.firstElementChild === null && index === 6) {
        elemento.innerHTML = `
                        <select class="selectEdit" name="contrato" id="selectContrato" required>
                          <option value="${elemento.value}">${elemento.textContent}</option>
                          <!-- Agrega más opciones según necesites -->
                        </select>`

        //cargar los contratos
        getContratos(elemento);
      }
      


    });
  } else if (target.classList.contains('deleteBtn')) {
    const id = target.value;
    // Lógica para eliminar el elemento con el ID correspondiente
    console.log('Eliminar elemento con ID:', id);
  }
}

//funcion para obtener las areas

//Consultar Areas
function getAreas(elemento) {
  fetch('http://localhost:3000/area')
    .then(response => response.json()) // Convierte la respuesta a JSON
    .then(data => { // en data se guardan la información de la consulta
      console.log(data);
      data.forEach(area => {
        const option = document.createElement('option');
        option.value = area.areaID;
        option.textContent = area.nombre;
        elemento.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error al cargar Areas:', error);
    });
}

//Consultar contratos

function getContratos(elemento) {
  fetch('http://localhost:3000/contrato')
    .then(response => response.json()) // Convierte la respuesta a JSON
    .then(data => { // en data se guardan la información de la consulta
      data.forEach(contrato => {
        const option = document.createElement('option');
        option.value = contrato.contratoID;
        option.textContent = contrato.nombre;
        elemento.appendChild(option);
      });

    })
    .catch(error => {
      console.error('Error al cargar Contratos:', error);
    });
}

//funcion para enviar los cambios a la BD
async function enviarCambios(e) {
  e.preventDefault();
  console.log('enviando cambios');
  //Seleccionar los elementos editables
  const abuelo = e.target.parentElement.parentElement;
  const elementosTd = abuelo.querySelectorAll('td');
  console.log(elementosTd);
  

  //Verificar si se esta modificando una impresora o un consumible
  if(tituloH2.textContent==='Agregar impresora' && e.target.textContent==='Guardar'){

    const inputSerie = elementosTd[0].firstElementChild.value;
    const inputNombre = elementosTd[1].firstElementChild.value;
    const inputMarca = elementosTd[2].firstElementChild.value;
    const inputModelo = elementosTd[3].firstElementChild.value;
    const inputIp = elementosTd[4].firstElementChild.value;
    const selectArea = elementosTd[5].firstElementChild.value;
    const selectContrato = elementosTd[6].firstElementChild.value;

    //Validar que no haya campos vacios

    if(inputSerie.trim() ==='' || inputNombre.trim() ==='' || inputMarca.trim() ==='' || inputModelo.trim() ==='' || inputIp.trim() === ''|| selectArea ==='n' || selectContrato ===''){

      alert('Por favor, complete todos los campos antes de guardar.');
    

    }else{
      //Crear el objeto con los nuevos datos
      const datosActualizados = {
        id: e.target.value,
        serie: elementosTd[0].firstElementChild.value,
        nombre: elementosTd[1].firstElementChild.value,
        marca: elementosTd[2].firstElementChild.value,
        modelo: elementosTd[3].firstElementChild.value,
        direccionIp: elementosTd[4].firstElementChild.value,
        areaID: elementosTd[5].firstElementChild.value,
        contratoID: elementosTd[6].firstElementChild.value
      };
      console.log(datosActualizados);


    }
    
 
  }else if(tituloH2.textContent==='Agregar consumible'){

  }
}