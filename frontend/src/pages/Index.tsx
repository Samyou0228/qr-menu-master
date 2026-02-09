import { motion } from "framer-motion";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import { restaurantInfo } from "@/data/menuData";
import { Link } from "react-router-dom";
import { UtensilsCrossed, MapPin, Phone } from "lucide-react";

const Index = () => {
  // This would be your actual deployed menu URL
  // NOTE: For local development testing on mobile, use your computer's local IP address
  // instead of window.location.origin (which would be 'localhost' on the phone).
  const menuUrl = (import.meta.env.VITE_BASE_URL || window.location.origin) + "/menu";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex flex-col justify-center">
      {/* Hero Section */}
      <div className="container max-w-lg mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="inline-flex items-center justify-center w-24 h-24 gradient-warm rounded-3xl mb-8 shadow-elevated transform transition-transform"
          >
            <UtensilsCrossed className="w-12 h-12 text-primary-foreground" />
          </motion.div>
          
          <h1 className="font-display text-5xl font-bold mb-4 tracking-tight">
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-3 text-sm text-muted-foreground mb-8 bg-card/50 p-4 rounded-xl border border-border/50 backdrop-blur-sm"
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
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="font-display text-2xl font-semibold text-center mb-8 relative"
          >
            <span className="relative z-10 bg-background px-4">Scan to View Menu</span>
            <div className="absolute inset-0 flex items-center justify-center -z-10">
              <div className="w-full h-px bg-border"></div>
            </div>
          </motion.h2>
          
          <QRCodeDisplay menuUrl={menuUrl} />
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
