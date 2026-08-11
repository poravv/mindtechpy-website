# 🚀 SPECIFICATION & DESIGN BLUEPRINT: MINDTECHPY V3.0
## Template Oficial para Sitio Web Corporativo de Empresa de Tecnología & Staff Augmentation

> **Documento de Arquitectura de Diseño, Estructura de UI/UX, Stack Tecnológico y Estrategia de Contenidos para la Nueva Versión de MindTechPy**
> 
> *Ubicación del archivo:* `docs/template-mindtechpy-v3.md`  
> *Versión:* 3.0.0-NEXT  
> *Estado:* Especificación Oficial de Producción  
> *Target:* Paraguay, Latinoamérica y Mercado Nearshore US  

---

## 📐 1. RESUMEN EJECUTIVO Y OBJETIVOS

MindTechPy v3.0 es una evolución estratégica de la plataforma digital corporativa de MindTechPy. Diseñada bajo estándares de **agencia Awwwards / Tier-1 Tech (estilo Linear, Vercel, Apple Enterprise)**, esta nueva versión tiene como propósito posicionar a MindTechPy no solo como una software house regional, sino como un **partner de ingeniería de software de alto rendimiento, Staff Augmentation con respaldo técnico continuo y desarrollo de productos impulsados por IA**.

### Objetivos Principales:
1. **Conversión B2B Maximizada**: Generación de leads cualificados para Staff Augmentation y Desarrollo a Medida con tiempos de respuesta < 48h.
2. **Exhibición de Productos Propios (SaaS)**: Destacar las soluciones paquetizadas (`WhatsApp Sender Pro`, `SMS Sender Pro`, `FacturaIA / Lectura de Facturas con IA`).
3. **Captación de Talento TI de Élite**: Portal interactivo ("Trabaja con Nosotros") con proceso de selección transparente de 3 pasos.
4. **Diseño Visual Ultra-Premium (Anti-Slop)**: Cero plantillas genéricas. Sistema visual basado en micro-interacciones hápticas, contenedores de doble bisel (Doppelrand), degradados mesh oscuros y tipografía geométrica refinada.

---

## 🎨 2. SISTEMA DE DISEÑO VISUAL & IDENTIDAD (BRAND KIT V3)

### 2.1 Arquetipo Visual: *Ethereal Hardware & Kinetic Dark Tech*
El concepto estético fusiona la elegancia del hardware industrial moderno con la fluidez del software en la nube. La interfaz transmite solidez, seguridad bancaria/enterprise y aceleración tecnológica.

```
       ┌─────────────────────────────────────────────────────────────┐
       │   COLOR SYSTEM (OLED Dark Base + Vibrant Tech Accents)      │
       ├─────────────────────────────────────────────────────────────┤
       │  Primary Navy/Black   : #050914 (Espacio Vantablack)        │
       │  Surface Dark         : #0C1327 (Tarjeta / Doble Bisel)     │
       │  Cyan Pulse (Accent 1): #00F0FF (Tecnología, IA, Micro-glow)  │
       │  Electric Blue (Main) : #2563EB (Botones Primarios, CTAs)   │
       │  Cyber Crimson (Hot)  : #FF3B5C (Highlights, Badges, ROI)   │
       │  Titanium Light Text  : #F8FAFC (Headings & H1)             │
       │  Muted Slate Text     : #94A3B8 (Subtítulos & Body Copy)    │
       └─────────────────────────────────────────────────────────────┘
```

### 2.2 Tipografía Recomendada
- **Display & Headings**: `Geist Display` / `Plus Jakarta Sans` / `Clash Display` (Tracking tight: `-0.025em`, font-weight: 700/800).
- **Body & Microcopy**: `Geist Sans` / `Inter Tight` (Line-height: 1.6, tracking: `-0.011em`).
- **Code & Tech Tokens**: `JetBrains Mono` / `Fira Code` (Para fragments de API, integraciones y badges de stack).

### 2.3 Regla del Doble Bisel (*Doppelrand Architecture*)
Ningún contenedor ni card descansa de forma plana. Todos los componentes principales aplican la arquitectura de bisel anidado:
- **Outer Shell**: `div` contenedor con `background: rgba(255,255,255,0.03)`, `border: 1px solid rgba(255,255,255,0.08)`, `padding: 8px`, `border-radius: 24px`.
- **Inner Core**: `div` interno con `background: #0C1327`, `border-radius: calc(24px - 8px) = 16px`, `box-shadow: inset 0 1px 1px rgba(255,255,255,0.1)`.

---

## 🏗️ 3. ARQUITECTURA DE INFORMACIÓN Y NAVEGACIÓN

El sitio se estructura en un **Single-Page Application (SPA) Híbrido** con landing continuo, animación por scroll (GSAP / IntersectionObserver) y modales / sub-páginas dedicadas para postulación de talento y calculadora de propuestas.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. HEADER (Sticky Floating Glass Island + Theme & Regional Toggle + CTA)     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. HERO SECTION (Canvas Interactivo + Propuesta Valor Dual + CTAs B2B/Talent)│
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. METRIC & TRUST STRIP (Estadísticas en Vivo + SLA 48h + Marquee Tech Stack)│
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. BENTO GRID: SERVICIOS CORE                                               │
│    ├── Staff Augmentation TI (Calculadora de Perfiles + Respaldo Técnico)   │
│    ├── Desarrollo de Software a Medida (Web, Flutter, APIs, Cloud)          │
│    ├── Cloud, DevOps & Kubernetes (CI/CD, Observabilidad, Costos Cloud)     │
│    └── IA & Automatización de Procesos (LLM, Lectura Inteligente)           │
├─────────────────────────────────────────────────────────────────────────────┤
│ 5. PRODUCTOS PROPIOS / ECOSYSTEM SHOWCASE                                   │
│    ├── WhatsApp Sender Pro (Suscripción Enterprise, Redis, MinIO, Keycloak)  │
│    ├── SMS Sender Pro (Módems USB array, Garantía Offline)                  │
│    └── FacturaIA (Extracción Inteligente de Facturas XML/PDF con GPT-4o)     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 6. ARQUITECTURA & GARANTÍAS DE SEGURIDAD (NDA, Facturación PY, ISO/GDPR)    │
├─────────────────────────────────────────────────────────────────────────────┤
│ 7. PORTAL DE TALENTO ("TRABAJA CON NOSOTROS") (Proceso de 3 pasos, Vacantes) │
├─────────────────────────────────────────────────────────────────────────────┤
│ 8. CALCULADORA DE PROPUESTAS & FORMULARIO DE CONTACTO INTERACTIVO            │
├─────────────────────────────────────────────────────────────────────────────┤
│ 9. FOOTER ENTERPRISE (Enlaces legales, DPO, Mapa del sitio, Redes)           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📑 4. DESGLOSE DETALLADO SECCIÓN POR SECCIÓN

---

### SECCIÓN 1: HEADER & NAVEGACIÓN FLOTANTE (`Navbar Island`)
- **Estilo Visual**: Cápsula flotante despegada del borde superior (`margin-top: 1.5rem`), fondo de cristal pulido (`backdrop-filter: blur(20px)`, `bg: rgba(5, 9, 20, 0.75)`), bordes con micro-brillo.
- **Componentes**:
  1. **Brand Logo**: Logo MindTechPy vectorial con isotipo reactivo (efecto cian al pasar el cursor).
  2. **Links de Navegación**: `Soluciones`, `Staff Augmentation`, `Productos`, `Seguridad`, `Talento`, `Precios`.
  3. **Live Indicator**: Badge pulsante verde `🟢 SLA Disponible < 48h`.
  4. **CTA Button**: "Solicitar Cotización ↗" (Botón píldora con icono nested en círculo interno).
  5. **Mobile View**: Botón hamburguesa con transformación morfológica fluida a 'X' y desplegable modal full-screen con blur.

---

### SECCIÓN 2: HERO SECTION (`Interactive Canvas & Value Prop`)
- **Headline (H1)**:
  > *"Ingeniería de Software de Alto Nivel & Talento TI con Respaldo Técnico Continuo."*
- **Sub-headline**:
  > "Escalá tu capacidad tecnológica en Latinoamérica sin aumentar tu estructura interna. Integramos desarrolladores, DevOps e Inteligencia Artificial con contrato, NDA y garantía legal."
- **Visuales de Impacto**:
  - Fondo con malla tridimensional interactiva o canvas de partículas sutiles (WebGPU / Three.js ligero).
  - Tarjeta flotante interactiva con simulación de terminal/código en vivo mostrando el proceso de despliegue de un profesional asignado por MindTechPy.
- **CTAs Primarios (Dual Target)**:
  - **CTA Cliente**: `[ Construir mi Equipo TI ↗ ]` (Abre modal de solicitud express).
  - **CTA Talento**: `[ Sumarme como Desarrollador/a ]` (Scroll directo a sección Empleos).

---

### SECCIÓN 3: CINTA DE CONFIANZA & STACK TECNOLÓGICO (`Trust & Tech Pulse`)
- **Métricas Clave (Animated Counter)**:
  - `+98%` Retención de Talento en Clientes
  - `< 48 hrs` Tiempo Promedio de Asignación de Perfiles TI
  - `100%` Cumplimiento Legal y Facturación Local en Paraguay y LatAm
  - `99.9%` Uptime en Sistemas en Producción Gestionados
- **Marquee Interactivo de Tecnologías**:
  - Grilla continua con movimiento suave mostrando tecnologías dominadas:  
    `Node.js`, `Python`, `Flutter`, `React / Next.js`, `Spring Boot`, `Kubernetes`, `Docker`, `FastAPI`, `OpenAI API`, `Keycloak`, `Redis`, `MinIO`, `PostgreSQL`, `MongoDB`, `GitHub Actions`.
  - **Efecto Hover**: Filtro desaturado se convierte en color orgánico brillante con tooltip que indica los casos de uso internos de esa tecnología.

---

### SECCIÓN 4: BENTO GRID DE SERVICIOS CORE (`Services Ecosystem`)

Disposición en **CSS Grid Asimétrico** de 4 tarjetas principales con Doble Bisel:

```
┌──────────────────────────────────────────────┬──────────────────────────────────────────────┐
│  CARD 1 (Span 8): STAFF AUGMENTATION TI      │  CARD 2 (Span 4): SOFTWARE A MEDIDA          │
│  - Selección, onboarding y respaldo técnico. │  - Web, Mobile (Flutter), APIs Core.         │
│  - Simulador interactivo de roles/stacks.    │  - Arquitectura escalable y mantenible.      │
├──────────────────────────────────────────────┼──────────────────────────────────────────────┤
│  CARD 3 (Span 4): CLOUD, DEVOPS & K8S        │  CARD 4 (Span 8): IA & AUTOMATIZACIÓN        │
│  - CI/CD, Docker, Observabilidad, Costos.    │  - Integración de LLMs, Procesamiento doc.   │
│  - Optimización de infraestructura.          │  - Lectura inteligente de facturas y OCR.    │
└──────────────────────────────────────────────┴──────────────────────────────────────────────┘
```

#### Detalle de Tarjeta 1: Staff Augmentation TI (Hero Feature)
- **Título**: Staff Augmentation con Acompañamiento Técnico Real.
- **Diferenciador Clave**: A diferencia de consultoras tradicionales donde el desarrollador queda solo, MindTechPy asigna un **Líder Técnico Senior** de respaldo que supervisa la calidad del código, apoya en bloqueos de arquitectura y garantiza el rendimiento del profesional sin costo extra para el cliente.
- **Beneficios**:
  - ✅ Sin costos de reclutamiento ni cargas laborales directas.
  - ✅ Política de reemplazo garantizada en < 5 días si no encaja con la cultura.
  - ✅ Zona horaria alineada con LatAm y Estados Unidos (GMT-3 / EST).

---

### SECCIÓN 5: PRODUCTOS PROPIOS / ECOSYSTEM SHOWCASE (`Proprietary SaaS Solutions`)

Sección dedicada a mostrar el portafolio de software empaquetado de la empresa:

#### 1. 💬 WhatsApp Sender Pro
- **Modelo**: Suscripción Mensual Enterprise.
- **Stack**: Node.js, Express, Redis, MinIO, Keycloak, Frontend Web Vanilla.
- **Propuesta de Valor**: Automatización masiva de campañas con envíos programados, segmentación avanzada, multimedia (PDF, imágenes, audios), autenticación Keycloak de alta seguridad y tableros en tiempo real.
- **Live Demo Visual**: Componente interactivo que simula el envío y reporte de lectura de un mensaje masivo.

#### 2. 📱 SMS Sender Pro (Hardware + Software)
- **Modelo**: Contrato & Licencia Anual.
- **Stack**: Node.js, Express, Hardware Array (Módems USB Físicos).
- **Propuesta de Valor**: Sistema independiente de mensajería masiva SMS por hardware para empresas con requerimientos de alta disponibilidad offline o notificaciones críticas fuera de internet.

#### 3. 📄 FacturaIA (Lectura Automática de Facturas con IA)
- **Modelo**: Licencia por uso / Procesamiento por lote.
- **Stack**: Python, OpenAI GPT-4o, FastAPI, Angular, OCR, XML Parser.
- **Propuesta de Valor**: Procesamiento automático e inteligente de facturas electrónicas (PDF, XML, imágenes escaneadas) enviadas por IMAP/SMTP o carpetas compartidas. Extrae tributos, RUC, ítems y exporta directo a sistemas contables/Excel.

---

### SECCIÓN 6: SEGURIDAD, CONTRATOS & COBERTURA LEGAL (`Enterprise Compliance`)
- **Respaldo Legal**: Facturación legal en Paraguay, contratos normados bajo leyes locales e internacionales, convenios de confidencialidad (NDA) desde el primer contacto.
- **Arquitectura de Seguridad**:
  - Control de accesos con Keycloak / OAuth2 / OIDC.
  - Despliegues contenerizados aislados (Docker / Kubernetes namespaces).
  - Cumplimiento de mejores prácticas GDPR y protección de datos personales.

---

### SECCIÓN 7: PORTAL DE TALENTO (`Trabaja con Nosotros`)
Diseñado para atraer a los mejores desarrolladores de Paraguay y LatAm.

- **Filosofía**: *"Proceso humano, transparente y sin pruebas eternas de 4 semanas."*
- **El Proceso en 3 Pasos**:
  1. **Postulación Simple**: Envío de CV / LinkedIn y stack principal.
  2. **Charla Técnica (45 min)**: Conversación de igual a igual con un Lead Dev.
  3. **Ejercicio Acotado Remunerado / Feedback Concreto**: Devolución clara en 48 horas.
- **Listado de Vacantes Activas (Dynamic Cards)**:
  - Backend Engineer (Node.js / Python)
  - Frontend Developer (React / Next.js)
  - Flutter Mobile Engineer
  - DevOps & SRE Specialist (Kubernetes / Docker)
  - QA Automation Engineer (Playwright / Cypress)

---

### SECCIÓN 8: CALCULADORA DE PROPUESTAS & FORMULARIO INTERACTIVO (`Proposal Engine`)
Un componente dinámico donde el cliente puede armar su paquete preliminar:

1. **Paso 1: Seleccionar Tipo de Servicio** (Staff Augmentation / Desarrollo a Medida / Productos SaaS / Cloud).
2. **Paso 2: Especificar Perfiles o Tecnologías** (ej: 2 Backend Node.js + 1 DevOps).
3. **Paso 3: Estimación Instantánea de Tiempo y SLA de Asignación**.
4. **Paso 4: Envío Directo**: Formulario con validación en tiempo real que envía la solicitud a ventas y dispara un mensaje directo a WhatsApp con el resumen de requerimientos.

---

### SECCIÓN 9: FOOTER ENTERPRISE (`Footer Architecture`)
- **Columna 1**: Isotipo MindTechPy, eslogan corporativo, información de registro comercial Asunción, Paraguay.
- **Columna 2 (Servicios)**: Staff Augmentation, Software a Medida, Cloud/DevOps, IA.
- **Columna 3 (Productos)**: WhatsApp Sender Pro, SMS Sender Pro, FacturaIA.
- **Columna 4 (Legal & Contacto)**: Términos de Servicio, Política de Privacidad, Soporte WhatsApp (`+595 981 586823`), Email (`andres.vera@mindtechpy.net`).
- **Barra Inferior**: © 2026 MindTechPy. Todos los derechos reservados. Made with precision in Asunción.

---

## 💻 5. RECOMENDACIÓN DE STACK TÉCNICO DE IMPLEMENTACIÓN

Para garantizar una puntuación **Lighthouse de 95+** y mantener el proyecto altamente mantenible:

| Capa | Tecnología Recomendada | Alternativa Ultra-Ligera |
|---|---|---|
| **Framework Web** | Next.js 14+ (App Router, Server Components) | Vite + React 18 / Vanilla Webpack + Express |
| **Estilos & UI** | Vanilla CSS / SCSS Modular + CSS Variables | Tailwind CSS v3/v4 con tokens personalizados |
| **Animaciones & Motion** | GSAP (ScrollTrigger) + Framer Motion | CSS Animations + IntersectionObserver API |
| **Backend / API Server** | Node.js (Express / Fastify) | Python FastAPI / Next.js Server Actions |
| **Persistencia / Métricas** | PostgreSQL / Redis / Local JSON Storage | Firebase / Supabase |
| **Autenticación SaaS** | Keycloak | Auth0 / NextAuth |

---

## 📱 6. ESPECIFICACIÓN RESPONSIVE & MOBILE COLLAPSE

- **Desktop (>1024px)**: Grillas asimétricas (Bento), navegación flotante completa, fondos animados canvas interactivos.
- **Tablet (768px - 1023px)**: Grillas de 2 columnas, espaciados ajustados (`py-16`), navegación flotante compacta.
- **Móvil (<768px)**:
  - Conversión total a columna única (`grid-cols-1`, `w-full`, `px-4`).
  - Eliminación de hovers complejos; sustitución por toques hápticos y estados `:active`.
  - Sustitución de canvas pesados por gradientes CSS GPU-accelerated.
  - Botones principales en `width: 100%` para fácil interacción con el pulgar.
  - Uso estricto de `min-height: 100dvh` para evitar saltos de pantalla en iOS Safari.

---

## 🚀 7. CHECKLIST DE CALIDAD Y LANZAMIENTO (PRE-FLIGHT)

- [ ] **Rendimiento**: Carga de imágenes en formato WebP/AVIF con `loading="lazy"`.
- [ ] **SEO Técnico**: Title y Meta Description únicos, Open Graph tags para WhatsApp/LinkedIn, Canonical URL y Schema.org `Organization`.
- [ ] **Accesibilidad (a11y)**: Cumplimiento WCAG 2.1 AA, ratio de contraste > 4.5:1, etiquetas ARIA en navegación y modales.
- [ ] **Legalidad**: Textos de Términos y Condiciones y Política de Privacidad actualizados para Paraguay y LatAm.
- [ ] **Captura de Leads**: Integración funcional de formularios con alerta inmediata vía WhatsApp/Email al equipo comercial.

---
*MindTechPy © 2026 — Documentación Técnica de Plantilla Corporativa v3.0*
