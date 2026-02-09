/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { useState } from "react";
import Header from "@/components/Header";
import CategoryCard from "@/components/CategoryCard";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Filter } from "lucide-react";

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
        <Header title="Menu" showBack backTo="/" />
        
        <main className="container max-w-lg mx-auto px-4 py-6">
          <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h2 className="font-display text-3xl font-bold mb-2 text-foreground">
            What are you craving?
          </h2>
          <p className="text-muted-foreground text-lg">
            Explore our delicious menu categories
          </p>
        </motion.div>

        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex p-1 bg-muted rounded-full">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === "all" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === "veg" ? "bg-success text-white shadow-sm" : "text-muted-foreground hover:text-success"}`}
              onClick={() => setFilter("veg")}
            >
              Veg
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === "nonveg" ? "bg-destructive text-white shadow-sm" : "text-muted-foreground hover:text-destructive"}`}
              onClick={() => setFilter("nonveg")}
            >
              Non-Veg
            </button>
          </div>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {filteredCategories.map((category: any, index: number) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </motion.div>
      </main>
      </div>
    </div>
  );
};

export default Menu;
