import { useState, useEffect, useMemo } from "react";
import { ExploreSidebar } from "@/components/explore/sidebar";
import PageHeader from "@/components/explore/PageHeader";
import RecipeGrid from "@/components/explore/RecipeGrid";
import { NoResultsMessage } from "@/components/explore/FeedbackComponents";
import PaginationControls from "@/components/explore/PaginationControls";
import {
  FilterOptions,
  Recipe,
  RecipeSource,
  fetchRecipesBySource,
  toggleFavoriteRecipe,
} from "@/lib/recipes";

/**
 * Main component for the Explore page
 */
export default function ExplorePage() {
  // State
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true); // เพิ่มสำหรับติดตามสถานะ sidebar
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    category: "all",
    search: "",
    sort: "rating",
    page: 1,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  // Load favorites when component mounts
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem("favoriteRecipes");
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error("Error reading favorites from localStorage:", error);
    }
  }, []);

  // Load recipes when filter options change
  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      try {
        const result = await fetchRecipesBySource(
          RecipeSource.ALL,
          filterOptions
        );
        setRecipes(result.recipes);
        setPagination(result.pagination);
      } catch (error) {
        console.error("Error loading recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [filterOptions]);

  // Set navbar height CSS variable
  useEffect(() => {
    const navbar = document.querySelector("navbar");
    if (navbar && navbar instanceof HTMLElement) {
      document.documentElement.style.setProperty(
        "--navbar-height",
        `${navbar.offsetHeight}px`
      );
    }
  }, []);

  // Event handlers
  const handleCategoryChange = (category: string) => {
    setFilterOptions((prev) => ({ ...prev, category, page: 1 }));
  };

  const handleSearch = (search: string) => {
    setFilterOptions((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleSortChange = (sort: string) => {
    setFilterOptions((prev) => ({ ...prev, sort }));
  };

  const handlePageChange = (page: number) => {
    setFilterOptions((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFavorite = async (id: number) => {
    try {
      // Use updated API
      const result = await toggleFavoriteRecipe(id);

      if (result.success) {
        setFavorites((prev) =>
          prev.includes(id)
            ? prev.filter((recipeId) => recipeId !== id)
            : [...prev, id]
        );
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleResetFilters = () => {
    setFilterOptions({
      category: "all",
      search: "",
      sort: "rating",
      page: 1,
    });
  };

  // ฟังก์ชันสำหรับรับสถานะ sidebar
  const handleSidebarToggle = (isOpen: boolean) => {
    setSidebarOpen(isOpen);
  };

  // ตรวจสอบว่าอยู่ในโหมด mobile หรือไม่
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  // Compute whether there are no results
  const noResults = useMemo(
    () => !loading && recipes.length === 0,
    [loading, recipes]
  );

  // กำหนด class สำหรับ main content area ตามสถานะของ sidebar
  const mainContentClass = isMobile
    ? "flex-1 p-4 md:p-6" // ในโหมดมือถือไม่มี margin ด้านซ้าย
    : `flex-1 p-4 md:p-6 ${sidebarOpen ? 'ml-64' : 'ml-12'}`; // ปรับให้สอดคล้องกับความกว้างของ sidebar ที่ 64

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1">
        {/* แสดง Sidebar เฉพาะเมื่อไม่ได้อยู่ในโหมดมือถือ หรือ ถ้าเป็นมือถือก็ต่อเมื่อกดเปิด sidebar */}
        <ExploreSidebar
          onCategoryChange={handleCategoryChange}
          onSearch={handleSearch}
          onSidebarToggle={handleSidebarToggle} // ส่ง callback ไปรับสถานะ sidebar
        />
        <main className={mainContentClass}>
          <div className="max-w-7xl mx-auto">
            {/* Header with sorting options */}
            <PageHeader
              totalItems={pagination.totalItems}
              sort={filterOptions.sort || "rating"} // Provide a default value
              onSortChange={handleSortChange}
            />

            {/* Recipe Grid - ปรับให้มี padding-left น้อยลงเพื่อให้ content อยู่ใกล้ sidebar มากขึ้น */}
            <div className="pl-0">
              <RecipeGrid
                recipes={recipes}
                loading={loading}
                favorites={favorites}
                onFavoriteToggle={handleFavorite}
              />
            </div>

            {/* No Results Message */}
            {noResults && <NoResultsMessage onReset={handleResetFilters} />}

            {/* Pagination */}
            {!loading && recipes.length > 0 && (
              <PaginationControls
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}