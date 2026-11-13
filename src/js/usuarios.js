import { obtenerUsuarioActual, obtenerUsuariosSistema, obtenerSolicitudesSistema, crearSolicitudSistema } from './datos.js';

// 1. Inicializar cabecera con el usuario actual (idéntico a home.js)
const usuarioActual = await obtenerUsuarioActual();
document.getElementById('usuarios-date').textContent = `Sesión activa: ${usuarioActual.nombre} (${usuarioActual.nombreRol})`;

// 2. Renderizar tabla de Usuarios (GET /api/usuarios)
async function cargarUsuarios() {
    const usuarios = await obtenerUsuariosSistema();
    const tbody = document.getElementById('tabla-usuarios-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    usuarios.forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>#${u.id}</strong></td>
            <td>${u.nombre}</td>
            <td>${u.correo}</td>
            <td><span class="badge-estado badge-estado--aprobada">${u.nombreRol}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// 3. Renderizar cola de Solicitudes (GET /api/requests)
async function cargarSolicitudes() {
    const solicitudes = await obtenerSolicitudesSistema();
    const tbody = document.getElementById('tabla-solicitudes-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    solicitudes.forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${s.folio}</strong></td>
            <td>${s.titular}</td>
            <td>${s.tipo}</td>
            <td>${s.integrantes} pers.</td>
            <td>${s.fecha}</td>
            <td><span class="badge-estado badge-estado--pendiente">${s.estado}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// 4. Lógica del Modal y envío de formulario (POST /api/requests)
const modal = document.getElementById('modal-solicitud');
document.getElementById('btn-abrir-solicitud')?.addEventListener('click', () => { modal.hidden = false; });
document.getElementById('btn-cerrar-modal')?.addEventListener('click', () => { modal.hidden = true; });
document.getElementById('btn-cancelar')?.addEventListener('click', () => { modal.hidden = true; });

document.getElementById('form-solicitud-backend')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const titular = document.getElementById('input-titular').value;
    const tipo = document.getElementById('input-tipo').value;
    const integrantes = Number(document.getElementById('input-integrantes').value);

    // Llamada simulada al backend POST /api/requests
    await crearSolicitudSistema({ titular, tipo, integrantes });

    modal.hidden = true;
    e.target.reset();
    await cargarSolicitudes(); // Recarga la tabla con la nueva solicitud en la cola
});

// Inicializar vistas al cargar
await cargarUsuarios();
await cargarSolicitudes();