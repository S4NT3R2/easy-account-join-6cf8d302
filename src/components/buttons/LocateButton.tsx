
import React from 'react';
import { Locate } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface LocateButtonProps {
  onClick: () => void;
  isLocating?: boolean;
}

const LocateButton: React.FC<LocateButtonProps> = ({ onClick, isLocating = false }) => {
  return (
    <Button 
      onClick={onClick}
      className="absolute top-20 right-4 z-10 bg-[#232836] p-2 h-auto rounded-full shadow-lg hover:bg-[#2c3143] transition-colors"
      disabled={isLocating}
      variant="ghost"
      size="icon"
    >
      <Locate className={`w-5 h-5 ${isLocating ? 'text-primary animate-pulse' : 'text-primary'}`} />
    </Button>
  );
};

export default LocateButton;
