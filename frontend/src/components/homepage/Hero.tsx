import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Hero = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  // Hero image should NOT be lazy loaded since it's above the fold
  // Instead, we use eager loading with high priority
  useEffect(() => {
    // Pre-load the hero image
    const img = new Image();
    img.src = "Apples.jpg";
    img.onload = () => setImageLoaded(true);
    
    // Try to give high priority (not supported in all browsers)
    if ('fetchPriority' in HTMLImageElement.prototype) {
      (img as any).fetchPriority = 'high';
    }
  }, []);

  return (
    <section className="relative w-full h-screen max-h-[600px] overflow-hidden">
      {/* Placeholder while image is loading */}
      <div 
        className={`absolute inset-0 bg-gray-200 ${imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        aria-hidden="true"
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-pulse bg-gray-300 w-16 h-16 rounded-full"></div>
        </div>
      </div>

      {/* Main Hero Image - No lazy loading for this above-the-fold image */}
      <img
        src="Apples.jpg"
        alt="Cinnamon Apple Loaded Tart"
        className={`w-full h-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
        loading="eager" // Explicitly tell browser to load immediately
        fetchPriority="high" // Signal browser this is high priority
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20"></div>

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col justify-end px-12 pb-16">
        <div className="container mx-auto">
          {/* Small Meta Text */}
          <motion.div
            className="text-white/90 text-sm mb-2 tracking-wide uppercase"
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            Signature This Month
          </motion.div>

          {/* Hero Title */}
          <motion.h1
            className="text-white text-4xl md:text-6xl font-semibold mb-6 max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Cinnamon Apple Tart
          </motion.h1>

          {/* Optional Subtitle or CTA Button can be added here */}
        </div>
      </div>
    </section>
  );
};

export default Hero;