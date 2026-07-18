# Airbnb Clone

A full-stack Airbnb-inspired accommodation booking platform built with **Next.js** and **FastAPI**. The application allows guests to browse properties, manage wishlists, make bookings, and allows hosts to create and manage listings through a dedicated dashboard.

---

## Live Demo

| Service | URL |
|---------|-----|
| Frontend | https://airbnb-clone-beta-neon.vercel.app |
| Backend API | https://airbnbclone-assignment.onrender.com |
| API Documentation | https://airbnbclone-assignment.onrender.com/docs |

---

## Features

### Guest Features

- Browse accommodation listings with pagination
- Search listings by title or location
- Filter by property type, price, and sort order
- View listing details with photo gallery, amenities, and reviews
- Interactive location map (OpenStreetMap + Leaflet)
- Wishlist management with real-time heart toggles
- Mock checkout flow with guest count and date selection
- Book listings with availability validation
- View all booked trips
- Cancel confirmed bookings
- Dark mode (light / dark / system)
- Fully responsive mobile interface

### Host Features

- Dedicated host dashboard
- Create new listings via modal form
- Delete existing listings with confirmation
- View all listings owned by the host

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| Next.js 15 (App Router) | Framework and server-side rendering |
| React 19 | Component model |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| next-themes | Dark / light / system theme |
| Leaflet + OpenStreetMap | Interactive maps |
| Lucide React | Icon library |

### Backend

| Technology | Purpose |
|------------|---------|
| FastAPI | API framework |
| SQLAlchemy 2.0 | ORM |
| Pydantic v2 | Data validation and serialisation |
| SQLite | Relational database |
| Uvicorn | ASGI server |

### Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Render |

---

## Project Architecture

The application follows a strict client-server architecture. The frontend communicates **exclusively** with the backend through REST APIs. No direct database access is performed from the frontend.

```
Browser
    │
    ▼
Next.js Frontend (Vercel)
    │
 HTTPS REST API
    │
    ▼
FastAPI Backend (Render)
    │
 Service Layer
    │
 SQLAlchemy ORM
    │
    ▼
SQLite Database
```

### Backend Architecture

```
backend/
├── app/
│   ├── api/
│   │   ├── deps.py              # Dependency injection
│   │   ├── router.py            # Route registration
│   │   └── endpoints/
│   │       ├── listings.py
│   │       ├── bookings.py
│   │       ├── reviews.py
│   │       ├── wishlists.py
│   │       └── users.py
│   ├── services/                # Business logic layer
│   │   ├── listing.py
│   │   ├── booking.py
│   │   ├── availability.py
│   │   ├── review.py
│   │   └── wishlist.py
│   ├── models/                  # SQLAlchemy ORM models
│   ├── schemas/                 # Pydantic schemas
│   ├── database.py              # DB engine and session
│   └── main.py                  # App entrypoint + lifespan seeding
└── seed.py                      # Demo data seeder
```

**Request flow:**

```
HTTP Request → API Endpoint → Service Layer → SQLAlchemy → SQLite
```

**Startup behaviour:** On every server start, `main.py` checks whether the database contains data. If the database is empty, `seed.py` is executed automatically to populate demo users, listings, bookings, reviews, and wishlists.

---

## Database Schema

### User

| Field | Type | Notes |
|-------|------|-------|
| id | Integer | Primary key |
| full_name | String | |
| email | String | Unique |
| role | Enum | `GUEST` / `HOST` |
| avatar_url | String | Optional |
| created_at | DateTime | |

### Listing

| Field | Type | Notes |
|-------|------|-------|
| id | Integer | Primary key |
| host_id | Integer | FK → User |
| title | String | |
| description | String | |
| location | String | |
| latitude | Float | Optional |
| longitude | Float | Optional |
| price_per_night | Float | Must be > 0 |
| property_type | String | |
| max_guests | Integer | |
| bedrooms | Integer | |
| bathrooms | Float | |
| amenities | JSON | List of strings |
| photos | JSON | List of URLs |
| rating | Float | Auto-maintained from reviews |
| review_count | Integer | Auto-maintained from reviews |
| created_at | DateTime | |

### Booking

| Field | Type | Notes |
|-------|------|-------|
| id | Integer | Primary key |
| listing_id | Integer | FK → Listing |
| guest_id | Integer | FK → User |
| check_in | Date | |
| check_out | Date | |
| guest_count | Integer | |
| total_price | Float | Calculated at creation |
| status | Enum | `CONFIRMED` / `CANCELLED` |
| created_at | DateTime | |

### Wishlist

| Field | Type | Notes |
|-------|------|-------|
| id | Integer | Primary key |
| user_id | Integer | FK → User |
| listing_id | Integer | FK → Listing |
| created_at | DateTime | |

### Review

| Field | Type | Notes |
|-------|------|-------|
| id | Integer | Primary key |
| listing_id | Integer | FK → Listing |
| reviewer_id | Integer | FK → User |
| rating | Float | 1.0 – 5.0 |
| comment | String | |
| created_at | DateTime | |

---

## API Overview

All endpoints are prefixed with `/api/v1`.

### Listings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/listings/` | Paginated listings (supports `search`, `property_type`, `sort_by`, `host_id`, `page`, `page_size`) |
| GET | `/listings/{id}` | Listing detail with host info and availability |
| POST | `/listings/` | Create a new listing |
| PUT | `/listings/{id}` | Update a listing (owner only) |
| DELETE | `/listings/{id}` | Delete a listing (owner only) |
| GET | `/listings/{id}/reviews` | Paginated reviews for a listing |

### Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/bookings/` | Create a booking with availability check |
| GET | `/bookings/` | List all bookings |
| GET | `/bookings/{id}` | Get booking by ID |
| PATCH | `/bookings/{id}/cancel` | Cancel a confirmed booking (`?guest_id=`) |

### Wishlist

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/wishlist/` | Add a listing to wishlist |
| DELETE | `/wishlist/{id}` | Remove a wishlist entry |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/{id}/bookings` | Get all bookings for a user |
| GET | `/users/{id}/wishlist` | Get wishlisted listings for a user |
| GET | `/users/{id}/wishlist-ids` | Get `listing_id → wishlist_id` mapping |

### Reviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/reviews/` | Create a review |

---

## Setup Instructions

### Prerequisites

- Node.js 20+
- Python 3.11+
- Git

### Clone the Repository

```bash
git clone https://github.com/ShashankMk031/AirbnbClone.git
cd AirbnbClone
```

### Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv .venv

# macOS / Linux
source .venv/bin/activate

# Windows
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

Run the backend server:

```bash
PYTHONPATH=. uvicorn app.main:app --reload --port 8000
```

> The database is automatically created and seeded with demo data on first startup. Manual seeding is not required.

- API base: `http://localhost:8000/api/v1`
- Swagger UI: `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend

npm install
```

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

Run the development server:

```bash
npm run dev
```

Frontend runs at `http://localhost:3000`.

---

## Environment Variables

### Frontend

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Full base URL of the FastAPI backend including `/api/v1` | `http://localhost:8000/api/v1` |

> For Vercel deployment, set `NEXT_PUBLIC_API_URL` in the Vercel project environment variables dashboard.

No additional environment variables are required for the backend in local development.

---

## Assumptions

- Authentication is mocked using predefined demo users (Guest ID 4 — Rohan Das, Host ID 4).
- Payments are simulated; no payment gateway is integrated.
- SQLite is used for simplicity and portability during development and assessment.
- Property images are represented as URLs rather than uploaded files.
- The application is built for educational and assessment purposes and is not production-hardened for security, authentication, or financial transactions.

---

## Future Improvements

- JWT-based authentication and session management
- Role-based access control
- Cloud image upload (AWS S3 / Cloudinary)
- Stripe payment gateway integration
- Real-time guest–host messaging (WebSockets)
- Availability calendar UI
- Listing editing by host
- Email notifications (booking confirmations, cancellations)
- PostgreSQL migration for production
- Docker / Docker Compose support
- End-to-end test suite (Playwright)

---

## License

This project is released under the [MIT License](LICENSE).
