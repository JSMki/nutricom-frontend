import {
    actualizarAlimento,
    crearAlimento,
    obtenerAlimentos,
    obtenerCategorias,
    obtenerUsuarioActual,
} from './datos.js';

const pageSize = 5;
const numberFormat = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 });
let [alimentos, categorias, usuario] = await Promise.all([
    obtenerAlimentos(),
    obtenerCategorias(),
    obtenerUsuarioActual(),
]);

let paginaActual = 1;
let alimentoSeleccionado = null;
const searchInput = document.getElementById('foods-search');
const categoryFilter = document.getElementById('foods-category-filter');
const statusFilter = document.getElementById('foods-status-filter');
const tableBody = document.getElementById('foods-table-body');
const pagination = document.getElementById('foods-pagination');
const emptyMessage = document.getElementById('foods-empty-message');
const modal = document.getElementById('foods-modal');
const modalTitle = document.getElementById('foods-modal-title');
const modalDetails = document.getElementById('foods-modal-details');
const modalForm = document.getElementById('foods-modal-form');
const modalDetailActions = document.getElementById('foods-modal-detail-actions');
const modalError = document.getElementById('foods-modal-error');

function mostrarUsuario() {
    document.getElementById('user-fullname').textContent = usuario.nombre;
    document.getElementById('user-role').textContent = usuario.nombreRol;
    document.getElementById('user-initials').textContent = usuario.nombre
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(nombre => nombre[0])
        .join('')
        .toLocaleUpperCase('es-MX');
}

function configurarSidebar() {
    const sidebarToggle = document.getElementById('toggle-sidebar-btn');
    const currentLink = document.querySelector('.home-sidebar__link[href="./alimentos.html"]');

    document.querySelectorAll('.home-sidebar__link[aria-current="page"]').forEach(link => {
        link.removeAttribute('aria-current');
    });
    currentLink?.setAttribute('aria-current', 'page');

    sidebarToggle.addEventListener('click', () => {
        const collapsed = document.body.classList.toggle('home-layout--sidebar-collapsed');
        document.body.classList.toggle('foods-page--sidebar-collapsed', collapsed);
        sidebarToggle.setAttribute('aria-expanded', String(!collapsed));
        sidebarToggle.setAttribute('aria-label', collapsed ? 'Expandir menú' : 'Contraer menú');
        sidebarToggle.firstElementChild.textContent = collapsed ? '›' : '‹';
    });
}

function cargarFiltroCategorias() {
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = String(categoria.id_categoria);
        option.textContent = categoria.nombre_categoria;
        categoryFilter.append(option);

        if (categoria.estado === 'activa') {
            const modalOption = option.cloneNode(true);
            document.getElementById('foods-modal-category').append(modalOption);
        }
    });
}

function obtenerAlimentosFiltrados() {
    const texto = searchInput.value.trim().toLocaleLowerCase('es-MX');
    const idCategoria = categoryFilter.value;
    const estado = statusFilter.value;

    return alimentos.filter(alimento => {
        const coincideTexto = !texto
            || alimento.nombre_alimento.toLocaleLowerCase('es-MX').includes(texto)
            || alimento.descripcion.toLocaleLowerCase('es-MX').includes(texto);
        const coincideCategoria = !idCategoria || String(alimento.id_categoria) === idCategoria;
        const coincideEstado = !estado || alimento.estado === estado;

        return coincideTexto && coincideCategoria && coincideEstado;
    });
}

function crearCelda(texto) {
    const cell = document.createElement('td');
    cell.textContent = texto;
    return cell;
}

function crearFila(alimento, categoriasPorId) {
    const row = document.createElement('tr');
    const foodCell = document.createElement('td');
    const foodName = document.createElement('span');
    const foodIcon = document.createElement('span');
    const category = categoriasPorId.get(alimento.id_categoria);
    const statusCell = document.createElement('td');
    const status = document.createElement('span');
    const actionsCell = document.createElement('td');
    const actions = document.createElement('div');
    const detailButton = document.createElement('button');
    const editButton = document.createElement('button');

    foodName.className = 'foods-page__food-name';
    foodIcon.className = 'foods-page__food-icon';
    foodIcon.setAttribute('aria-hidden', 'true');
    foodIcon.textContent = ({
        Frutas: '🍎',
        Verduras: '🥕',
        Cereales: '🌾',
        Legumbres: '🫘',
        Lácteos: '🥛',
    })[category?.nombre_categoria] ?? '🥗';
    foodName.append(foodIcon, document.createTextNode(alimento.nombre_alimento));
    foodCell.append(foodName);
    row.append(
        foodCell,
        crearCelda(category?.nombre_categoria ?? 'Sin categoría'),
        crearCelda(alimento.unidad_medida),
        crearCelda(`${numberFormat.format(alimento.calorias_porcion)} kcal`),
        crearCelda(`${numberFormat.format(alimento.proteinas)} g`),
        crearCelda(`${numberFormat.format(alimento.carbohidratos)} g`),
    );

    status.className = `foods-page__status${alimento.estado === 'agotado' ? ' foods-page__status--agotado' : ''}`;
    status.textContent = alimento.estado === 'disponible' ? 'Disponible' : 'Agotado';
    statusCell.append(status);
    row.append(statusCell);

    actions.className = 'foods-page__actions';
    detailButton.className = 'foods-page__action';
    detailButton.type = 'button';
    detailButton.dataset.foodAction = 'detail';
    detailButton.dataset.foodId = String(alimento.id_alimento);
    detailButton.setAttribute('aria-label', `Ver ${alimento.nombre_alimento}`);
    detailButton.title = 'Ver detalle';
    detailButton.textContent = '◉';

    editButton.className = 'foods-page__action';
    editButton.type = 'button';
    editButton.dataset.foodAction = 'edit';
    editButton.dataset.foodId = String(alimento.id_alimento);
    editButton.setAttribute('aria-label', `Editar ${alimento.nombre_alimento}`);
    editButton.title = 'Editar';
    editButton.textContent = '✎';
    actions.append(detailButton, editButton);
    actionsCell.append(actions);
    row.append(actionsCell);

    return row;
}

function crearBotonPagina(texto, pagina, { active = false, disabled = false, label = texto } = {}) {
    const button = document.createElement('button');
    button.className = `foods-page__page-button${active ? ' foods-page__page-button--active' : ''}`;
    button.type = 'button';
    button.textContent = texto;
    button.disabled = disabled;
    button.setAttribute('aria-label', label);
    if (active) button.setAttribute('aria-current', 'page');
    button.addEventListener('click', () => {
        paginaActual = pagina;
        renderizar();
    });
    pagination.append(button);
}

function renderizarPaginacion(totalFiltrado) {
    const totalPaginas = Math.ceil(totalFiltrado / pageSize);
    const primero = totalFiltrado === 0 ? 0 : (paginaActual - 1) * pageSize + 1;
    const ultimo = Math.min(paginaActual * pageSize, totalFiltrado);

    document.getElementById('foods-pagination-summary').textContent =
        `Mostrando ${primero}–${ultimo} de ${totalFiltrado} alimentos`;
    pagination.replaceChildren();
    crearBotonPagina('←', Math.max(1, paginaActual - 1), {
        disabled: paginaActual <= 1,
        label: 'Página anterior',
    });

    for (let pagina = 1; pagina <= totalPaginas; pagina += 1) {
        crearBotonPagina(String(pagina), pagina, {
            active: pagina === paginaActual,
            label: `Página ${pagina}`,
        });
    }

    crearBotonPagina('→', Math.min(totalPaginas || 1, paginaActual + 1), {
        disabled: paginaActual >= totalPaginas,
        label: 'Página siguiente',
    });
}

function renderizar() {
    const filtrados = obtenerAlimentosFiltrados();
    const totalPaginas = Math.max(1, Math.ceil(filtrados.length / pageSize));
    paginaActual = Math.min(paginaActual, totalPaginas);
    const inicio = (paginaActual - 1) * pageSize;
    const categoriasPorId = new Map(categorias.map(categoria => [categoria.id_categoria, categoria]));

    tableBody.replaceChildren(...filtrados
        .slice(inicio, inicio + pageSize)
        .map(alimento => crearFila(alimento, categoriasPorId)));
    emptyMessage.hidden = filtrados.length !== 0;
    renderizarPaginacion(filtrados.length);

    const filtrosActivos = Number(Boolean(searchInput.value.trim()))
        + Number(Boolean(categoryFilter.value))
        + Number(Boolean(statusFilter.value));
    document.getElementById('foods-filter-count').textContent =
        `${filtrosActivos} ${filtrosActivos === 1 ? 'filtro' : 'filtros'}`;
}

function mostrarEstadisticas() {
    const disponibles = alimentos.filter(alimento => alimento.estado === 'disponible').length;
    const agotados = alimentos.filter(alimento => alimento.estado === 'agotado').length;
    const categoriasActivas = categorias.filter(categoria => categoria.estado === 'activa').length;

    document.getElementById('foods-total').textContent = numberFormat.format(alimentos.length);
    document.getElementById('foods-available').textContent = numberFormat.format(disponibles);
    document.getElementById('foods-empty').textContent = numberFormat.format(agotados);
    document.getElementById('foods-categories').textContent = numberFormat.format(categoriasActivas);

    const notice = document.getElementById('foods-notice');
    notice.hidden = agotados === 0;
    document.getElementById('foods-notice-title').textContent =
        `${agotados} ${agotados === 1 ? 'alimento agotado requiere' : 'alimentos agotados requieren'} atención`;
}

function llenarFormulario(alimento) {
    modalForm.reset();
    modalForm.elements.namedItem('estado').value = 'disponible';

    if (!alimento) return;

    Object.entries(alimento).forEach(([campo, valor]) => {
        const control = modalForm.elements.namedItem(campo);
        if (control) control.value = String(valor);
    });
}

function abrirFormulario(alimento = null) {
    alimentoSeleccionado = alimento;
    modalTitle.textContent = alimento ? 'Editar alimento' : 'Agregar alimento';
    modalDetails.hidden = true;
    modalDetailActions.hidden = true;
    modalForm.hidden = false;
    document.getElementById('foods-modal-submit').textContent =
        alimento ? 'Guardar cambios' : 'Guardar alimento';
    modalError.hidden = true;
    llenarFormulario(alimento);
    modal.showModal();
    modalForm.elements.namedItem('nombre_alimento').focus();
}

function agregarCampoDetalle(etiqueta, valor) {
    const field = document.createElement('div');
    const label = document.createElement('span');
    const content = document.createElement('strong');
    field.className = 'foods-modal__detail';
    label.className = 'foods-modal__detail-label';
    content.className = 'foods-modal__detail-value';
    label.textContent = etiqueta;
    content.textContent = valor;
    field.append(label, content);
    modalDetails.append(field);
}

function abrirDetalle(alimento) {
    alimentoSeleccionado = alimento;
    const categoria = categorias.find(item => item.id_categoria === alimento.id_categoria);
    modalTitle.textContent = alimento.nombre_alimento;
    modalForm.hidden = true;
    modalDetailActions.hidden = false;
    modalDetails.replaceChildren();
    [
        ['Categoría', categoria?.nombre_categoria ?? 'Sin categoría'],
        ['Descripción', alimento.descripcion || 'Sin descripción'],
        ['Unidad de medida', alimento.unidad_medida],
        ['Calorías por porción', `${numberFormat.format(alimento.calorias_porcion)} kcal`],
        ['Proteínas', `${numberFormat.format(alimento.proteinas)} g`],
        ['Carbohidratos', `${numberFormat.format(alimento.carbohidratos)} g`],
        ['Grasas', `${numberFormat.format(alimento.grasas)} g`],
        ['Estado', alimento.estado === 'disponible' ? 'Disponible' : 'Agotado'],
    ].forEach(([label, value]) => agregarCampoDetalle(label, value));
    modalDetails.hidden = false;
    modal.showModal();
}

async function guardarDesdeModal(event) {
    event.preventDefault();
    modalError.hidden = true;

    if (!modalForm.reportValidity()) return;

    const datos = Object.fromEntries(new FormData(modalForm).entries());
    const submitButton = document.getElementById('foods-modal-submit');
    submitButton.disabled = true;

    try {
        const guardado = alimentoSeleccionado
            ? await actualizarAlimento(alimentoSeleccionado.id_alimento, datos)
            : await crearAlimento(datos);
        alimentos = alimentoSeleccionado
            ? alimentos.map(alimento => alimento.id_alimento === guardado.id_alimento ? guardado : alimento)
            : [guardado, ...alimentos];
        modal.close();
        paginaActual = 1;
        mostrarEstadisticas();
        renderizar();
    } catch (error) {
        modalError.textContent = error instanceof Error
            ? error.message
            : 'No se pudo guardar el alimento. Intenta de nuevo.';
        modalError.hidden = false;
    } finally {
        submitButton.disabled = false;
    }
}

function configurarModal() {
    document.getElementById('foods-add-button').addEventListener('click', () => abrirFormulario());
    document.getElementById('foods-modal-close').addEventListener('click', () => modal.close());
    document.getElementById('foods-modal-cancel').addEventListener('click', () => modal.close());
    document.getElementById('foods-modal-detail-close').addEventListener('click', () => modal.close());
    document.getElementById('foods-modal-edit').addEventListener('click', () => abrirFormulario(alimentoSeleccionado));
    modalForm.addEventListener('submit', guardarDesdeModal);

    modal.addEventListener('click', event => {
        if (event.target === modal) modal.close();
    });

    tableBody.addEventListener('click', event => {
        const button = event.target.closest('button[data-food-action]');
        if (!button) return;

        const alimento = alimentos.find(item => item.id_alimento === Number(button.dataset.foodId));
        if (!alimento) return;

        if (button.dataset.foodAction === 'detail') abrirDetalle(alimento);
        if (button.dataset.foodAction === 'edit') abrirFormulario(alimento);
    });
}

mostrarUsuario();
configurarSidebar();
cargarFiltroCategorias();
configurarModal();
mostrarEstadisticas();
renderizar();

searchInput.addEventListener('input', () => {
    paginaActual = 1;
    renderizar();
});
categoryFilter.addEventListener('change', () => {
    paginaActual = 1;
    renderizar();
});
statusFilter.addEventListener('change', () => {
    paginaActual = 1;
    renderizar();
});
