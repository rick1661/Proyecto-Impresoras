element.classList.add('inputOk');
      fetch('http://localhost:3000/impresora/:id', {
        method: 'POST',
        body: formulario.target.element// Puedes pasar FormData directamente
      })
        .then(response => response.json())
        .then(data => {
          console.log('Respuesta del servidor:', data);
        })
        .catch(error => {
          console.error('Error al enviar el formulario:', error);
        });