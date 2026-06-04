FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/expense_tracker?schema=public"
ENV REDIS_URL="redis://localhost:6379"

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npx prisma generate

COPY server.js ./
COPY public ./public
COPY src ./src

EXPOSE 5003

CMD ["node", "server.js"]
