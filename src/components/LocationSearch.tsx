
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search, Locate } from 'lucide-react';
import { toast } from 'sonner';

interface LocationSearchProps {
  onSearch: (query: string, type: 'city' | 'zipcode' | 'coordinates') => void;
  onUseCurrentLocation: () => void;
  isLoading: boolean;
}

const LocationSearch = ({ onSearch, onUseCurrentLocation, isLoading }: LocationSearchProps) => {
  const [searchType, setSearchType] = useState<'city' | 'zipcode' | 'coordinates'>('city');
  const [cityQuery, setCityQuery] = useState('');
  const [zipQuery, setZipQuery] = useState('');
  const [latQuery, setLatQuery] = useState('');
  const [lonQuery, setLonQuery] = useState('');

  const handleSearch = () => {
    if (searchType === 'city' && cityQuery.trim()) {
      onSearch(cityQuery.trim(), 'city');
    } else if (searchType === 'zipcode' && zipQuery.trim()) {
      onSearch(zipQuery.trim(), 'zipcode');
    } else if (searchType === 'coordinates' && latQuery.trim() && lonQuery.trim()) {
      const lat = parseFloat(latQuery);
      const lon = parseFloat(lonQuery);
      
      if (isNaN(lat) || isNaN(lon)) {
        toast.error('Please enter valid coordinates');
        return;
      }
      
      if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        toast.error('Coordinates out of range');
        return;
      }
      
      onSearch(`${lat},${lon}`, 'coordinates');
    } else {
      toast.error('Please enter a valid search query');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Location</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <RadioGroup 
            defaultValue={searchType} 
            onValueChange={(value) => setSearchType(value as 'city' | 'zipcode' | 'coordinates')}
            className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="city" id="city" />
              <Label htmlFor="city">City</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="zipcode" id="zipcode" />
              <Label htmlFor="zipcode">Zip Code</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="coordinates" id="coordinates" />
              <Label htmlFor="coordinates">Coordinates</Label>
            </div>
          </RadioGroup>

          {searchType === 'city' && (
            <div>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter city name (e.g., London)"
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                />
                <Button onClick={handleSearch} disabled={isLoading}>
                  {isLoading ? 'Loading...' : <Search className="h-4 w-4 mr-1" />}
                </Button>
              </div>
            </div>
          )}

          {searchType === 'zipcode' && (
            <div>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter zip code (e.g., 10001)"
                  value={zipQuery}
                  onChange={(e) => setZipQuery(e.target.value)}
                />
                <Button onClick={handleSearch} disabled={isLoading}>
                  {isLoading ? 'Loading...' : <Search className="h-4 w-4 mr-1" />}
                </Button>
              </div>
            </div>
          )}

          {searchType === 'coordinates' && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Latitude (e.g., 51.5074)"
                  value={latQuery}
                  onChange={(e) => setLatQuery(e.target.value)}
                />
                <Input
                  placeholder="Longitude (e.g., -0.1278)"
                  value={lonQuery}
                  onChange={(e) => setLonQuery(e.target.value)}
                />
                <Button onClick={handleSearch} disabled={isLoading}>
                  {isLoading ? 'Loading...' : <Search className="h-4 w-4 mr-1" />}
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={onUseCurrentLocation}
              disabled={isLoading}
              className="flex items-center"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Use Current Location
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSearch;
