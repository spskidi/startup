import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">EcommercePro</h3>
            <p className="text-gray-400">Your trusted e-commerce platform for quality products and great deals.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/products" className="hover:text-white transition">Products</a></li>
              <li><a href="/" className="hover:text-white transition">About</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition">Help Center</a></li>
              <li><a href="/" className="hover:text-white transition">Contact Us</a></li>
              <li><a href="/" className="hover:text-white transition">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="/" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="/" className="hover:text-white transition">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 EcommercePro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
