import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface SubCategoryCardProps {
  subCategory: any;
  categoryId: string;
  index: number;
}

const SubCategoryCard = ({ subCategory, categoryId, index }: SubCategoryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/menu/${categoryId}/${subCategory.id}`}>
        <div className="menu-card group relative overflow-hidden cursor-pointer">
          <div className="flex gap-4">
            <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl">
              <img
                src={subCategory.image_url || subCategory.image}
                alt={subCategory.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                {subCategory.name}
              </h3>
              
              <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                {subCategory.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {(subCategory.itemCount ?? subCategory.items?.length ?? 0)} varieties
                </span>
                <div className="flex items-center gap-1 text-primary font-medium text-sm group-hover:gap-2 transition-all">
                  View All
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
