class Weather {
  constructor(data) {
    this.temperature = data.temperature;
    this.feelsLike = data.feelsLike;
    this.humidity = data.humidity;
    this.pressure = data.pressure;
    this.windSpeed = data.windSpeed;
    this.city = data.name;
    this.country = data.country;
    this.weatherCode = data.weatherCode;
    this.precipitation = data.precipitation || 0;
    this.hourlyForecast = data.hourlyForecast || [];
  }

  getWeatherDescription(code) {
    const weatherCodes = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    };
    return weatherCodes[code] || 'Unknown';
  }

  getWeatherIcon(code) {
    if (code === 0 || code === 1) return '☀️';
    if (code === 2) return '⛅';
    if (code === 3) return '☁️';
    if (code === 45 || code === 48) return '🌫️';
    if (code >= 51 && code <= 55) return '🌦️';
    if (code >= 61 && code <= 65) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '🌧️';
    if (code >= 85 && code <= 86) return '🌨️';
    if (code >= 95) return '⛈️';
    return '🌤️';
  }

  toJSON() {
    return {
      city: this.city,
      country: this.country,
      temperature: Math.round(this.temperature),
      feelsLike: Math.round(this.feelsLike),
      tempMin: Math.round(this.temperature - 2),
      tempMax: Math.round(this.temperature + 2),
      humidity: this.humidity,
      pressure: Math.round(this.pressure),
      description: this.getWeatherDescription(this.weatherCode),
      icon: this.getWeatherIcon(this.weatherCode),
      windSpeed: Math.round(this.windSpeed * 10) / 10,
      precipitation: this.precipitation,
      hourlyForecast: this.hourlyForecast.map(hour => ({
        time: hour.time,
        temperature: Math.round(hour.temperature),
        description: this.getWeatherDescription(hour.weatherCode),
        icon: this.getWeatherIcon(hour.weatherCode),
        precipitationProbability: hour.precipitationProbability
      }))
    };
  }
}

module.exports = Weather;

