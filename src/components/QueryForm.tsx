
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { WeatherQuery } from '../types/weather';
import { toast } from 'sonner';

interface QueryFormProps {
  onSave: (query: Omit<WeatherQuery, 'id'>) => void;
  initialValues?: WeatherQuery;
  onCancel: () => void;
}

const QueryForm = ({ onSave, initialValues, onCancel }: QueryFormProps) => {
  const [type, setType] = useState<'city' | 'zipcode' | 'coordinates'>(
    (initialValues?.type as 'city' | 'zipcode' | 'coordinates') || 'city'
  );
  const [location, setLocation] = useState(initialValues?.location || '');
  const [notes, setNotes] = useState(initialValues?.notes || '');
  const [lat, setLat] = useState(initialValues?.coordinates?.lat.toString() || '');
  const [lon, setLon] = useState(initialValues?.coordinates?.lon.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location.trim()) {
      toast.error('Please enter a location');
      return;
    }
    
    if (type === 'coordinates') {
      const parsedLat = parseFloat(lat);
      const parsedLon = parseFloat(lon);
      
      if (isNaN(parsedLat) || isNaN(parsedLon)) {
        toast.error('Please enter valid coordinates');
        return;
      }
      
      if (parsedLat < -90 || parsedLat > 90 || parsedLon < -180 || parsedLon > 180) {
        toast.error('Coordinates out of range');
        return;
      }
    }
    
    onSave({
      location: type === 'coordinates' ? `${lat},${lon}` : location,
      type,
      notes,
      createdAt: new Date().toISOString(),
      ...(type === 'coordinates' && {
        coordinates: {
          lat: parseFloat(lat),
          lon: parseFloat(lon),
        },
      }),
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{initialValues ? 'Edit Query' : 'Save Weather Query'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="queryType">Query Type</Label>
            <RadioGroup 
              defaultValue={type} 
              onValueChange={(value) => setType(value as 'city' | 'zipcode' | 'coordinates')}
              className="flex flex-col space-y-2 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="city" id="query-city" />
                <Label htmlFor="query-city">City</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="zipcode" id="query-zipcode" />
                <Label htmlFor="query-zipcode">Zip Code</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="coordinates" id="query-coordinates" />
                <Label htmlFor="query-coordinates">Coordinates</Label>
              </div>
            </RadioGroup>
          </div>

          {(type === 'city' || type === 'zipcode') && (
            <div>
              <Label htmlFor="location">
                {type === 'city' ? 'City Name' : 'Zip Code'}
              </Label>
              <Input
                id="location"
                placeholder={type === 'city' ? 'e.g., London' : 'e.g., 10001'}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1"
              />
            </div>
          )}

          {type === 'coordinates' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  placeholder="e.g., 51.5074"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  placeholder="e.g., -0.1278"
                  value={lon}
                  onChange={(e) => setLon(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this location..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialValues ? 'Update' : 'Save'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default QueryForm;
