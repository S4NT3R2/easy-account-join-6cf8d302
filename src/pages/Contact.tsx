
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/home" className="text-primary">
          <ArrowLeft className="w-6 h-6" />
        </Link>
      </div>

      {/* Content */}
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">We're Happy to</h1>
          <h1 className="text-3xl font-bold text-white mb-4">hear from you !!</h1>
          <p className="text-gray-400">Let us know your queries & Feedbacks</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button className="flex-1 flex items-center justify-center gap-2 bg-white text-[#1A1F2C] py-3 px-6 rounded-full font-medium">
            <Phone className="w-5 h-5" />
            <span>Call us</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#1eefac] to-[#1EAEDB] text-white py-3 px-6 rounded-full font-medium">
            <Mail className="w-5 h-5" />
            <span>Mail us</span>
          </button>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-white flex items-center gap-2 mb-6">
            <Mail className="w-5 h-5" />
            Send your message
          </h2>
          
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-transparent border-b border-gray-700 py-2 text-white placeholder:text-gray-500 focus:border-primary transition-colors focus:outline-none"
              />
            </div>
            <div>
              <input
                type="tel"
                placeholder="Contact Number"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                className="w-full bg-transparent border-b border-gray-700 py-2 text-white placeholder:text-gray-500 focus:border-primary transition-colors focus:outline-none"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Write your message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-transparent border-b border-gray-700 py-2 text-white placeholder:text-gray-500 focus:border-primary transition-colors focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-full bg-gradient-to-r from-[#1eefac] to-[#1EAEDB] text-white font-medium mt-8"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
