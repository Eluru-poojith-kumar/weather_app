
import { CurrentWeather, ForecastData, ForecastItem } from '../types/weather';

// API key for OpenWeatherMap
const API_KEY = 'add514349fe5b237094bad2363d26cc5'; // Updated API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Helper to handle API errors
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch weather data');
  }
  return response.json();
};

// Get current weather by city name
export const getCurrentWeatherByCity = async (city: string): Promise<CurrentWeather> => {
  const response = await fetch(
    `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
  );
  return handleResponse(response);
};

// Get current weather by zip code
export const getCurrentWeatherByZip = async (zip: string, country = 'us'): Promise<CurrentWeather> => {
  const response = await fetch(
    `${BASE_URL}/weather?zip=${zip},${country}&units=metric&appid=${API_KEY}`
  );
  return handleResponse(response);
};

// Get current weather by coordinates
export const getCurrentWeatherByCoords = async (lat: number, lon: number): Promise<CurrentWeather> => {
  const response = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  return handleResponse(response);
};

// Get 5-day forecast by city name
export const getForecastByCity = async (city: string): Promise<ForecastData> => {
  const response = await fetch(
    `${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`
  );
  return handleResponse(response);
};

// Get 5-day forecast by zip code
export const getForecastByZip = async (zip: string, country = 'us'): Promise<ForecastData> => {
  const response = await fetch(
    `${BASE_URL}/forecast?zip=${zip},${country}&units=metric&appid=${API_KEY}`
  );
  return handleResponse(response);
};

// Get 5-day forecast by coordinates
export const getForecastByCoords = async (lat: number, lon: number): Promise<ForecastData> => {
  const response = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );
  return handleResponse(response);
};

// Get weather icon URL
export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Convert temperature from Celsius to Fahrenheit
export const celsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9) / 5 + 32;
};

// Format timestamp to readable date
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString();
};

// Format timestamp to readable time
export const formatTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Group forecast by day
export const groupForecastByDay = (forecast: ForecastData): Record<string, ForecastItem[]> => {
  return forecast.list.reduce((acc: Record<string, ForecastItem[]>, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});
};

// Get user's current position
export const getUserLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
};
