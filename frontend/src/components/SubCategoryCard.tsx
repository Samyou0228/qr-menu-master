/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface SubCategoryCardProps {
  subCategory: any;
  categoryId: string;
  index: number;
}

const SubCategoryCard = ({ subCategory, categoryId, index }: SubCategoryCardProps) => {
  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      variants={item}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Link to={`/menu/${categoryId}/${subCategory.id}`}>
        <div className="menu-card group relative overflow-hidden cursor-pointer bg-white/90 backdrop-blur-md rounded-xl shadow-sm hover:shadow-elevated transition-all duration-300 border border-white/40 p-3">
          <div className="flex gap-4">
            <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg relative shadow-inner">
              <img
                src={subCategory.imageUrl || subCategory.image_url || subCategory.image}
                alt={subCategory.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {subCategory.name}
                </h3>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {(subCategory.isVeg ?? true) ? (
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
              
              <p className="text-muted-foreground text-sm mb-2 line-clamp-2 leading-snug">
                {subCategory.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                  {(subCategory.itemCount ?? subCategory.items?.length ?? 0)} varieties
                </span>
                <div className="flex items-center gap-1 text-primary font-bold text-sm group-hover:translate-x-1 transition-transform">
                  View
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default SubCategoryCard;
