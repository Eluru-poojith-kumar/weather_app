
import React from 'react';
import { Button } from '@/components/ui/button';
import { Cloud } from 'lucide-react';

interface HeaderProps {
  units: 'metric' | 'imperial';
  onToggleUnits: () => void;
}

const Header = ({ units, onToggleUnits }: HeaderProps) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Cloud className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              WeatherWise
            </h1>
          </div>
          <Button variant="outline" onClick={onToggleUnits}>
            {units === 'metric' ? '°C' : '°F'}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
