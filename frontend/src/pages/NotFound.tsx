import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] bg-gradient-to-b from-background/90 via-background/70 to-background/90" />
      </div>

      <div className="relative z-10 text-center p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-elevated border border-white/40 max-w-sm mx-4">
        <h1 className="mb-2 text-6xl font-display font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-warm-amber drop-shadow-sm">404</h1>
        <p className="mb-6 text-xl font-medium text-foreground">Oops! Page not found</p>
        <a 
          href="/" 
          className="inline-block px-6 py-2 rounded-full gradient-warm text-white font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
