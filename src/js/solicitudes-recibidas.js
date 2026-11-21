import { usuarioAutenticado } from './main.js';
import {
    ORGANIZACION_ACTUAL,
    aceptarSolicitud,
    obtenerSolicitudesRecibidas,
    rechazarSolicitud,
} from './datos.js';

const cuerpoTabla = document.getElementById('requests-table-body');
const busqueda = document.getElementById('requests-search');
const filtroEstado = document.getElementById('requests-status');
const contador = document.getElementById('requests-count');
const feedback = document.getElementById('requests-feedback');
const dialogo = document.getElementById('request-detail');
const detalleTitulo = document.getElementById('request-detail-title');
const detalleMeta = document.getElementById('request-detail-meta');
const detalleAlimentos = document.getElementById('request-detail-foods');
const entregaInfo = document.getElementById('request-delivery-info');
const entregaCopy = document.getElementById('request-delivery-copy');
const detalleFeedback = document.getElementById('request-detail-feedback');
const accionesDetalle = document.getElementById('request-detail-actions');
const confirmacionRechazo = document.getElementById('request-reject-confirm');
const botonAceptar = document.getElementById('request-accept-button');
const botonRechazar = document.getElementById('request-reject-button');
const botonConfirmarRechazo = document.getElementById('request-reject-confirm-button');
const idOrganizacion = Number(
    usuarioAutenticado?.id_organizacion
    ?? usuarioAutenticado?.idOrganizacion
    ?? usuarioAutenticado?.organizacion?.id_organizacion
    ?? usuarioAutenticado?.organizacion?.id
    ?? ORGANIZACION_ACTUAL.id_organizacion,
);
let solicitudes = [];
let solicitudActual = null;
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
    if (!valor) return '—';
    const texto = String(valor);
    const fecha = /^\d{4}-\d{2}-\d{2}$/.test(texto) ? new Date(`${texto}T00:00:00`) : new Date(texto);
    if (Number.isNaN(fecha.getTime())) return '—';
    return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }).format(fecha);
}

function folio(solicitud) {
    return solicitud.folio ?? `SOL-${String(solicitud.id_solicitud).padStart(4, '0')}`;
}

function estadoClase(estado) {
    const normalizado = normalizar(estado);
    return ['pendiente', 'aceptada', 'aprobada', 'rechazada', 'entregada'].includes(normalizado)
        ? normalizado
        : '';
}

function prioridadClase(prioridad) {
    const normalizada = normalizar(prioridad);
    return ['alta', 'media'].includes(normalizada) ? normalizada : '';
}

function nombreBeneficiario(solicitud) {
    return solicitud.nombre_beneficiario ?? 'Beneficiario no identificado';
}

function establecerFeedback(mensaje, error = false) {
    feedback.hidden = !mensaje;
    feedback.textContent = mensaje;
    feedback.className = `received-page__feedback${error ? ' received-page__feedback--error' : ''}`;
}

function mostrarMensaje(mensaje) {
    const fila = document.createElement('tr');
    const celda = crearElemento('td', 'received-page__message', mensaje);
    celda.colSpan = 8;
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

function abrirDetalle(solicitud) {
    solicitudActual = solicitud;
    detalleTitulo.textContent = folio(solicitud);
    detalleMeta.replaceChildren();
    crearDato(detalleMeta, 'Beneficiario', nombreBeneficiario(solicitud));
    crearDato(detalleMeta, 'Correo', solicitud.beneficiario?.correo);
    crearDato(detalleMeta, 'Teléfono', solicitud.beneficiario?.telefono);
    crearDato(detalleMeta, 'Dirección', [solicitud.beneficiario?.direccion, solicitud.beneficiario?.colonia].filter(Boolean).join(', '));
    crearDato(detalleMeta, 'Fecha de solicitud', formatearFecha(solicitud.fecha_solicitud));
    crearDato(detalleMeta, 'Integrantes', solicitud.numero_integrantes);
    crearDato(detalleMeta, 'Prioridad', solicitud.prioridad);
    crearDato(detalleMeta, 'Estado', solicitud.estado);
    crearDato(detalleMeta, 'Motivo', solicitud.motivo);

    detalleAlimentos.replaceChildren();
    for (const alimento of solicitud.alimentos ?? []) {
        const fila = document.createElement('li');
        fila.append(
            crearElemento('span', '', alimento.nombre_alimento ?? 'Alimento'),
            crearElemento('span', '', `${Number(alimento.cantidad) || 0} ${alimento.unidad_medida ?? 'unidad'}`),
        );
        detalleAlimentos.appendChild(fila);
    }

    const pendiente = normalizar(solicitud.estado) === 'pendiente';
    accionesDetalle.hidden = !pendiente;
    confirmacionRechazo.hidden = true;
    detalleFeedback.hidden = true;
    entregaInfo.hidden = !solicitud.entrega;
    if (solicitud.entrega) {
        entregaCopy.textContent = `${solicitud.entrega.estado}${solicitud.entrega.fecha_entrega ? ` · ${formatearFecha(solicitud.entrega.fecha_entrega)}` : ''}`;
    }
    dialogo.showModal();
}

function renderizar() {
    if (estadoCarga === 'cargando') {
        contador.textContent = 'Cargando solicitudes...';
        mostrarMensaje('Cargando solicitudes...');
        return;
    }
    if (estadoCarga === 'error') {
        contador.textContent = 'No disponible';
        mostrarMensaje(errorCarga);
        return;
    }

    const termino = normalizar(busqueda.value);
    const estadoSeleccionado = normalizar(filtroEstado.value);
    const filtradas = solicitudes.filter(solicitud => {
        const estado = normalizar(solicitud.estado);
        const coincideEstado = !estadoSeleccionado || estado === estadoSeleccionado;
        const coincideTexto = !termino
            || normalizar(folio(solicitud)).includes(termino)
            || normalizar(nombreBeneficiario(solicitud)).includes(termino)
            || normalizar(solicitud.motivo).includes(termino);
        return coincideEstado && coincideTexto;
    });

    document.getElementById('requests-pending-count').textContent =
        String(solicitudes.filter(item => normalizar(item.estado) === 'pendiente').length);
    document.getElementById('requests-accepted-count').textContent =
        String(solicitudes.filter(item => ['aceptada', 'aprobada'].includes(normalizar(item.estado))).length);
    document.getElementById('requests-rejected-count').textContent =
        String(solicitudes.filter(item => normalizar(item.estado) === 'rechazada').length);
    contador.textContent = `${filtradas.length} ${filtradas.length === 1 ? 'solicitud' : 'solicitudes'}`;
    if (!filtradas.length) {
        mostrarMensaje(solicitudes.length ? 'No hay solicitudes que coincidan con los filtros.' : 'No hay solicitudes recibidas por el momento.');
        return;
    }

    const filas = filtradas.map(solicitud => {
        const fila = document.createElement('tr');
        const prioridad = crearElemento(
            'span',
            `received-page__priority${prioridadClase(solicitud.prioridad) ? ` received-page__priority--${prioridadClase(solicitud.prioridad)}` : ''}`,
            solicitud.prioridad ?? '—',
        );
        const clase = estadoClase(solicitud.estado);
        const estado = crearElemento(
            'span',
            `received-page__status${clase ? ` received-page__status--${clase}` : ''}`,
            solicitud.estado ?? '—',
        );
        const boton = crearElemento('button', 'received-page__detail-button', 'Ver detalle');
        boton.type = 'button';
        boton.addEventListener('click', () => abrirDetalle(solicitud));
        const acciones = crearElemento('div', 'received-page__row-actions');
        if (normalizar(solicitud.estado) === 'pendiente') {
            const aceptar = crearElemento('button', 'received-page__accept-button', 'Aceptar');
            aceptar.type = 'button';
            aceptar.setAttribute('aria-label', `Aceptar solicitud ${folio(solicitud)}`);
            aceptar.addEventListener('click', () => aceptarDesdeLista(solicitud, aceptar));
            acciones.appendChild(aceptar);
        }
        acciones.appendChild(boton);
        const celdaPrioridad = document.createElement('td');
        celdaPrioridad.appendChild(prioridad);
        const celdaEstado = document.createElement('td');
        celdaEstado.appendChild(estado);
        const celdaAccion = document.createElement('td');
        celdaAccion.className = 'received-page__actions-cell';
        celdaAccion.appendChild(acciones);
        const valores = [
            [crearElemento('td', 'received-page__folio', folio(solicitud)), 'Folio'],
            [crearElemento('td', '', formatearFecha(solicitud.fecha_solicitud)), 'Fecha'],
            [crearElemento('td', '', nombreBeneficiario(solicitud)), 'Beneficiario'],
            [crearElemento('td', '', solicitud.numero_integrantes ?? '—'), 'Integrantes'],
            [celdaPrioridad, 'Prioridad'],
            [crearElemento('td', '', String(solicitud.alimentos?.length ?? 0)), 'Alimentos'],
            [celdaEstado, 'Estado'],
            [celdaAccion, 'Acciones'],
        ];
        for (const [celda, etiqueta] of valores) {
            celda.dataset.label = etiqueta;
        }
        fila.append(
            ...valores.map(([celda]) => celda),
        );
        return fila;
    });
    cuerpoTabla.replaceChildren(...filas);
}

async function cargarSolicitudes() {
    estadoCarga = 'cargando';
    renderizar();
    try {
        solicitudes = await obtenerSolicitudesRecibidas();
        estadoCarga = 'listo';
        renderizar();
    } catch (error) {
        estadoCarga = 'error';
        errorCarga = error instanceof Error ? error.message : 'No se pudieron cargar las solicitudes.';
        renderizar();
    }
}

async function aceptarSolicitudPendiente(solicitud, boton) {
    boton.disabled = true;
    try {
        await aceptarSolicitud(solicitud.id_solicitud, idOrganizacion);
        if (dialogo.open && solicitudActual?.id_solicitud === solicitud.id_solicitud) {
            dialogo.close();
        }
        establecerFeedback(`Solicitud ${folio(solicitud)} aceptada. Se creó una entrega pendiente para programar.`);
        await cargarSolicitudes();
    } catch (error) {
        const mensaje = error instanceof Error ? error.message : 'No se pudo aceptar la solicitud.';
        if (dialogo.open && solicitudActual?.id_solicitud === solicitud.id_solicitud) {
            detalleFeedback.textContent = mensaje;
            detalleFeedback.hidden = false;
        } else {
            establecerFeedback(mensaje, true);
        }
    } finally {
        boton.disabled = false;
    }
}

function aceptarActual() {
    if (!solicitudActual) return;
    return aceptarSolicitudPendiente(solicitudActual, botonAceptar);
}

function aceptarDesdeLista(solicitud, boton) {
    return aceptarSolicitudPendiente(solicitud, boton);
}

async function rechazarActual() {
    if (!solicitudActual) return;
    botonConfirmarRechazo.disabled = true;
    try {
        await rechazarSolicitud(solicitudActual.id_solicitud);
        dialogo.close();
        establecerFeedback('La solicitud fue rechazada.');
        await cargarSolicitudes();
    } catch (error) {
        detalleFeedback.textContent = error instanceof Error ? error.message : 'No se pudo rechazar la solicitud.';
        detalleFeedback.hidden = false;
        confirmacionRechazo.hidden = true;
        accionesDetalle.hidden = false;
    } finally {
        botonConfirmarRechazo.disabled = false;
    }
}

busqueda.addEventListener('input', renderizar);
filtroEstado.addEventListener('change', renderizar);
document.getElementById('request-detail-close').addEventListener('click', () => dialogo.close());
botonAceptar.addEventListener('click', aceptarActual);
botonRechazar.addEventListener('click', () => {
    accionesDetalle.hidden = true;
    confirmacionRechazo.hidden = false;
});
document.getElementById('request-reject-cancel').addEventListener('click', () => {
    confirmacionRechazo.hidden = true;
    accionesDetalle.hidden = false;
});
botonConfirmarRechazo.addEventListener('click', rechazarActual);
dialogo.addEventListener('click', evento => {
    if (evento.target === dialogo) dialogo.close();
});

await cargarSolicitudes();
