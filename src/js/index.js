document.addEventListener('DOMContentLoaded', () => {
  // 1. Control del menú móvil (hamburguesa)
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  // 2. Control del modal de registro con efecto blur
  const modal = document.getElementById('registerModal');
  const openModalButtons = document.querySelectorAll('[data-open-modal]');
  const closeModalButton = document.getElementById('closeModal');
  const registerForm = document.getElementById('registerForm');

  if (modal) {
    // Abrir modal al hacer clic en los botones de "Get Started" o "Sign Up Now"
    openModalButtons.forEach(button => {
      button.addEventListener('click', () => {
        modal.classList.add('active');
      });
    });

    // Cerrar modal con el botón de la "X"
    if (closeModalButton) {
      closeModalButton.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    // Cerrar modal si hacen clic fuera de la tarjeta (en el fondo oscuro)
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  // 3. Manejo seguro del formulario de registro
  if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const nombre = document.getElementById('nombre')?.value || '';
      alert(`¡Gracias por registrarte, ${nombre}! Pronto nos pondremos en contacto.`);
      if (modal) {
        modal.classList.remove('active');
      }
      registerForm.reset();
    });
  }
});