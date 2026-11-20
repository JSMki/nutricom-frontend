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
    { id_comercio: 2, nombre_comercial: "Frutas Don Luis", razon_social: "Luis Hernández", tipo_comercio: "Frutería" },
    { id_comercio: 3, nombre_comercial: "Panadería El Trigal", razon_social: "Panadería El Trigal S. de R.L.", tipo_comercio: "Panadería", telefono: "5551234567", correo: "contacto@eltrigal.example", direccion: "Calle Reforma 24", colonia: "Centro" }
];

const organizaciones = [
    { id_organizacion: 1, nombre_organizacion: "Comedor Comunitario San Miguel", tipo_organizacion: "Comedor comunitario", responsable: "María López", estado: "activa" },
    { id_organizacion: 2, nombre_organizacion: "Banco de Alimentos NutriCom", tipo_organizacion: "Banco de alimentos", responsable: "Jorge Pérez", estado: "activa" },
    { id_organizacion: 3, nombre_organizacion: "Centro Comunitario Las Flores", tipo_organizacion: "Centro comunitario", responsable: "Lucía Gómez", estado: "activa" }
];

const donacionesIniciales = [
    { id_donacion: 1, id_comercio: 1, id_organizacion: 1, fecha_donacion: "2026-11-18", cantidad_total: 50, estado: "pendiente", observaciones: "Donación de prueba para mostrar el seguimiento." }
];

const detallesDonacionesIniciales = [
    { id_donacion: 1, id_alimento: 3, cantidad: 30, fecha_caducidad: "2027-02-20", fecha_consumo_preferente: null },
    { id_donacion: 1, id_alimento: 4, cantidad: 20, fecha_caducidad: null, fecha_consumo_preferente: "2027-01-15" }
];

const donacionesDisponiblesIniciales = [
    { id_donacion: 248, id_comercio: 1, id_organizacion: null, fecha_donacion: "2026-11-19", cantidad_total: 36, estado: "disponible", observaciones: "Productos secos en buen estado." },
    { id_donacion: 249, id_comercio: 2, id_organizacion: null, fecha_donacion: "2026-11-18", cantidad_total: 28, estado: "disponible", observaciones: "Fruta y verdura fresca." },
    { id_donacion: 250, id_comercio: 3, id_organizacion: null, fecha_donacion: "2026-11-17", cantidad_total: 42, estado: "disponible", observaciones: "Pan del día y productos de despensa." },
    { id_donacion: 251, id_comercio: 1, id_organizacion: null, fecha_donacion: "2026-11-16", cantidad_total: 31, estado: "disponible", observaciones: "Alimentos empacados y etiquetados." },
    { id_donacion: 252, id_comercio: 2, id_organizacion: 1, fecha_donacion: "2026-11-15", cantidad_total: 18, estado: "recibida", observaciones: "Recibida por el comedor." },
    { id_donacion: 253, id_comercio: 3, id_organizacion: null, fecha_donacion: "2026-11-14", cantidad_total: 12, estado: "cancelada", observaciones: "Cancelada por el comercio." }
];

const detalle_donaciones = [
    { id_donacion: 248, id_alimento: 3, cantidad: 20, fecha_caducidad: "2027-02-20", fecha_consumo_preferente: null },
    { id_donacion: 248, id_alimento: 4, cantidad: 10, fecha_caducidad: null, fecha_consumo_preferente: "2027-01-15" },
    { id_donacion: 248, id_alimento: 8, cantidad: 6, fecha_caducidad: "2026-12-30", fecha_consumo_preferente: null },
    { id_donacion: 249, id_alimento: 1, cantidad: 12, fecha_caducidad: "2026-11-25", fecha_consumo_preferente: null },
    { id_donacion: 249, id_alimento: 6, cantidad: 10, fecha_caducidad: "2026-11-24", fecha_consumo_preferente: null },
    { id_donacion: 249, id_alimento: 7, cantidad: 6, fecha_caducidad: "2026-11-27", fecha_consumo_preferente: null },
    { id_donacion: 250, id_alimento: 8, cantidad: 18, fecha_caducidad: "2027-03-10", fecha_consumo_preferente: null },
    { id_donacion: 250, id_alimento: 9, cantidad: 14, fecha_caducidad: null, fecha_consumo_preferente: "2027-02-01" },
    { id_donacion: 250, id_alimento: 10, cantidad: 10, fecha_caducidad: "2026-11-26", fecha_consumo_preferente: null },
    { id_donacion: 251, id_alimento: 3, cantidad: 12, fecha_caducidad: "2027-04-20", fecha_consumo_preferente: null },
    { id_donacion: 251, id_alimento: 6, cantidad: 11, fecha_caducidad: "2026-11-26", fecha_consumo_preferente: null },
    { id_donacion: 251, id_alimento: 9, cantidad: 8, fecha_caducidad: null, fecha_consumo_preferente: "2027-03-01" },
    { id_donacion: 252, id_alimento: 1, cantidad: 8, fecha_caducidad: "2027-01-12", fecha_consumo_preferente: null },
    { id_donacion: 252, id_alimento: 7, cantidad: 6, fecha_caducidad: "2027-01-10", fecha_consumo_preferente: null },
    { id_donacion: 252, id_alimento: 8, cantidad: 4, fecha_caducidad: "2027-04-20", fecha_consumo_preferente: null },
    { id_donacion: 253, id_alimento: 3, cantidad: 5, fecha_caducidad: "2027-02-20", fecha_consumo_preferente: null },
    { id_donacion: 253, id_alimento: 4, cantidad: 4, fecha_caducidad: null, fecha_consumo_preferente: "2027-02-01" },
    { id_donacion: 253, id_alimento: 10, cantidad: 3, fecha_caducidad: "2027-01-10", fecha_consumo_preferente: null }
];

const unidades_medida = [
    { id_unidad: 1, nombre_unidad: "Kilogramo", abreviatura: "kg" },
    { id_unidad: 2, nombre_unidad: "Gramo", abreviatura: "g" },
    { id_unidad: 3, nombre_unidad: "Litro", abreviatura: "L" },
    { id_unidad: 4, nombre_unidad: "Mililitro", abreviatura: "ml" },
    { id_unidad: 5, nombre_unidad: "Pieza", abreviatura: "pieza" },
    { id_unidad: 6, nombre_unidad: "Porción", abreviatura: "porción" }
];

let inventarios = [];
let lotes = [];

// TODO: Sustituir por la organización asociada al usuario autenticado cuando la API la proporcione.
export const ORGANIZACION_ACTUAL = { id_organizacion: 1 };

const claveDonacionesGuardadas = "nutricom.donaciones";
let detallesDonaciones = [];

function combinarPorClave(iniciales, guardados, obtenerClave) {
    const registros = new Map(iniciales.map(registro => [obtenerClave(registro), { ...registro }]));
    for (const registro of guardados) {
        const clave = obtenerClave(registro);
        registros.set(clave, { ...registros.get(clave), ...registro });
    }
    return [...registros.values()];
}

function cargarDonaciones() {
    const donacionesBase = [...donacionesIniciales, ...donacionesDisponiblesIniciales];
    const detallesBase = [...detallesDonacionesIniciales, ...detalle_donaciones];
    const datosBase = {
        donaciones: donacionesBase.map(donacion => ({ ...donacion })),
        detalles: detallesBase.map(detalle => ({ ...detalle })),
        inventarios: [],
        lotes: []
    };

    if (typeof localStorage === "undefined") {
        return datosBase;
    }

    const guardados = localStorage.getItem(claveDonacionesGuardadas);
    if (guardados === null) {
        return datosBase;
    }

    const datosGuardados = JSON.parse(guardados);
    if (
        !datosGuardados
        || !Array.isArray(datosGuardados.donaciones)
        || !Array.isArray(datosGuardados.detalles)
        || (datosGuardados.inventarios !== undefined && !Array.isArray(datosGuardados.inventarios))
        || (datosGuardados.lotes !== undefined && !Array.isArray(datosGuardados.lotes))
    ) {
        throw new Error("Las donaciones guardadas localmente tienen un formato inválido.");
    }

    return {
        donaciones: combinarPorClave(
            donacionesBase,
            datosGuardados.donaciones,
            donacion => donacion.id_donacion,
        ),
        detalles: combinarPorClave(
            detallesBase,
            datosGuardados.detalles,
            detalle => `${detalle.id_donacion}:${detalle.id_alimento}`,
        ),
        inventarios: Array.isArray(datosGuardados.inventarios) ? datosGuardados.inventarios : [],
        lotes: Array.isArray(datosGuardados.lotes) ? datosGuardados.lotes : []
    };
}

function guardarDonaciones(
    nuevasDonaciones,
    nuevosDetalles,
    nuevosInventarios = inventarios,
    nuevosLotes = lotes,
) {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem(claveDonacionesGuardadas, JSON.stringify({
            donaciones: nuevasDonaciones,
            detalles: nuevosDetalles,
            inventarios: nuevosInventarios,
            lotes: nuevosLotes
        }));
    }
}

({
    donaciones,
    detalles: detallesDonaciones,
    inventarios,
    lotes
} = cargarDonaciones());

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

const recetasEconomicas = [
    {
        id: 1,
        nombre: 'Ensalada tibia de verduras',
        imagen: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        textoAlternativo: 'Ensalada de verduras frescas',
        tiempoMinutos: 25,
        porciones: 4,
        costoEstimado: 68,
        ingredientes: [
            { nombre: 'Jitomate', cantidad: '2 piezas', disponible: false },
            { nombre: 'Zanahoria', cantidad: '2 piezas', disponible: true },
            { nombre: 'Calabacita', cantidad: '1 pieza', disponible: true },
            { nombre: 'Cebolla', cantidad: '1/2 pieza', disponible: true },
            { nombre: 'Limón', cantidad: '2 piezas', disponible: true },
            { nombre: 'Aceite vegetal', cantidad: '1 cucharada', disponible: true },
        ],
        preparacion: [
            'Lava y corta las verduras en piezas pequeñas.',
            'Calienta el aceite y cocina las verduras hasta que estén suaves.',
            'Agrega limón al gusto y sirve tibia.',
        ],
    },
    {
        id: 2,
        nombre: 'Sopa nutritiva de temporada',
        imagen: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
        textoAlternativo: 'Tazón de sopa nutritiva',
        tiempoMinutos: 35,
        porciones: 6,
        costoEstimado: 82,
        ingredientes: [
            { nombre: 'Zanahoria', cantidad: '2 piezas', disponible: true },
            { nombre: 'Papa', cantidad: '2 piezas', disponible: true },
            { nombre: 'Calabacita', cantidad: '1 pieza', disponible: true },
            { nombre: 'Cebolla', cantidad: '1/2 pieza', disponible: true },
            { nombre: 'Caldo de verduras', cantidad: '1 litro', disponible: true },
        ],
        preparacion: [
            'Lava, pela y corta las verduras en cubos.',
            'Coloca las verduras y el caldo en una olla.',
            'Cocina a fuego medio hasta que las verduras estén suaves.',
        ],
    },
    {
        id: 3,
        nombre: 'Tortitas de arroz y frijol',
        imagen: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
        textoAlternativo: 'Tortitas preparadas para servir',
        tiempoMinutos: 30,
        porciones: 5,
        costoEstimado: 54,
        ingredientes: [
            { nombre: 'Arroz cocido', cantidad: '2 tazas', disponible: true },
            { nombre: 'Frijol negro cocido', cantidad: '1 taza', disponible: true },
            { nombre: 'Avena', cantidad: '1/2 taza', disponible: true },
            { nombre: 'Cebolla', cantidad: '1/4 pieza', disponible: true },
            { nombre: 'Huevo', cantidad: '1 pieza', disponible: false },
        ],
        preparacion: [
            'Machaca los frijoles y mézclalos con el arroz.',
            'Incorpora la avena, el huevo y la cebolla picada.',
            'Forma tortitas y cocínalas en un sartén hasta que estén doradas.',
        ],
    },
];

export async function obtenerRecetasEconomicas() {
    return recetasEconomicas.map(receta => ({
        ...receta,
        ingredientes: receta.ingredientes.map(ingrediente => ({ ...ingrediente })),
        preparacion: [...receta.preparacion],
    }));
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
            .map(resolverDetalleDonacion)
    }));
}

function normalizarUnidad(texto) {
    return String(texto ?? "")
        .trim()
        .toLocaleLowerCase("es-MX")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function obtenerUnidadAlimento(alimento) {
    const id_unidad = Number(alimento?.id_unidad)
        || unidades_medida.find(unidad =>
            normalizarUnidad(unidad.nombre_unidad) === normalizarUnidad(alimento?.unidad_medida)
            || normalizarUnidad(unidad.abreviatura) === normalizarUnidad(alimento?.unidad_medida)
        )?.id_unidad;
    return unidades_medida.find(unidad => unidad.id_unidad === id_unidad) ?? null;
}

function resolverDetalleDonacion(detalle) {
    const alimento = alimentos.find(item => item.id_alimento === Number(detalle.id_alimento));
    const unidad = obtenerUnidadAlimento(alimento);
    const categoria = categorias.find(item => item.id_categoria === Number(alimento?.id_categoria));
    return {
        ...detalle,
        id_unidad: unidad?.id_unidad ?? alimento?.id_unidad ?? null,
        nombre_alimento: alimento?.nombre_alimento ?? "Alimento no disponible",
        nombre_categoria: categoria?.nombre_categoria ?? "Sin categoría",
        abreviatura: unidad?.abreviatura ?? "unidad",
        unidad_medida: unidad?.abreviatura ?? alimento?.unidad_medida ?? "Unidad"
    };
}

function resolverComercioDonacion(id_comercio) {
    const comercio = comercios.find(item => item.id_comercio === Number(id_comercio));
    return comercio
        ? {
            id_comercio: comercio.id_comercio,
            nombre_comercial: comercio.nombre_comercial,
            razon_social: comercio.razon_social ?? "",
            tipo_comercio: comercio.tipo_comercio ?? "",
            telefono: comercio.telefono ?? "",
            correo: comercio.correo ?? "",
            direccion: comercio.direccion ?? "",
            colonia: comercio.colonia ?? ""
        }
        : null;
}

function resolverDonacion(donacion) {
    if (!donacion) return null;
    return {
        ...donacion,
        comercio: resolverComercioDonacion(donacion.id_comercio),
        detalles: detallesDonaciones
            .filter(detalle => Number(detalle.id_donacion) === Number(donacion.id_donacion))
            .map(resolverDetalleDonacion)
    };
}

export async function obtenerDonacionesDisponibles() {
    return donaciones
        .filter(donacion => donacion.estado === "disponible" && donacion.id_organizacion == null)
        .map(resolverDonacion);
}

export async function obtenerDonacion(id_donacion) {
    const donacion = donaciones.find(item => Number(item.id_donacion) === Number(id_donacion));
    return resolverDonacion(donacion);
}

function validarFechaDetalle(fecha, etiqueta, hoy) {
    if (!fecha) return null;
    const valor = String(fecha).trim();
    const [anio, mes, dia] = valor.split("-").map(Number);
    const fechaParsed = new Date(Date.UTC(anio, mes - 1, dia));
    if (
        !/^\d{4}-\d{2}-\d{2}$/.test(valor)
        || Number.isNaN(fechaParsed.getTime())
        || fechaParsed.getUTCFullYear() !== anio
        || fechaParsed.getUTCMonth() !== mes - 1
        || fechaParsed.getUTCDate() !== dia
    ) {
        throw new Error(`La fecha de ${etiqueta} no es válida.`);
    }
    if (valor < hoy) {
        throw new Error(`La fecha de ${etiqueta} no puede ser anterior a hoy.`);
    }
    return valor;
}

function obtenerFechaLocal() {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    return `${anio}-${mes}-${dia}`;
}

export async function reclamarDonacion(id_donacion, id_organizacion) {
    const datosActuales = cargarDonaciones();
    donaciones = datosActuales.donaciones;
    detallesDonaciones = datosActuales.detalles;
    inventarios = datosActuales.inventarios;
    lotes = datosActuales.lotes;

    const idDonacion = Number(id_donacion);
    const idOrganizacion = Number(id_organizacion);
    const donacion = donaciones.find(item => Number(item.id_donacion) === idDonacion);
    if (!donacion) {
        throw new Error("No se encontró la donación que intentas reclamar.");
    }
    if (donacion.estado !== "disponible" || donacion.id_organizacion != null) {
        throw new Error("Esta donación ya no está disponible para reclamar.");
    }
    if (!Number.isInteger(idOrganizacion)
        || !organizaciones.some(item => item.id_organizacion === idOrganizacion)) {
        throw new Error("No se encontró una organización válida para recibir la donación.");
    }

    const detalles = detallesDonaciones.filter(detalle => Number(detalle.id_donacion) === idDonacion);
    if (!detalles.length) {
        throw new Error("La donación no tiene alimentos registrados y no puede reclamarse.");
    }
    const detallesValidados = detalles.map(detalle => {
        const fecha_caducidad = detalle.fecha_caducidad || null;
        const fecha_consumo_preferente = detalle.fecha_consumo_preferente || null;
        const cantidad = Number(detalle.cantidad);
        if (!Number.isFinite(cantidad) || cantidad <= 0) {
            throw new Error("La cantidad de cada alimento debe ser mayor que cero.");
        }
        if (!fecha_caducidad && !fecha_consumo_preferente) {
            throw new Error("Cada alimento debe tener fecha de caducidad o fecha de consumo preferente.");
        }
        return {
            id_alimento: Number(detalle.id_alimento),
            fecha_caducidad,
            fecha_consumo_preferente,
            cantidad
        };
    });

    const hoy = obtenerFechaLocal();
    const fecha_recepcion = hoy;
    const fecha_actualizacion = new Date().toISOString();
    const inventariosActualizados = inventarios.map(item => ({ ...item }));
    const lotesActualizados = lotes.map(item => ({ ...item }));
    let siguienteInventario = inventariosActualizados.reduce(
        (maximo, item) => Math.max(maximo, Number(item.id_inventario) || 0),
        0,
    ) + 1;
    let siguienteLote = lotesActualizados.reduce(
        (maximo, item) => Math.max(maximo, Number(item.id_lote) || 0),
        0,
    ) + 1;

    const folioDonacion = `DON-${String(idDonacion).padStart(4, "0")}`;
    for (const [indice, detalle] of detallesValidados.entries()) {
        let inventario = inventariosActualizados.find(item =>
            Number(item.id_organizacion) === idOrganizacion
            && Number(item.id_alimento) === detalle.id_alimento
        );
        if (!inventario) {
            inventario = {
                id_inventario: siguienteInventario++,
                id_organizacion: idOrganizacion,
                id_alimento: detalle.id_alimento,
                cantidad_disponible: 0,
                fecha_actualizacion,
                estado: "disponible"
            };
            inventariosActualizados.push(inventario);
        }
        inventario.cantidad_disponible = Number(inventario.cantidad_disponible) + detalle.cantidad;
        inventario.fecha_actualizacion = fecha_actualizacion;
        inventario.estado = "disponible";
        lotesActualizados.push({
            id_lote: siguienteLote++,
            id_inventario: inventario.id_inventario,
            numero_lote: `${folioDonacion}-${String(indice + 1).padStart(2, "0")}`,
            fecha_recepcion,
            fecha_caducidad: detalle.fecha_caducidad,
            fecha_consumo_preferente: detalle.fecha_consumo_preferente,
            cantidad_inicial: detalle.cantidad,
            cantidad_actual: detalle.cantidad
        });
    }

    const donacionesActualizadas = donaciones.map(item => Number(item.id_donacion) === idDonacion
        ? { ...item, id_organizacion: idOrganizacion, estado: "recibida" }
        : item);
    guardarDonaciones(donacionesActualizadas, detallesDonaciones, inventariosActualizados, lotesActualizados);
    donaciones = donacionesActualizadas;
    inventarios = inventariosActualizados;
    lotes = lotesActualizados;
    return resolverDonacion(donaciones.find(item => Number(item.id_donacion) === idDonacion));
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
    const hoy = obtenerFechaLocal();
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
        const fecha_caducidad = validarFechaDetalle(detalle.fecha_caducidad, "caducidad", hoy);
        const fecha_consumo_preferente = validarFechaDetalle(
            detalle.fecha_consumo_preferente,
            "consumo preferente",
            hoy,
        );
        if (!fecha_caducidad && !fecha_consumo_preferente) {
            throw new Error("Indica la fecha de caducidad o la de consumo preferente para cada alimento.");
        }
        idsAlimentos.add(id_alimento);
        return { id_alimento, cantidad, fecha_caducidad, fecha_consumo_preferente };
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
        estado: "disponible",
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
    return (await obtenerDonaciones()).find(
        donacion => Number(donacion.id_donacion) === Number(id_donacion),
    );
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

const claveBienestarBeneficiario = 'nutricom.bienestar-beneficiario';
const preferenciasIniciales = [
    { id: 1, nombre: 'Vegetariana', descripcion: 'Evitar carnes rojas', aplica_a: 'Dos integrantes' },
    { id: 2, nombre: 'Baja en sodio', descripcion: 'Preferir alimentos sin sal añadida', aplica_a: 'Adulto mayor' },
    { id: 3, nombre: 'Sin azúcar añadida', descripcion: 'Evitar bebidas azucaradas', aplica_a: 'Toda la familia' },
];
const alergiasDisponibles = [
    { id: 1, nombre: 'Cacahuate' },
    { id: 2, nombre: 'Lactosa' },
    { id: 3, nombre: 'Gluten' },
    { id: 4, nombre: 'Huevo' },
    { id: 5, nombre: 'Mariscos' },
    { id: 6, nombre: 'Soya' },
    { id: 7, nombre: 'Frutos secos' },
];
const alergiasIniciales = [1];

function cargarBienestarBeneficiario() {
    const inicial = {
        preferencias: preferenciasIniciales.map(preferencia => ({ ...preferencia })),
        alergias: [...alergiasIniciales],
    };
    if (typeof localStorage === 'undefined') return inicial;

    const guardado = localStorage.getItem(claveBienestarBeneficiario);
    if (guardado === null) {
        localStorage.setItem(claveBienestarBeneficiario, JSON.stringify(inicial));
        return inicial;
    }

    const datos = JSON.parse(guardado);
    if (!datos || !Array.isArray(datos.preferencias) || !Array.isArray(datos.alergias)) {
        throw new Error('Las preferencias y alergias guardadas localmente tienen un formato inválido.');
    }
    return {
        preferencias: datos.preferencias,
        alergias: datos.alergias.map(Number).filter(Number.isInteger),
    };
}

function guardarBienestarBeneficiario(datos) {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem(claveBienestarBeneficiario, JSON.stringify(datos));
    }
}

export async function obtenerPreferenciasBeneficiario() {
    return cargarBienestarBeneficiario().preferencias.map(preferencia => ({ ...preferencia }));
}

export async function agregarPreferenciaBeneficiario(datos) {
    const nombre = String(datos?.nombre ?? '').trim();
    const descripcion = String(datos?.descripcion ?? '').trim();
    const aplica_a = String(datos?.aplica_a ?? '').trim();
    if (!nombre || !descripcion || !aplica_a) {
        throw new Error('Completa el nombre, la descripción y a quién aplica la preferencia.');
    }

    const estado = cargarBienestarBeneficiario();
    const id = estado.preferencias.reduce((maximo, item) => Math.max(maximo, Number(item.id) || 0), 0) + 1;
    const preferencia = { id, nombre, descripcion, aplica_a };
    const actualizado = { ...estado, preferencias: [preferencia, ...estado.preferencias] };
    guardarBienestarBeneficiario(actualizado);
    return { ...preferencia };
}

export async function eliminarPreferenciaBeneficiario(id) {
    const estado = cargarBienestarBeneficiario();
    const preferencias = estado.preferencias.filter(preferencia => Number(preferencia.id) !== Number(id));
    if (preferencias.length === estado.preferencias.length) {
        throw new Error(`No se encontró la preferencia con ID ${id}.`);
    }
    guardarBienestarBeneficiario({ ...estado, preferencias });
}

export async function obtenerAlergiasBeneficiario() {
    const estado = cargarBienestarBeneficiario();
    const declaradas = new Set(estado.alergias);
    return alergiasDisponibles.map(alergia => ({
        ...alergia,
        declarada: declaradas.has(alergia.id),
    }));
}

export async function actualizarAlergiaBeneficiario(id, declarada) {
    const alergia = alergiasDisponibles.find(item => item.id === Number(id));
    if (!alergia) {
        throw new Error(`No se encontró la alergia con ID ${id}.`);
    }
    if (typeof declarada !== 'boolean') {
        throw new Error('Indica si la alergia debe declararse o quitarse.');
    }

    const estado = cargarBienestarBeneficiario();
    const alergias = declarada
        ? [...new Set([...estado.alergias, alergia.id])]
        : estado.alergias.filter(alergiaId => alergiaId !== alergia.id);
    guardarBienestarBeneficiario({ ...estado, alergias });
}

const API_BASE_URL = 'http://localhost:8080/api';

let usuariosExtrasMemoria = [
    { id: 4, username: 'rgarcia', nombre: 'Roberto García Pérez', correo: 'roberto.g@email.com', integrantes: 2, colonia: 'La Esperanza', estado: 'Inactivo', color: 'blue' }
];

const claveSolicitudesGuardadas = 'nutricom.solicitudes';
const entregasIniciales = [
    {
        id_entrega: 1,
        id_solicitud: 98,
        id_organizacion: 1,
        fecha_entrega: '2025-05-14',
        responsable: 'María López',
        estado: 'Entregada',
        observaciones: 'Apoyo entregado a la persona beneficiaria.',
    },
];
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
    return obtenerSolicitudesGuardadas().map(solicitud => {
        const entrega = entregasIniciales.find(
            item => item.id_solicitud === Number(solicitud.id_solicitud ?? solicitud.id),
        );
        return {
            ...solicitud,
            entrega: entrega
                ? {
                    ...entrega,
                    nombre_organizacion: organizaciones.find(
                        organizacion => organizacion.id_organizacion === entrega.id_organizacion,
                    )?.nombre_organizacion ?? 'Organización no disponible',
                }
                : null,
        };
    });
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