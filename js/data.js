const RESTAURANTS = [
  {
    id: 1, name: "The Juicy Burger", cuisine: "burger", price: 1,
    rating: 4.3, description: "Classic smash burgers with house-made sauces.",
    tags: ["casual", "fast", "american"], lat: 37.7849, lng: -122.4094,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80"
  },
  {
    id: 2, name: "Slice & Dice Pizza", cuisine: "pizza", price: 1,
    rating: 4.1, description: "NY-style slices by the piece or the pie.",
    tags: ["casual", "italian", "takeout"], lat: 37.7751, lng: -122.4183,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80"
  },
  {
    id: 3, name: "Sakura Sushi", cuisine: "sushi", price: 2,
    rating: 4.6, description: "Fresh rolls and sashimi from a family-owned kitchen.",
    tags: ["japanese", "seafood", "dine-in"], lat: 37.7899, lng: -122.4010,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&q=80"
  },
  {
    id: 4, name: "Green Bowl", cuisine: "healthy", price: 2,
    rating: 4.4, description: "Grain bowls, smoothies, and salads made fresh.",
    tags: ["vegan", "gluten-free", "healthy"], lat: 37.7820, lng: -122.4150,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80"
  },
  {
    id: 5, name: "Casa Taqueria", cuisine: "mexican", price: 1,
    rating: 4.2, description: "Street tacos, burritos, and elotes.",
    tags: ["mexican", "casual", "spicy"], lat: 37.7780, lng: -122.4220,
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80"
  },
  {
    id: 6, name: "Dragon Palace", cuisine: "chinese", price: 2,
    rating: 4.0, description: "Dim sum brunch and Cantonese dinner classics.",
    tags: ["chinese", "dim-sum", "family"], lat: 37.7953, lng: -122.4072,
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80"
  },
  {
    id: 7, name: "Bella Trattoria", cuisine: "italian", price: 3,
    rating: 4.7, description: "Handmade pasta and wood-fired dishes.",
    tags: ["italian", "romantic", "wine"], lat: 37.7870, lng: -122.4055,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80"
  },
  {
    id: 8, name: "Sweet Surrender", cuisine: "dessert", price: 1,
    rating: 4.5, description: "Artisan ice cream, crepes, and boba.",
    tags: ["dessert", "sweet", "casual"], lat: 37.7810, lng: -122.4110,
    image: "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&q=80"
  },
  {
    id: 9, name: "Fuego Mexican Grill", cuisine: "mexican", price: 2,
    rating: 4.3, description: "Elevated Mexican with craft margaritas.",
    tags: ["mexican", "bar", "upscale"], lat: 37.7760, lng: -122.4190,
    image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=400&q=80"
  },
  {
    id: 10, name: "Ramen House Taku", cuisine: "sushi", price: 2,
    rating: 4.4, description: "Rich tonkotsu broth and hand-pulled noodles.",
    tags: ["japanese", "ramen", "comfort"], lat: 37.7835, lng: -122.4035,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80"
  },
  {
    id: 11, name: "The Healthy Spot", cuisine: "healthy", price: 2,
    rating: 4.2, description: "Acai bowls, protein wraps, and cold press juice.",
    tags: ["healthy", "vegan", "quick"], lat: 37.7800, lng: -122.4170,
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80"
  },
  {
    id: 12, name: "Harvest Pizza Co.", cuisine: "pizza", price: 2,
    rating: 4.5, description: "Farm-to-table pizza with seasonal toppings.",
    tags: ["pizza", "artisan", "local"], lat: 37.7920, lng: -122.4125,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80"
  },
  {
    id: 13, name: "Golden Chopsticks", cuisine: "chinese", price: 1,
    rating: 3.9, description: "Fast and flavorful wok-tossed dishes.",
    tags: ["chinese", "fast", "takeout"], lat: 37.7940, lng: -122.4085,
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=80"
  },
  {
    id: 14, name: "Osteria Romano", cuisine: "italian", price: 3,
    rating: 4.6, description: "Roman classics in a cozy candlelit setting.",
    tags: ["italian", "pasta", "dine-in"], lat: 37.7860, lng: -122.4045,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80"
  },
  {
    id: 15, name: "Smash Bros Burgers", cuisine: "burger", price: 1,
    rating: 4.5, description: "Crispy smash patties, loaded fries, shakes.",
    tags: ["burgers", "american", "casual"], lat: 37.7795, lng: -122.4200,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80"
  }
];
