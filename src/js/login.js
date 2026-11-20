import { api } from './api.js';
import { guardarSesion } from './sesion.js';
import { normalizarRol, rolesValidos } from './permisos.js';

const formulario = document.getElementById('form-login');
const mensajeError = document.getElementById('error-login');
const boton = formulario.querySelector('button[type="submit"]');
const textoBoton = boton.textContent;

formulario.addEventListener('submit', async evento => {
    evento.preventDefault();
    mensajeError.hidden = true;
    mensajeError.textContent = '';

    if (!formulario.reportValidity()) return;

    boton.disabled = true;
    boton.textContent = 'Entrando...';

    try {
        const datos = Object.fromEntries(new FormData(formulario));
        const respuesta = await api.post('/api/auth/login', datos);

        if (
            !respuesta
            || typeof respuesta.token !== 'string'
            || !respuesta.token
            || !respuesta.user
            || typeof respuesta.user !== 'object'
        ) {
            throw new Error('El servidor devolvió una respuesta de inicio de sesión inválida.');
        }

        const rol = normalizarRol(respuesta.user.role ?? respuesta.user.rol);
        if (!rolesValidos.includes(rol)) {
            throw new Error('El usuario no tiene un rol válido para acceder al sistema.');
        }

        guardarSesion(respuesta.token, respuesta.user);
        window.location.replace('./home.html');
    } catch (error) {
        mensajeError.textContent = error instanceof Error
            ? error.message
            : 'No se pudo iniciar sesión. Intenta de nuevo.';
        mensajeError.hidden = false;
    } finally {
        boton.disabled = false;
        boton.textContent = textoBoton;
    }
});
