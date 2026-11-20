import './main.js';
import { obtenerDonacionesDisponibles } from './datos.js';

const lista = document.getElementById('donations-grid');
const busqueda = document.getElementById('donations-search');
const orden = document.getElementById('donations-sort');
const contador = document.getElementById('donations-count');
const formatoNumero = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 });
let donaciones = [];

const toggleSidebar = document.getElementById('toggle-sidebar-btn');
toggleSidebar?.addEventListener('click', () => {
    const collapsed = document.body.classList.toggle('home-layout--sidebar-collapsed');
    toggleSidebar.setAttribute('aria-expanded', String(!collapsed));
    toggleSidebar.setAttribute('aria-label', collapsed ? 'Expandir menú' : 'Contraer menú');
    if (toggleSidebar.firstElementChild) {
        toggleSidebar.firstElementChild.textContent = collapsed ? '›' : '‹';
    }
});

function normalizar(texto) {
    return String(texto ?? '')
        .trim()
        .toLocaleLowerCase('es-MX')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function crearElemento(etiqueta, clase, texto) {
    const elemento = document.createElement(etiqueta);
    if (clase) elemento.className = clase;
    if (texto !== undefined) elemento.textContent = String(texto);
    return elemento;
}

function formatearFecha(fecha) {
    if (!fecha) return 'Fecha no disponible';
    const [anio, mes, dia] = String(fecha).split('-').map(Number);
    if (!anio || !mes || !dia) return 'Fecha no disponible';
    return new Intl.DateTimeFormat('es-MX', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(anio, mes - 1, dia));
}

function obtenerFolio(donacion) {
    return `DON-${String(donacion.id_donacion).padStart(4, '0')}`;
}

function vencePronto(detalle) {
    for (const fecha of [detalle.fecha_caducidad, detalle.fecha_consumo_preferente]) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(String(fecha ?? ''))) continue;
        const [anio, mes, dia] = fecha.split('-').map(Number);
        const objetivo = Date.UTC(anio, mes - 1, dia);
        const fechaObjetivo = new Date(objetivo);
        if (
            fechaObjetivo.getUTCFullYear() !== anio
            || fechaObjetivo.getUTCMonth() !== mes - 1
            || fechaObjetivo.getUTCDate() !== dia
        ) continue;
        const hoy = new Date();
        const hoyUtc = Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        const dias = Math.floor((objetivo - hoyUtc) / 86400000);
        if (dias >= 0 && dias <= 7) return true;
    }
    return false;
}

function crearTarjeta(donacion) {
    const folio = obtenerFolio(donacion);
    const comercio = donacion.comercio?.nombre_comercial ?? 'Comercio no disponible';
    const alimentos = donacion.detalles ?? [];
    const tarjeta = crearElemento('article', 'donation-card');
    tarjeta.tabIndex = 0;
    tarjeta.setAttribute('aria-label', `${folio}, donación de ${comercio}. Ver detalle.`);

    const encabezado = crearElemento('div', 'donation-card__header');
    const identificador = crearElemento('p', 'donation-card__folio', folio);
    const estado = crearElemento('span', 'donation-card__status', donacion.estado);
    estado.setAttribute('aria-label', 'Estado: disponible');
    encabezado.append(identificador, estado);
    if (alimentos.some(vencePronto)) {
        encabezado.appendChild(crearElemento('span', 'donation-card__expiry-alert', 'Próximo a caducar'));
    }

    const enlace = document.createElement('a');
    enlace.className = 'donation-card__details';
    enlace.href = `./detalle-donacion.html?id=${encodeURIComponent(donacion.id_donacion)}`;
    enlace.setAttribute('aria-label', `Ver detalle de la donación ${folio}`);
    enlace.append(
        crearElemento('h2', 'donation-card__commerce', comercio),
        crearElemento('p', 'donation-card__date', formatearFecha(donacion.fecha_donacion)),
    );

    const resumen = crearElemento('div', 'donation-card__summary');
    const total = crearElemento('div', 'donation-card__summary-item');
    total.append(
        crearElemento('span', '', 'Total registrado'),
        crearElemento('strong', '', formatoNumero.format(Number(donacion.cantidad_total) || 0)),
    );
    const cantidadAlimentos = crearElemento('div', 'donation-card__summary-item');
    cantidadAlimentos.append(
        crearElemento('span', '', 'Alimentos'),
        crearElemento('strong', '', String(alimentos.length)),
    );
    resumen.append(total, cantidadAlimentos);

    const listaAlimentos = crearElemento('ul', 'donation-card__foods');
    for (const detalle of alimentos.slice(0, 3)) {
        listaAlimentos.appendChild(crearElemento(
            'li',
            '',
            `${detalle.nombre_alimento} · ${formatoNumero.format(Number(detalle.cantidad) || 0)} ${detalle.abreviatura}`,
        ));
    }
    if (alimentos.length > 3) {
        listaAlimentos.appendChild(crearElemento('li', 'donation-card__more', `y ${alimentos.length - 3} alimentos más`));
    }

    const boton = crearElemento('button', 'donation-card__claim', 'Reclamar donación');
    boton.type = 'button';
    boton.addEventListener('click', evento => {
        evento.stopPropagation();
        window.location.href = `./reclamar-donacion.html?id=${encodeURIComponent(donacion.id_donacion)}`;
    });

    tarjeta.addEventListener('click', evento => {
        if (evento.target.closest('button, a')) return;
        window.location.href = enlace.href;
    });
    tarjeta.addEventListener('keydown', evento => {
        if (evento.target !== tarjeta || !['Enter', ' '].includes(evento.key)) return;
        evento.preventDefault();
        window.location.href = enlace.href;
    });

    tarjeta.append(encabezado, enlace, resumen, listaAlimentos, boton);
    return tarjeta;
}

function renderizar() {
    const termino = normalizar(busqueda.value);
    const filtradas = donaciones.filter(donacion => {
        const coincideComercio = normalizar(donacion.comercio?.nombre_comercial).includes(termino);
        const coincideAlimento = donacion.detalles?.some(detalle =>
            normalizar(detalle.nombre_alimento).includes(termino)
        );
        return !termino || coincideComercio || coincideAlimento;
    });

    filtradas.sort((a, b) => orden.value === 'quantity'
        ? Number(b.cantidad_total) - Number(a.cantidad_total)
        : String(b.fecha_donacion).localeCompare(String(a.fecha_donacion)));
    contador.textContent = `${filtradas.length} ${filtradas.length === 1 ? 'donación' : 'donaciones'}`;

    if (filtradas.length === 0) {
        lista.replaceChildren(crearElemento(
            'p',
            'donations-message',
            donaciones.length
                ? 'No encontramos donaciones que coincidan con tu búsqueda.'
                : 'No hay donaciones disponibles por el momento.',
        ));
        return;
    }
    lista.replaceChildren(...filtradas.map(crearTarjeta));
}

function mostrarError(error) {
    contador.textContent = 'Donaciones no disponibles';
    lista.replaceChildren(crearElemento(
        'p',
        'donations-message donations-message--error',
        error instanceof Error ? error.message : 'No se pudieron cargar las donaciones.',
    ));
}

busqueda.addEventListener('input', renderizar);
orden.addEventListener('change', renderizar);

try {
    donaciones = await obtenerDonacionesDisponibles();
    renderizar();
} catch (error) {
    mostrarError(error);
}
