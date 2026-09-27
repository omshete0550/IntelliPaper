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
# Render's Docker Command field is passed as container arguments, so keep the
# migration-and-start sequence in the image where the shell can run it safely.
CMD ["sh", "-c", "npx prisma db push --skip-generate && exec node index.js"]
