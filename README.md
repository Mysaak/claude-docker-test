# Claude Docker Test - Full-Stack TODO Application

> 🚀 Moderní TODO aplikace postavená na Docker, Node.js, Express, PostgreSQL a Vanilla JavaScript

![Tech Stack](https://img.shields.io/badge/PostgreSQL-16-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![Frontend](https://img.shields.io/badge/Frontend-Vanilla%20JS-yellow)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)

## ✨ Features

- ✅ **Full-Stack** - Kompletní aplikace s frontendem a backendem
- ✅ **REST API** - Plně funkční CRUD operace
- ✅ **PostgreSQL** - Relační databáze s SQL migrations
- ✅ **Docker** - Snadné spuštění pomocí Docker Compose
- ✅ **Moderní UI** - Responzivní design s Tailwind CSS
- ✅ **Vanilla JS** - Žádné frameworky, čistý JavaScript
- ✅ **Real-time Updates** - Okamžitá aktualizace UI
- ✅ **Error Handling** - Robustní zpracování chyb
- ✅ **Validace** - Server-side i client-side validace

## 📋 Požadavky

- **Docker** a **Docker Compose**
- **Node.js** (v18 nebo vyšší)
- **npm** (nebo yarn)

## 🚀 Rychlý Start

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

> Počkejte cca 10 sekund, než se PostgreSQL plně spustí. Migrations se spustí automaticky.

### 4. Spuštění serveru
```bash
npm run dev
```

### 5. Otevření v prohlížeči
```
http://localhost:3000
```

🎉 **Hotovo!** Aplikace běží a je připravená k použití.

## 📱 UI Screenshot

Aplikace obsahuje:

- **Header** s názvem a popisem
- **Add Todo Form** - input field a tlačítko pro přidání úkolu
- **Stats Panel** - přehled celkového počtu, zbývajících a hotových úkolů
- **Todo List** - seznam úkolů s možností označit jako hotové nebo smazat
- **Empty State** - hezká zpráva když nejsou žádné úkoly

**Design:**
- Gradient pozadí (blue-indigo)
- Moderní card design s stíny
- Responzivní layout (mobile-first)
- Smooth animace při přidání úkolu
- Přeškrtnuté dokončené úkoly

## 🔌 API Dokumentace

### Base URL
```
http://localhost:3000/api
```

### Endpointy

#### **GET /api/todos**
Vrátí všechny todos seřazené podle data vytvoření (nejnovější první).

**Příklad:**
```bash
curl http://localhost:3000/api/todos
```

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

---

#### **POST /api/todos**
Vytvoří nový todo úkol.

**Příklad:**
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Napsat dokumentaci"}'
```

**Request Body:**
```json
{
  "title": "Napsat dokumentaci"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Todo created successfully",
  "data": {
    "id": 2,
    "title": "Napsat dokumentaci",
    "completed": false,
    "created_at": "2025-10-30T12:05:00.000Z"
  }
}
```

**Validace:**
- `title` je povinný a nesmí být prázdný
- `title` max 255 znaků

---

#### **PATCH /api/todos/:id**
Přepne completed status (toggle).

**Příklad:**
```bash
curl -X PATCH http://localhost:3000/api/todos/1
```

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

---

#### **DELETE /api/todos/:id**
Smaže todo úkol.

**Příklad:**
```bash
curl -X DELETE http://localhost:3000/api/todos/1
```

**Response:**
```json
{
  "status": "success",
  "message": "Todo deleted successfully"
}
```

---

### Utility Endpointy

#### **GET /health**
Health check serveru.

```bash
curl http://localhost:3000/health
```

#### **GET /api/test**
Test databázového připojení.

```bash
curl http://localhost:3000/api/test
```

## 🗂️ Struktura Projektu

```
claude-docker-test/
├── Claude.MD                  # Interní dokumentace
├── README.md                  # Tato dokumentace
├── docker-compose.yml         # Docker konfigurace
├── package.json               # Dependencies
├── server.js                  # Express server + REST API
├── .env.example               # Environment variables template
├── .gitignore                # Git ignore
├── migrations/               # SQL migrations
│   └── 001_create_todos.sql  # Vytvoření todos tabulky
├── public/                   # Frontend (static files)
│   ├── index.html            # UI aplikace
│   └── app.js                # Frontend logika
└── postgres-data/            # PostgreSQL data (gitignored)
```

## 🗄️ Databázové Schéma

### Tabulka `todos`

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PRIMARY KEY | Unikátní identifikátor |
| title | VARCHAR(255) NOT NULL | Text úkolu |
| completed | BOOLEAN DEFAULT false | Stav dokončení |
| created_at | TIMESTAMP DEFAULT NOW | Čas vytvoření |

**Indexy:**
- `idx_todos_created_at` na `created_at DESC` (rychlejší řazení)

## 🛠️ Příkazy

### Development
```bash
npm run dev      # Dev server s nodemon (auto-reload)
npm start        # Production server
```

### Docker
```bash
# Základní operace
docker compose up -d        # Spustit na pozadí
docker compose down         # Zastavit
docker compose ps           # Zobrazit stav
docker compose logs -f      # Live logy

# Restartovat s čistou databází (POZOR: smaže data!)
docker compose down -v
docker compose up -d
```

### Databáze
```bash
# Připojit se k PostgreSQL
docker compose exec postgres psql -U postgres -d testdb

# Zobrazit todos
docker compose exec postgres psql -U postgres -d testdb -c "SELECT * FROM todos;"

# Zkontrolovat migrations
docker compose logs postgres | grep "CREATE TABLE"
```

## 🔧 Configuration

### Environment Variables

Vytvořte `.env` soubor pro vlastní konfiguraci:

```bash
cp .env.example .env
```

**Dostupné proměnné:**

```env
# PostgreSQL Configuration
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=testdb
DB_HOST=localhost
DB_PORT=5432

# Server Configuration
PORT=3000
```

## 🐛 Troubleshooting

### Problem: Port 5432 je již obsazený

**Řešení:** Změňte port v `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Externí port 5433
```

A aktualizujte `DB_PORT` v `.env` na `5433`.

---

### Problem: Migrations se nespustily

**Řešení:**
```bash
# Zkontrolujte logy
docker compose logs postgres

# Znovu vytvořte databázi
docker compose down -v
docker compose up -d
```

---

### Problem: Server se nemůže připojit k databázi

**Řešení:**
1. Ověřte že PostgreSQL běží: `docker compose ps`
2. Zkontrolujte health status: měl by být "healthy"
3. Počkejte 10-15 sekund po startu
4. Zkontrolujte logy: `docker compose logs postgres`

---

### Problem: Frontend se nenačítá

**Řešení:**
```bash
# Zkontrolujte že public/ složka existuje
ls -la public/

# Restartujte server
npm run dev
```

## 📦 Tech Stack

### Frontend
- **HTML5** - Sémantický markup
- **Tailwind CSS** - Utility-first CSS framework
- **Vanilla JavaScript** - Čistý ES6+ bez frameworků
- **Fetch API** - HTTP komunikace

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **pg** - PostgreSQL client
- **cors** - CORS middleware

### Database
- **PostgreSQL 16** - Relační databáze
- **Docker** - Kontejnerizace
- **SQL Migrations** - Automatické schéma

## 🔒 Bezpečnost

**Implementováno:**
- ✅ XSS ochrana (escapeHtml)
- ✅ SQL injection ochrana (parametrizované queries)
- ✅ Input validace (server + client)
- ✅ CORS konfigurace
- ✅ Error handling

**Pro production je potřeba:**
- ⚠️ Authentikace a autorizace
- ⚠️ Rate limiting
- ⚠️ HTTPS
- ⚠️ Environment variables pro credentials
- ⚠️ Content Security Policy

## 📝 Testování

### Manuální testování v prohlížeči

1. Otevřete `http://localhost:3000`
2. Přidejte nový úkol
3. Označte úkol jako hotový (klikněte na checkbox)
4. Smažte úkol (klikněte na "Smazat")
5. Zkontrolujte statistiky v panelu

### API testování pomocí curl

```bash
# Vytvořit 3 testovací úkoly
curl -X POST http://localhost:3000/api/todos -H "Content-Type: application/json" -d '{"title":"Úkol 1"}'
curl -X POST http://localhost:3000/api/todos -H "Content-Type: application/json" -d '{"title":"Úkol 2"}'
curl -X POST http://localhost:3000/api/todos -H "Content-Type: application/json" -d '{"title":"Úkol 3"}'

# Zobrazit všechny úkoly
curl http://localhost:3000/api/todos | jq

# Označit první úkol jako hotový
curl -X PATCH http://localhost:3000/api/todos/1

# Smazat druhý úkol
curl -X DELETE http://localhost:3000/api/todos/2
```

## 🤝 Contributing

1. Fork repozitář
2. Vytvořte feature branch (`git checkout -b feature/amazing-feature`)
3. Commit změny (`git commit -m 'Add amazing feature'`)
4. Push do branch (`git push origin feature/amazing-feature`)
5. Otevřete Pull Request

## 📄 Licence

MIT

## 👤 Autor

**Mysaak**
- GitHub: [@Mysaak](https://github.com/Mysaak)

Vytvořeno pomocí **Claude Code**

---

⭐ Pokud se vám projekt líbí, dejte mu hvězdičku na GitHubu!
