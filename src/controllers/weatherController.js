const weatherService = require('../services/weatherService');

class WeatherController {
  async getWeatherByCity(req, res) {
    try {
      const { city } = req.params;
      const weather = await weatherService.getWeatherByCity(city);
      res.json({ success: true, data: weather.toJSON() });
    } catch (error) {
      console.log('Error caught:', error.code, error.message);
      
      if (error.code === 'MULTIPLE_MATCHES' && error.suggestions) {
        return res.status(200).json({ 
          success: false, 
          message: 'Did you mean one of these cities?',
          suggestions: error.suggestions
        });
      }
      
      if (error.code === 'NO_RESULTS' || error.message.includes('City not found')) {
        console.log('Fetching suggestions for:', req.params.city);
        const suggestions = await weatherService.searchCitySuggestions(req.params.city);
        console.log('Found suggestions:', suggestions.length);
        
        if (suggestions.length > 0) {
          return res.status(200).json({ 
            success: false, 
            message: 'City not found. Did you mean one of these?',
            suggestions: suggestions
          });
        }
      }
      
      const suggestions = await weatherService.searchCitySuggestions(req.params.city);
      if (suggestions.length > 0) {
        return res.status(200).json({ 
          success: false, 
          message: 'Could not find exact match. Did you mean one of these?',
          suggestions: suggestions
        });
      }
      
      res.status(404).json({ 
        success: false, 
        message: error.message || 'City not found. Please try a different search.',
        suggestions: []
      });
    }
  }

  async getWeatherByCoordinates(req, res) {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ 
          success: false, 
          message: 'Latitude and longitude are required' 
        });
      }

      const weather = await weatherService.getWeatherByCoordinates(lat, lon);
      res.json({ success: true, data: weather.toJSON() });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  async getCitySuggestions(req, res) {
    try {
      const { query } = req.query;
      
      if (!query) {
        return res.status(400).json({ 
          success: false, 
          message: 'Search query is required' 
        });
      }

      const suggestions = await weatherService.searchCitySuggestions(query);
      res.json({ success: true, data: suggestions });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
}

module.exports = new WeatherController();

