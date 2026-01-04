class City {
  constructor(data) {
    this.name = data.name;
    this.country = data.country;
    this.famousPlaces = data.famousPlaces || [];
    this.thingsToDo = data.thingsToDo || [];
    this.bestSeasons = data.bestSeasons || [];
    this.description = data.description || '';
  }

  toJSON() {
    return {
      name: this.name,
      country: this.country,
      famousPlaces: this.famousPlaces,
      thingsToDo: this.thingsToDo,
      bestSeasons: this.bestSeasons,
      description: this.description
    };
  }
}

module.exports = City;

