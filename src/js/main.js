import { api } from './api.js';
import { cerrarSesion, obtenerToken, obtenerUsuario } from './sesion.js';
import { normalizarRol, puedeEntrar, rolesValidos } from './permisos.js';

const etiquetasRoles = {
    admin: 'Admin',
    comercio: 'Comercio',
    beneficiario: 'Beneficiario',
    organizacion: 'Organización',
};

document.body.style.visibility = 'hidden';

function mostrarError(mensaje) {
    const aviso = document.createElement('main');
    const titulo = document.createElement('h1');
    const detalle = document.createElement('p');

    aviso.setAttribute('role', 'alert');
    aviso.style.cssText = 'max-width: 560px; margin: 15vh auto; padding: 24px; font: 16px/1.5 sans-serif;';
    titulo.textContent = 'No se pudo validar tu sesión';
    detalle.textContent = mensaje;
    aviso.append(titulo, detalle);
    document.body.replaceChildren(aviso);
    document.body.style.visibility = 'visible';
}

function esperarRedireccion() {
    return new Promise(() => {});
}

function obtenerNombre(usuario) {
    const nombre = usuario.name ?? usuario.nombre;
    return typeof nombre === 'string' ? nombre.trim() : '';
}

function obtenerPaginaActual() {
    const archivo = window.location.pathname.split('/').pop() || 'home.html';
    return archivo.replace(/\.html$/i, '').toLocaleLowerCase('es-MX');
}

function actualizarPerfil(usuario, nombre, rol) {
    const nombreRol = usuario.nombreRol ?? usuario.roleName ?? etiquetasRoles[rol];
    const iniciales = nombre
        .split(/\s+/)
        .slice(0, 2)
        .map(parte => parte[0])
        .join('')
        .toLocaleUpperCase('es-MX');

    const nombreElemento = document.getElementById('user-fullname');
    const rolElemento = document.getElementById('user-role');
    const inicialesElemento = document.getElementById('user-initials');

    if (nombreElemento) nombreElemento.textContent = nombre;
    if (rolElemento) rolElemento.textContent = nombreRol;
    if (inicialesElemento) inicialesElemento.textContent = iniciales;
}

function configurarNavegacion(rol) {
    document.querySelectorAll('.home-sidebar__link[href]').forEach(enlace => {
        const archivo = new URL(enlace.href).pathname.split('/').pop() || '';
        const pagina = archivo.replace(/\.html$/i, '').toLocaleLowerCase('es-MX');

        if (!puedeEntrar(pagina, rol)) {
            enlace.closest('.home-sidebar__item')?.remove();
        }
    });

    const paginaActual = obtenerPaginaActual();
    const destinosPorDetalle = {
        'alimento-detalle': 'alimentos',
        'alimento-form': 'alimentos',
        'detalle-donacion': 'donaciones-disponibles',
        'reclamar-donacion': 'donaciones-disponibles',
        'solicitudes-recibidas': 'solicitudes-recibidas',
        entregas: 'entregas',
    };
    const destinoActivo = destinosPorDetalle[paginaActual] ?? paginaActual;
    const enlaceActivo = document.querySelector(
        `.home-sidebar__link[href="./${destinoActivo}.html"]`,
    );

    document.querySelectorAll('.home-sidebar__link[aria-current="page"]').forEach(enlace => {
        enlace.removeAttribute('aria-current');
    });
    enlaceActivo?.setAttribute('aria-current', 'page');

    document.querySelector('.home-sidebar__logout')?.addEventListener('click', evento => {
        evento.preventDefault();
        cerrarSesion();
    });
}

async function inicializarAutenticacion() {
    let token;
    let usuarioGuardado;

    try {
        token = obtenerToken();
        usuarioGuardado = obtenerUsuario();
    } catch {
        cerrarSesion();
        return esperarRedireccion();
    }

    if (!token || !usuarioGuardado || typeof usuarioGuardado !== 'object') {
        cerrarSesion();
        return esperarRedireccion();
    }

    let respuesta;
    try {
        respuesta = await api.get('/api/auth/yo');
    } catch (error) {
        if (!obtenerToken()) return esperarRedireccion();

        mostrarError(error instanceof Error
            ? error.message
            : 'No se pudo conectar con el servidor. Intenta de nuevo.');
        return esperarRedireccion();
    }

    const usuarioVerificado = respuesta?.user ?? respuesta;
    if (!usuarioVerificado || typeof usuarioVerificado !== 'object') {
        cerrarSesion();
        return esperarRedireccion();
    }

    const usuario = { ...usuarioGuardado, ...usuarioVerificado };
    const nombre = obtenerNombre(usuario);
    const rol = normalizarRol(usuario.role ?? usuario.rol);

    if (!nombre || !rolesValidos.includes(rol)) {
        cerrarSesion();
        return esperarRedireccion();
    }

    if (!puedeEntrar(obtenerPaginaActual(), rol)) {
        window.location.replace('./home.html');
        return esperarRedireccion();
    }

    actualizarPerfil(usuario, nombre, rol);
    configurarNavegacion(rol);
    document.body.style.visibility = '';

    return {
        ...usuario,
        name: nombre,
        nombre,
        role: rol,
        rol,
        nombreRol: usuario.nombreRol ?? usuario.roleName ?? etiquetasRoles[rol],
    };
}

export const usuarioAutenticado = await inicializarAutenticacion();
