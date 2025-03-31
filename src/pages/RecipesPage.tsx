
import Layout from '@/components/Layout';
import RecipeGenerator from '@/components/RecipeGenerator';
import { BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const RecipesPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <Card className="bg-accent border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Recipe Generation</h1>
            </div>
            <p className="text-muted-foreground">
              Select ingredients from your inventory to generate custom recipes tailored to your restaurant's style
            </p>
          </CardContent>
        </Card>
        
        <RecipeGenerator />
      </div>
    </Layout>
  );
};

export default RecipesPage;
