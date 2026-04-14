import { motion } from "framer-motion";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import { restaurantInfo } from "@/data/menuData";
import { Link } from "react-router-dom";
import { UtensilsCrossed, MapPin, Phone } from "lucide-react";

const Index = () => {
  // This would be your actual deployed menu URL
  // We dynamically use the local network IP for mobile testing so the QR code always works
  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  //@ts-ignore
  const localIp = typeof process !== 'undefined' && process.env.LOCAL_IP ? process.env.LOCAL_IP : null;
  
  const baseUrl = isLocalhost && localIp && localIp !== "localhost"
    ? `http://${localIp}:${window.location.port || '5173'}`
    : window.location.origin;
    
  const menuUrl = baseUrl + "/menu";

  return (
    <div className="min-h-screen relative flex flex-col justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-background/90 backdrop-blur-[2px] bg-gradient-to-b from-background/95 via-background/80 to-background/95" />
      </div>

      {/* Hero Section */}
      <div className="container relative z-10 max-w-lg mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="inline-flex items-center justify-center w-28 h-28 gradient-warm rounded-3xl mb-8 shadow-elevated transform transition-transform"
          >
            <UtensilsCrossed className="w-14 h-14 text-primary-foreground drop-shadow-md" />
          </motion.div>
          
          <h1 className="font-display text-5xl font-bold mb-4 tracking-tight drop-shadow-sm">
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-warm-amber">
              {restaurantInfo.name}
            </span>
          </h1>
          
          <p className="text-muted-foreground text-xl font-medium mb-6 font-display italic">
            {restaurantInfo.tagline}
          </p>
          
          <p className="text-muted-foreground text-base max-w-xs mx-auto mb-8 leading-relaxed">
            {restaurantInfo.description}
          </p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-3 text-sm text-muted-foreground mb-8 bg-white/60 p-6 rounded-2xl border border-white/40 backdrop-blur-md shadow-sm"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{restaurantInfo.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <span>{restaurantInfo.phone}</span>
            </div>
          </motion.div>
        </motion.div>

        {/* QR Code Section */}
        <div className="mb-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center mb-8"
          >
            <div className="h-px bg-border/50 w-16 md:w-24" />
            <span className="mx-4 px-6 py-2 rounded-full bg-white/90 backdrop-blur-md border border-white/40 text-primary font-display font-bold text-lg shadow-elevated">
              Scan to View Menu
            </span>
            <div className="h-px bg-border/50 w-16 md:w-24" />
          </motion.div>
          
          <motion.div
             whileHover={{ scale: 1.02 }}
             className="bg-white/80 p-4 rounded-3xl shadow-elevated backdrop-blur-sm inline-block"
          >
            <QRCodeDisplay menuUrl={menuUrl} />
          </motion.div>
        </div>

        {/* Admin Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="mt-8">
            <Link 
              to="/admin/login"
              className="text-xs text-muted-foreground/60 hover:text-primary transition-colors underline decoration-dotted underline-offset-4"
            >
              Admin Portal
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
