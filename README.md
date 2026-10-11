# Trabajo práctico 04

## Descripción

App web desarrollada con Node, Express y ejs para la gestión de un catálogo de mascotas en adopción. podemos listar mascotas, ver detalles individuales, consumir una API JSON y registrar nuevos ingresos mediante un formulario de validadcion.

## Instalación

1. Clona el repositorio
2. Instala las dependencias ejecutando:
   por consola
   npm install

## Ejecución

una vez instalada las dependencias usamos>
por consola
npm start

## Páginas y rutas

- `GET /`: Página de inicio con la bienvenida
- `GET /mascotas`: Catálogo completo que lista todas las mascotas disponibles.
- `GET /mascotas/:id`: Vista detallada de una mascota específica según su id.
- `GET /mascotas/nueva`: Formulario web para registrar y dar de alta una nueva mascota.
- `POST /mascotas`: Ruta de procesamiento del formulario para validar y agregar la nueva mascota al sistema.
- `GET /api/mascotas`: Endpoint en formato JSON que devuelve la lista completa de mascotas para consumo de APIs.

## Estructura de vistas

Las vistas de la aplicación se encuentran en la carpeta `views/` utilizando plantillas EJS:

- `views/layouts/main.ejs`: Layout principal donde esta la estructura común (cabecera, pie de página y contenedor).
- `views/inicio.ejs`: Página de bienvenida del sitio.
- `views/mascotas/lista.ejs`: Grilla que muestra todas las mascotas del catálogo.
- `views/mascotas/detalle.ejs`: Vista detallada con la información individual de cada mascota.
- `views/mascotas/nueva.ejs`: Formulario de registro para dar de alta una nueva mascota.
- `views/no-encontrado.ejs`: Vista de error 404 para identificadores o rutas inexistentes.

## Recursos estáticos

Los archivos públicos que se usan `public/`:

- `public/img/mascota.svg`: Imagen genérica utilizada por defecto para representar a las mascotas en las tarjetas y vistas detalladas.
- Archivos de estilos CSS u otros recursos gráficos necesarios para el diseño visual del sitio.

## Formulario

El form (`/mascotas/nueva`) permite dar de alta nuevas mascotas mediante una petición `POST`.

- Campos requeridos: Nombre, especie, edad (número entero mayor o igual a cero), estado (seleccionable entre "En adopción", "Reservada" o "Adoptada") y descripción.
- Validación en el servidor: Verifica que todos los campos estén completos y que la edad sea un valor numérico válido. En caso de error, responde con un código HTTP `400` y vuelve a renderizar el formulario conservando los datos ingresados (`valores`) para evitar que el usuario deba reescribirlos.
- Redirección exitosa: Si la validación es correcta, los datos se procesan, se calcula automáticamente el siguiente ID correlativo, se añade la mascota al array en memoria y se redirige al usuario al catálogo (`/mascotas`).

## Persistencia de los datos

los datos de las mascotas se almacenan de forma local en un archivo JSON (`datos/mascotas.json`).

- Lectura: Al iniciar la aplicación, los registros se leen desde el archivo para ser manipulados en memoria.
- Modificación en memoria: Las nuevas mascotas agregadas a través del formulario se insertan directamente en el array en ejecución y se les asigna un ID único correlativo. Sin embargo, al tratarse de un almacenamiento en memoria y un archivo estático, **los cambios no se guardan de forma permanente en el disco físico (se reinician al reiniciar el servidor)**

## Conceptos teóricos del proyecto

1.  Diferencia entre Layout, Vista y Parcial

- Layout: Es la plantilla base o estructura general que envuelve a toda la aplicación (por ejemplo, cabecera, etiquetas HTML globales y pie de página).diseño general para no repetir en cada pagina.
- Vista: Es el contenido específico de una página determinada (como el catálogo, el formulario o el detalle). Se inyecta dentro del layout principal.
- Parcial (Partial): Es un fragmento de código HTML reutilizable (como una tarjeta de mascota o una barra de navegación) que se puede importar y repetir en diferentes vistas para evitar duplicar código.

2. Datos enviados mediante `res.render`

   `res.render` es el método de Express que toma una vista EJS, la procesa en el servidor inyectándole un objeto con datos (como `titulo`, `mascotas` o `error`) y convierte todo en HTML puro para enviárselo al navegador. Permite que las páginas sean dinámicas, adaptando su contenido según los datos actuales.

3. Función de `express.static` y `express.urlencoded`

- `express.static`: Es un _middleware_ nativo que permite servir archivos estáticos (como hojas de estilo CSS, imágenes SVG, scripts de cliente) directamente desde una carpeta pública (`public/`) sin necesidad de crear una ruta individual para cada archivo.
- `express.urlencoded`: Es un _middleware_ indispensable para procesar formularios HTML. Intercepta los datos enviados por método POST desde el navegador y los convierte en un objeto accesible en JavaScript (`req.body`) para que el servidor pueda leerlos.

4. Recorrido POST, Redirección y GET

- POST (`/mascotas`): El usuario completa el formulario y lo envía. El servidor recibe los datos en `req.body`, los valida y, si son correctos, agrega la nueva mascota al array en memoria.
- dirección (`res.redirect`): Una vez procesado el POST, en lugar de renderizar una vista directamente (lo que provocaría que el formulario se reenvíe si el usuario recarga la página), el servidor le ordena al navegador mediante una cabecera HTTP que realice una nueva petición.
- GET (`/mascotas`):El navegador atiende la redirección pidiendo el catálogo actualizado, y el servidor responde renderizando la lista completa con la nueva mascota incluida.

5. ¿Por qué el nuevo registro desaparece al reiniciar?

Los datos de las mascotas se almacenan únicamente en la **memoria RAM del servidor** (dentro de un array de JavaScript) o se leen una sola vez al iniciar desde el archivo JSON estático. Cuando la aplicación se reinicia (por ejemplo, al apagar el servidor), la memoria RAM se libera por completo y los cambios añadidos se pierden, volviendo al estado original del archivo.
