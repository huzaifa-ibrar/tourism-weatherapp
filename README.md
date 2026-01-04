# 🌍 Weather & City Guide

A beautiful, modern web application that provides real-time weather data and comprehensive travel information for cities worldwide.

## ✨ Features

- 🎯 **Smart Location Detection** - Automatically detects your location and displays local weather
- 🌤️ **Real-Time Weather** - Current temperature, humidity, wind speed, and conditions
- 🏛️ **Famous Places** - Discover iconic landmarks and attractions
- 🎯 **Things To Do** - Curated activities and experiences
- 🌸 **Best Seasons** - Optimal times to visit each destination
- 🔍 **Fuzzy Search** - Find cities even with misspellings or partial names
- 📱 **Fully Responsive** - Beautiful on desktop, tablet, and mobile
- 🎨 **Modern UI** - Professional gradient design with smooth animations
- 🆓 **No API Key Required** - Uses free Open-Meteo API

## 🚀 Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Run the application:**
```bash
npm start
```

3. **Open your browser:**
```
http://localhost:3000
```

That's it! No configuration needed.

## 🏗️ Project Structure

```
project/
├── server.js                    # Express server
├── package.json                 # Dependencies
├── config/
│   └── cities.json             # 10 popular cities with tourist data
├── src/                        # Backend (MVC Pattern)
│   ├── models/                 # Data models
│   ├── controllers/            # Request handlers
│   ├── services/               # Business logic
│   ├── routes/                 # API routes
│   └── utils/                  # Helper functions
└── public/                     # Frontend
    ├── index.html
    ├── css/style.css
    └── js/app.js
```

## 🛠️ Technologies

- **Backend:** Node.js, Express
- **APIs:** Open-Meteo (weather), BigDataCloud (geocoding)
- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **Architecture:** MVC pattern with clean separation of concerns

## 📦 Cities Database

Pre-loaded with information for:
Toronto, New York, London, Paris, Tokyo, Sydney, Dubai, Barcelona, Singapore, Rome

## 🎨 Design Features

- Gradient backgrounds and cards
- Smooth animations and transitions
- Hover effects on interactive elements
- Professional typography
- Color-coded information sections
- Responsive grid layouts

## 📝 License

MIT License - Free to use and modify

## Project Structure
- `server.js` - Express server entry point
- `src/` - Backend MVC components
  - `controllers/` - Request handlers
  - `models/` - Data models
  - `services/` - Business logic
  - `routes/` - API routes
- `public/` - Frontend files
- `config/` - Configuration and data files
