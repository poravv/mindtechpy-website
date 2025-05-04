#!/bin/bash

echo "🚀 Iniciando MindTechPy Web..."
echo "📁 Directorio: $(pwd)"

# Verificar si hay procesos usando el puerto 3000
echo "🔍 Verificando el puerto 3000..."
lsof -ti :3000 | xargs kill -9 2>/dev/null || echo "✅ Puerto 3000 libre"

# Construir el proyecto (opcional, comenta si ya está construido)
echo "🛠️ Construyendo el proyecto..."
npm run build

# Iniciar el servidor
echo "🌐 Iniciando servidor..."
echo "📊 Accede a http://localhost:3000"
npm run start
