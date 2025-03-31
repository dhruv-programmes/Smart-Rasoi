
import { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Utensils, UtensilsCrossed, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RestaurantSetup = () => {
  const { setRestaurant } = useRestaurant();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [specialties, setSpecialties] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [skipSetup, setSkipSetup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name && !skipSetup) {
      setError('Restaurant name is required');
      return;
    }

    if (skipSetup) {
      // Set default restaurant information
      setRestaurant({
        name: "Sample Restaurant",
        description: "A sample restaurant for testing the application",
        cuisine: "Mixed Cuisine",
        specialties: ["Various Dishes"]
      });
    } else {
      setRestaurant({
        name,
        description: description || "No description provided",
        cuisine: cuisine || "Not specified",
        specialties: specialties ? specialties.split(',').map(s => s.trim()) : []
      });
    }
    
    navigate('/');
  };

  const handleSkip = () => {
    setSkipSetup(true);
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6 animate-float">
          <ChefHat size={48} className="text-primary" />
          <h1 className="text-3xl font-bold text-center text-spice-800 mt-2">
            Smart Rasoi
          </h1>
          <div className="flex items-center mt-2">
            <Utensils className="h-5 w-5 text-primary mr-2" />
            <span className="text-md text-muted-foreground">Made by Team Decoders</span>
            <UtensilsCrossed className="h-5 w-5 text-primary ml-2" />
          </div>
        </div>
        
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardHeader className="bg-accent rounded-t-lg">
            <CardTitle className="text-spice-800">Restaurant Setup</CardTitle>
            <CardDescription>
              Tell us about your restaurant to personalize your recipe generation
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              {error && <p className="text-destructive text-sm">{error}</p>}
              
              <div className="space-y-2">
                <Label htmlFor="name">Restaurant Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Spice Avenue"
                  className="border-primary/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cuisine">Cuisine Type</Label>
                <Input
                  id="cuisine"
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  placeholder="e.g. North Indian, Gujarati, South Indian"
                  className="border-primary/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialties">
                  Specialties (comma-separated)
                </Label>
                <Input
                  id="specialties"
                  value={specialties}
                  onChange={(e) => setSpecialties(e.target.value)}
                  placeholder="e.g. Vada Pav, Pav Bhaji, Dabeli"
                  className="border-primary/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Restaurant Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your restaurant's style, ambiance, and culinary philosophy"
                  className="border-primary/20"
                  rows={4}
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex-col space-y-2">
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
              >
                Set Up Restaurant
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full border-primary/20 text-muted-foreground hover:bg-accent"
                onClick={handleSkip}
              >
                Skip Setup
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RestaurantSetup;
