import {
    actualizarAlimento,
    crearAlimento,
    obtenerAlimento,
    obtenerCategorias,
    obtenerUsuarioActual,
} from './datos.js';

const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const form = document.getElementById('food-form');
const errorMessage = document.getElementById('food-form-error');
const categorySelect = document.getElementById('food-category');
const [categorias, usuario, alimento] = await Promise.all([
    obtenerCategorias(),
    obtenerUsuarioActual(),
    id ? obtenerAlimento(id) : Promise.resolve(null),
]);

document.getElementById('user-fullname').textContent = usuario.nombre;
document.getElementById('user-role').textContent = usuario.nombreRol;
document.getElementById('user-initials').textContent = usuario.nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(nombre => nombre[0])
    .join('')
    .toLocaleUpperCase('es-MX');

const sidebarToggle = document.getElementById('toggle-sidebar-btn');
const activeLink = document.querySelector('.home-sidebar__link[href="./alimentos.html"]');
document.querySelectorAll('.home-sidebar__link[aria-current="page"]').forEach(link => {
    link.removeAttribute('aria-current');
});
activeLink?.setAttribute('aria-current', 'page');
sidebarToggle.addEventListener('click', () => {
    const collapsed = document.body.classList.toggle('home-layout--sidebar-collapsed');
    document.body.classList.toggle('food-form-page--sidebar-collapsed', collapsed);
    sidebarToggle.setAttribute('aria-expanded', String(!collapsed));
    sidebarToggle.setAttribute('aria-label', collapsed ? 'Expandir menú' : 'Contraer menú');
    sidebarToggle.firstElementChild.textContent = collapsed ? '›' : '‹';
});

categorias
    .filter(categoria => categoria.estado === 'activa')
    .forEach(categoria => {
        const option = document.createElement('option');
        option.value = String(categoria.id_categoria);
        option.textContent = categoria.nombre_categoria;
        categorySelect.append(option);
    });

if (id && !alimento) {
    errorMessage.textContent = `No existe un alimento con el identificador "${id}".`;
    errorMessage.hidden = false;
    form.querySelectorAll('input, select, textarea, button').forEach(control => {
        control.disabled = true;
    });
} else if (alimento) {
    document.title = `Editar ${alimento.nombre_alimento} - NutriComunidad`;
    document.getElementById('food-form-title').textContent = 'Editar alimento';
    document.getElementById('food-form-submit').textContent = 'Guardar cambios';
    Object.entries(alimento).forEach(([campo, valor]) => {
        const control = form.elements.namedItem(campo);
        if (control) control.value = String(valor);
    });
}

form.addEventListener('submit', async event => {
    event.preventDefault();
    errorMessage.hidden = true;

    if (!form.reportValidity()) return;

    const datos = Object.fromEntries(new FormData(form).entries());

    try {
        const guardado = id
            ? await actualizarAlimento(id, datos)
            : await crearAlimento(datos);
        window.location.href = `./alimento-detalle.html?id=${encodeURIComponent(guardado.id_alimento)}`;
    } catch (error) {
        errorMessage.textContent = error instanceof Error
            ? error.message
            : 'No se pudo guardar el alimento. Intenta de nuevo.';
        errorMessage.hidden = false;
    }
});
