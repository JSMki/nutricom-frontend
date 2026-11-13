// --- Nuevas funciones para Usuarios y Solicitudes ---

const solicitudesBackend = [
    { folio: 'SOL-101', titular: 'Carlos Pérez', tipo: 'Despensa Básica', integrantes: 4, fecha: '13 nov 2026', estado: 'Pendiente' },
    { folio: 'SOL-102', titular: 'Ana Rodríguez', tipo: 'Apoyo Nutricional Infantil', integrantes: 3, fecha: '12 nov 2026', estado: 'Aprobada' }
];

export async function obtenerUsuariosSistema() {
    // Simula el GET /api/usuarios del backend
    return usuarios;
}

export async function registrarUsuarioSistema(nuevoUsuario) {
    // Simula el POST /api/usuarios del backend
    const id = usuarios.length ? usuarios[usuarios.length - 1].id + 1 : 1;
    const usuarioCreado = { id, ...nuevoUsuario, nombreRol: nuevoUsuario.rol === 'administrador' ? 'Administradora' : 'Usuario' };
    usuarios.push(usuarioCreado);
    return usuarioCreado;
}

export async function obtenerSolicitudesSistema() {
    // Simula el GET /api/requests
    return solicitudesBackend;
}

export async function crearSolicitudSistema(nuevaSolicitud) {
    // Simula el POST /api/requests (crear y agregar a la cola)
    const siguienteFolio = `SOL-10${solicitudesBackend.length + 1}`;
    const item = {
        folio: siguienteFolio,
        ...nuevaSolicitud,
        fecha: '13 nov 2026',
        estado: 'Pendiente'
    };
    solicitudesBackend.unshift(item);
    return item;
}