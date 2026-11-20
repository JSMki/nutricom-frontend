import './main.js';
import { obtenerAlimentos } from './datos.js';

const listaAlimentos = document.getElementById('catalog-foods');
const busqueda = document.getElementById('catalog-search');
const filtroCategoria = document.getElementById('catalog-category');
const filtroUnidad = document.getElementById('catalog-unit');
const contador = document.getElementById('catalog-count');
const dialogoDetalle = document.getElementById('catalog-detail');
const detalleCategoria = document.getElementById('catalog-detail-category');
const detalleTitulo = document.getElementById('catalog-detail-title');
const detalleContenido = document.getElementById('catalog-detail-content');
const formatoNumero = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 1 });
let alimentos = [];

const categoriasPorAlimento = [
    { palabras: ['jitomate', 'tomate', 'manzana', 'plátano', 'platano', 'zanahoria'], nombre: 'Frutas y verduras' },
    { palabras: ['arroz', 'frijol', 'avena', 'lenteja'], nombre: 'Granos' },
    { palabras: ['leche', 'yogur'], nombre: 'Lácteos' },
];

const sidebarToggle = document.getElementById('toggle-sidebar-btn');
sidebarToggle?.addEventListener('click', () => {
    const collapsed = document.body.classList.toggle('home-layout--sidebar-collapsed');
    sidebarToggle.setAttribute('aria-expanded', String(!collapsed));
    sidebarToggle.setAttribute('aria-label', collapsed ? 'Expandir menú' : 'Contraer menú');
    if (sidebarToggle.firstElementChild) {
        sidebarToggle.firstElementChild.textContent = collapsed ? '›' : '‹';
    }
});

function normalizar(texto) {
    return String(texto ?? '').trim().toLocaleLowerCase('es-MX').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function obtenerNombre(alimento) {
    return alimento.nombre_alimento ?? alimento.nombre ?? 'Alimento';
}

function obtenerCategoria(alimento) {
    if (alimento.categoria) return alimento.categoria;
    const nombre = normalizar(obtenerNombre(alimento));
    return categoriasPorAlimento.find(grupo =>
        grupo.palabras.some(palabra => nombre.includes(normalizar(palabra)))
    )?.nombre ?? 'Otros';
}

function crearElemento(etiqueta, clase, texto) {
    const elemento = document.createElement(etiqueta);
    elemento.className = clase;
    elemento.textContent = String(texto);
    return elemento;
}

function agregarCampoDetalle(etiqueta, valor) {
    const campo = document.createElement('div');
    const termino = crearElemento('dt', '', etiqueta);
    const detalle = crearElemento('dd', '', valor || 'Sin información');
    campo.append(termino, detalle);
    detalleContenido.appendChild(campo);
}

function mostrarDetalle(alimento) {
    detalleCategoria.textContent = obtenerCategoria(alimento).toLocaleUpperCase('es-MX');
    detalleTitulo.textContent = obtenerNombre(alimento);
    detalleContenido.replaceChildren();
    agregarCampoDetalle('Descripción', alimento.descripcion);
    agregarCampoDetalle('Unidad de medida', alimento.unidad_medida || 'Unidad');
    agregarCampoDetalle('Calorías por porción', `${formatoNumero.format(Number(alimento.calorias_porcion) || 0)} kcal`);
    agregarCampoDetalle('Proteínas', `${formatoNumero.format(Number(alimento.proteinas) || 0)} g`);
    agregarCampoDetalle('Carbohidratos', `${formatoNumero.format(Number(alimento.carbohidratos) || 0)} g`);
    agregarCampoDetalle('Grasas', `${formatoNumero.format(Number(alimento.grasas) || 0)} g`);
    agregarCampoDetalle(
        'Estado',
        alimento.estado === 'disponible' ? 'Disponible' : alimento.estado === 'agotado' ? 'Agotado' : alimento.estado,
    );
    dialogoDetalle.showModal();
}

function inicializarUnidades() {
    const unidades = [...new Set(alimentos.map(alimento => alimento.unidad_medida).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, 'es-MX'));
    for (const unidad of unidades) {
        const opcion = document.createElement('option');
        opcion.value = unidad;
        opcion.textContent = unidad;
        filtroUnidad.appendChild(opcion);
    }
}

function crearFila(alimento) {
    const fila = document.createElement('article');
    fila.className = 'catalog-page__food';

    const encabezado = document.createElement('header');
    encabezado.className = 'catalog-page__food-header';
    const tituloGrupo = document.createElement('div');
    tituloGrupo.append(
        crearElemento('p', 'catalog-page__food-category', obtenerCategoria(alimento)),
        crearElemento('h2', '', obtenerNombre(alimento)),
    );
    encabezado.append(
        tituloGrupo,
        crearElemento('span', 'catalog-page__food-unit', alimento.unidad_medida || 'Unidad'),
    );
    const botonDetalle = document.createElement('button');
    botonDetalle.className = 'catalog-page__detail-button';
    botonDetalle.type = 'button';
    botonDetalle.setAttribute('aria-label', `Ver detalle de ${obtenerNombre(alimento)}`);
    botonDetalle.title = 'Ver detalle del alimento';
    botonDetalle.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    botonDetalle.addEventListener('click', () => mostrarDetalle(alimento));
    encabezado.appendChild(botonDetalle);

    const nutrientes = [
        ['kcal', alimento.calorias_porcion],
        ['proteína', alimento.proteinas],
        ['carbos', alimento.carbohidratos],
        ['grasas', alimento.grasas],
    ];
    const nutricion = document.createElement('div');
    nutricion.className = 'catalog-page__nutrition';
    for (const [etiqueta, valor] of nutrientes) {
        const dato = document.createElement('div');
        dato.className = 'catalog-page__nutrition-item';
        dato.append(
            crearElemento('strong', '', formatoNumero.format(Number(valor) || 0)),
            crearElemento('span', '', etiqueta),
        );
        nutricion.appendChild(dato);
    }

    fila.append(encabezado, nutricion);
    return fila;
}

function renderizar() {
    const termino = normalizar(busqueda.value);
    const categoriaSeleccionada = filtroCategoria.value;
    const unidadSeleccionada = filtroUnidad.value;
    const filtrados = alimentos.filter(alimento =>
        (!termino || normalizar([
            obtenerNombre(alimento),
            alimento.descripcion,
            obtenerCategoria(alimento),
            alimento.unidad_medida,
        ].join(' ')).includes(termino))
        &&
        (!categoriaSeleccionada || obtenerCategoria(alimento) === categoriaSeleccionada)
        && (!unidadSeleccionada || alimento.unidad_medida === unidadSeleccionada)
    );

    contador.textContent = `${filtrados.length} ${filtrados.length === 1 ? 'alimento' : 'alimentos'}`;
    if (filtrados.length === 0) {
        listaAlimentos.replaceChildren(
            crearElemento('p', 'catalog-page__message', 'No hay alimentos que coincidan con los filtros.'),
        );
        return;
    }
    listaAlimentos.replaceChildren(...filtrados.map(crearFila));
}

function mostrarError(error) {
    contador.textContent = 'Catálogo no disponible';
    listaAlimentos.replaceChildren(
        crearElemento(
            'p',
            'catalog-page__message catalog-page__message--error',
            error instanceof Error ? error.message : 'No se pudo cargar el catálogo de alimentos.',
        ),
    );
}

busqueda.addEventListener('input', renderizar);
filtroCategoria.addEventListener('change', renderizar);
filtroUnidad.addEventListener('change', renderizar);
document.getElementById('catalog-detail-close').addEventListener('click', () => dialogoDetalle.close());
dialogoDetalle.addEventListener('click', evento => {
    if (evento.target === dialogoDetalle) dialogoDetalle.close();
});

try {
    alimentos = await obtenerAlimentos();
    inicializarUnidades();
    renderizar();
} catch (error) {
    mostrarError(error);
}
