# Claude Docker Test Project

## Popis projektu
Testovací projekt pro nastavení vývojového prostředí s Docker, Node.js a PostgreSQL. Slouží jako demonstrace a verifikace kompletního vývojového stacku.

## Tech Stack

### Backend
- **Node.js** (runtime)
- **Express.js** (web framework)
- **pg** (PostgreSQL client pro Node.js)

### Databáze
- **PostgreSQL 16** (relační databáze)
- Běží v Docker containeru
- Volumes pro persistenci dat

### DevOps
- **Docker** (kontejnerizace)
- **Docker Compose** (orchestrace služeb)
- **GitHub CLI** (automatizace GitHub workflow)

## Architektura

```
┌─────────────────────────────────────────┐
│         Lokální Development             │
├─────────────────────────────────────────┤
│                                         │
│  Node.js Server (localhost:3000)       │
│  ├── Express.js API                     │
│  ├── PostgreSQL Client (pg)            │
│  └── Health Check Endpoints            │
│           │                             │
│           │ TCP 5432                    │
│           ▼                             │
│  ┌────────────────────────────┐        │
│  │ Docker Container           │        │
│  │  PostgreSQL 16             │        │
│  │  - Port: 5432              │        │
│  │  - Volume: postgres-data   │        │
│  │  - Health checks           │        │
│  └────────────────────────────┘        │
│                                         │
└─────────────────────────────────────────┘
```

## Struktura projektu

```
claude-docker-test/
├── Claude.MD              # Tato dokumentace (interní)
├── README.md              # Uživatelská dokumentace
├── docker-compose.yml     # Konfigurace Docker služeb
├── package.json           # Node.js dependencies a skripty
├── server.js              # Express server s DB připojením
├── .env.example           # Template pro environment variables
├── .gitignore            # Git ignore pravidla
└── postgres-data/        # PostgreSQL data (v .gitignore)
```

## Jak spustit

### 1. Prerekvizity
- Docker a Docker Compose nainstalované
- Node.js (doporučeno v18 nebo vyšší)
- Git a GitHub CLI

### 2. Instalace závislostí
```bash
npm install
```

### 3. Spuštění PostgreSQL v Dockeru
```bash
docker compose up -d
```

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

## API Endpointy

### GET /health
Health check endpoint serveru.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-30T12:34:56.789Z"
}
```

### GET /api/test
Testuje připojení k PostgreSQL databázi.

**Response (úspěch):**
```json
{
  "status": "success",
  "message": "Database connection successful",
  "timestamp": "2025-10-30T12:34:56.789Z",
  "database": {
    "version": "PostgreSQL 16.x"
  }
}
```

**Response (chyba):**
```json
{
  "status": "error",
  "message": "Database connection failed: error details"
}
```

## Příkazy a troubleshooting

### Docker příkazy
```bash
# Spustit služby
docker compose up -d

# Zastavit služby
docker compose down

# Zobrazit logy
docker compose logs -f postgres

# Restartovat služby
docker compose restart

# Odstranit všechno včetně volumes (POZOR: smaže data!)
docker compose down -v

# Vstoupit do PostgreSQL containeru
docker compose exec postgres psql -U postgres
```

### Node.js příkazy
```bash
# Instalace závislostí
npm install

# Spuštění v dev módu (s nodemon)
npm run dev

# Spuštění v production módu
npm start
```

### Testování API
```bash
# Health check
curl http://localhost:3000/health

# Database test
curl http://localhost:3000/api/test

# S formátovaným výstupem (jq)
curl http://localhost:3000/api/test | jq
```

## Troubleshooting

### Problem: Docker kontejner nejde spustit
```bash
# Zkontrolujte Docker daemon
docker ps

# Zkontrolujte logy
docker compose logs postgres

# Restartujte Docker Desktop (pokud používáte)
```

### Problem: Server se nemůže připojit k databázi
```bash
# 1. Ověřte že PostgreSQL běží
docker compose ps

# 2. Zkontrolujte environment variables
cat .env

# 3. Zkontrolujte connection string v server.js

# 4. Zkontrolujte network v Dockeru
docker network ls
```

### Problem: Port 5432 je již obsazený
```bash
# Zjistěte co běží na portu 5432
lsof -i :5432

# Nebo změňte port v docker-compose.yml:
ports:
  - "5433:5432"  # Změní externí port na 5433
```

### Problem: Permission denied na postgres-data/
```bash
# Nastavte správná oprávnění
sudo chown -R $USER:$USER postgres-data/

# Nebo smažte a nechte Docker vytvořit znovu
docker compose down -v
rm -rf postgres-data/
docker compose up -d
```

## Environment Variables

Vytvořte `.env` soubor podle `.env.example`:

```bash
cp .env.example .env
```

Proměnné:
- `POSTGRES_USER` - PostgreSQL uživatel (default: postgres)
- `POSTGRES_PASSWORD` - PostgreSQL heslo (default: postgres)
- `POSTGRES_DB` - název databáze (default: testdb)
- `DB_HOST` - host databáze (default: localhost)
- `DB_PORT` - port databáze (default: 5432)

## Poznámky

- PostgreSQL data jsou persistentní díky Docker volumes
- Server běží lokálně (ne v containeru) pro snadnější development
- Health checks v docker-compose.yml zajišťují že PostgreSQL je ready před použitím
- Používáme nodemon pro automatický restart při změnách kódu

## Autor
Vytvořeno pomocí Claude Code
