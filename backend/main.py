from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI Task Marketplace API")


# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    
    allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Temporary backend data
# Later this can come from MongoDB
services = [
    {
        "id": 1,
        "title": "AC Repair",
        "category": "AC Repair",
        "description": "Professional AC repair and maintenance service.",
        "location": "Pune",
        "price": 499,
        "rating": 4.8,
        "reviews": 120,
        "image": "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80",
    },

    {
        "id": 2,
        "title": "Plumbing Service",
        "category": "Plumbing",
        "description": "Reliable plumbing repair and installation.",
        "location": "Pune",
        "price": 299,
        "rating": 4.7,
        "reviews": 95,
        "image": "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=800&q=80",
    },

    {
        "id": 3,
        "title": "Electrical Repair",
        "category": "Electrical",
        "description": "Professional electrical repair and maintenance.",
        "location": "Pune",
        "price": 399,
        "rating": 4.9,
        "reviews": 150,
        "image": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80",
    },

    {
        "id": 4,
        "title": "Home Cleaning",
        "category": "Cleaning",
        "description": "Complete home cleaning by trained professionals.",
        "location": "Pune",
        "price": 699,
        "rating": 4.6,
        "reviews": 80,
        "image": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    },

    {
        "id": 5,
        "title": "Carpentry Service",
        "category": "Carpentry",
        "description": "Furniture repair and professional carpentry work.",
        "location": "Pune",
        "price": 599,
        "rating": 4.8,
        "reviews": 70,
        "image": "https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=800&q=80",
    },

    {
        "id": 6,
        "title": "Wall Painting",
        "category": "Painting",
        "description": "Interior and exterior wall painting service.",
        "location": "Pune",
        "price": 999,
        "rating": 4.7,
        "reviews": 60,
       "image": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
    },
]


@app.get("/")
def home():
    return {
        "message": "AI Task Marketplace backend is running"
    }


@app.get("/api/tasks")
def get_tasks():
    return services