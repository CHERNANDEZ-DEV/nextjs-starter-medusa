# Etapa 1: build
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .

RUN yarn build

# Etapa 2: producción
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["yarn", "start"]
