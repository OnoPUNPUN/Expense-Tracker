FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npx prisma generate

COPY server.js ./
COPY src ./src

EXPOSE 5003

CMD sh -c "npx prisma db push && node ./src/server.js"