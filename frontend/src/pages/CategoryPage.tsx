/* eslint-disable @typescript-eslint/no-explicit-any */
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
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Loading category...</p>
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen relative bg-background pb-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-background/95 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10">
        <Header title={category.name} showBack backTo="/menu" />

        {/* Hero Banner */}
        <div className="relative h-64 overflow-hidden shadow-lg">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            src={category.imageUrl || category.image_url || category.image}
            alt={category.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 pt-20 bg-gradient-to-t from-background/90 to-transparent">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="font-display text-4xl font-bold text-foreground drop-shadow-sm mb-2">
                {category.name}
              </h1>
              <p className="text-muted-foreground text-base max-w-md line-clamp-2">
                {category.description}
              </p>
            </motion.div>
          </div>
        </div>

        <main className="container max-w-lg mx-auto px-4 py-8">
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {category.subCategories.length > 0 
              ? `${category.subCategories.length} Categories`
              : `${category.items?.length || 0} Items Available`}
          </p>
          <div className="h-px bg-border flex-1 ml-4" />
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {/* Flatten items from subcategories and direct items */}
          {(() => {
            const allItems = [
              ...(category.items || []),
              ...(category.subCategories || []).flatMap((sub: any) => sub.items || [])
            ];
            
            return allItems.length > 0 ? (
              <div className="pt-2 space-y-4">
                {allItems.map((item: any, index: number) => (
                  <MenuItemCard 
                    key={item._id || item.id} 
                    item={item} 
                    index={index} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No items available in this category.
              </div>
            );
          })()}
        </motion.div>
      </main>
      </div>
    </div>
  );
};

export default CategoryPage;
