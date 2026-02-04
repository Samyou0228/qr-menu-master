import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Category } from "@/data/menuData";

interface CategoryCardProps {
  category: Category;
  index: number;
}

const CategoryCard = ({ category, index }: CategoryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/menu/${category.id}`}>
        <div className="menu-card group relative overflow-hidden cursor-pointer">
          <div className="aspect-[4/3] overflow-hidden rounded-xl mb-4">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent rounded-xl" />
          </div>
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{category.icon}</span>
              <h3 className="font-display text-xl font-semibold text-foreground">
                {category.name}
              </h3>
            </div>
            
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {category.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {category.subCategories.length} items
              </span>
              <div className="flex items-center gap-1 text-primary font-medium text-sm group-hover:gap-2 transition-all">
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
