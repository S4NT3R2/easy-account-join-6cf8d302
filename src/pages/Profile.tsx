
import { ArrowLeft, Camera } from "lucide-react";
import { Link } from "react-router-dom";

const ProfilePage = () => {
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
        <div className="relative mb-12">
          <div className="w-32 h-32 rounded-full overflow-hidden">
            <img
              src="/lovable-uploads/1775f99c-0d21-45df-be77-82e3edd8658b.png"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-secondary">
            <Camera className="w-5 h-5" />
          </button>
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
