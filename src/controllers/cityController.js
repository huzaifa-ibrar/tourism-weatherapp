const cityService = require('../services/cityService');

class CityController {
  getCityInfo(req, res) {
    try {
      const { city } = req.params;
      const cityInfo = cityService.getCityInfo(city);
      res.json({ success: true, data: cityInfo.toJSON() });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  getAllCities(req, res) {
    try {
      const cities = cityService.getAllCities();
      res.json({ 
        success: true, 
        data: cities.map(city => city.toJSON()) 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
}

module.exports = new CityController();

