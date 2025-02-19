
import { X, Shield, Car, MapPin, Heart, Globe, MessageSquare, LogOut } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";

interface AppSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppSidebar({ open, onOpenChange }: AppSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 bg-[#1A1F2C] border-r-0 p-0">
        {/* Profile Section */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
              <img 
                src="/lovable-uploads/1775f99c-0d21-45df-be77-82e3edd8658b.png" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">Samantha Smith</h3>
              <button className="text-sm text-muted-foreground hover:text-primary transition-colors">
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
        </div>

        {/* Menu Items */}
        <div className="px-2 py-4">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-primary rounded-lg transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center group-hover:bg-primary/10">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}

const menuItems = [
  {
    icon: Shield,
    label: "My Bookings",
  },
  {
    icon: Car,
    label: "My Cars",
  },
  {
    icon: MapPin,
    label: "My Addresses",
  },
  {
    icon: Heart,
    label: "Favorites",
  },
  {
    icon: Globe,
    label: "Change Language",
  },
  {
    icon: MessageSquare,
    label: "Contact us",
  },
  {
    icon: LogOut,
    label: "Logout",
  },
];
