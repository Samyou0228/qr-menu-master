import { ArrowLeft, Search, ShoppingBag } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { restaurantInfo } from "@/data/menuData";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  backTo?: string;
}

const Header = ({ title, showBack = false, backTo }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/menu" || location.pathname === "/";

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
    >
      <div className="container max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBack && (
              <button
                onClick={handleBack}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              {isHome ? (
                <>
                  <h1 className="font-display text-xl font-semibold text-gradient">
                    {restaurantInfo.name}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {restaurantInfo.tagline}
                  </p>
                </>
              ) : (
                <h1 className="font-display text-lg font-semibold">
                  {title}
                </h1>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="relative w-10 h-10 flex items-center justify-center rounded-full gradient-warm text-primary-foreground">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-charcoal text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                0
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
