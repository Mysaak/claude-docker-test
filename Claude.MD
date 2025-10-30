# Claude Docker Test Project - Full-Stack TODO Application

## Popis projektu
Full-stack TODO aplikace postavená na Docker, Node.js, Express, PostgreSQL a Vanilla JavaScript. Demonstruje kompletní vývojový stack s moderním frontendem a REST API backendem.

## Tech Stack

### Frontend
- **HTML5** (sémantický markup)
- **Tailwind CSS** (utility-first CSS framework)
- **Vanilla JavaScript** (žádné frameworky, čistý ES6+)
- **Fetch API** (komunikace s backendem)

### Backend
- **Node.js** (runtime)
- **Express.js** (web framework)
- **pg** (PostgreSQL client)
- **cors** (Cross-Origin Resource Sharing middleware)

### Databáze
- **PostgreSQL 16** (relační databáze)
- **SQL Migrations** (automatické vytvoření schématu)
- Běží v Docker containeru
- Volumes pro persistenci dat

### DevOps
- **Docker** (kontejnerizace)
- **Docker Compose** (orchestrace služeb)
- **GitHub CLI** (automatizace GitHub workflow)

## Architektura

```
┌─────────────────────────────────────────────────────┐
│           Full-Stack TODO Application               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Frontend (Browser)                                 │
│  ├── index.html (Tailwind CSS)                      │
│  └── app.js (Vanilla JavaScript)                    │
│           │                                         │
│           │ HTTP/JSON (Fetch API)                   │
│           ▼                                         │
│  ┌──────────────────────────────────────┐          │
│  │ Node.js Server (localhost:3000)       │          │
│  │  ├── Express.js REST API             │          │
│  │  ├── CORS Middleware                 │          │
│  │  ├── Static File Serving             │          │
│  │  └── PostgreSQL Client (pg)          │          │
│  └──────────────────────────────────────┘          │
│           │                                         │
│           │ TCP 5432                                │
│           ▼                                         │
│  ┌──────────────────────────────────────┐          │
│  │ Docker Container                      │          │
│  │  PostgreSQL 16                        │          │
│  │  ├── Port: 5432                       │          │
│  │  ├── Volume: postgres-data            │          │
│  │  ├── Volume: migrations (init)        │          │
│  │  ├── Health checks                    │          │
│  │  └── Database: testdb                 │          │
│  │      └── Table: todos                 │          │
│  └──────────────────────────────────────┘          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Struktura projektu

```
claude-docker-test/
├── Claude.MD                  # Tato dokumentace (interní)
├── README.md                  # Uživatelská dokumentace
├── docker-compose.yml         # Konfigurace Docker služeb
├── package.json               # Node.js dependencies a skripty
├── server.js                  # Express server + REST API
├── .env.example               # Template pro environment variables
├── .gitignore                # Git ignore pravidla
├── migrations/               # SQL migration skripty
│   └── 001_create_todos.sql  # Vytvoření todos tabulky
├── public/                   # Frontend soubory (static)
│   ├── index.html            # UI aplikace (Tailwind CSS)
│   └── app.js                # Frontend logika (Vanilla JS)
└── postgres-data/            # PostgreSQL data (v .gitignore)
```

## Databázové Schéma

### Tabulka `todos`
```sql
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_todos_created_at ON todos(created_at DESC);
```

**Pole:**
- `id` - Unikátní identifikátor (auto-increment)
- `title` - Text úkolu (max 255 znaků)
- `completed` - Stav dokončení (true/false)
- `created_at` - Čas vytvoření (automaticky)

## REST API Dokumentace

### Base URL
```
http://localhost:3000/api
```

### Endpointy

#### 1. GET /api/todos
Vrátí seznam všech todos seřazených podle data vytvoření (nejnovější první).

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "title": "Vytvořit TODO aplikaci",
      "completed": false,
      "created_at": "2025-10-30T12:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### 2. POST /api/todos
Vytvoří nový todo úkol.

**Request Body:**
```json
{
  "title": "Nový úkol"
}
```

**Validace:**
- `title` je povinný
- `title` nesmí být prázdný
- `title` max 255 znaků

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Todo created successfully",
  "data": {
    "id": 2,
    "title": "Nový úkol",
    "completed": false,
    "created_at": "2025-10-30T12:05:00.000Z"
  }
}
```

**Error (400 Bad Request):**
```json
{
  "status": "error",
  "message": "Title is required and cannot be empty"
}
```

#### 3. PATCH /api/todos/:id
Přepne completed status todo úkolu (toggle).

**Response:**
```json
{
  "status": "success",
  "message": "Todo updated successfully",
  "data": {
    "id": 1,
    "title": "Vytvořit TODO aplikaci",
    "completed": true,
    "created_at": "2025-10-30T12:00:00.000Z"
  }
}
```

**Error (404 Not Found):**
```json
{
  "status": "error",
  "message": "Todo not found"
}
```

#### 4. DELETE /api/todos/:id
Smaže todo úkol.

**Response:**
```json
{
  "status": "success",
  "message": "Todo deleted successfully"
}
```

**Error (404 Not Found):**
```json
{
  "status": "error",
  "message": "Todo not found"
}
```

### Utility Endpointy

#### GET /health
Health check serveru.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-30T12:34:56.789Z"
}
```

#### GET /api/test
Test databázového připojení.

**Response:**
```json
{
  "status": "success",
  "message": "Database connection successful",
  "timestamp": "2025-10-30T12:34:56.789Z",
  "database": {
    "version": "PostgreSQL 16.10..."
  }
}
```

## Frontend UI

### Komponenty

**Header:**
- Název aplikace "Todo App"
- Popis

**Add Todo Form:**
- Input field s placeholderem "Co potřebuješ udělat?"
- Tlačítko "Přidat"
- Validace na max 255 znaků

**Stats Panel:**
- Celkem todos
- Zbývá (nehotové)
- Hotovo (completed)

**Todo List:**
- Každý item obsahuje:
  - Checkbox pro toggle completed
  - Text úkolu (přeškrtnutý pokud completed)
  - Tlačítko "Smazat"
- Animace při přidání
- Empty state pokud žádné todos

**Error Handling:**
- Error zprávy s auto-hide (5s)
- Loading indicator během operací

**Design:**
- Gradient pozadí (blue-indigo)
- Tailwind CSS komponenty
- Responzivní (mobile-first)
- Moderní shadow efekty
- Smooth animace

## Jak spustit

### 1. Prerekvizity
- Docker a Docker Compose
- Node.js (v18 nebo vyšší)
- Git a GitHub CLI

### 2. Instalace závislostí
```bash
npm install
```

### 3. Spuštění PostgreSQL v Dockeru
```bash
docker compose up -d
```

Migrations se spustí automaticky při prvním startu PostgreSQL.

### 4. Ověření že PostgreSQL běží
```bash
docker compose ps
docker compose logs postgres
```

### 5. Spuštění dev serveru
```bash
npm run dev
```

Server poběží na `http://localhost:3000`

### 6. Otevření v prohlížeči
```bash
# Automaticky se otevře index.html
open http://localhost:3000
```

## Příkazy

### Development
```bash
npm run dev      # Spustí server s nodemon (auto-reload)
npm start        # Spustí server v production módu
```

### Docker
```bash
docker compose up -d        # Spustit služby na pozadí
docker compose down         # Zastavit služby
docker compose logs -f      # Zobrazit logy
docker compose ps           # Zobrazit běžící kontejnery
docker compose restart      # Restartovat služby

# Restartovat s novými migrations (smaže data!)
docker compose down -v
docker compose up -d
```

### Testování API
```bash
# Health check
curl http://localhost:3000/health

# Get all todos
curl http://localhost:3000/api/todos

# Create todo
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Test úkol"}'

# Toggle completed
curl -X PATCH http://localhost:3000/api/todos/1

# Delete todo
curl -X DELETE http://localhost:3000/api/todos/1
```

## Troubleshooting

### Problem: Migrations se nespustily
```bash
# Zkontrolujte logy PostgreSQL
docker compose logs postgres

# Znovu vytvořte databázi (POZOR: smaže data!)
docker compose down -v
docker compose up -d
```

### Problem: CORS chyby v prohlížeči
- Ujistěte se že server běží na http://localhost:3000
- CORS je povolený pro všechny originy v development

### Problem: Frontend se nenačítá
```bash
# Zkontrolujte že public/ složka existuje
ls -la public/

# Zkontrolujte server logy
npm run dev
```

## Environment Variables

Vytvořte `.env` soubor podle `.env.example`:

```bash
cp .env.example .env
```

Proměnné:
- `DB_USER` - PostgreSQL uživatel (default: postgres)
- `DB_PASSWORD` - PostgreSQL heslo (default: postgres)
- `DB_NAME` - název databáze (default: testdb)
- `DB_HOST` - host databáze (default: localhost)
- `DB_PORT` - port databáze (default: 5432)
- `PORT` - port serveru (default: 3000)

## Bezpečnost

### Implementováno:
- ✅ XSS ochrana (escapeHtml v frontendu)
- ✅ SQL injection ochrana (parametrizované queries)
- ✅ Input validace (server-side i client-side)
- ✅ CORS konfigurace
- ✅ Error handling bez leak citlivých info

### TODO pro production:
- ⚠️ Authentikace a autorizace
- ⚠️ Rate limiting
- ⚠️ HTTPS
- ⚠️ Environment variables pro credentials
- ⚠️ Content Security Policy
- ⚠️ Helmet.js middleware

## Performance

- PostgreSQL indexy na created_at
- Connection pooling pro databázi
- Static file caching (Express)
- Optimistické UI updates ve frontendu

## Poznámky

- PostgreSQL data jsou persistentní díky Docker volumes
- Server běží lokálně (ne v containeru) pro snadnější development
- Health checks zajišťují že PostgreSQL je ready
- Nodemon pro automatický restart při změnách kódu
- Vanilla JS bez závislostí na frameworky (lightweight)

## Autor
Vytvořeno pomocí Claude Code
