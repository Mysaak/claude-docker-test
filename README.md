# Claude Docker Test Project

Testovací projekt pro nastavení vývojového prostředí s Docker, Node.js a PostgreSQL.

## Požadavky

- **Docker** a **Docker Compose**
- **Node.js** (v18 nebo vyšší)
- **npm** (nebo yarn)
- **Git** a **GitHub CLI**

## Rychlý Start

### 1. Clone repozitáře
```bash
git clone https://github.com/Mysaak/claude-docker-test.git
cd claude-docker-test
```

### 2. Instalace závislostí
```bash
npm install
```

### 3. Spuštění PostgreSQL
```bash
docker compose up -d
```

Počkejte cca 10 sekund, než se PostgreSQL plně spustí a inicializuje.

### 4. Spuštění serveru
```bash
npm run dev
```

Server poběží na `http://localhost:3000`

### 5. Testování

Otevřete prohlížeč nebo použijte curl:

```bash
# Health check
curl http://localhost:3000/health

# Test databázového připojení
curl http://localhost:3000/api/test
```

## API Dokumentace

### GET /
Základní informace o API.

**Response:**
```json
{
  "message": "Claude Docker Test API",
  "endpoints": {
    "health": "GET /health",
    "databaseTest": "GET /api/test"
  }
}
```

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
Testuje připojení k PostgreSQL databázi a vrací verzi databáze.

**Response (úspěch):**
```json
{
  "status": "success",
  "message": "Database connection successful",
  "timestamp": "2025-10-30T12:34:56.789Z",
  "database": {
    "version": "PostgreSQL 16.x on x86_64-pc-linux-gnu..."
  }
}
```

**Response (chyba):**
```json
{
  "status": "error",
  "message": "Database connection failed: connection refused"
}
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
```

## Environment Variables

Projekt používá výchozí hodnoty, ale můžete je přepsat vytvořením `.env` souboru:

```bash
cp .env.example .env
```

Dostupné proměnné:
- `DB_USER` - PostgreSQL uživatel (default: postgres)
- `DB_PASSWORD` - PostgreSQL heslo (default: postgres)
- `DB_NAME` - název databáze (default: testdb)
- `DB_HOST` - host databáze (default: localhost)
- `DB_PORT` - port databáze (default: 5432)
- `PORT` - port serveru (default: 3000)

## Struktura projektu

```
claude-docker-test/
├── Claude.MD              # Interní projektová dokumentace
├── README.md              # Tato dokumentace
├── docker-compose.yml     # Konfigurace Docker služeb
├── package.json           # Node.js dependencies
├── server.js              # Express server
├── .env.example           # Template pro env variables
├── .gitignore            # Git ignore pravidla
└── postgres-data/        # PostgreSQL data (gitignored)
```

## Troubleshooting

### Port 5432 je již obsazený
Změňte port v `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Externí port 5433
```

A aktualizujte `DB_PORT` v `.env` na `5433`.

### Server se nemůže připojit k databázi
1. Ověřte že PostgreSQL běží: `docker compose ps`
2. Zkontrolujte logy: `docker compose logs postgres`
3. Počkejte na health check: stav by měl být "healthy"

### Permission denied na postgres-data/
```bash
docker compose down -v
rm -rf postgres-data/
docker compose up -d
```

## Licence

MIT

## Autor

Vytvořeno pomocí Claude Code
