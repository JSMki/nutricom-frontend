import './main.js';
import { obtenerDonacion } from './datos.js';

const contenido = document.getElementById('donation-detail');
const parametros = new URLSearchParams(window.location.search);
const idDonacion = Number(parametros.get('id'));

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
    if (!fecha) return 'No disponible';
    const [anio, mes, dia] = String(fecha).split('-').map(Number);
    if (!anio || !mes || !dia) return 'No disponible';
    return new Intl.DateTimeFormat('es-MX', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(anio, mes - 1, dia));
}

function diasHasta(fecha) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(fecha ?? ''))) return null;
    const [anio, mes, dia] = fecha.split('-').map(Number);
    const objetivo = Date.UTC(anio, mes - 1, dia);
    const fechaObjetivo = new Date(objetivo);
    if (
        fechaObjetivo.getUTCFullYear() !== anio
        || fechaObjetivo.getUTCMonth() !== mes - 1
        || fechaObjetivo.getUTCDate() !== dia
    ) return null;
    const hoy = new Date();
    const hoyUtc = Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    if (Number.isNaN(objetivo)) return null;
    return Math.floor((objetivo - hoyUtc) / 86400000);
}

function crearCeldaFecha(fecha) {
    const celda = document.createElement('td');
    const dias = diasHasta(fecha);
    if (dias === null) {
        celda.textContent = '—';
        return celda;
    }

    const estado = dias < 0
        ? ['detail-expiry detail-expiry--expired', 'Vencida']
        : dias <= 7
            ? ['detail-expiry detail-expiry--soon', 'Próxima a caducar']
            : ['detail-expiry detail-expiry--current', 'Vigente'];
    const indicador = crearElemento('span', estado[0], `${formatearFecha(fecha)} · ${estado[1]}`);
    celda.appendChild(indicador);
    return celda;
}

function crearMensaje(mensaje) {
    const estado = crearElemento('div', 'detail-state');
    estado.append(
        crearElemento('p', 'detail-message', mensaje),
        crearElemento('a', 'detail-button detail-button--secondary', 'Volver a donaciones disponibles'),
    );
    estado.querySelector('a').href = './donaciones-disponibles.html';
    contenido.replaceChildren(estado);
}

function crearDato(etiqueta, valor) {
    const dato = document.createElement('div');
    dato.className = 'detail-data';
    dato.append(
        crearElemento('dt', '', etiqueta),
        crearElemento('dd', '', valor || 'No disponible'),
    );
    return dato;
}

function renderizar(donacion) {
    const folio = `DON-${String(donacion.id_donacion).padStart(4, '0')}`;
    const comercio = donacion.comercio ?? {};
    const panel = crearElemento('div', 'detail-panel');
    const top = crearElemento('div', 'detail-panel__header');
    const heading = document.createElement('div');
    heading.append(
        crearElemento('p', 'detail-folio', folio),
        crearElemento('h2', '', comercio.nombre_comercial ?? 'Comercio no disponible'),
    );
    const badge = crearElemento('span', `detail-status detail-status--${donacion.estado}`, donacion.estado);
    top.append(heading, badge);

    const info = crearElemento('section', 'detail-section');
    info.setAttribute('aria-labelledby', 'detail-commerce-heading');
    info.appendChild(crearElemento('h3', 'detail-section__title', 'Información del comercio'));
    info.lastElementChild.id = 'detail-commerce-heading';
    const datosComercio = document.createElement('dl');
    datosComercio.className = 'detail-data-grid';
    datosComercio.append(
        crearDato('Tipo de comercio', comercio.tipo_comercio),
        crearDato('Dirección', comercio.direccion),
        crearDato('Colonia', comercio.colonia),
        crearDato('Teléfono', comercio.telefono),
        crearDato('Correo', comercio.correo),
        crearDato('Fecha de donación', formatearFecha(donacion.fecha_donacion)),
    );
    info.appendChild(datosComercio);

    const observaciones = crearElemento('p', 'detail-observations', donacion.observaciones || 'Sin observaciones.');
    const tablaWrap = crearElemento('div', 'detail-table-wrap');
    const tabla = document.createElement('table');
    tabla.className = 'detail-table';
    tabla.innerHTML = '<caption>Alimentos incluidos en la donación</caption><thead><tr><th scope="col">Alimento</th><th scope="col">Categoría</th><th scope="col">Cantidad</th><th scope="col">Unidad</th><th scope="col">Fecha de caducidad</th><th scope="col">Consumo preferente</th></tr></thead>';
    const cuerpo = document.createElement('tbody');
    for (const detalle of donacion.detalles ?? []) {
        const fila = document.createElement('tr');
        for (const valor of [
            detalle.nombre_alimento,
            detalle.nombre_categoria,
            new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 }).format(Number(detalle.cantidad) || 0),
            detalle.abreviatura,
        ]) {
            fila.appendChild(crearElemento('td', '', valor));
        }
        fila.append(
            crearCeldaFecha(detalle.fecha_caducidad),
            crearCeldaFecha(detalle.fecha_consumo_preferente),
        );
        cuerpo.appendChild(fila);
    }
    if (!donacion.detalles?.length) {
        const fila = document.createElement('tr');
        const celda = crearElemento('td', 'detail-table__empty', 'Esta donación no tiene alimentos registrados.');
        celda.colSpan = 6;
        fila.appendChild(celda);
        cuerpo.appendChild(fila);
    }
    tabla.appendChild(cuerpo);
    tablaWrap.appendChild(tabla);

    const actions = crearElemento('div', 'detail-actions');
    const back = crearElemento('a', 'detail-button detail-button--secondary', 'Volver a disponibles');
    back.href = './donaciones-disponibles.html';
    actions.appendChild(back);
    if (donacion.estado === 'disponible' && donacion.id_organizacion == null) {
        const claim = crearElemento('a', 'detail-button detail-button--primary', 'Reclamar donación');
        claim.href = `./reclamar-donacion.html?id=${encodeURIComponent(donacion.id_donacion)}`;
        actions.appendChild(claim);
    }

    panel.append(
        top,
        info,
        crearElemento('section', 'detail-section'),
    );
    const observationsSection = panel.lastElementChild;
    observationsSection.append(
        crearElemento('h3', 'detail-section__title', 'Observaciones'),
        observaciones,
    );
    panel.append(
        crearElemento('section', 'detail-section'),
    );
    const foodSection = panel.lastElementChild;
    foodSection.append(
        crearElemento('h3', 'detail-section__title', 'Alimentos de la donación'),
        tablaWrap,
    );
    contenido.replaceChildren(panel, actions);
}

if (!Number.isInteger(idDonacion) || idDonacion <= 0) {
    crearMensaje('El identificador de la donación no es válido.');
} else {
    try {
        const donacion = await obtenerDonacion(idDonacion);
        if (!donacion) {
            crearMensaje('No encontramos la donación solicitada.');
        } else {
            renderizar(donacion);
        }
    } catch (error) {
        crearMensaje(error instanceof Error ? error.message : 'No se pudo cargar el detalle de la donación.');
    }
}
