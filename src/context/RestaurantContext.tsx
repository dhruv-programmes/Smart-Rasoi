
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Restaurant {
  name: string;
  description: string;
  cuisine: string;
  specialties: string[];
}

interface RestaurantContextType {
  restaurant: Restaurant | null;
  setRestaurant: (restaurant: Restaurant) => void;
  updateRestaurant: (updates: Partial<Restaurant>) => void;
  isConfigured: boolean;
}

const STORAGE_KEY = 'restaurant_info';

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider = ({ children }: { children: ReactNode }) => {
  const [restaurant, setRestaurantState] = useState<Restaurant | null>(null);

  // Load restaurant data from localStorage on mount
  useEffect(() => {
    const storedRestaurant = localStorage.getItem(STORAGE_KEY);
    if (storedRestaurant) {
      try {
        setRestaurantState(JSON.parse(storedRestaurant));
      } catch (e) {
        console.error('Failed to parse restaurant data from localStorage');
      }
    }
  }, []);

  const setRestaurant = (newRestaurant: Restaurant) => {
    setRestaurantState(newRestaurant);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRestaurant));
  };

  const updateRestaurant = (updates: Partial<Restaurant>) => {
    if (!restaurant) return;
    
    const updatedRestaurant = {
      ...restaurant,
      ...updates
    };
    
    setRestaurantState(updatedRestaurant);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRestaurant));
  };

  const isConfigured = restaurant !== null;

  return (
    <RestaurantContext.Provider value={{ restaurant, setRestaurant, updateRestaurant, isConfigured }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
