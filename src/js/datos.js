// src/js/datos.js

const alimentosResumen = [
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
    { id: 1, nombre: "Ana Rodríguez", correo: "ana@nutricomunidad.org", rol: "admin", nombreRol: "Administradora" },
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
    const kilosRecuperados = alimentosResumen.reduce((acc, item) => acc + item.cantidad_disponible, 0);
    const productosPorCaducar = alimentosResumen.filter(a => a.estado === 'por caducar').length;
    const familiasBeneficiadas = beneficiarios.length;
    const donacionesPendientes = donaciones.filter(d => d.estado === 'pendiente').length;
    
    return { kilosRecuperados, productosPorCaducar, familiasBeneficiadas, donacionesPendientes };
}

const alimentosIniciales = [
    { id_alimento: 1, nombre_alimento: "Manzana gala", descripcion: "Manzana fresca.", unidad_medida: "Pieza", calorias_porcion: 52, proteinas: 0.3, carbohidratos: 14, grasas: 0.2, estado: "disponible" },
    { id_alimento: 2, nombre_alimento: "Jitomate saladette", descripcion: "Jitomate fresco.", unidad_medida: "Kilogramo", calorias_porcion: 18, proteinas: 0.9, carbohidratos: 3.9, grasas: 0.2, estado: "agotado" },
    { id_alimento: 3, nombre_alimento: "Arroz blanco", descripcion: "Arroz de grano largo.", unidad_medida: "Kilogramo", calorias_porcion: 130, proteinas: 2.7, carbohidratos: 28, grasas: 0.3, estado: "disponible" },
    { id_alimento: 4, nombre_alimento: "Frijol negro", descripcion: "Frijol seco.", unidad_medida: "Kilogramo", calorias_porcion: 132, proteinas: 8.9, carbohidratos: 23.7, grasas: 0.5, estado: "disponible" },
    { id_alimento: 5, nombre_alimento: "Leche entera", descripcion: "Leche de vaca entera.", unidad_medida: "Litro", calorias_porcion: 61, proteinas: 3.2, carbohidratos: 4.8, grasas: 3.3, estado: "agotado" },
    { id_alimento: 6, nombre_alimento: "Plátano", descripcion: "Plátano fresco.", unidad_medida: "Pieza", calorias_porcion: 89, proteinas: 1.1, carbohidratos: 22.8, grasas: 0.3, estado: "disponible" },
    { id_alimento: 7, nombre_alimento: "Zanahoria", descripcion: "Zanahoria fresca.", unidad_medida: "Kilogramo", calorias_porcion: 41, proteinas: 0.9, carbohidratos: 9.6, grasas: 0.2, estado: "disponible" },
    { id_alimento: 8, nombre_alimento: "Avena", descripcion: "Avena en hojuelas.", unidad_medida: "Kilogramo", calorias_porcion: 389, proteinas: 16.9, carbohidratos: 66.3, grasas: 6.9, estado: "disponible" },
    { id_alimento: 9, nombre_alimento: "Lenteja", descripcion: "Lenteja seca.", unidad_medida: "Kilogramo", calorias_porcion: 116, proteinas: 9, carbohidratos: 20.1, grasas: 0.4, estado: "disponible" },
    { id_alimento: 10, nombre_alimento: "Yogur natural", descripcion: "Yogur natural sin azúcar.", unidad_medida: "Litro", calorias_porcion: 61, proteinas: 3.5, carbohidratos: 4.7, grasas: 3.3, estado: "disponible" }
];

const claveAlimentosGuardados = "nutricom.alimentos";

function cargarAlimentosCatalogo() {
    if (typeof localStorage === "undefined") {
        return alimentosIniciales.map(alimento => ({ ...alimento }));
    }

    const guardados = localStorage.getItem(claveAlimentosGuardados);
    if (guardados === null) {
        return alimentosIniciales.map(alimento => ({ ...alimento }));
    }

    const alimentosParseados = JSON.parse(guardados);
    if (!Array.isArray(alimentosParseados)) {
        throw new Error("Los alimentos guardados localmente tienen un formato inválido.");
    }

    return alimentosParseados.map(({ id_categoria, ...alimento }) => alimento);
}

let alimentos = cargarAlimentosCatalogo();

function guardarAlimentosCatalogo() {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem(claveAlimentosGuardados, JSON.stringify(alimentos));
    }
}

function normalizarDatosAlimento(datos) {
    if (!datos || typeof datos !== "object") {
        throw new Error("Los datos del alimento no son válidos.");
    }

    const camposNumericos = ["calorias_porcion", "proteinas", "carbohidratos", "grasas"];
    if (camposNumericos.some(campo => datos[campo] === "" || datos[campo] === null || datos[campo] === undefined)) {
        throw new Error("Completa todos los valores nutricionales.");
    }

    const alimento = {
        nombre_alimento: String(datos.nombre_alimento ?? "").trim(),
        descripcion: String(datos.descripcion ?? "").trim(),
        unidad_medida: String(datos.unidad_medida ?? "").trim(),
        calorias_porcion: Number(datos.calorias_porcion),
        proteinas: Number(datos.proteinas),
        carbohidratos: Number(datos.carbohidratos),
        grasas: Number(datos.grasas),
        estado: String(datos.estado ?? "").trim()
    };

    if (!alimento.nombre_alimento || !alimento.unidad_medida) {
        throw new Error("El nombre y la unidad de medida son obligatorios.");
    }
    if (!["disponible", "agotado"].includes(alimento.estado)) {
        throw new Error("Selecciona un estado válido para el alimento.");
    }
    if ([alimento.calorias_porcion, alimento.proteinas, alimento.carbohidratos, alimento.grasas]
        .some(valor => !Number.isFinite(valor) || valor < 0)) {
        throw new Error("Los valores nutricionales deben ser números iguales o mayores a cero.");
    }

    return alimento;
}

export async function obtenerAlimentos() {
    return alimentos.map(alimento => ({ ...alimento }));
}

export async function obtenerAlimento(id) {
    const alimento = alimentos.find(item => item.id_alimento === Number(id));
    return alimento ? { ...alimento } : null;
}

export async function crearAlimento(datos) {
    const alimento = normalizarDatosAlimento(datos);
    const id_alimento = alimentos.reduce((maximo, item) => Math.max(maximo, item.id_alimento), 0) + 1;
    const nuevoAlimento = { id_alimento, ...alimento };

    alimentos = [nuevoAlimento, ...alimentos];
    guardarAlimentosCatalogo();
    return { ...nuevoAlimento };
}

export async function actualizarAlimento(id, datos) {
    const id_alimento = Number(id);
    const indice = alimentos.findIndex(item => item.id_alimento === id_alimento);
    if (indice === -1) {
        throw new Error(`No se encontró el alimento con ID ${id}.`);
    }

    const alimentoActualizado = {
        id_alimento,
        ...normalizarDatosAlimento(datos)
    };
    alimentos = alimentos.map((item, index) => index === indice ? alimentoActualizado : item);
    guardarAlimentosCatalogo();
    return { ...alimentoActualizado };
}

const API_BASE_URL = 'http://localhost:8080/api';

let usuariosExtrasMemoria = [
    { id: 4, username: 'rgarcia', nombre: 'Roberto García Pérez', correo: 'roberto.g@email.com', integrantes: 2, colonia: 'La Esperanza', estado: 'Inactivo', color: 'blue' }
];

const claveSolicitudesGuardadas = 'nutricom.solicitudes';
const solicitudesIniciales = [
    {
        id_solicitud: 184,
        folio: 'SOL-0184',
        fecha_solicitud: '2025-06-16',
        motivo: 'Apoyo alimentario para mi familia.',
        numero_integrantes: 4,
        prioridad: 'Alta',
        estado: 'Pendiente',
        alimentos: [
            { id_alimento: 2, nombre_alimento: 'Jitomate saladette', cantidad: 1, unidad_medida: 'Kilogramo' },
            { id_alimento: 3, nombre_alimento: 'Arroz blanco', cantidad: 1, unidad_medida: 'Kilogramo' },
            { id_alimento: 4, nombre_alimento: 'Frijol negro', cantidad: 1, unidad_medida: 'Kilogramo' },
            { id_alimento: 1, nombre_alimento: 'Manzana gala', cantidad: 1, unidad_medida: 'Pieza' },
        ],
    },
    {
        id_solicitud: 139,
        folio: 'SOL-0139',
        fecha_solicitud: '2025-06-02',
        motivo: 'Solicitud de despensa familiar.',
        numero_integrantes: 5,
        prioridad: 'Media',
        estado: 'Aprobada',
        alimentos: [
            { id_alimento: 3, nombre_alimento: 'Arroz blanco', cantidad: 1, unidad_medida: 'Kilogramo' },
            { id_alimento: 4, nombre_alimento: 'Frijol negro', cantidad: 1, unidad_medida: 'Kilogramo' },
            { id_alimento: 5, nombre_alimento: 'Leche entera', cantidad: 1, unidad_medida: 'Litro' },
            { id_alimento: 1, nombre_alimento: 'Manzana gala', cantidad: 1, unidad_medida: 'Pieza' },
            { id_alimento: 6, nombre_alimento: 'Plátano', cantidad: 1, unidad_medida: 'Pieza' },
            { id_alimento: 7, nombre_alimento: 'Zanahoria', cantidad: 1, unidad_medida: 'Kilogramo' },
        ],
    },
    {
        id_solicitud: 98,
        folio: 'SOL-0098',
        fecha_solicitud: '2025-05-12',
        motivo: 'Apoyo para completar la despensa.',
        numero_integrantes: 3,
        prioridad: 'Baja',
        estado: 'Entregada',
        alimentos: [
            { id_alimento: 3, nombre_alimento: 'Arroz blanco', cantidad: 1, unidad_medida: 'Kilogramo' },
            { id_alimento: 4, nombre_alimento: 'Frijol negro', cantidad: 1, unidad_medida: 'Kilogramo' },
            { id_alimento: 5, nombre_alimento: 'Leche entera', cantidad: 1, unidad_medida: 'Litro' },
        ],
    },
    {
        id_solicitud: 72,
        folio: 'SOL-0072',
        fecha_solicitud: '2025-04-28',
        motivo: 'Solicitud de apoyo alimentario.',
        numero_integrantes: 4,
        prioridad: 'Media',
        estado: 'Rechazada',
        alimentos: [
            { id_alimento: 2, nombre_alimento: 'Jitomate saladette', cantidad: 1, unidad_medida: 'Kilogramo' },
            { id_alimento: 3, nombre_alimento: 'Arroz blanco', cantidad: 1, unidad_medida: 'Kilogramo' },
            { id_alimento: 4, nombre_alimento: 'Frijol negro', cantidad: 1, unidad_medida: 'Kilogramo' },
            { id_alimento: 5, nombre_alimento: 'Leche entera', cantidad: 1, unidad_medida: 'Litro' },
            { id_alimento: 1, nombre_alimento: 'Manzana gala', cantidad: 1, unidad_medida: 'Pieza' },
        ],
    },
];

let solicitudesColaMemoria = solicitudesIniciales.map(solicitud => ({
    ...solicitud,
    alimentos: solicitud.alimentos.map(alimento => ({ ...alimento })),
}));

function copiarSolicitud(solicitud) {
    return {
        ...solicitud,
        alimentos: Array.isArray(solicitud.alimentos)
            ? solicitud.alimentos.map(alimento => ({ ...alimento }))
            : [],
    };
}

function obtenerSolicitudesGuardadas() {
    if (typeof localStorage === 'undefined') {
        return solicitudesColaMemoria.map(copiarSolicitud);
    }

    const guardadas = localStorage.getItem(claveSolicitudesGuardadas);
    if (guardadas === null) {
        const iniciales = solicitudesIniciales.map(copiarSolicitud);
        localStorage.setItem(claveSolicitudesGuardadas, JSON.stringify(iniciales));
        solicitudesColaMemoria = iniciales;
        return iniciales.map(copiarSolicitud);
    }

    const parseadas = JSON.parse(guardadas);
    if (!Array.isArray(parseadas)) {
        throw new Error('Las solicitudes guardadas localmente tienen un formato inválido.');
    }
    return parseadas.map(copiarSolicitud);
}

function guardarSolicitudes(solicitudes) {
    solicitudesColaMemoria = solicitudes.map(copiarSolicitud);
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem(claveSolicitudesGuardadas, JSON.stringify(solicitudesColaMemoria));
    }
}

export async function obtenerSolicitudesApoyo() {
    return obtenerSolicitudesGuardadas();
}

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
    if (!solicitud || typeof solicitud !== 'object') {
        throw new Error('Los datos de la solicitud no son válidos.');
    }

    const tipo = String(solicitud.tipo ?? 'Apoyo alimentario').trim();
    const motivo = String(solicitud.motivo ?? solicitud.descripcion ?? 'Solicitud de apoyo').trim();
    const numero_integrantes = Number(solicitud.numero_integrantes ?? solicitud.integrantes ?? 1);
    const prioridad = String(solicitud.prioridad ?? 'Baja').trim();
    const prioridadesValidas = ['Baja', 'Media', 'Alta'];

    if (!tipo || !motivo) {
        throw new Error('El tipo de apoyo y el motivo son obligatorios.');
    }
    if (!Number.isInteger(numero_integrantes) || numero_integrantes < 1 || numero_integrantes > 30) {
        throw new Error('El número de integrantes debe ser un entero entre 1 y 30.');
    }
    if (!prioridadesValidas.includes(prioridad)) {
        throw new Error('Selecciona una prioridad válida.');
    }

    const alimentosSolicitud = Array.isArray(solicitud.alimentos)
        ? solicitud.alimentos.map(alimento => {
            const cantidad = Number(alimento.cantidad);
            if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 99) {
                throw new Error('La cantidad de cada alimento debe ser un entero entre 1 y 99.');
            }
            return {
                id_alimento: Number(alimento.id_alimento ?? alimento.id),
                nombre_alimento: String(alimento.nombre_alimento ?? alimento.nombre ?? 'Alimento'),
                cantidad,
                unidad_medida: String(alimento.unidad_medida ?? alimento.unidad ?? 'Unidad'),
            };
        })
        : [];
    const solicitudes = obtenerSolicitudesGuardadas();
    const id_solicitud = solicitudes.reduce(
        (maximo, existente) => Math.max(maximo, Number(existente.id_solicitud ?? existente.id) || 0),
        0,
    ) + 1;
    const hoy = new Date();
    const fecha_solicitud = [
        hoy.getFullYear(),
        String(hoy.getMonth() + 1).padStart(2, '0'),
        String(hoy.getDate()).padStart(2, '0'),
    ].join('-');
    const nuevaSolicitud = {
        id_solicitud,
        folio: `SOL-${String(id_solicitud).padStart(4, '0')}`,
        fecha_solicitud,
        tipo,
        motivo,
        descripcion: motivo,
        numero_integrantes,
        prioridad,
        estado: 'Pendiente',
        alimentos: alimentosSolicitud,
    };

    if (solicitud.titular) nuevaSolicitud.titular = String(solicitud.titular);
    guardarSolicitudes([nuevaSolicitud, ...solicitudes]);
    return copiarSolicitud(nuevaSolicitud);
}