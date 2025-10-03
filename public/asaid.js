
// Selecciona el elemento de la barra lateral
const sidebar = document.querySelector(".sidebar");

// Selecciona el botón para colapsar/expandir la barra lateral
const sidebarToggler = document.querySelector(".sidebar-toggler");

// Selecciona el botón para mostrar/ocultar el menú en vista móvil
const menuToggler = document.querySelector(".menu-toggler");

//Selecciona el contenedor de la tabla
const contenedorPrincipal = document.querySelector(".main-content ");




// Asegúrate de que estos valores coincidan con los del CSS
let collapsedSidebarHeight = "56px"; // Altura de la barra lateral colapsada en móvil
let fullSidebarHeight = "calc(100vh - 32px)"; // Altura de la barra lateral en pantallas grandes


// Alterna el estado colapsado de la barra lateral al hacer clic en el botón
sidebarToggler.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
  contenedorPrincipal.classList.toggle("expanded");

});

// Actualiza la altura de la barra lateral y el texto del botón de menú
const toggleMenu = (isMenuActive) => {
  // Si el menú está activo, ajusta la altura al contenido; si no, usa la altura colapsada
  sidebar.style.height = isMenuActive ? `${sidebar.scrollHeight}px` : collapsedSidebarHeight;
  // Cambia el texto del botón de menú entre "close" y "menu"
  menuToggler.querySelector("span").innerText = isMenuActive ? "close" : "menu";
}


// Alterna la clase 'menu-active' y ajusta la altura al hacer clic en el botón de menú
menuToggler.addEventListener("click", () => {
  toggleMenu(sidebar.classList.toggle("menu-active"));
  contenedorPrincipal.classList.toggle("contracted");

});


// (Opcional): Ajusta la altura de la barra lateral al cambiar el tamaño de la ventana
window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024) {
    // En pantallas grandes, usa la altura completa
    sidebar.style.height = fullSidebarHeight;
  } else {
    // En pantallas pequeñas, quita el colapso y ajusta la altura automáticamente
    sidebar.classList.remove("collapsed");
    sidebar.style.height = "auto";
    toggleMenu(sidebar.classList.contains("menu-active"));
    

  }
});