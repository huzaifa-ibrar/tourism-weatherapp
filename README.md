https://tourism-weatherapp.vercel.app/
usemy vercel link above to access the webapp and try it out.

Weather & City Tourism Application
This is a full-stack web development project I designed to bridge the gap between real-time meteorological data and urban tourism. The goal was to create a functional, aesthetically pleasing tool for travelers to check local conditions while simultaneously discovering key attractions in major global cities.

Project Overview
The application allows users to search for any city to retrieve current weather metrics and a 24-hour forecast. Beyond basic weather data, the app integrates a curated "City Guide" feature that provides descriptions, top-rated landmarks, and seasonal travel advice. I also implemented a geolocation feature that enables users to fetch data for their current coordinates with a single click.

Technical Implementation
Backend Architecture
Node.js & Express: I utilized Node.js for the runtime environment and Express for the server framework. This allowed for efficient handling of API routes and middleware.

Axios: Employed for managing asynchronous HTTP requests to external weather services.

MVC Pattern: The backend is structured using the Model-View-Controller design pattern to ensure the code is modular, scalable, and easy to debug.

Frontend Development
Vanilla JavaScript (ES6+): I opted to avoid frameworks like React to demonstrate a strong command of core JavaScript concepts, including Classes, Async/Await, and DOM manipulation.

CSS3 & Responsive Design: The interface uses CSS Grid and Flexbox for layout management. I focused heavily on ensuring the application is fully responsive across mobile, tablet, and desktop breakpoints.

API Integration: The app fetches real-time data from the Open-Meteo API (for weather) and BigDataCloud (for reverse geocoding).

File Structure
The project is organized to maintain a clear separation of concerns:

/src/controllers: Logic for handling incoming requests and returning responses.

/src/services: Handles the business logic and external API communication.

/src/routes: Defines the RESTful API endpoints.

/public: Contains the client-side assets (HTML, CSS, and the main app.js logic).

/config: Stores the cities.json file, which acts as a lightweight database for tourist information.

Key Features
Fuzzy Search Logic: I implemented a Levenshtein distance algorithm so that the search bar remains functional even if a user provides a slightly misspelled city name.

Interactive Forecast Carousel: The 24-hour weather forecast is displayed in a custom-built carousel that adjusts the number of visible items based on the user's screen width.

Dynamic UI Updates: The interface updates seamlessly without page refreshes, providing a smooth, application-like user experience.

No-Key Dependency: By utilizing Open-Meteo, the project is easily portable and can be run locally without the need for complex environment variable setups for API keys.

Installation & Setup
To run this project locally, ensure you have Node.js (v16+) installed:

Clone the repository:

Bash

git clone https://github.com/huzaifa-ibrar/tourism-weatherapp.git
Install dependencies:

Bash

npm install
Launch the server:

Bash

npm start
Access the app: Navigate to http://localhost:3000 in your browser.

Reflective Summary
This project was a significant learning experience in managing full-stack synchronization. One of the primary challenges was maintaining consistent section widths across different data loads, which I resolved through disciplined use of the CSS box-sizing property and overflow management. Moving forward, I plan to expand the city database and implement a 7-day extended forecast feature.
