
import { ArrowLeft, Building2, Home, MapPin, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Address {
  id: string;
  type: string;
  address: string;
}

const AddressesPage = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('addresses')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setAddresses(data || []);
      } catch (error: any) {
        toast.error("Failed to load addresses: " + error.message);
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [user]);

  const deleteAddress = async (id: string) => {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setAddresses(addresses.filter(address => address.id !== id));
      toast.success("Address deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete address: " + error.message);
      console.error("Error deleting address:", error);
    }
  };

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
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : addresses.length === 0 ? (
          <div className="py-8 text-center text-gray-400">
            <p>No addresses saved yet</p>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address.id}
              className="p-5 rounded-xl bg-[#232836] flex items-start gap-5 group hover:ring-2 hover:ring-primary/50 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-[#2A2F3C] flex items-center justify-center shrink-0">
                {address.type === "home" && <Home className="w-6 h-6 text-primary" />}
                {address.type === "office" && <Building2 className="w-6 h-6 text-primary" />}
                {address.type === "other" && <MapPin className="w-6 h-6 text-primary" />}
              </div>
              <p className="text-[15px] leading-relaxed text-gray-200 pt-1 flex-1">{address.address}</p>
              <button 
                onClick={() => deleteAddress(address.id)}
                className="text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
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
