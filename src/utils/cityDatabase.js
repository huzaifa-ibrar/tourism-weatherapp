const popularCities = [
  "Tokyo", "Delhi", "Shanghai", "São Paulo", "Mexico City", "Cairo",
  "Mumbai", "Beijing", "Dhaka", "Osaka", "New York", "Karachi",
  "Buenos Aires", "Chongqing", "Istanbul", "Kolkata", "Manila",
  "Lagos", "Rio de Janeiro", "Tianjin", "Kinshasa", "Guangzhou",
  "Los Angeles", "Moscow", "Shenzhen", "Lahore", "Bangalore",
  "Paris", "Bogotá", "Jakarta", "Chennai", "Lima", "Bangkok",
  "Seoul", "Nagoya", "Hyderabad", "London", "Tehran", "Chicago",
  "Chengdu", "Nanjing", "Wuhan", "Ho Chi Minh City", "Luanda",
  "Ahmedabad", "Kuala Lumpur", "Xi'an", "Hong Kong", "Dongguan",
  "Hangzhou", "Foshan", "Shenyang", "Riyadh", "Baghdad", "Santiago",
  "Surat", "Madrid", "Suzhou", "Pune", "Harbin", "Houston",
  "Dallas", "Toronto", "Dar es Salaam", "Miami", "Belo Horizonte",
  "Singapore", "Philadelphia", "Atlanta", "Fukuoka", "Khartoum",
  "Barcelona", "Johannesburg", "Saint Petersburg", "Qingdao",
  "Dalian", "Washington", "Yangon", "Alexandria", "Jinan", "Guadalajara",
  "Ankara", "Chittagong", "Melbourne", "Sydney", "Vancouver", "Montreal",
  "Berlin", "Rome", "Naples", "Hamburg", "Munich", "Milan",
  "Prague", "Vienna", "Budapest", "Warsaw", "Bucharest", "Sofia",
  "Athens", "Lisbon", "Stockholm", "Oslo", "Copenhagen", "Helsinki",
  "Dublin", "Brussels", "Amsterdam", "Zurich", "Geneva", "Manchester",
  "Birmingham", "Liverpool", "Edinburgh", "Glasgow", "Lyon", "Marseille",
  "Toulouse", "Nice", "Strasbourg", "Bordeaux", "Lille", "Venice",
  "Florence", "Bologna", "Turin", "Palermo", "Seville", "Valencia",
  "Zaragoza", "Málaga", "Bilbao", "Porto", "Rotterdam", "The Hague",
  "Antwerp", "Ghent", "Kraków", "Wrocław", "Poznań", "Gdańsk",
  "Zagreb", "Belgrade", "Sarajevo", "Skopje", "Tirana", "Kiev",
  "Minsk", "Vilnius", "Riga", "Tallinn", "Dubai", "Abu Dhabi",
  "Doha", "Kuwait City", "Muscat", "Manama", "Jerusalem", "Tel Aviv",
  "Amman", "Beirut", "Damascus", "Aleppo", "Casablanca", "Tunis",
  "Algiers", "Rabat", "Tripoli", "Accra", "Nairobi", "Addis Ababa",
  "Cape Town", "Durban", "Pretoria", "Lusaka", "Harare", "Maputo",
  "Kampala", "Kigali", "Antananarivo", "Dakar", "Bamako", "Abidjan",
  "Ouagadougou", "Niamey", "Conakry", "Freetown", "Monrovia",
  "Colombo", "Kathmandu", "Dhaka", "Islamabad", "Kabul", "Tashkent",
  "Almaty", "Bishkek", "Dushanbe", "Ashgabat", "Baku", "Yerevan",
  "Tbilisi", "Ulaanbaatar", "Pyongyang", "Hanoi", "Vientiane",
  "Phnom Penh", "Kuala Lumpur", "Bandar Seri Begawan", "Dili",
  "Port Moresby", "Suva", "Wellington", "Auckland", "Christchurch",
  "Brisbane", "Perth", "Adelaide", "Canberra", "Honolulu", "Anchorage",
  "Seattle", "Portland", "San Francisco", "San Diego", "Las Vegas",
  "Phoenix", "Denver", "Minneapolis", "Detroit", "Boston", "Baltimore",
  "Charlotte", "Jacksonville", "Indianapolis", "Columbus", "San Antonio",
  "Austin", "Oklahoma City", "Kansas City", "Memphis", "Louisville",
  "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Sacramento",
  "Long Beach", "Oakland", "Mesa", "Omaha", "Colorado Springs",
  "Raleigh", "Virginia Beach", "Tampa", "Orlando", "St. Louis",
  "Pittsburgh", "Cincinnati", "Cleveland", "Anaheim", "Buffalo",
  "Newark", "Havana", "Kingston", "Port-au-Prince", "Santo Domingo",
  "San Juan", "Panama City", "San José", "Tegucigalpa", "Managua",
  "San Salvador", "Guatemala City", "Belmopan", "Quito", "La Paz",
  "Asunción", "Montevideo", "Caracas", "Georgetown", "Paramaribo",
  "Cayenne", "Brasília", "Fortaleza", "Recife", "Salvador", "Curitiba"
];

function levenshteinDistance(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1].toLowerCase() === str2[j - 1].toLowerCase() ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[len1][len2];
}

function findSimilarCities(searchTerm, limit = 10) {
  const search = searchTerm.toLowerCase().trim();
  
  if (search.length < 2) {
    return [];
  }

  const scored = popularCities.map(city => {
    const cityLower = city.toLowerCase();
    let score = levenshteinDistance(search, cityLower);
    
    if (cityLower.startsWith(search)) {
      score -= 10;
    } else if (cityLower.includes(search)) {
      score -= 5;
    }
    
    if (search.length >= 3 && cityLower.startsWith(search.substring(0, 3))) {
      score -= 3;
    }

    return { city, score };
  });

  scored.sort((a, b) => a.score - b.score);
  
  return scored.slice(0, limit).map(item => item.city);
}

module.exports = { findSimilarCities, popularCities };

