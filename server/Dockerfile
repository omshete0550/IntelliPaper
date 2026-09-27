FROM node:22-bookworm-slim
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate
COPY index.js ./
COPY src ./src

ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "index.js"]
