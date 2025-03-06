
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const languages = [
  { code: "en", name: "English" },
  { code: "ar", name: "Arabic" },
  { code: "fr", name: "French" },
  { code: "pt", name: "Portuguese" },
  { code: "sn", name: "Shona" },
];

const LanguagePage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  return (
    <div className="min-h-screen bg-[#1A1F2C] p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/home" className="text-primary hover:text-primary/80">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-semibold text-white">Select Language</h1>
      </div>

      {/* Language List */}
      <div className="space-y-2">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => setSelectedLanguage(language.code)}
            className="w-full p-4 rounded-lg bg-[#232836] flex items-center gap-4 group hover:ring-2 hover:ring-primary/50 transition-all"
          >
            <div className={`w-6 h-6 rounded-full border-2 ${
              selectedLanguage === language.code
                ? "border-primary bg-primary"
                : "border-gray-600"
              } flex items-center justify-center`}
            >
              {selectedLanguage === language.code && (
                <div className="w-3 h-3 rounded-full bg-white" />
              )}
            </div>
            <span className="text-white">{language.name}</span>
          </button>
        ))}
      </div>

      {/* Save Button */}
      <button className="fixed bottom-6 left-4 right-4 p-4 rounded-lg bg-gradient-to-r from-[#1eefac] to-[#1EAEDB] text-white font-medium hover:opacity-90 transition-opacity">
        Save
      </button>
    </div>
  );
};

export default LanguagePage;
