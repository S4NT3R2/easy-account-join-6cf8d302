
import { useState } from "react";
import { Link } from "react-router-dom";
import { Car, Facebook, ChevronRight, Phone } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("United States");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      toast.error("Please enter your phone number");
      return;
    }
    // Add form submission logic here
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
            <h1 className="text-4xl font-bold text-white">Welcome Back!</h1>
            <p className="text-gray-400">Sign in to continue using CarwashLink</p>
          </div>
        </div>

        <div className="bg-[#232836] backdrop-blur-lg border border-white/5 rounded-2xl p-8 shadow-xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Select Country</label>
              <select 
                className="w-full bg-[#1A1F2C] border border-white/5 rounded-xl p-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
                <option>Australia</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  className="w-full bg-[#1A1F2C] border border-white/5 rounded-xl p-4 pl-12 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-primary text-background font-semibold rounded-xl py-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              Continue 
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#232836] px-2 text-gray-400">
                Or continue with
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
        </div>

        <p className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
