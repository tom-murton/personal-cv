import React, { memo, useMemo } from "react";
import { Link } from "react-router-dom";

// Memoized Footer component to prevent unnecessary re-renders
// This is especially useful since footer content rarely changes
const Footer = memo(() => {
  // Memoize the current year to prevent recalculation on each render
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="mt-20 py-10 px-6">
      <div className="max-w-6xl mx-auto md:pl-36"> {/* Added pl-36 to align with main content */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
            <Link
              to="/"
              className="text-accent-teal font-display text-xl font-medium tracking-tight mb-2"
            >
              tm
            </Link>
            <p className="text-muted-foreground text-sm">
              Engineering Leader & Photographer
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <p className="text-muted-foreground text-sm">
              &copy; {currentYear} Tom Murton. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});

// Add display name for better debugging
Footer.displayName = 'Footer';

export default Footer;
