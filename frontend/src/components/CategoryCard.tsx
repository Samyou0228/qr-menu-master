/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  category: any;
  index: number;
}

const CategoryCard = ({ category, index }: CategoryCardProps) => {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={item}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link to={`/menu/${category.id}`}>
        <div className="menu-card group relative overflow-hidden cursor-pointer bg-white/80 backdrop-blur-md rounded-2xl shadow-sm hover:shadow-elevated transition-all duration-300 border border-white/40">
          <div className="aspect-[4/3] overflow-hidden rounded-t-2xl relative">
            <img
              src={category.imageUrl || category.image_url || category.image}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-300" />
            
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
               <h3 className="font-display text-2xl font-bold text-white mb-1 drop-shadow-sm">
                {category.name}
              </h3>
              <p className="text-white/90 text-sm line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                {category.description}
              </p>
            </div>

            <div className="absolute top-3 right-3 z-10">
               {(category.isVeg ?? true) ? (
                  <div className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg ring-1 ring-black/5">
                    <div className="w-4 h-4 border-2 border-green-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full" />
                    </div>
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg ring-1 ring-black/5">
                    <div className="w-4 h-4 border-2 border-red-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-red-600 rounded-full" />
                    </div>
                  </div>
                )}
            </div>
          </div>
          
          <div className="p-4 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                {category.itemCount ?? 0} items
              </span>
              <div className="flex items-center gap-1 text-primary font-bold text-sm group-hover:translate-x-1 transition-transform">
                Explore
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
