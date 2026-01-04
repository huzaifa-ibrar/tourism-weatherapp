const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const cityController = require('../controllers/cityController');

router.get('/weather/city/:city', weatherController.getWeatherByCity.bind(weatherController));
router.get('/weather/coordinates', weatherController.getWeatherByCoordinates.bind(weatherController));
router.get('/weather/suggestions', weatherController.getCitySuggestions.bind(weatherController));
router.get('/city/:city', cityController.getCityInfo.bind(cityController));
router.get('/cities', cityController.getAllCities.bind(cityController));

module.exports = router;

