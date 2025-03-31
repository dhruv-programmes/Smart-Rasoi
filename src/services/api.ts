
import { Restaurant } from '@/context/RestaurantContext';

export interface Ingredient {
  id?: number;
  name: string;
  quantity: number;
  expiration: number;
}

export interface DetectIngredientsResponse {
  ingredients: Ingredient[];
  success: boolean;
  error?: string;
}

export interface Recipe {
  id?: number;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  preparationTime: string;
  cookingTime: string;
  servings: number;
  difficultyLevel: string;
}

export interface GenerateRecipeResponse {
  recipe: Recipe;
  success: boolean;
  error?: string;
}

export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const detectIngredients = async (imageFile: File, restaurant: Restaurant): Promise<DetectIngredientsResponse> => {
  try {
    // Convert image to base64
    const base64Image = await fileToBase64(imageFile);

    const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Analyze the image and identify all visible food ingredients. 
                - Detect name and quantity accurately. 
                - Estimate expiration in days based on appearance and perishability.
                - Return in JSON: [{"name":"tomato","quantity":4,"expiration":5}, {"name":"potato","quantity":2,"expiration":10}].
                - Default expiration: Fresh vegetables (5-7 days), dairy (3-5 days), dry goods (30+ days).
                - Focus on ingredients that would be used in ${restaurant.cuisine} cuisine, especially for ${restaurant.name} which specializes in ${restaurant.specialties.join(", ")}.`
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Image.split(',')[1]
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.05,
          topK: 16,
          topP: 0.9,
          maxOutputTokens: 2048
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textContent) {
      throw new Error("Invalid API response: No text content.");
    }

    const jsonMatch = textContent.match(/\[\s*\{.*?\}\s*\]/s);
    if (!jsonMatch) {
      throw new Error("Failed to parse ingredients from API response");
    }

    const ingredientsArray: Ingredient[] = JSON.parse(jsonMatch[0]).map((item: { name: string, quantity: number, expiration: number }) => ({
      name: item.name,
      quantity: Math.min(Math.max(item.quantity, 1), 10), // Clamping quantity between 1 and 10
      expiration: item.expiration > 0 ? item.expiration : 1 // Ensure expiration is at least 1 day
    }));

    return {
      ingredients: ingredientsArray,
      success: true
    };
  } catch (error) {
    console.error('Error detecting ingredients:', error);
    return {
      ingredients: [],
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const generateRecipe = async (
  ingredients: string[], 
  restaurant: Restaurant
): Promise<GenerateRecipeResponse> => {
  try {
    const prompt = `
    Generate an authentic Indian recipe using some or all of these ingredients: ${ingredients.join(", ")}.
    
    Context: You are the chef at "${restaurant.name}" which specializes in ${restaurant.specialties.join(", ")}. 
    The restaurant is known for ${restaurant.description}.
    
    Return JSON format:
    {
      "title": "Recipe Name",
      "description": "Brief description of the dish",
      "ingredients": ["Formatted ingredient 1", "Formatted ingredient 2", ...],
      "instructions": ["Step 1", "Step 2 with **bold text** for emphasis", ...],
      "preparationTime": "X minutes",
      "cookingTime": "X minutes",
      "servings": number,
      "difficultyLevel": "Easy/Medium/Hard"
    }
    
    Ensure the recipe is an **authentic Indian dish** that aligns with ${restaurant.name}'s specialties. Instructions should be clear and formatted in Markdown with bold highlights where necessary.
    `;

    const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7, // Balanced randomness for variety
          topK: 40, // Slightly higher for more diversity
          topP: 0.95,
          maxOutputTokens: 4096
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textContent) {
      throw new Error("Invalid API response: No text content.");
    }

    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse recipe from API response");
    }

    const recipeData: Recipe = JSON.parse(jsonMatch[0]);

    return {
      recipe: recipeData,
      success: true
    };
  } catch (error) {
    console.error('Error generating recipe:', error);
    return {
      recipe: {
        title: '',
        description: '',
        ingredients: [],
        instructions: [],
        preparationTime: '',
        cookingTime: '',
        servings: 0,
        difficultyLevel: ''
      },
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Function to Convert File to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
