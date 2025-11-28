import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const InstagramFeed: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Create the script element
    const script = document.createElement('script');
    script.src = 'https://cdn.lightwidget.com/widgets/lightwidget.js';
    script.async = true;
    script.id = 'lightwidget-script';

    // Handle script loading
    script.onload = () => {
      setTimeout(() => setIsLoading(false), 1000);
    };

    // Append the script to the body
    document.body.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      const existingScript = document.getElementById('lightwidget-script');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-accent-teal hover:text-teal-300 transition-colors text-lg font-medium px-2 py-1"
        >
          <ArrowLeft size={24} className="mr-2" />
          Back to Home
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4 text-center">Instagram</h1>
      
      {/* The iframe for the widget */}
      {isLoading ? (
        <div className="h-24 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-accent-teal border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="instagram-widget-container" style={{ position: 'relative', zIndex: 1 }}>
          <iframe
            src="https://cdn.lightwidget.com/widgets/9aaef2b88cea58b5b9b1c48e14fa2e39.html"
            scrolling="no"
            allowTransparency={true}
            className="lightwidget-widget"
            style={{ width: '100%', border: 0, overflow: 'hidden' }}
            title="Instagram Feed Widget"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default InstagramFeed; 