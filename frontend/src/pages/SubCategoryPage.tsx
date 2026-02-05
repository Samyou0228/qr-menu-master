import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import Header from "@/components/Header";
import MenuItemCard from "@/components/MenuItemCard";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const SubCategoryPage = () => {
  const { categoryId, subCategoryId } = useParams();
  const { data: category } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => api.getCategory(String(categoryId)),
    enabled: !!categoryId,
  });
  
  const subCategory = category?.subCategories?.find((s: any) => s._id === subCategoryId);

  if (!category || !subCategory) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Items not found</p>
      </div>
    );
  }

  const [filter, setFilter] = useState<"veg" | "nonveg" | "all">("all");
  const filteredItems = (subCategory.items ?? []).filter((item: any) => {
    if (filter === "all") return true;
    const isVeg = item.isVeg ?? true;
    return filter === "veg" ? isVeg : !isVeg;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header title={subCategory.name} showBack backTo={`/menu/${categoryId}`} />

      {/* Hero Banner */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={subCategory.imageUrl || subCategory.image_url || subCategory.image}
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
            {filteredItems.length} items
          </span>
          <div className="flex items-center gap-3 text-xs">
            <button
              className={`px-2 py-0.5 rounded-full ${filter === "veg" ? "bg-success text-success-foreground" : "bg-muted"}`}
              onClick={() => setFilter("veg")}
            >
              Veg
            </button>
            <button
              className={`px-2 py-0.5 rounded-full ${filter === "nonveg" ? "bg-destructive text-destructive-foreground" : "bg-muted"}`}
              onClick={() => setFilter("nonveg")}
            >
              Non-Veg
            </button>
            <button
              className={`px-2 py-0.5 rounded-full ${filter === "all" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
          </div>
        </motion.div>

        <div className="space-y-4">
          {filteredItems.map((item: any, index: number) => (
            <MenuItemCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default SubCategoryPage;
