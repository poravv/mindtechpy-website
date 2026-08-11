# MindTechPy: Operaciones Visibles

> Propuesta de dirección web corporativa para 2026.
>
> Estado: concepto listo para diseño y desarrollo.

## Lectura de diseño

Landing B2B para decisores de Paraguay y Latinoamérica, con un lenguaje de infraestructura clara y una estética editorial-operativa. La propuesta presenta a MindTechPy como el equipo que convierte necesidades de negocio en sistemas que pueden operar, mantenerse y crecer.

**Diales de diseño:** variación 8/10, movimiento 5/10 y densidad 4/10.

## La idea central

### Operaciones Visibles

La mayoría de los sitios de tecnología muestran promesas abstractas, interfaces ficticias y brillos sin significado. MindTechPy puede tomar una posición distinta: hacer visible el recorrido que une una necesidad con una operación confiable.

El recurso de marca es un único **hilo de ejecución**: una línea violeta sobria que nace en el hero, acompaña las decisiones de producto, atraviesa las capacidades de ingeniería y termina en la conversación comercial. No funciona como decoración. En cada bloque representa una relación real: diagnóstico, construcción, integración, observabilidad u operación.

El resultado debe sentirse preciso, adulto y localmente cercano. No como un laboratorio de IA genérico, sino como una empresa que responde, documenta y entrega.

## Qué cambia respecto al enfoque actual

| Conservar | Renovar |
| --- | --- |
| Logotipo, violeta de marca, oferta de software empresarial, productos propios y cobertura regional. | Una narrativa de catálogo por una historia de ejecución y resultados operativos. |
| Rutas, anclas, formularios, metadatos y contenido legal ya indexado. | El uso de tarjetas repetidas, terminales simuladas, fondos cyberpunk y cifras que no estén respaldadas. |
| Tono técnico en los detalles de la solución. | La primera impresión: más editorial, humana y enfocada en la decisión de negocio. |

## Objetivo de negocio

La página debe ayudar a tres personas a encontrar su próximo paso sin competir entre sí:

1. Un responsable de empresa que necesita software, automatización o soporte técnico.
2. Un líder de tecnología que busca capacidad de ingeniería para un proyecto complejo.
3. Un profesional que evalúa trabajar con MindTechPy.

La prioridad visual y de conversión es la primera. Los otros dos recorridos deben estar disponibles, pero no diluir el mensaje principal.

## Sistema visual

### Paleta

El violeta ya existe en el símbolo de MindTechPy, por eso se conserva como el único color de acento. El resto de la interfaz usa neutros azulados profundos para que la marca se vea propia y no como un gradiente de IA.

| Token | Valor | Uso |
| --- | --- | --- |
| `ink` | `#11131A` | Fondo principal de toda la experiencia oscura. |
| `surface` | `#1A1D27` | Paneles de contenido y navegación. |
| `surface-raised` | `#222633` | Estados hover y elementos interactivos. |
| `line` | `#353A49` | Separadores funcionales y contornos. |
| `paper` | `#F4F2FA` | Titulares y texto de alta prioridad. |
| `muted` | `#B7B5C2` | Texto secundario y anotaciones. |
| `mind-violet` | `#8B7CFF` | CTA, foco, hilo de ejecución y estados activos. |

La página conserva un único tema oscuro de principio a fin. Si se incorpora modo claro en una etapa posterior, será una variante completa del mismo sistema, no una sección clara intercalada dentro de la experiencia oscura.

### Tipografía

- **Titulares:** Outfit, en pesos 600 a 800. Es una evolución natural de la fuente actual, con presencia técnica y expresiva.
- **Lectura:** Manrope o Geist Sans, autoalojada y con `font-display: swap`.
- **Datos y etiquetas técnicas:** IBM Plex Mono, solo para campos de producto, estados y referencias de tecnología.

Los titulares se alinean a la izquierda. Se evita el hero centrado, los textos excesivamente enormes y la combinación decorativa de familias tipográficas.

### Forma y materialidad

- Radio de 16 px en paneles, 10 px en campos, píldora solo para acciones compactas.
- Bordes de 1 px con contraste bajo y sombras violetas muy tenues. Sin brillo exterior neón.
- Espacio amplio, divisores funcionales y composición asimétrica. Las tarjetas aparecen únicamente donde un contenido necesita una interacción o jerarquía real.
- El logotipo se presenta limpio, sin alterar su símbolo ni añadir efectos de iluminación.

## Estructura propuesta

### 1. Navegación: una barra que no distrae

Barra fija de 68 px, con el logo a la izquierda, cuatro rutas principales y una acción única: **Iniciar conversación**. La ruta de talento pasa a un menú secundario o al pie de página para que el foco comercial no se fracture.

Rutas principales: `Servicios`, `Productos`, `Cómo trabajamos`, `Nosotros`.

En móvil, la navegación se abre a pantalla completa con el mismo orden de prioridades. Debe conservar una sola acción principal visible.

### 2. Hero: software que entra en operación

Composición dividida 5/7. A la izquierda, la propuesta de valor; a la derecha, una composición editorial de imágenes reales y artefactos de trabajo. El hilo de ejecución atraviesa ambas mitades y responde con una pequeña transición de entrada.

**Titular propuesto**

> Software que entra en operación.

**Texto de apoyo**

> Diseñamos sistemas, automatizaciones y equipos técnicos para operaciones que necesitan avanzar.

**Acciones**

- Primaria: `Iniciar conversación`
- Secundaria: `Explorar capacidades`

**Dirección de imagen**

Una fotografía horizontal, creada o tomada para la marca, de una sesión de trabajo real: plano cenital de arquitectura, notas, cableado o prototipos físicos y dos personas colaborando. Debe usar la luz violeta solo como detalle de contexto. No usar escritorios genéricos de banco de imágenes, monitores con código ilegible ni dashboards recreados con elementos HTML.

En móvil, el texto va primero. La imagen ocupa todo el ancho debajo de las acciones y mantiene una proporción 4:3.

### 3. Prueba de criterio: de la necesidad a la operación

Una franja inmediatamente debajo del hero explica el hilo de ejecución mediante cuatro verbos, sin números no verificados:

`Entender` → `Diseñar` → `Integrar` → `Acompañar`

Cada verbo revela una frase breve al activarse o al entrar en viewport. La interacción da contexto a la metodología y no requiere un carrusel ni una barra de progreso artificial.

Ejemplos de microcopy:

- **Entender:** Alineamos el problema, los datos y las restricciones antes de elegir tecnología.
- **Diseñar:** Definimos una arquitectura que el equipo pueda mantener.
- **Integrar:** Conectamos productos, procesos y canales sin forzar reemplazos innecesarios.
- **Acompañar:** Medimos, corregimos y evolucionamos el sistema después de la entrega.

En móvil, los cuatro momentos se convierten en una secuencia vertical con el hilo como guía de lectura.

### 4. Capacidades: un mapa, no cuatro tarjetas iguales

El bloque de capacidades usa una cuadrícula asimétrica de cuatro piezas, cada una con un tratamiento visual diferente. El hilo llega a cada capacidad desde la sección anterior, dejando claro que son rutas que parten del mismo proceso.

| Capacidad | Forma | Visual recomendado | Mensaje |
| --- | --- | --- | --- |
| Software a medida | Pieza horizontal dominante | Fotografía de una sesión de diseño o captura real del producto entregado. | Sistemas web, móviles y de integración hechos para el contexto de la empresa. |
| Automatización e IA | Panel vertical | Imagen editorial de documentos, flujos o procesamiento físico. | Convertimos tareas repetitivas en procesos trazables y útiles. |
| Cloud y operación | Panel compacto oscuro | Diagrama real, simplificado y revisado por el equipo técnico. | Despliegues, observabilidad y mantenimiento sin depender de improvisaciones. |
| Staff Augmentation | Pieza fotográfica amplia | Retrato de equipo o momento de colaboración real. | Capacidad técnica que se integra con objetivos, rituales y estándares definidos. |

La cuadrícula se convierte en una lista de paneles de ancho completo en móvil. Cada pieza lleva un enlace descriptivo, por ejemplo `Conocer software a medida`, en vez de repetir un genérico "Ver más".

### 5. Productos: evidencia antes que promesas

Los productos propios aparecen como tres capítulos en una secuencia horizontal de desplazamiento nativo. Cada capítulo combina una captura auténtica del producto y una explicación de una sola idea.

| Producto | Titular | Prueba visual requerida |
| --- | --- | --- |
| WhatsApp Sender Pro | Conversaciones y campañas con control empresarial. | Captura real del inbox, campañas o métricas, con datos anonimizados. |
| SMS Sender Pro | Mensajería crítica cuando el canal debe seguir disponible. | Foto real del dispositivo o del contexto de operación. |
| CuenlyApp / FacturaIA | Facturas que llegan como datos listos para trabajar. | Captura real de una extracción de documento con información anonimizada. |

No se crearán pantallas falsas. Si una captura no está lista, el módulo debe usar una imagen editorial temporal identificada en el backlog de contenidos, no una maqueta hecha con rectángulos.

> Nota (agosto 2026): WhatsApp Sender Pro y SMS Sender Pro fueron retirados de la oferta; el producto vigente en esta sección es Boti (asistente de ventas con IA para WhatsApp Business). Ver implementación en el sitio.

### 6. Cómo trabajamos: la conversación se vuelve claridad

Este bloque no usa el patrón genérico de pasos numerados. Se presenta como una conversación de proyecto a través de tres columnas de diferente altura:

- **Alineamos el contexto**: alcance, responsables, información disponible y riesgos.
- **Hacemos avanzar la primera entrega**: un corte útil para validar el rumbo.
- **Dejamos capacidad instalada**: documentación, transferencia y próximos criterios de decisión.

El hilo conecta las columnas al desplazarse. El movimiento representa continuidad y se desactiva con `prefers-reduced-motion`.

### 7. Seguridad y confianza: compromisos verificables

Una sección de ancho completo, más serena y sin fotografía, reúne los compromisos que la empresa puede demostrar. Debe contener solo afirmaciones confirmadas por MindTechPy.

Propuesta de contenido inicial:

- NDA y acuerdos de trabajo desde el inicio del proyecto.
- Facturación y atención comercial desde Paraguay para la región.
- Gestión de acceso basada en roles cuando la solución lo requiere.
- Entregas con documentación, revisión y trazabilidad acordadas.

El diseño usa una lista de compromisos con iconos de una sola familia y un enlace a las políticas correspondientes. No se declaran certificaciones, porcentajes de disponibilidad ni tiempos de asignación sin respaldo verificable.

### 8. Talento: una puerta claramente separada

El acceso a `Trabaja con nosotros` se presenta como un bloque editorial breve, no como un segundo hero. Su objetivo es atraer perfiles adecuados sin quitar foco a la venta de servicios.

**Titular propuesto**

> Buen trabajo técnico empieza con conversaciones claras.

El enlace lleva a la página actual de talento, que puede adoptar el sistema visual sin cambiar su ruta ni el formulario de postulación.

### 9. Cierre: una invitación con contexto

La última sección es un panel amplio, alineado a la izquierda y con el hilo cerrando en el formulario. Debe pedir solamente los datos necesarios para iniciar una conversación.

**Titular propuesto**

> Contanos qué necesita empezar a funcionar mejor.

Campos iniciales: nombre, empresa, correo, tipo de necesidad y contexto. Cada campo tiene etiqueta visible, ayuda breve, foco accesible y mensajes de error en línea.

La acción primaria mantiene el mismo texto del hero: `Iniciar conversación`.

## Dirección de imágenes y contenido

La nueva propuesta necesita material propio para sentirse creíble. Se recomienda producir o generar, con licencia y revisión, estas cuatro piezas antes de construir la versión final:

1. **Hero, 1600 x 1200:** sesión de trabajo real de MindTechPy, con arquitectura y colaboración. Sin texto incrustado.
2. **Software a medida, 1200 x 900:** detalle de una revisión de producto o planificación técnica real.
3. **Staff Augmentation, 1200 x 900:** retrato documental de una conversación entre profesionales, remoto o presencial.
4. **Productos, 3 capturas 1440 x 1000:** pantallas reales de los productos vigentes, con datos anonimizados.

Las imágenes deben funcionar en escala de grises sin perder claridad, porque el violeta se reserva para señalizar acciones y relaciones de interfaz.

## Movimiento e interacción

El movimiento debe guiar la lectura, no demostrar tecnología.

| Elemento | Comportamiento | Motivo |
| --- | --- | --- |
| Hilo de ejecución | Se revela de forma progresiva entre bloques y cambia de dirección al llegar a una capacidad. | Muestra que servicios, productos y operación pertenecen al mismo sistema. |
| Hero | Entrada breve de texto e imagen con opacidad y desplazamiento vertical. | Establece jerarquía sin demorar la lectura. |
| Capacidades | Elevación leve y cambio de borde al enfoque o hover. | Confirma que cada capacidad es navegable. |
| Productos | Desplazamiento horizontal nativo con `scroll-snap`. | Permite comparar propuestas sin repetir tarjetas. |
| Formulario | Validación contextual tras la interacción del usuario. | Hace evidente qué falta sin interrumpir. |

Todas las animaciones se implementan con `transform` y `opacity`. En modo de movimiento reducido, el hilo queda visible de forma estática y las entradas se muestran inmediatamente.

## Implementación sobre el proyecto actual

La propuesta no requiere migrar el sitio a otro framework. Puede implementarse de forma gradual sobre la arquitectura existente:

- Mantener las rutas actuales, los IDs de sección, los formularios y el contenido legal para proteger SEO y analítica.
- Reordenar y modernizar el home en `src/pages/index.html`.
- Construir tokens y componentes visuales en `src/styles/main.scss`, sin duplicar colores por componente.
- Usar imágenes WebP o AVIF con dimensiones declaradas. Precargar solo el visual del hero y cargar el resto de manera diferida.
- Usar `IntersectionObserver` para revelaciones simples. Reservar GSAP solamente si el hilo de ejecución necesita una coreografía de scroll que CSS no resuelva de forma fiable.
- Conservar una navegación de una línea en escritorio y un diseño de una columna por debajo de 768 px.

## Recorrido de conversión

```text
Necesidad de negocio
        ↓
Hero y mensaje de operación
        ↓
Capacidad o producto relevante
        ↓
Cómo trabajamos y compromisos verificables
        ↓
Formulario: Iniciar conversación
```

Los enlaces secundarios ayudan a profundizar, pero todos los recorridos comerciales vuelven a la misma conversación. Esto evita CTAs que compiten entre sí.

## Criterios de aceptación

- Un visitante puede identificar la propuesta principal y la acción primaria sin desplazarse en escritorio.
- El home no usa datos, logos de clientes, certificaciones ni porcentajes que MindTechPy no pueda probar.
- Cada captura de producto es real o está expresamente marcada como pendiente de contenido durante desarrollo.
- El violeta funciona como único acento y conserva contraste AA en botones, foco y enlaces.
- No hay neón, dashboards ficticios, terminales decorativas ni tres tarjetas idénticas en una misma fila.
- La navegación, las rutas, los campos de formularios y los textos legales existentes se preservan salvo aprobación explícita.
- El diseño funciona a una sola columna en móvil y respeta `prefers-reduced-motion`.
- Las imágenes, las tipografías y la interacción se prueban contra los objetivos actuales de rendimiento y accesibilidad.

## Próxima decisión recomendada

Validar este concepto visual y reunir las cuatro piezas de contenido visual. Con esa base, la siguiente etapa puede traducir la propuesta a un rediseño funcional del home sin poner en riesgo el SEO ni las integraciones existentes.
