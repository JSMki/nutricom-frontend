import { usuarioAutenticado } from './main.js';
import {
    ORGANIZACION_ACTUAL,
    marcarEntregaEntregada,
    obtenerEntregas,
    programarEntrega,
} from './datos.js';

const cuerpoTabla = document.getElementById('deliveries-table-body');
const busqueda = document.getElementById('deliveries-search');
const filtroEstado = document.getElementById('deliveries-status');
const contador = document.getElementById('deliveries-count');
const feedback = document.getElementById('deliveries-feedback');
const dialogo = document.getElementById('delivery-detail');
const detalleTitulo = document.getElementById('delivery-detail-title');
const detalleMeta = document.getElementById('delivery-detail-meta');
const detalleAlimentos = document.getElementById('delivery-detail-foods');
const detalleFeedback = document.getElementById('delivery-detail-feedback');
const formulario = document.getElementById('delivery-schedule');
const botonProgramar = document.getElementById('delivery-schedule-button');
const botonCompletar = document.getElementById('delivery-mark-complete');
const dialogoConfirmacion = document.getElementById('delivery-confirm');
const botonConfirmar = document.getElementById('delivery-confirm-button');
const idOrganizacion = Number(
    usuarioAutenticado?.id_organizacion
    ?? usuarioAutenticado?.idOrganizacion
    ?? usuarioAutenticado?.organizacion?.id_organizacion
    ?? usuarioAutenticado?.organizacion?.id
    ?? ORGANIZACION_ACTUAL.id_organizacion,
);
let entregas = [];
let entregaActual = null;
let estadoCarga = 'cargando';
let errorCarga = '';

const sidebarToggle = document.getElementById('toggle-sidebar-btn');
sidebarToggle?.addEventListener('click', () => {
    const collapsed = document.body.classList.toggle('home-layout--sidebar-collapsed');
    sidebarToggle.setAttribute('aria-expanded', String(!collapsed));
    sidebarToggle.setAttribute('aria-label', collapsed ? 'Expandir menú' : 'Contraer menú');
    if (sidebarToggle.firstElementChild) {
        sidebarToggle.firstElementChild.textContent = collapsed ? '›' : '‹';
    }
});

function crearElemento(etiqueta, clase, texto) {
    const elemento = document.createElement(etiqueta);
    if (clase) elemento.className = clase;
    if (texto !== undefined) elemento.textContent = String(texto);
    return elemento;
}

function normalizar(valor) {
    return String(valor ?? '').trim().toLocaleLowerCase('es-MX')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function formatearFecha(valor) {
    if (!valor) return 'Por programar';
    const texto = String(valor);
    const fecha = /^\d{4}-\d{2}-\d{2}$/.test(texto) ? new Date(`${texto}T00:00:00`) : new Date(texto);
    if (Number.isNaN(fecha.getTime())) return '—';
    return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }).format(fecha);
}

function folio(entrega) {
    return entrega.solicitud?.folio ?? `SOL-${String(entrega.id_solicitud).padStart(4, '0')}`;
}

function nombreBeneficiario(entrega) {
    return entrega.nombre_beneficiario ?? 'Beneficiario no identificado';
}

function estadoClase(estado) {
    const valor = normalizar(estado);
    return ['pendiente', 'programada', 'entregada'].includes(valor) ? valor : '';
}

function establecerFeedback(mensaje, error = false) {
    feedback.hidden = !mensaje;
    feedback.textContent = mensaje;
    feedback.className = `deliveries-page__feedback${error ? ' deliveries-page__feedback--error' : ''}`;
}

function establecerFeedbackDetalle(mensaje) {
    detalleFeedback.hidden = !mensaje;
    detalleFeedback.textContent = mensaje;
}

function mostrarMensaje(mensaje) {
    const fila = document.createElement('tr');
    const celda = crearElemento('td', 'deliveries-page__message', mensaje);
    celda.colSpan = 6;
    fila.appendChild(celda);
    cuerpoTabla.replaceChildren(fila);
}

function crearDato(contenedor, etiqueta, valor) {
    const dato = document.createElement('div');
    dato.append(
        crearElemento('dt', '', etiqueta),
        crearElemento('dd', '', valor || '—'),
    );
    contenedor.appendChild(dato);
}

function abrirDetalle(entrega) {
    entregaActual = entrega;
    detalleTitulo.textContent = folio(entrega);
    detalleMeta.replaceChildren();
    crearDato(detalleMeta, 'Beneficiario', nombreBeneficiario(entrega));
    crearDato(detalleMeta, 'Correo', entrega.beneficiario?.correo);
    crearDato(detalleMeta, 'Teléfono', entrega.beneficiario?.telefono);
    crearDato(detalleMeta, 'Dirección', [entrega.beneficiario?.direccion, entrega.beneficiario?.colonia].filter(Boolean).join(', '));
    crearDato(detalleMeta, 'Estado de solicitud', entrega.solicitud?.estado);
    crearDato(detalleMeta, 'Estado de entrega', entrega.estado);
    crearDato(detalleMeta, 'Fecha de entrega', formatearFecha(entrega.fecha_entrega));
    crearDato(detalleMeta, 'Responsable', entrega.responsable);
    crearDato(detalleMeta, 'Observaciones', entrega.observaciones);

    detalleAlimentos.replaceChildren();
    for (const alimento of entrega.solicitud?.alimentos ?? []) {
        const fila = document.createElement('li');
        fila.append(
            crearElemento('span', '', alimento.nombre_alimento ?? 'Alimento'),
            crearElemento('span', '', `${Number(alimento.cantidad) || 0} ${alimento.unidad_medida ?? 'unidad'}`),
        );
        detalleAlimentos.appendChild(fila);
    }

    formulario.reset();
    formulario.hidden = entrega.estado !== 'Pendiente';
    document.getElementById('delivery-date').min = obtenerFechaHoy();
    botonCompletar.hidden = entrega.estado !== 'Programada';
    establecerFeedbackDetalle('');
    dialogo.showModal();
}

function renderizar() {
    if (estadoCarga === 'cargando') {
        contador.textContent = 'Cargando entregas...';
        mostrarMensaje('Cargando entregas...');
        return;
    }
    if (estadoCarga === 'error') {
        contador.textContent = 'No disponible';
        mostrarMensaje(errorCarga);
        return;
    }

    const termino = normalizar(busqueda.value);
    const estadoSeleccionado = normalizar(filtroEstado.value);
    const filtradas = entregas.filter(entrega => {
        const coincideEstado = !estadoSeleccionado || normalizar(entrega.estado) === estadoSeleccionado;
        const coincideTexto = !termino
            || normalizar(folio(entrega)).includes(termino)
            || normalizar(nombreBeneficiario(entrega)).includes(termino);
        return coincideEstado && coincideTexto;
    });
    document.getElementById('deliveries-pending-count').textContent =
        String(entregas.filter(item => item.estado === 'Pendiente').length);
    document.getElementById('deliveries-scheduled-count').textContent =
        String(entregas.filter(item => item.estado === 'Programada').length);
    document.getElementById('deliveries-completed-count').textContent =
        String(entregas.filter(item => item.estado === 'Entregada').length);
    contador.textContent = `${filtradas.length} ${filtradas.length === 1 ? 'entrega' : 'entregas'}`;
    if (!filtradas.length) {
        mostrarMensaje(entregas.length ? 'No hay entregas que coincidan con los filtros.' : 'Todavía no hay entregas. Acepta una solicitud para crear la primera.');
        return;
    }

    const filas = filtradas.map(entrega => {
        const fila = document.createElement('tr');
        const clase = estadoClase(entrega.estado);
        const estado = crearElemento(
            'span',
            `deliveries-page__status${clase ? ` deliveries-page__status--${clase}` : ''}`,
            entrega.estado,
        );
        const accion = entrega.estado === 'Pendiente'
            ? 'Programar'
            : entrega.estado === 'Programada' ? 'Registrar entrega' : 'Ver detalle';
        const boton = crearElemento('button', `deliveries-page__action deliveries-page__action--${clase}`, accion);
        boton.type = 'button';
        boton.addEventListener('click', () => abrirDetalle(entrega));
        const celdaEstado = document.createElement('td');
        celdaEstado.dataset.label = 'Estado';
        celdaEstado.appendChild(estado);
        const celdaAccion = crearElemento('td', 'deliveries-page__actions-cell');
        celdaAccion.dataset.label = 'Acción';
        celdaAccion.appendChild(boton);
        const celdaFolio = crearElemento('td', 'deliveries-page__folio', folio(entrega));
        celdaFolio.dataset.label = 'Solicitud';
        const celdaBeneficiario = crearElemento('td', '', nombreBeneficiario(entrega));
        celdaBeneficiario.dataset.label = 'Beneficiario';
        const celdaFecha = crearElemento('td', '', formatearFecha(entrega.fecha_entrega));
        celdaFecha.dataset.label = 'Fecha de entrega';
        const celdaResponsable = crearElemento('td', '', entrega.responsable || '—');
        celdaResponsable.dataset.label = 'Responsable';
        fila.append(
            celdaFolio,
            celdaBeneficiario,
            celdaFecha,
            celdaResponsable,
            celdaEstado,
            celdaAccion,
        );
        return fila;
    });
    cuerpoTabla.replaceChildren(...filas);
}

async function cargarEntregas() {
    estadoCarga = 'cargando';
    renderizar();
    try {
        entregas = await obtenerEntregas(idOrganizacion);
        estadoCarga = 'listo';
        renderizar();
    } catch (error) {
        estadoCarga = 'error';
        errorCarga = error instanceof Error ? error.message : 'No se pudieron cargar las entregas.';
        renderizar();
    }
}

function obtenerFechaHoy() {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
}

formulario.addEventListener('submit', async evento => {
    evento.preventDefault();
    establecerFeedbackDetalle('');
    if (!entregaActual || !formulario.reportValidity()) return;
    botonProgramar.disabled = true;
    try {
        await programarEntrega(entregaActual.id_entrega, idOrganizacion, {
            fecha_entrega: formulario.elements.namedItem('fecha_entrega').value,
            responsable: formulario.elements.namedItem('responsable').value,
            observaciones: formulario.elements.namedItem('observaciones').value,
        });
        dialogo.close();
        establecerFeedback('Entrega programada correctamente.');
        await cargarEntregas();
    } catch (error) {
        establecerFeedbackDetalle(error instanceof Error ? error.message : 'No se pudo programar la entrega.');
    } finally {
        botonProgramar.disabled = false;
    }
});

botonCompletar.addEventListener('click', () => dialogoConfirmacion.showModal());
botonConfirmar.addEventListener('click', async () => {
    if (!entregaActual) return;
    botonConfirmar.disabled = true;
    try {
        await marcarEntregaEntregada(entregaActual.id_entrega, idOrganizacion);
        dialogoConfirmacion.close();
        dialogo.close();
        establecerFeedback('Entrega registrada. Las cantidades se descontaron del inventario.');
        await cargarEntregas();
    } catch (error) {
        dialogoConfirmacion.close();
        establecerFeedbackDetalle(error instanceof Error ? error.message : 'No se pudo registrar la entrega.');
    } finally {
        botonConfirmar.disabled = false;
    }
});

busqueda.addEventListener('input', renderizar);
filtroEstado.addEventListener('change', renderizar);
document.getElementById('delivery-detail-close').addEventListener('click', () => dialogo.close());
document.getElementById('delivery-detail-dismiss').addEventListener('click', () => dialogo.close());
dialogo.addEventListener('click', evento => {
    if (evento.target === dialogo) dialogo.close();
});
dialogoConfirmacion.addEventListener('click', evento => {
    if (evento.target === dialogoConfirmacion) dialogoConfirmacion.close();
});

await cargarEntregas();
