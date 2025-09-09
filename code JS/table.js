

//Seleccionamos elementos del DOOM
const btnImpresora = document.getElementById('btnImpresoras');
const btnConsumible = document.getElementById('btnConsumibles');
const tabla = document.querySelector('.styled-table');
const botonADD = document.querySelector('.addBtn');
let botonGuardar;
const tituloH2 = document.querySelector('#TituloH2');





//Funcion para cargar listeners
cargarEventListeners();

function cargarEventListeners() {

  document.addEventListener('DOMContentLoaded', getImpresoras);
  btnImpresora.addEventListener('click', cargarTablaimpresoras);
  btnConsumible.addEventListener('click', cargarTablaConsumibles);
  tabla.addEventListener('click', modificacionElemento);
  //botonGuardar,addEventListener('click', enviarCambios);

}


//*********************************************************************************************************Funciones*************************************************************************//

//***********************Funciona para modificar la estructura de la tabla a impresoras *************************************/
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

//***********************************uncion para obtener e insertar las impresoras en la tabla principal****************************************
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

//************************Funcion para  modificar la estrutura de la tabla a consumibles*****************************/
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

//**************************************funcion para obtener e insertar los consumibles en la tabla principal**************************************
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

//*************************funcion para Editar y eliminar elementos***********************************//

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
    const id = target.value;
    // Lógica para eliminar el elemento con el ID correspondiente
    console.log('Eliminar elemento con ID:', id);

  } else if (target.classList.contains('guardarBtn')) {

    console.log('Guardando cambios...');

    enviarCambios(e);

  }
}

//**************************Funcion para mofificar los campos de en la edicion de una impresora************************
function modificarCamposImpresora(elementosTd) {

  //Recorrer los elementos td y convertirlos en campos editables
  elementosTd.forEach((elemento, index) => {

    //Hacer los pimeros 5 campos en input
    if (elemento.firstElementChild === null && index <= 4) {

      elemento.innerHTML = `<input class="inputEdit" type="text" value="${elemento.textContent}">`;

      //Convertir el campo area en un select
    } else if (elemento.firstElementChild === null && index === 5) {


      elemento.innerHTML = `
                        <select class="selectEdit" name="area" id="selectArea" required>
                          <option value="">${elemento.textContent}</option>
                          <!-- Agrega más opciones según necesites -->
                        </select>`
      //cargar las areas
      getAreasEdit(elemento.firstElementChild);

      //Convertir el campo contrato en un select
    } else if (elemento.firstElementChild === null && index === 6) {
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
  console.log('funcion getAreasEdit');
  console.log(elemento.textContent.trim());
  fetch('http://localhost:3000/area')
    .then(response => response.json()) // Convierte la respuesta a JSON
    .then(data => { // en data se guardan la información de la consulta
      console.log('Áreas cargadas:');

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

function getContratosEdit(elemento) {
  fetch('http://localhost:3000/contrato')
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

    switch (index){

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
                                <option value="w9008">w9008</option>
                                <option value="w1330xc">w1330xc</option>
                                <option value="w1330x">w1330x</option>
                                <option value="cf258xc">cf258xc</option>
                                <option value="cf258x">cf258x</option>
                                <option value="cf280xc">cf280xc</option>
                                <option value="cf280x">cf280x</option>
                                <option value="ce285ac">ce285ac</option>
                                <option value="131a Y">131a Y</option>
                                <option value="131a M">131a M</option>
                                <option value="131a C">131a C</option>
                                <option value="131a K">131a K</option>
                                <option value="ce255xc">ce255xc</option>
                                <option value="976yc Y">976yc Y</option>
                                <option value="976yc M">976yc M</option>
                                <option value="976yc C">976yc C</option>
                                <option value="976yc K">976yc K</option>
                                <option value="w9090mc Y">w9090mc Y</option>
                                <option value="w9090mc M">w9090mc M</option>
                                <option value="w9090mc C">w9090mc C</option>
                                <option value="w9090mc K">w9090mc K</option>
                                <option value="206X Y">206X Y</option>
                                <option value="206X M">206X M</option>
                                <option value="206X C">206X C</option>
                                <option value="206X K">206X K</option>
                                <option value="w132ac">w132ac</option>
                                <option value="cf287jc">cf287jc</option>
                            </select>`;

        break;
      
      case 2:
        elemento.innerHTML = `<input class="inputEdit" type="text" value="${elemento.textContent}">`;
        break;
      
      case  4: 
        elemento.innerHTML = `
                          <select class="selectEdit" name="impresoraID" id="seleImpresora" required>
                            <option value = "${elemento.textContent}"> ${elemento.textContent}</option>
                            <!-- Agregar mas opciones segun necesites -->
                            
                          </select>`;

        break;
        

    }

  })





}




//****************************************Funciones para enviar los cambios a la BD************************************/
async function enviarCambios(e) {
  e.preventDefault();
  console.log('enviando cambios');
  //Seleccionar los elementos editables
  const abuelo = e.target.parentElement.parentElement;
  const elementosTd = abuelo.querySelectorAll('td');


  //***************************************Modificiacion impresoras**************************************** */
  //Verificar si se esta modificando una impresora o un consumible
  if (tituloH2.textContent === 'Agregar impresora') {


    const inputSerie = elementosTd[0].firstElementChild.value;
    const inputNombre = elementosTd[1].firstElementChild.value;
    const inputMarca = elementosTd[2].firstElementChild.value;
    const inputModelo = elementosTd[3].firstElementChild.value;
    const inputIp = elementosTd[4].firstElementChild.value;
    const selectArea = elementosTd[5].firstElementChild.value;
    const selectContrato = elementosTd[6].firstElementChild.value;

    //Validar que no haya campos vacios

    if (inputSerie.trim() === '' || inputNombre.trim() === '' || inputMarca.trim() === '' || inputModelo.trim() === '' || inputIp.trim() === '' || selectArea === 'n' || selectContrato === '') {

      elementosTd.forEach(elemento => {
        if (elemento.firstElementChild.value.trim() === '') {
          elemento.firstElementChild.style.border = '2px solid red';
        } else {
          elemento.firstElementChild.style.border = '1px solid #ccc';
        }
      });
      alert('Por favor, complete todos los campos antes de guardar.');


    } else {


      //Crear el objeto con los nuevos datos
      const datosActualizados = {
        id: parseInt(e.target.value),
        serie: elementosTd[0].firstElementChild.value,
        nombre: elementosTd[1].firstElementChild.value,
        marca: elementosTd[2].firstElementChild.value,
        modelo: elementosTd[3].firstElementChild.value,
        direccionIp: elementosTd[4].firstElementChild.value,
        areaID: parseInt(selectArea),
        contratoID: parseInt(selectContrato)
      };

      console.log('Datos actualizados:', datosActualizados);
      //convertimos el objeto a JSON
      const datosJSON = JSON.stringify(datosActualizados);
      console.log(datosJSON);

      //Enviar los datos a la API
      try {
        const response = await fetch(`http://localhost:3000/impresora/${datosActualizados.id}`, {
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
        getImpresoras();

      } catch (error) {
        console.error('Error al enviar los datos:', error);
        alert('Error al actualizar la impresora');
      }
    }

    //***************************************Modificiacion consumibles**************************************** */
  } else if (tituloH2.textContent === 'Agregar consumible') {

  }
}