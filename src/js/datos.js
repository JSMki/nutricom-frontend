// src/js/datos.js

const alimentos = [
    { id: 1, nombre: "Manzana Red", cantidad_disponible: 150, estado: "disponible" },
    { id: 2, nombre: "Arroz Integral", cantidad_disponible: 50, estado: "por caducar" }
];

const beneficiarios = [
    { id: 2, nombre: "Carlos Pérez", numero_integrantes: 4 }
];

const donaciones = [
    { id: 1, cantidad: 200, estado: "pendiente" }
];

const usuarios = [
    { id: 1, nombre: "Ana Rodríguez", correo: "ana@nutricomunidad.org", rol: "administrador", nombreRol: "Administradora" },
    { id: 2, nombre: "Carlos Pérez", correo: "carlos@nutricomunidad.org", rol: "coordinador", nombreRol: "Coordinador" },
    { id: 3, nombre: "Lucía Gómez", correo: "lucia@nutricomunidad.org", rol: "donante", nombreRol: "Donante" }
];

const usuarioActualId = 2;

export async function obtenerUsuarioActual() {
    const usuarioActual = usuarios.find(usuario => usuario.id === usuarioActualId);

    if (!usuarioActual) {
        throw new Error(`No se encontró el usuario simulado con ID ${usuarioActualId}.`);
    }

    return usuarioActual;
}

// Función para obtener los widgets del Home
export async function obtenerResumenDashboard() {
    const kilosRecuperados = alimentos.reduce((acc, item) => acc + item.cantidad_disponible, 0);
    const productosPorCaducar = alimentos.filter(a => a.estado === 'por caducar').length;
    const familiasBeneficiadas = beneficiarios.length;
    const donacionesPendientes = donaciones.filter(d => d.estado === 'pendiente').length;
    
    return { kilosRecuperados, productosPorCaducar, familiasBeneficiadas, donacionesPendientes };
}

// =========================================================================
// ADICIONES EXCLUSIVAS (Sin modificar nada de la parte superior)
// =========================================================================

const API_BASE_URL = 'http://localhost:8080/api';

let usuariosExtrasMemoria = [
    { id: 4, username: 'rgarcia', nombre: 'Roberto García Pérez', correo: 'roberto.g@email.com', integrantes: 2, colonia: 'La Esperanza', estado: 'Inactivo', color: 'blue' }
];

let solicitudesColaMemoria = [];

export async function obtenerDirectorioUsuarios() {
    try {
        const res = await fetch(`${API_BASE_URL}/usuarios`);
        if (!res.ok) throw new Error('Backend no disponible');
        return await res.json();
    } catch (error) {
        const colores = ['green', 'amber', 'rose', 'blue', 'purple'];
        const usuariosOriginalesMapeados = usuarios.map((u, index) => ({
            id: u.id,
            username: u.correo.split('@')[0],
            nombre: u.nombre,
            correo: u.correo,
            integrantes: u.id === 2 ? 4 : (u.id === 1 ? 3 : 5),
            colonia: u.id === 1 ? 'San Miguel' : (u.id === 2 ? 'Las Flores' : 'Centro'),
            estado: 'Activo',
            color: colores[index % colores.length],
            nombreRol: u.nombreRol
        }));

        return [...usuariosOriginalesMapeados, ...usuariosExtrasMemoria];
    }
}

export async function agregarUsuarioDirectorio(nuevoUsuario) {
    try {
        const res = await fetch(`${API_BASE_URL}/usuarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoUsuario)
        });
        if (!res.ok) throw new Error('Backend no disponible');
        return await res.json();
    } catch (error) {
        const colores = ['green', 'amber', 'rose', 'blue', 'purple'];
        const nuevoId = usuariosExtrasMemoria.length ? Math.max(...usuariosExtrasMemoria.map(u => u.id)) + 10 : 10;
        const creado = {
            id: nuevoId,
            ...nuevoUsuario,
            color: colores[nuevoId % colores.length]
        };
        usuariosExtrasMemoria.unshift(creado);
        return creado;
    }
}

export async function eliminarUsuarioDirectorio(id) {
    try {
        const res = await fetch(`${API_BASE_URL}/usuarios/${id}`, { method: 'DELETE' });
        return res.ok;
    } catch (error) {
        const longitudInicial = usuariosExtrasMemoria.length;
        usuariosExtrasMemoria = usuariosExtrasMemoria.filter(u => u.id !== Number(id));
        return usuariosExtrasMemoria.length < longitudInicial;
    }
}

export async function crearSolicitudApoyo(solicitud) {
    try {
        const res = await fetch(`${API_BASE_URL}/requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(solicitud)
        });
        if (!res.ok) throw new Error('Backend no disponible');
        return await res.json();
    } catch (error) {
        const folio = `SOL-${301 + solicitudesColaMemoria.length}`;
        const nueva = { id: solicitudesColaMemoria.length + 1, folio, ...solicitud, fecha: '13 nov 2026', estado: 'Pendiente' };
        solicitudesColaMemoria.unshift(nueva);
        alert(`¡Solicitud ${folio} creada con éxito para ${solicitud.titular}! Encolada correctamente.`);
        return nueva;
    }
}