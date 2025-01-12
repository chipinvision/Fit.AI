import React, { useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onImageAnalysis: (result: string) => void;
  onUploadStart: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageAnalysis, onUploadStart }) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      onUploadStart();
      const base64 = await convertToBase64(file);
      const analysis = await analyzeImage(base64);
      onImageAnalysis(analysis);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('imageInput')?.click()}
    >
      <input
        type="file"
        id="imageInput"
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file);
        }}
      />
      <div className="flex flex-col items-center gap-2">
        <div className="p-3 bg-primary/10 rounded-full">
          <Upload className="w-6 h-6 text-primary" />
        </div>
        <p className="text-sm font-medium">
          Drop your image here or click to upload
        </p>
        <p className="text-xs text-gray-500">
          Supports: JPG, PNG (max 5MB)
        </p>
      </div>
    </div>
  );
};

export default ImageUpload;