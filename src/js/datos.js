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