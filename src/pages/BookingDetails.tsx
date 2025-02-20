
import { ArrowLeft, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";

const BookingDetailsPage = () => {
  return (
    <div className="min-h-screen bg-[#1A1F2C] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/home" className="text-primary">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-medium text-white">Booking Details</h1>
        <button className="text-white">
          <MoreVertical className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Service Provider */}
        <div>
          <h2 className="text-sm text-primary mb-2">Service Provider</h2>
          <div className="text-white text-lg font-medium">Quickwash Services</div>
          <div className="text-gray-400 text-sm">104, Hilton Street, Chillicolate, USA</div>
        </div>

        {/* Car Selected */}
        <div>
          <h2 className="text-sm text-primary mb-2">Car Selected</h2>
          <div className="text-white text-lg font-medium">Vanquish S Aston Martine</div>
          <div className="text-gray-400 text-sm">FYD 6778</div>
        </div>

        {/* Pick up & Drop */}
        <div>
          <h2 className="text-sm text-primary mb-2">Pick up & Drop Arranged</h2>
          <div className="text-gray-400 text-sm">Service provider will pick up & drop at your place.</div>
          <div className="mt-2">
            <div className="text-white text-sm font-medium">Pick up - Delivery Address</div>
            <div className="text-gray-400 text-sm">(Home) 221, Red twin towers, Chillicolate, USA</div>
          </div>
        </div>

        {/* Date & Time */}
        <div>
          <h2 className="text-sm text-primary mb-2">Date & Time</h2>
          <div className="text-white text-lg font-medium">20th June, 2018</div>
          <div className="text-gray-400 text-sm">09:00 am</div>
        </div>

        {/* Services Selected */}
        <div>
          <h2 className="text-sm text-primary mb-2">Services Selected</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-white">
              <span>Bodywash</span>
              <span>$50</span>
            </div>
            <div className="flex justify-between text-white">
              <span>Interior Cleaning</span>
              <span>$70</span>
            </div>
            <div className="flex justify-between text-white">
              <span>Pick up-Drop charge</span>
              <span>$10</span>
            </div>
          </div>
        </div>

        {/* Amount Paid */}
        <div className="pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-white text-lg font-medium">Amount Paid</span>
            <span className="text-primary text-xl font-semibold">$130</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPage;
