
import { ArrowLeft, Heart, Menu } from "lucide-react";
import { Link } from "react-router-dom";

const favorites = [
  {
    id: 1,
    name: "Quickwash Services",
    address: "104, Hilton Street, Chillicolate, USA",
    image: "/lovable-uploads/f5732ae3-9d0b-42e1-afd0-3ad757441eb7.png",
    rating: 4.5,
  },
  // Duplicate entries for demo
  {
    id: 2,
    name: "Quickwash Services",
    address: "104, Hilton Street, Chillicolate, USA",
    image: "/lovable-uploads/f5732ae3-9d0b-42e1-afd0-3ad757441eb7.png",
    rating: 4.5,
  },
  {
    id: 3,
    name: "Quickwash Services",
    address: "104, Hilton Street, Chillicolate, USA",
    image: "/lovable-uploads/f5732ae3-9d0b-42e1-afd0-3ad757441eb7.png",
    rating: 4.5,
  },
];

const FavoritesPage = () => {
  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 mb-4">
        <div className="flex items-center gap-4">
          <Link to="/home" className="text-primary">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-medium text-white">Favorites</h1>
        </div>
        <Menu className="w-6 h-6 text-white" />
      </div>

      {/* Favorites List */}
      <div className="space-y-4 p-4">
        {favorites.map((favorite) => (
          <div
            key={favorite.id}
            className="flex items-center gap-4 p-4 rounded-xl bg-[#232836] relative group hover:ring-2 hover:ring-primary/50 transition-all"
          >
            <img
              src={favorite.image}
              alt={favorite.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="text-white font-medium">{favorite.name}</h3>
              <p className="text-gray-400 text-sm">{favorite.address}</p>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary fill-primary" />
              <div className="px-2 py-1 bg-primary text-secondary text-sm font-medium rounded">
                {favorite.rating} ★
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
