import { motion } from "framer-motion";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import { restaurantInfo } from "@/data/menuData";
import { Link } from "react-router-dom";
import { UtensilsCrossed, MapPin, Phone } from "lucide-react";

const Index = () => {
  // This would be your actual deployed menu URL
  const menuUrl = window.location.origin + "/menu";

  return (
    <div className="min-h-screen gradient-hero">
      {/* Hero Section */}
      <div className="container max-w-lg mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 gradient-warm rounded-2xl mb-6 shadow-elevated">
            <UtensilsCrossed className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h1 className="font-display text-4xl font-bold mb-3">
            <span className="text-gradient">{restaurantInfo.name}</span>
          </h1>
          
          <p className="text-muted-foreground text-lg mb-6">
            {restaurantInfo.tagline}
          </p>
          
          <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-8">
            {restaurantInfo.description}
          </p>

          <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              {restaurantInfo.address}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              {restaurantInfo.phone}
            </div>
          </div>
        </motion.div>

        {/* QR Code Section */}
        <div className="mb-10">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-display text-xl font-semibold text-center mb-6"
          >
            Scan to View Menu
          </motion.h2>
          
          <QRCodeDisplay menuUrl={menuUrl} />
        </div>

        {/* Direct Link Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-8 py-4 gradient-warm text-primary-foreground rounded-2xl text-lg font-semibold shadow-elevated hover:opacity-90 transition-opacity"
          >
            <UtensilsCrossed className="w-5 h-5" />
            Browse Menu
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
