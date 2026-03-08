# ── Stage 1: Build ──
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --include=dev

COPY . .
RUN npm run build

# ── Stage 2: Production ──
FROM node:20-alpine AS production

WORKDIR /app

# Solo dependencias de produccion
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

# Copiar build y server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY src/infrastructure ./src/infrastructure
COPY .env* ./

# Crear directorio de datos
RUN mkdir -p data

# Usuario no-root
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup && \
    chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost:3000/api/health || exit 1

CMD ["node", "src/infrastructure/server.js"]
