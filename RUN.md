# How to Run the Airbnb Clone Application

Step-by-step instructions to run the Full Stack Airbnb Clone locally.

---

## Prerequisites

- Python 3.11+
- Node.js 20+
- Git

---

## 🐍 Backend (FastAPI + SQLite)

The backend uses FastAPI for API routing, SQLAlchemy 2.0 as the ORM, and SQLite as the database.

### 1. Activate the Virtual Environment

From the project root:

```bash
# macOS / Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 2. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Start the Backend API Server

```bash
PYTHONPATH=. uvicorn app.main:app --reload --port 8000
```

> **Note:** The database is created and seeded automatically on first startup. You do not need to run any seed script manually.

- API base URL: [http://localhost:8000/api/v1](http://localhost:8000/api/v1)
- Interactive Swagger docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## ⚡ Frontend (Next.js + Tailwind CSS)

The frontend is built with Next.js 15 (App Router) and styled using Tailwind CSS.

### 1. Install Dependencies

From the project root, navigate to the `frontend` folder:

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file inside the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 3. Start the Development Server

```bash
npm run dev
```

Open your browser at: [http://localhost:3000](http://localhost:3000)

### 4. Build for Production (Optional)

```bash
npm run build
npm start
```

---

## Running Both Services

Open two terminal windows:

**Terminal 1 — Backend:**
```bash
cd backend
PYTHONPATH=. uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
