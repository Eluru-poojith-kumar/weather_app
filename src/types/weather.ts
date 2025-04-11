
// Weather data types
export interface WeatherData {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface WindData {
  speed: number;
  deg: number;
}

export interface SysData {
  country: string;
  sunrise: number;
  sunset: number;
}

export interface CurrentWeather {
  weather: WeatherData[];
  main: MainData;
  wind: WindData;
  sys: SysData;
  name: string;
  dt: number;
  timezone: number;
}

// Forecast types
export interface ForecastItem {
  dt: number;
  main: MainData;
  weather: WeatherData[];
  dt_txt: string;
}

export interface ForecastData {
  list: ForecastItem[];
  city: {
    name: string;
    country: string;
  };
}

// Query types for saving searches
export interface WeatherQuery {
  id?: string;
  location: string;
  type: 'zipcode' | 'city' | 'coordinates';
  createdAt: string;
  notes?: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
}
