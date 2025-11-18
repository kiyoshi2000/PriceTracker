
#  **PriceTracker Pro**

### *Real-time price tracking, automated scraping, alert notifications & analytics dashboard — built with Fastify + Prisma + Puppeteer + Next.js.*

<img src="https://raw.githubusercontent.com/placeholder/banner.png" alt="banner" width="800"/>

---

# 🚀 **Overview**

**PriceTracker Pro** é uma plataforma completa para monitoramento automático de preços de produtos em e-commerce. Você registra um item, define um limite de preço, e o sistema:

1. **Rastreia o preço periodicamente** (a cada 30 minutos) com Puppeteer
2. **Armazena o histórico** em banco com Prisma (SQLite ou Postgres)
3. **Dispara alertas instantâneos** (Telegram ou email) quando o preço cai
4. **Exibe dashboards** em tempo real com gráficos (Next.js + Recharts)
5. **Permite scraping manual** para atualizações imediatas

Arquitetura moderna, códigos tipados com TypeScript e desempenho alto usando Fastify.

---

# 🧱 **Arquitetura do Projeto**

```
price-tracker-pro/
│
├── backend/            → Fastify API + Scraper + Prisma + Cron Jobs
│   ├── scraper/        → Puppeteer engine
│   ├── jobs/           → Price scheduler (cron)
│   ├── routes/         → REST API (items, prices, alerts)
│   ├── notifications/  → Telegram / Email alerts
│   └── prisma/         → Banco + schema
│
├── frontend/           → Next.js 15 + App Router + Tailwind + SWR
│   ├── app/            → Páginas principais
│   ├── components/     → Gráficos e cards
│   └── hooks/          → SWR API bindings
│
└── docker-compose.yml  → Orquestração completa
```

---

# 🛠️ **Tecnologias Utilizadas**

### **Backend**

* ⚡ **Fastify** — API de alta performance
* 💾 **Prisma ORM** — Banco de dados tipado
* 🤖 **Puppeteer** — Web scraping
* ⏱ **node-cron** — Agendador de tarefas
* 📬 **Telegram Bot API** — Notificações
* 🧪 TypeScript everywhere
* 🐳 Dockerfile integrado

### **Frontend**

* ⚛️ **Next.js 15 (App Router)**
* 🎨 **TailwindCSS**
* 🔄 **SWR** (React hooks para API)
* 📊 **Recharts** (gráficos)

---

# 🔥 **Funcionalidades**

### ✅ **1. Cadastro de itens**

Registre nome + URL do produto:

```
POST /items
```

### ✅ **2. Scraping automático a cada 30 minutos**

* Puppeteer extrai o preço
* O scheduler salva no banco
* Watchers são verificados

### ✅ **3. Histórico completo de preços**

* Armazenado em tabela `Price`
* Visualização gráfica no frontend

### ✅ **4. Alertas em tempo real**

Via Telegram:

* “🔥 Oferta! iPhone 14 caiu para R$ 3.299”

### ✅ **5. Dashboard bonito**

* Lista de itens
* Detalhe com gráfico
* Últimos preços
* Link direto para o produto

---

# 📷 **Screenshots**

*(Você pode adicionar prints reais depois de subir o projeto)*

```
🖼 Dashboard com cards
🖼 Página do item com gráfico de preço
🖼 Exemplo de notificação no Telegram
```

---

# 🛠️ **Como Rodar o Projeto**

## 🔹 **1. Clonar o repositório**

```bash
git clone https://github.com/<seu-usuario>/price-tracker-pro
cd price-tracker-pro
```

---

# ▶️ **Rodar com Docker (RECOMENDADO)**

### 1. Preencha sua env (Telegram opcional)

Crie o arquivo:

```
backend/.env
```

Conteúdo:

```
TELEGRAM_TOKEN=SEU_TOKEN
```

### 2. Suba tudo:

```bash
docker compose up --build
```

Acesse:

* **Backend:** [http://localhost:3001](http://localhost:3001)
* **Frontend:** [http://localhost:3000](http://localhost:3000)

---

# ▶️ **Rodar localmente (sem Docker)**

## **Backend**

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Server → `http://localhost:3001`

---

## **Frontend (Next.js)**

```bash
cd frontend
npm install
npm run dev
```

App → `http://localhost:3000`

---

# 📡 **API Endpoints Principais**

### Listar itens

```
GET /items
```

### Criar item

```
POST /items
{
  "name": "Monitor LG 144Hz",
  "url": "https://..."
}
```

### Preço atual + histórico

```
GET /items/:id
```

### Scraping manual

```
POST /items/:id/scrape
```

---

# 🧩 **Estrutura do Banco (Prisma)**

### Tabela `Item`

* id
* name
* url
* createdAt

### Tabela `Price`

* id
* value
* createdAt
* itemId → FK

### Tabela `Watch`

* id
* threshold
* chatId
* itemId → FK

---

# 📬 **Notificações (Telegram)**

O bot envia mensagens quando:

* O scraper encontra um preço
* Esse preço **é menor ou igual** ao threshold do watcher

Exemplo:

> 🔥 *Oferta encontrada!*
> Monitor LG caiu para **R$ 899**

---

# 📅 Roteiro de Desenvolvimento (Roadmap)

### 🔜 V1.1

* Notificação por email
* Gráfico de volume de scraping
* Dashboard dark mode

### 🔜 V1.2

* Suporte a múltiplas lojas (Amazon, Kabum, AliExpress)
* Modo headless turbo (Playwright)
* Exportação CSV

### 🔜 V2.0

* App Mobile (React Native)
* Previsão de preços via IA (LSTM)
* Sistema de login

---

# ⭐ Gostou do projeto?

Considere marcar o repositório com uma **estrela ⭐ no GitHub** — ajuda muito!

---