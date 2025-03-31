import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRestaurant } from '@/context/RestaurantContext';
import { useToast } from '@/hooks/use-toast';
import { Recipe } from '@/services/api';
import { Loader2 } from 'lucide-react';

interface RecipeChatProps {
  recipe: Recipe;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const RecipeChat = ({ recipe }: RecipeChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: `Hello! I'm your recipe assistant for "${recipe.title}". Feel free to ask me any questions about ingredients, preparation steps, or cooking tips!`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { restaurant } = useRestaurant();
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const recipeContext = `
        Recipe: ${recipe.title}
        Description: ${recipe.description}
        Ingredients: ${recipe.ingredients.join(', ')}
        Preparation Time: ${recipe.preparationTime}
        Cooking Time: ${recipe.cookingTime}
        Difficulty: ${recipe.difficultyLevel}
      `;
      
      const restaurantContext = restaurant ? 
        `Restaurant: ${restaurant.name}, Cuisine: ${restaurant.cuisine}, Specialties: ${restaurant.specialties.join(', ')}` 
        : 'No restaurant information available';
      
      const prompt = `
        You are a helpful cooking assistant providing information about "${recipe.title}". 
        
        Recipe details:
        ${recipeContext}
        
        Restaurant context:
        ${restaurantContext}
        
        Instructions:
        ${recipe.instructions.join('\n')}
        
        User question: ${input}
        
        Provide a helpful, concise response about this recipe. If asked about substitutions, cooking tips, or variations, provide practical advice.
      `;

      const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": "AIzaSyBIhQnuMYl_YaHkleM7Ucu3RafpLDabXJc"
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 32,
            topP: 0.95,
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
        throw new Error("Invalid API response");
      }

      setMessages(prev => [...prev, { role: 'assistant', content: textContent.trim() }]);
      
    } catch (error) {
      console.error('Error in recipe chat:', error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I couldn't process your question. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-accent">
        <CardTitle className="text-lg">Recipe Assistant</CardTitle>
        <CardDescription>
          Ask questions about "{recipe.title}"
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px] p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-muted flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Thinking...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-3 bg-background">
        <div className="flex w-full items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the recipe..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isLoading) {
                handleSendMessage();
              }
            }}
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RecipeChat;
