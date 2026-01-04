const City = require('../models/City');
const citiesData = require('../../config/cities.json');

class CityService {
  getCityInfo(cityName) {
    const normalizedName = cityName.toLowerCase().trim();
    const cityData = citiesData.cities.find(
      city => city.name.toLowerCase() === normalizedName
    );

    if (!cityData) {
      return new City({
        name: cityName,
        country: 'Unknown',
        description: 'Information not available for this city yet.'
      });
    }

    return new City(cityData);
  }

  getAllCities() {
    return citiesData.cities.map(city => new City(city));
  }
}

module.exports = new CityService();

