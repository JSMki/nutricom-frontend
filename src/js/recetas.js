import './main.js';
import { obtenerRecetasEconomicas } from './datos.js';

const listaRecetas = document.getElementById('recipes-list');
const contadorRecetas = document.getElementById('recipes-count');
const botonesFiltro = [...document.querySelectorAll('[data-filter]')];
const dialogoDetalle = document.getElementById('recipe-detail');
const tituloDetalle = document.getElementById('recipe-detail-title');
const resumenDetalle = document.getElementById('recipe-detail-summary');
const ingredientesDetalle = document.getElementById('recipe-detail-ingredients');
const preparacionDetalle = document.getElementById('recipe-detail-preparation');
const numeroFormato = new Intl.NumberFormat('es-MX');
let recetas = [];
let filtroActual = 'todas';

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
    elemento.className = clase;
    elemento.textContent = String(texto);
    return elemento;
}

function disponibles(receta) {
    return receta.ingredientes.filter(ingrediente => ingrediente.disponible).length;
}

function crearTarjeta(receta) {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'recetas-page__card';

    const imagenContenedor = document.createElement('div');
    imagenContenedor.className = 'recetas-page__image-wrap';
    const imagen = document.createElement('img');
    imagen.className = 'recetas-page__image';
    imagen.src = receta.imagen;
    imagen.alt = receta.textoAlternativo;
    imagen.loading = 'lazy';
    const disponibilidad = crearElemento(
        'span',
        'recetas-page__availability',
        disponibles(receta) === receta.ingredientes.length
            ? 'Todos disponibles'
            : `${disponibles(receta)} de ${receta.ingredientes.length} disponibles`,
    );
    imagenContenedor.append(imagen, disponibilidad);

    const contenido = document.createElement('div');
    contenido.className = 'recetas-page__content';
    contenido.append(
        crearElemento('p', 'recetas-page__label', 'RECETA ECONÓMICA'),
        crearElemento('h2', 'recetas-page__card-title', receta.nombre),
    );

    const metadatos = document.createElement('p');
    metadatos.className = 'recetas-page__meta';
    metadatos.append(
        crearElemento('span', '', `${receta.tiempoMinutos} min`),
        crearElemento('span', '', `${receta.porciones} porciones`),
    );

    const pie = document.createElement('footer');
    pie.className = 'recetas-page__card-footer';
    const costo = document.createElement('p');
    costo.className = 'recetas-page__cost';
    costo.append(
        crearElemento('span', '', 'Costo estimado'),
        crearElemento('strong', '', `$${numeroFormato.format(receta.costoEstimado)} MXN`),
    );
    const boton = document.createElement('button');
    boton.className = 'recetas-page__detail-button';
    boton.type = 'button';
    boton.textContent = 'Ver receta';
    boton.addEventListener('click', () => abrirDetalle(receta));

    pie.append(costo, boton);
    contenido.append(metadatos, pie);
    tarjeta.append(imagenContenedor, contenido);
    return tarjeta;
}

function recetasFiltradas() {
    switch (filtroActual) {
        case 'menor-80':
            return recetas.filter(receta => receta.costoEstimado < 80);
        case 'rapidas':
            return recetas.filter(receta => receta.tiempoMinutos <= 30);
        case 'disponibles':
            return recetas.filter(receta => disponibles(receta) === receta.ingredientes.length);
        default:
            return recetas;
    }
}

function renderizar() {
    const filtradas = recetasFiltradas();
    contadorRecetas.textContent = `${filtradas.length} ${filtradas.length === 1 ? 'receta' : 'recetas'}`;
    if (!filtradas.length) {
        listaRecetas.replaceChildren(
            crearElemento('p', 'recetas-page__message', 'No hay recetas que coincidan con este filtro.'),
        );
        return;
    }
    listaRecetas.replaceChildren(...filtradas.map(crearTarjeta));
}

function abrirDetalle(receta) {
    tituloDetalle.textContent = receta.nombre;
    resumenDetalle.textContent = `${receta.tiempoMinutos} min · ${receta.porciones} porciones · $${numeroFormato.format(receta.costoEstimado)} MXN`;

    const ingredientes = receta.ingredientes.map(ingrediente => {
        const elemento = document.createElement('li');
        elemento.append(
            crearElemento('span', '', `${ingrediente.nombre} · ${ingrediente.cantidad}`),
            crearElemento(
                'span',
                `receta-detail__ingredient-status${ingrediente.disponible ? '' : ' receta-detail__ingredient-status--missing'}`,
                ingrediente.disponible ? 'Disponible' : 'No disponible',
            ),
        );
        return elemento;
    });
    ingredientesDetalle.replaceChildren(...ingredientes);
    preparacionDetalle.replaceChildren(
        ...receta.preparacion.map(paso => crearElemento('li', '', paso)),
    );
    dialogoDetalle.showModal();
}

function mostrarError(error) {
    contadorRecetas.textContent = 'Recetas no disponibles';
    listaRecetas.replaceChildren(
        crearElemento(
            'p',
            'recetas-page__message recetas-page__message--error',
            error instanceof Error ? error.message : 'No se pudieron cargar las recetas.',
        ),
    );
}

for (const boton of botonesFiltro) {
    boton.addEventListener('click', () => {
        filtroActual = boton.dataset.filter;
        for (const filtro of botonesFiltro) {
            const activo = filtro === boton;
            filtro.classList.toggle('is-active', activo);
            filtro.setAttribute('aria-pressed', String(activo));
        }
        renderizar();
    });
}

document.getElementById('recipe-detail-close').addEventListener('click', () => dialogoDetalle.close());
dialogoDetalle.addEventListener('click', evento => {
    if (evento.target === dialogoDetalle) dialogoDetalle.close();
});

try {
    recetas = await obtenerRecetasEconomicas();
    renderizar();
} catch (error) {
    mostrarError(error);
}
