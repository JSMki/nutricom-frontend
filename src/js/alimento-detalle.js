import { obtenerAlimento, obtenerCategorias, obtenerUsuarioActual } from './datos.js';

const numero = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 });
const id = new URLSearchParams(window.location.search).get('id');
const [alimento, categorias, usuario] = await Promise.all([
    id ? obtenerAlimento(id) : Promise.resolve(null),
    obtenerCategorias(),
    obtenerUsuarioActual(),
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
    document.body.classList.toggle('food-detail-page--sidebar-collapsed', collapsed);
    sidebarToggle.setAttribute('aria-expanded', String(!collapsed));
    sidebarToggle.setAttribute('aria-label', collapsed ? 'Expandir menú' : 'Contraer menú');
    sidebarToggle.firstElementChild.textContent = collapsed ? '›' : '‹';
});

const title = document.querySelector('.food-detail-page__title');
const message = document.getElementById('food-detail-message');
const content = document.getElementById('food-detail-content');
const actions = document.getElementById('food-detail-actions');

if (!alimento) {
    title.textContent = 'Alimento no encontrado';
    message.textContent = id
        ? `No existe un alimento con el identificador "${id}".`
        : 'No se indicó el identificador del alimento.';
    message.hidden = false;
} else {
    title.textContent = alimento.nombre_alimento;
    document.title = `${alimento.nombre_alimento} - NutriComunidad`;

    const categoria = categorias.find(item => item.id_categoria === alimento.id_categoria);
    const campos = [
        ['Categoría', categoria?.nombre_categoria ?? 'Sin categoría'],
        ['Descripción', alimento.descripcion || 'Sin descripción'],
        ['Unidad de medida', alimento.unidad_medida],
        ['Calorías por porción', `${numero.format(alimento.calorias_porcion)} kcal`],
        ['Proteínas', `${numero.format(alimento.proteinas)} g`],
        ['Carbohidratos', `${numero.format(alimento.carbohidratos)} g`],
        ['Grasas', `${numero.format(alimento.grasas)} g`],
        ['Estado', alimento.estado === 'disponible' ? 'Disponible' : 'Agotado'],
    ];

    campos.forEach(([etiqueta, valor]) => {
        const field = document.createElement('dl');
        const term = document.createElement('dt');
        const detail = document.createElement('dd');
        field.className = 'food-detail-page__field';
        term.textContent = etiqueta;
        detail.textContent = valor;
        field.append(term, detail);
        content.append(field);
    });

    document.getElementById('food-detail-edit').href =
        `./alimento-form.html?id=${encodeURIComponent(alimento.id_alimento)}`;
    content.hidden = false;
    actions.hidden = false;
}
