FROM node:24-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

ENV NODE_ENV production

ADD ./package.json ./package.json
ADD ./pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --frozen-lockfile --production

COPY . .

EXPOSE 8080

CMD node src/main.ts
