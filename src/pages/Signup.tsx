
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car, Facebook, ChevronRight, User, Mail, Phone, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Signup = () => {
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    navigate('/home');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phoneNumber || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Using phone number as email if no email is provided
    const email = formData.email || `${formData.phoneNumber.replace(/\s+/g, '')}@example.com`;

    try {
      setIsLoading(true);
      const { error } = await signUp(email, formData.password, {
        full_name: formData.name,
        phone_number: formData.phoneNumber
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Account created successfully! You can now login.");
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#1A1F2C] bg-grid-white/[0.02]">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center animate-float">
                <Car className="text-background w-8 h-8" strokeWidth={1.5} />
              </div>
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl -z-10" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white">Create Account</h1>
            <p className="text-gray-400">Join CarwashLink today</p>
          </div>
        </div>

        <div className="bg-[#232836] backdrop-blur-lg border border-white/5 rounded-2xl p-8 shadow-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Full Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  className="w-full bg-[#1A1F2C] border border-white/5 rounded-xl p-4 pl-12 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Email (Optional)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  className="w-full bg-[#1A1F2C] border border-white/5 rounded-xl p-4 pl-12 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Phone Number <span className="text-red-500">*</span></label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  className="w-full bg-[#1A1F2C] border border-white/5 rounded-xl p-4 pl-12 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  className="w-full bg-[#1A1F2C] border border-white/5 rounded-xl p-4 pl-12 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Confirm Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  className="w-full bg-[#1A1F2C] border border-white/5 rounded-xl p-4 pl-12 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-background font-semibold rounded-xl py-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Creating account...
                </span>
              ) : (
                <>
                  Create Account
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#232836] px-2 text-gray-400">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                className="flex items-center justify-center gap-2 p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-colors"
              >
                <Facebook className="w-5 h-5 text-[#1877F2]" />
                <span className="text-white text-sm">Facebook</span>
              </button>
              <button 
                type="button"
                className="flex items-center justify-center gap-2 p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#DB4437"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#4285F4"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#0F9D58"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-white text-sm">Google</span>
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-gray-400 mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
