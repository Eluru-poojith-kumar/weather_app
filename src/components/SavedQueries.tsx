
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { WeatherQuery } from '../types/weather';
import QueryForm from './QueryForm';
import { MapPin, Search, Edit, Trash2, Plus, List } from 'lucide-react';

interface SavedQueriesProps {
  queries: WeatherQuery[];
  onLoadQuery: (query: WeatherQuery) => void;
  onSaveQuery: (query: Omit<WeatherQuery, 'id'>) => void;
  onUpdateQuery: (id: string, query: Partial<WeatherQuery>) => void;
  onDeleteQuery: (id: string) => void;
}

const SavedQueries = ({ 
  queries, 
  onLoadQuery, 
  onSaveQuery, 
  onUpdateQuery, 
  onDeleteQuery 
}: SavedQueriesProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQueries, setFilteredQueries] = useState<WeatherQuery[]>(queries);
  const [editingQuery, setEditingQuery] = useState<WeatherQuery | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteQueryId, setDeleteQueryId] = useState<string | null>(null);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredQueries(queries);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = queries.filter(q => 
        q.location.toLowerCase().includes(term) || 
        q.notes?.toLowerCase().includes(term)
      );
      setFilteredQueries(filtered);
    }
  }, [queries, searchTerm]);

  const handleSaveNew = (query: Omit<WeatherQuery, 'id'>) => {
    onSaveQuery(query);
    setIsAddDialogOpen(false);
  };

  const handleUpdate = (query: Omit<WeatherQuery, 'id'>) => {
    if (editingQuery?.id) {
      onUpdateQuery(editingQuery.id, query);
      setEditingQuery(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleEditClick = (query: WeatherQuery) => {
    setEditingQuery(query);
    setIsEditDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Saved Locations</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Save New Location</DialogTitle>
              <DialogDescription>
                Save a location to quickly access its weather forecast later.
              </DialogDescription>
            </DialogHeader>
            <QueryForm 
              onSave={handleSaveNew} 
              onCancel={() => setIsAddDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search saved locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        {filteredQueries.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date Saved</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQueries.map((query) => (
                  <TableRow key={query.id}>
                    <TableCell className="font-medium">{query.location}</TableCell>
                    <TableCell>{query.type}</TableCell>
                    <TableCell>{formatDate(query.createdAt)}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => onLoadQuery(query)}
                      >
                        <MapPin className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleEditClick(query)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Saved Location</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this saved location? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => query.id && onDeleteQuery(query.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <List className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No saved locations found</p>
            {searchTerm && (
              <Button 
                variant="ghost" 
                className="mt-2" 
                onClick={() => setSearchTerm('')}
              >
                Clear search
              </Button>
            )}
          </div>
        )}
      </CardContent>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Saved Location</DialogTitle>
          </DialogHeader>
          {editingQuery && (
            <QueryForm 
              initialValues={editingQuery} 
              onSave={handleUpdate} 
              onCancel={() => {
                setEditingQuery(null);
                setIsEditDialogOpen(false);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SavedQueries;
