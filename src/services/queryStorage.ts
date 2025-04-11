
import { WeatherQuery } from '../types/weather';

// Mock database using localStorage
const STORAGE_KEY = 'weather-queries';

// Initialize storage
const initializeStorage = (): void => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
};

// Get all queries
export const getAllQueries = (): WeatherQuery[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
};

// Get query by ID
export const getQueryById = (id: string): WeatherQuery | undefined => {
  const queries = getAllQueries();
  return queries.find(query => query.id === id);
};

// Create new query
export const createQuery = (query: Omit<WeatherQuery, 'id'>): WeatherQuery => {
  const queries = getAllQueries();
  const newQuery = {
    ...query,
    id: Date.now().toString(), // Simple ID generation
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...queries, newQuery]));
  return newQuery;
};

// Update query
export const updateQuery = (id: string, updates: Partial<WeatherQuery>): WeatherQuery | null => {
  const queries = getAllQueries();
  const index = queries.findIndex(query => query.id === id);
  
  if (index === -1) return null;
  
  const updatedQuery = { ...queries[index], ...updates };
  queries[index] = updatedQuery;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queries));
  return updatedQuery;
};

// Delete query
export const deleteQuery = (id: string): boolean => {
  const queries = getAllQueries();
  const filteredQueries = queries.filter(query => query.id !== id);
  
  if (filteredQueries.length === queries.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredQueries));
  return true;
};

// Search queries
export const searchQueries = (searchTerm: string): WeatherQuery[] => {
  const queries = getAllQueries();
  if (!searchTerm) return queries;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  return queries.filter(query => 
    query.location.toLowerCase().includes(lowerSearchTerm) || 
    query.notes?.toLowerCase().includes(lowerSearchTerm)
  );
};
