/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { Flame, Star, Leaf } from "lucide-react";

interface MenuItemCardProps { item: any; index: number; }

const MenuItemCard = ({ item, index }: MenuItemCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="menu-card group bg-white/90 backdrop-blur-md rounded-xl shadow-sm hover:shadow-elevated transition-all duration-300 border border-white/40 p-3"
    >
      <div className="flex gap-4">
        <div className="relative w-28 h-28 flex-shrink-0 overflow-hidden rounded-lg shadow-inner">
          <img
            src={item.imageUrl || item.image_url || item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
          
          {(item.isPopular ?? item.is_popular) && (
            <div className="absolute top-1 left-1 bg-warm-amber text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md ring-1 ring-white/20">
              <Star className="w-2.5 h-2.5 fill-current" />
              POPULAR
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between py-0.5">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-display text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                {item.name}
              </h3>
              <div className="flex items-center gap-1 flex-shrink-0">
                {(item.isVeg ?? item.is_veg) ? (
                  <div className="w-5 h-5 border-2 border-green-600 rounded flex items-center justify-center bg-white/50">
                    <div className="w-2.5 h-2.5 bg-green-600 rounded-full" />
                  </div>
                ) : (
                  <div className="w-5 h-5 border-2 border-red-600 rounded flex items-center justify-center bg-white/50">
                    <div className="w-2.5 h-2.5 bg-red-600 rounded-full" />
                  </div>
                )}
              </div>
            </div>

            <p className="text-muted-foreground text-xs line-clamp-2 mb-2 leading-relaxed font-medium">
              {item.description}
            </p>

            {item.isSpicy && (
              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full border border-destructive/20">
                <Flame className="w-3 h-3" />
                Spicy
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-black text-primary drop-shadow-sm">₹{item.price ?? item.amount}</span>
            <button className="relative overflow-hidden group/btn bg-gradient-to-r from-primary to-warm-amber text-primary-foreground px-4 py-1.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 transform hover:-translate-y-0.5">
              <span className="relative z-10 flex items-center gap-1">
                Add <span className="text-lg leading-none">+</span>
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItemCard;
