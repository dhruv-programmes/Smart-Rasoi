
import { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import Layout from '@/components/Layout';
import RestaurantSetup from '@/components/RestaurantSetup';
import ImageUploader from '@/components/ImageUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, ChefHat, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { isConfigured } = useRestaurant();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();
  
  const handleRefreshInventory = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  if (!isConfigured) {
    return <RestaurantSetup />;
  }
  
  const handleTabChange = (value: string) => {
    switch(value) {
      case 'inventory':
        navigate('/inventory');
        break;
      case 'recipes':
        navigate('/recipes');
        break;
      case 'spoilage':
        navigate('/spoilage');
        break;
      default:
        break;
    }
  };
  
  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ImageUploader onIngredientsDetected={handleRefreshInventory} />
        </div>
        
        <div className="lg:col-span-2">
          <Tabs defaultValue="dashboard" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="inventory" className="flex items-center">
                <Package className="mr-2 h-4 w-4" /> Inventory
              </TabsTrigger>
              <TabsTrigger value="recipes" className="flex items-center">
                <ChefHat className="mr-2 h-4 w-4" /> Recipes
              </TabsTrigger>
              <TabsTrigger value="spoilage" className="flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" /> Spoilage
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <div className="bg-accent rounded-lg p-6 shadow">
                <h2 className="text-xl font-bold text-spice-800 mb-4">Welcome to Smart Rasoi</h2>
                <p className="mb-4">Get started by uploading an image of ingredients or navigate to a specific section.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white rounded-lg p-4 shadow border border-primary/10 hover:border-primary/30 transition-colors cursor-pointer" onClick={() => navigate('/inventory')}>
                    <Package className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-medium">Manage Inventory</h3>
                    <p className="text-sm text-muted-foreground mt-2">Track and update your ingredient inventory</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow border border-primary/10 hover:border-primary/30 transition-colors cursor-pointer" onClick={() => navigate('/recipes')}>
                    <ChefHat className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-medium">Create Recipes</h3>
                    <p className="text-sm text-muted-foreground mt-2">Generate AI-powered recipes from your ingredients</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow border border-primary/10 hover:border-primary/30 transition-colors cursor-pointer" onClick={() => navigate('/spoilage')}>
                    <AlertTriangle className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-medium">Monitor Spoilage</h3>
                    <p className="text-sm text-muted-foreground mt-2">Track ingredient freshness and expiration</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
