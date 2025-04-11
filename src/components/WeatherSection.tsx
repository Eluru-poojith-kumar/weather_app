
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Cloud, History } from 'lucide-react';
import WeatherDisplay from './WeatherDisplay';
import ForecastDisplay from './ForecastDisplay';
import SavedQueries from './SavedQueries';
import { CurrentWeather, ForecastData, WeatherQuery } from '../types/weather';

interface WeatherSectionProps {
  isLoading: boolean;
  currentWeather: CurrentWeather | null;
  forecast: ForecastData | null;
  savedQueries: WeatherQuery[];
  units: 'metric' | 'imperial';
  activeTab: string;
  onActiveTabChange: (tab: string) => void;
  onSaveLocation: () => void;
  onLoadQuery: (query: WeatherQuery) => void;
  onSaveQuery: (query: Omit<WeatherQuery, 'id'>) => void;
  onUpdateQuery: (id: string, updates: Partial<WeatherQuery>) => void;
  onDeleteQuery: (id: string) => void;
}

const WeatherSection = ({
  isLoading,
  currentWeather,
  forecast,
  savedQueries,
  units,
  activeTab,
  onActiveTabChange,
  onSaveLocation,
  onLoadQuery,
  onSaveQuery,
  onUpdateQuery,
  onDeleteQuery
}: WeatherSectionProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onActiveTabChange}>
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="weather" className="flex items-center">
          <Cloud className="mr-2 h-4 w-4" />
          Weather
        </TabsTrigger>
        <TabsTrigger value="saved" className="flex items-center">
          <History className="mr-2 h-4 w-4" />
          Saved Locations
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="weather">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500" />
          </div>
        ) : currentWeather ? (
          <div className="space-y-6">
            <WeatherDisplay weather={currentWeather} units={units} />
            {forecast && <ForecastDisplay forecast={forecast} units={units} />}
            
            <div className="mt-8 flex justify-center">
              <Button variant="outline" onClick={onSaveLocation}>
                Save This Location
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <Cloud className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-500">
              Search for a location to view weather information
            </p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="saved">
        <SavedQueries 
          queries={savedQueries}
          onLoadQuery={onLoadQuery}
          onSaveQuery={onSaveQuery}
          onUpdateQuery={onUpdateQuery}
          onDeleteQuery={onDeleteQuery}
        />
      </TabsContent>
    </Tabs>
  );
};

export default WeatherSection;
