import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  ChefHat,
  Users,
  ArrowRight,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { Recipe } from "@/services/api";
import ReactMarkdown from "react-markdown";
import RecipeChat from "./RecipeChat";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [showChat, setShowChat] = useState(false);

  return (
    <Card className="border-2 border-primary/20 shadow-md">
      <CardHeader className="bg-accent rounded-t-lg">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{recipe.title}</CardTitle>
            <CardDescription className="mt-1">
              {recipe.description}
            </CardDescription>
          </div>
          <Badge className="bg-primary hover:bg-primary/90">
            {recipe.difficultyLevel}
          </Badge>
        </div>
      </CardHeader>

      <CardContent
        className={`pt-6 ${
          expanded ? "" : "max-h-48 overflow-hidden relative"
        }`}
      >
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
        )}

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
            <span className="text-sm">Prep: {recipe.preparationTime}</span>
          </div>
          <div className="flex items-center">
            <ChefHat className="w-4 h-4 mr-1 text-muted-foreground" />
            <span className="text-sm">Cook: {recipe.cookingTime}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1 text-muted-foreground" />
            <span className="text-sm">Serves: {recipe.servings}</span>
          </div>
        </div>

        <div className="markdown">
          <h3 className="text-lg font-bold mb-2">Ingredients</h3>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>

          <h3 className="text-lg font-bold mb-2 mt-4">Instructions</h3>
          <ol>
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>
                <ReactMarkdown>{instruction}</ReactMarkdown>
              </li>
            ))}
          </ol>
        </div>
      </CardContent>

      <CardFooter className="border-t p-4 flex flex-col gap-2 m-1">
        <div className="flex justify-center w-full space-x-2">
          <Button
            variant="outline"
            onClick={() => setExpanded(!expanded)}
            className="hover:bg-accent"
          >
            {expanded ? (
              <>
                <ArrowUp className="mr-2 h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ArrowDown className="mr-2 h-4 w-4" />
                Show Full Recipe
              </>
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowChat(!showChat)}
            // className="w-full"
          >
            {showChat ? "Hide Recipe Assistant" : "Ask About This Recipe"}
          </Button>
        </div>
        {showChat && (
          <div className="mt-4 w-full">
            <RecipeChat recipe={recipe} />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;
