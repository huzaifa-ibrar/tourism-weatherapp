const axios = require('axios');
const Weather = require('../models/Weather');
const { findSimilarCities } = require('../utils/cityDatabase');

class WeatherService {
  constructor() {
    this.geocodeUrl = 'https://geocoding-api.open-meteo.com/v1/search';
    this.weatherUrl = 'https://api.open-meteo.com/v1/forecast';
  }

  async getCoordinatesFromCity(cityName) {
    const response = await axios.get(this.geocodeUrl, {
      params: {
        name: cityName,
        count: 10,
        language: 'en',
        format: 'json'
      }
    });

    if (!response.data.results || response.data.results.length === 0) {
      const error = new Error('City not found');
      error.code = 'NO_RESULTS';
      throw error;
    }

    const results = response.data.results;
    const searchLower = cityName.toLowerCase().trim();
    
    const exactMatch = results.find(city => 
      city.name.toLowerCase() === searchLower
    );

    if (exactMatch) {
      return {
        lat: exactMatch.latitude,
        lon: exactMatch.longitude,
        name: exactMatch.name,
        country: exactMatch.country || exactMatch.country_code || 'Unknown'
      };
    }

    if (results.length === 1) {
      const city = results[0];
      return {
        lat: city.latitude,
        lon: city.longitude,
        name: city.name,
        country: city.country || city.country_code || 'Unknown'
      };
    }

    const error = new Error('Multiple cities found');
    error.code = 'MULTIPLE_MATCHES';
    error.suggestions = results.map(city => ({
      name: city.name,
      country: city.country || city.country_code || 'Unknown',
      admin1: city.admin1 || '',
      lat: city.latitude,
      lon: city.longitude
    }));
    throw error;
  }

  async searchCitySuggestions(cityName) {
    try {
      let suggestions = [];
      
      const fullSearch = await axios.get(this.geocodeUrl, {
        params: {
          name: cityName,
          count: 10,
          language: 'en',
          format: 'json'
        }
      });

      if (fullSearch.data.results && fullSearch.data.results.length > 0) {
        suggestions = fullSearch.data.results;
      } else {
        const similarCities = findSimilarCities(cityName, 10);
        
        for (const similarCity of similarCities) {
          try {
            const citySearch = await axios.get(this.geocodeUrl, {
              params: {
                name: similarCity,
                count: 1,
                language: 'en',
                format: 'json'
              }
            });
            
            if (citySearch.data.results && citySearch.data.results.length > 0) {
              suggestions.push(citySearch.data.results[0]);
            }
          } catch (err) {
            continue;
          }
        }
      }

      return suggestions.slice(0, 10).map(city => ({
        name: city.name,
        country: city.country || city.country_code || 'Unknown',
        admin1: city.admin1 || '',
        lat: city.latitude,
        lon: city.longitude
      }));
    } catch (error) {
      console.error('Error fetching suggestions:', error.message);
      
      const similarCities = findSimilarCities(cityName, 10);
      const fallbackSuggestions = [];
      
      for (const city of similarCities) {
        fallbackSuggestions.push({
          name: city,
          country: 'Unknown',
          admin1: '',
          lat: 0,
          lon: 0
        });
      }
      
      return fallbackSuggestions;
    }
  }

  async getWeatherByCity(cityName) {
    try {
      const coords = await this.getCoordinatesFromCity(cityName);
      const weatherData = await this.fetchWeatherData(coords.lat, coords.lon);
      
      return new Weather({
        ...weatherData,
        name: coords.name,
        country: coords.country
      });
    } catch (error) {
      if (error.code === 'MULTIPLE_MATCHES' || error.code === 'NO_RESULTS') {
        throw error;
      }
      throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
  }

  async getWeatherByCoordinates(lat, lon) {
    try {
      let cityName = 'Your Location';
      let country = '';

      try {
        const reverseGeocode = await axios.get('https://api.bigdatacloud.net/data/reverse-geocode-client', {
          params: {
            latitude: lat,
            longitude: lon,
            localityLanguage: 'en'
          }
        });

        if (reverseGeocode.data) {
          cityName = reverseGeocode.data.city || reverseGeocode.data.locality || reverseGeocode.data.principalSubdivision || 'Your Location';
          country = reverseGeocode.data.countryCode || reverseGeocode.data.countryName || '';
        }
      } catch (geocodeError) {
        console.log('Reverse geocoding failed, using coordinates only');
      }

      const weatherData = await this.fetchWeatherData(lat, lon);
      
      return new Weather({
        ...weatherData,
        name: cityName,
        country: country
      });
    } catch (error) {
      throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
  }

  async fetchWeatherData(lat, lon) {
    const response = await axios.get(this.weatherUrl, {
      params: {
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,pressure_msl',
        hourly: 'temperature_2m,weather_code,precipitation_probability',
        timezone: 'auto',
        forecast_days: 2
      }
    });

    const current = response.data.current;
    const hourly = response.data.hourly;
    
    const currentTime = new Date(current.time);
    const hourlyForecast = [];
    
    for (let i = 0; i < 24 && i < hourly.time.length; i++) {
      const forecastTime = new Date(hourly.time[i]);
      if (forecastTime >= currentTime) {
        hourlyForecast.push({
          time: hourly.time[i],
          temperature: hourly.temperature_2m[i],
          weatherCode: hourly.weather_code[i],
          precipitationProbability: hourly.precipitation_probability[i] || 0
        });
      }
      if (hourlyForecast.length >= 24) break;
    }
    
    return {
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      pressure: current.pressure_msl,
      windSpeed: current.wind_speed_10m,
      weatherCode: current.weather_code,
      precipitation: current.precipitation,
      hourlyForecast: hourlyForecast
    };
  }
}

module.exports = new WeatherService();

