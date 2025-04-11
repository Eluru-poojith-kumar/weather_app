import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ForecastData, ForecastItem } from '../types/weather';
import { celsiusToFahrenheit, formatDate, formatTime, getWeatherIconUrl, groupForecastByDay } from '../services/weatherService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ForecastDisplayProps {
  forecast: ForecastData;
  units: 'metric' | 'imperial';
}

interface ForecastCardProps {
  item: ForecastItem;
  units: 'metric' | 'imperial';
}

const ForecastDisplay = ({ forecast, units }: ForecastDisplayProps) => {
  const [nextFiveDays, setNextFiveDays] = useState<string[]>([]);
  const [daysData, setDaysData] = useState<{[key: string]: ForecastItem[]}>({});
  
  useEffect(() => {
    if (!forecast || !forecast.list || forecast.list.length === 0) {
      return;
    }
    
    // Group forecast by day - alternative implementation
    const forecastByDay: {[key: string]: ForecastItem[]} = {};
    
    // Process forecast data directly
    forecast.list.forEach((item: ForecastItem) => {
      // Convert timestamp to date
      const date = new Date(item.dt * 1000);
      const dateKey = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      
      if (!forecastByDay[dateKey]) {
        forecastByDay[dateKey] = [];
      }
      forecastByDay[dateKey].push(item);
    });
    
    // Find today and the next 5 days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const availableDays: {key: string, date: Date}[] = [];
    
    // Get all days from the forecast
    for (const dateKey in forecastByDay) {
      const parts = dateKey.split('/');
      const month = parseInt(parts[0]) - 1;
      const day = parseInt(parts[1]);
      const year = parseInt(parts[2]);
      
      const date = new Date(year, month, day);
      
      // Only include future days (tomorrow onward)
      if (date > today) {
        availableDays.push({ key: dateKey, date });
      }
    }
    
    // Sort days chronologically
    availableDays.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Get the next 5 days
    const fiveDays = availableDays.slice(0, 5).map(d => d.key);
    
    setNextFiveDays(fiveDays);
    setDaysData(forecastByDay);
    
  }, [forecast]);
  
  // Function to get day name
  const getDayName = (dateKey: string) => {
    const parts = dateKey.split('/');
    const month = parseInt(parts[0]) - 1;
    const day = parseInt(parts[1]);
    const year = parseInt(parts[2]);
    
    const date = new Date(year, month, day);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };
  
  if (nextFiveDays.length === 0) {
    return (
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle>5-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">Forecast data not available for future days</p>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate how many grid columns we need
  const colCount = Math.min(nextFiveDays.length, 5);
  const gridClass = `grid grid-cols-${colCount} mb-4`;
  
  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={nextFiveDays[0]}>
          <TabsList className="grid grid-cols-5 mb-4">
            {nextFiveDays.map((day) => (
              <TabsTrigger key={day} value={day}>
                {getDayName(day)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {nextFiveDays.map(day => (
            <TabsContent key={day} value={day} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {daysData[day] && daysData[day].map((item: ForecastItem) => (
                  <ForecastCard key={item.dt} item={item} units={units} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

// ForecastCard component remains unchanged
const ForecastCard = ({ item, units }: ForecastCardProps) => {
  const temp = units === 'metric' ? Math.round(item.main.temp) : Math.round(celsiusToFahrenheit(item.main.temp));
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3 flex items-center justify-between">
        <div>
          <p className="font-medium">{formatTime(item.dt)}</p>
          <p className="text-2xl font-bold">{temp}°{units === 'metric' ? 'C' : 'F'}</p>
          <p className="text-sm capitalize">{item.weather[0].description}</p>
        </div>
        <img src={getWeatherIconUrl(item.weather[0].icon)} alt={item.weather[0].description} className="w-16 h-16" />
      </CardContent>
    </Card>
  );
};

export default ForecastDisplay;