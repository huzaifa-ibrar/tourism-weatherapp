class WeatherApp {
    constructor() {
        this.apiBaseUrl = '/api';
        this.sliderData = [];
        this.currentSlideIndex = 0;
        this.currentSliderType = '';
        this.hourlyScrollSetup = false;
        this.initializeElements();
        this.attachEventListeners();
        this.loadDefaultLocation();
    }

    initializeElements() {
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.locationBtn = document.getElementById('locationBtn');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.errorMessage = document.getElementById('errorMessage');
        this.suggestionsSection = document.getElementById('suggestionsSection');
        this.suggestionsList = document.getElementById('suggestionsList');
        this.weatherSection = document.getElementById('weatherSection');
        this.cityInfoSection = document.getElementById('cityInfoSection');
    }

    attachEventListeners() {
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        this.locationBtn.addEventListener('click', () => this.getCurrentLocation());
    }

    showLoading() {
        this.loadingSpinner.classList.remove('hidden');
        this.hideError();
        this.hideSuggestions();
        this.weatherSection.classList.add('hidden');
        this.cityInfoSection.classList.add('hidden');
    }

    hideLoading() {
        this.loadingSpinner.classList.add('hidden');
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.remove('hidden');
        this.hideLoading();
    }

    hideError() {
        this.errorMessage.classList.add('hidden');
    }

    showSuggestions(suggestions) {
        this.suggestionsList.innerHTML = '';
        
        suggestions.forEach(city => {
            const card = document.createElement('div');
            card.className = 'suggestion-card';
            card.innerHTML = `
                <div class="city-name">${city.name}</div>
                <div class="city-details">${city.country}${city.admin1 ? ', ' + city.admin1 : ''}</div>
            `;
            card.addEventListener('click', () => {
                this.cityInput.value = city.name;
                this.loadCityData(city.name);
            });
            this.suggestionsList.appendChild(card);
        });

        this.suggestionsSection.classList.remove('hidden');
        this.hideLoading();
    }

    hideSuggestions() {
        this.suggestionsSection.classList.add('hidden');
    }

    async handleSearch() {
        const city = this.cityInput.value.trim();
        if (!city) {
            this.showError('Please enter a city name');
            return;
        }
        await this.loadCityData(city);
    }

    async getCurrentLocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by your browser');
            return;
        }

        this.showLoading();
        navigator.geolocation.getCurrentPosition(
            (position) => this.loadWeatherByCoordinates(
                position.coords.latitude,
                position.coords.longitude
            ),
            (error) => {
                this.showError('Unable to get your location. Please search for a city manually.');
                console.error('Geolocation error:', error);
            }
        );
    }

    async loadDefaultLocation() {
        this.getCurrentLocation();
    }

    async loadWeatherByCoordinates(lat, lon) {
        try {
            this.showLoading();
            const response = await fetch(
                `${this.apiBaseUrl}/weather/coordinates?lat=${lat}&lon=${lon}`
            );
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message);
            }

            this.displayWeather(result.data);
            await this.loadCityInfo(result.data.city);
            this.hideLoading();
        } catch (error) {
            this.showError(`Error: ${error.message}`);
        }
    }

    async loadCityData(city) {
        try {
            this.showLoading();
            
            const weatherResponse = await fetch(
                `${this.apiBaseUrl}/weather/city/${encodeURIComponent(city)}`
            );
            const weatherResult = await weatherResponse.json();
            
            console.log('Weather result:', weatherResult);
            console.log('Has suggestions?', weatherResult.suggestions);

            if (!weatherResult.success) {
                console.log('Not successful, checking suggestions...');
                if (weatherResult.suggestions && weatherResult.suggestions.length > 0) {
                    console.log('Showing', weatherResult.suggestions.length, 'suggestions');
                    this.showSuggestions(weatherResult.suggestions);
                    return;
                }
                this.hideLoading();
                this.showError(weatherResult.message || 'City not found');
                return;
            }

            this.displayWeather(weatherResult.data);
            await this.loadCityInfo(city);
            this.hideLoading();
        } catch (error) {
            console.error('Error in loadCityData:', error);
            this.hideLoading();
            this.showError(`Error: ${error.message}`);
        }
    }

    async loadCityInfo(city) {
        try {
            const response = await fetch(
                `${this.apiBaseUrl}/city/${encodeURIComponent(city)}`
            );
            const result = await response.json();

            if (result.success) {
                this.displayCityInfo(result.data);
            }
        } catch (error) {
            console.error('Error loading city info:', error);
        }
    }

    displayWeather(data) {
        document.getElementById('cityName').textContent = 
            `${data.city}, ${data.country}`;
        document.getElementById('temperature').textContent = data.temperature;
        document.getElementById('weatherDescription').textContent = data.description;
        document.getElementById('feelsLike').textContent = data.feelsLike;
        document.getElementById('tempRange').textContent = 
            `${data.tempMin} / ${data.tempMax}`;
        document.getElementById('humidity').textContent = data.humidity;
        document.getElementById('windSpeed').textContent = data.windSpeed;
        
        const weatherIcon = document.getElementById('weatherIcon');
        const iconClass = this.getWeatherIconClass(data.description.toLowerCase());
        weatherIcon.innerHTML = `<i class="${iconClass}"></i>`;

        this.displayHourlyForecast(data.hourlyForecast);

        this.weatherSection.classList.remove('hidden');
    }

    displayHourlyForecast(hourlyData) {
        const container = document.getElementById('hourlyForecast');
        container.innerHTML = '';
        
        // Store hourly data for carousel navigation
        this.hourlyData = hourlyData;
        this.currentHourIndex = 0;
        this.itemsPerView = this.getItemsPerView();

        hourlyData.forEach((hour, index) => {
            const time = new Date(hour.time);
            const timeStr = index === 0 ? 'Now' : time.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                hour12: true 
            });

            const iconClass = this.getWeatherIconClass(hour.description.toLowerCase());
            
            const hourItem = document.createElement('div');
            hourItem.className = 'hourly-item';
            hourItem.innerHTML = `
                <div class="hourly-time">${timeStr}</div>
                <div class="hourly-icon"><i class="${iconClass}"></i></div>
                <div class="hourly-temp">${hour.temperature}°</div>
                <div class="hourly-rain"><i class="fas fa-droplet"></i> ${hour.precipitationProbability}%</div>
            `;
            
            container.appendChild(hourItem);
        });

        if (!this.hourlyScrollSetup) {
            this.setupHourlyScroll();
            this.hourlyScrollSetup = true;
        }
        
        // Update scroll position
        this.updateHourlyScroll();
    }
    
    getItemsPerView() {
        const width = window.innerWidth;
        if (width <= 480) return 3;
        if (width <= 768) return 5;
        if (width <= 1024) return 7;
        return 8;
    }

    setupHourlyScroll() {
        const scrollLeft = document.getElementById('scrollLeft');
        const scrollRight = document.getElementById('scrollRight');

        if (!scrollLeft || !scrollRight) {
            console.error('Hourly scroll elements not found');
            return;
        }

        scrollLeft.onclick = () => {
            this.scrollHourlyLeft();
        };

        scrollRight.onclick = () => {
            this.scrollHourlyRight();
        };
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.itemsPerView = this.getItemsPerView();
            this.updateHourlyScroll();
        });
    }
    
    scrollHourlyLeft() {
        if (this.currentHourIndex > 0) {
            this.currentHourIndex--;
            this.updateHourlyScroll();
        }
    }
    
    scrollHourlyRight() {
        const maxIndex = Math.max(0, this.hourlyData.length - this.itemsPerView);
        if (this.currentHourIndex < maxIndex) {
            this.currentHourIndex++;
            this.updateHourlyScroll();
        }
    }
    
    updateHourlyScroll() {
        const container = document.getElementById('hourlyForecast');
        if (!container) return;
        
        const itemWidth = 110; // width of each hourly-item
        const gap = 15; // gap between items
        const translateX = -(this.currentHourIndex * (itemWidth + gap));
        
        container.style.transform = `translateX(${translateX}px)`;
    }

    getWeatherIconClass(description) {
        if (description.includes('clear') || description.includes('sunny')) {
            return 'fas fa-sun';
        } else if (description.includes('cloud')) {
            return 'fas fa-cloud';
        } else if (description.includes('rain') || description.includes('drizzle')) {
            return 'fas fa-cloud-rain';
        } else if (description.includes('thunder') || description.includes('storm')) {
            return 'fas fa-bolt';
        } else if (description.includes('snow')) {
            return 'fas fa-snowflake';
        } else if (description.includes('fog') || description.includes('mist')) {
            return 'fas fa-smog';
        } else if (description.includes('partly')) {
            return 'fas fa-cloud-sun';
        } else {
            return 'fas fa-cloud-sun';
        }
    }

    displayCityInfo(data) {
        document.getElementById('infoCity').textContent = data.name;
        document.getElementById('cityDescription').textContent = 
            data.description || 'Information not available for this city.';

        this.displayFamousPlaces(data.famousPlaces || []);
        this.displayThingsToDo(data.thingsToDo || []);
        this.displayBestSeasons(data.bestSeasons || []);

        this.cityInfoSection.classList.remove('hidden');
    }

    displayFamousPlaces(places) {
        const grid = document.getElementById('famousPlacesGrid');
        const count = document.getElementById('famousPlacesCount');
        
        grid.innerHTML = '';
        count.textContent = `${places.length} ${places.length === 1 ? 'place' : 'places'}`;

        const icons = ['fa-landmark', 'fa-monument', 'fa-building', 'fa-place-of-worship', 'fa-tower-observation', 'fa-archway'];
        const previewPlaces = places.slice(0, 3);
        previewPlaces.forEach((place, index) => {
            const card = document.createElement('div');
            card.className = 'preview-card';
            const iconClass = icons[index % icons.length];
            card.innerHTML = `
                <div class="preview-card-icon"><i class="fas ${iconClass}"></i></div>
                <div class="preview-card-title">${place}</div>
            `;
            card.onclick = () => this.openSlider('famousPlaces', index);
            grid.appendChild(card);
        });

        this.famousPlacesData = places;
    }

    displayThingsToDo(things) {
        const grid = document.getElementById('thingsToDoGrid');
        const count = document.getElementById('thingsToDoCount');
        
        grid.innerHTML = '';
        count.textContent = `${things.length} ${things.length === 1 ? 'activity' : 'activities'}`;

        const icons = ['fa-compass', 'fa-hiking', 'fa-camera', 'fa-utensils', 'fa-shopping-bag', 'fa-ticket-alt'];
        const previewThings = things.slice(0, 3);
        previewThings.forEach((thing, index) => {
            const card = document.createElement('div');
            card.className = 'preview-card';
            const iconClass = icons[index % icons.length];
            card.innerHTML = `
                <div class="preview-card-icon"><i class="fas ${iconClass}"></i></div>
                <div class="preview-card-title">${thing}</div>
            `;
            card.onclick = () => this.openSlider('thingsToDo', index);
            grid.appendChild(card);
        });

        this.thingsToDoData = things;
    }

    displayBestSeasons(seasons) {
        const list = document.getElementById('bestSeasonsList');
        list.innerHTML = '';

        const icons = ['fa-sun', 'fa-leaf', 'fa-snowflake'];
        if (seasons.length > 0) {
            seasons.forEach((season, index) => {
                const p = document.createElement('p');
                const iconClass = icons[index % icons.length];
                p.innerHTML = `<i class="fas ${iconClass}"></i> ${season}`;
                list.appendChild(p);
            });
        } else {
            list.innerHTML = '<p>Information not available</p>';
        }
    }

    openSlider(type, startIndex = 0) {
        this.currentSliderType = type;
        this.currentSlideIndex = startIndex;

        if (type === 'famousPlaces') {
            this.sliderData = this.famousPlacesData || [];
            document.getElementById('sliderTitle').innerHTML = '<i class="fas fa-landmark"></i> Famous Places';
        } else if (type === 'thingsToDo') {
            this.sliderData = this.thingsToDoData || [];
            document.getElementById('sliderTitle').innerHTML = '<i class="fas fa-compass"></i> Things To Do';
        }

        this.updateSlide();
        this.createDots();
        document.getElementById('sliderModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeSlider() {
        document.getElementById('sliderModal').classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    updateSlide() {
        if (this.sliderData.length === 0) return;

        const item = this.sliderData[this.currentSlideIndex];
        
        const famousPlaceIcons = ['fa-landmark', 'fa-monument', 'fa-building', 'fa-place-of-worship', 'fa-tower-observation', 'fa-archway', 'fa-gopuram', 'fa-mosque', 'fa-synagogue', 'fa-church'];
        const activityIcons = ['fa-compass', 'fa-hiking', 'fa-camera', 'fa-utensils', 'fa-shopping-bag', 'fa-ticket-alt', 'fa-palette', 'fa-music', 'fa-theater-masks', 'fa-binoculars'];
        
        let iconClass;
        if (this.currentSliderType === 'famousPlaces') {
            iconClass = famousPlaceIcons[this.currentSlideIndex % famousPlaceIcons.length];
        } else {
            iconClass = activityIcons[this.currentSlideIndex % activityIcons.length];
        }

        document.getElementById('slideIcon').innerHTML = `<i class="fas ${iconClass}"></i>`;
        document.getElementById('slideItemTitle').textContent = item;
        document.getElementById('slideItemDescription').textContent = 
            `Explore this amazing ${this.currentSliderType === 'famousPlaces' ? 'landmark' : 'activity'} during your visit!`;
        
        document.getElementById('currentSlide').textContent = this.currentSlideIndex + 1;
        document.getElementById('totalSlides').textContent = this.sliderData.length;

        this.updateDots();
    }

    nextSlide() {
        this.currentSlideIndex = (this.currentSlideIndex + 1) % this.sliderData.length;
        this.updateSlide();
    }

    prevSlide() {
        this.currentSlideIndex = (this.currentSlideIndex - 1 + this.sliderData.length) % this.sliderData.length;
        this.updateSlide();
    }

    createDots() {
        const dotsContainer = document.getElementById('sliderDots');
        dotsContainer.innerHTML = '';

        this.sliderData.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.onclick = () => {
                this.currentSlideIndex = index;
                this.updateSlide();
            };
            dotsContainer.appendChild(dot);
        });
    }

    updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === this.currentSlideIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
}

let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new WeatherApp();
});

document.addEventListener('keydown', (e) => {
    if (!document.getElementById('sliderModal').classList.contains('hidden')) {
        if (e.key === 'ArrowRight') app.nextSlide();
        if (e.key === 'ArrowLeft') app.prevSlide();
        if (e.key === 'Escape') app.closeSlider();
    }
});

