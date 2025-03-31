
import { Ingredient, Recipe } from './api';

// In a real application, this would be connected to Prisma
// For this demo, we'll use localStorage to simulate a database
export const saveIngredientsToDB = (ingredients: Ingredient[]): Ingredient[] => {
  try {
    // Get existing ingredients from localStorage
    const existingData = localStorage.getItem('ingredients');
    let existingIngredients: Ingredient[] = existingData ? JSON.parse(existingData) : [];
    
    // Give each new ingredient an ID and add it to the existing ingredients
    const newIngredients = ingredients.map((ingredient) => {
      const maxId = existingIngredients.length > 0 
        ? Math.max(...existingIngredients.map(ing => ing.id || 0)) 
        : 0;
      return {
        ...ingredient,
        id: ingredient.id || (maxId + 1)
      };
    });
    
    // Combine existing and new ingredients, avoiding duplicates based on name
    const combinedIngredients = [...existingIngredients];
    
    for (const newIngredient of newIngredients) {
      const existingIndex = combinedIngredients.findIndex(ing => ing.name.toLowerCase() === newIngredient.name.toLowerCase());
      
      if (existingIndex >= 0) {
        // Update quantity if ingredient already exists
        combinedIngredients[existingIndex].quantity += newIngredient.quantity;
        // Take the more conservative expiration date
        combinedIngredients[existingIndex].expiration = Math.min(
          combinedIngredients[existingIndex].expiration,
          newIngredient.expiration
        );
      } else {
        // Add new ingredient
        combinedIngredients.push(newIngredient);
      }
    }
    
    // Save to localStorage
    localStorage.setItem('ingredients', JSON.stringify(combinedIngredients));
    
    return combinedIngredients;
  } catch (error) {
    console.error('Error saving ingredients to DB:', error);
    return [];
  }
};

export const getIngredientsFromDB = (): Ingredient[] => {
  try {
    const data = localStorage.getItem('ingredients');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting ingredients from DB:', error);
    return [];
  }
};

export const updateIngredientInDB = (updatedIngredient: Ingredient): Ingredient[] => {
  try {
    const ingredients = getIngredientsFromDB();
    const updatedIngredients = ingredients.map(ingredient => 
      ingredient.id === updatedIngredient.id ? updatedIngredient : ingredient
    );
    
    localStorage.setItem('ingredients', JSON.stringify(updatedIngredients));
    return updatedIngredients;
  } catch (error) {
    console.error('Error updating ingredient in DB:', error);
    return getIngredientsFromDB();
  }
};

export const deleteIngredientFromDB = (ingredientId: number): Ingredient[] => {
  try {
    const ingredients = getIngredientsFromDB();
    const updatedIngredients = ingredients.filter(ingredient => ingredient.id !== ingredientId);
    
    localStorage.setItem('ingredients', JSON.stringify(updatedIngredients));
    return updatedIngredients;
  } catch (error) {
    console.error('Error deleting ingredient from DB:', error);
    return getIngredientsFromDB();
  }
};

export const saveRecipeToDB = (recipe: Recipe): Recipe[] => {
  try {
    const existingData = localStorage.getItem('recipes');
    let recipes: Recipe[] = existingData ? JSON.parse(existingData) : [];
    
    const maxId = recipes.length > 0 ? Math.max(...recipes.map(r => r.id || 0)) : 0;
    const newRecipe = { ...recipe, id: recipe.id || (maxId + 1) };
    
    recipes.push(newRecipe);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    
    return recipes;
  } catch (error) {
    console.error('Error saving recipe to DB:', error);
    return [];
  }
};

export const getRecipesFromDB = (): Recipe[] => {
  try {
    const data = localStorage.getItem('recipes');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting recipes from DB:', error);
    return [];
  }
};
