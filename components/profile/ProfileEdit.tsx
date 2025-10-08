"use client";

import { useState, useRef } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { User, Camera, Link, Save, X } from 'lucide-react';
import { saveUserToStorage } from '../../lib/auth';
import { toast } from 'sonner';

interface ProfileEditProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  onClose: () => void;
  onProfileUpdate: (updatedUser: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  }) => void;
}

export function ProfileEdit({ user, onClose, onProfileUpdate }: ProfileEditProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar || '');
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image file selection (just preview, don't upload yet)
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Store the selected file and create preview
    setSelectedFile(file);
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (e.target?.result) {
        setAvatarPreview(e.target.result as string);
      }
    };
    fileReader.readAsDataURL(file);
    
    // Clear the avatar URL since we're using a file now
    setAvatarUrl('');
  };

  // Handle avatar URL change
  const handleAvatarUrlChange = (url: string) => {
    setAvatarUrl(url);
    setAvatarPreview(url);
    // Clear selected file since we're using URL
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted - handleSubmit called');
    console.log('User object:', user);
    console.log('Form data:', { name, email, avatarUrl, selectedFile: selectedFile?.name });
    setIsLoading(true);

    try {
      let finalAvatarUrl = avatarUrl;

      // If user selected a file, upload it first
      if (selectedFile) {
        console.log('Uploading file:', selectedFile.name);
        console.log('User ID for upload:', user.id);
        
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('avatar', selectedFile);
        formData.append('userId', user.id);

        console.log('FormData created, making upload request...');

        // Upload to your backend
        const uploadResponse = await fetch('/api/upload-avatar', {
          method: 'POST',
          body: formData,
        });

        console.log('Upload response status:', uploadResponse.status);
        const uploadData = await uploadResponse.json();
        console.log('Upload response data:', uploadData);
        
        if (uploadResponse.ok) {
          finalAvatarUrl = uploadData.avatarUrl;
          console.log('Upload successful, avatar URL:', finalAvatarUrl);
          toast.success('Image uploaded successfully!');
        } else {
          console.error('Upload failed:', uploadData);
          throw new Error(uploadData.message || 'Failed to upload image');
        }
      }

      // Now update the profile with all data
      console.log('Updating profile with:', { id: user.id, name, email, avatar: finalAvatarUrl });
      const response = await fetch('/api/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
          name,
          email,
          avatar: finalAvatarUrl,
        }),
      });

      const data = await response.json();
      console.log('Profile update response:', data);

      if (response.ok) {
        const updatedUser = {
          ...user,
          name,
          email,
          avatar: finalAvatarUrl,
        };

        // Update local storage
        saveUserToStorage(updatedUser);
        
        // Update parent component
        onProfileUpdate(updatedUser);
        
        toast.success('Profile updated successfully!');
        onClose();
      } else {
        // Handle specific error cases
        const errorMessage = data.message || `Update failed with status ${response.status}`;
        throw new Error(errorMessage);
      }
    } catch (error: unknown) {
      console.error('Profile update error:', error);
      
      // Handle network errors vs API errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error('Network error: Please check your connection');
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to update profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-0 shadow-none">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Edit Profile</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Update your profile information and avatar
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Profile Picture</Label>
                
                {/* Avatar Preview */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarPreview} alt={name} />
                    <AvatarFallback className="text-lg ">
                      {name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Choose how to set your profile picture
                    </p>
                    <div className="flex gap-2">
                      <Button
                        className='transition-all duration-200 ease-in-out cursor-pointer'
                        type="button"
                        variant={activeTab === 'url' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setActiveTab('url');
                          // Clear selected file when switching to URL tab
                          setSelectedFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                      >
                        <Link className="h-4 w-4 mr-1 " />
                        URL
                      </Button>
                      <Button
                        className='transition-all duration-200 ease-in-out cursor-pointer'
                        type="button"
                        variant={activeTab === 'upload' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setActiveTab('upload');
                          // Clear avatar URL when switching to upload tab
                          if (!selectedFile) {
                            setAvatarUrl('');
                          }
                        }}
                      >
                        <Camera className="h-4 w-4 mr-1" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Avatar URL Tab */}
                {activeTab === 'url' && (
                  <div className="space-y-2">
                    <Label htmlFor="avatarUrl">Avatar URL</Label>
                    <Input
                      id="avatarUrl"
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      value={avatarUrl}
                      onChange={(e) => handleAvatarUrlChange(e.target.value)}
                      className="w-full "
                    />
                    <p className="text-xs text-gray-500">
                      Enter a direct URL to an image file
                    </p>
                  </div>
                )}

                {/* Image Upload Tab */}
                {activeTab === 'upload' && (
                  <div className="space-y-2">
                    <Label htmlFor="avatarUpload">Upload Image</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        ref={fileInputRef}
                        id="avatarUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                        className="w-full transition-all duration-200 ease-in-out cursor-pointer"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        {isLoading ? 'Uploading...' : 'Choose Image'}
                      </Button>
                    </div>
                    {selectedFile && (
                      <p className="text-sm text-green-600 mt-2">
                        File selected: {selectedFile.name} (Ready to save)
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Supported formats: JPG, PNG, GIF (max 5MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Profile Information */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Profile Information</Label>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </CardContent>

            <div className="flex justify-end gap-3 p-6 border-t">
              <Button
                className='transition-all duration-200 ease-in-out cursor-pointer'
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className='transition-all duration-200 ease-in-out cursor-pointer'
                disabled={isLoading || !name.trim() || !email.trim()}
                onClick={(e) => {
                  console.log('Save button clicked!');
                  console.log('Button disabled state:', isLoading || !name.trim() || !email.trim());
                  console.log('Form values:', { name: name.trim(), email: email.trim(), isLoading });
                  
                  // Directly call handleSubmit for testing
                  e.preventDefault();
                  handleSubmit(e);
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}