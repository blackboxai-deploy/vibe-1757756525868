"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PostCreatorProps {
  onClose: () => void;
  onPostCreated: (post: {
    content: string;
    category: string;
    anonymousName: string;
    tags: string[];
  }) => void;
  anonymousName: string;
}

export function PostCreator({ onClose, onPostCreated, anonymousName }: PostCreatorProps) {
  const [formData, setFormData] = useState({
    content: "",
    category: "",
    tags: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: "general", label: "General" },
    { value: "relationships", label: "Relationships" },
    { value: "work", label: "Work & Career" },
    { value: "family", label: "Family" },
    { value: "health", label: "Health & Wellness" },
    { value: "personal", label: "Personal Growth" },
    { value: "secrets", label: "Secrets" },
    { value: "regrets", label: "Regrets" }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.content.trim()) {
      newErrors.content = "Please share your confession";
    } else if (formData.content.trim().length < 10) {
      newErrors.content = "Please share at least 10 characters";
    } else if (formData.content.trim().length > 1000) {
      newErrors.content = "Please keep your confession under 1000 characters";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const tags = formData.tags
        .split(",")
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0)
        .slice(0, 5); // Limit to 5 tags

      onPostCreated({
        content: formData.content.trim(),
        category: formData.category,
        anonymousName,
        tags
      });
    } catch {
      setErrors({ general: "Failed to share your confession. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Share Your Confession</CardTitle>
          <CardDescription>
            Your identity is completely protected. Share what's on your mind.
          </CardDescription>
          <div className="flex items-center gap-2 pt-2">
            <span className="text-sm text-muted-foreground">Posting as:</span>
            <Badge variant="secondary">{anonymousName}</Badge>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {errors.general && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-800 dark:text-red-400">{errors.general}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="content">Your Confession *</Label>
              <Textarea
                id="content"
                placeholder="Share what&apos;s on your mind... This is a safe space."
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                rows={6}
                className="resize-none"
                disabled={isSubmitting}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formData.content.length}/1000 characters</span>
                {errors.content && (
                  <span className="text-red-600 dark:text-red-400">{errors.content}</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleInputChange("category", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a category..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (optional)</Label>
              <Input
                id="tags"
                placeholder="anxiety, support, help (comma-separated, max 5)"
                value={formData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                Add relevant tags to help others find and relate to your confession
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2 text-sm">🔒 Privacy Notice</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Your confession will be posted anonymously</li>
                <li>• No personal information is collected or shared</li>
                <li>• You can&apos;t edit or delete after posting</li>
                <li>• Be respectful and follow community guidelines</li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.content.trim() || !formData.category}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              {isSubmitting ? "Sharing..." : "Share Anonymously"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}