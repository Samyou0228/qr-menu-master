import { motion } from "framer-motion";
import { Flame, Star, Leaf } from "lucide-react";

interface MenuItemCardProps { item: any; index: number; }

const MenuItemCard = ({ item, index }: MenuItemCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="menu-card group"
    >
      <div className="flex gap-4">
        <div className="relative w-28 h-28 flex-shrink-0 overflow-hidden rounded-xl">
          <img
            src={item.image_url || item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {(item.isPopular ?? item.is_popular) && (
            <div className="absolute top-1 left-1 bg-warm-amber text-primary-foreground text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              Popular
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-display text-lg font-semibold text-foreground leading-tight">
                {item.name}
              </h3>
              <div className="flex items-center gap-1 flex-shrink-0">
                {(item.isVeg ?? item.is_veg) ? (
                  <div className="w-5 h-5 border-2 border-success rounded flex items-center justify-center">
                    <div className="w-2 h-2 bg-success rounded-full" />
                  </div>
                ) : (
                  <div className="w-5 h-5 border-2 border-destructive rounded flex items-center justify-center">
                    <div className="w-2 h-2 bg-destructive rounded-full" />
                  </div>
                )}
              </div>
            </div>

            <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
              {item.description}
            </p>

            {item.isSpicy && (
              <div className="inline-flex items-center gap-1 text-xs text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                <Flame className="w-3 h-3" />
                Spicy
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="price-tag">₹{item.price ?? item.amount}</span>
            <button className="gradient-warm text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
              Add
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItemCard;
