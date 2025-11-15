'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImagePlus, X, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';
import API from '../config/api';

export default function CreatePost() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    tags: []
  });
  
  const [tagInput, setTagInput] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));

    // Handle image preview
    if (name === 'image' && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  // Handle tag input
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!formData.tags.includes(newTag) && formData.tags.length < 5) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Form submission
 const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Form submitted with:", { ...formData, tags });

  if (formData.tags.length === 0) {
    toast.error("Please add at least one tag");
    return;
  }

  if (!formData.image) {
    toast.error("Please select an image");
    return;
  }

  try {
    setIsLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("tags", JSON.stringify(formData.tags)); // Changed to send tags as JSON string
    data.append("image", formData.image); // Make sure this is the file object

    console.log("Sending request with form data:", {
      title: formData.title,
      content: formData.content,
      tags: formData.tags,
      hasImage: !!formData.image
    });

    const response = await API.post("/api/posts/create", data, {
      headers: {
        'Content-Type': 'multipart/form-data' // Explicitly set content type
      }
    });

    console.log("Response:", response.data);
    toast.success("Post created successfully!");
    navigate("/");
  } catch (error) {
    console.error("Error creating post:", error);
    toast.error(error.response?.data?.message || "Failed to create post");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Post</CardTitle>
          <CardDescription>Share your thoughts and ideas with the community</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter post title"
                className="text-base h-12"
                required
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Write your post content here..."
                className="min-h-[200px] text-base"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Featured Image</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  {previewImage ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-lg" 
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImage(null);
                          setFormData(prev => ({ ...prev, image: null }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <ImagePlus className="w-12 h-12 mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF (Max 5MB)</p>
                    </div>
                  )}
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleInputChange}
                  />
                </label>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="relative">
                <div className="flex items-center">
                  <Tag className="absolute left-3 text-gray-400" size={18} />
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Add tags (press Enter to add)"
                    className="pl-10"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Add up to 5 tags to help others find your post
                </p>
              </div>
              
              {/* Tags Display */}
              {/* {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 rounded-full p-0.5 hover:bg-blue-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )} */}
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Publishing...' : 'Publish Post'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}