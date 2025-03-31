
import { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { detectIngredients } from '@/services/api';
import { saveIngredientsToDB } from '@/services/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onIngredientsDetected: (ingredients: any[]) => void;
}

const ImageUploader = ({ onIngredientsDetected }: ImageUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { restaurant } = useRestaurant();
  const { toast } = useToast();
  
  const handleFileChange = (file: File | null) => {
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileChange(files[0]);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileChange(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !restaurant) return;
    
    setIsUploading(true);
    
    try {
      const result = await detectIngredients(selectedFile, restaurant);
      
      if (result.success && result.ingredients.length > 0) {
        // Save ingredients to database
        const savedIngredients = saveIngredientsToDB(result.ingredients);
        
        // Pass ingredients to parent component
        onIngredientsDetected(savedIngredients);
        
        toast({
          title: "Ingredients Detected!",
          description: `Found ${result.ingredients.length} ingredients in your image.`,
        });
      } else {
        toast({
          title: "Detection Failed",
          description: result.error || "Failed to detect ingredients. Try another image.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="border-2 border-spice-200">
      <CardHeader className="bg-spice-100 rounded-t-lg">
        <CardTitle className="flex items-center text-spice-800">
          <Camera className="mr-2" /> Ingredient Detection
        </CardTitle>
        <CardDescription>
          Upload a photo of your ingredients to add them to your inventory
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging ? 'bg-spice-100 border-spice-500' : 'border-muted-foreground/20 hover:border-spice-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          {previewUrl ? (
            <div className="relative">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="mx-auto max-h-64 rounded-md" 
              />
              <div className="mt-2 text-sm text-muted-foreground">
                {selectedFile?.name}
              </div>
            </div>
          ) : (
            <div className="py-8">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2 text-sm font-medium">
                Drag and drop or click to upload an image
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                JPEG, PNG or other image formats (max 5MB)
              </p>
            </div>
          )}
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 p-4">
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="w-full bg-spice-600 hover:bg-spice-700"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Image...
            </>
          ) : (
            'Detect Ingredients'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImageUploader;
