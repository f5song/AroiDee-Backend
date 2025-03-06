import { Clock, Flame, ArrowUpDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CookingTimeSliderProps, 
  CalorieRangeSliderProps,
  DifficultySelectProps 
} from "@/components/explore/sidebar/types";

export function CookingTimeSlider({ cookingTime, setCookingTime }: CookingTimeSliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Cooking Time: {cookingTime} min or less
        </h3>
      </div>
      <Slider
        value={[cookingTime]}
        min={5}
        max={120}
        step={5}
        onValueChange={(value) => setCookingTime(value[0])}
        className="py-4"
      />
    </div>
  );
}

export function CalorieRangeSlider({ calorieRange, setCalorieRange }: CalorieRangeSliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium flex items-center">
          <Flame className="h-4 w-4 mr-2" />
          Calories: {calorieRange} kcal or less
        </h3>
      </div>
      <Slider
        value={[calorieRange]}
        min={100}
        max={1000}
        step={50}
        onValueChange={(value) => setCalorieRange(value[0])}
        className="py-4"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>100 kcal</span>
        <span>500 kcal</span>
        <span>1000 kcal</span>
      </div>
    </div>
  );
}

export function DifficultySelect({ difficulty, setDifficulty }: DifficultySelectProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium flex items-center">
        <ArrowUpDown className="h-4 w-4 mr-2" />
        Difficulty Level
      </h3>
      <Select value={difficulty} onValueChange={setDifficulty}>
        <SelectTrigger>
          <SelectValue placeholder="Select difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Levels</SelectItem>
          <SelectItem value="easy">Easy</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="hard">Hard</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}