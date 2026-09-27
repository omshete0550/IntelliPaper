FROM node:22-bookworm-slim
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate
COPY index.js ./
COPY src ./src

ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "index.js"]
