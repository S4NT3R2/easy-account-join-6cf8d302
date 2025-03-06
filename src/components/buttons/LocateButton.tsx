
import React from 'react';
import { Locate } from 'lucide-react';

interface LocateButtonProps {
  onClick: () => void;
}

const LocateButton: React.FC<LocateButtonProps> = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="absolute top-20 right-4 z-10 bg-[#232836] p-3 rounded-full shadow-lg hover:bg-[#2c3143] transition-colors"
    >
      <Locate className="w-5 h-5 text-primary" />
    </button>
  );
};

export default LocateButton;
