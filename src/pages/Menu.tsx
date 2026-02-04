import { motion } from "framer-motion";
import Header from "@/components/Header";
import CategoryCard from "@/components/CategoryCard";
import { menuData } from "@/data/menuData";

const Menu = () => {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {menuData.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Menu;
