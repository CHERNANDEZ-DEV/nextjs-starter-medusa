# Etapa de construcción
FROM node:18-alpine AS builder

# Instala curl si no está
RUN apk add --no-cache curl

# Descarga el instalador de Yarn Berry (Yarn 3+)
RUN curl -sS https://yarnpkg.com/install.sh | sh

WORKDIR /app

# 1. Copiar archivos de configuración de dependencias
COPY package.json yarn.lock ./

# 2. Instalar todas las dependencias
RUN yarn install --immutable

# 3. Copiar el resto de archivos (excluyendo lo que está en .dockerignore)
COPY . .

# 4. Construir la aplicación
RUN yarn build

# Etapa de producción
FROM node:18-alpine AS runner
WORKDIR /app

# 1. Configurar entorno de producción
ENV NODE_ENV production

# 2. Copiar archivos de dependencias
COPY --from=builder /app/package.json /app/yarn.lock ./

# 3. Instalar solo dependencias de producción
RUN yarn install --production --frozen-lockfile

# 4. Copiar artefactos de construcción necesarios
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# 5. Copiar configuraciones esenciales
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/medusa-config.js ./
COPY --from=builder /app/.env.production ./.env  

# 6. Exponer puerto y ejecutar
EXPOSE 3000
CMD ["yarn", "start"]