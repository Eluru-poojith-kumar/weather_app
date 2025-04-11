
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import LocationSearch from '../components/LocationSearch';
import Header from '../components/Header';
import WeatherSection from '../components/WeatherSection';
import Footer from '../components/Footer';
import { 
  getCurrentWeatherByCity, 
  getCurrentWeatherByZip, 
  getCurrentWeatherByCoords,
  getForecastByCity,
  getForecastByZip,
  getForecastByCoords,
  getUserLocation
} from '../services/weatherService';
import { 
  getAllQueries,
  createQuery,
  updateQuery,
  deleteQuery
} from '../services/queryStorage';
import { CurrentWeather, ForecastData, WeatherQuery } from '../types/weather';

const Index = () => {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [savedQueries, setSavedQueries] = useState<WeatherQuery[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [activeTab, setActiveTab] = useState('weather');

  // Load saved queries on initial render
  useEffect(() => {
    setSavedQueries(getAllQueries());
  }, []);

  const handleSearch = async (query: string, type: 'city' | 'zipcode' | 'coordinates') => {
    setIsLoading(true);
    try {
      let weatherData, forecastData;
      
      if (type === 'city') {
        weatherData = await getCurrentWeatherByCity(query);
        forecastData = await getForecastByCity(query);
      } else if (type === 'zipcode') {
        weatherData = await getCurrentWeatherByZip(query);
        forecastData = await getForecastByZip(query);
      } else {
        // Coordinates
        const [lat, lon] = query.split(',').map(Number);
        weatherData = await getCurrentWeatherByCoords(lat, lon);
        forecastData = await getForecastByCoords(lat, lon);
      }
      
      setCurrentWeather(weatherData);
      setForecast(forecastData);
      
    } catch (error) {
      console.error('Error fetching weather data:', error);
      toast.error('Failed to fetch weather data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const position = await getUserLocation();
      const { latitude, longitude } = position.coords;
      
      const weatherData = await getCurrentWeatherByCoords(latitude, longitude);
      const forecastData = await getForecastByCoords(latitude, longitude);
      
      setCurrentWeather(weatherData);
      setForecast(forecastData);
      
    } catch (error) {
      console.error('Error fetching location or weather data:', error);
      toast.error('Failed to get your location. Please ensure location permission is granted.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveQuery = (query: Omit<WeatherQuery, 'id'>) => {
    const newQuery = createQuery(query);
    setSavedQueries(getAllQueries());
    toast.success('Location saved successfully!');
  };

  const handleUpdateQuery = (id: string, updates: Partial<WeatherQuery>) => {
    const updated = updateQuery(id, updates);
    if (updated) {
      setSavedQueries(getAllQueries());
      toast.success('Location updated successfully!');
    } else {
      toast.error('Failed to update location.');
    }
  };

  const handleDeleteQuery = (id: string) => {
    const success = deleteQuery(id);
    if (success) {
      setSavedQueries(getAllQueries());
      toast.success('Location deleted successfully!');
    } else {
      toast.error('Failed to delete location.');
    }
  };

  const handleLoadQuery = (query: WeatherQuery) => {
    if (query.type === 'coordinates' && query.coordinates) {
      handleSearch(`${query.coordinates.lat},${query.coordinates.lon}`, 'coordinates');
    } else {
      handleSearch(query.location, query.type as 'city' | 'zipcode');
    }
    setActiveTab('weather');
  };

  const toggleUnits = () => {
    setUnits(units === 'metric' ? 'imperial' : 'metric');
  };

  const handleSaveLocation = () => {
    if (currentWeather) {
      const type = 'city';
      handleSaveQuery({
        location: currentWeather.name,
        type,
        createdAt: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        units={units}
        onToggleUnits={toggleUnits}
      />

      <main className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <LocationSearch 
            onSearch={handleSearch} 
            onUseCurrentLocation={handleUseCurrentLocation}
            isLoading={isLoading}
          />
        </div>

        <WeatherSection 
          isLoading={isLoading}
          currentWeather={currentWeather}
          forecast={forecast}
          savedQueries={savedQueries}
          units={units}
          activeTab={activeTab}
          onActiveTabChange={setActiveTab}
          onSaveLocation={handleSaveLocation}
          onLoadQuery={handleLoadQuery}
          onSaveQuery={handleSaveQuery}
          onUpdateQuery={handleUpdateQuery}
          onDeleteQuery={handleDeleteQuery}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
