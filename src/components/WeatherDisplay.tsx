
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrentWeather } from '../types/weather';
import { celsiusToFahrenheit, formatDate, formatTime, getWeatherIconUrl } from '../services/weatherService';
import { Cloud, Droplets, Thermometer, Wind } from 'lucide-react';

interface WeatherDisplayProps {
  weather: CurrentWeather;
  units: 'metric' | 'imperial';
}

const WeatherDisplay = ({ weather, units }: WeatherDisplayProps) => {
  const temp = units === 'metric' 
    ? Math.round(weather.main.temp)
    : Math.round(celsiusToFahrenheit(weather.main.temp));

  const feelsLike = units === 'metric'
    ? Math.round(weather.main.feels_like)
    : Math.round(celsiusToFahrenheit(weather.main.feels_like));

  const getWeatherGradient = () => {
    const weatherType = weather.weather[0].main.toLowerCase();
    if (weatherType.includes('clear')) return 'bg-gradient-clear';
    if (weatherType.includes('cloud')) return 'bg-gradient-cloudy';
    if (weatherType.includes('rain') || weatherType.includes('drizzle')) return 'bg-gradient-rain';
    if (weatherType.includes('snow')) return 'bg-gradient-snow';
    if (weatherType.includes('thunderstorm')) return 'bg-gradient-storm';
    return 'bg-gradient-to-br from-blue-400 to-blue-600';
  };

  return (
    <Card className="w-full overflow-hidden">
      <div className={`${getWeatherGradient()} text-white p-6`}>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{weather.name}, {weather.sys.country}</h2>
            <p className="text-lg">{formatDate(weather.dt)}</p>
            <p className="text-4xl font-bold mt-4">{temp}°{units === 'metric' ? 'C' : 'F'}</p>
            <p className="text-lg">Feels like {feelsLike}°{units === 'metric' ? 'C' : 'F'}</p>
            <p className="text-xl capitalize mt-2">{weather.weather[0].description}</p>
          </div>
          <div className="flex flex-col items-center">
            <img 
              src={getWeatherIconUrl(weather.weather[0].icon)} 
              alt={weather.weather[0].description}
              className="w-24 h-24"
            />
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="flex flex-col items-center p-2 bg-secondary rounded-md">
            <Thermometer className="h-6 w-6 mb-1" />
            <p className="text-sm font-medium">Min/Max</p>
            <p>
              {Math.round(units === 'metric' ? weather.main.temp_min : celsiusToFahrenheit(weather.main.temp_min))}° / {Math.round(units === 'metric' ? weather.main.temp_max : celsiusToFahrenheit(weather.main.temp_max))}°
            </p>
          </div>
          <div className="flex flex-col items-center p-2 bg-secondary rounded-md">
            <Wind className="h-6 w-6 mb-1" />
            <p className="text-sm font-medium">Wind</p>
            <p>{weather.wind.speed} {units === 'metric' ? 'm/s' : 'mph'}</p>
          </div>
          <div className="flex flex-col items-center p-2 bg-secondary rounded-md">
            <Droplets className="h-6 w-6 mb-1" />
            <p className="text-sm font-medium">Humidity</p>
            <p>{weather.main.humidity}%</p>
          </div>
          <div className="flex flex-col items-center p-2 bg-secondary rounded-md">
            <Cloud className="h-6 w-6 mb-1" />
            <p className="text-sm font-medium">Pressure</p>
            <p>{weather.main.pressure} hPa</p>
          </div>
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <div>
            <p className="font-medium">Sunrise</p>
            <p>{formatTime(weather.sys.sunrise)}</p>
          </div>
          <div>
            <p className="font-medium">Sunset</p>
            <p>{formatTime(weather.sys.sunset)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherDisplay;
