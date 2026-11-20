import { usuarioAutenticado } from './main.js';
import {
    ORGANIZACION_ACTUAL,
    obtenerDonacion,
    reclamarDonacion,
} from './datos.js';

const contenido = document.getElementById('claim-content');
const feedback = document.getElementById('claim-feedback');
const dialogo = document.getElementById('claim-confirmation');
const resumenDialogo = document.getElementById('claim-dialog-summary');
const botonConfirmar = document.getElementById('claim-confirm-button');
const parametros = new URLSearchParams(window.location.search);
const idDonacion = Number(parametros.get('id'));
const formatoNumero = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 });
let donacionActual = null;
const idOrganizacion = Number(
    usuarioAutenticado?.id_organizacion
    ?? usuarioAutenticado?.idOrganizacion
    ?? usuarioAutenticado?.organizacion?.id_organizacion
    ?? usuarioAutenticado?.organizacion?.id
    ?? ORGANIZACION_ACTUAL.id_organizacion,
);

const toggleSidebar = document.getElementById('toggle-sidebar-btn');
toggleSidebar?.addEventListener('click', () => {
    const collapsed = document.body.classList.toggle('home-layout--sidebar-collapsed');
    toggleSidebar.setAttribute('aria-expanded', String(!collapsed));
    toggleSidebar.setAttribute('aria-label', collapsed ? 'Expandir menú' : 'Contraer menú');
    if (toggleSidebar.firstElementChild) {
        toggleSidebar.firstElementChild.textContent = collapsed ? '›' : '‹';
    }
});

function crearElemento(etiqueta, clase, texto) {
    const elemento = document.createElement(etiqueta);
    if (clase) elemento.className = clase;
    if (texto !== undefined) elemento.textContent = String(texto);
    return elemento;
}

function formatearFecha(fecha) {
    if (!fecha) return '—';
    const [anio, mes, dia] = String(fecha).split('-').map(Number);
    if (!anio || !mes || !dia) return '—';
    return new Intl.DateTimeFormat('es-MX', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(anio, mes - 1, dia));
}

function mostrarFeedback(mensaje, tipo = 'error') {
    feedback.hidden = !mensaje;
    feedback.textContent = mensaje;
    feedback.className = `claim-feedback claim-feedback--${tipo}`;
}

function mostrarMensaje(mensaje, tipo = 'info') {
    const aviso = crearElemento('div', `claim-message claim-message--${tipo}`);
    aviso.append(
        crearElemento('p', '', mensaje),
        crearElemento('a', 'claim-button claim-button--secondary', 'Volver a donaciones disponibles'),
    );
    aviso.querySelector('a').href = './donaciones-disponibles.html';
    contenido.replaceChildren(aviso);
}

function crearDato(etiqueta, valor) {
    const contenedor = crearElemento('div', 'claim-donation__meta-item');
    contenedor.append(
        crearElemento('dt', '', etiqueta),
        crearElemento('dd', '', valor || 'No disponible'),
    );
    return contenedor;
}

function crearFilaAlimento(detalle, indice, compacta = false) {
    const fila = crearElemento('li', compacta ? 'claim-dialog__item' : 'claim-food-row');
    const informacion = crearElemento('div', compacta ? 'claim-dialog__item-main' : 'claim-food-row__main');
    informacion.append(
        crearElemento('strong', '', detalle.nombre_alimento ?? 'Alimento'),
        crearElemento(
            'span',
            '',
            `${formatoNumero.format(Number(detalle.cantidad) || 0)} ${detalle.abreviatura ?? 'unidad'}`,
        ),
    );

    const fechas = crearElemento('div', compacta ? 'claim-dialog__item-dates' : 'claim-food-row__dates');
    fechas.append(
        crearElemento('span', '', `Caducidad: ${formatearFecha(detalle.fecha_caducidad)}`),
        crearElemento('span', '', `Consumo preferente: ${formatearFecha(detalle.fecha_consumo_preferente)}`),
    );
    fila.append(
        crearElemento('span', compacta ? 'claim-dialog__item-index' : 'claim-food-row__index', String(indice + 1).padStart(2, '0')),
        informacion,
        fechas,
    );
    return fila;
}

function renderizarConfirmacion(donacion) {
    const folio = `DON-${String(donacion.id_donacion).padStart(4, '0')}`;
    const contenidoResumen = crearElemento('div', 'claim-dialog__donation');
    const comercio = crearElemento('div', 'claim-dialog__donation-header');
    comercio.append(
        crearElemento('span', 'claim-dialog__folio', folio),
        crearElemento('strong', '', donacion.comercio?.nombre_comercial ?? 'Comercio no disponible'),
    );
    contenidoResumen.append(
        comercio,
        crearElemento(
            'p',
            'claim-dialog__date',
            `${donacion.detalles?.length ?? 0} alimentos · Donado el ${formatearFecha(donacion.fecha_donacion)}`,
        ),
    );
    const alimentos = crearElemento('ul', 'claim-dialog__items');
    for (const [indice, detalle] of (donacion.detalles ?? []).entries()) {
        alimentos.appendChild(crearFilaAlimento(detalle, indice, true));
    }
    contenidoResumen.appendChild(alimentos);
    resumenDialogo.replaceChildren(contenidoResumen);
}

function mostrarDonacionNoDisponible() {
    mostrarMensaje(
        'Esta donación ya fue reclamada o ya no está disponible. No puedes confirmar su recepción.',
        'warning',
    );
}

function renderizarPagina(donacion) {
    const form = document.createElement('form');
    form.className = 'claim-form';
    const layout = crearElemento('div', 'claim-layout');
    const panel = crearElemento('section', 'claim-donation');
    panel.setAttribute('aria-labelledby', 'claim-donation-title');

    const panelHeader = crearElemento('header', 'claim-donation__header');
    const folio = crearElemento('span', 'claim-donation__folio', `DON-${String(donacion.id_donacion).padStart(4, '0')}`);
    const estado = crearElemento('span', 'claim-donation__status', 'Disponible');
    const titulo = crearElemento('h2', '', donacion.comercio?.nombre_comercial ?? 'Comercio no disponible');
    titulo.id = 'claim-donation-title';
    const comercioTipo = crearElemento('p', 'claim-donation__type', donacion.comercio?.tipo_comercio ?? 'Comercio donante');
    panelHeader.append(folio, estado, titulo, comercioTipo);

    const metadatos = document.createElement('dl');
    metadatos.className = 'claim-donation__meta';
    metadatos.append(
        crearDato('Fecha de donación', formatearFecha(donacion.fecha_donacion)),
        crearDato('Dirección', [donacion.comercio?.direccion, donacion.comercio?.colonia].filter(Boolean).join(', ')),
        crearDato('Contacto', donacion.comercio?.telefono || donacion.comercio?.correo),
    );

    const alimentosSection = crearElemento('section', 'claim-donation__foods');
    const encabezadoAlimentos = crearElemento('div', 'claim-section-heading');
    const textoEncabezado = crearElemento('div', '');
    textoEncabezado.append(
        crearElemento('h3', '', 'Alimentos incluidos'),
        crearElemento('p', '', 'Cantidades y fechas declaradas por el comercio.'),
    );
    encabezadoAlimentos.appendChild(textoEncabezado);
    encabezadoAlimentos.appendChild(
        crearElemento('span', 'claim-donation__count', `${donacion.detalles.length} ${donacion.detalles.length === 1 ? 'alimento' : 'alimentos'}`),
    );
    const listaAlimentos = crearElemento('ol', 'claim-food-list');
    for (const [indice, detalle] of donacion.detalles.entries()) {
        listaAlimentos.appendChild(crearFilaAlimento(detalle, indice));
    }
    alimentosSection.append(encabezadoAlimentos, listaAlimentos);

    panel.append(panelHeader, metadatos, alimentosSection);

    const resumen = crearElemento('aside', 'claim-receipt-card');
    resumen.setAttribute('aria-labelledby', 'claim-receipt-title');
    const tituloResumen = crearElemento('h2', '', 'Resumen de recepción');
    tituloResumen.id = 'claim-receipt-title';
    resumen.append(
        crearElemento('span', 'claim-receipt-card__eyebrow', 'RECEPCIÓN'),
        tituloResumen,
        crearElemento('p', 'claim-receipt-card__description', 'Al confirmar, la donación quedará asignada a tu organización y se agregará al inventario.'),
    );
    const estadisticas = crearElemento('dl', 'claim-receipt-card__stats');
    estadisticas.append(
        crearDato('Alimentos incluidos', String(donacion.detalles.length)),
        crearDato('Estado', 'Disponible'),
    );
    const nota = crearElemento('p', 'claim-receipt-card__notice');
    nota.append(
        crearElemento('span', '', 'i'),
        crearElemento('span', '', 'Revisa las fechas con el comercio al recibir físicamente los productos.'),
    );
    const actions = crearElemento('div', 'claim-actions');
    const back = crearElemento('a', 'claim-button claim-button--secondary', 'Cancelar');
    back.href = './donaciones-disponibles.html';
    const submit = crearElemento('button', 'claim-button claim-button--primary', 'Confirmar recepción');
    submit.type = 'submit';
    submit.appendChild(crearElemento('span', '', '→'));
    actions.append(back, submit);
    resumen.append(estadisticas, nota, actions);

    layout.append(panel, resumen);
    form.appendChild(layout);

    form.addEventListener('submit', evento => {
        evento.preventDefault();
        mostrarFeedback('');
        renderizarConfirmacion(donacion);
        dialogo.showModal();
    });
    contenido.replaceChildren(form);
}

botonConfirmar.addEventListener('click', async () => {
    if (!donacionActual) return;
    botonConfirmar.disabled = true;
    botonConfirmar.setAttribute('aria-busy', 'true');
    botonConfirmar.querySelector('span').textContent = 'Confirmando...';
    mostrarFeedback('');
    try {
        await reclamarDonacion(donacionActual.id_donacion, idOrganizacion);
        dialogo.close();
        const exito = crearElemento('section', 'claim-success');
        exito.setAttribute('role', 'status');
        exito.append(
            crearElemento('span', 'claim-success__icon', '✓'),
            crearElemento('h2', '', 'Recepción confirmada'),
            crearElemento('p', '', 'La donación se asignó a tu organización y sus alimentos y lotes se agregaron al inventario.'),
        );
        contenido.replaceChildren(exito);
        window.setTimeout(() => {
            window.location.href = './donaciones-disponibles.html';
        }, 1800);
    } catch (error) {
        dialogo.close();
        const mensaje = error instanceof Error ? error.message : 'No se pudo confirmar la recepción.';
        if (mensaje.toLocaleLowerCase('es-MX').includes('ya no está disponible')) {
            mostrarDonacionNoDisponible();
        } else {
            mostrarFeedback(mensaje);
        }
    } finally {
        botonConfirmar.disabled = false;
        botonConfirmar.removeAttribute('aria-busy');
        botonConfirmar.querySelector('span').textContent = 'Confirmar recepción';
    }
});

async function inicializar() {
    if (!Number.isInteger(idDonacion) || idDonacion <= 0) {
        mostrarMensaje('El identificador de la donación no es válido.', 'error');
        return;
    }
    try {
        donacionActual = await obtenerDonacion(idDonacion);
        if (!donacionActual) {
            mostrarMensaje('No encontramos la donación solicitada.', 'error');
            return;
        }
        if (donacionActual.estado !== 'disponible' || donacionActual.id_organizacion != null) {
            mostrarDonacionNoDisponible();
            return;
        }
        if (!Array.isArray(donacionActual.detalles) || donacionActual.detalles.length === 0) {
            mostrarMensaje('La donación no tiene alimentos registrados y no puede reclamarse.', 'error');
            return;
        }
        renderizarPagina(donacionActual);
    } catch (error) {
        mostrarMensaje(error instanceof Error ? error.message : 'No se pudo cargar la donación.', 'error');
    }
}
