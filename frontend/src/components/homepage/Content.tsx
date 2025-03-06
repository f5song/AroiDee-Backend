import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import RecipeCard, { Recipe } from "@/components/homepage/RecipeCard";

interface ContentProps {
    topic?: string;
    recipes: Recipe[];
    toggleFavorite: (id: string) => void;
}

const Content: React.FC<ContentProps> = ({ topic, recipes, toggleFavorite }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Check scroll position to update navigation buttons state
    const checkScrollPosition = useCallback(() => {
        if (!scrollRef.current) return;
        
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        // Can scroll left if not at the beginning
        setCanScrollLeft(scrollLeft > 0);
        // Can scroll right if not at the end
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10); // 10px buffer
    }, []);

    // Add scroll event listener to update button states
    useEffect(() => {
        const scrollEl = scrollRef.current;
        if (scrollEl) {
            scrollEl.addEventListener("scroll", checkScrollPosition);
            // Check initial scroll position
            checkScrollPosition();
            
            return () => scrollEl.removeEventListener("scroll", checkScrollPosition);
        }
    }, [checkScrollPosition]);

    // Re-check when recipes change
    useEffect(() => {
        checkScrollPosition();
    }, [recipes, checkScrollPosition]);

    const handlePrev = useCallback(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -350, behavior: "smooth" });
        }
    }, []);

    const handleNext = useCallback(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 350, behavior: "smooth" });
        }
    }, []);

    return (
        <section className="container mx-auto py-6 px-4 relative">
            {/* Topic Title */}
            {topic && (
                <motion.h3 
                    className="text-3xl font-bold mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {topic}
                </motion.h3>
            )}

            {/* Recipe Carousel Container */}
            <div className="relative" aria-label={`${topic || "Recipe"} carousel`}>
                {/* Scrollable Recipe List */}
                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar"
                    role="list"
                    aria-label={`${topic || "Recipe"} list`}
                >
                    {recipes.map((recipe, index) => (
                        <motion.div 
                            key={recipe.id || index} 
                            className="snap-center flex-shrink-0 w-[320px]"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ 
                                duration: 0.4, 
                                delay: index * 0.05 > 0.2 ? 0.2 : index * 0.05 // Cap delay at 0.2s
                            }}
                            role="listitem"
                        >
                            <RecipeCard 
                                recipe={recipe} 
                                onToggleFavorite={toggleFavorite} 
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Arrow Navigation - only show when scrollable */}
                {recipes.length > 3 && (
                    <>
                        <button
                            onClick={handlePrev}
                            className={`absolute left-0 top-1/2 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md transition ${
                                canScrollLeft 
                                    ? 'hover:bg-gray-300 opacity-100' 
                                    : 'opacity-40 cursor-not-allowed'
                            }`}
                            disabled={!canScrollLeft}
                            aria-label="Scroll left"
                        >
                            <ArrowLeft className="h-6 w-6" aria-hidden="true" />
                        </button>
                        <button
                            onClick={handleNext}
                            className={`absolute right-0 top-1/2 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md transition ${
                                canScrollRight 
                                    ? 'hover:bg-gray-300 opacity-100' 
                                    : 'opacity-40 cursor-not-allowed'
                            }`}
                            disabled={!canScrollRight}
                            aria-label="Scroll right"
                        >
                            <ArrowRight className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </>
                )}
            </div>
        </section>
    );
};

export default Content;