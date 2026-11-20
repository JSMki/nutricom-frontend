// src/js/datos.js

const alimentosResumen = [
    { id: 1, nombre: "Manzana Red", cantidad_disponible: 150, estado: "disponible" },
    { id: 2, nombre: "Arroz Integral", cantidad_disponible: 50, estado: "por caducar" }
];

const beneficiarios = [
    { id: 2, nombre: "Carlos Pérez", numero_integrantes: 4 }
];

let donaciones = [];

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

const categorias = [
    { id_categoria: 1, nombre_categoria: "Frutas", descripcion: "Frutas frescas y de temporada.", estado: "activa" },
    { id_categoria: 2, nombre_categoria: "Verduras", descripcion: "Verduras y hortalizas.", estado: "activa" },
    { id_categoria: 3, nombre_categoria: "Cereales", descripcion: "Granos y cereales básicos.", estado: "activa" },
    { id_categoria: 4, nombre_categoria: "Legumbres", descripcion: "Leguminosas secas.", estado: "activa" },
    { id_categoria: 5, nombre_categoria: "Lácteos", descripcion: "Leche y productos lácteos.", estado: "activa" }
];

const alimentosIniciales = [
    { id_alimento: 1, id_categoria: 1, nombre_alimento: "Manzana gala", descripcion: "Manzana fresca.", unidad_medida: "Pieza", calorias_porcion: 52, proteinas: 0.3, carbohidratos: 14, grasas: 0.2, estado: "disponible" },
    { id_alimento: 2, id_categoria: 2, nombre_alimento: "Jitomate saladette", descripcion: "Jitomate fresco.", unidad_medida: "Kilogramo", calorias_porcion: 18, proteinas: 0.9, carbohidratos: 3.9, grasas: 0.2, estado: "agotado" },
    { id_alimento: 3, id_categoria: 3, nombre_alimento: "Arroz blanco", descripcion: "Arroz de grano largo.", unidad_medida: "Kilogramo", calorias_porcion: 130, proteinas: 2.7, carbohidratos: 28, grasas: 0.3, estado: "disponible" },
    { id_alimento: 4, id_categoria: 4, nombre_alimento: "Frijol negro", descripcion: "Frijol seco.", unidad_medida: "Kilogramo", calorias_porcion: 132, proteinas: 8.9, carbohidratos: 23.7, grasas: 0.5, estado: "disponible" },
    { id_alimento: 5, id_categoria: 5, nombre_alimento: "Leche entera", descripcion: "Leche de vaca entera.", unidad_medida: "Litro", calorias_porcion: 61, proteinas: 3.2, carbohidratos: 4.8, grasas: 3.3, estado: "agotado" },
    { id_alimento: 6, id_categoria: 1, nombre_alimento: "Plátano", descripcion: "Plátano fresco.", unidad_medida: "Pieza", calorias_porcion: 89, proteinas: 1.1, carbohidratos: 22.8, grasas: 0.3, estado: "disponible" },
    { id_alimento: 7, id_categoria: 2, nombre_alimento: "Zanahoria", descripcion: "Zanahoria fresca.", unidad_medida: "Kilogramo", calorias_porcion: 41, proteinas: 0.9, carbohidratos: 9.6, grasas: 0.2, estado: "disponible" },
    { id_alimento: 8, id_categoria: 3, nombre_alimento: "Avena", descripcion: "Avena en hojuelas.", unidad_medida: "Kilogramo", calorias_porcion: 389, proteinas: 16.9, carbohidratos: 66.3, grasas: 6.9, estado: "disponible" },
    { id_alimento: 9, id_categoria: 4, nombre_alimento: "Lenteja", descripcion: "Lenteja seca.", unidad_medida: "Kilogramo", calorias_porcion: 116, proteinas: 9, carbohidratos: 20.1, grasas: 0.4, estado: "disponible" },
    { id_alimento: 10, id_categoria: 5, nombre_alimento: "Yogur natural", descripcion: "Yogur natural sin azúcar.", unidad_medida: "Litro", calorias_porcion: 61, proteinas: 3.5, carbohidratos: 4.7, grasas: 3.3, estado: "disponible" }
];

const comercios = [
    { id_comercio: 1, nombre_comercial: "Abarrotes La Esperanza", razon_social: "Abarrotes La Esperanza S.A.", tipo_comercio: "Abarrotes" },
    { id_comercio: 2, nombre_comercial: "Frutas Don Luis", razon_social: "Luis Hernández", tipo_comercio: "Frutería" }
];

const organizaciones = [
    { id_organizacion: 1, nombre_organizacion: "Comedor Comunitario San Miguel", tipo_organizacion: "Comedor comunitario", responsable: "María López", estado: "activa" },
    { id_organizacion: 2, nombre_organizacion: "Banco de Alimentos NutriCom", tipo_organizacion: "Banco de alimentos", responsable: "Jorge Pérez", estado: "activa" }
];

const donacionesIniciales = [
    { id_donacion: 1, id_comercio: 1, id_organizacion: 1, fecha_donacion: "2026-11-18", cantidad_total: 50, estado: "pendiente", observaciones: "Donación de prueba para mostrar el seguimiento." }
];

const detallesDonacionesIniciales = [
    { id_donacion: 1, id_alimento: 3, cantidad: 30 },
    { id_donacion: 1, id_alimento: 4, cantidad: 20 }
];

const claveDonacionesGuardadas = "nutricom.donaciones";
let detallesDonaciones = [];

function cargarDonaciones() {
    if (typeof localStorage === "undefined") {
        return {
            donaciones: donacionesIniciales.map(donacion => ({ ...donacion })),
            detalles: detallesDonacionesIniciales.map(detalle => ({ ...detalle }))
        };
    }

    const guardados = localStorage.getItem(claveDonacionesGuardadas);
    if (guardados === null) {
        return {
            donaciones: donacionesIniciales.map(donacion => ({ ...donacion })),
            detalles: detallesDonacionesIniciales.map(detalle => ({ ...detalle }))
        };
    }

    const datosGuardados = JSON.parse(guardados);
    if (
        !datosGuardados
        || !Array.isArray(datosGuardados.donaciones)
        || !Array.isArray(datosGuardados.detalles)
    ) {
        throw new Error("Las donaciones guardadas localmente tienen un formato inválido.");
    }

    return datosGuardados;
}

function guardarDonaciones(nuevasDonaciones, nuevosDetalles) {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem(claveDonacionesGuardadas, JSON.stringify({
            donaciones: nuevasDonaciones,
            detalles: nuevosDetalles
        }));
    }
}

({ donaciones, detalles: detallesDonaciones } = cargarDonaciones());

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

    return alimentosParseados;
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
        id_categoria: Number(datos.id_categoria),
        nombre_alimento: String(datos.nombre_alimento ?? "").trim(),
        descripcion: String(datos.descripcion ?? "").trim(),
        unidad_medida: String(datos.unidad_medida ?? "").trim(),
        calorias_porcion: Number(datos.calorias_porcion),
        proteinas: Number(datos.proteinas),
        carbohidratos: Number(datos.carbohidratos),
        grasas: Number(datos.grasas),
        estado: String(datos.estado ?? "").trim()
    };

    if (!categorias.some(categoria => categoria.id_categoria === alimento.id_categoria)) {
        throw new Error("Selecciona una categoría válida para el alimento.");
    }
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

export async function obtenerCategorias() {
    return categorias.map(categoria => ({ ...categoria }));
}

export async function obtenerAlimentos() {
    return alimentos.map(alimento => ({ ...alimento }));
}

export async function obtenerAlimento(id) {
    const alimento = alimentos.find(item => item.id_alimento === Number(id));
    return alimento ? { ...alimento } : null;
}

export async function obtenerComercios() {
    return comercios.map(comercio => ({ ...comercio }));
}

export async function obtenerOrganizaciones() {
    return organizaciones
        .filter(organizacion => organizacion.estado === "activa")
        .map(organizacion => ({ ...organizacion }));
}

export async function obtenerDonaciones() {
    return donaciones.map(donacion => ({
        ...donacion,
        nombre_comercial: comercios.find(comercio => comercio.id_comercio === donacion.id_comercio)?.nombre_comercial ?? "Comercio no disponible",
        nombre_organizacion: organizaciones.find(organizacion => organizacion.id_organizacion === donacion.id_organizacion)?.nombre_organizacion ?? null,
        detalles: detallesDonaciones
            .filter(detalle => detalle.id_donacion === donacion.id_donacion)
            .map(detalle => {
                const alimento = alimentos.find(item => item.id_alimento === detalle.id_alimento);
                return {
                    ...detalle,
                    nombre_alimento: alimento?.nombre_alimento ?? "Alimento no disponible",
                    unidad_medida: alimento?.unidad_medida ?? "Unidad"
                };
            })
    }));
}

export async function crearDonacion(datos) {
    if (!datos || typeof datos !== "object") {
        throw new Error("Los datos de la donación no son válidos.");
    }

    const id_comercio = Number(datos.id_comercio);
    const id_organizacion = datos.id_organizacion === "" || datos.id_organizacion == null
        ? null
        : Number(datos.id_organizacion);
    const fecha_donacion = String(datos.fecha_donacion ?? "").trim();
    const observaciones = String(datos.observaciones ?? "").trim();

    if (!comercios.some(comercio => comercio.id_comercio === id_comercio)) {
        throw new Error("Selecciona un comercio válido.");
    }
    if (id_organizacion !== null && !organizaciones.some(organizacion => organizacion.id_organizacion === id_organizacion)) {
        throw new Error("Selecciona una organización válida o deja la donación sin asignar.");
    }
    const [anio, mes, dia] = fecha_donacion.split("-").map(Number);
    const fechaValidada = new Date(Date.UTC(anio, mes - 1, dia));
    if (
        !/^\d{4}-\d{2}-\d{2}$/.test(fecha_donacion)
        || Number.isNaN(fechaValidada.getTime())
        || fechaValidada.getUTCFullYear() !== anio
        || fechaValidada.getUTCMonth() !== mes - 1
        || fechaValidada.getUTCDate() !== dia
    ) {
        throw new Error("Selecciona una fecha de donación válida.");
    }
    if (!Array.isArray(datos.detalles) || datos.detalles.length === 0) {
        throw new Error("Agrega al menos un alimento a la donación.");
    }

    const idsAlimentos = new Set();
    const detallesValidados = datos.detalles.map(detalle => {
        const id_alimento = Number(detalle.id_alimento);
        const cantidad = Number(detalle.cantidad);
        const alimento = alimentos.find(item => item.id_alimento === id_alimento);
        if (!Number.isInteger(id_alimento) || !alimento || alimento.estado === "agotado") {
            throw new Error("Selecciona un alimento válido y disponible en cada detalle.");
        }
        if (idsAlimentos.has(id_alimento)) {
            throw new Error("No repitas el mismo alimento; ajusta su cantidad en una sola línea.");
        }
        if (!Number.isFinite(cantidad) || cantidad <= 0) {
            throw new Error("La cantidad de cada alimento debe ser mayor que cero.");
        }
        idsAlimentos.add(id_alimento);
        return { id_alimento, cantidad };
    });

    const cantidad_total = detallesValidados.reduce((total, detalle) => total + detalle.cantidad, 0);
    const id_donacion = donaciones.reduce(
        (maximo, donacion) => Math.max(maximo, Number(donacion.id_donacion) || 0),
        0,
    ) + 1;
    const nuevaDonacion = {
        id_donacion,
        id_comercio,
        id_organizacion,
        fecha_donacion,
        cantidad_total,
        estado: "pendiente",
        observaciones
    };

    const nuevasDonaciones = [nuevaDonacion, ...donaciones];
    const nuevosDetalles = [
        ...detallesValidados.map(detalle => ({ id_donacion, ...detalle })),
        ...detallesDonaciones
    ];
    guardarDonaciones(nuevasDonaciones, nuevosDetalles);
    donaciones = nuevasDonaciones;
    detallesDonaciones = nuevosDetalles;
    return (await obtenerDonaciones()).find(donacion => donacion.id_donacion === id_donacion);
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