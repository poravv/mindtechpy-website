# MindTechPy Web

Un sitio web moderno y responsivo para MindTechPy utilizando una arquitectura hexagonal.

## Requisitos

- Node.js (v14 o superior)
- NPM (v6 o superior)

## Instalación

```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]

# Entrar al directorio
cd web-mindtdchpy

# Instalar dependencias
npm install
```

## Uso

### Construir el proyecto

```bash
npm run build
```

### Iniciar el servidor

```bash
npm run start
```

Esto iniciará el servidor en http://localhost:3000

### Iniciar con un solo comando

También puedes usar el script proporcionado para construir e iniciar el proyecto con un solo comando:

```bash
./run.sh
```

## Estructura del proyecto

El proyecto sigue una arquitectura hexagonal con la siguiente estructura:

- `src/domain`: Contiene los modelos core del negocio
- `src/services`: Servicios y puertos del dominio
- `src/infrastructure`: Adaptadores y configuración
- `src/components`: Componentes reutilizables
- `src/pages`: Páginas del sitio web

## Características

- Diseño moderno y responsivo
- Arquitectura hexagonal para mantener el código limpio y escalable
- Optimización para SEO
- Animaciones para mejorar la experiencia de usuario
