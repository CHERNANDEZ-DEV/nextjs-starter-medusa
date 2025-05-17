# Etapa 1: build
FROM node:18 AS builder

WORKDIR /app

# Habilitar Corepack (para usar Yarn 3+)
RUN corepack enable

# Copiar solo lo necesario para instalar dependencias
COPY package.json yarn.lock .yarnrc.yml .yarn/ ./

# Instalar dependencias
RUN yarn install --immutable

# Copiar el resto del código
COPY . .

# Construir la aplicación
RUN yarn build

# Etapa 2: producción
FROM node:18-alpine

WORKDIR /app

# Habilitar Corepack también en producción (opcional si yarn se usa en runtime)
RUN corepack enable

# Copiar archivos construidos desde el builder
COPY --from=builder /app ./

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["yarn", "start"]
