
import { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Store } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RestaurantSettings = () => {
  const { restaurant, updateRestaurant } = useRestaurant();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  
  const [name, setName] = useState(restaurant?.name || '');
  const [description, setDescription] = useState(restaurant?.description || '');
  const [cuisine, setCuisine] = useState(restaurant?.cuisine || '');
  const [specialties, setSpecialties] = useState(restaurant?.specialties?.join(', ') || '');

  // Update local state when restaurant changes
  const resetForm = () => {
    if (restaurant) {
      setName(restaurant.name);
      setDescription(restaurant.description);
      setCuisine(restaurant.cuisine);
      setSpecialties(restaurant.specialties.join(', '));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Name Required",
        description: "Restaurant name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    updateRestaurant({
      name,
      description: description.trim() || "No description provided",
      cuisine: cuisine.trim() || "Not specified",
      specialties: specialties ? specialties.split(',').map(s => s.trim()) : []
    });
    
    toast({
      title: "Restaurant Updated",
      description: "Your restaurant information has been updated successfully"
    });
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => {
      setOpen(value);
      if (value) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Settings className="h-4 w-4 text-black" />
          <span className="hidden sm:inline text-black">Restaurant Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Update Restaurant Information
          </DialogTitle>
          <DialogDescription>
            Modify your restaurant details to personalize recipe generation
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Restaurant Name</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Spice Avenue"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-cuisine">Cuisine Type</Label>
            <Input
              id="edit-cuisine"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              placeholder="e.g. North Indian, Italian, Mexican"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-specialties">
              Specialties (comma-separated)
            </Label>
            <Input
              id="edit-specialties"
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
              placeholder="e.g. Butter Chicken, Pasta, Tacos"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-description">Restaurant Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your restaurant's style and culinary philosophy"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RestaurantSettings;
