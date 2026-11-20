import './main.js';
import {
    agregarPreferenciaBeneficiario,
    actualizarAlergiaBeneficiario,
    eliminarPreferenciaBeneficiario,
    obtenerAlergiasBeneficiario,
    obtenerPreferenciasBeneficiario,
} from './datos.js';

const preferenciasLista = document.getElementById('preferencias-list');
const preferenciasCount = document.getElementById('preferencias-count');
const alergiasLista = document.getElementById('alergias-list');
const alergiasCount = document.getElementById('alergias-count');
const feedback = document.getElementById('bienestar-feedback');
const dialogo = document.getElementById('preferencia-dialog');
const formulario = document.getElementById('preferencia-form');
const feedbackFormulario = document.getElementById('preferencia-form-feedback');
let preferencias = [];
let alergias = [];

const sidebarToggle = document.getElementById('toggle-sidebar-btn');
sidebarToggle?.addEventListener('click', () => {
    const collapsed = document.body.classList.toggle('home-layout--sidebar-collapsed');
    sidebarToggle.setAttribute('aria-expanded', String(!collapsed));
    sidebarToggle.setAttribute('aria-label', collapsed ? 'Expandir menú' : 'Contraer menú');
    if (sidebarToggle.firstElementChild) {
        sidebarToggle.firstElementChild.textContent = collapsed ? '›' : '‹';
    }
});

function crearTexto(elemento, clase, texto) {
    const nodo = document.createElement(elemento);
    nodo.className = clase;
    nodo.textContent = String(texto ?? '');
    return nodo;
}

function mostrarError(mensaje) {
    feedback.textContent = mensaje;
    feedback.hidden = false;
}

function renderizarPreferencias() {
    preferenciasCount.textContent = `${preferencias.length} ${preferencias.length === 1 ? 'preferencia registrada' : 'preferencias registradas'}`;
    preferenciasLista.replaceChildren();

    if (preferencias.length === 0) {
        preferenciasLista.appendChild(
            crearTexto('p', 'bienestar-page__empty', 'Aún no tienes preferencias registradas. Puedes agregar una.')
        );
        return;
    }

    for (const preferencia of preferencias) {
        const tarjeta = document.createElement('article');
        tarjeta.className = 'bienestar-page__preference';
        const encabezado = document.createElement('div');
        encabezado.className = 'bienestar-page__preference-heading';
        encabezado.appendChild(crearTexto('h3', '', preferencia.nombre));

        const quitar = document.createElement('button');
        quitar.className = 'bienestar-page__remove-preference';
        quitar.type = 'button';
        quitar.textContent = '×';
        quitar.title = `Quitar preferencia ${preferencia.nombre}`;
        quitar.setAttribute('aria-label', `Quitar preferencia ${preferencia.nombre}`);
        quitar.addEventListener('click', () => quitarPreferencia(preferencia.id));
        encabezado.appendChild(quitar);

        tarjeta.append(
            encabezado,
            crearTexto('p', '', preferencia.descripcion),
            crearTexto('p', 'bienestar-page__preference-applies', preferencia.aplica_a),
        );
        preferenciasLista.appendChild(tarjeta);
    }
}

function renderizarAlergias() {
    const declaradas = alergias.filter(alergia => alergia.declarada).length;
    alergiasCount.textContent = `${declaradas} ${declaradas === 1 ? 'declarada' : 'declaradas'}`;
    alergiasLista.replaceChildren();

    if (alergias.length === 0) {
        alergiasLista.appendChild(crearTexto('p', 'bienestar-page__empty', 'No hay alergias disponibles para mostrar.'));
        return;
    }

    for (const alergia of alergias) {
        const tarjeta = document.createElement('article');
        tarjeta.className = `bienestar-page__allergy${alergia.declarada ? ' bienestar-page__allergy--declared' : ''}`;
        tarjeta.appendChild(crearTexto('strong', 'bienestar-page__allergy-name', alergia.nombre));

        const estado = document.createElement('div');
        estado.className = 'bienestar-page__allergy-state';
        estado.appendChild(crearTexto('span', '', alergia.declarada ? 'Declarada' : 'Disponible para seleccionar'));

        const accion = document.createElement('button');
        accion.className = `bienestar-page__allergy-action${alergia.declarada ? ' bienestar-page__allergy-action--remove' : ''}`;
        accion.type = 'button';
        accion.textContent = alergia.declarada ? 'Quitar' : 'Declarar';
        accion.setAttribute('aria-label', `${alergia.declarada ? 'Quitar' : 'Declarar'} alergia a ${alergia.nombre}`);
        accion.addEventListener('click', () => cambiarAlergia(alergia.id, !alergia.declarada));
        estado.appendChild(accion);

        tarjeta.appendChild(estado);
        alergiasLista.appendChild(tarjeta);
    }
}

function renderizar() {
    renderizarPreferencias();
    renderizarAlergias();
}

async function recargarDatos() {
    [preferencias, alergias] = await Promise.all([
        obtenerPreferenciasBeneficiario(),
        obtenerAlergiasBeneficiario(),
    ]);
    renderizar();
}

async function quitarPreferencia(id) {
    feedback.hidden = true;
    try {
        await eliminarPreferenciaBeneficiario(id);
        await recargarDatos();
    } catch (error) {
        mostrarError(error instanceof Error ? error.message : 'No se pudo quitar la preferencia.');
    }
}

async function cambiarAlergia(id, declarada) {
    feedback.hidden = true;
    try {
        await actualizarAlergiaBeneficiario(id, declarada);
        await recargarDatos();
    } catch (error) {
        mostrarError(error instanceof Error ? error.message : 'No se pudo actualizar la alergia.');
    }
}

document.getElementById('preferencia-add').addEventListener('click', () => {
    feedbackFormulario.hidden = true;
    formulario.reset();
    dialogo.showModal();
});

document.getElementById('preferencia-dialog-close').addEventListener('click', () => dialogo.close());
document.getElementById('preferencia-dialog-cancel').addEventListener('click', () => dialogo.close());

formulario.addEventListener('submit', async evento => {
    evento.preventDefault();
    feedbackFormulario.hidden = true;
    if (!formulario.reportValidity()) return;

    const datos = new FormData(formulario);
    try {
        await agregarPreferenciaBeneficiario({
            nombre: datos.get('nombre'),
            descripcion: datos.get('descripcion'),
            aplica_a: datos.get('aplica_a'),
        });
        await recargarDatos();
        dialogo.close();
    } catch (error) {
        feedbackFormulario.textContent = error instanceof Error ? error.message : 'No se pudo guardar la preferencia.';
        feedbackFormulario.hidden = false;
    }
});

try {
    await recargarDatos();
} catch (error) {
    mostrarError(error instanceof Error ? error.message : 'No se pudieron cargar las preferencias y alergias.');
}
