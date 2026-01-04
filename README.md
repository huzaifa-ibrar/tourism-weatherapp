# 🌍 Weather & City Tourism App

Hey! This is my Weather & City Tourism application that I built for my web development project. It combines real-time weather data with tourist information for cities around the world. Pretty cool if I say so myself! 😄

## 📖 What This Project Does

So basically, this app lets you search for any city and it shows you the current weather plus a bunch of tourist information like famous places to visit, things to do, and the best seasons to travel there. I wanted to make something that would actually be useful for people planning trips or just curious about different cities.

The coolest part? It has a 24-hour weather forecast with a carousel that you can scroll through, and it automatically detects your location if you click the "Use My Location" button!

## 🛠️ Technologies I Used

### Backend:
- **Node.js** - This is what runs my server-side code. I chose it because JavaScript everywhere = easier life!
- **Express.js** - This framework made setting up my API routes super simple. Like, way easier than doing it from scratch.
- **Axios** - For making HTTP requests to the weather APIs. Clean and promise-based.
- **CORS** - Had to use this to deal with cross-origin issues during development.

### Frontend:
- **HTML5** - Obviously! For the structure of the page.
- **CSS3** - Spent a LOT of time on this. Used CSS Grid, Flexbox, gradients, animations... basically everything to make it look modern.
- **Vanilla JavaScript (ES6+)** - No frameworks like React here! Wanted to show I can build stuff with pure JS. Used classes, async/await, arrow functions, etc.

### APIs I'm Using:
- **Open-Meteo API** - Free weather API (no API key needed which is AWESOME)
- **BigDataCloud Reverse Geocoding API** - For location detection

### Tools & Stuff:
- **Git/GitHub** - For version control (you're looking at it!)
- **npm** - Package manager for dependencies
- **dotenv** - For environment variables (though not really using it much since the API is free)

## 📁 Project Structure

Here's how I organized everything:

```
project/
│
├── server.js                      # Main server file - this is where Express starts
├── package.json                   # All my dependencies listed here
├── package-lock.json              # Auto-generated, keeps track of exact versions
│
├── config/
│   └── cities.json               # Database of 10 cities with tourist info
│
├── src/                          # Backend code (MVC pattern!)
│   ├── controllers/
│   │   ├── cityController.js     # Handles city search & info requests
│   │   └── weatherController.js  # Handles weather requests
│   │
│   ├── models/
│   │   ├── City.js              # City data model
│   │   └── Weather.js           # Weather data model
│   │
│   ├── services/
│   │   ├── cityService.js       # Business logic for cities
│   │   └── weatherService.js    # Business logic for weather API calls
│   │
│   ├── routes/
│   │   └── api.js               # All API routes defined here
│   │
│   └── utils/
│       └── cityDatabase.js      # Helper to load and search city data
│
└── public/                       # Frontend files (what users see)
    ├── index.html               # Main HTML page
    ├── css/
    │   └── style.css            # All my styles (1200+ lines!)
    └── js/
        └── app.js               # Frontend JavaScript logic

```

## 🎯 Main Files Explained

### `server.js`
This is the heart of the backend. It:
- Sets up the Express server
- Configures middleware (CORS, JSON parsing, static files)
- Connects all the routes
- Starts listening on port 3000

### `public/index.html`
The main HTML file. It has:
- Search section with input and location button
- Weather cards that show temperature, humidity, wind, etc.
- 24-hour forecast carousel with arrows
- City info sections (famous places, things to do, best seasons)
- A modal slider for viewing detailed info

### `public/css/style.css`
Where all the magic happens visually! Includes:
- Custom CSS variables for colors
- Gradient backgrounds (purple theme 💜)
- Responsive design with media queries
- Hover effects and animations
- Grid and Flexbox layouts for perfect alignment

### `public/js/app.js`
Frontend brain of the operation:
- `WeatherApp` class that handles everything
- API calls to the backend
- DOM manipulation
- Event listeners for search, location detection, carousel navigation
- Data display and formatting

### `src/routes/api.js`
Defines all the API endpoints:
- `POST /api/weather` - Get weather by city name
- `POST /api/weather/coordinates` - Get weather by lat/lon
- `GET /api/cities/search` - Search for cities
- `GET /api/cities/:cityName` - Get city info

### `config/cities.json`
My mini-database! Has info for 10 popular cities:
- Toronto, New York, London, Paris, Tokyo, Sydney, Dubai, Barcelona, Singapore, Rome
- Each city has description, famous places, things to do, and best visiting seasons

## ✨ Features I'm Proud Of

1. **Smart Search with Fuzzy Matching** - Even if you misspell a city, it'll find it! Uses Levenshtein distance algorithm.

2. **Carousel Navigation** - The 24-hour forecast doesn't just scroll, it's a proper carousel that shows the right number of items based on screen size.

3. **Responsive Design** - Looks good on everything from phones to ultrawide monitors.

4. **No API Keys Required** - Using free APIs so anyone can run this without signing up for anything!

5. **MVC Architecture** - Followed proper software design patterns. Controllers, Models, Services - the whole deal.

6. **Consistent Section Widths** - All sections align perfectly no matter what content is loaded.

## 🚀 How to Run This Thing

### Prerequisites:
- Node.js installed (I used v16+)
- npm (comes with Node.js)
- A web browser (duh 😅)

### Steps:

1. **Clone the repo:**
   ```bash
   git clone https://github.com/huzaifa-ibrar/tourism-weatherapp.git
   cd tourism-weatherapp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   This installs Express, Axios, CORS, and other packages.

3. **Start the server:**
   ```bash
   npm start
   ```
   Or if you want auto-restart during development:
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Go to `http://localhost:3000`

That's it! No environment variables to set up, no API keys to get, nothing complicated.

## 📱 How to Use the App

1. **Search for a city** - Type any city name in the search box
2. **Or use your location** - Click the green "Use My Location" button
3. **View weather** - See current temperature, feels like, humidity, wind speed
4. **Check forecast** - Use arrows to navigate through 24-hour forecast
5. **Explore tourism info** - Scroll down to see famous places and things to do
6. **Click "View All"** - Opens a modal with detailed info about attractions

## 🎨 Design Choices

I went with a **purple gradient theme** because:
- It's modern and eye-catching
- Different from the usual blue weather apps
- Looks professional but also fun

**Typography:** Using system fonts (San Francisco, Segoe UI, etc.) for fast loading and native feel.

**Layout:** Grid-based with consistent spacing. All sections have the same width (1200px max) with 35px padding.

**Animations:** Subtle hover effects and smooth transitions. Not too much, just enough to feel interactive.

## 🐛 Challenges I Faced

1. **Section Width Consistency** - Took me forever to make sure all sections stay the same width. Had to add `overflow: hidden` and `box-sizing: border-box` everywhere.

2. **Carousel Navigation** - Initially used scrolling but it made sections expand. Had to rebuild it as a proper carousel with transform animations.

3. **API Limitations** - Some free weather APIs are limited. Open-Meteo saved me though!

4. **Responsive Design** - Making the hourly forecast look good on all screen sizes was tricky.

## 📚 What I Learned

- How to build a full-stack app from scratch
- MVC architecture and why it matters
- Working with REST APIs
- CSS Grid and Flexbox (got pretty good at this!)
- Async/await and Promises
- Git for version control
- Debugging browser APIs (geolocation was fun...)

## 🔮 Future Improvements

If I have time, I'd like to add:
- [ ] 7-day weather forecast
- [ ] More cities in the database
- [ ] User accounts to save favorite cities
- [ ] Weather alerts/notifications
- [ ] Dark mode toggle
- [ ] Weather maps
- [ ] Share feature

## 📝 Notes

- The city database is pretty small (10 cities) but you can search any city for weather
- Weather updates are real-time but city info is from my static database
- Works best on modern browsers (Chrome, Firefox, Safari, Edge)

## 🤝 Credits

- **Weather Data:** Open-Meteo API
- **Icons:** Font Awesome
- **Geocoding:** BigDataCloud
- **Development:** Me! (with help from Stack Overflow, obviously 😂)

## 📄 License

MIT License - feel free to use this for your own projects!

---

Made with ☕ and lots of debugging by a student who probably should be studying for exams instead 😅

If you have any questions or find bugs, feel free to open an issue!
