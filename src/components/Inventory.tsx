
import { useState, useEffect } from 'react';
import { getIngredientsFromDB, updateIngredientInDB, deleteIngredientFromDB } from '@/services/db';
import { Ingredient } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, AlertTriangle, Plus, Minus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Inventory = ({ refreshTrigger }: { refreshTrigger?: number }) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load ingredients from database
    const loadIngredients = () => {
      const ingredientsFromDB = getIngredientsFromDB();
      setIngredients(ingredientsFromDB);
    };
    
    loadIngredients();
  }, [refreshTrigger]);

  const handleIncrement = (ingredient: Ingredient) => {
    const updatedIngredient = { ...ingredient, quantity: ingredient.quantity + 1 };
    const updatedIngredients = updateIngredientInDB(updatedIngredient);
    setIngredients(updatedIngredients);
  };

  const handleDecrement = (ingredient: Ingredient) => {
    if (ingredient.quantity <= 1) {
      // If quantity would become 0, delete the ingredient
      const updatedIngredients = deleteIngredientFromDB(ingredient.id!);
      setIngredients(updatedIngredients);
    } else {
      const updatedIngredient = { ...ingredient, quantity: ingredient.quantity - 1 };
      const updatedIngredients = updateIngredientInDB(updatedIngredient);
      setIngredients(updatedIngredients);
    }
  };

  const handleDelete = (ingredientId: number) => {
    const updatedIngredients = deleteIngredientFromDB(ingredientId);
    setIngredients(updatedIngredients);
  };

  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'expiring') return matchesSearch && ingredient.expiration <= 3;
    if (activeTab === 'fresh') return matchesSearch && ingredient.expiration > 3;
    
    return matchesSearch;
  });

  const getExpirationColor = (days: number) => {
    if (days <= 2) return 'bg-red-100 text-red-800';
    if (days <= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <Card className="border-2 border-spice-200">
      <CardHeader className="bg-spice-100 rounded-t-lg">
        <CardTitle className="flex items-center text-spice-800">
          <Package className="mr-2" /> Inventory Management
        </CardTitle>
        <CardDescription>
          Track your ingredients and monitor expiration dates
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4">
          <Input
            placeholder="Search ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-spice-200"
          />
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">All Ingredients</TabsTrigger>
            <TabsTrigger value="expiring" className="flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1" /> Expiring Soon
            </TabsTrigger>
            <TabsTrigger value="fresh">Fresh</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {filteredIngredients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No ingredients match your search' : 'No ingredients in inventory'}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredIngredients.map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className="flex items-center justify-between p-3 rounded-md bg-card hover:bg-accent"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium capitalize">{ingredient.name}</span>
                      <Badge 
                        variant="outline" 
                        className={`mt-1 text-xs ${getExpirationColor(ingredient.expiration)}`}
                      >
                        Expires in {ingredient.expiration} days
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDecrement(ingredient)}
                        className="h-8 w-8 rounded-full"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      
                      <span className="w-6 text-center">{ingredient.quantity}</span>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleIncrement(ingredient)}
                        className="h-8 w-8 rounded-full"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(ingredient.id!)}
                        className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Inventory;
