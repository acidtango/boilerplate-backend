FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV production

ADD ./package.json ./package.json
ADD ./package-lock.json ./package-lock.json

RUN npm ci --only=production

COPY . .

EXPOSE 8080

CMD node src/main.ts
