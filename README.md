# MindTechPy Web

Sitio web corporativo de MindTechPy con **doble experiencia visual**: 

- **Modo Clásico**: Diseño retro/vintage elaborado con tipografía serifada, paleta tierra/dorada y ornamentos clásicos
- **Modo Moderno**: UI contemporánea con gradientes, animaciones suaves, paleta azul profundo + turquesa + coral

Incluye navegación por pestañas, diseño completamente responsivo y contenido detallado de servicios empresariales.

---

## 🎨 Características Principales

### Dos Experiencias Visuales

**Modo Clásico (CSS puro)**
- Estilo retro profesional inspirado en sitios web de los años 90-2000
- Tipografía Georgia/serif con ornamentos decorativos (✦, ❖)
- Paleta: tonos tierra (#8b7355), dorado (#d4af37), azul marino (#1a4d7a)
- Bordes dobles, sombras suaves y efectos de papel antiguo
- Notificación vintage con animación de entrada

**Modo Moderno (SCSS + animaciones)**
- Diseño contemporáneo con gradientes dinámicos
- Paleta: azul profundo (#0f4c81), turquesa (#00a6a6), coral (#ff6b6b)
- Animaciones CSS avanzadas: fadeInUp, slideIn, scaleIn, hover effects
- Tipografía Inter con tracking optimizado (-0.011em)
- Sombras en múltiples niveles (sm/md/lg/xl)
- Header sticky con estado compacto al scroll
- Cards con borde superior colorido y efecto lift

### Contenido Completo

✅ **8 secciones navegables por hash:**
- Inicio (hero, propuesta de valor, resultados medibles)
- Soluciones (WhatsApp, SMS, Facturas, Software a medida)
- Tecnologías (stack completo + logos interactivos)
- Precios (planes detallados, descuentos, garantías)
- Empresa (metodología, arquitectura, seguridad)
- Contacto (canales, proceso comercial, FAQs)
- Términos y Condiciones (completo, GDPR/LGPD)
- Política de Privacidad (detallada, DPO, cookies)

✅ **Descripciones ampliadas:**
- Casos de uso específicos por solución
- Stack tecnológico de cada producto
- ROI y métricas de impacto
- Modelos de contratación flexibles
- Onboarding y capacitación incluida

---

## 📋 Requisitos

- **Node.js** ≥ 14
- **npm** ≥ 6

---

## 🚀 Instalación

```bash
# Clonar repositorio
git clone https://github.com/poravv/mindtechpy-website.git
cd web-mindtdchpy

# Instalar dependencias
npm install
```

---

## 💻 Desarrollo

```bash
# Servidor de desarrollo (Express en puerto 3000)
npm run dev

# En otra terminal: compilar cambios de SCSS/JS
npm run build:dev

# Acceder a:
# http://localhost:3000
```

El servidor sirve:
- Build compilado desde `dist/`
- Estáticos desde `public/` (CSS clásico, imágenes, etc.)

---

## 🏗️ Build de Producción

```bash
# Compilar para producción (minificado)
npm run build

# Servir build en producción
npm start
```

---

## 📁 Estructura del Proyecto

```
web-mindtdchpy/
├── src/
│   ├── pages/
│   │   ├── index.html          # HTML principal con 8 secciones
│   │   └── index.js            # Lógica: toggle modo, tabs, navbar, notificación
│   ├── styles/
│   │   └── main.scss           # Estilos modo moderno (paleta, animaciones, responsive)
│   └── infrastructure/
│       └── server.js           # Express para servir dist/ y public/
├── public/
│   ├── css/
│   │   └── classic-styles.css  # ⭐ Estilos modo clásico (retro/vintage)
│   └── images/
│       ├── mindtechpy-logo.png
│       └── tech/               # Logos de tecnologías
├── dist/                       # Build generado por webpack
├── package.json
├── webpack.config.js
└── README.md
```

---

## 🎯 Cómo Funciona

### Sistema de Temas (Clásico ↔ Moderno)

1. **Por defecto**: Modo Clásico
   - Se carga `public/css/classic-styles.css` (habilitado)
   - HTML sin atributo `data-theme`
   - Muestra notificación vintage invitando a Modo Moderno (12 seg, cerrable)

2. **Al activar Modo Moderno**:
   - Se deshabilita `classic-styles.css`
   - Se añade `data-theme="modern"` al `<html>`
   - Se activan estilos de `main.scss` (compilado en bundle)
   - Persiste en `localStorage`

3. **Botón de toggle**:
   - Desktop: visible en navbar
   - Móvil: dentro del menú hamburguesa (solo en modo moderno)

### Navegación por Pestañas (Hash Routing)

- Cada sección tiene un `id="tab-*"` y `role="tabpanel"`
- Links navbar usan `href="#seccion"`
- JavaScript escucha `hashchange` y muestra/oculta paneles
- Link activo recibe clase `.active` y `aria-current="page"`
- Scroll suave al tope al cambiar de sección

### Responsive

- **Desktop (>768px)**: Navbar horizontal, cards en grid auto-fit
- **Tablet (768px)**: Cards a 2 columnas, texto ajustado
- **Móvil (<768px)**:
  - Menú hamburguesa (solo modo moderno)
  - Cards a 1 columna
  - Botones full-width
  - Footer a 1 columna
  - Logos tech más pequeños (36-40px)

---

## 🎨 Paleta de Colores

### Modo Clásico (classic-styles.css)
```css
--classic-bg: #f5f0e8        /* Fondo papel antiguo */
--classic-paper: #fffef9     /* Blanco marfil */
--classic-border: #8b7355    /* Marrón tierra */
--classic-gold: #d4af37      /* Dorado */
--classic-navy: #1a4d7a      /* Azul marino */
--classic-brown: #5d4037     /* Café oscuro */
```

### Modo Moderno (main.scss)
```scss
$primary: #0f4c81            /* Azul profundo */
$primary-light: #1e6bb8      /* Azul medio */
$secondary: #00a6a6          /* Turquesa */
$accent: #ff6b6b             /* Coral */
$text: #2d3748               /* Gris oscuro */
$bg: #f7fafc                 /* Fondo ultra claro */
```

---

## ✨ Animaciones Implementadas

**Modo Moderno (`main.scss`):**
- `fadeInUp`: Entrada de secciones desde abajo con fade
- `fadeIn`: Aparición suave
- `slideInRight`: Entrada lateral derecha
- `scaleIn`: Zoom in con fade
- `slideInNotice`: Notificación desde abajo con bounce
- Hover effects en cards (lift + sombra)
- Hover effects en logos tech (color + escala)
- Transiciones suaves en navbar (underline animado)

**Modo Clásico (`classic-styles.css`):**
- `slideInClassic`: Notificación desde derecha
- `slideOutClassic`: Salida hacia derecha
- Hover en cards: lift + cambio de borde a dorado
- Hover en tech logos: sepia a full color + rotación

---

## 🔧 Personalización Rápida

### Cambiar colores

**Modo Moderno**: Editar variables en `src/styles/main.scss` (líneas 6-20)
```scss
$primary: #TU_COLOR;
$secondary: #TU_COLOR;
// etc.
```

**Modo Clásico**: Editar `:root` en `public/css/classic-styles.css` (líneas 13-21)
```css
--classic-gold: #TU_COLOR;
--classic-navy: #TU_COLOR;
```

### Agregar nueva sección

1. En `src/pages/index.html`:
```html
<section id="tab-nueva" role="tabpanel" hidden>
  <h2>Nueva Sección</h2>
  <p>Contenido...</p>
</section>
```

2. En `src/pages/index.js`, agregar al mapa:
```javascript
const map = {
  // ... existentes
  nueva: 'tab-nueva'
};
```

3. Agregar link en navbar:
```html
<li><a href="#nueva">Nueva</a></li>
```

---

## 📱 Componentes de UI

### Modo Moderno
- **Navbar**: Sticky con gradiente, estado compacto al scroll, underline animado
- **Botones**: Degradados con efecto brillo al hover (`::before` animado)
- **Cards**: Borde superior tricolor, lift effect, sombras en capas
- **Footer**: Grid responsive, columnas auto-fit, gradiente oscuro
- **Logos tech**: Grilla con filtro grayscale → color al hover

### Modo Clásico
- **Navbar**: Degradado tierra, botones con borde doble, sombras suaves
- **Botones**: Gradiente dorado, efecto relieve con inset shadow
- **Cards**: Borde triple, esquinas decoradas (✦), borde top gradiente
- **Footer**: Mismo grid, gradiente tierra, viñetas ornamentales (▸)
- **Separadores (hr)**: Degradado dorado con símbolo central (❖)

---

## ♿ Accesibilidad

- ✅ Navegación por teclado completa
- ✅ `aria-current="page"` en link activo
- ✅ `aria-expanded` en menú móvil
- ✅ `role="tabpanel"` en secciones
- ✅ `focus-visible` con outline de color brand
- ✅ Contraste WCAG AA+ (>4.5:1 en textos)
- ✅ `prefers-reduced-motion` (desactiva animaciones)
- ✅ Labels en botones de toggle y cierre

---

## 📦 Dependencias Principales

```json
{
  "express": "^4.18.2",
  "webpack": "^5.88.2",
  "sass": "^1.69.5",
  "html-webpack-plugin": "^5.5.3",
  "mini-css-extract-plugin": "^2.7.6"
}
```

---

## 📄 Licencia

Privada — MindTechPy © 2025

---

## 📞 Soporte

- **Email**: andres.vera@mindtechpy.net
- **WhatsApp**: +595 992 756462
- **Ubicación**: Asunción, Paraguay

---

## 🎉 Changelog

### v2.0.0 (Noviembre 2025)

**Nuevas Características:**
- ✨ Modo Clásico elaborado con CSS retro/vintage profesional
- ✨ Paleta de colores moderna (azul profundo + turquesa + coral)
- ✨ Animaciones CSS avanzadas (fadeInUp, slideIn, scaleIn, etc.)
- ✨ 2 nuevas secciones: Términos y Condiciones + Política de Privacidad
- ✨ Contenido expandido en todas las secciones (3x más detalle)
- ✨ Sistema mejorado de notificación clásica con diseño vintage
- ✨ Header sticky con estado compacto al scroll
- ✨ Cards con borde superior tricolor y efectos hover mejorados
- ✨ Logos tecnológicos con filtros grayscale → color
- ✨ Footer rediseñado con gradientes y mejor spacing

**Mejoras de UX:**
- 📱 Responsive mejorado para móviles
- ⚡ Transiciones suaves con cubic-bezier optimizado
- 🎨 Tipografía Inter con tracking ajustado
- 🔍 Mejores contrastes y accesibilidad WCAG AA+
- 📐 Espaciado y jerarquía visual refinados

**Contenido:**
- 📝 Descripciones completas de servicios
- 💰 Planes de precios detallados con tiers
- 📋 Términos legales completos (10+ secciones)
- 🔒 Política de privacidad GDPR/LGPD compliant
- 📊 Métricas de impacto y ROI por solución

---

**¿Necesitas ayuda?** Contacta al equipo de desarrollo.
