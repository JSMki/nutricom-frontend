import {
    obtenerUsuarioActual,
    obtenerDirectorioUsuarios,
    agregarUsuarioDirectorio,
    eliminarUsuarioDirectorio,
    crearSolicitudApoyo,
} from './datos.js';

// 1. Cargar sesión de usuario actual y barra lateral
const usuarioActual = await obtenerUsuarioActual();
const userFullname = document.getElementById('user-fullname');
const userRole = document.getElementById('user-role');
const userInitials = document.getElementById('user-initials');

if (userFullname) userFullname.textContent = usuarioActual.nombre;
if (userRole) userRole.textContent = usuarioActual.nombreRol || usuarioActual.rol;
if (userInitials) {
    userInitials.textContent = usuarioActual.nombre
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(n => n[0])
        .join('')
        .toLocaleUpperCase('es-MX');
}

const sidebarToggle = document.getElementById('toggle-sidebar-btn');
sidebarToggle?.addEventListener('click', () => {
    const collapsed = document.body.classList.toggle('home-layout--sidebar-collapsed');
    sidebarToggle.setAttribute('aria-expanded', String(!collapsed));
    sidebarToggle.setAttribute('aria-label', collapsed ? 'Expandir menú' : 'Contraer menú');
    if (sidebarToggle.firstElementChild) {
        sidebarToggle.firstElementChild.textContent = collapsed ? '›' : '‹';
    }
});

// 2. Directorio, renderizado de tabla y buscador en tiempo real
let listaUsuarios = [];

function obtenerIniciales(nombre) {
    return nombre
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(p => p[0])
        .join('')
        .toLocaleUpperCase('es-MX');
}

function actualizarPildoras(lista) {
    const total = lista.length;
    const activos = lista.filter(u => u.estado === 'Activo').length;
    const integrantes = lista.reduce((acc, u) => acc + Number(u.integrantes || 0), 0);

    const pillTotal = document.getElementById('pill-total');
    const pillActivos = document.getElementById('pill-activos');
    const pillIntegrantes = document.getElementById('pill-integrantes');

    if (pillTotal) pillTotal.textContent = String(total);
    if (pillActivos) pillActivos.textContent = String(activos);
    if (pillIntegrantes) pillIntegrantes.textContent = String(integrantes);
}

function renderizarTabla() {
    const tbody = document.getElementById('usuarios-tbody');
    if (!tbody) return;

    const texto = document.getElementById('input-buscar')?.value.toLowerCase().trim() || '';
    const colonia = document.getElementById('select-colonia')?.value || 'todas';
    const estado = document.getElementById('select-estado')?.value || 'todos';

    const filtrados = listaUsuarios.filter(u => {
        const coincideTexto = !texto ||
            (u.nombre && u.nombre.toLowerCase().includes(texto)) ||
            (u.username && u.username.toLowerCase().includes(texto)) ||
            (u.correo && u.correo.toLowerCase().includes(texto));
        const coincideColonia = colonia === 'todas' || u.colonia === colonia;
        const coincideEstado = estado === 'todos' || u.estado === estado;
        return coincideTexto && coincideColonia && coincideEstado;
    });

    tbody.innerHTML = '';
    const countLabel = document.getElementById('usuarios-count-label');
    if (countLabel) {
        countLabel.textContent = `Mostrando 1–${filtrados.length} de ${listaUsuarios.length} usuarios`;
    }

    if (filtrados.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 6;
        td.textContent = 'No se encontraron usuarios o beneficiarios con esos criterios.';
        td.style.textAlign = 'center';
        td.style.color = 'var(--color-text-muted)';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    filtrados.forEach(u => {
        const tr = document.createElement('tr');

        // Columna Usuario
        const tdUser = document.createElement('td');
        const cell = document.createElement('div');
        cell.className = 'usuario-cell';

        const avatar = document.createElement('span');
        avatar.className = `usuario-avatar usuario-avatar--${u.color || 'green'}`;
        avatar.textContent = obtenerIniciales(u.nombre || 'Usuario');

        const meta = document.createElement('div');
        meta.className = 'usuario-meta';
        const strong = document.createElement('strong');
        strong.textContent = u.username || u.correo.split('@')[0];
        const small = document.createElement('small');
        small.textContent = u.correo;
        meta.append(strong, small);

        cell.append(avatar, meta);
        tdUser.appendChild(cell);

        // Columna Nombre completo
        const tdNombre = document.createElement('td');
        const strongNombre = document.createElement('strong');
        strongNombre.textContent = u.nombre;
        tdNombre.appendChild(strongNombre);

        // Columna Familia
        const tdFamilia = document.createElement('td');
        tdFamilia.textContent = `${u.integrantes || 4} integrantes`;

        // Columna Colonia
        const tdColonia = document.createElement('td');
        tdColonia.textContent = u.colonia || 'Centro';

        // Columna Estado
        const tdEstado = document.createElement('td');
        const badge = document.createElement('span');
        const estadoVal = u.estado || 'Activo';
        badge.className = `usuario-badge ${estadoVal === 'Activo' ? 'usuario-badge--activo' : 'usuario-badge--inactivo'}`;
        badge.textContent = estadoVal;
        tdEstado.appendChild(badge);

        // Columna Acciones
        const tdAcciones = document.createElement('td');
        const actionsWrap = document.createElement('div');
        actionsWrap.className = 'usuario-row-actions';

        const btnSol = document.createElement('button');
        btnSol.type = 'button';
        btnSol.className = 'usuario-icon-btn';
        btnSol.title = 'Hacer solicitud para este usuario';
        btnSol.textContent = '＋';
        btnSol.addEventListener('click', () => {
            document.getElementById('s-titular').value = u.nombre;
            document.getElementById('s-integrantes').value = u.integrantes || 4;
            document.getElementById('modal-solicitud').hidden = false;
        });

        const btnDel = document.createElement('button');
        btnDel.type = 'button';
        btnDel.className = 'usuario-icon-btn usuario-icon-btn--danger';
        btnDel.title = 'Eliminar usuario';
        btnDel.textContent = '✕';
        btnDel.addEventListener('click', async () => {
            if (confirm(`¿Estás seguro de eliminar a ${u.nombre}?`)) {
                await eliminarUsuarioDirectorio(u.id);
                await cargarDirectorio();
            }
        });

        actionsWrap.append(btnSol, btnDel);
        tdAcciones.appendChild(actionsWrap);

        tr.append(tdUser, tdNombre, tdFamilia, tdColonia, tdEstado, tdAcciones);
        tbody.appendChild(tr);
    });
}

async function cargarDirectorio() {
    listaUsuarios = await obtenerDirectorioUsuarios();
    actualizarPildoras(listaUsuarios);
    renderizarTabla();
}

// 3. Eventos de búsqueda y filtros
document.getElementById('input-buscar')?.addEventListener('input', renderizarTabla);
document.getElementById('select-colonia')?.addEventListener('change', renderizarTabla);
document.getElementById('select-estado')?.addEventListener('change', renderizarTabla);

// 4. Control de Modales (Agregar usuario & Hacer solicitud)
const modalUser = document.getElementById('modal-usuario');
const modalSol = document.getElementById('modal-solicitud');

document.getElementById('btn-abrir-usuario')?.addEventListener('click', () => { if (modalUser) modalUser.hidden = false; });
document.getElementById('btn-cerrar-user')?.addEventListener('click', () => { if (modalUser) modalUser.hidden = true; });
document.getElementById('btn-cancel-user')?.addEventListener('click', () => { if (modalUser) modalUser.hidden = true; });

document.getElementById('btn-abrir-solicitud')?.addEventListener('click', () => { if (modalSol) modalSol.hidden = false; });
document.getElementById('btn-cerrar-sol')?.addEventListener('click', () => { if (modalSol) modalSol.hidden = true; });
document.getElementById('btn-cancel-sol')?.addEventListener('click', () => { if (modalSol) modalSol.hidden = true; });

// 5. Formularios de envío
document.getElementById('form-usuario')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await agregarUsuarioDirectorio({
        username: document.getElementById('u-username').value.trim(),
        nombre: document.getElementById('u-nombre').value.trim(),
        correo: document.getElementById('u-correo').value.trim(),
        integrantes: Number(document.getElementById('u-integrantes').value),
        colonia: document.getElementById('u-colonia').value,
        estado: document.getElementById('u-estado').value,
    });
    if (modalUser) modalUser.hidden = true;
    e.target.reset();
    await cargarDirectorio();
});

document.getElementById('form-solicitud')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await crearSolicitudApoyo({
        titular: document.getElementById('s-titular').value.trim(),
        tipo: document.getElementById('s-tipo').value,
        integrantes: Number(document.getElementById('s-integrantes').value),
    });
    if (modalSol) modalSol.hidden = true;
    e.target.reset();
});

// Inicialización de la vista
await cargarDirectorio();