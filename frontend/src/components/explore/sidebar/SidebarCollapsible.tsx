import { Button } from "@/components/ui/button";
import { Filter, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SidebarCollapsibleProps } from "@/components/explore/sidebar/types";
import Tooltip from "@/components/explore/sidebar/Tooltip";

export function SidebarCollapsible({
  isOpen,
  setIsOpen,
  isMobile,
  sidebarHeight,
  selectedCategory,
  activeFiltersCount,
  searchQuery,
  children,
}: SidebarCollapsibleProps) {
  // Total active filters count
  const totalActiveCount = 
    (selectedCategory !== "all" ? 1 : 0) + 
    (searchQuery ? 1 : 0) + 
    activeFiltersCount;
  
  return (
    <>
      {/* Mobile toggle button when sidebar is closed - แสดงเฉพาะเมื่อเป็นมือถือและ sidebar ปิดอยู่ */}
      {isMobile && !isOpen && (
        <Button 
          variant="outline" 
          size="sm" 
          className="fixed left-4 top-20 z-50 rounded-full shadow-md p-3 transition-all duration-300 hover:bg-primary hover:text-white"
          onClick={() => setIsOpen(true)}
        >
          <Filter className="h-4 w-4" />
          {totalActiveCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalActiveCount}
            </span>
          )}
        </Button>
      )}
      
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className={`bg-background ${isMobile ? 'fixed left-0 top-0 bottom-0 z-40' : 'border-r sticky top-[var(--navbar-height,0px)] z-10'}`}
        style={{ 
          height: isMobile ? '100%' : 'auto',
          minHeight: isMobile ? '100%' : 'calc(100vh - var(--navbar-height, 0px))',
          width: isMobile && isOpen ? '100%' : 'auto',
          transform: isMobile ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          display: isMobile ? 'block' : 'block', // แสดงตลอดแต่ใช้ transform เลื่อนแทน
          boxShadow: isMobile && isOpen ? '0 4px 24px rgba(0, 0, 0, 0.2)' : 'none' // เพิ่มเงาเมื่อเปิด sidebar บนมือถือ
        }}
      >
        <div
          className={`transition-all duration-300 ${
            isOpen ? (isMobile ? "w-full" : "w-ๅ/") : (isMobile ? "w-full" : "w-12")
          } flex flex-col h-full bg-white shadow-sm`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className={`font-semibold ${!isOpen && "sr-only"}`}>Recipe Explorer</h2>
            {/* ถ้าเป็นมือถือ ซ่อนปุ่มเลื่อน sidebar ทางด้านข้าง แสดงเฉพาะปุ่มปิด */}
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full w-8 h-8 p-0"
              >
                {isOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  !isMobile && <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>

          {/* Collapsed sidebar view with category icons */}
          {!isOpen && (
            <div className="flex flex-col items-center py-4 space-y-4">
              {/* For the mini sidebar when collapsed */}
              {/* This will be implemented by the main sidebar component */}
            </div>
          )}

          <CollapsibleContent className="flex-grow overflow-hidden flex flex-col">
            {children}
          </CollapsibleContent>
        </div>
      </Collapsible>
    </>
  );
}

export default SidebarCollapsible;