import { ArrowLeft, Camera, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState("/lovable-uploads/1775f99c-0d21-45df-be77-82e3edd8658b.png");

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
      });
      return;
    }

    try {
      setUploading(true);

      // Create a temporary URL for preview
      const previewUrl = URL.createObjectURL(file);
      setProfileImage(previewUrl);

      // Show success message
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been successfully updated",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your profile picture",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/home" className="text-primary">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-medium text-white">Profile</h1>
      </div>

      {/* Profile Content */}
      <div className="flex flex-col items-center">
        {/* Profile Picture */}
        <div className="relative mb-12 group">
          <div className="w-32 h-32 rounded-full overflow-hidden ring-2 ring-primary/20 ring-offset-2 ring-offset-[#1A1F2C]">
            <img
              src={profileImage}
              alt="Profile"
              className={`w-full h-full object-cover transition-transform duration-300 ${
                uploading ? 'scale-110 blur-sm' : 'scale-100'
              }`}
            />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Upload className="w-6 h-6 text-white animate-bounce" />
              </div>
            )}
          </div>
          
          <label 
            htmlFor="profile-upload"
            className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-secondary cursor-pointer 
                     transform transition-all duration-300 hover:scale-110 hover:rotate-12
                     active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Camera className="w-5 h-5" />
          </label>

          {/* Hover instruction */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-xs text-gray-400 whitespace-nowrap">Click to change photo</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="w-full space-y-8">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Full Name</label>
            <div className="text-white text-lg border-b border-gray-700 pb-2">
              Samantha Smith
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Email Address</label>
            <div className="text-white text-lg border-b border-gray-700 pb-2">
              samanthasmith@mail.com
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Phone Number</label>
            <div className="text-white text-lg border-b border-gray-700 pb-2">
              +1 987 654 3210
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
