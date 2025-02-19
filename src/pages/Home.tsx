
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Car, Calendar, Settings, Search, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

// Replace with your Mapbox token
mapboxgl.accessToken = "YOUR_MAPBOX_TOKEN";

const Home = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [location, setLocation] = useState("104, Hilton Street, Chillicolate, USA");

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-93.552, 40.186], // Chillicothe coordinates
      zoom: 12,
      pitch: 0,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add location marker
    new mapboxgl.Marker({
      color: "#1eefac",
      scale: 1.5,
    })
      .setLngLat([-93.552, 40.186])
      .addTo(map.current);

    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapContainer} className="absolute inset-0" />
      </div>

      {/* Bottom Navigation */}
      <div className="bg-[#1A1F2C]/95 backdrop-blur-md border-t border-border">
        <div className="max-w-lg mx-auto px-4 py-6">
          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-8 mb-8">
            <button className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center">
                <Car className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">Select Car</span>
            </button>
            <button className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center">
                <Settings className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">Services</span>
            </button>
            <button className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">When?</span>
            </button>
          </div>

          {/* Location Search */}
          <div className="relative">
            <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-4 pr-12">
              <MapPin className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Service Location</div>
                <div className="text-sm text-foreground">{location}</div>
              </div>
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
