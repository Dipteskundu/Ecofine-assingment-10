import React from "react";
import { Leaf } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-green-100 text-gray-700 py-10 mt-10">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        
        {/* Logo / Site Name */}
        <div className="flex items-center space-x-2">
          <Leaf className="text-green-600 w-6 h-6" />
          <span className="text-xl font-semibold text-green-800">GreenHub</span>
        </div>

        {/* Short Description */}
        <div>
          <p className="text-sm leading-relaxed">
            Join us in creating cleaner neighborhoods and a greener planet.
            GreenHub connects people for community cleanups and sustainability efforts.
          </p>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-green-800 font-semibold mb-3">Useful Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-green-700 transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-700 transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-700 transition-colors">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-700 transition-colors">
                Report Issue
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-green-900 mt-8 border-t border-green-300 pt-4">
        © {new Date().getFullYear()} GreenHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
