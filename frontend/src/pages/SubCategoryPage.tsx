/* eslint-disable @typescript-eslint/no-explicit-any */
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

  const [filter, setFilter] = useState<"veg" | "nonveg" | "all">("all");
  
  const subCategory = category?.subCategories?.find((s: any) => s._id === subCategoryId);

  if (!category || !subCategory) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Items not found</p>
      </div>
    );
  }

  const filteredItems = (subCategory.items ?? []).filter((item: any) => {
    if (filter === "all") return true;
    const isVeg = item.isVeg ?? true;
    return filter === "veg" ? isVeg : !isVeg;
  });

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
        <Header title={subCategory.name} showBack backTo={`/menu/${categoryId}`} />

        {/* Hero Banner */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={subCategory.imageUrl || subCategory.image_url || subCategory.image}
            alt={subCategory.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-wider text-white uppercase bg-primary/80 backdrop-blur-md rounded-full border border-white/20 shadow-sm">{category.name}</div>
              <h1 className="font-display text-3xl font-bold text-foreground drop-shadow-sm">
                {subCategory.name}
              </h1>
              <p className="text-muted-foreground text-base mt-2 max-w-lg leading-relaxed">
                {subCategory.description}
              </p>
            </motion.div>
          </div>
        </div>

        <main className="container max-w-lg mx-auto px-4 py-8">
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8"
        >
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {filteredItems.length} items available
          </span>
          <div className="flex p-1 bg-muted/50 backdrop-blur-sm rounded-full border border-white/10">
             <button
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${filter === "all" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-primary"}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${filter === "veg" ? "bg-green-600 text-white shadow-sm" : "text-muted-foreground hover:text-green-600"}`}
              onClick={() => setFilter("veg")}
            >
              Veg
            </button>
            <button
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${filter === "nonveg" ? "bg-red-600 text-white shadow-sm" : "text-muted-foreground hover:text-red-600"}`}
              onClick={() => setFilter("nonveg")}
            >
              Non-Veg
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
    </div>
  );
};

export default SubCategoryPage;
