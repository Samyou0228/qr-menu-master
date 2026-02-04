import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import MenuItemCard from "@/components/MenuItemCard";
import { menuData } from "@/data/menuData";

const SubCategoryPage = () => {
  const { categoryId, subCategoryId } = useParams();
  const category = menuData.find((c) => c.id === categoryId);
  const subCategory = category?.subCategories.find((s) => s.id === subCategoryId);

  if (!category || !subCategory) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Items not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title={subCategory.name} showBack />

      {/* Hero Banner */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={subCategory.image}
          alt={subCategory.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="category-badge mb-2">{category.name}</div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {subCategory.name}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {subCategory.description}
            </p>
          </motion.div>
        </div>
      </div>

      <main className="container max-w-lg mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between mb-4"
        >
          <span className="text-sm text-muted-foreground">
            {subCategory.items.length} items
          </span>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 border border-success rounded-sm flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-success rounded-full" />
              </span>
              Veg
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 border border-destructive rounded-sm flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-destructive rounded-full" />
              </span>
              Non-Veg
            </span>
          </div>
        </motion.div>

        <div className="space-y-4">
          {subCategory.items.map((item, index) => (
            <MenuItemCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default SubCategoryPage;
