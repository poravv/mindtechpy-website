# MindTechPy Web

Sitio web de MindTechPy con doble experiencia: Modo Clásico (HTML básico) y Modo Moderno (UI profesional con SCSS), navegación por pestañas y diseño responsivo.

## Requisitos

- Node.js ≥ 14
- npm ≥ 6

## Instalación

```bash
# Clonar
git clone [URL_DEL_REPOSITORIO]
cd web-mindtdchpy

# Dependencias
npm install
```

## Desarrollo

```bash
# Inicia el servidor de desarrollo (Express)
npm run dev  # http://localhost:3000
```

- El servidor sirve el build desde `dist/` y los estáticos desde `public/`.
- Para ver cambios de estilos/JS, ejecuta el build en otra terminal:

```bash
npm run build:dev  # compila con webpack en modo desarrollo
```

## Build de producción

```bash
npm run build  # genera /dist
npm run start  # sirve en http://localhost:3000
```

## Estructura relevante

- `src/pages/index.html` → Página única con pestañas (Inicio, Soluciones, Tecnologías, Precios, Empresa, Contacto)
- `src/pages/index.js`   → Lógica (modo clásico/moderno, tabs por hash, menú móvil, notificación clásica)
- `src/styles/main.scss` → Estilos del modo moderno (paleta, navbar, footer, botones, cards, tipografías)
- `src/infrastructure/server.js` → Express para servir `dist/` y estáticos
- `public/images/` → Logos e imágenes (favicon incluido)

Notas:
- Se eliminaron páginas antiguas; todo vive en `index.html` con pestañas por hash.
- El proyecto usa un único SCSS (`src/styles/main.scss`) en lugar de hojas unificadas antiguas.

## Experiencias de uso

- Modo Clásico (por defecto)
  - HTML simple sin estilos. Al abrir, muestra una notificación (10s, cerrable) invitando a activar el Modo Moderno.
  - Tipografía monoespaciada global para legibilidad técnica.
- Modo Moderno
  - Activable desde el botón “Modo Moderno” (navbar desktop) o dentro del menú (móvil). Persistencia en `localStorage`.
  - Tipografía Inter (Google Fonts), navbar oscuro con degradado, botones con degradado, footer mejorado y tarjetas responsivas.
  - Pestañas por hash con animación suave y realce de link activo en el navbar.

## Componentes de UI

- Navbar: oscuro, con menú hamburguesa en móvil. El link activo cambia de color.
- Footer: layout auto‑fit en columnas (Soluciones, Empresa, Conocimientos, Contacto, Legal).
- Botones: `WhatsApp` y `Llamar` con degradados acordes al navbar.
- Tecnologías: grilla + tira de logos en `/images/tech`.
- Favicon: configurado con `/images/mindtechpy-logo.png`.

## Personalización rápida

- Colores/paleta: editar `src/styles/main.scss` (variables al inicio + bloques navbar/footer/botones).
- Tipografías: `src/pages/index.html` (link a Inter) y `src/styles/main.scss` (familias de cada modo).
- Tabs/contenidos: secciones `#tab-*` en `src/pages/index.html`.
- Notificación del modo clásico: función `createClassicNotice()` en `src/pages/index.js`.

## Accesibilidad y responsive

- Pestañas accesibles por hash, `aria-current` en el enlace activo.
- Menú móvil con `aria-expanded` y animación de paneles.
- Grillas responsivas (cards y footer) con auto‑fit.

## Licencia

Pendiente/privada según el repositorio.
