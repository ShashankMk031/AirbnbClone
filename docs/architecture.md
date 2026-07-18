# Architecture Overview

## System Architecture

The Airbnb Clone follows a strict client-server architecture. The Next.js frontend and FastAPI backend are deployed as completely independent services. The frontend communicates with the backend **exclusively** through REST API calls over HTTPS. No direct database access is performed from the frontend.

```
┌──────────────────────────────────┐
│        Browser (Client)          │
└────────────────┬─────────────────┘
                 │ HTTPS
                 ▼
┌──────────────────────────────────┐
│   Next.js 15 (App Router)        │
│   Deployed on Vercel             │
│                                  │
│  Server Components               │
│  Client Components               │
│  API Service Layer               │
└────────────────┬─────────────────┘
                 │ HTTPS REST API
                 ▼
┌──────────────────────────────────┐
│   FastAPI Backend                │
│   Deployed on Render             │
│                                  │
│  API Router → Endpoints          │
│  Service Layer (Business Logic)  │
│  SQLAlchemy ORM                  │
└────────────────┬─────────────────┘
                 │
                 ▼
┌──────────────────────────────────┐
│   SQLite Database                │
│   (PostgreSQL-ready via ORM)     │
└──────────────────────────────────┘
```

---

## Frontend Architecture

### Directory Structure

```
frontend/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Homepage (dynamic)
│   ├── listings/[id]/page.tsx  # Listing detail (dynamic)
│   ├── trips/page.tsx          # Trips (force-dynamic)
│   ├── wishlist/page.tsx       # Wishlist (force-dynamic)
│   ├── host/dashboard/page.tsx # Host dashboard (force-dynamic)
│   ├── checkout/page.tsx       # Checkout (client component)
│   ├── messages/page.tsx       # Placeholder
│   ├── verify-identity/page.tsx # Placeholder
│   ├── error.tsx               # Global error boundary
│   └── not-found.tsx           # Global 404 page
├── components/
│   ├── common/                 # Shared UI components
│   ├── listings/               # Listing display components
│   ├── booking/                # Booking flow components
│   └── host/                   # Host dashboard components
├── services/                   # API client functions
│   ├── api.ts                  # Base HTTP client
│   ├── listings.ts
│   ├── bookings.ts
│   ├── wishlist.ts
│   └── reviews.ts
├── context/
│   └── RoleContext.tsx          # Guest / Host role switcher
├── types/                      # TypeScript interfaces
└── constants/
    └── pricing.ts              # Shared pricing constants
```

### Rendering Strategy

| Page | Strategy | Reason |
|------|----------|--------|
| Homepage | Dynamic (SSR) | Search params vary per request |
| Listing Detail | Dynamic (SSR) | ID param; wishlist state per user |
| Trips | `force-dynamic` | Booking cancellations must reflect immediately |
| Wishlist | `force-dynamic` | Heart toggles must reflect immediately |
| Host Dashboard | `force-dynamic` | New listings must appear after creation |
| Checkout | Client Component | Interactive form state |
| Placeholder pages | Static | No data fetching required |

### API Client

All frontend API calls are routed through `services/api.ts`, which:
- Reads `NEXT_PUBLIC_API_URL` from the environment
- Normalises trailing slashes to prevent double-slash URLs
- Attaches `Content-Type: application/json` headers
- Throws on non-2xx HTTP responses with the error message from the backend

---

## Backend Architecture

### Directory Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI app + lifespan startup seeder
│   ├── database.py             # SQLAlchemy engine and session factory
│   ├── api/
│   │   ├── router.py           # Aggregated API router
│   │   ├── deps.py             # Dependency injection (services, db session)
│   │   └── endpoints/
│   │       ├── listings.py     # Listing CRUD + reviews
│   │       ├── bookings.py     # Booking creation and cancellation
│   │       ├── wishlists.py    # Wishlist add/remove
│   │       ├── users.py        # User bookings, wishlist, wishlist-ids
│   │       └── auth.py         # (Stub — authentication placeholder)
│   ├── services/               # Business logic layer
│   │   ├── listing.py
│   │   ├── booking.py
│   │   ├── availability.py     # Date overlap detection
│   │   ├── review.py
│   │   └── wishlist.py
│   ├── models/                 # SQLAlchemy ORM models
│   │   ├── user.py
│   │   ├── listing.py
│   │   ├── booking.py
│   │   ├── review.py
│   │   └── wishlist.py
│   └── schemas/                # Pydantic v2 request/response schemas
│       ├── listing.py
│       ├── booking.py
│       ├── review.py
│       └── wishlist.py
└── seed.py                     # Demo data population
```

### Request Lifecycle

```
HTTP Request
      │
      ▼
FastAPI Router (router.py)
      │
      ▼
API Endpoint function (endpoints/)
      │  Dependency injection via Depends()
      ▼
Service Layer (services/)
      │  Domain validation and business rules
      ▼
SQLAlchemy ORM query
      │
      ▼
SQLite Database
      │
      ▼
Pydantic schema serialisation
      │
      ▼
HTTP Response (JSON)
```

### Startup Seeding

`main.py` uses FastAPI's `lifespan` context manager:

1. `Base.metadata.create_all()` — creates all tables if they do not exist
2. Queries the `listings` table to check for existing data
3. If the database is empty, calls `seed_data(db)` from `seed.py`
4. Logs each step to stdout for observability

This design is idempotent: restarting the server never re-seeds an already-populated database.

---

## Data Flow Examples

### Guest Views Wishlist

```
Browser → GET /wishlist (Next.js page)
       → Server Component fetches:
           GET /api/v1/users/4/wishlist        → listing items
           GET /api/v1/users/4/wishlist-ids    → listing_id → wishlist_id map
       → Renders ListingGrid with heart states
```

### Host Creates a Listing

```
Browser → POST /api/v1/listings/ (with host_id: 4)
       → Backend validates host exists
       → Inserts into listings table
       → Returns created listing JSON
       → Frontend: router.refresh()
       → Host Dashboard: GET /api/v1/listings/?host_id=4
       → New listing appears in dashboard and Explore
```

### Guest Cancels a Booking

```
Browser → PATCH /api/v1/bookings/{id}/cancel?guest_id=4
       → Backend validates guest ownership
       → Sets booking.status = CANCELLED
       → Returns updated booking JSON
       → Trips page re-renders with CANCELLED status
```
