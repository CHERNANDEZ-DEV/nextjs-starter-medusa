FROM node:18-alpine

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./

COPY .yarn/ ./.yarn/

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

ENV PORT=3000

EXPOSE 3000

CMD ["yarn", "start"]