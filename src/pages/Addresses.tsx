
import { ArrowLeft, Building2, Home, MapPin, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const addresses = [
  {
    id: "1",
    type: "home",
    address: "14134, Silver Green Street, 2nd Avenue, Hemiltone, New York, USA",
  },
  {
    id: "2",
    type: "office",
    address: "14134, Silver Green Street, 2nd Avenue, Hemiltone, New York, USA",
  },
  {
    id: "3",
    type: "other",
    address: "14134, Silver Green Street, 2nd Avenue, Hemiltone, New York, USA",
  },
];

const AddressesPage = () => {
  return (
    <div className="min-h-screen bg-[#1A1F2C] p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/home" className="text-primary hover:text-primary/80">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-semibold text-white">My Address</h1>
      </div>

      <h2 className="text-sm font-medium text-gray-400 mb-5">Saved Addresses</h2>

      {/* Address List */}
      <div className="space-y-4 mb-24">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="p-5 rounded-xl bg-[#232836] flex items-start gap-5 group hover:ring-2 hover:ring-primary/50 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-[#2A2F3C] flex items-center justify-center shrink-0">
              {address.type === "home" && <Home className="w-6 h-6 text-primary" />}
              {address.type === "office" && <Building2 className="w-6 h-6 text-primary" />}
              {address.type === "other" && <MapPin className="w-6 h-6 text-primary" />}
            </div>
            <p className="text-[15px] leading-relaxed text-gray-200 pt-1">{address.address}</p>
          </div>
        ))}
      </div>

      {/* Add Address Button */}
      <Link
        to="/addresses/add"
        className="fixed bottom-6 left-4 right-4 p-4 rounded-lg bg-gradient-to-r from-[#1eefac] to-[#1EAEDB] text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Add New Location
      </Link>
    </div>
  );
};

export default AddressesPage;
