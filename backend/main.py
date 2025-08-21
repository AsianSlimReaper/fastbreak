from fastapi import FastAPI
from backend.api.routes import user, teams, dashboard, stats, player_profile,film_room,wasabi
from fastapi.middleware.cors import CORSMiddleware

# FastAPI application setup
app = FastAPI()


# Include routers for different API endpoints
app.include_router(user.router)
app.include_router(teams.router)
app.include_router(dashboard.router)
app.include_router(stats.router)
app.include_router(player_profile.router)
app.include_router(film_room.router)
app.include_router(wasabi.router)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
