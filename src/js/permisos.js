export const rolesValidos = [
    'admin',
    'comercio',
    'beneficiario',
    'organizacion',
];

const paginasPorRol = {
    home: rolesValidos,
    'nueva-solicitud': ['admin', 'beneficiario'],
    'mis-pedidos': ['beneficiario'],
    'preferencias-alergias': ['beneficiario'],
    'catalogo-alimentos': ['beneficiario'],
    usuarios: ['admin'],
    usuario: ['admin'],
    alimentos: ['admin'],
    'alimento-detalle': ['admin'],
    'alimento-form': ['admin'],
    donaciones: ['admin'],
    recetas: ['admin'],
};

export function normalizarRol(rol) {
    if (typeof rol !== 'string') return '';

    const rolNormalizado = rol.trim().toLocaleLowerCase('es-MX');
    return rolNormalizado === 'administrador' ? 'admin' : rolNormalizado;
}

export function puedeEntrar(pagina, rol) {
    return paginasPorRol[pagina]?.includes(normalizarRol(rol)) ?? false;
}
