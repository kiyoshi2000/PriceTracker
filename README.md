# PriceTracker — Amazon Price Monitoring App

A full-stack application that automatically tracks price changes for Amazon products.  
Built with **Next.js**, **Fastify**, **Prisma**, **PostgreSQL**, **Docker**, and **Puppeteer**.

---

## Features

###  Smart Price Tracking
- Add any **Amazon URL**  
- Automatic scraping (name + price)  
- Price history saved in PostgreSQL  
- Daily scheduled updates (cron jobs)  


### Full Docker Support
Includes:
- `frontend` container (Next.js)
- `backend` container (Fastify + Prisma)
- `db` container (PostgreSQL 18)

---

## Tech Stack

| Layer        | Technology |
|--------------|------------|
| Frontend     | Next.js, TailwindCSS, SWR |
| Backend      | Fastify, Prisma ORM |
| Database     | PostgreSQL |
| Scraper      | Puppeteer (headless Chrome) |
| Infra        | Docker + Docker Compose |


---

## Running with Docker

### ** Build images**

```bash
docker compose build --no-cache
```

### ** Start containers**

```bash
docker compose up
```

### ** Access services**

* Frontend → [http://localhost:3000](http://localhost:3000)
* Backend → [http://localhost:3001](http://localhost:3001)

---

## 👨‍💻 Author

**Kiyoshi Araki**
Full-stack developer & AI engineer
🇫🇷 France | 🇧🇷 Brazil

---

