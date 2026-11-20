import { usuarioAutenticado } from './main.js';
import { solicitudesApi } from './api.js';
import { obtenerAlimentos } from './datos.js';

const formulario = document.getElementById('solicitud-form');
const botonEnviar = document.getElementById('solicitud-submit');
const avisoFormulario = document.getElementById('solicitud-notice');
const contenedorAlimentos = document.getElementById('solicitud-alimentos');
const contenedorSeleccionados = document.getElementById('solicitud-seleccionados');
const contadorAlimentos = document.getElementById('solicitud-food-count');
const contadorUnidades = document.getElementById('solicitud-unit-count');
const filtroCategorias = document.querySelector('.solicitudes-page__categories');
const numeroFormato = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 1 });
const cantidadesSeleccionadas = new Map();
let alimentos = [];
let categoriaActiva = 'Todas';

const categoriasPorAlimento = [
    { palabras: ['jitomate', 'manzana', 'plátano', 'platano', 'zanahoria'], categoria: 'Frutas y verduras' },
    { palabras: ['arroz', 'frijol', 'avena', 'lenteja'], categoria: 'Granos' },
    { palabras: ['leche', 'yogur'], categoria: 'Lácteos' },
];

const ordenCatalogo = ['jitomate salad', 'arroz blanco', 'manzana gala', 'frijol negro', 'leche entera'];

const sidebarToggle = document.getElementById('toggle-sidebar-btn');
sidebarToggle?.addEventListener('click', () => {
    const collapsed = document.body.classList.toggle('home-layout--sidebar-collapsed');
    sidebarToggle.setAttribute('aria-expanded', String(!collapsed));
    sidebarToggle.setAttribute('aria-label', collapsed ? 'Expandir menú' : 'Contraer menú');
    if (sidebarToggle.firstElementChild) {
        sidebarToggle.firstElementChild.textContent = collapsed ? '›' : '‹';
    }
});

function normalizarTexto(texto) {
    return texto.toLocaleLowerCase('es-MX').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function obtenerNombre(alimento) {
    return alimento.nombre_alimento ?? alimento.nombre ?? 'Alimento';
}

function obtenerId(alimento) {
    return alimento.id_alimento ?? alimento.id;
}

function obtenerCategoria(alimento) {
    if (alimento.categoria) return alimento.categoria;
    const nombre = normalizarTexto(obtenerNombre(alimento));
    return categoriasPorAlimento.find(grupo =>
        grupo.palabras.some(palabra => nombre.includes(normalizarTexto(palabra)))
    )?.categoria ?? 'Granos';
}

function obtenerUnidadCorta(unidad) {
    const unidades = {
        kilogramo: 'kg',
        litro: 'L',
        pieza: 'pieza',
        gramo: 'g',
        mililitro: 'ml',
    };
    return unidades[normalizarTexto(unidad)] ?? unidad ?? 'Unidad';
}

function obtenerAlimentosVisibles() {
    const filtrados = categoriaActiva === 'Todas'
        ? alimentos
        : alimentos.filter(alimento => obtenerCategoria(alimento) === categoriaActiva);
    if (categoriaActiva !== 'Todas') return filtrados;

    return [...filtrados].sort((a, b) => {
        const indiceA = ordenCatalogo.findIndex(nombre => normalizarTexto(obtenerNombre(a)).includes(nombre));
        const indiceB = ordenCatalogo.findIndex(nombre => normalizarTexto(obtenerNombre(b)).includes(nombre));
        return (indiceA === -1 ? ordenCatalogo.length : indiceA)
            - (indiceB === -1 ? ordenCatalogo.length : indiceB);
    });
}

function crearTexto(elemento, clase, texto) {
    const nodo = document.createElement(elemento);
    nodo.className = clase;
    nodo.textContent = texto;
    return nodo;
}

function renderizarCatalogo() {
    const lista = obtenerAlimentosVisibles();
    contenedorAlimentos.replaceChildren();

    if (lista.length === 0) {
        contenedorAlimentos.appendChild(
            crearTexto('p', 'solicitudes-page__feedback', 'No hay alimentos en esta categoría.')
        );
        return;
    }

    for (const alimento of lista) {
        const id = obtenerId(alimento);
        const nombre = obtenerNombre(alimento);
        const articulo = document.createElement('article');

        const informacion = document.createElement('div');
        informacion.className = 'solicitudes-page__food-info';
        informacion.append(
            crearTexto('strong', '', nombre),
            crearTexto('span', '', `${alimento.unidad_medida || 'Unidad'} · ${numeroFormato.format(Number(alimento.calorias_porcion) || 0)} kcal`),
            crearTexto('small', '', `Proteínas ${numeroFormato.format(Number(alimento.proteinas) || 0)} g · Carbohidratos ${numeroFormato.format(Number(alimento.carbohidratos) || 0)} g`)
        );

        const agregar = document.createElement('button');
        agregar.className = 'solicitudes-page__food-add';
        agregar.type = 'button';
        agregar.textContent = cantidadesSeleccionadas.has(id) ? '✓' : '+';
        agregar.setAttribute('aria-label', cantidadesSeleccionadas.has(id)
            ? `Agregar otra unidad de ${nombre}`
            : `Agregar ${nombre} a la solicitud`);
        agregar.addEventListener('click', () => {
            cantidadesSeleccionadas.set(id, (cantidadesSeleccionadas.get(id) ?? 0) + 1);
            renderizar();
        });

        articulo.className = 'solicitudes-page__food';
        articulo.append(informacion, agregar);
        contenedorAlimentos.appendChild(articulo);
    }
}

function cambiarCantidad(id, delta) {
    const cantidad = cantidadesSeleccionadas.get(id) ?? 0;
    if (cantidad + delta <= 0) {
        cantidadesSeleccionadas.delete(id);
    } else {
        cantidadesSeleccionadas.set(id, Math.min(99, cantidad + delta));
    }
    renderizar();
}

function renderizarSeleccion() {
    const seleccionados = alimentos.filter(alimento => cantidadesSeleccionadas.has(obtenerId(alimento)));
    const totalUnidades = [...cantidadesSeleccionadas.values()].reduce((total, cantidad) => total + cantidad, 0);

    contadorAlimentos.textContent = `${seleccionados.length} ${seleccionados.length === 1 ? 'ALIMENTO' : 'ALIMENTOS'}`;
    contadorUnidades.textContent = `${totalUnidades} ${totalUnidades === 1 ? 'unidad' : 'unidades'} en total`;
    botonEnviar.disabled = seleccionados.length === 0;
    contenedorSeleccionados.replaceChildren();

    if (seleccionados.length === 0) {
        contenedorSeleccionados.appendChild(
            crearTexto('p', 'solicitudes-page__summary-empty', 'Selecciona los alimentos que necesita tu familia.')
        );
        return;
    }

    for (const alimento of seleccionados) {
        const id = obtenerId(alimento);
        const item = document.createElement('div');
        item.className = 'solicitudes-page__selected-item';

        const info = document.createElement('div');
        info.className = 'solicitudes-page__selected-info';
        info.append(
            crearTexto('strong', '', obtenerNombre(alimento)),
            crearTexto('span', '', `Unidad: ${obtenerUnidadCorta(alimento.unidad_medida)}`)
        );

        const control = document.createElement('div');
        control.className = 'solicitudes-page__quantity';
        const restar = document.createElement('button');
        restar.type = 'button';
        restar.textContent = '−';
        restar.setAttribute('aria-label', `Quitar una unidad de ${obtenerNombre(alimento)}`);
        restar.addEventListener('click', () => cambiarCantidad(id, -1));

        const cantidad = document.createElement('output');
        cantidad.textContent = String(cantidadesSeleccionadas.get(id));
        cantidad.setAttribute('aria-label', `Cantidad de ${obtenerNombre(alimento)}`);

        const sumar = document.createElement('button');
        sumar.type = 'button';
        sumar.textContent = '+';
        sumar.setAttribute('aria-label', `Agregar una unidad de ${obtenerNombre(alimento)}`);
        sumar.disabled = cantidadesSeleccionadas.get(id) >= 99;
        sumar.addEventListener('click', () => cambiarCantidad(id, 1));

        control.append(restar, cantidad, sumar);
        item.append(info, control);
        contenedorSeleccionados.appendChild(item);
    }
}

function renderizar() {
    renderizarCatalogo();
    renderizarSeleccion();
}

function mostrarAviso(mensaje, esError = false) {
    avisoFormulario.textContent = mensaje;
    avisoFormulario.classList.toggle('solicitudes-page__notice--error', esError);
    avisoFormulario.hidden = false;
}

filtroCategorias.addEventListener('click', evento => {
    const boton = evento.target.closest('[data-category]');
    if (!boton) return;

    categoriaActiva = boton.dataset.category;
    filtroCategorias.querySelectorAll('[data-category]').forEach(opcion => {
        const activo = opcion === boton;
        opcion.classList.toggle('solicitudes-page__category--active', activo);
        opcion.setAttribute('aria-pressed', String(activo));
    });
    renderizarCatalogo();
});

formulario.addEventListener('submit', async evento => {
    evento.preventDefault();
    avisoFormulario.hidden = true;
    if (!formulario.reportValidity()) return;

    const datos = new FormData(formulario);
    const integrantes = Number(datos.get('integrantes'));
    if (!Number.isInteger(integrantes) || integrantes < 1 || integrantes > 30) {
        mostrarAviso('El número de integrantes debe ser un entero entre 1 y 30.', true);
        return;
    }

    const items = alimentos
        .filter(alimento => cantidadesSeleccionadas.has(obtenerId(alimento)))
        .map(alimento => ({
            id_alimento: obtenerId(alimento),
            nombre_alimento: obtenerNombre(alimento),
            cantidad: cantidadesSeleccionadas.get(obtenerId(alimento)),
            unidad_medida: alimento.unidad_medida,
        }));

    if (items.length === 0) {
        mostrarAviso('Agrega al menos un alimento a tu solicitud.', true);
        return;
    }

    const motivo = String(datos.get('motivo')).trim();
    const solicitud = {
        tipo: 'Apoyo alimentario',
        motivo,
        descripcion: motivo,
        integrantes,
        prioridad: String(datos.get('prioridad')),
        alimentos: items,
    };

    botonEnviar.disabled = true;
    botonEnviar.textContent = 'Enviando...';
    try {
        await solicitudesApi.crear(solicitud);
        formulario.reset();
        cantidadesSeleccionadas.clear();
        renderizar();
        mostrarAviso('Tu solicitud fue enviada correctamente.');
    } catch (error) {
        mostrarAviso(error instanceof Error ? error.message : 'No se pudo enviar la solicitud.', true);
    } finally {
        botonEnviar.textContent = 'Enviar solicitud';
        botonEnviar.disabled = cantidadesSeleccionadas.size === 0;
    }
});

try {
    alimentos = await obtenerAlimentos();
    const arroz = alimentos.find(alimento => normalizarTexto(obtenerNombre(alimento)).includes('arroz blanco'));
    const frijol = alimentos.find(alimento => normalizarTexto(obtenerNombre(alimento)).includes('frijol negro'));
    if (arroz) cantidadesSeleccionadas.set(obtenerId(arroz), 1);
    if (frijol) cantidadesSeleccionadas.set(obtenerId(frijol), 2);
    renderizar();
} catch (error) {
    contenedorAlimentos.replaceChildren(
        crearTexto(
            'p',
            'solicitudes-page__feedback solicitudes-page__feedback--error',
            error instanceof Error ? error.message : 'No se pudo cargar el catálogo de alimentos.'
        )
    );
}

const nombreBeneficiario = usuarioAutenticado?.nombre;
if (nombreBeneficiario) {
    document.getElementById('solicitud-summary-title').setAttribute(
        'aria-label',
        `Solicitud de ${nombreBeneficiario}`
    );
}
