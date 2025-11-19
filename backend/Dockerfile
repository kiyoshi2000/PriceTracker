FROM node:18-slim

# Instalar dependências necessárias para o Chrome Headless
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libu2f-udev \
    libx11-6 \
    libx11-xcb1 \
    libxcb-dri3-0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    wget \
    xdg-utils \
    --no-install-recommends

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Gerar client Prisma
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start"]
