import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold">Contact Us</h3>
            <p className="mt-2 text-sm">
              Phone: +1 234 567 890
              <br />
              Email: info@schoolnexus.org
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold">Address</h3>
            <p className="mt-2 text-sm">
              123 Education Lane
              <br />
              Springfield, USA
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold">Follow Us</h3>
            <p className="mt-2 text-sm">
              Facebook | Twitter | Instagram
            </p>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-400">
          © 2025 SchoolNexus. All rights reserved.
        </div>
      </div>
    </footer>
  );
};