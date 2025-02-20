
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const SplashScreen = () => {
  const navigate = useNavigate();
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const fadeTimeout = setTimeout(() => {
      setFade(true);
    }, 2000);

    const navigateTimeout = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 2500);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(navigateTimeout);
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-[#1A1F2C] flex flex-col items-center justify-center">
      <div
        className={`space-y-6 text-center transition-opacity duration-500 ${
          fade ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Logo */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50 rounded-full animate-pulse blur-xl opacity-50" />
          <div className="relative bg-[#232836] rounded-full p-6">
            <img
              src="/lovable-uploads/abb66627-cad4-4c4f-8531-2210017f4336.png"
              alt="CarwashLink"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">
            Car<span className="text-primary">wash</span>Link
          </h1>
          <p className="text-gray-400 text-sm">Your car deserves the best care</p>
        </div>
      </div>
    </div>
  );
};
