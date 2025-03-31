
import { useState, useMemo } from 'react';
import { getIngredientsFromDB, deleteIngredientFromDB } from '@/services/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const SpoilageDetection = ({ refreshTrigger, onUpdate }: { refreshTrigger?: number, onUpdate: () => void }) => {
  const [ingredients, setIngredients] = useState(getIngredientsFromDB());
  const { toast } = useToast();
  
  // Reload ingredients when the refreshTrigger changes
  useMemo(() => {
    setIngredients(getIngredientsFromDB());
  }, [refreshTrigger]);

  // Group ingredients by expiration time
  const expiringToday = ingredients.filter(ing => ing.expiration <= 1);
  const expiringThisWeek = ingredients.filter(ing => ing.expiration > 1 && ing.expiration <= 7);
  const safeTwoWeeks = ingredients.filter(ing => ing.expiration > 7 && ing.expiration <= 14);
  const safeLongTerm = ingredients.filter(ing => ing.expiration > 14);

  const handleRemoveItem = (ingredientId: number) => {
    deleteIngredientFromDB(ingredientId);
    setIngredients(getIngredientsFromDB());
    onUpdate();
    
    toast({
      title: "Item Removed",
      description: "Expired item has been removed from inventory"
    });
  };

  const getExpirationProgressColor = (days: number) => {
    if (days <= 2) return "bg-red-500";
    if (days <= 7) return "bg-yellow-500";
    return "bg-green-500";
  };

  const renderExpirationItem = (ingredient: any) => (
    <div 
      key={ingredient.id} 
      className="flex items-center justify-between p-3 rounded-md bg-card hover:bg-accent"
    >
      <div className="flex flex-col flex-grow mr-4">
        <div className="flex items-center justify-between">
          <span className="font-medium capitalize">{ingredient.name}</span>
          <span className="text-sm text-muted-foreground">{ingredient.quantity} units</span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <Progress 
            value={Math.max(0, (ingredient.expiration / 30) * 100)} 
            className={`h-2 ${getExpirationProgressColor(ingredient.expiration)}`}
          />
          <span className="text-xs font-medium w-16">
            {ingredient.expiration <= 0 
              ? "Expired!" 
              : `${ingredient.expiration} day${ingredient.expiration !== 1 ? 's' : ''}`}
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleRemoveItem(ingredient.id)}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <Card className="border-2 border-spice-200">
      <CardHeader className="bg-spice-100 rounded-t-lg">
        <CardTitle className="flex items-center text-spice-800">
          <AlertTriangle className="mr-2" /> Spoilage Detection
        </CardTitle>
        <CardDescription>
          Monitor ingredient freshness and track upcoming expirations
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {ingredients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Your inventory is empty. No items to monitor.
          </div>
        ) : (
          <div className="space-y-6">
            {expiringToday.length > 0 && (
              <div>
                <div className="flex items-center mb-3">
                  <Badge variant="outline" className="bg-red-100 text-red-800 mr-2">Critical</Badge>
                  <h3 className="font-semibold">Expiring Today or Expired</h3>
                </div>
                <div className="space-y-2">
                  {expiringToday.map(renderExpirationItem)}
                </div>
              </div>
            )}
            
            {expiringThisWeek.length > 0 && (
              <div>
                <div className="flex items-center mb-3">
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 mr-2">Warning</Badge>
                  <h3 className="font-semibold">Expiring This Week</h3>
                </div>
                <div className="space-y-2">
                  {expiringThisWeek.map(renderExpirationItem)}
                </div>
              </div>
            )}
            
            {safeTwoWeeks.length > 0 && (
              <div>
                <div className="flex items-center mb-3">
                  <Badge variant="outline" className="bg-green-100 text-green-800 mr-2">Good</Badge>
                  <h3 className="font-semibold">Fresh for 1-2 Weeks</h3>
                </div>
                <div className="space-y-2">
                  {safeTwoWeeks.map(renderExpirationItem)}
                </div>
              </div>
            )}
            
            {safeLongTerm.length > 0 && (
              <div>
                <div className="flex items-center mb-3">
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 mr-2">Excellent</Badge>
                  <h3 className="font-semibold">Long-Term Storage</h3>
                </div>
                <div className="space-y-2">
                  {safeLongTerm.map(renderExpirationItem)}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpoilageDetection;
