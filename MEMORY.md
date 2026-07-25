# MEMORY.md - Registro de Progreso y Memoria del Proyecto

**Proyecto:** Portafolio Multidisciplinario de Jhonsons González  
**Repositorio / Rama:** `NobarDev/NobarDev.github.io`  
**Última actualización:** 2026-07-23  

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
├── index.html          # Landing Page principal con scroll-snap de 4 secciones
├── portafolio.html     # Galería estilo Behance para Arte e Ilustración Digital
├── proyectos.html      # Catálogo interactivo de Software y Videojuegos (con filtros)
│
├── css/
│   └── style.css       # Sistema de estilos completo, variables, layout y componentes
│
├── js/
│   └── main.js         # Lógica JS: Menú hamburguesa, Scroll Snap suave, Filtros y Formulario
│
└── assets/             # Recursos gráficos generados
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

6. **Gestor Privado de Carga de Archivos (`gestor-privado.html`):**
   - Página privada no enlazada en navegación y protegida con `<meta name="robots" content="noindex, nofollow">`.
   - Área Drag & Drop para subir PDFs e imágenes.
   - Vista previa en tiempo real y generador automático de código HTML para copiar con 1 clic.

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
| **Gestor Privado (`gestor-privado.html`)** | 100% | Panel privado para subir PDFs/imágenes y generar tarjetas HTML sin indexación de Google. |

---

## 🚀 6. Próximos Pasos Recomendados (Roadmap)

- [x] **Visor / Lightbox PDF e Imágenes:** Implementado con zoom, manito de arrastre, desplazamiento a la izquierda y menú compartir.
- [x] **Gestor Privado de Contenidos:** Creado con protección noindex de buscadores y generador de tarjetas.
- [ ] **Integración Real del Formulario:** Conectar el formulario de contacto con un servicio backend como Formspree o EmailJS para recibir correos reales.
- [ ] **Añadir más Proyectos/Obras:** Expandir el catálogo visual con nuevos proyectos desarrollados en Godot o documentos PDF reales.
- [ ] **Despliegue a GitHub Pages:** Publicar los cambios en `https://nobardev.github.io/`.

---

*Archivo de memoria actualizado para garantizar continuidad sin pérdida de contexto.*

