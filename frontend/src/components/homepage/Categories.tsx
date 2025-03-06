import React, { useEffect } from "react";
import { motion } from "framer-motion";
import AdvancedLazyImage from "@/components/homepage/AdvancedLazyImage";

// Updated categories with food images
const categories = [
  { 
    name: "Pasta", 
    image: "/api/placeholder/120/120",
    alt: "Pasta dish with noodles"
  },
  { 
    name: "Pizza", 
    image: "/api/placeholder/120/120",
    alt: "Pizza with vegetables"
  },
  { 
    name: "Vegan", 
    image: "/api/placeholder/120/120",
    alt: "Vegan salad bowl"
  },
  { 
    name: "Desserts", 
    image: "/api/placeholder/120/120",
    alt: "Sweet desserts"
  },
  { 
    name: "Smoothies", 
    image: "/api/placeholder/120/120",
    alt: "Fruit smoothie"
  },
  { 
    name: "Breakfast", 
    image: "/api/placeholder/120/120",
    alt: "Breakfast bowl"
  },
];

// Motion variants
const categoryVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { 
      delay: i * 0.1,
      duration: 0.4, 
      ease: "easeOut" 
    } 
  }),
  hover: { 
    y: -5,
    transition: { duration: 0.2 } 
  },
};

// Preload the category images since they're a part of the initial view
// but still use advanced lazy loading as a fallback
const preloadCategoryImages = () => {
  // Only preload the first visible categories (depending on screen size)
  const visibleCount = window.innerWidth < 768 ? 3 : 6;
  
  categories.slice(0, visibleCount).forEach(category => {
    const img = new Image();
    img.src = category.image;
  });
};

const Categories = () => {
  useEffect(() => {
    // Preload category images after other critical resources
    const timer = setTimeout(() => {
      preloadCategoryImages();
    }, 1000); // 1 second delay to let critical resources load first
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="container mx-auto py-8 px-4">
      {/* Section Title */}
      <motion.h3
        className="text-3xl font-bold text-gray-800 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Popular Categories
      </motion.h3>

      {/* Category Grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 justify-items-center">
        {categories.map((category, i) => (
          <motion.div
            key={category.name}
            className="flex flex-col items-center cursor-pointer"
            variants={categoryVariants}
            custom={i}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            {/* Circular Image with Advanced Lazy Loading */}
            <div className="w-24 h-24 rounded-full overflow-hidden mb-2 shadow-md bg-gray-100">
              <AdvancedLazyImage 
                src={category.image} 
                alt={category.alt} 
                className="w-full h-full"
                objectFit="cover"
                // Use smaller rootMargin for categories that might be visible right away
                rootMargin="50px 0px"
                // Higher threshold to load when more visible
                threshold={0.2}
              />
            </div>
            
            {/* Category Name */}
            <span className="text-sm font-medium text-center">{category.name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Categories;