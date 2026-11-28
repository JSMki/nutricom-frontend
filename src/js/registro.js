import { registrarCuenta } from './datos.js';

const formulario = document.getElementById('form-registro');
const tituloFormulario = document.getElementById('signup-form-title');
const botonesTipoCuenta = [...document.querySelectorAll('[data-account-type]')];
const feedback = document.getElementById('registro-feedback');
const botonEnviar = formulario.querySelector('[type="submit"]');
const textoBoton = botonEnviar.innerHTML;

const tiposCuenta = {
    beneficiario: {
        titulo: 'Datos de familia beneficiaria',
        campos: ['campo-integrantes'],
    },
    comercio: {
        titulo: 'Datos de comercio',
        campos: ['campo-nombre-comercial', 'campo-tipo-comercio'],
    },
    organizacion: {
        titulo: 'Datos de organización',
        campos: ['campo-nombre-organizacion', 'campo-tipo-organizacion'],
    },
};

let tipoCuentaActual = 'beneficiario';

function seleccionarTipoCuenta(tipoCuenta) {
    tipoCuentaActual = tipoCuenta;
    const configuracion = tiposCuenta[tipoCuenta];
    tituloFormulario.textContent = configuracion.titulo;

    botonesTipoCuenta.forEach(boton => {
        const seleccionado = boton.dataset.accountType === tipoCuenta;
        boton.classList.toggle('signup-type--selected', seleccionado);
        boton.setAttribute('aria-pressed', String(seleccionado));
    });

    document.querySelectorAll('.signup-field--conditional, #campo-integrantes').forEach(campo => {
        const visible = configuracion.campos.includes(campo.id);
        campo.hidden = !visible;
        campo.querySelector('input').required = visible;
    });
}

function mostrarFeedback(mensaje, esError = false) {
    feedback.classList.toggle('signup-feedback--error', esError);
    feedback.hidden = false;
    feedback.textContent = mensaje;
}

botonesTipoCuenta.forEach(boton => {
    boton.addEventListener('click', () => seleccionarTipoCuenta(boton.dataset.accountType));
});

formulario.addEventListener('input', () => {
    feedback.hidden = true;
});

formulario.addEventListener('submit', async evento => {
    evento.preventDefault();
    feedback.hidden = true;

    if (!formulario.reportValidity()) return;

    botonEnviar.disabled = true;
    botonEnviar.textContent = 'Creando cuenta...';

    try {
        const datos = Object.fromEntries(new FormData(formulario));
        await registrarCuenta({ ...datos, tipoCuenta: tipoCuentaActual });
        mostrarFeedback('Tu registro se guardó correctamente en este navegador.');
        formulario.reset();
        seleccionarTipoCuenta(tipoCuentaActual);
    } catch (error) {
        mostrarFeedback(error instanceof Error ? error.message : 'No se pudo crear la cuenta. Intenta de nuevo.', true);
    } finally {
        botonEnviar.disabled = false;
        botonEnviar.innerHTML = textoBoton;
    }
});

seleccionarTipoCuenta(tipoCuentaActual);
