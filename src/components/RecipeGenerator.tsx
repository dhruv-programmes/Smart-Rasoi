
import { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { generateRecipe } from '@/services/api';
import { getIngredientsFromDB, saveRecipeToDB } from '@/services/db';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, ChefHat, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import RecipeCard from './RecipeCard';

const RecipeGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const { restaurant } = useRestaurant();
  const { toast } = useToast();
  
  const ingredients = getIngredientsFromDB();
  
  const toggleIngredient = (ingredientName: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredientName)
        ? prev.filter(name => name !== ingredientName)
        : [...prev, ingredientName]
    );
  };

  const selectAllIngredients = () => {
    if (selectedIngredients.length === ingredients.length) {
      // If all ingredients are already selected, deselect all
      setSelectedIngredients([]);
    } else {
      // Otherwise select all ingredients
      setSelectedIngredients(ingredients.map(ingredient => ingredient.name));
    }
  };
  
  const handleGenerateRecipes = async () => {
    if (selectedIngredients.length === 0) {
      toast({
        title: "No Ingredients Selected",
        description: "Please select at least one ingredient for recipe generation.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    setRecipes([]);
    
    try {
      // Generate two different recipes
      const results = await Promise.all([
        generateRecipe(selectedIngredients, restaurant || {
          name: "Sample Restaurant",
          cuisine: "Mixed Cuisine",
          specialties: ["Various Dishes"],
          description: "A sample restaurant for testing"
        }),
        generateRecipe(selectedIngredients, restaurant || {
          name: "Sample Restaurant",
          cuisine: "Mixed Cuisine",
          specialties: ["Various Dishes"],
          description: "A sample restaurant for testing"
        })
      ]);
      
      const successfulRecipes = results
        .filter(result => result.success && result.recipe.title)
        .map(result => result.recipe);
      
      if (successfulRecipes.length > 0) {
        // Save recipes to database
        successfulRecipes.forEach(recipe => saveRecipeToDB(recipe));
        setRecipes(successfulRecipes);
        
        toast({
          title: "Recipes Generated",
          description: `Created ${successfulRecipes.length} delicious ${restaurant?.cuisine || 'custom'} recipes`,
        });
      } else {
        toast({
          title: "Generation Failed",
          description: "Failed to generate recipes. Please try with different ingredients.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Card className="border-2 border-primary/20 shadow-md">
        <CardHeader className="bg-accent rounded-t-lg">
          <CardTitle className="flex items-center">
            <ChefHat className="mr-2" /> Recipe Generator
          </CardTitle>
          <CardDescription>
            Select ingredients from your inventory to generate custom recipes
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Select Ingredients:</h3>
              <Button 
                onClick={selectAllIngredients}
                variant="outline" 
                size="sm"
                className="border-primary/20 hover:bg-accent"
              >
                {selectedIngredients.length === ingredients.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            
            {ingredients.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                Your inventory is empty. Add ingredients first.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {ingredients.map((ingredient) => (
                  <div 
                    key={ingredient.id} 
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent/50 cursor-pointer"
                    onClick={() => toggleIngredient(ingredient.name)}
                  >
                    <Checkbox 
                      checked={selectedIngredients.includes(ingredient.name)}
                      onCheckedChange={() => toggleIngredient(ingredient.name)}
                      id={`ingredient-${ingredient.id}`}
                    />
                    <label
                      htmlFor={`ingredient-${ingredient.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer capitalize"
                    >
                      {ingredient.name} ({ingredient.quantity})
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 p-4">
          <Button
            onClick={handleGenerateRecipes}
            disabled={isGenerating || selectedIngredients.length === 0}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Recipes...
              </>
            ) : (
              'Generate Recipes'
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {recipes.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <BookOpen className="mr-2" /> Generated Recipes
          </h2>
          <div className="space-y-6">
            {recipes.map((recipe, index) => (
              <RecipeCard key={index} recipe={recipe} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default RecipeGenerator;
