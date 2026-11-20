import './main.js';
import {
    crearDonacion,
    crearAlimento,
    obtenerAlimentos,
    obtenerCategorias,
    obtenerComercios,
    obtenerDonaciones,
    obtenerOrganizaciones,
} from './datos.js';

const formatoNumero = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 });
const tabla = document.getElementById('donacion-tabla');
const mensajeVacio = document.getElementById('donacion-vacia');
const busqueda = document.getElementById('donacion-buscar');
const filtroEstado = document.getElementById('donacion-filtro-estado');
const dialogo = document.getElementById('donacion-dialog');
const dialogoAlimento = document.getElementById('donacion-food-dialog');
const formulario = document.getElementById('donacion-form');
const formularioAlimento = document.getElementById('donacion-food-form');
const detalle = document.getElementById('donacion-detail');
const lineas = document.getElementById('donacion-lineas');
const errorFormulario = document.getElementById('donacion-error');
const botonGuardar = document.getElementById('donacion-guardar');
const botonAgregarAlimento = document.getElementById('donacion-agregar-alimento');
const botonCrearAlimento = document.getElementById('donacion-crear-alimento');
const botonGuardarAlimento = document.getElementById('donacion-food-save');
const errorAlimento = document.getElementById('donacion-food-error');
const sidebarToggle = document.getElementById('toggle-sidebar-btn');
let contadorLineasDetalle = 0;

const [comercios, organizaciones, categorias, catalogoAlimentos] = await Promise.all([
    obtenerComercios(),
    obtenerOrganizaciones(),
    obtenerCategorias(),
    obtenerAlimentos(),
]);
let alimentos = catalogoAlimentos;
let donaciones = await obtenerDonaciones();

sidebarToggle?.addEventListener('click', () => {
    const collapsed = document.body.classList.toggle('home-layout--sidebar-collapsed');
    sidebarToggle.setAttribute('aria-expanded', String(!collapsed));
    sidebarToggle.setAttribute('aria-label', collapsed ? 'Expandir menú' : 'Contraer menú');
    if (sidebarToggle.firstElementChild) {
        sidebarToggle.firstElementChild.textContent = collapsed ? '›' : '‹';
    }
});

function obtenerFechaLocal() {
    const hoy = new Date();
    return [
        hoy.getFullYear(),
        String(hoy.getMonth() + 1).padStart(2, '0'),
        String(hoy.getDate()).padStart(2, '0'),
    ].join('-');
}

function formatearFecha(fecha) {
    const [anio, mes, dia] = fecha.split('-').map(Number);
    return new Intl.DateTimeFormat('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(anio, mes - 1, dia));
}

function textoEstado(estado) {
    return estado.charAt(0).toLocaleUpperCase('es-MX') + estado.slice(1);
}

function crearCelda(texto, clase) {
    const celda = document.createElement('td');
    celda.textContent = texto;
    if (clase) celda.className = clase;
    return celda;
}

function obtenerDonacionesFiltradas() {
    const texto = busqueda.value.trim().toLocaleLowerCase('es-MX');
    const estado = filtroEstado.value;
    return donaciones.filter(donacion => {
        const coincideTexto = !texto
            || donacion.nombre_comercial.toLocaleLowerCase('es-MX').includes(texto)
            || (donacion.nombre_organizacion ?? '').toLocaleLowerCase('es-MX').includes(texto)
            || `don-${String(donacion.id_donacion).padStart(4, '0')}`.includes(texto);
        return coincideTexto && (!estado || donacion.estado === estado);
    });
}

function crearFilaDonacion(donacion) {
    const fila = document.createElement('tr');
    const estado = document.createElement('span');
    estado.className = `donaciones-page__status donaciones-page__status--${donacion.estado}`;
    estado.textContent = textoEstado(donacion.estado);

    const celdaEstado = document.createElement('td');
    celdaEstado.append(estado);

    const botonDetalle = document.createElement('button');
    botonDetalle.className = 'donaciones-page__detail-button';
    botonDetalle.type = 'button';
    botonDetalle.textContent = 'Ver detalle';
    botonDetalle.addEventListener('click', () => abrirDetalle(donacion));

    const celdaAccion = document.createElement('td');
    celdaAccion.append(botonDetalle);

    fila.append(
        crearCelda(`DON-${String(donacion.id_donacion).padStart(4, '0')}`, 'donaciones-page__folio'),
        crearCelda(formatearFecha(donacion.fecha_donacion)),
        crearCelda(donacion.nombre_comercial),
        crearCelda(donacion.nombre_organizacion ?? 'Sin asignar — pendiente de reclamo'),
        crearCelda(formatoNumero.format(donacion.cantidad_total)),
        celdaEstado,
        celdaAccion,
    );
    return fila;
}

function renderizarTabla() {
    const filtradas = obtenerDonacionesFiltradas();
    tabla.replaceChildren(...filtradas.map(crearFilaDonacion));
    mensajeVacio.hidden = filtradas.length > 0;
}

function renderizarResumen() {
    document.getElementById('donacion-total').textContent = formatoNumero.format(donaciones.length);
    document.getElementById('donacion-pendientes').textContent = formatoNumero.format(
        donaciones.filter(donacion => donacion.estado === 'disponible').length,
    );
    document.getElementById('donacion-asignadas').textContent = formatoNumero.format(
        donaciones.filter(donacion => donacion.id_organizacion !== null).length,
    );
}

function poblarSelectores() {
    const selectorComercio = document.getElementById('donacion-comercio');
    const selectorOrganizacion = document.getElementById('donacion-organizacion');
    const opcionesComercios = comercios.map(comercio => {
        const opcion = document.createElement('option');
        opcion.value = String(comercio.id_comercio);
        opcion.textContent = comercio.nombre_comercial;
        return opcion;
    });
    const opcionesOrganizaciones = organizaciones.map(organizacion => {
        const opcion = document.createElement('option');
        opcion.value = String(organizacion.id_organizacion);
        opcion.textContent = organizacion.nombre_organizacion;
        return opcion;
    });
    selectorComercio.append(...opcionesComercios);
    selectorOrganizacion.append(...opcionesOrganizaciones);

    const selectorCategoria = document.getElementById('donacion-food-category');
    categorias
        .filter(categoria => categoria.estado === 'activa')
        .forEach(categoria => {
            const opcion = document.createElement('option');
            opcion.value = String(categoria.id_categoria);
            opcion.textContent = categoria.nombre_categoria;
            selectorCategoria.append(opcion);
        });
}

function crearLineaDetalle() {
    const linea = document.createElement('div');
    linea.className = 'donacion-form__line';
    const indiceLinea = ++contadorLineasDetalle;

    const campoAlimento = document.createElement('label');
    campoAlimento.append(document.createTextNode('Alimento'));
    const selectorAlimento = document.createElement('select');
    selectorAlimento.name = 'id_alimento';
    selectorAlimento.required = true;
    const opcionInicial = document.createElement('option');
    opcionInicial.value = '';
    opcionInicial.textContent = 'Selecciona un alimento';
    selectorAlimento.append(opcionInicial);
    alimentos
        .filter(alimento => alimento.estado !== 'agotado')
        .forEach(alimento => {
        const opcion = document.createElement('option');
        opcion.value = String(alimento.id_alimento);
        opcion.textContent = `${alimento.nombre_alimento} (${alimento.unidad_medida})`;
        selectorAlimento.append(opcion);
    });
    campoAlimento.append(selectorAlimento);

    const campoCantidad = document.createElement('label');
    campoCantidad.append(document.createTextNode('Cantidad'));
    const entradaCantidad = document.createElement('input');
    entradaCantidad.name = 'cantidad';
    entradaCantidad.type = 'number';
    entradaCantidad.min = '0.01';
    entradaCantidad.step = '0.01';
    entradaCantidad.placeholder = '0.00';
    entradaCantidad.required = true;
    campoCantidad.append(entradaCantidad);

    function crearCampoFecha(etiqueta, nombre) {
        const campo = document.createElement('label');
        campo.className = 'donacion-form__date-field';
        const texto = document.createElement('span');
        texto.textContent = etiqueta;
        const entrada = document.createElement('input');
        entrada.className = 'donacion-form__expiry-input';
        entrada.name = nombre;
        entrada.type = 'date';
        entrada.min = obtenerFechaLocal();
        const error = document.createElement('span');
        error.className = 'donacion-form__date-error';
        error.id = `donacion-${nombre}-${indiceLinea}-error`;
        error.setAttribute('aria-live', 'polite');
        entrada.setAttribute('aria-describedby', error.id);
        entrada.addEventListener('input', () => {
            if (linea.dataset.validationAttempted === 'true') validarFechasLinea(linea);
        });
        entrada.addEventListener('change', () => {
            if (linea.dataset.validationAttempted === 'true') validarFechasLinea(linea);
        });
        campo.append(texto, entrada, error);
        return campo;
    }

    const campoCaducidad = crearCampoFecha('Fecha de caducidad', 'fecha_caducidad');
    const campoConsumoPreferente = crearCampoFecha(
        'Fecha de consumo preferente',
        'fecha_consumo_preferente',
    );

    const botonQuitar = document.createElement('button');
    botonQuitar.className = 'donacion-form__remove';
    botonQuitar.type = 'button';
    botonQuitar.textContent = '×';
    botonQuitar.setAttribute('aria-label', 'Quitar alimento');
    botonQuitar.addEventListener('click', () => linea.remove());

    linea.append(campoAlimento, campoCantidad, campoCaducidad, campoConsumoPreferente, botonQuitar);
    lineas.append(linea);
}

function validarFechasLinea(linea) {
    const caducidad = linea.querySelector('[name="fecha_caducidad"]');
    const consumo = linea.querySelector('[name="fecha_consumo_preferente"]');
    const errorCaducidad = caducidad.parentElement.querySelector('.donacion-form__date-error');
    const errorConsumo = consumo.parentElement.querySelector('.donacion-form__date-error');
    const hayCaducidad = Boolean(caducidad.value);
    const hayConsumo = Boolean(consumo.value);
    const fechaMinima = obtenerFechaLocal();
    let valido = true;

    for (const [entrada, error, etiqueta] of [
        [caducidad, errorCaducidad, 'caducidad'],
        [consumo, errorConsumo, 'consumo preferente'],
    ]) {
        if (entrada.value && entrada.value < fechaMinima) {
            error.textContent = `La fecha de ${etiqueta} no puede ser anterior a hoy.`;
            entrada.setAttribute('aria-invalid', 'true');
            valido = false;
        } else {
            error.textContent = '';
            entrada.removeAttribute('aria-invalid');
        }
    }

    if (!hayCaducidad && !hayConsumo) {
        errorCaducidad.textContent = 'Indica al menos una de las dos fechas.';
        errorConsumo.textContent = 'Indica al menos una de las dos fechas.';
        caducidad.setAttribute('aria-invalid', 'true');
        consumo.setAttribute('aria-invalid', 'true');
        valido = false;
    }
    return valido;
}

function actualizarOpcionesAlimentos() {
    lineas.querySelectorAll('.donacion-form__line').forEach(linea => {
        const selector = linea.querySelector('[name="id_alimento"]');
        const valorActual = selector.value;
        const opcionInicial = selector.options[0].cloneNode(true);
        selector.replaceChildren(opcionInicial);
        alimentos
            .filter(alimento => alimento.estado !== 'agotado')
            .forEach(alimento => {
                const opcion = document.createElement('option');
                opcion.value = String(alimento.id_alimento);
                opcion.textContent = `${alimento.nombre_alimento} (${alimento.unidad_medida})`;
                selector.append(opcion);
            });
        selector.value = valorActual;
    });
}

function abrirFormulario() {
    formulario.reset();
    lineas.replaceChildren();
    crearLineaDetalle();
    document.getElementById('donacion-fecha').value = obtenerFechaLocal();
    errorFormulario.hidden = true;
    errorFormulario.textContent = '';
    detalle.hidden = true;
    formulario.hidden = false;
    document.getElementById('donacion-dialog-eyebrow').textContent = 'NUEVO REGISTRO';
    document.getElementById('donacion-dialog-titulo').textContent = 'Registrar donación';
    botonGuardar.disabled = !alimentos.some(alimento => alimento.estado !== 'agotado');
    if (botonGuardar.disabled) {
        errorFormulario.textContent = 'No hay alimentos disponibles en el catálogo para registrar una donación.';
        errorFormulario.hidden = false;
    }
    dialogo.showModal();
}

function abrirFormularioAlimento() {
    formularioAlimento.reset();
    errorAlimento.hidden = true;
    errorAlimento.textContent = '';
    dialogoAlimento.showModal();
}

async function guardarAlimentoParaDonacion(evento) {
    evento.preventDefault();
    errorAlimento.hidden = true;
    errorAlimento.textContent = '';
    if (!formularioAlimento.reportValidity()) return;

    botonGuardarAlimento.disabled = true;
    try {
        const nuevoAlimento = await crearAlimento({
            ...Object.fromEntries(new FormData(formularioAlimento).entries()),
            estado: 'disponible',
        });
        alimentos = [...alimentos, nuevoAlimento];
        actualizarOpcionesAlimentos();
        let lineaDestino = lineas.lastElementChild;
        if (!lineaDestino || lineaDestino.querySelector('[name="id_alimento"]').value) {
            crearLineaDetalle();
            lineaDestino = lineas.lastElementChild;
        }
        lineaDestino.querySelector('[name="id_alimento"]').value = String(nuevoAlimento.id_alimento);
        lineaDestino.querySelector('[name="cantidad"]').focus();
        botonGuardar.disabled = false;
        errorFormulario.hidden = true;
        errorFormulario.textContent = '';
        formularioAlimento.reset();
        dialogoAlimento.close();
    } catch (error) {
        errorAlimento.textContent = error instanceof Error
            ? error.message
            : 'No se pudo agregar el alimento al catálogo.';
        errorAlimento.hidden = false;
    } finally {
        botonGuardarAlimento.disabled = false;
    }
}

function crearCampoDetalle(etiqueta, valor) {
    const campo = document.createElement('div');
    const termino = document.createElement('dt');
    const descripcion = document.createElement('dd');
    campo.className = 'donacion-detail__field';
    termino.textContent = etiqueta;
    descripcion.textContent = valor;
    campo.append(termino, descripcion);
    return campo;
}

function abrirDetalle(donacion) {
    formulario.hidden = true;
    detalle.hidden = false;
    document.getElementById('donacion-dialog-eyebrow').textContent =
        `DON-${String(donacion.id_donacion).padStart(4, '0')}`;
    document.getElementById('donacion-dialog-titulo').textContent = 'Detalle de donación';

    const campos = document.getElementById('donacion-detail-fields');
    campos.replaceChildren(
        crearCampoDetalle('Comercio donante', donacion.nombre_comercial),
        crearCampoDetalle('Organización receptora', donacion.nombre_organizacion ?? 'Sin asignar — pendiente de reclamo'),
        crearCampoDetalle('Fecha', formatearFecha(donacion.fecha_donacion)),
        crearCampoDetalle('Estado', textoEstado(donacion.estado)),
        crearCampoDetalle('Cantidad total', formatoNumero.format(donacion.cantidad_total)),
        crearCampoDetalle('Observaciones', donacion.observaciones || 'Sin observaciones'),
    );

    const lista = document.getElementById('donacion-detail-items');
    lista.replaceChildren(...donacion.detalles.map(item => {
        const elemento = document.createElement('li');
        const caducidad = item.fecha_caducidad ? formatearFecha(item.fecha_caducidad) : '—';
        const consumo = item.fecha_consumo_preferente
            ? formatearFecha(item.fecha_consumo_preferente)
            : '—';
        elemento.textContent = `${item.nombre_alimento}: ${formatoNumero.format(item.cantidad)} ${item.unidad_medida} · Caducidad: ${caducidad} · Consumo preferente: ${consumo}`;
        return elemento;
    }));
    dialogo.showModal();
}

function obtenerDetallesFormulario() {
    return [...lineas.querySelectorAll('.donacion-form__line')].map(linea => ({
        id_alimento: linea.querySelector('[name="id_alimento"]').value,
        cantidad: linea.querySelector('[name="cantidad"]').value,
        fecha_caducidad: linea.querySelector('[name="fecha_caducidad"]').value || null,
        fecha_consumo_preferente: linea.querySelector('[name="fecha_consumo_preferente"]').value || null,
    }));
}

async function guardarFormulario(evento) {
    evento.preventDefault();
    errorFormulario.hidden = true;
    errorFormulario.textContent = '';

    const lineasDetalle = [...lineas.querySelectorAll('.donacion-form__line')];
    for (const linea of lineasDetalle) {
        linea.dataset.validationAttempted = 'true';
    }
    if (!lineasDetalle.map(validarFechasLinea).every(Boolean)) {
        lineas.querySelector('[aria-invalid="true"]')?.focus();
        return;
    }
    if (!formulario.reportValidity()) return;

    botonGuardar.disabled = true;
    try {
        await crearDonacion({
            id_comercio: formulario.elements.namedItem('id_comercio').value,
            id_organizacion: formulario.elements.namedItem('id_organizacion').value,
            fecha_donacion: formulario.elements.namedItem('fecha_donacion').value,
            observaciones: formulario.elements.namedItem('observaciones').value,
            detalles: obtenerDetallesFormulario(),
        });
        donaciones = await obtenerDonaciones();
        renderizarResumen();
        renderizarTabla();
        dialogo.close();
    } catch (error) {
        errorFormulario.textContent = error instanceof Error
            ? error.message
            : 'No se pudo guardar la donación.';
        errorFormulario.hidden = false;
    } finally {
        botonGuardar.disabled = false;
    }
}

document.getElementById('donacion-abrir').addEventListener('click', abrirFormulario);
botonAgregarAlimento.addEventListener('click', crearLineaDetalle);
botonCrearAlimento.addEventListener('click', abrirFormularioAlimento);
document.getElementById('donacion-dialog-cerrar').addEventListener('click', () => dialogo.close());
document.getElementById('donacion-cancelar').addEventListener('click', () => dialogo.close());
document.getElementById('donacion-detail-cerrar').addEventListener('click', () => dialogo.close());
document.getElementById('donacion-form').addEventListener('submit', guardarFormulario);
formularioAlimento.addEventListener('submit', guardarAlimentoParaDonacion);
document.getElementById('donacion-food-close').addEventListener('click', () => dialogoAlimento.close());
document.getElementById('donacion-food-cancel').addEventListener('click', () => dialogoAlimento.close());
document.getElementById('donacion-buscar').addEventListener('input', renderizarTabla);
document.getElementById('donacion-filtro-estado').addEventListener('change', renderizarTabla);
dialogo.addEventListener('click', evento => {
    if (evento.target === dialogo) dialogo.close();
});
dialogoAlimento.addEventListener('click', evento => {
    if (evento.target === dialogoAlimento) dialogoAlimento.close();
});

poblarSelectores();
renderizarResumen();
renderizarTabla();
