# Panel de estadísticas · Liga

Proyecto estático (HTML + CSS + JS, sin build). Se publica tal cual en Netlify.

## Estructura
```
public/                  Lo único que se publica (el sitio)
  index.html, css/, js/  Código público: posiciones, jornada, colectivas, individuales, líderes
  js/09-auth.js          Ventana de inicio de sesión
  data/index.json        Ligas publicadas: {"ligas":[{"id":"...","nombre":"...","jornadas":[11,12]}]}
  data/<liga>/jNN.json   Datos acumulados de cada jornada de esa liga
  assets/<liga>/liga.png            Logo de la liga (opcional)
  assets/<liga>/logos/AAA.png       Logo de cada equipo (AAA = código de hoja: MIA, BOS...)
  assets/<liga>/players/AAA-N.jpg   Foto del jugador (AAA = equipo, N = número)
netlify/functions/
  auth.js                Inicio de sesión, sesión y publicación protegida
  data.js                Lectura pública de datos publicados en Netlify Blobs
  media.js               Fotos, logos y portadas: lectura pública, subida solo con sesión
netlify/lib/
  session.js             Verificación de la sesión (usada por media.js)
  admin.js               CÓDIGO DEL PANEL ADMIN: solo se envía a quien tiene sesión válida
tools/hash-password.js   Genera el hash de tu contraseña
tools/dev-server.js      Servidor local con el login incluido
netlify.toml             Configuración de Netlify
```

## Acceso de administrador (usuario y contraseña)
El panel Admin (subir Excel, crear ligas, fotos, logos) no está en los archivos públicos: vive en
`netlify/lib/admin.js` y el servidor solo lo entrega si la sesión es válida. Quien no inicie sesión
no ve la pestaña ni puede descargar ese código.

1. Genera tu hash: `node tools/hash-password.js "tu contraseña larga"` (mínimo 10 caracteres).
2. En Netlify → Site configuration → Environment variables, crea tres variables con lo que imprimió:
   `ADMIN_USER` (tu usuario), `ADMIN_PASS_HASH` y `SESSION_SECRET`.
3. Publica con Git o con la CLI (`npx netlify deploy --prod`) para que se publiquen las funciones.
   Usa HTTPS (Netlify ya lo da). La sesión dura 8 horas y se cierra con "Cerrar sesión".
   Después de crear o cambiar variables hay que volver a publicar (Deploys → Trigger deploy), si no la función no las ve.
4. Comprobación: abre `https://TU-SITIO.netlify.app/.netlify/functions/auth?a=me`. Debe mostrar `{"admin":false}`.
   - Página "Not Found" → la función no se publicó (publicaste arrastrando la carpeta; usa Git o la CLI).
   - `Faltan las variables de entorno` → falta alguna de las tres variables o no se volvió a publicar.
5. En el sitio pulsa "Acceso", escribe usuario y contraseña, y aparece la pestaña Admin.

Para cambiar la contraseña repite los pasos 1 y 2 (cambiar `SESSION_SECRET` cierra todas las sesiones).
Nunca subas tu contraseña ni el archivo `.env` al repositorio.

## Probar en tu PC
Ejecuta `npm install`, copia `.env.example` a `.env`, rellénalo y ejecuta `node tools/dev-server.js`; abre http://localhost:8888
(sin `.env` el login no funciona). También sirve `npx netlify dev`.

## Varias ligas (temporadas y ligas pasadas)
Cada liga tiene sus propias jornadas, logos y fotos. Arriba a la izquierda eliges la liga y la jornada.
- Liga nueva: Admin → Ligas y temporadas → escribe el nombre → Crear liga.
- Liga pasada: crea la liga y sube su Excel (el número de jornada es opcional; si lo dejas vacío usa los juegos jugados).
- Los equipos se detectan solos: cada hoja de equipo con jugadores (título "O F E N S I V A" en C1) cuenta como un equipo, y su nombre sale de la columna TEAM de la hoja ATLE. La hoja TABLA no se usa. Si una liga tiene 8 equipos, se verán 8.

## Flujo de cada jornada
1. Actualiza tu Excel (guardado en Excel) y elige la liga en la web.
2. Admin → Subir jornada → elige el archivo y revisa los datos.
3. La publicación ahora se hace automáticamente: al subir el Excel, el administrador guarda la jornada en Netlify Blobs mediante una función protegida. Los visitantes leen esos datos desde la función pública `data.js`. Los archivos estáticos de `public/data/` quedan como respaldo/fallback.
   - No necesitas descargar ni copiar manualmente `jNN.json` para cada jornada.
   - Después de un deploy, los datos guardados en Netlify Blobs permanecen disponibles.

## Fotos, logos y portadas (visibles para todos)
Todo lo que subes como administrador (logo de la liga, logos de equipos, fotos de jugadores y portadas de cada
sección) se guarda en Netlify Blobs mediante `netlify/functions/media.js`. Cualquier visitante lo ve al abrir
la página; solo el administrador con sesión puede subir o quitar imágenes.
- Fotos y logos se reducen solos antes de subirse (jugadores 260 px, logos 220 px).
- Portadas: Admin → Imágenes del sitio. Tamaño recomendado 1200×300. Sin imagen se muestra una ilustración por defecto.
- Las imágenes son por liga: cada liga tiene sus propios logos, fotos y portadas.
- Los archivos de `public/assets/<liga>/` siguen funcionando como respaldo (si no hay imagen subida por Admin).
- Las imágenes que subiste con la versión anterior (guardadas solo en tu navegador) hay que subirlas otra vez.

## Migración a PHP (plan)
Las pantallas no leen archivos directamente: toda la carga está en `js/08-inicio.js` y el guardado
en `js/01-almacenamiento.js` y `js/07-excel.js`. Para pasar a PHP basta con:
- `GET api/ligas.php` → ligas y sus jornadas (reemplaza `data/index.json`)
- `GET api/jornada.php?liga=ID&n=11` → JSON de la jornada (reemplaza `data/ID/j11.json`)
- `POST api/liga.php` y `POST api/jornada.php` → crean ligas y guardan jornadas subidas desde Admin
- `POST api/imagen.php` → guarda fotos y logos en `assets/`
- El login (`auth.js`) se traslada a PHP con sesiones (`password_hash` / `password_verify`) y todos los POST exigen sesión.
El formato JSON de cada jornada ya es el que usará la API.

## Nota de despliegue
Publica con Git o `npx netlify deploy --prod` (después de `npm install`, porque las funciones usan `@netlify/blobs`).
