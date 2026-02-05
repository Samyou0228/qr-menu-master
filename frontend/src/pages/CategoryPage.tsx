import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import SubCategoryCard from "@/components/SubCategoryCard";
import MenuItemCard from "@/components/MenuItemCard";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const { data: category } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => api.getCategory(String(categoryId)),
    enabled: !!categoryId,
  });

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Category not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title={category.name} showBack backTo="/menu" />

      {/* Hero Banner */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={category.imageUrl || category.image_url || category.image}
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-3xl font-bold text-foreground">
              {category.name}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {category.description}
            </p>
          </motion.div>
        </div>
      </div>

      <main className="container max-w-lg mx-auto px-4 py-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground mb-4"
        >
          {category.subCategories.length} varieties available
        </motion.p>

        <div className="space-y-4">
          {category.subCategories.map((subCategory: any, index: number) => (
            <SubCategoryCard
              key={subCategory.id || subCategory._id}
              subCategory={subCategory}
              categoryId={category.id || category._id}
              index={index}
            />
          ))}

          {category.items && category.items.length > 0 && (
            <div className="pt-2 space-y-4">
              {category.items.map((item: any, index: number) => (
                <MenuItemCard 
                  key={item._id || item.id} 
                  item={item} 
                  index={index + category.subCategories.length} 
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;
