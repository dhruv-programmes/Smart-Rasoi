
import React, { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { Button } from '@/components/ui/button';
import { ChefHat, Menu, Package, AlertTriangle, BookOpen, Sun, Moon } from 'lucide-react';
import RestaurantInfoCard from './RestaurantInfoCard';
import RestaurantSettings from './RestaurantSettings';
import RestaurantSetup from './RestaurantSetup';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { restaurant, isConfigured } = useRestaurant();
  const [activePage, setActivePage] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  const handleNavigation = (page: string) => {
    setActivePage(page);
    setIsMobileMenuOpen(false);
    
    // Handle navigation based on page
    switch (page) {
      case 'dashboard':
        navigate('/');
        break;
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
        navigate('/');
    }
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  if (!isConfigured) {
    return <RestaurantSetup />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-primary text-primary-foreground shadow-md">
        <div className="container flex justify-between items-center h-16 px-4">
          <div className="flex items-center">
            <ChefHat className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold cursor-pointer" onClick={() => handleNavigation('dashboard')}>Smart Rasoi</h1>
          </div>
          
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleMobileMenu}
              className="text-primary-foreground hover:bg-primary/90"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          
          <nav className="hidden md:flex items-center space-x-4">
            <Button 
              variant={activePage === 'dashboard' ? "secondary" : "ghost"}
              className="text-white hover:bg-primary/90"
              onClick={() => handleNavigation('dashboard')}
            >
              Dashboard
            </Button>
            <Button 
              variant={activePage === 'inventory' ? "secondary" : "ghost"}
              className="text-primary-foreground hover:bg-primary/90"
              onClick={() => handleNavigation('inventory')}
            >
              Inventory
            </Button>
            <Button 
              variant={activePage === 'recipes' ? "secondary" : "ghost"}
              className="text-primary-foreground hover:bg-primary/90"
              onClick={() => handleNavigation('recipes')}
            >
              Recipes
            </Button>
            <Button 
              variant={activePage === 'spoilage' ? "secondary" : "ghost"}
              className="text-primary-foreground hover:bg-primary/90"
              onClick={() => handleNavigation('spoilage')}
            >
              Spoilage
            </Button>
            
            <div className="border-l border-primary-foreground/20 h-8 mx-2" />
            
            {/* Theme toggle */}
            {/* <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="text-primary-foreground hover:bg-primary/90"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button> */}
            
            {/* Restaurant settings */}
            <RestaurantSettings />
          </nav>
        </div>
      </header>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary text-primary-foreground">
          <div className="container px-4 py-3 space-y-2">
            <Button 
              variant={activePage === 'dashboard' ? "secondary" : "ghost"}
              className="w-full justify-start text-primary-foreground hover:bg-primary/90"
              onClick={() => handleNavigation('dashboard')}
            >
              <ChefHat className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button 
              variant={activePage === 'inventory' ? "secondary" : "ghost"}
              className="w-full justify-start text-primary-foreground hover:bg-primary/90"
              onClick={() => handleNavigation('inventory')}
            >
              <Package className="mr-2 h-4 w-4" />
              Inventory
            </Button>
            <Button 
              variant={activePage === 'recipes' ? "secondary" : "ghost"}
              className="w-full justify-start text-primary-foreground hover:bg-primary/90"
              onClick={() => handleNavigation('recipes')}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Recipes
            </Button>
            <Button 
              variant={activePage === 'spoilage' ? "secondary" : "ghost"}
              className="w-full justify-start text-primary-foreground hover:bg-primary/90"
              onClick={() => handleNavigation('spoilage')}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Spoilage
            </Button>
            
            <div className="border-t border-primary-foreground/20 my-2 pt-2 flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleTheme}
                className="text-primary-foreground hover:bg-primary/90"
              >
                {theme === 'light' ? (
                  <><Moon className="h-4 w-4 mr-2" /> Dark Mode</>
                ) : (
                  <><Sun className="h-4 w-4 mr-2" /> Light Mode</>
                )}
              </Button>
              
              <RestaurantSettings />
            </div>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <main className="flex-1 container p-4">
        {restaurant && <RestaurantInfoCard restaurant={restaurant} />}
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-muted border-t py-4">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Smart Rasoi - Made by Team Decoders</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
