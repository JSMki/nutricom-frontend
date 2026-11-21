import { usuarioAutenticado } from './main.js';
import { obtenerSolicitudesApoyo } from './datos.js';

const cuerpoTabla = document.getElementById('pedidos-table-body');
const busqueda = document.getElementById('pedidos-search');
const filtroEstado = document.getElementById('pedidos-status');
const contadorFiltros = document.getElementById('pedidos-filter-count');
const contadorResultados = document.getElementById('pedidos-results');
const modalDetalle = document.getElementById('pedido-detail');
const detalleTitulo = document.getElementById('pedido-detail-title');
const detalleMeta = document.getElementById('pedido-detail-meta');
const detalleEntrega = document.getElementById('pedido-detail-delivery');
const mensajeSinEntrega = document.getElementById('pedido-detail-delivery-empty');
const detalleAlimentos = document.getElementById('pedido-detail-items');
const numeroFormato = new Intl.NumberFormat('es-MX');
let pedidos = [];
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

function valorDe(pedido, ...campos) {
    if (!pedido || typeof pedido !== 'object') return '';
    for (const campo of campos) {
        if (pedido[campo] !== undefined && pedido[campo] !== null) return pedido[campo];
    }
    return '';
}

function listaDeSolicitudes(respuesta) {
    if (Array.isArray(respuesta)) return respuesta;
    for (const campo of ['solicitudes', 'requests', 'data', 'items']) {
        if (Array.isArray(respuesta?.[campo])) return respuesta[campo];
    }
    throw new Error('El servidor devolvió una lista de pedidos con formato inválido.');
}

function listaDeAlimentos(pedido) {
    if (!pedido || typeof pedido !== 'object') return [];
    for (const campo of ['alimentos', 'solicitud_alimentos', 'solicitudAlimentos', 'detalles', 'items']) {
        if (Array.isArray(pedido[campo])) return pedido[campo];
    }
    return [];
}

function nombreAlimento(item) {
    if (!item || typeof item !== 'object') return '';
    const nombre = valorDe(item, 'nombre_alimento', 'nombreAlimento', 'nombre', 'alimento_nombre');
    if (nombre) return String(nombre);
    const alimento = item.alimento;
    if (typeof alimento === 'string') return alimento;
    return valorDe(alimento ?? {}, 'nombre_alimento', 'nombreAlimento', 'nombre') || '';
}

function obtenerFolio(pedido) {
    const folio = valorDe(pedido, 'folio');
    if (folio) return String(folio);

    const id = valorDe(pedido, 'id_solicitud', 'idSolicitud', 'id');
    return id === '' ? '—' : `SOL-${String(id).padStart(4, '0')}`;
}

function formatearFecha(valor) {
    if (!valor) return '—';
    const fechaTexto = String(valor);
    const fecha = /^\d{4}-\d{2}-\d{2}$/.test(fechaTexto)
        ? new Date(`${fechaTexto}T00:00:00`)
        : new Date(fechaTexto);
    if (Number.isNaN(fecha.getTime())) return String(valor);

    const partes = new Intl.DateTimeFormat('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).formatToParts(fecha);
    const parte = tipo => partes.find(item => item.type === tipo)?.value ?? '';
    const mes = parte('month').replace(/\.$/, '');
    return `${parte('day')} ${mes.charAt(0).toLocaleUpperCase('es-MX')}${mes.slice(1)}, ${parte('year')}`;
}

function normalizar(valor) {
    return String(valor ?? '').trim().toLocaleLowerCase('es-MX');
}

function crearCelda(texto, clase = '') {
    const celda = document.createElement('td');
    celda.textContent = String(texto || '—');
    if (clase) celda.className = clase;
    return celda;
}

function mostrarMensaje(mensaje, error = false) {
    const fila = document.createElement('tr');
    const celda = document.createElement('td');
    celda.colSpan = 6;
    celda.className = `pedidos-page__message${error ? ' pedidos-page__message--error' : ''}`;
    celda.textContent = mensaje;
    fila.appendChild(celda);
    cuerpoTabla.replaceChildren(fila);
}

function obtenerConteoContenido(pedido) {
    const alimentos = listaDeAlimentos(pedido);
    if (alimentos.length) return alimentos.length;
    const guardado = valorDe(pedido, 'cantidad_alimentos', 'numero_alimentos', 'total_alimentos');
    return guardado === '' ? 0 : Number(guardado);
}

function claseEstado(estado) {
    const valor = normalizar(estado).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return ['pendiente', 'aprobada', 'aceptada', 'entregada', 'rechazada'].includes(valor) ? valor : '';
}

function clasePrioridad(prioridad) {
    const valor = normalizar(prioridad).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return ['media', 'alta'].includes(valor) ? valor : '';
}

function crearBotonDetalle(pedido) {
    const boton = document.createElement('button');
    boton.className = 'pedidos-page__detail-button';
    boton.type = 'button';
    boton.textContent = 'Ver detalle';
    boton.setAttribute('aria-label', `Ver detalle del pedido ${obtenerFolio(pedido)}`);
    boton.addEventListener('click', () => abrirDetalle(pedido));
    return boton;
}

function renderizar() {
    if (estadoCarga === 'cargando') {
        contadorResultados.textContent = 'Cargando';
        mostrarMensaje('Cargando pedidos...');
        return;
    }
    if (estadoCarga === 'error') {
        contadorResultados.textContent = 'No disponible';
        mostrarMensaje(errorCarga, true);
        return;
    }

    const termino = normalizar(busqueda.value);
    const estadoSeleccionado = normalizar(filtroEstado.value);
    const filtrados = pedidos.filter(pedido => {
        const coincideEstado = !estadoSeleccionado || normalizar(valorDe(pedido, 'estado')) === estadoSeleccionado;
        const alimentos = listaDeAlimentos(pedido)
            .map(nombreAlimento)
            .join(' ');
        const coincideTexto = !termino
            || normalizar(obtenerFolio(pedido)).includes(termino)
            || normalizar(alimentos).includes(termino)
            || normalizar(valorDe(pedido, 'motivo', 'descripcion')).includes(termino);
        return coincideEstado && coincideTexto;
    });

    contadorFiltros.textContent = `Filtros ${Number(Boolean(termino)) + Number(Boolean(estadoSeleccionado))}`;
    contadorResultados.textContent = `${filtrados.length} ${filtrados.length === 1 ? 'pedido' : 'pedidos'}`;
    if (!filtrados.length) {
        mostrarMensaje(pedidos.length ? 'No hay pedidos que coincidan con los filtros.' : 'Aún no tienes pedidos.');
        return;
    }

    const filas = filtrados.map(pedido => {
        const fila = document.createElement('tr');
        const prioridad = String(valorDe(pedido, 'prioridad') || '—');
        const estado = String(valorDe(pedido, 'estado') || 'Pendiente');
        const cantidad = obtenerConteoContenido(pedido);
        const prioridadClass = clasePrioridad(prioridad);
        const estadoClass = claseEstado(estado);
        const prioridadBadge = document.createElement('span');
        prioridadBadge.className = `pedidos-page__priority${prioridadClass ? ` pedidos-page__priority--${prioridadClass}` : ''}`;
        prioridadBadge.textContent = prioridad;

        const estadoBadge = document.createElement('span');
        estadoBadge.className = `pedidos-page__status${estadoClass ? ` pedidos-page__status--${estadoClass}` : ''}`;
        estadoBadge.textContent = estado;

        fila.append(
            crearCelda(obtenerFolio(pedido), 'pedidos-page__folio'),
            crearCelda(formatearFecha(valorDe(pedido, 'fecha_solicitud', 'fechaSolicitud', 'fecha_creacion', 'fechaCreacion', 'created_at', 'fecha'))),
        );
        const celdaPrioridad = document.createElement('td');
        celdaPrioridad.appendChild(prioridadBadge);
        fila.appendChild(celdaPrioridad);
        fila.appendChild(crearCelda(`${numeroFormato.format(cantidad)} ${cantidad === 1 ? 'alimento' : 'alimentos'}`));
        const celdaEstado = document.createElement('td');
        celdaEstado.appendChild(estadoBadge);
        fila.appendChild(celdaEstado);
        const celdaDetalle = document.createElement('td');
        celdaDetalle.appendChild(crearBotonDetalle(pedido));
        fila.appendChild(celdaDetalle);
        return fila;
    });

    cuerpoTabla.replaceChildren(...filas);
}

function agregarDatoDetalle(etiqueta, valor) {
    const contenedor = document.createElement('div');
    const titulo = document.createElement('dt');
    const dato = document.createElement('dd');
    titulo.textContent = etiqueta;
    dato.textContent = String(valor || '—');
    contenedor.append(titulo, dato);
    detalleMeta.appendChild(contenedor);
}

function abrirDetalle(pedido) {
    const prioridad = String(valorDe(pedido, 'prioridad') || '—');
    const estado = String(valorDe(pedido, 'estado') || 'Pendiente');
    const alimentos = listaDeAlimentos(pedido);
    detalleTitulo.textContent = obtenerFolio(pedido);
    detalleMeta.replaceChildren();
    agregarDatoDetalle('Fecha', formatearFecha(valorDe(pedido, 'fecha_solicitud', 'fechaSolicitud', 'fecha_creacion', 'fechaCreacion', 'created_at', 'fecha')));
    agregarDatoDetalle('Prioridad', prioridad);
    agregarDatoDetalle('Estado', estado);
    agregarDatoDetalle('Integrantes', valorDe(pedido, 'numero_integrantes', 'numeroIntegrantes', 'integrantes'));
    agregarDatoDetalle('Motivo', valorDe(pedido, 'motivo', 'descripcion'));
    const entrega = valorDe(pedido, 'entrega', 'entrega_detalle', 'entregaDetalle');
    detalleEntrega.replaceChildren();
    mensajeSinEntrega.hidden = Boolean(entrega && typeof entrega === 'object');
    if (entrega && typeof entrega === 'object') {
        agregarDatoEntrega('Fecha de entrega', formatearFecha(valorDe(entrega, 'fecha_entrega', 'fechaEntrega')));
        agregarDatoEntrega('Organización', valorDe(entrega, 'nombre_organizacion', 'nombreOrganizacion'));
        agregarDatoEntrega('Responsable', valorDe(entrega, 'responsable'));
        agregarDatoEntrega('Estado de entrega', valorDe(entrega, 'estado'));
        agregarDatoEntrega('Observaciones', valorDe(entrega, 'observaciones'));
    }
    detalleAlimentos.replaceChildren();

    if (!alimentos.length) {
        const mensaje = document.createElement('li');
        mensaje.textContent = 'El detalle de alimentos no está disponible.';
        detalleAlimentos.appendChild(mensaje);
    } else {
        for (const alimento of alimentos) {
            const fila = document.createElement('li');
            const nombre = document.createElement('span');
            const cantidad = document.createElement('span');
            nombre.textContent = nombreAlimento(alimento) || 'Alimento';
            const unidades = valorDe(alimento, 'cantidad', 'cantidad_solicitada');
            cantidad.textContent = unidades === ''
                ? 'Cantidad no disponible'
                : `${numeroFormato.format(Number(unidades))} ${valorDe(alimento, 'unidad_medida', 'unidadMedida', 'unidad') || valorDe(alimento.alimento ?? {}, 'unidad_medida', 'unidadMedida') || 'unidades'}`;
            fila.append(nombre, cantidad);
            detalleAlimentos.appendChild(fila);
        }
    }
    modalDetalle.showModal();
}

function agregarDatoEntrega(etiqueta, valor) {
    const contenedor = document.createElement('div');
    const titulo = document.createElement('dt');
    const dato = document.createElement('dd');
    titulo.textContent = etiqueta;
    dato.textContent = String(valor || '—');
    contenedor.append(titulo, dato);
    detalleEntrega.appendChild(contenedor);
}

async function cargarPedidos() {
    estadoCarga = 'cargando';
    mostrarMensaje('Cargando pedidos...');
    contadorResultados.textContent = 'Cargando';
    try {
        pedidos = listaDeSolicitudes(await obtenerSolicitudesApoyo());
        estadoCarga = 'listo';
        renderizar();
    } catch (error) {
        estadoCarga = 'error';
        errorCarga = error instanceof Error ? error.message : 'No se pudieron cargar tus pedidos.';
        renderizar();
    }
}

busqueda.addEventListener('input', renderizar);
filtroEstado.addEventListener('change', renderizar);
document.getElementById('pedido-detail-close').addEventListener('click', () => modalDetalle.close());

const nombreBeneficiario = usuarioAutenticado?.nombre;
if (nombreBeneficiario) {
    document.querySelector('.pedidos-page__description').textContent =
        `Consulta el avance y detalle de todas tus solicitudes, ${nombreBeneficiario}.`;
}

await cargarPedidos();
