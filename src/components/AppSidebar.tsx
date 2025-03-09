
import { X, Shield, Car, MapPin, Heart, Globe, MessageSquare, LogOut, Settings } from "lucide-react";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface AppSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppSidebar({ open, onOpenChange }: AppSidebarProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          throw error;
        }
        
        setProfileData(data);
        
        // Check if user is admin (in a real app, this would come from a role system)
        // For this demo, we'll just set a specific user as admin
        if (user.email === "mcdchiez16.mtc@gmail.com") {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleItemClick = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  // Create menu items dynamically based on user role
  const getMenuItems = () => {
    let items = [
      {
        icon: Shield,
        label: "My Bookings",
        path: "/booking-details",
        action: 'navigate'
      },
      {
        icon: Car,
        label: "My Cars",
        path: "/cars",
        action: 'navigate'
      },
      {
        icon: MapPin,
        label: "My Addresses",
        path: "/addresses",
        action: 'navigate'
      },
      {
        icon: Heart,
        label: "Favorites",
        path: "/favorites",
        action: 'navigate'
      },
      {
        icon: Globe,
        label: "Change Language",
        path: "/language",
        action: 'navigate'
      },
      {
        icon: MessageSquare,
        label: "Contact us",
        path: "/contact",
        action: 'navigate'
      },
      {
        icon: LogOut,
        label: "Logout",
        path: "/login",
        action: 'signout'
      },
    ];

    // Only add admin link for admin users
    if (isAdmin) {
      items.splice(4, 0, {
        icon: Settings,
        label: "Admin Dashboard",
        path: "/admin",
        action: 'navigate'
      });
    }

    return items;
  };

  const menuItems = getMenuItems();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px] p-0 bg-[#1A1F2C]">
        {/* Profile Section */}
        <div className="p-6 border-b border-white/5">
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                <img 
                  src={profileData?.profile_image || "/lovable-uploads/1775f99c-0d21-45df-be77-82e3edd8658b.png"} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{profileData?.full_name || "User"}</h3>
                <button 
                  onClick={() => handleItemClick('/profile')}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  View Profile
                </button>
              </div>
              <button 
                onClick={() => onOpenChange(false)}
                className="text-muted-foreground hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="px-2 py-4">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => item.action === 'navigate' 
                  ? handleItemClick(item.path) 
                  : item.action === 'signout' 
                    ? handleSignOut() 
                    : null
                }
                className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-white rounded-lg transition-all duration-200 hover:bg-white/5 active:bg-white/10 group"
              >
                <div className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <item.icon className="w-5 h-5 group-hover:text-primary transition-colors" />
                </div>
                <span className="text-sm font-medium group-hover:text-primary transition-colors">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
