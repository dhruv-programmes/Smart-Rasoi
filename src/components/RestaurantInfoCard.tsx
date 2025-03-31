
import { Restaurant } from '@/context/RestaurantContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Store, UtensilsCrossed } from 'lucide-react';
import RestaurantSettings from './RestaurantSettings';

interface RestaurantInfoCardProps {
  restaurant: Restaurant;
}

const RestaurantInfoCard = ({ restaurant }: RestaurantInfoCardProps) => {
  return (
    <Card className="mb-6 bg-gradient-to-r from-accent to-background border-l-4 border-l-primary">
      <CardContent className="p-4 flex items-center">
        <Store className="h-10 w-10 text-primary mr-4" />
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">{restaurant.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{restaurant.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-secondary text-secondary-foreground">
                {restaurant.cuisine}
              </Badge>
              <div className="hidden sm:block">
                <RestaurantSettings />
              </div>
            </div>
          </div>
          
          <div className="mt-2 flex items-center">
            <UtensilsCrossed className="h-4 w-4 text-primary mr-2" />
            <div className="flex flex-wrap gap-1">
              {restaurant.specialties.map((specialty, index) => (
                <Badge key={index} variant="outline" className="bg-background/50">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="sm:hidden ml-2">
          <RestaurantSettings />
        </div>
      </CardContent>
    </Card>
  );
};

export default RestaurantInfoCard;
