# MEMORY.md - Registro de Progreso y Memoria del Proyecto

**Proyecto:** Portafolio Multidisciplinario de Jhonsons González  
**Repositorio / Rama:** `NobarDev/NobarDev.github.io`  
**Última actualización:** 2026-07-25  

---

## 📌 1. Resumen Ejecutivo del Proyecto
Este sitio web es el portafolio profesional multidisciplinario de **Jhonsons González**, diseñador gráfico, ilustrador digital, desarrollador empírico de videojuegos y streamer. 

El proyecto combina una estética visual impactante **Steampunk Industrial + Neón Cyberpunk Dark** con una navegación fluida, diseño responsivo y micro-interacciones interactivas.

---

## 🎨 2. Sistema de Diseño (Design System)

### Paleta de Colores
- **Fondo Principal:** `#0a0b0d` (Dark Obsidian)
- **Fondo Tarjetas/Paneles:** `#12151c` / `#181c26`
- **Acento Verde (Neón):** `#00ff88` (`var(--accent-green)`)
- **Acento Naranja (Vapor):** `#ff6b00` (`var(--accent-orange)`)
- **Acento Púrpura (Transmisión):** `#9d4edd` (`var(--accent-purple)`)
- **Texto Principal:** `#e0e6ed` (`var(--text-white)`)
- **Texto Secundario:** `#8a99ad` (`var(--text-muted)`)

### Tipografía
- **Títulos y Encabezados:** `'Outfit', sans-serif`
- **Cuerpo y Navegación:** `'Inter', sans-serif`
- **Código / Metadatos:** `'Fira Code', monospace`

### Estética y Efectos Visuales
- Glassmorphism (`backdrop-filter: blur()`, bordes semitransparentes).
- Luces Neón & Glow (sombras difusas en acentos de color).
- Animaciones suaves de hover, transiciones y carga tipo `fadeIn`.

---

## 📁 3. Estructura de Archivos y Arquitectura

```
Portafolio/
│
├── index.html              # Landing Page principal con scroll-snap de 4 secciones
├── portafolio.html         # Galería estilo Behance para Arte e Ilustración Digital
├── proyectos.html          # Catálogo interactivo de Software y Videojuegos (con filtros)
├── gestor-privado.html     # Panel privado de gestión de contenido (no indexado)
│
├── css/
│   └── style.css           # Sistema de estilos completo, variables, layout y componentes
│
├── js/
│   ├── main.js             # Lógica JS: Menú hamburguesa, Scroll Snap, Filtros, Lightbox
│   └── fileStore.js        # Almacenamiento de archivos en IndexedDB del navegador
│
└── assets/                 # Recursos gráficos generados
    ├── profile_avatar.png     # Avatar steampunk de Jhonsons
    ├── art_piece_1.png        # Ilustración "Clockwork Wings"
    ├── art_piece_2.png        # Ilustración técnica "Chronos Watch"
    ├── project_thumbnail_1.png # UI "Aether Console"
    ├── project_thumbnail_2.png # Captura del juego "Aetherian Odyssey"
    └── xx.png                 # Arte conceptual adicional
```

---

## ⚙️ 4. Lógica e Interacciones Implementadas

1. **Navegación y Scroll Snap Diferenciado (`js/main.js` & `css/style.css`):**
   - **Escritorio (> 900px):** Conserva el motor de Scroll Snap por segmentos con animación suave (`850ms`), interceptando la rueda del ratón (`wheel`) y ajustándose a `100vh` por sección.
   - **Móviles (<= 900px):** Desplazamiento vertical natural y fluido (sin bloqueo por segmentos ni intercepción táctil `touchmove`), permitiendo visualizar todo el contenido sin recortes de pantalla.
   - **Highlight de navegación en móviles:** Uso de `IntersectionObserver` para actualizar los enlaces activos (`.active`) en el menú conforme el usuario desliza naturalmente.

2. **Menú Hamburguesa Responsivo (`js/main.js`):**
   - Animación de transformación en cruz (`.burger-toggle`).
   - Despliegue de menú lateral en pantallas móviles.
   - Cierre automático al pulsar cualquier enlace.

3. **Sistema de Filtros en Proyectos (`proyectos.html` & `js/main.js`):**
   - Pestañas con dataset (`data-filter="all|web|game"`).
   - Filtrado dinámico de tarjetas con animación de aparición (`fadeIn`).

4. **Formulario de Contacto Interactivo (`index.html`):**
   - Labels flotantes animadas.
   - Simulación de envío con cambio de estado en botón (`ENVIANDO...` ➔ `¡MENSAJE ENVIADO!`).
   - Botón directo de WhatsApp para contacto inmediato.

5. **Visor de PDF e Imágenes Interactivo (Lightbox) (`js/main.js` & `css/style.css`):**
   - Modal con fondo negro translúcido (`rgba(5, 5, 8, 0.88)` + backdrop blur).
   - Renderizado dinámico de archivos PDF en canvas mediante PDF.js y scroll continuo vertical con scrollbar al **lado izquierdo**.
   - Barra de herramientas derecha: Zoom deslizante (100%-300%), modo manito de arrastre (`grab`/`grabbing`), navegación de páginas (que se deshabilita al hacer zoom), y menú de redes sociales (WhatsApp, X, Facebook, Instagram).
   - Reemplazo de etiquetas de botones a `"Ver"`.

6. **Gestor Privado de Carga de Archivos (`gestor-privado.html` & `js/fileStore.js`):**
   - Página privada no enlazada en navegación y protegida con `<meta name="robots" content="noindex, nofollow">`.
   - **Tarjetas de Destino de Publicación** ubicadas entre el título de administración y el gestor de carga. Cada tarjeta representa una sección independiente (Portafolio / Proyectos) con selección visual activa.
   - Cada tarjeta de destino incluye un **botón "Gestionar Archivos"** que abre un modal para listar y eliminar archivos publicados de esa sección, borrando de forma segura los datos de IndexedDB y localStorage.
   - **Área Drag & Drop** para subir PDFs e imágenes principales, además de un control dedicado para subir una imagen de miniatura.
   - **Variable global `globalMainFile`:** Almacena la referencia al archivo seleccionado/arrastrado para evitar problemas de seguridad del navegador con `fileInput.files` en drag & drop.
   - Guardado local automático de archivos en **IndexedDB** del navegador, permitiendo persistencia y carga instantánea sin mover archivos manualmente a `assets/`.
   - **Botón "Publicar Directamente en Página":** Guarda el archivo en IndexedDB, crea la tarjeta en localStorage bajo la clave `published_cards_portafolio` o `published_cards_proyectos` según la selección, y muestra un modal de éxito.
   - **Botón "Generar Tarjeta & Código":** Genera HTML copiable para insertar manualmente.
   - Vista previa en tiempo real y generador automático de código HTML para copiar con 1 clic.
   - **Límite de descripción:** Máximo 150 caracteres con indicador visual para mantener la uniformidad de las tarjetas.
   - **Historial de subidas recientes** con botón "Limpiar" para eliminar el historial sin afectar las tarjetas publicadas.
   - **Modal de éxito** (`#successModal`): Ventana emergente con icono verde de confirmación, mensaje detallado y enlace directo a la página donde se publicó la tarjeta. Al cerrar, resetea el formulario para una nueva carga.

7. **Inyección Dinámica de Tarjetas Publicadas:**
   - **`portafolio.html`:** Script al final del body que lee `published_cards_portafolio` de localStorage, genera HTML con clases `behance-card`, `behance-media`, `behance-info`, `behance-tag`, y carga las imágenes desde IndexedDB vía `window.FileStore.loadFileAsURL()`.
   - **`proyectos.html`:** Script equivalente que lee `published_cards_proyectos` y genera HTML con clases `project-card`, `project-thumbnail`, `project-details`, `project-badge`, `project-description`.
   - Ambas páginas incluyen protección contra datos corruptos en localStorage (filtrado de nulls, fallbacks para propiedades faltantes).

---

## 📑 5. Progreso Actual y Estado de Secciones

| Sección / Página | Estado | Descripción |
| :--- | :---: | :--- |
| **Inicio (`index.html`)** | 100% | Hero con avatar animated border, tagline e introducción. |
| **Obras Destacadas (`#galeria`)** | 100% | Grid de 4 artículos destacados con enlaces a Portafolio/Proyectos. |
| **Redes / Transmisión (`#redes`)** | 100% | Tarjetas de TikTok, Instagram, Twitch, Behance y Facebook. |
| **Contacto (`#contactos`)** | 100% | Formulario estilizado y botón directo a WhatsApp. |
| **Galería de Arte (`portafolio.html`)** | 100% | Vista estilo Behance con tags, descripciones, visor PDF interactivo y botones "Ver". |
| **Galería de Proyectos (`proyectos.html`)** | 100% | Grid de proyectos de Software y Videojuegos con filtrado interactivo. |
| **Gestor Privado (`gestor-privado.html`)** | 100% | Panel privado completo con publicación directa, gestión de archivos y modal de éxito. |
| **FileStore (`js/fileStore.js`)** | 100% | Almacenamiento IndexedDB funcional con bug crítico corregido (ver sección 7). |

---

## 🚀 6. Próximos Pasos Recomendados (Roadmap)

- [x] **Visor / Lightbox PDF e Imágenes:** Implementado con zoom, manito de arrastre, desplazamiento a la izquierda y menú compartir.
- [x] **Gestor Privado de Contenidos:** Creado con protección noindex de buscadores y generador de tarjetas.
- [x] **Publicación Directa:** Botón funcional para publicar tarjetas directamente en Portafolio o Proyectos desde el gestor.
- [x] **Modal de Éxito:** Ventana emergente de confirmación tras publicar exitosamente.
- [x] **Gestión de Archivos:** Modal para eliminar archivos publicados por sección.
- [x] **Historial con Limpieza:** Botón para limpiar historial de subidas recientes.
- [x] **Tarjetas uniformes:** Descripciones limitadas a 150 caracteres y `line-clamp` en CSS.
- [ ] **Integración Real del Formulario:** Conectar el formulario de contacto con un servicio backend como Formspree o EmailJS para recibir correos reales.
- [ ] **Añadir más Proyectos/Obras:** Expandir el catálogo visual con nuevos proyectos desarrollados en Godot o documentos PDF reales.
- [ ] **Despliegue a GitHub Pages:** Publicar los cambios en `https://nobardev.github.io/`.

---

## 🐛 7. Bugs Corregidos y Lecciones Aprendidas

### Bug Crítico: `TransactionInactiveError` en `fileStore.js` (2026-07-25)
**Síntoma:** El botón "Publicar Directamente en Página" no hacía nada. No aparecía ni el modal de éxito ni la tarjeta en la página destino.

**Causa Raíz:** En la función `saveFile()` de `js/fileStore.js`, se abría una transacción de IndexedDB y luego se iniciaba un `FileReader.readAsArrayBuffer()` (asíncrono). Para cuando el `reader.onload` disparaba, la transacción de IndexedDB ya se había cerrado automáticamente (las transacciones se cierran cuando no hay más operaciones síncronas pendientes).

**Error en consola:**
```
Uncaught TransactionInactiveError: Failed to execute 'put' on 'IDBObjectStore': The transaction has finished.
    at reader.onload (fileStore.js:48:31)
```

**Solución:** Reestructurar `saveFile()` para primero leer el archivo completo con `FileReader` (usando `await` + Promise), y solo después abrir la transacción de IndexedDB para guardar los datos. Así la transacción nunca se cierra prematuramente.

**Código corregido (patrón correcto):**
```javascript
async function saveFile(id, file, fileName) {
    // 1. Leer el archivo PRIMERO (asíncrono)
    const arrayBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });

    // 2. DESPUÉS abrir la transacción y guardar (síncrono dentro de la transacción)
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put({ id, data: arrayBuffer, name: fileName, ... });
        req.onsuccess = () => resolve(id);
        req.onerror = () => reject(req.error);
    });
}
```

### Bug: Clases CSS incorrectas en inyección dinámica de `proyectos.html`
Las tarjetas publicadas en Proyectos usaban clases que no existían en `style.css` (ej: `.project-img-container`, `.project-info`, `.project-desc`). Se corrigieron a las clases correctas: `.project-thumbnail`, `.project-details`, `.project-description`, `.project-badge`.

### Bug: Drag & Drop no adjuntaba archivo al `<input type="file">`
Algunos navegadores bloquean `fileInput.files = e.dataTransfer.files` por seguridad. Se resolvió guardando el archivo arrastrado en una variable global `globalMainFile` que se usa directamente en la lógica de publicación, sin depender del `fileInput.files`.

---

## 🔧 8. Notas Técnicas Importantes

### Almacenamiento de Datos
- **localStorage** se usa para:
  - `published_cards_portafolio` — Array de objetos con metadata de tarjetas publicadas en Portafolio.
  - `published_cards_proyectos` — Array de objetos con metadata de tarjetas publicadas en Proyectos.
  - `uploaded_portfolio_items` — Historial de todas las subidas (publicadas y solo código).
- **IndexedDB** (`PortfolioFilesDB`, store `files`) se usa para almacenar los archivos binarios (PDFs e imágenes) con claves tipo `file_<timestamp>` y `thumb_<timestamp>`.

### Independencia de Secciones
Las secciones Portafolio y Proyectos son **100% independientes**:
- Cada una tiene su propia clave de localStorage (`published_cards_portafolio` vs `published_cards_proyectos`).
- Cada página lee solo su propia clave al inyectar tarjetas.
- La selección de destino se controla con el `<input type="hidden" id="itemCategory">` que se actualiza al hacer clic en las tarjetas de destino.

### Depuración del Botón Publicar
El handler del botón "Publicar Directamente" incluye `console.log` con prefijo `[PUBLISH]` en cada paso para facilitar depuración futura:
- `[PUBLISH] Botón clickeado`
- `[PUBLISH] Datos: { title, tags, desc, category, hasFile }`
- `[PUBLISH] Archivo principal guardado en IndexedDB`
- `[PUBLISH] Guardado en localStorage key: ...`
- `[PUBLISH] Modal de éxito mostrado`

---

### Actualización Arquitectónica (2026-08-06)
- **Migración a GitHub API:** Se reemplazó el uso local de `localStorage` e `IndexedDB` por un archivo centralizado `data/publicaciones.json` gestionado a través de la API de GitHub (`githubApi.js`). Ahora el Gestor sube los archivos e imágenes directamente a la nube y actualiza el JSON remoto.
- **Modo Edición en Gestor:** Se implementó la capacidad de modificar tarjetas publicadas (cambiar imágenes, mantener imágenes anteriores si no se sube nada nuevo, editar títulos, mover entre categorías).
- **Sincronización Local Inteligente (Desarrollo sin conexión al repositorio en tiempo real):**
  - **Sincronización de Datos:** El Gestor guarda una caché en `localStorage` (`local_sync_publicaciones`) después de subir a GitHub. Las páginas leen esta caché al correr en `127.0.0.1` para reflejar los cambios instantáneamente sin necesidad de hacer `git pull`.
  - **Fallback Inyección de Imágenes (404):** Dado que las nuevas miniaturas se suben directo a GitHub, estas devuelven 404 en el entorno local. Se programó un evento `onerror` en el HTML que detecta cuando falla la carga local y extrae la imagen dinámicamente de `raw.githubusercontent.com`.

---

*Archivo de memoria actualizado para garantizar continuidad sin pérdida de contexto.*
