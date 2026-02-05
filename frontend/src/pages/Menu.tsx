import { motion } from "framer-motion";
import { useState } from "react";
import Header from "@/components/Header";
import CategoryCard from "@/components/CategoryCard";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const Menu = () => {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: api.listCategories,
  });
  const [filter, setFilter] = useState<"veg" | "nonveg" | "all">("all");

  const filteredCategories = categories.filter((c: any) => {
    if (filter === "all") return true;
    const isVeg = c.isVeg ?? true;
    return filter === "veg" ? isVeg : !isVeg;
  });
  return (
    <div className="min-h-screen bg-background">
      <Header title="Menu" showBack backTo="/" />
      
      <main className="container max-w-lg mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <h2 className="font-display text-2xl font-semibold mb-2">
            What are you craving?
          </h2>
          <p className="text-muted-foreground">
            Explore our delicious menu categories
          </p>
        </motion.div>

        <div className="flex items-center gap-3 mb-4">
          <button
            className={`px-3 py-1 rounded-full text-sm ${filter === "veg" ? "bg-success text-success-foreground" : "bg-muted"}`}
            onClick={() => setFilter("veg")}
          >
            Veg
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm ${filter === "nonveg" ? "bg-destructive text-destructive-foreground" : "bg-muted"}`}
            onClick={() => setFilter("nonveg")}
          >
            Non-Veg
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm ${filter === "all" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredCategories.map((category: any, index: number) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Menu;
