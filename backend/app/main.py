from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, engine, SessionLocal
from app.api.router import api_router
from app.models.listing import Listing

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Initialize database & Create tables if they do not exist
    print("✓ Database initialized", flush=True)
    try:
        Base.metadata.create_all(bind=engine)
        
        db = SessionLocal()
        try:
            # 2. Check whether the database already contains seed data
            has_listings = db.query(Listing).first() is not None
            if has_listings:
                print("✓ Existing data found — skipping seed", flush=True)
            else:
                print("✓ Empty database detected — seeding demo data", flush=True)
                import seed
                seed.seed_data(db)
        except Exception as err:
            print(f"Startup seeding failed: {err}", flush=True)
        finally:
            db.close()
    except Exception as e:
        print(f"Database initialization failed: {e}", flush=True)

    print("✓ Startup complete", flush=True)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# Set up CORS middleware to connect with Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include APIs
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def read_root():
    return {
        "status": "online",
        "project": settings.PROJECT_NAME,
        "docs_url": "/docs",
    }
