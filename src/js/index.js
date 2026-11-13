// Lógica segura para el menú móvil y el modal de registro

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('#menuToggle');
    const navMenu = document.querySelector('#navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    const registerModal = document.querySelector('#registerModal');
    const openModalBtns = document.querySelectorAll('[data-open-modal]');
    const closeModalBtn = document.querySelector('#closeModal');
    const registerForm = document.querySelector('#registerForm');

    function abrirModal() {
        if (registerModal) {
            registerModal.classList.add('active');
        }
    }

    function cerrarModal() {
        if (registerModal) {
            registerModal.classList.remove('active');
        }
    }

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', abrirModal);
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', cerrarModal);
    }

    if (registerModal) {
        registerModal.addEventListener('click', (e) => {
            if (e.target === registerModal) {
                cerrarModal();
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('¡Registro exitoso!');
            cerrarModal();
            registerForm.reset();
        });
    }
});