# NutriComunidad

NutriComunidad es una aplicación web para apoyar la gestión comunitaria de alimentos, inventario, donaciones y familias beneficiarias. Reúne en un mismo lugar un resumen de actividad y pantallas para consultar y administrar información.

> **Estado del proyecto:** en desarrollo. Algunas funciones utilizan datos de prueba en el navegador; el login no autentica credenciales y todavía no hay una base de datos de producción conectada.

## Integrantes

- **Jahdai Basebét de la Rosa Hernandez** — <axtchdz@gmail.com>
- **Jaime Ivan Sanchez Romero** — <sancehzrjaimei@gmail.com>

## Despliegue

- **Vercel:** pendiente de despliegue. Agregar aquí la URL cuando la aplicación esté publicada.

## Pantallas y navegación

| Pantalla | Archivo | Descripción |
|---|---|---|
| Inicio | [`index.html`](./index.html) | Página de presentación y formulario de registro. |
| Iniciar sesión | [`login.html`](./login.html) | Formulario con validación HTML básica. Al enviarlo, navega al dashboard; no comprueba las credenciales contra un servidor. |
| Resumen | [`home.html`](./home.html) | Dashboard con saludo, fecha, indicadores y menú lateral contraíble. |
| Usuarios y beneficiarios | [`usuarios.html`](./usuarios.html) | Directorio con búsqueda, filtros, indicadores, creación de usuarios y solicitudes de apoyo. |
| Solicitudes | [`nueva-solicitud.html`](./nueva-solicitud.html) | Envío de solicitudes de apoyo y consulta de sus estados. |
| Mis pedidos | [`mis-pedidos.html`](./mis-pedidos.html) | Seguimiento y detalle de las solicitudes del beneficiario. |
| Preferencias y alergias | [`preferencias-alergias.html`](./preferencias-alergias.html) | Administración local de preferencias alimentarias y alergias del beneficiario. |
| Catálogo de alimentos | [`catalogo-alimentos.html`](./catalogo-alimentos.html) | Consulta de alimentos y sus valores nutricionales por porción. |
| Alimentos e inventario | [`alimentos.html`](./alimentos.html) | Catálogo con búsqueda, filtros, estadísticas, paginación y acciones para agregar, consultar y editar alimentos. |
| Nueva donación | [`donaciones.html`](./donaciones.html) | Registro de donaciones de comercios a organizaciones con alimentos y cantidades. |
| Detalle de alimento | [`alimento-detalle.html`](./alimento-detalle.html) | Vista individual del alimento solicitado por su identificador. |
| Formulario de alimento | [`alimento-form.html`](./alimento-form.html) | Formulario independiente para agregar o editar un alimento. Las acciones también se pueden realizar desde modales en el listado. |

El sidebar y el encabezado del dashboard se reutilizan como parciales en las pantallas de los módulos.

## Funcionalidades

### Inicio de sesión y registro

- Los formularios utilizan validaciones HTML como campos obligatorios y formato de correo.
- El formulario de inicio de sesión lleva a `home.html` al enviarse.
- No existe autenticación real, gestión de sesiones ni verificación de contraseñas en un backend.

### Dashboard

- Presenta el saludo según la hora local del dispositivo y la fecha actual.
- Muestra el perfil de un usuario de ejemplo, incluidas sus iniciales y rol.
- Presenta indicadores de alimentos recuperados, familias beneficiadas, donaciones pendientes y productos por caducar.
- Incluye un menú lateral contraíble que conserva sus iconos cuando está plegado.

### Usuarios y beneficiarios

- Muestra un directorio con búsqueda y filtros por colonia y estado.
- Presenta indicadores de usuarios, personas activas e integrantes beneficiados.
- Incluye formularios para agregar usuarios y enviar solicitudes de apoyo.
- El frontend intenta comunicarse con endpoints locales de desarrollo y usa datos en memoria como alternativa cuando no hay conexión.

### Solicitudes de apoyo

- Permite elegir alimentos del catálogo, filtrar por categoría, ajustar cantidades y enviar el motivo, integrantes y prioridad.
- Las solicitudes se guardan provisionalmente en `localStorage` mediante las funciones de `src/js/datos.js`. Los primeros datos incluyen ejemplos de pedidos para la pantalla “Mis pedidos”.
- La persistencia es local a este navegador y se puede reemplazar más adelante al conectar la base de datos real.

### Mis pedidos

- Consulta las solicitudes provisionales guardadas en `localStorage`, con búsqueda por folio/contenido, filtro por estado y detalle de alimentos.
- Los datos de Solicitudes y Mis pedidos se centralizan en `src/js/datos.js`.

### Preferencias y alergias

- Permite registrar y quitar preferencias alimentarias y declarar o retirar alergias del catálogo.
- Los datos se guardan provisionalmente en `localStorage` mediante funciones de `src/js/datos.js`.

### Catálogo de alimentos

- Consulta los valores nutricionales del catálogo provisional, con filtros por categoría y unidad de medida.
- Los alimentos se leen desde `src/js/datos.js`; las tarjetas muestran sus valores registrados y no utilizan emojis.

### Alimentos e inventario

- Muestra alimentos con categoría, unidad de medida, calorías, proteínas, carbohidratos, estado y acciones.
- Permite buscar por nombre o descripción y filtrar por categoría y estado.
- Incluye estadísticas, paginación y un mensaje cuando no hay resultados.
- Permite agregar alimentos, consultar su detalle y editar registros. Estas acciones se pueden abrir como modales sobre la lista.
- Valida campos obligatorios y valores nutricionales no negativos.
- Guarda los cambios en `localStorage`, de modo que persistan en el mismo navegador entre recargas.
- Incluye categorías y alimentos iniciales de ejemplo.

### Donaciones

- Permite registrar un comercio donante, una organización receptora opcional, fecha, observaciones y varios alimentos con sus cantidades.
- Si el alimento no existe en el catálogo, permite agregarlo desde el formulario con categoría, unidad e información nutricional; queda guardado en el catálogo y seleccionado para la donación.
- Conserva la relación entre `DONACIONES` y `DETALLE_DONACIONES`; si no se asigna organización, la donación queda pendiente de reclamo.
- Incluye resumen, búsqueda, filtro por estado y consulta de los detalles de cada donación.
- Los comercios, organizaciones, donaciones y detalles usan datos de prueba en `datos.js` y `localStorage`; todavía no se conectan con endpoints del backend.
- La pantalla está disponible para `admin` y `comercio`. El backend debe validar los permisos y asociar cada comercio autenticado a su registro real.

## Tecnologías

- HTML5
- CSS3
- JavaScript con módulos ES (`type="module"`)
- Vite para el servidor de desarrollo y la compilación
- `localStorage` para guardar el catálogo local de Alimentos

No se instalaron librerías de componentes para la interfaz.

## Requisitos

- Node.js y npm instalados.
- Un navegador web actualizado.

## Instalación y ejecución

Desde la carpeta raíz del repositorio:

```bash
npm install
npm run dev
```

Abre en el navegador la dirección local que muestra Vite en la terminal. **No abras las páginas directamente con `file://`**: Vite procesa los parciales del sidebar y del encabezado.

## Compilación y vista previa

Para generar la compilación de producción:

```bash
npm run build
```

Los archivos compilados se generan en `dist/`. Para servirlos localmente:

```bash
npm run preview
```

## Estructura del proyecto

```text
Nutricom/
├── index.html
├── login.html
├── home.html
├── usuarios.html
├── nueva-solicitud.html
├── mis-pedidos.html
├── preferencias-alergias.html
├── catalogo-alimentos.html
├── alimentos.html
├── alimento-detalle.html
├── alimento-form.html
├── src/
│   ├── css/
│   │   ├── normalize.css
│   │   ├── global.css
│   │   ├── index.css
│   │   ├── login.css
│   │   ├── home.css
│   │   ├── usuarios.css
│   │   ├── nueva-solicitud.css
│   │   ├── mis-pedidos.css
│   │   ├── preferencias-alergias.css
│   │   ├── catalogo-alimentos.css
│   │   ├── alimentos.css
│   │   ├── alimento-detalle.css
│   │   └── alimento-form.css
│   ├── js/
│   │   ├── datos.js
│   │   ├── index.js
│   │   ├── home.js
│   │   ├── usuarios.js
│   │   ├── nueva-solicitud.js
│   │   ├── mis-pedidos.js
│   │   ├── preferencias-alergias.js
│   │   ├── catalogo-alimentos.js
│   │   ├── alimentos.js
│   │   ├── alimento-detalle.js
│   │   └── alimento-form.js
│   └── partials/
│       ├── homesidebar.html
│       ├── homeheader.html
│       └── footer.html
├── package.json
└── vite.config.js
```

## Datos y servicios

- `src/js/datos.js` contiene datos de prueba y funciones que usan el dashboard y los módulos.
- El catálogo de Alimentos utiliza `localStorage`; los cambios son locales al navegador y no se comparten entre usuarios o dispositivos.
- Las solicitudes de apoyo y sus alimentos también usan datos provisionales en `localStorage`, gestionados desde `src/js/datos.js`.
- Las preferencias alimentarias y alergias del beneficiario se guardan en `localStorage`, gestionadas desde `src/js/datos.js`.
- El módulo de Usuarios tiene una integración de frontend orientada a endpoints locales. Sin backend, algunas operaciones recurren a datos en memoria, que se pierden al recargar la página.
- Las restricciones de acceso según el rol aún no están implementadas. Ocultar elementos en la interfaz no sustituye los controles de autorización del servidor.

## Estilos y convenciones

- `src/css/normalize.css` reduce las diferencias entre estilos predeterminados de los navegadores.
- `src/css/global.css` importa Normalize y define reglas base, tipografía, colores y variables reutilizables.
- Los módulos tienen archivos CSS propios para sus estilos específicos.
- Las clases del dashboard y de Alimentos siguen la metodología BEM: bloque, elemento (`__`) y modificador (`--`).
- Vite usa una configuración multipágina y reemplaza las etiquetas `<include>` por el contenido de `src/partials/`.

## Limitaciones conocidas

- No hay base de datos de producción conectada.
- El login no autentica ni verifica las credenciales.
- Los datos de prueba de usuarios y solicitudes pueden ser volátiles cuando se guardan en memoria.
- Los datos de Alimentos se guardan únicamente en el almacenamiento local del navegador.
- La autorización real por rol debe implementarse y verificarse en el backend.