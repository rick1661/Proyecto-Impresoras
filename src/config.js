  const tbody = document.querySelector('.styled-table tbody');
      tbody.innerHTML = ''; // Limpia el contenido actual
      data.forEach(impresora => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${impresora.erie}</td>
          <td>${impresora.nombre}</td>
          <td>${impresora.marca}</td>
          <td>${impresora.modelo}</td>
          <td>${impresora.ip}</td>
          <td>${impresora.area}</td>
          <td>${impresora.contrato}</td>
        `;
        tbody.appendChild(row);
      });