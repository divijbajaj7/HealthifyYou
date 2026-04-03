/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode, useRef } from 'react';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Utensils, 
  MessageSquare, 
  User, 
  Plus, 
  Search, 
  Bell, 
  LogOut, 
  ChevronRight,
  Send,
  Settings,
  Target,
  Activity,
  Droplets,
  Moon,
  Zap,
  Clock,
  Flame,
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Star,
  Calendar,
  History,
  TrendingUp,
  Filter,
  Info,
  ArrowRight,
  RefreshCw,
  Sun,
  Sunrise,
  Apple,
  Cookie,
  BarChart2,
  PieChart,
  Trophy,
  X,
  Heart,
  MoreVertical,
  Key,
  ExternalLink,
  Check,
  Scale,
  Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type Tab = 'dashboard' | 'workouts' | 'meals' | 'coach' | 'profile';

interface UserProfile {
  name: string;
  email: string;
  photo: string;
  dob: string;
  gender: string;
  weight: number;
  weightUnit: 'kg' | 'lbs';
  height: number;
  heightUnit: 'cm' | 'ft';
  bmi: number;
  bmiCategory: string;
  bodyType: string;
  goal: string;
  targetWeight: number;
  timeline: string;
  activityLevel: string;
  dietaryPrefs: string[];
  allergies: string[];
  bedtime: string;
  wakeTime: string;
  waterGoal: number;
  dailyCalories: number;
  recommendedWorkouts: number;
  createdAt: string;
}

interface Exercise {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'yoga' | 'hiit' | 'stretching';
  muscleGroup: 'Upper Body' | 'Lower Body' | 'Core' | 'Full Body' | 'Cardio' | 'Flexibility';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'reps' | 'timed';
  sets: number;
  reps?: number;
  durationSeconds?: number;
  caloriesPerMinute: number;
  instructions: string[];
  tips: string[];
  targetMuscles: string[];
}

interface WorkoutHistoryEntry {
  id: string;
  date: string;
  exercises: {
    name: string;
    sets: number;
    reps?: number;
    duration?: number;
    caloriesBurned: number;
  }[];
  totalDuration: number;
  totalCalories: number;
  rating: number;
  type: string;
}

interface WorkoutPlanDay {
  type: string;
  exercises: string[]; // Exercise IDs
  duration: number;
  calories: number;
}

interface WorkoutPlan {
  generatedDate: string;
  weekPlan: {
    monday: WorkoutPlanDay;
    tuesday: WorkoutPlanDay;
    wednesday: WorkoutPlanDay;
    thursday: WorkoutPlanDay;
    friday: WorkoutPlanDay;
    saturday: WorkoutPlanDay;
    sunday: WorkoutPlanDay;
  };
}

interface Food {
  id: string;
  name: string;
  category: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
}

interface WeightEntry {
  date: string;
  weight: number;
  unit: string;
  bmi: number;
  note?: string;
}

interface LoggedFood extends Food {
  qty: number;
  servingMultiplier: number;
  loggedAt: string;
}

interface DailyMealLog {
  breakfast: LoggedFood[];
  morningSnack: LoggedFood[];
  lunch: LoggedFood[];
  eveningSnack: LoggedFood[];
  dinner: LoggedFood[];
  water: number;
}

interface MealHistory {
  [date: string]: DailyMealLog;
}

// --- Constants ---

const FOOD_DATABASE: Food[] = [
  // INDIAN FOOD (20+ items)
  { id: 'dal-tadka', name: 'Dal Tadka', category: 'Indian', servingSize: 1, servingUnit: 'cup', calories: 180, protein: 8, carbs: 24, fats: 6, fiber: 5 },
  { id: 'roti', name: 'Roti/Chapati', category: 'Indian', servingSize: 1, servingUnit: 'piece', calories: 120, protein: 3, carbs: 22, fats: 2, fiber: 3 },
  { id: 'steamed-rice', name: 'Steamed Rice', category: 'Indian', servingSize: 1, servingUnit: 'cup', calories: 200, protein: 4, carbs: 45, fats: 0.5, fiber: 1 },
  { id: 'paneer-tikka', name: 'Paneer Tikka', category: 'Indian', servingSize: 100, servingUnit: 'g', calories: 260, protein: 18, carbs: 6, fats: 18, fiber: 1 },
  { id: 'chicken-curry', name: 'Chicken Curry', category: 'Indian', servingSize: 1, servingUnit: 'cup', calories: 240, protein: 22, carbs: 8, fats: 14, fiber: 2 },
  { id: 'dosa', name: 'Dosa', category: 'Indian', servingSize: 1, servingUnit: 'piece', calories: 170, protein: 4, carbs: 32, fats: 3, fiber: 2 },
  { id: 'idli', name: 'Idli', category: 'Indian', servingSize: 2, servingUnit: 'pieces', calories: 130, protein: 4, carbs: 28, fats: 0.5, fiber: 1 },
  { id: 'sambar', name: 'Sambar', category: 'Indian', servingSize: 1, servingUnit: 'cup', calories: 130, protein: 5, carbs: 22, fats: 2, fiber: 4 },
  { id: 'veg-biryani', name: 'Veg Biryani', category: 'Indian', servingSize: 1, servingUnit: 'cup', calories: 250, protein: 6, carbs: 48, fats: 4, fiber: 3 },
  { id: 'chicken-biryani', name: 'Chicken Biryani', category: 'Indian', servingSize: 1, servingUnit: 'cup', calories: 320, protein: 24, carbs: 42, fats: 6, fiber: 2 },
  { id: 'aloo-paratha', name: 'Aloo Paratha', category: 'Indian', servingSize: 1, servingUnit: 'piece', calories: 300, protein: 6, carbs: 45, fats: 12, fiber: 4 },
  { id: 'chole', name: 'Chole/Chana Masala', category: 'Indian', servingSize: 1, servingUnit: 'cup', calories: 210, protein: 9, carbs: 32, fats: 5, fiber: 8 },
  { id: 'rajma', name: 'Rajma', category: 'Indian', servingSize: 1, servingUnit: 'cup', calories: 200, protein: 10, carbs: 34, fats: 3, fiber: 9 },
  { id: 'aloo-gobi', name: 'Aloo Gobi', category: 'Indian', servingSize: 1, servingUnit: 'cup', calories: 160, protein: 4, carbs: 24, fats: 6, fiber: 4 },
  { id: 'palak-paneer', name: 'Palak Paneer', category: 'Indian', servingSize: 1, servingUnit: 'cup', calories: 230, protein: 14, carbs: 8, fats: 16, fiber: 3 },
  { id: 'poha', name: 'Poha', category: 'Indian', servingSize: 1, servingUnit: 'cup', calories: 180, protein: 4, carbs: 36, fats: 2, fiber: 2 },
  { id: 'upma', name: 'Upma', category: 'Indian', servingSize: 1, servingUnit: 'cup', calories: 190, protein: 5, carbs: 38, fats: 2, fiber: 3 },
  { id: 'khichdi', name: 'Khichdi', category: 'Indian', servingSize: 1, servingUnit: 'cup', calories: 200, protein: 7, carbs: 36, fats: 3, fiber: 4 },
  { id: 'raita', name: 'Raita', category: 'Indian', servingSize: 1, servingUnit: 'cup', calories: 80, protein: 4, carbs: 6, fats: 4, fiber: 0 },
  { id: 'lassi-sweet', name: 'Lassi Sweet', category: 'Indian', servingSize: 1, servingUnit: 'glass', calories: 180, protein: 6, carbs: 32, fats: 4, fiber: 0 },
  { id: 'chaas', name: 'Buttermilk/Chaas', category: 'Indian', servingSize: 1, servingUnit: 'glass', calories: 40, protein: 2, carbs: 4, fats: 2, fiber: 0 },
  { id: 'butter-chicken', name: 'Butter Chicken', category: 'Indian', servingSize: 1, servingUnit: 'cup', calories: 350, protein: 28, carbs: 12, fats: 22, fiber: 1 },
  { id: 'naan', name: 'Garlic Naan', category: 'Indian', servingSize: 1, servingUnit: 'piece', calories: 260, protein: 8, carbs: 42, fats: 6, fiber: 2 },
  { id: 'pav-bhaji', name: 'Pav Bhaji', category: 'Indian', servingSize: 1, servingUnit: 'plate', calories: 400, protein: 10, carbs: 65, fats: 12, fiber: 6 },

  // PROTEIN (8+ items)
  { id: 'chicken-breast', name: 'Chicken Breast', category: 'Protein', servingSize: 100, servingUnit: 'g', calories: 165, protein: 31, carbs: 0, fats: 3.6, fiber: 0 },
  { id: 'eggs-boiled', name: 'Eggs Boiled', category: 'Protein', servingSize: 1, servingUnit: 'large', calories: 78, protein: 6, carbs: 0.6, fats: 5, fiber: 0 },
  { id: 'salmon', name: 'Salmon', category: 'Protein', servingSize: 100, servingUnit: 'g', calories: 208, protein: 20, carbs: 0, fats: 13, fiber: 0 },
  { id: 'paneer', name: 'Paneer/Cottage Cheese', category: 'Protein', servingSize: 100, servingUnit: 'g', calories: 265, protein: 18, carbs: 4, fats: 20, fiber: 0 },
  { id: 'greek-yogurt', name: 'Greek Yogurt', category: 'Protein', servingSize: 1, servingUnit: 'cup', calories: 130, protein: 12, carbs: 6, fats: 6, fiber: 0 },
  { id: 'tofu', name: 'Tofu', category: 'Protein', servingSize: 100, servingUnit: 'g', calories: 76, protein: 8, carbs: 1.9, fats: 4.8, fiber: 0.3 },
  { id: 'whey-protein', name: 'Whey Protein Shake', category: 'Protein', servingSize: 1, servingUnit: 'scoop', calories: 120, protein: 24, carbs: 3, fats: 1.5, fiber: 0 },
  { id: 'moong-dal', name: 'Lentils/Moong Dal', category: 'Protein', servingSize: 1, servingUnit: 'cup cooked', calories: 230, protein: 18, carbs: 40, fats: 0.8, fiber: 15 },
  { id: 'turkey-breast', name: 'Turkey Breast', category: 'Protein', servingSize: 100, servingUnit: 'g', calories: 135, protein: 30, carbs: 0, fats: 1, fiber: 0 },
  { id: 'tuna-canned', name: 'Tuna Canned', category: 'Protein', servingSize: 100, servingUnit: 'g', calories: 116, protein: 26, carbs: 0, fats: 1, fiber: 0 },

  // GRAINS
  { id: 'oats', name: 'Oats', category: 'Grains', servingSize: 1, servingUnit: 'cup cooked', calories: 150, protein: 6, carbs: 27, fats: 3, fiber: 4 },
  { id: 'brown-rice', name: 'Brown Rice', category: 'Grains', servingSize: 1, servingUnit: 'cup', calories: 215, protein: 5, carbs: 45, fats: 1.6, fiber: 3.5 },
  { id: 'quinoa', name: 'Quinoa', category: 'Grains', servingSize: 1, servingUnit: 'cup', calories: 222, protein: 8, carbs: 39, fats: 3.6, fiber: 5 },
  { id: 'whole-wheat-bread', name: 'Whole Wheat Bread', category: 'Grains', servingSize: 1, servingUnit: 'slice', calories: 80, protein: 4, carbs: 15, fats: 1, fiber: 2 },
  { id: 'muesli', name: 'Muesli', category: 'Grains', servingSize: 1, servingUnit: 'cup', calories: 290, protein: 8, carbs: 58, fats: 4, fiber: 8 },
  { id: 'white-bread', name: 'White Bread', category: 'Grains', servingSize: 1, servingUnit: 'slice', calories: 75, protein: 2, carbs: 14, fats: 1, fiber: 0.5 },
  { id: 'pasta-whole-wheat', name: 'Pasta Whole Wheat', category: 'Grains', servingSize: 1, servingUnit: 'cup cooked', calories: 174, protein: 7, carbs: 37, fats: 0.8, fiber: 6 },
  { id: 'cornflakes', name: 'Cornflakes', category: 'Grains', servingSize: 1, servingUnit: 'cup', calories: 100, protein: 2, carbs: 24, fats: 0.1, fiber: 1 },

  // FRUITS
  { id: 'banana', name: 'Banana', category: 'Fruits', servingSize: 1, servingUnit: 'medium', calories: 105, protein: 1.3, carbs: 27, fats: 0.4, fiber: 3.1 },
  { id: 'apple', name: 'Apple', category: 'Fruits', servingSize: 1, servingUnit: 'medium', calories: 95, protein: 0.5, carbs: 25, fats: 0.3, fiber: 4.4 },
  { id: 'mango', name: 'Mango', category: 'Fruits', servingSize: 1, servingUnit: 'cup', calories: 99, protein: 1.4, carbs: 25, fats: 0.6, fiber: 2.6 },
  { id: 'orange', name: 'Orange', category: 'Fruits', servingSize: 1, servingUnit: 'medium', calories: 62, protein: 1.2, carbs: 15, fats: 0.2, fiber: 3.1 },
  { id: 'papaya', name: 'Papaya', category: 'Fruits', servingSize: 1, servingUnit: 'cup', calories: 55, protein: 0.6, carbs: 14, fats: 0.4, fiber: 2.5 },
  { id: 'watermelon', name: 'Watermelon', category: 'Fruits', servingSize: 1, servingUnit: 'cup', calories: 46, protein: 0.9, carbs: 12, fats: 0.2, fiber: 0.6 },
  { id: 'grapes', name: 'Grapes', category: 'Fruits', servingSize: 1, servingUnit: 'cup', calories: 104, protein: 1.1, carbs: 27, fats: 0.2, fiber: 1.4 },
  { id: 'strawberry', name: 'Strawberry', category: 'Fruits', servingSize: 1, servingUnit: 'cup', calories: 49, protein: 1, carbs: 12, fats: 0.5, fiber: 3 },
  { id: 'pineapple', name: 'Pineapple', category: 'Fruits', servingSize: 1, servingUnit: 'cup', calories: 82, protein: 0.9, carbs: 22, fats: 0.2, fiber: 2.3 },
  { id: 'guava', name: 'Guava', category: 'Fruits', servingSize: 1, servingUnit: 'medium', calories: 37, protein: 1.4, carbs: 8, fats: 0.5, fiber: 3 },

  // VEGETABLES
  { id: 'broccoli', name: 'Broccoli', category: 'Vegetables', servingSize: 1, servingUnit: 'cup', calories: 55, protein: 3.7, carbs: 11, fats: 0.6, fiber: 5 },
  { id: 'sweet-potato', name: 'Sweet Potato', category: 'Vegetables', servingSize: 1, servingUnit: 'medium', calories: 103, protein: 2, carbs: 24, fats: 0.2, fiber: 3.8 },
  { id: 'spinach', name: 'Spinach', category: 'Vegetables', servingSize: 1, servingUnit: 'cup cooked', calories: 41, protein: 5, carbs: 7, fats: 0.5, fiber: 4.3 },
  { id: 'cucumber', name: 'Cucumber', category: 'Vegetables', servingSize: 1, servingUnit: 'cup', calories: 16, protein: 0.7, carbs: 3.8, fats: 0.1, fiber: 0.5 },
  { id: 'tomato', name: 'Tomato', category: 'Vegetables', servingSize: 1, servingUnit: 'medium', calories: 22, protein: 1.1, carbs: 4.8, fats: 0.2, fiber: 1.5 },
  { id: 'carrot', name: 'Carrot', category: 'Vegetables', servingSize: 1, servingUnit: 'medium', calories: 25, protein: 0.6, carbs: 6, fats: 0.1, fiber: 1.7 },
  { id: 'cauliflower', name: 'Cauliflower', category: 'Vegetables', servingSize: 1, servingUnit: 'cup', calories: 25, protein: 2, carbs: 5, fats: 0.3, fiber: 2 },
  { id: 'green-peas', name: 'Green Peas', category: 'Vegetables', servingSize: 1, servingUnit: 'cup', calories: 118, protein: 8, carbs: 21, fats: 0.4, fiber: 7 },
  { id: 'bell-pepper', name: 'Bell Pepper', category: 'Vegetables', servingSize: 1, servingUnit: 'medium', calories: 31, protein: 1, carbs: 6, fats: 0.3, fiber: 2.1 },
  { id: 'onion', name: 'Onion', category: 'Vegetables', servingSize: 1, servingUnit: 'medium', calories: 44, protein: 1.2, carbs: 10, fats: 0.1, fiber: 1.9 },

  // BEVERAGES
  { id: 'water', name: 'Water', category: 'Beverages', servingSize: 1, servingUnit: 'glass', calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 },
  { id: 'green-tea', name: 'Green Tea', category: 'Beverages', servingSize: 1, servingUnit: 'cup', calories: 2, protein: 0, carbs: 0, fats: 0, fiber: 0 },
  { id: 'black-coffee', name: 'Black Coffee', category: 'Beverages', servingSize: 1, servingUnit: 'cup', calories: 5, protein: 0.3, carbs: 0, fats: 0, fiber: 0 },
  { id: 'milk-full-fat', name: 'Milk Full Fat', category: 'Beverages', servingSize: 1, servingUnit: 'cup', calories: 150, protein: 8, carbs: 12, fats: 8, fiber: 0 },
  { id: 'milk-toned', name: 'Milk Toned', category: 'Beverages', servingSize: 1, servingUnit: 'cup', calories: 120, protein: 8, carbs: 12, fats: 4.5, fiber: 0 },
  { id: 'orange-juice', name: 'Fresh Orange Juice', category: 'Beverages', servingSize: 1, servingUnit: 'glass', calories: 110, protein: 2, carbs: 26, fats: 0.5, fiber: 0.5 },
  { id: 'coconut-water', name: 'Coconut Water', category: 'Beverages', servingSize: 1, servingUnit: 'glass', calories: 46, protein: 2, carbs: 9, fats: 0.5, fiber: 2.6 },
  { id: 'apple-juice', name: 'Apple Juice', category: 'Beverages', servingSize: 1, servingUnit: 'glass', calories: 114, protein: 0.3, carbs: 28, fats: 0.3, fiber: 0.5 },
  { id: 'tea-with-milk', name: 'Tea with Milk & Sugar', category: 'Beverages', servingSize: 1, servingUnit: 'cup', calories: 90, protein: 3, carbs: 15, fats: 3, fiber: 0 },

  // SNACKS
  { id: 'makhana', name: 'Makhana/Fox Nuts', category: 'Snacks', servingSize: 1, servingUnit: 'cup', calories: 90, protein: 3, carbs: 20, fats: 0.1, fiber: 2 },
  { id: 'mixed-dry-fruits', name: 'Mixed Dry Fruits', category: 'Snacks', servingSize: 30, servingUnit: 'g', calories: 170, protein: 5, carbs: 10, fats: 14, fiber: 3 },
  { id: 'granola-bar', name: 'Granola Bar', category: 'Snacks', servingSize: 1, servingUnit: 'bar', calories: 190, protein: 4, carbs: 28, fats: 7, fiber: 3 },
  { id: 'dark-chocolate', name: 'Dark Chocolate', category: 'Snacks', servingSize: 30, servingUnit: 'g', calories: 170, protein: 2, carbs: 13, fats: 12, fiber: 3 },
  { id: 'sprout-salad', name: 'Sprout Salad', category: 'Snacks', servingSize: 1, servingUnit: 'cup', calories: 120, protein: 8, carbs: 18, fats: 1, fiber: 6 },
  { id: 'peanut-butter', name: 'Peanut Butter', category: 'Snacks', servingSize: 2, servingUnit: 'tbsp', calories: 190, protein: 8, carbs: 6, fats: 16, fiber: 2 },
  { id: 'almonds', name: 'Almonds', category: 'Snacks', servingSize: 10, servingUnit: 'pieces', calories: 70, protein: 2.5, carbs: 2.5, fats: 6, fiber: 1.5 },
  { id: 'walnuts', name: 'Walnuts', category: 'Snacks', servingSize: 5, servingUnit: 'pieces', calories: 130, protein: 3, carbs: 3, fats: 13, fiber: 1.5 },
  { id: 'pistachios', name: 'Pistachios', category: 'Snacks', servingSize: 20, servingUnit: 'pieces', calories: 80, protein: 3, carbs: 4, fats: 6, fiber: 1.5 },
  { id: 'cashews', name: 'Cashews', category: 'Snacks', servingSize: 10, servingUnit: 'pieces', calories: 155, protein: 5, carbs: 9, fats: 12, fiber: 1 },
];

const EXERCISES: Exercise[] = [
  {
    id: 'pushups',
    name: 'Push-ups',
    category: 'strength',
    muscleGroup: 'Upper Body',
    difficulty: 'Beginner',
    type: 'reps',
    sets: 3,
    reps: 12,
    caloriesPerMinute: 8,
    instructions: [
      'Start in a plank position with hands slightly wider than shoulders.',
      'Lower your body until your chest nearly touches the floor.',
      'Push back up to the starting position.',
      'Keep your core tight and back straight throughout.'
    ],
    tips: ['Don\'t let your hips sag.', 'Keep elbows at a 45-degree angle.'],
    targetMuscles: ['Chest', 'Triceps', 'Shoulders']
  },
  {
    id: 'squats',
    name: 'Squats',
    category: 'strength',
    muscleGroup: 'Lower Body',
    difficulty: 'Beginner',
    type: 'reps',
    sets: 3,
    reps: 15,
    caloriesPerMinute: 7,
    instructions: [
      'Stand with feet shoulder-width apart.',
      'Lower your hips back and down as if sitting in a chair.',
      'Keep your chest up and knees behind your toes.',
      'Drive through your heels to return to standing.'
    ],
    tips: ['Keep your weight on your heels.', 'Look straight ahead.'],
    targetMuscles: ['Quads', 'Glutes', 'Hamstrings']
  },
  {
    id: 'lunges',
    name: 'Lunges',
    category: 'strength',
    muscleGroup: 'Lower Body',
    difficulty: 'Beginner',
    type: 'reps',
    sets: 3,
    reps: 12,
    caloriesPerMinute: 6,
    instructions: [
      'Step forward with one leg and lower your hips.',
      'Both knees should be bent at a 90-degree angle.',
      'Keep your front knee directly above your ankle.',
      'Push back to the starting position and repeat on the other side.'
    ],
    tips: ['Keep your torso upright.', 'Don\'t let your back knee hit the floor.'],
    targetMuscles: ['Quads', 'Glutes', 'Hamstrings']
  },
  {
    id: 'plank',
    name: 'Plank',
    category: 'hiit',
    muscleGroup: 'Core',
    difficulty: 'Beginner',
    type: 'timed',
    sets: 3,
    durationSeconds: 45,
    caloriesPerMinute: 4,
    instructions: [
      'Start in a push-up position but rest on your forearms.',
      'Keep your body in a straight line from head to heels.',
      'Engage your core and glutes.',
      'Hold the position for the specified duration.'
    ],
    tips: ['Don\'t hold your breath.', 'Keep your neck neutral.'],
    targetMuscles: ['Abs', 'Lower Back', 'Shoulders']
  },
  {
    id: 'burpees',
    name: 'Burpees',
    category: 'hiit',
    muscleGroup: 'Full Body',
    difficulty: 'Advanced',
    type: 'reps',
    sets: 3,
    reps: 10,
    caloriesPerMinute: 12,
    instructions: [
      'From a standing position, drop into a squat and place hands on floor.',
      'Jump your feet back into a plank position.',
      'Jump your feet back to your hands.',
      'Explosively jump into the air with arms overhead.'
    ],
    tips: ['Maintain a steady rhythm.', 'Land softly on your feet.'],
    targetMuscles: ['Full Body', 'Heart']
  },
  {
    id: 'mtn-climbers',
    name: 'Mountain Climbers',
    category: 'cardio',
    muscleGroup: 'Full Body',
    difficulty: 'Intermediate',
    type: 'timed',
    sets: 3,
    durationSeconds: 40,
    caloriesPerMinute: 10,
    instructions: [
      'Start in a high plank position.',
      'Drive one knee toward your chest, then quickly switch legs.',
      'Keep your hips low and core engaged.',
      'Continue alternating legs as fast as possible.'
    ],
    tips: ['Keep your back flat.', 'Don\'t bounce your hips.'],
    targetMuscles: ['Abs', 'Shoulders', 'Quads']
  },
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    category: 'cardio',
    muscleGroup: 'Full Body',
    difficulty: 'Beginner',
    type: 'timed',
    sets: 3,
    durationSeconds: 60,
    caloriesPerMinute: 9,
    instructions: [
      'Stand with feet together and arms at sides.',
      'Jump while spreading legs and bringing arms overhead.',
      'Jump back to the starting position.',
      'Maintain a consistent pace.'
    ],
    tips: ['Stay on the balls of your feet.', 'Keep arms straight.'],
    targetMuscles: ['Full Body', 'Heart']
  },
  {
    id: 'bicep-curls',
    name: 'Bicep Curls',
    category: 'strength',
    muscleGroup: 'Upper Body',
    difficulty: 'Beginner',
    type: 'reps',
    sets: 3,
    reps: 15,
    caloriesPerMinute: 4,
    instructions: [
      'Stand with feet shoulder-width apart, arms at sides.',
      'Slowly curl your hands toward your shoulders (use resistance or light weights).',
      'Squeeze your biceps at the top.',
      'Slowly lower back to the starting position.'
    ],
    tips: ['Keep elbows tucked to your sides.', 'Don\'t swing your body.'],
    targetMuscles: ['Biceps', 'Forearms']
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    category: 'strength',
    muscleGroup: 'Lower Body',
    difficulty: 'Intermediate',
    type: 'reps',
    sets: 3,
    reps: 12,
    caloriesPerMinute: 8,
    instructions: [
      'Stand with feet hip-width apart.',
      'Hinge at your hips and lower your torso while keeping back flat.',
      'Reach toward the floor (use a bar or weights if available).',
      'Drive through your heels and squeeze glutes to stand back up.'
    ],
    tips: ['Keep the weight close to your legs.', 'Don\'t round your back.'],
    targetMuscles: ['Hamstrings', 'Glutes', 'Lower Back']
  },
  {
    id: 'pullups',
    name: 'Pull-ups',
    category: 'strength',
    muscleGroup: 'Upper Body',
    difficulty: 'Advanced',
    type: 'reps',
    sets: 3,
    reps: 8,
    caloriesPerMinute: 9,
    instructions: [
      'Grip the pull-up bar with hands slightly wider than shoulders.',
      'Pull your body up until your chin is over the bar.',
      'Lower your body back down with control.',
      'Avoid swinging or using momentum.'
    ],
    tips: ['Engage your lats.', 'Keep your core tight.'],
    targetMuscles: ['Lats', 'Biceps', 'Upper Back']
  },
  {
    id: 'crunches',
    name: 'Crunches',
    category: 'strength',
    muscleGroup: 'Core',
    difficulty: 'Beginner',
    type: 'reps',
    sets: 3,
    reps: 20,
    caloriesPerMinute: 4,
    instructions: [
      'Lie on your back with knees bent and feet flat on the floor.',
      'Place hands behind your head or across your chest.',
      'Lift your shoulders off the floor using your abdominal muscles.',
      'Lower back down with control.'
    ],
    tips: ['Don\'t pull on your neck.', 'Exhale as you crunch up.'],
    targetMuscles: ['Abs']
  },
  {
    id: 'russian-twists',
    name: 'Russian Twists',
    category: 'hiit',
    muscleGroup: 'Core',
    difficulty: 'Intermediate',
    type: 'reps',
    sets: 3,
    reps: 20,
    caloriesPerMinute: 6,
    instructions: [
      'Sit on the floor with knees bent and feet slightly elevated.',
      'Lean back slightly and clasp your hands together.',
      'Twist your torso to the right, then to the left.',
      'Keep your core engaged and back straight.'
    ],
    tips: ['Follow your hands with your eyes.', 'Control the movement.'],
    targetMuscles: ['Obliques', 'Abs']
  },
  {
    id: 'shoulder-press',
    name: 'Shoulder Press',
    category: 'strength',
    muscleGroup: 'Upper Body',
    difficulty: 'Intermediate',
    type: 'reps',
    sets: 3,
    reps: 12,
    caloriesPerMinute: 5,
    instructions: [
      'Stand or sit with weights at shoulder level.',
      'Press the weights overhead until arms are fully extended.',
      'Slowly lower back to shoulder level.',
      'Keep your core tight to avoid arching your back.'
    ],
    tips: ['Don\'t lock your elbows.', 'Control the descent.'],
    targetMuscles: ['Shoulders', 'Triceps']
  },
  {
    id: 'tricep-dips',
    name: 'Tricep Dips',
    category: 'strength',
    muscleGroup: 'Upper Body',
    difficulty: 'Intermediate',
    type: 'reps',
    sets: 3,
    reps: 12,
    caloriesPerMinute: 5,
    instructions: [
      'Place hands on the edge of a sturdy chair or bench.',
      'Extend your legs forward and lower your hips toward the floor.',
      'Push back up using your triceps.',
      'Keep your back close to the bench.'
    ],
    tips: ['Don\'t go too low if it hurts your shoulders.', 'Keep elbows pointed back.'],
    targetMuscles: ['Triceps', 'Shoulders']
  },
  {
    id: 'high-knees',
    name: 'High Knees',
    category: 'cardio',
    muscleGroup: 'Full Body',
    difficulty: 'Intermediate',
    type: 'timed',
    sets: 3,
    durationSeconds: 45,
    caloriesPerMinute: 11,
    instructions: [
      'Run in place while bringing your knees as high as possible.',
      'Pump your arms in sync with your legs.',
      'Stay on the balls of your feet.',
      'Maintain a fast pace.'
    ],
    tips: ['Keep your chest up.', 'Land softly.'],
    targetMuscles: ['Quads', 'Heart', 'Abs']
  },
  {
    id: 'box-jumps',
    name: 'Box Jumps',
    category: 'hiit',
    muscleGroup: 'Lower Body',
    difficulty: 'Advanced',
    type: 'reps',
    sets: 3,
    reps: 10,
    caloriesPerMinute: 10,
    instructions: [
      'Stand in front of a sturdy box or platform.',
      'Swing arms and jump onto the box, landing softly.',
      'Stand up fully on the box.',
      'Step back down and repeat.'
    ],
    tips: ['Land with knees slightly bent.', 'Use your arms for momentum.'],
    targetMuscles: ['Quads', 'Glutes', 'Calves']
  },
  {
    id: 'sun-salutation',
    name: 'Sun Salutation',
    category: 'yoga',
    muscleGroup: 'Full Body',
    difficulty: 'Beginner',
    type: 'timed',
    sets: 3,
    durationSeconds: 120,
    caloriesPerMinute: 4,
    instructions: [
      'A sequence of yoga poses including mountain pose, forward fold, and plank.',
      'Flow through the movements with your breath.',
      'Focus on stretching and mobility.',
      'Repeat the sequence multiple times.'
    ],
    tips: ['Move slowly and mindfully.', 'Focus on your breathing.'],
    targetMuscles: ['Full Body', 'Flexibility']
  },
  {
    id: 'warrior-pose',
    name: 'Warrior Pose',
    category: 'yoga',
    muscleGroup: 'Lower Body',
    difficulty: 'Beginner',
    type: 'timed',
    sets: 3,
    durationSeconds: 60,
    caloriesPerMinute: 3,
    instructions: [
      'Step one foot back and turn it out slightly.',
      'Bend your front knee and reach arms overhead.',
      'Keep your hips square to the front.',
      'Hold the pose and breathe.'
    ],
    tips: ['Keep your back leg strong.', 'Reach through your fingertips.'],
    targetMuscles: ['Quads', 'Shoulders', 'Balance']
  },
  {
    id: 'downward-dog',
    name: 'Downward Dog',
    category: 'yoga',
    muscleGroup: 'Full Body',
    difficulty: 'Beginner',
    type: 'timed',
    sets: 3,
    durationSeconds: 60,
    caloriesPerMinute: 3,
    instructions: [
      'Start on hands and knees, then lift hips toward the ceiling.',
      'Form an inverted V-shape with your body.',
      'Press your heels toward the floor and reach through your hands.',
      'Relax your head and neck.'
    ],
    tips: ['Spread your fingers wide.', 'Pedal your feet to stretch calves.'],
    targetMuscles: ['Hamstrings', 'Shoulders', 'Back']
  },
  {
    id: 'childs-pose',
    name: 'Child\'s Pose',
    category: 'stretching',
    muscleGroup: 'Flexibility',
    difficulty: 'Beginner',
    type: 'timed',
    sets: 1,
    durationSeconds: 60,
    caloriesPerMinute: 2,
    instructions: [
      'Kneel on the floor and sit back on your heels.',
      'Fold forward and rest your forehead on the floor.',
      'Extend arms forward or alongside your body.',
      'Breathe deeply and relax.'
    ],
    tips: ['Let your body feel heavy.', 'Focus on relaxing your back.'],
    targetMuscles: ['Lower Back', 'Hips']
  },
  {
    id: 'cat-cow',
    name: 'Cat-Cow Stretch',
    category: 'stretching',
    muscleGroup: 'Flexibility',
    difficulty: 'Beginner',
    type: 'timed',
    sets: 2,
    durationSeconds: 60,
    caloriesPerMinute: 2,
    instructions: [
      'Start on hands and knees.',
      'Inhale and arch your back (Cow), then exhale and round your back (Cat).',
      'Move with your breath.',
      'Focus on spinal mobility.'
    ],
    tips: ['Move slowly.', 'Engage your core.'],
    targetMuscles: ['Spine', 'Neck']
  },
  {
    id: 'hamstring-stretch',
    name: 'Hamstring Stretch',
    category: 'stretching',
    muscleGroup: 'Flexibility',
    difficulty: 'Beginner',
    type: 'timed',
    sets: 2,
    durationSeconds: 45,
    caloriesPerMinute: 2,
    instructions: [
      'Sit on the floor with one leg extended and the other bent.',
      'Reach toward your toes on the extended leg.',
      'Keep your back straight and hinge from the hips.',
      'Hold and breathe.'
    ],
    tips: ['Don\'t bounce.', 'Go until you feel a gentle pull.'],
    targetMuscles: ['Hamstrings']
  },
  {
    id: 'side-plank',
    name: 'Side Plank',
    category: 'hiit',
    muscleGroup: 'Core',
    difficulty: 'Intermediate',
    type: 'timed',
    sets: 3,
    durationSeconds: 30,
    caloriesPerMinute: 5,
    instructions: [
      'Lie on your side and prop yourself up on one forearm.',
      'Lift your hips until your body forms a straight line.',
      'Hold the position and keep your core tight.',
      'Repeat on the other side.'
    ],
    tips: ['Don\'t let your hips sag.', 'Keep your shoulder directly above your elbow.'],
    targetMuscles: ['Obliques', 'Abs']
  },
  {
    id: 'flutter-kicks',
    name: 'Flutter Kicks',
    category: 'hiit',
    muscleGroup: 'Core',
    difficulty: 'Intermediate',
    type: 'timed',
    sets: 3,
    durationSeconds: 45,
    caloriesPerMinute: 7,
    instructions: [
      'Lie on your back with hands under your hips.',
      'Lift your legs slightly off the floor.',
      'Alternately kick your legs up and down in a small motion.',
      'Keep your lower back pressed into the floor.'
    ],
    tips: ['Keep your legs straight.', 'Engage your lower abs.'],
    targetMuscles: ['Lower Abs', 'Hip Flexors']
  },
  {
    id: 'bicycle-crunches',
    name: 'Bicycle Crunches',
    category: 'hiit',
    muscleGroup: 'Core',
    difficulty: 'Intermediate',
    type: 'reps',
    sets: 3,
    reps: 20,
    caloriesPerMinute: 8,
    instructions: [
      'Lie on your back with hands behind your head.',
      'Bring one knee toward your chest while twisting the opposite elbow toward it.',
      'Switch sides in a pedaling motion.',
      'Keep your core engaged throughout.'
    ],
    tips: ['Don\'t pull on your neck.', 'Focus on the twist.'],
    targetMuscles: ['Abs', 'Obliques']
  },
  {
    id: 'wall-sit',
    name: 'Wall Sit',
    category: 'strength',
    muscleGroup: 'Lower Body',
    difficulty: 'Beginner',
    type: 'timed',
    sets: 3,
    durationSeconds: 45,
    caloriesPerMinute: 4,
    instructions: [
      'Lean against a wall and slide down until your knees are at a 90-degree angle.',
      'Keep your back flat against the wall.',
      'Hold the position for the specified duration.',
      'Keep your weight on your heels.'
    ],
    tips: ['Don\'t rest your hands on your legs.', 'Breathe steadily.'],
    targetMuscles: ['Quads', 'Glutes']
  },
  {
    id: 'step-ups',
    name: 'Step-ups',
    category: 'cardio',
    muscleGroup: 'Lower Body',
    difficulty: 'Beginner',
    type: 'reps',
    sets: 3,
    reps: 15,
    caloriesPerMinute: 8,
    instructions: [
      'Step onto a sturdy box or platform with one foot.',
      'Drive through your heel to stand up fully on the box.',
      'Step back down and repeat with the other leg.',
      'Maintain a steady pace.'
    ],
    tips: ['Keep your chest up.', 'Use a height that challenges you.'],
    targetMuscles: ['Quads', 'Glutes', 'Heart']
  },
  {
    id: 'lateral-raises',
    name: 'Lateral Raises',
    category: 'strength',
    muscleGroup: 'Upper Body',
    difficulty: 'Intermediate',
    type: 'reps',
    sets: 3,
    reps: 12,
    caloriesPerMinute: 4,
    instructions: [
      'Stand with weights at your sides.',
      'Slowly lift your arms out to the sides until they are at shoulder level.',
      'Keep a slight bend in your elbows.',
      'Slowly lower back to the starting position.'
    ],
    tips: ['Don\'t use momentum.', 'Control the movement.'],
    targetMuscles: ['Shoulders']
  },
  {
    id: 'glute-bridges',
    name: 'Glute Bridges',
    category: 'strength',
    muscleGroup: 'Lower Body',
    difficulty: 'Beginner',
    type: 'reps',
    sets: 3,
    reps: 15,
    caloriesPerMinute: 5,
    instructions: [
      'Lie on your back with knees bent and feet flat on the floor.',
      'Lift your hips toward the ceiling while squeezing your glutes.',
      'Hold for a second at the top.',
      'Lower back down with control.'
    ],
    tips: ['Keep your core engaged.', 'Don\'t arch your lower back.'],
    targetMuscles: ['Glutes', 'Hamstrings']
  },
  {
    id: 'superman',
    name: 'Superman Hold',
    category: 'strength',
    muscleGroup: 'Core',
    difficulty: 'Intermediate',
    type: 'timed',
    sets: 3,
    durationSeconds: 30,
    caloriesPerMinute: 4,
    instructions: [
      'Lie face down on the floor with arms and legs extended.',
      'Simultaneously lift your arms, chest, and legs off the floor.',
      'Hold the position and squeeze your lower back muscles.',
      'Lower back down with control.'
    ],
    tips: ['Keep your neck neutral.', 'Focus on the squeeze.'],
    targetMuscles: ['Lower Back', 'Glutes']
  }
];

// --- Components ---

const StatCard = ({ icon: Icon, label, value, unit, color }: any) => (
  <div className="card p-4 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} bg-opacity-10`}>
      <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-xl font-bold">{value} <span className="text-sm font-normal text-gray-400">{unit}</span></p>
    </div>
  </div>
);

const Placeholder = ({ label, height = 'h-40' }: { label: string; height?: string }) => (
  <div className={`placeholder-area ${height}`}>
    {label} Placeholder
  </div>
);

const ExerciseVisual = ({ exerciseId }: { exerciseId: string }) => {
  const getAnimationClass = () => {
    if (['pushups', 'plank', 'burpees'].includes(exerciseId)) return 'animate-pushup';
    if (['squats', 'lunges', 'box-jumps', 'wall-sit'].includes(exerciseId)) return 'animate-squat';
    if (['jumping-jacks', 'high-knees'].includes(exerciseId)) return 'animate-jumping-jack';
    return 'animate-float';
  };

  return (
    <div className="w-full h-48 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden relative border border-gray-100">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#00C853 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      </div>
      
      {/* Simple Stick Figure Illustration */}
      <div className={`relative ${getAnimationClass()}`}>
        {/* Head */}
        <div className="w-8 h-8 rounded-full bg-secondary absolute -top-10 left-1/2 -translate-x-1/2"></div>
        {/* Torso */}
        <div className="w-2 h-16 bg-secondary rounded-full"></div>
        {/* Arms */}
        <div className="w-12 h-2 bg-secondary rounded-full absolute top-2 -left-5 rotate-45 origin-right"></div>
        <div className="w-12 h-2 bg-secondary rounded-full absolute top-2 -right-5 -rotate-45 origin-left"></div>
        {/* Legs */}
        <div className="w-2 h-16 bg-secondary rounded-full absolute top-14 left-0 -rotate-12 origin-top"></div>
        <div className="w-2 h-16 bg-secondary rounded-full absolute top-14 right-0 rotate-12 origin-top"></div>
      </div>

      {/* Target Muscle Dots */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1">
        <div className="text-[8px] font-bold text-gray-400 uppercase text-right">Target Areas</div>
        <div className="flex gap-1 justify-end">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <div className="w-2 h-2 rounded-full bg-primary/30"></div>
          <div className="w-2 h-2 rounded-full bg-primary/10"></div>
        </div>
      </div>
    </div>
  );
};

const WorkoutTimer = ({ duration, onComplete }: { duration: number; onComplete: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (timeLeft / duration) * circumference;

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="w-full h-full">
          <circle 
            cx="96" cy="96" r={radius} 
            fill="transparent" stroke="#f3f4f6" strokeWidth="12" 
          />
          <circle 
            cx="96" cy="96" r={radius} 
            fill="transparent" stroke="#00C853" strokeWidth="12" 
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="workout-timer-circle"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-black text-secondary">{timeLeft}s</span>
          <span className="text-xs font-bold text-gray-400 uppercase">Remaining</span>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => setTimeLeft(duration)}
          className="p-4 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${isActive ? 'bg-orange-500 text-white' : 'bg-primary text-white'}`}
        >
          {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>
      </div>
    </div>
  );
};

// --- Workout Logic ---

const generateWorkoutPlan = (profile: UserProfile): WorkoutPlan => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const frequencyMap: Record<string, number> = {
    'Sedentary': 3,
    'Lightly Active': 3,
    'Moderately Active': 4,
    'Very Active': 5,
    'Athlete': 6
  };
  
  const activeDaysCount = frequencyMap[profile.activityLevel] || 3;
  
  const plan: any = {
    generatedDate: new Date().toISOString(),
    weekPlan: {}
  };

  const getExercisesForGoal = (goal: string, type: string) => {
    return EXERCISES.filter(e => {
      if (type === 'Rest') return false;
      if (goal === 'Build Muscle') return e.category === 'strength' || e.category === 'hiit';
      if (goal === 'Lose Weight') return e.category === 'cardio' || e.category === 'hiit';
      return true;
    }).slice(0, 6).map(e => e.id);
  };

  days.forEach((day, index) => {
    if (index < activeDaysCount) {
      const type = index % 2 === 0 ? 'Strength' : 'Cardio';
      plan.weekPlan[day] = {
        type,
        exercises: getExercisesForGoal(profile.goal, type),
        duration: 45,
        calories: 350
      };
    } else {
      plan.weekPlan[day] = {
        type: 'Rest',
        exercises: ['childs-pose', 'cat-cow'],
        duration: 15,
        calories: 50
      };
    }
  });

  return plan as WorkoutPlan;
};

const WorkoutsTab = ({ userProfile }: { userProfile: UserProfile }) => {
  const [view, setView] = useState<'home' | 'category' | 'detail' | 'active' | 'summary' | 'history' | 'plan'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<{
    exercises: Exercise[];
    currentIndex: number;
    currentSet: number;
    startTime: number;
    totalCalories: number;
  } | null>(null);
  const [workoutSummary, setWorkoutSummary] = useState<any>(null);
  const [history, setHistory] = useState<WorkoutHistoryEntry[]>(() => {
    const saved = localStorage.getItem('workoutHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [plan, setPlan] = useState<WorkoutPlan | null>(() => {
    const saved = localStorage.getItem('workoutPlan');
    return saved ? JSON.parse(saved) : null;
  });
  const [filter, setFilter] = useState('All');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    localStorage.setItem('workoutHistory', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (plan) localStorage.setItem('workoutPlan', JSON.stringify(plan));
  }, [plan]);

  const handleStartWorkout = (exercises: Exercise[]) => {
    setActiveWorkout({
      exercises,
      currentIndex: 0,
      currentSet: 1,
      startTime: Date.now(),
      totalCalories: 0
    });
    setView('active');
  };

  const handleFinishWorkout = (rating: number) => {
    if (!activeWorkout) return;
    
    const duration = Math.round((Date.now() - activeWorkout.startTime) / 60000);
    const summary = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      exercises: activeWorkout.exercises.map(e => ({
        name: e.name,
        sets: e.sets,
        reps: e.reps,
        duration: e.durationSeconds,
        caloriesBurned: Math.round((e.caloriesPerMinute * (e.durationSeconds || 60)) / 60)
      })),
      totalDuration: duration,
      totalCalories: activeWorkout.totalCalories || 250,
      rating,
      type: activeWorkout.exercises[0]?.muscleGroup || 'Full Body'
    };

    setHistory([summary, ...history]);
    setWorkoutSummary(summary);
    setActiveWorkout(null);
    setView('summary');
  };

  const renderHome = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayPlan = plan?.weekPlan[today as keyof typeof plan.weekPlan];

    return (
      <div className="space-y-8 pb-20">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Workouts</h2>
          <button onClick={() => setView('history')} className="p-2 text-gray-400">
            <History className="w-6 h-6" />
          </button>
        </div>

        {/* Today's Plan Card */}
        <div className="card p-6 bg-login-gradient text-white border-none overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Today's Plan</p>
                <h3 className="text-2xl font-black">{todayPlan?.type || 'Active Recovery'}</h3>
              </div>
              <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase backdrop-blur-md">
                {userProfile.goal}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold">{todayPlan?.duration || 15}m</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-bold">{todayPlan?.calories || 50} kcal</span>
              </div>
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-accent" />
                <span className="text-sm font-bold">{todayPlan?.exercises.length || 2} exercises</span>
              </div>
            </div>

            <button 
              onClick={() => {
                if (todayPlan) {
                  const exercises = todayPlan.exercises.map(id => EXERCISES.find(e => e.id === id)!).filter(Boolean);
                  handleStartWorkout(exercises);
                }
              }}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-xl shadow-primary/20 active:scale-95 transition-all"
            >
              Start Today's Workout
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['All', 'Strength', 'Cardio', 'Yoga', 'HIIT', 'Stretching'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${filter === f ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-gray-500 border border-gray-100'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: 'Upper Body', icon: '👕', color: 'bg-blue-500' },
            { id: 'Lower Body', icon: '🩳', color: 'bg-green-500' },
            { id: 'Core', icon: '🧘', color: 'bg-purple-500' },
            { id: 'Full Body', icon: '🧍', color: 'bg-orange-500' },
            { id: 'Cardio Blast', icon: '⚡', color: 'bg-red-500' },
            { id: 'Flexibility', icon: '🤸', color: 'bg-teal-500' },
          ].map(cat => (
            <button 
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setView('category');
              }}
              className="card p-6 flex flex-col items-center text-center gap-3 hover:border-primary transition-all active:scale-95"
            >
              <div className={`w-12 h-12 rounded-2xl ${cat.color} bg-opacity-10 flex items-center justify-center text-2xl`}>
                {cat.icon}
              </div>
              <span className="font-bold text-sm">{cat.id}</span>
            </button>
          ))}
        </div>

        {/* AI Plan Button */}
        <div className="card p-6 bg-accent/5 border-accent/20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-secondary">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold">AI Workout Plan</p>
              <p className="text-xs text-gray-500">Customized for your goals</p>
            </div>
          </div>
          <button 
            onClick={() => {
              if (!plan) setPlan(generateWorkoutPlan(userProfile));
              setView('plan');
            }}
            className="bg-secondary text-white px-4 py-2 rounded-lg text-xs font-bold"
          >
            {plan ? 'View Plan' : 'Generate'}
          </button>
        </div>
      </div>
    );
  };

  const renderCategory = () => {
    const filtered = EXERCISES.filter(e => {
      if (selectedCategory === 'Cardio Blast') return e.category === 'cardio';
      if (selectedCategory === 'Flexibility') return e.category === 'stretching' || e.category === 'yoga';
      return e.muscleGroup === selectedCategory;
    });

    return (
      <div className="space-y-6 pb-20">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('home')} className="p-2 rounded-xl bg-white border border-gray-100">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold">{selectedCategory}</h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filtered.map(ex => (
            <button 
              key={ex.id}
              onClick={() => {
                setSelectedExercise(ex);
                setView('detail');
              }}
              className="card p-4 flex items-center justify-between hover:border-primary transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-2xl group-hover:bg-primary/5 transition-colors">
                  {ex.category === 'strength' ? '💪' : ex.category === 'cardio' ? '🏃' : '🧘'}
                </div>
                <div className="text-left">
                  <p className="font-bold">{ex.name}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] font-bold uppercase text-gray-400">{ex.difficulty}</span>
                    <span className="text-[10px] font-bold uppercase text-primary bg-primary/5 px-2 rounded-full">{ex.type}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderDetail = () => {
    if (!selectedExercise) return null;
    return (
      <div className="space-y-8 pb-20">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('category')} className="p-2 rounded-xl bg-white border border-gray-100">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold">Exercise Detail</h2>
        </div>

        <ExerciseVisual exerciseId={selectedExercise.id} />

        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-3xl font-black text-secondary mb-2">{selectedExercise.name}</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-secondary text-white text-[10px] font-bold uppercase tracking-wider">{selectedExercise.category}</span>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">{selectedExercise.difficulty}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-primary">{selectedExercise.caloriesPerMinute}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">kcal / min</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Instructions
            </h4>
            <div className="space-y-3">
              {selectedExercise.instructions.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">{i + 1}</span>
                  <p className="text-sm text-gray-600 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Pro Form Tips</h4>
            <ul className="space-y-2">
              {selectedExercise.tips.map((tip, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <button 
            onClick={() => handleStartWorkout([selectedExercise])}
            className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Play className="w-6 h-6 fill-white" />
            START EXERCISE
          </button>
        </div>
      </div>
    );
  };

  const renderActive = () => {
    if (!activeWorkout) return null;
    const currentEx = activeWorkout.exercises[activeWorkout.currentIndex];
    
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Exercise {activeWorkout.currentIndex + 1} of {activeWorkout.exercises.length}</p>
              <h3 className="font-bold text-lg">{currentEx.name}</h3>
            </div>
          </div>
          <button 
            onClick={() => {
              if (confirm('Are you sure you want to quit this workout?')) {
                setActiveWorkout(null);
                setView('home');
              }
            }}
            className="p-2 text-gray-400"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-12 py-10">
          {currentEx.type === 'timed' ? (
            <WorkoutTimer 
              duration={currentEx.durationSeconds || 60} 
              onComplete={() => {
                if (activeWorkout.currentSet < currentEx.sets) {
                  setActiveWorkout({...activeWorkout, currentSet: activeWorkout.currentSet + 1});
                } else if (activeWorkout.currentIndex < activeWorkout.exercises.length - 1) {
                  setActiveWorkout({...activeWorkout, currentIndex: activeWorkout.currentIndex + 1, currentSet: 1});
                } else {
                  handleFinishWorkout(5);
                }
              }} 
            />
          ) : (
            <div className="flex flex-col items-center gap-12">
              <div className="text-center">
                <p className="text-7xl font-black text-secondary mb-2">{currentEx.reps}</p>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Target Reps</p>
              </div>
              
              <div className="flex items-center gap-6">
                {[...Array(currentEx.sets)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-4 h-4 rounded-full border-2 transition-all ${i < activeWorkout.currentSet - 1 ? 'bg-primary border-primary' : i === activeWorkout.currentSet - 1 ? 'border-primary animate-pulse' : 'border-gray-200'}`}
                  ></div>
                ))}
              </div>

              <button 
                onClick={() => {
                  if (activeWorkout.currentSet < currentEx.sets) {
                    setActiveWorkout({...activeWorkout, currentSet: activeWorkout.currentSet + 1});
                  } else if (activeWorkout.currentIndex < activeWorkout.exercises.length - 1) {
                    setActiveWorkout({...activeWorkout, currentIndex: activeWorkout.currentIndex + 1, currentSet: 1});
                  } else {
                    handleFinishWorkout(5);
                  }
                }}
                className="w-64 bg-primary text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-primary/30 active:scale-95 transition-all"
              >
                COMPLETE SET
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-8 w-full max-w-xs">
            <div className="text-center">
              <p className="text-2xl font-bold text-secondary">{activeWorkout.currentSet} / {currentEx.sets}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Current Set</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">~{Math.round((activeWorkout.currentIndex * 50) + (activeWorkout.currentSet * 10))} kcal</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Est. Burned</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-auto pt-6">
          <button 
            onClick={() => {
              if (activeWorkout.currentIndex < activeWorkout.exercises.length - 1) {
                setActiveWorkout({...activeWorkout, currentIndex: activeWorkout.currentIndex + 1, currentSet: 1});
              } else {
                handleFinishWorkout(3);
              }
            }}
            className="flex-1 py-4 text-gray-400 font-bold text-sm"
          >
            Skip Exercise
          </button>
          <button 
            onClick={() => handleFinishWorkout(5)}
            className="flex-1 py-4 text-orange-500 font-bold text-sm"
          >
            Finish Workout
          </button>
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    if (!workoutSummary) return null;
    
    const getMessage = (r: number) => {
      if (r === 5) return "Beast mode activated! 🦁";
      if (r >= 4) return "Great job! You crushed it! 🔥";
      if (r >= 3) return "Solid effort! Keep it up! 💪";
      return "Every workout counts. Good job! 👍";
    };

    return (
      <div className="space-y-8 pb-20 text-center">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-black mb-2">Workout Complete!</h2>
          <p className="text-gray-500">{getMessage(rating)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="card p-6">
            <p className="text-3xl font-black text-primary">{workoutSummary.totalDuration}m</p>
            <p className="text-xs font-bold text-gray-400 uppercase">Duration</p>
          </div>
          <div className="card p-6">
            <p className="text-3xl font-black text-orange-500">{workoutSummary.totalCalories}</p>
            <p className="text-xs font-bold text-gray-400 uppercase">Calories</p>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <p className="font-bold">How was this workout?</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button 
                key={star} 
                onClick={() => setRating(star)}
                className="transition-all active:scale-125"
              >
                <Star className={`w-8 h-8 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => setView('home')}
          className="w-full bg-primary text-white py-5 rounded-2xl font-black shadow-xl shadow-primary/20 active:scale-95 transition-all"
        >
          SAVE & CONTINUE
        </button>
      </div>
    );
  };

  const renderPlan = () => {
    if (!plan) return null;
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    return (
      <div className="space-y-8 pb-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('home')} className="p-2 rounded-xl bg-white border border-gray-100">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold">Weekly Plan</h2>
          </div>
          <button 
            onClick={() => setPlan(generateWorkoutPlan(userProfile))}
            className="p-2 text-primary"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {days.map(day => {
            const d = plan.weekPlan[day as keyof typeof plan.weekPlan];
            const isRest = d.type === 'Rest';
            return (
              <div key={day} className={`card p-4 flex items-center justify-between ${isRest ? 'bg-gray-50 opacity-60' : 'border-l-4 border-l-primary'}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white flex flex-col items-center justify-center shadow-sm">
                    <span className="text-[10px] font-bold uppercase text-gray-400">{day.substring(0, 3)}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm capitalize">{d.type} Session</h4>
                    <p className="text-[10px] text-gray-500">{d.exercises.length} exercises • {d.duration}m</p>
                  </div>
                </div>
                {isRest ? (
                  <Moon className="w-5 h-5 text-gray-300" />
                ) : (
                  <button 
                    onClick={() => {
                      const exercises = d.exercises.map(id => EXERCISES.find(e => e.id === id)!).filter(Boolean);
                      handleStartWorkout(exercises);
                    }}
                    className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"
                  >
                    <Play className="w-4 h-4 fill-primary" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderHistory = () => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const chartData = last7Days.map(date => {
      const dayWorkouts = history.filter(h => h.date.split('T')[0] === date);
      const total = dayWorkouts.reduce((acc, curr) => acc + curr.totalCalories, 0);
      return { date, total };
    });

    const maxCal = Math.max(...chartData.map(d => d.total), 500);

    return (
      <div className="space-y-8 pb-20">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('home')} className="p-2 rounded-xl bg-white border border-gray-100">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold">Workout History</h2>
        </div>

        {/* Weekly Stats */}
        <div className="card p-6 space-y-6">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last 7 Days Activity</h4>
          <div className="flex items-end justify-between h-32 gap-2">
            {chartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-primary rounded-t-md transition-all duration-500" 
                  style={{ height: `${(d.total / maxCal) * 100}%`, minHeight: d.total > 0 ? '4px' : '0' }}
                ></div>
                <span className="text-[8px] font-bold text-gray-400 uppercase">{new Date(d.date).toLocaleDateString('en-US', { weekday: 'narrow' })}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-50">
            <div className="text-center">
              <p className="text-lg font-bold text-secondary">{history.length}</p>
              <p className="text-[8px] font-bold text-gray-400 uppercase">Workouts</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-primary">{history.reduce((acc, curr) => acc + curr.totalCalories, 0)}</p>
              <p className="text-[8px] font-bold text-gray-400 uppercase">Total Kcal</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-orange-500">5</p>
              <p className="text-[8px] font-bold text-gray-400 uppercase">Streak</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {history.map(item => (
            <div key={item.id} className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-xl">
                  {item.type.includes('Upper') ? '👕' : item.type.includes('Lower') ? '🩳' : '🧍'}
                </div>
                <div>
                  <p className="font-bold text-sm">{item.type}</p>
                  <p className="text-[10px] text-gray-400">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-primary">{item.totalCalories} kcal</p>
                <p className="text-[10px] text-gray-400">{item.totalDuration} min</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={view}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
      >
        {view === 'home' && renderHome()}
        {view === 'category' && renderCategory()}
        {view === 'detail' && renderDetail()}
        {view === 'active' && renderActive()}
        {view === 'summary' && renderSummary()}
        {view === 'history' && renderHistory()}
        {view === 'plan' && renderPlan()}
      </motion.div>
    </AnimatePresence>
  );
};

const MealsTab = ({ userProfile }: { userProfile: UserProfile }) => {
  const [mealHistory, setMealHistory] = useState<MealHistory>(() => {
    const saved = localStorage.getItem('mealHistory');
    return saved ? JSON.parse(saved) : {};
  });
  const [customFoods, setCustomFoods] = useState<Food[]>(() => {
    const saved = localStorage.getItem('customFoods');
    return saved ? JSON.parse(saved) : [];
  });
  const [favoriteFoods, setFavoriteFoods] = useState<string[]>(() => {
    const saved = localStorage.getItem('favoriteFoods');
    return saved ? JSON.parse(saved) : [];
  });

  const [view, setView] = useState<'daily' | 'weekly'>('daily');
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
  const [activeMeal, setActiveMeal] = useState<keyof DailyMealLog | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [multiplier, setMultiplier] = useState(1);
  const [isCustomFoodFormOpen, setIsCustomFoodFormOpen] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const dailyLog = mealHistory[today] || {
    breakfast: [],
    morningSnack: [],
    lunch: [],
    eveningSnack: [],
    dinner: [],
    water: 0
  };

  useEffect(() => {
    localStorage.setItem('mealHistory', JSON.stringify(mealHistory));
  }, [mealHistory]);

  useEffect(() => {
    localStorage.setItem('customFoods', JSON.stringify(customFoods));
  }, [customFoods]);

  useEffect(() => {
    localStorage.setItem('favoriteFoods', JSON.stringify(favoriteFoods));
  }, [favoriteFoods]);

  const macroTargets = {
    protein: Math.round((userProfile.dailyCalories * 0.30) / 4),
    carbs: Math.round((userProfile.dailyCalories * 0.45) / 4),
    fats: Math.round((userProfile.dailyCalories * 0.25) / 9),
  };

  const calculateConsumed = () => {
    const meals: (keyof DailyMealLog)[] = ['breakfast', 'morningSnack', 'lunch', 'eveningSnack', 'dinner'];
    let total = { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 };

    meals.forEach(meal => {
      const items = (dailyLog[meal] || []) as LoggedFood[];
      items.forEach(item => {
        const factor = item.qty * item.servingMultiplier;
        total.calories += item.calories * factor;
        total.protein += item.protein * factor;
        total.carbs += item.carbs * factor;
        total.fats += item.fats * factor;
        total.fiber += item.fiber * factor;
      });
    });

    return {
      calories: Math.round(total.calories),
      protein: Math.round(total.protein),
      carbs: Math.round(total.carbs),
      fats: Math.round(total.fats),
      fiber: Math.round(total.fiber)
    };
  };

  const consumed = calculateConsumed();
  const remainingCalories = Math.max(0, userProfile.dailyCalories - consumed.calories);
  const caloriePercentage = (consumed.calories / userProfile.dailyCalories) * 100;

  const getRingColor = () => {
    if (caloriePercentage < 80) return 'text-green-500';
    if (caloriePercentage <= 100) return 'text-orange-500';
    return 'text-red-500';
  };

  const handleAddFood = (food: Food) => {
    if (!activeMeal) return;

    const loggedFood: LoggedFood = {
      ...food,
      qty: quantity,
      servingMultiplier: multiplier,
      loggedAt: new Date().toISOString()
    };

    const updatedHistory = { ...mealHistory };
    if (!updatedHistory[today]) {
      updatedHistory[today] = {
        breakfast: [],
        morningSnack: [],
        lunch: [],
        eveningSnack: [],
        dinner: [],
        water: 0
      };
    }

    const mealArray = (updatedHistory[today][activeMeal] || []) as LoggedFood[];
    updatedHistory[today][activeMeal] = [...mealArray, loggedFood] as any;

    setMealHistory(updatedHistory);
    setIsAddFoodModalOpen(false);
    setSelectedFood(null);
    setQuantity(1);
    setMultiplier(1);
  };

  const toggleFavorite = (foodId: string) => {
    setFavoriteFoods(prev => 
      prev.includes(foodId) ? prev.filter(id => id !== foodId) : [...prev, foodId]
    );
  };

  const handleWaterClick = (index: number) => {
    const updatedHistory = { ...mealHistory };
    if (!updatedHistory[today]) {
      updatedHistory[today] = { breakfast: [], morningSnack: [], lunch: [], eveningSnack: [], dinner: [], water: 0 };
    }
    
    const glassSize = 250;
    updatedHistory[today].water = (index + 1) * glassSize;
    setMealHistory(updatedHistory);
  };

  const copyYesterdayMeals = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (mealHistory[yesterdayStr]) {
      setMealHistory({
        ...mealHistory,
        [today]: { ...mealHistory[yesterdayStr], water: 0 }
      });
    }
  };

  const getNutritionScore = () => {
    const calDiff = Math.abs(consumed.calories - userProfile.dailyCalories);
    const pDiff = Math.abs(consumed.protein - macroTargets.protein) / macroTargets.protein;
    const cDiff = Math.abs(consumed.carbs - macroTargets.carbs) / macroTargets.carbs;
    const fDiff = Math.abs(consumed.fats - macroTargets.fats) / macroTargets.fats;
    
    const macroBalanced = pDiff < 0.1 && cDiff < 0.1 && fDiff < 0.1;

    if (calDiff <= 100 && macroBalanced) return 'A';
    if (calDiff <= 200) return 'B';
    if (calDiff <= 300) return 'C';
    if (calDiff <= 500) return 'D';
    return 'F';
  };

  const getSmartSuggestion = () => {
    if (consumed.protein < macroTargets.protein * 0.5) {
      return "You're low on protein today. Try adding chicken breast or paneer for your next meal.";
    }
    if (consumed.calories > userProfile.dailyCalories) {
      return "You've exceeded your calorie goal. Focus on light, fiber-rich vegetables for the rest of the day.";
    }
    if (consumed.fiber < 20) {
      return "Try to include more fiber-rich foods like oats, lentils, or green vegetables.";
    }
    return "Great job! Your nutrition is well-balanced today.";
  };

  const renderDaily = () => (
    <div className="space-y-8 pb-24">
      <div className="card p-8 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        
        <div className="relative w-56 h-56 mb-8">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-gray-100" />
            <circle 
              cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="16" fill="transparent" 
              strokeDasharray={628} 
              strokeDashoffset={628 * (1 - Math.min(1, caloriePercentage / 100))} 
              className={`${getRingColor()} transition-all duration-1000 ease-out`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.p 
              key={consumed.calories}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-black"
            >
              {consumed.calories.toLocaleString()}
            </motion.p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">of {userProfile.dailyCalories} kcal</p>
          </div>
        </div>

        <div className="w-full space-y-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-bold text-gray-500">{remainingCalories} kcal remaining today</p>
            <div className="flex gap-2">
              <button onClick={() => setView('daily')} className={`p-2 rounded-lg ${view === 'daily' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                <PieChart className="w-4 h-4" />
              </button>
              <button onClick={() => setView('weekly')} className={`p-2 rounded-lg ${view === 'weekly' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                <BarChart2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <MacroBar label="Protein" consumed={consumed.protein} target={macroTargets.protein} color="bg-blue-500" />
            <MacroBar label="Carbs" consumed={consumed.carbs} target={macroTargets.carbs} color="bg-orange-500" />
            <MacroBar label="Fats" consumed={consumed.fats} target={macroTargets.fats} color="bg-pink-500" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <MealSection title="Breakfast" emoji={<Sunrise className="w-5 h-5 text-orange-400" />} time="6 AM - 10 AM" foods={dailyLog.breakfast} onAdd={() => { setActiveMeal('breakfast'); setIsAddFoodModalOpen(true); }} />
        <MealSection title="Morning Snack" emoji={<Apple className="w-5 h-5 text-red-500" />} time="10 AM - 12 PM" foods={dailyLog.morningSnack} onAdd={() => { setActiveMeal('morningSnack'); setIsAddFoodModalOpen(true); }} />
        <MealSection title="Lunch" emoji={<Sun className="w-5 h-5 text-yellow-500" />} time="12 PM - 2 PM" foods={dailyLog.lunch} onAdd={() => { setActiveMeal('lunch'); setIsAddFoodModalOpen(true); }} />
        <MealSection title="Evening Snack" emoji={<Cookie className="w-5 h-5 text-amber-700" />} time="4 PM - 6 PM" foods={dailyLog.eveningSnack} onAdd={() => { setActiveMeal('eveningSnack'); setIsAddFoodModalOpen(true); }} />
        <MealSection title="Dinner" emoji={<Moon className="w-5 h-5 text-indigo-400" />} time="7 PM - 9 PM" foods={dailyLog.dinner} onAdd={() => { setActiveMeal('dinner'); setIsAddFoodModalOpen(true); }} />
      </div>

      <div className="card p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-500" /> Water Intake
          </h3>
          <p className="text-xs font-bold text-gray-400">{dailyLog.water}ml / {userProfile.waterGoal}ml</p>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          {[...Array(Math.ceil(userProfile.waterGoal / 250))].map((_, i) => (
            <button key={i} onClick={() => handleWaterClick(i)} className={`w-10 h-14 rounded-lg border-2 flex items-center justify-center transition-all ${i < dailyLog.water / 250 ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-100 text-gray-200'}`}>
              <Droplets className="w-6 h-6" />
            </button>
          ))}
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-gray-50">
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mr-4">
            <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${(dailyLog.water / userProfile.waterGoal) * 100}%` }} />
          </div>
          <span className="text-xs font-bold text-blue-500">{Math.round((dailyLog.water / userProfile.waterGoal) * 100)}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={copyYesterdayMeals} className="card p-4 flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors">
          <History className="w-4 h-4" /> Copy Yesterday
        </button>
        <button onClick={() => { setActiveMeal('lunch'); setIsAddFoodModalOpen(true); }} className="card p-4 flex items-center justify-center gap-2 text-sm font-bold text-primary hover:bg-primary/5 transition-colors">
          <Plus className="w-4 h-4" /> Quick Log
        </button>
      </div>

      <div className="card p-6 space-y-4 bg-primary/5 border-primary/10">
        <div className="flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" /> Smart Insights
          </h3>
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-black text-primary shadow-sm border border-primary/10">
            {getNutritionScore()}
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{getSmartSuggestion()}</p>
      </div>
    </div>
  );

  const renderWeekly = () => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const chartData = last7Days.map(date => {
      const log = mealHistory[date];
      if (!log) return { date, total: 0 };
      const meals: (keyof DailyMealLog)[] = ['breakfast', 'morningSnack', 'lunch', 'eveningSnack', 'dinner'];
      let total = 0;
      meals.forEach(meal => {
        (log[meal] as LoggedFood[] || []).forEach(item => {
          total += item.calories * item.qty * item.servingMultiplier;
        });
      });
      return { date, total };
    });

    const maxCal = Math.max(...chartData.map(d => d.total), userProfile.dailyCalories * 1.2);

    return (
      <div className="space-y-8 pb-24">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('daily')} className="p-2 rounded-xl bg-white border border-gray-100">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold">Weekly Insights</h2>
        </div>
        <div className="card p-6 space-y-8">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Calorie Intake (Last 7 Days)</h4>
          <div className="relative h-64 flex items-end justify-between gap-2 pt-8">
            <div className="absolute left-0 right-0 border-t-2 border-dashed border-primary/30 z-0" style={{ bottom: `${(userProfile.dailyCalories / maxCal) * 100}%` }}>
              <span className="absolute right-0 -top-6 text-[10px] font-bold text-primary/60 uppercase">Target: {userProfile.dailyCalories}</span>
            </div>
            {chartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 z-10">
                <div className={`w-full rounded-t-lg transition-all duration-1000 ease-out ${d.total > userProfile.dailyCalories ? 'bg-red-400' : 'bg-primary'}`} style={{ height: `${(d.total / maxCal) * 100}%`, minHeight: d.total > 0 ? '4px' : '0' }}></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(d.date).toLocaleDateString('en-US', { weekday: 'narrow' })}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div key={view} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          {view === 'daily' ? renderDaily() : renderWeekly()}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {isAddFoodModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddFoodModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="relative w-full max-w-2xl bg-white rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              <div className="p-8 pb-4 flex justify-between items-center shrink-0">
                <h3 className="text-2xl font-black">Add to {activeMeal}</h3>
                <button onClick={() => setIsAddFoodModalOpen(false)} className="p-2 rounded-full bg-gray-100 text-gray-400"><X className="w-6 h-6" /></button>
              </div>
              <div className="px-8 space-y-6 shrink-0">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" placeholder="Search 80+ foods..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {['All', 'Indian', 'Protein', 'Grains', 'Fruits', 'Vegetables', 'Beverages', 'Snacks', 'Favorites'].map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-100 text-gray-500'}`}>{cat}</button>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-8 pt-4">
                {selectedFood ? (
                  <div className="space-y-8">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md mb-2 inline-block">{selectedFood.category}</div>
                        <h4 className="text-3xl font-black text-secondary">{selectedFood.name}</h4>
                      </div>
                      <button onClick={() => toggleFavorite(selectedFood.id)} className={`p-3 rounded-2xl ${favoriteFoods.includes(selectedFood.id) ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-300'}`}><Heart className={`w-6 h-6 ${favoriteFoods.includes(selectedFood.id) ? 'fill-red-500' : ''}`} /></button>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <NutritionStat label="Calories" val={Math.round(selectedFood.calories * quantity * multiplier)} unit="kcal" color="text-primary" />
                      <NutritionStat label="Protein" val={Math.round(selectedFood.protein * quantity * multiplier)} unit="g" color="text-blue-500" />
                      <NutritionStat label="Carbs" val={Math.round(selectedFood.carbs * quantity * multiplier)} unit="g" color="text-orange-500" />
                      <NutritionStat label="Fats" val={Math.round(selectedFood.fats * quantity * multiplier)} unit="g" color="text-pink-500" />
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl">
                        <span className="font-bold text-gray-500">Quantity</span>
                        <div className="flex items-center gap-6">
                          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary font-bold">-</button>
                          <span className="text-xl font-black w-8 text-center">{quantity}</span>
                          <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary font-bold">+</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl">
                        <span className="font-bold text-gray-500">Serving Size</span>
                        <select value={multiplier} onChange={(e) => setMultiplier(parseFloat(e.target.value))} className="bg-transparent font-black text-xl outline-none text-right">
                          <option value={0.5}>0.5x ({selectedFood.servingSize * 0.5}{selectedFood.servingUnit})</option>
                          <option value={1}>1x ({selectedFood.servingSize}{selectedFood.servingUnit})</option>
                          <option value={1.5}>1.5x ({selectedFood.servingSize * 1.5}{selectedFood.servingUnit})</option>
                          <option value={2}>2x ({selectedFood.servingSize * 2}{selectedFood.servingUnit})</option>
                          <option value={3}>3x ({selectedFood.servingSize * 3}{selectedFood.servingUnit})</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => setSelectedFood(null)} className="flex-1 py-5 rounded-2xl font-bold text-gray-400 bg-gray-50 active:scale-95 transition-all">Back</button>
                      <button onClick={() => handleAddFood(selectedFood)} className="flex-[2] bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all">Add to {activeMeal}</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(selectedCategory === 'Favorites' ? FOOD_DATABASE.filter(f => favoriteFoods.includes(f.id)) : FOOD_DATABASE.filter(f => (selectedCategory === 'All' || f.category === selectedCategory) && f.name.toLowerCase().includes(searchQuery.toLowerCase()))).map(food => (
                      <button key={food.id} onClick={() => setSelectedFood(food)} className="w-full card p-4 flex items-center justify-between hover:border-primary transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-xl group-hover:bg-primary/5 transition-colors">{food.category === 'Indian' ? '🍛' : food.category === 'Protein' ? '🍗' : food.category === 'Fruits' ? '🍎' : '🥗'}</div>
                          <div className="text-left"><p className="font-bold">{food.name}</p><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{food.servingSize}{food.servingUnit} • {food.calories} kcal</p></div>
                        </div>
                        <Plus className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                    <button onClick={() => setIsCustomFoodFormOpen(true)} className="w-full py-6 border-2 border-dashed border-gray-100 rounded-3xl text-gray-400 font-bold text-sm hover:border-primary/20 hover:text-primary transition-all">Can't find your food? Add Custom</button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCustomFoodFormOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCustomFoodFormOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl">
              <h3 className="text-2xl font-black mb-6">Custom Food</h3>
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newFood: Food = {
                  id: 'custom-' + Math.random().toString(36).substr(2, 9),
                  name: formData.get('name') as string,
                  category: 'Custom',
                  servingSize: parseFloat(formData.get('servingSize') as string),
                  servingUnit: 'g',
                  calories: parseFloat(formData.get('calories') as string),
                  protein: parseFloat(formData.get('protein') as string),
                  carbs: parseFloat(formData.get('carbs') as string),
                  fats: parseFloat(formData.get('fats') as string),
                  fiber: 0
                };
                setCustomFoods([...customFoods, newFood]);
                setSelectedFood(newFood);
                setIsCustomFoodFormOpen(false);
              }}>
                <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Food Name</label><input name="name" required className="w-full bg-gray-50 border-none rounded-xl p-4 outline-none" placeholder="e.g. My Special Salad" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Calories</label><input name="calories" type="number" required className="w-full bg-gray-50 border-none rounded-xl p-4 outline-none" placeholder="0" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Serving (g)</label><input name="servingSize" type="number" required className="w-full bg-gray-50 border-none rounded-xl p-4 outline-none" placeholder="100" /></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Protein</label><input name="protein" type="number" className="w-full bg-gray-50 border-none rounded-xl p-4 outline-none" placeholder="0" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Carbs</label><input name="carbs" type="number" className="w-full bg-gray-50 border-none rounded-xl p-4 outline-none" placeholder="0" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Fats</label><input name="fats" type="number" className="w-full bg-gray-50 border-none rounded-xl p-4 outline-none" placeholder="0" /></div>
                </div>
                <button type="submit" className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 mt-4">Save Custom Food</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <button onClick={() => { setActiveMeal('lunch'); setIsAddFoodModalOpen(true); }} className="fixed bottom-24 right-6 w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 active:scale-95 transition-all z-40 md:hidden"><Plus className="w-8 h-8" /></button>
    </div>
  );
};

const MacroBar = ({ label, consumed, target, color }: { label: string; consumed: number; target: number; color: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
      <span className="text-gray-400">{label}</span>
      <span className={color.replace('bg-', 'text-')}>{consumed}g / {target}g</span>
    </div>
    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
      <div className={`${color} h-full rounded-full transition-all duration-1000`} style={{ width: `${Math.min(100, (consumed / target) * 100)}%` }} />
    </div>
  </div>
);

const MealSection = ({ title, emoji, time, foods, onAdd }: { title: string; emoji: ReactNode; time: string; foods: LoggedFood[]; onAdd: () => void }) => {
  const totalCals = (foods || []).reduce((acc, curr) => acc + (curr.calories * curr.qty * curr.servingMultiplier), 0);
  return (
    <div className="card p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">{emoji}</div>
          <div><h4 className="font-bold">{title}</h4><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{time}</p></div>
        </div>
        <p className="text-sm font-black text-secondary">{Math.round(totalCals)} kcal</p>
      </div>
      <div className="space-y-3">
        {foods && foods.length > 0 ? (
          foods.map((food, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <div><p className="text-sm font-bold">{food.name}</p><p className="text-[10px] text-gray-400">{food.qty} x {food.servingSize * food.servingMultiplier}{food.servingUnit}</p></div>
              <p className="text-xs font-bold text-gray-500">{Math.round(food.calories * food.qty * food.servingMultiplier)} kcal</p>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-400 italic py-2">No foods logged yet. Tap + to add.</p>
        )}
      </div>
      <button onClick={onAdd} className="w-full py-3 rounded-xl bg-green-50 text-green-600 text-xs font-bold flex items-center justify-center gap-2 hover:bg-green-100 transition-all"><Plus className="w-4 h-4" /> Add Food</button>
    </div>
  );
};

const NutritionStat = ({ label, val, unit, color }: { label: string; val: number; unit: string; color: string }) => (
  <div className="bg-gray-50 p-4 rounded-2xl text-center">
    <p className={`text-xl font-black ${color}`}>{val}</p>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label} ({unit})</p>
  </div>
);

const Dashboard = ({ userProfile, setActiveTab }: { userProfile: UserProfile; setActiveTab: (tab: Tab) => void }) => {
  const [weightLog, setWeightLog] = useState<WeightEntry[]>(() => {
    const saved = localStorage.getItem('weightLog');
    return saved ? JSON.parse(saved) : [];
  });
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [newWeight, setNewWeight] = useState(userProfile.weight);
  const [weightNote, setWeightNote] = useState('');
  const [weightDate, setWeightDate] = useState(new Date().toISOString().split('T')[0]);
  const [toast, setToast] = useState<string | null>(null);

  const mealHistory = JSON.parse(localStorage.getItem('mealHistory') || '{}');
  const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
  const workoutPlan = JSON.parse(localStorage.getItem('workoutPlan') || 'null');

  const today = new Date().toISOString().split('T')[0];
  const todayMeals = mealHistory[today] || { breakfast: [], morningSnack: [], lunch: [], eveningSnack: [], dinner: [], water: 0 };
  const todayWorkouts = workoutHistory.filter((w: any) => w.date === today);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Calculations
  const consumedCalories = (() => {
    let total = 0;
    ['breakfast', 'morningSnack', 'lunch', 'eveningSnack', 'dinner'].forEach(meal => {
      (todayMeals[meal] || []).forEach((item: any) => {
        total += item.calories * item.qty * item.servingMultiplier;
      });
    });
    return Math.round(total);
  })();

  const workoutMinutes = todayWorkouts.reduce((acc: number, curr: any) => acc + curr.totalDuration, 0);
  const workoutTarget = userProfile.activityLevel === 'Very Active' || userProfile.activityLevel === 'Athlete' ? 45 : 30;

  const waterGlasses = Math.floor(todayMeals.water / 250);
  const waterTarget = Math.ceil(userProfile.waterGoal / 0.25);

  const sleepHours = (() => {
    const [bh, bm] = userProfile.bedtime.split(':').map(Number);
    const [wh, wm] = userProfile.wakeTime.split(':').map(Number);
    let diff = (wh + 24 - bh) % 24;
    diff += (wm - bm) / 60;
    return parseFloat(diff.toFixed(1));
  })();

  const sleepQuality = (() => {
    if (sleepHours < 5) return { label: 'Poor', color: 'text-red-500' };
    if (sleepHours < 6) return { label: 'Fair', color: 'text-orange-500' };
    if (sleepHours < 8) return { label: 'Good', color: 'text-green-500' };
    return { label: 'Excellent', color: 'text-primary' };
  })();

  const streak = (() => {
    let count = 0;
    let d = new Date();
    while (true) {
      const dateStr = d.toISOString().split('T')[0];
      const hasMeal = mealHistory[dateStr] && (
        mealHistory[dateStr].breakfast.length > 0 ||
        mealHistory[dateStr].morningSnack.length > 0 ||
        mealHistory[dateStr].lunch.length > 0 ||
        mealHistory[dateStr].eveningSnack.length > 0 ||
        mealHistory[dateStr].dinner.length > 0
      );
      const hasWorkout = workoutHistory.some((w: any) => w.date === dateStr);
      if (hasMeal || hasWorkout) {
        count++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return count;
  })();

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  })();

  const handleLogWeight = () => {
    const weightKg = userProfile.weightUnit === 'lbs' ? newWeight * 0.453592 : newWeight;
    const heightCm = userProfile.heightUnit === 'ft' ? userProfile.height * 30.48 : userProfile.height;
    const bmi = weightKg / ((heightCm / 100) ** 2);
    
    const entry: WeightEntry = {
      date: weightDate,
      weight: newWeight,
      unit: userProfile.weightUnit,
      bmi: parseFloat(bmi.toFixed(1)),
      note: weightNote
    };

    const updatedLog = [...weightLog, entry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setWeightLog(updatedLog);
    localStorage.setItem('weightLog', JSON.stringify(updatedLog));
    setIsWeightModalOpen(false);
    setWeightNote('');
  };

  const handleQuickWater = () => {
    const updatedHistory = { ...mealHistory };
    if (!updatedHistory[today]) {
      updatedHistory[today] = { breakfast: [], morningSnack: [], lunch: [], eveningSnack: [], dinner: [], water: 0 };
    }
    updatedHistory[today].water += 250;
    localStorage.setItem('mealHistory', JSON.stringify(updatedHistory));
    setToast('+1 glass added!');
    // Force re-render if needed, but since we're using local storage and reading it in render, 
    // it might not update immediately without state. For now, let's just update the local state if we had one.
    // Since we read from localStorage directly in the component body, we might need a trigger.
    window.dispatchEvent(new Event('storage')); // Simple hack to trigger updates if other components listen
    // Better: update a local state that triggers re-render
    setNewWeight(prev => prev); // Dummy update to trigger re-render
  };

  // Weekly Activity Chart Data
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const weeklyActivity = last7Days.map(date => {
    const workouts = workoutHistory.filter((w: any) => w.date === date);
    const totalCals = workouts.reduce((acc: number, curr: any) => acc + curr.totalCalories, 0);
    const mainType = workouts.length > 0 ? workouts[0].type : 'Rest';
    return { date, totalCals, mainType };
  });

  const maxWeeklyCals = Math.max(...weeklyActivity.map(d => d.totalCals), 500);

  // Weight Chart Data
  const weightData = weightLog.slice(-30);
  const minWeight = Math.min(...weightData.map(d => d.weight), userProfile.targetWeight) * 0.95;
  const maxWeight = Math.max(...weightData.map(d => d.weight), userProfile.targetWeight) * 1.05;

  const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return 'text-blue-500';
    if (bmi < 25) return 'text-green-500';
    if (bmi < 30) return 'text-orange-500';
    return 'text-red-500';
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const currentBMI = weightLog.length > 0 ? weightLog[weightLog.length - 1].bmi : userProfile.bmi;
  const prevBMI = weightLog.length > 1 ? weightLog[weightLog.length - 2].bmi : currentBMI;

  const getInsights = () => {
    const insights = [];
    const lastWeek = workoutHistory.filter((w: any) => {
      const d = new Date(w.date);
      const now = new Date();
      return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
    });
    const prevWeek = workoutHistory.filter((w: any) => {
      const d = new Date(w.date);
      const now = new Date();
      const diff = now.getTime() - d.getTime();
      return diff >= 7 * 24 * 60 * 60 * 1000 && diff < 14 * 24 * 60 * 60 * 1000;
    });

    const lastWeekCals = lastWeek.reduce((acc: number, curr: any) => acc + curr.totalCalories, 0);
    const prevWeekCals = prevWeek.reduce((acc: number, curr: any) => acc + curr.totalCalories, 0);

    if (lastWeekCals > prevWeekCals && prevWeekCals > 0) {
      const diff = Math.round(((lastWeekCals - prevWeekCals) / prevWeekCals) * 100);
      insights.push(`You burned ${diff}% more calories this week vs last week. Keep it up!`);
    }

    if (streak > 3) {
      insights.push(`Amazing consistency! You've worked out ${streak} days in a row.`);
    }

    if (weightLog.length > 1) {
      const diff = weightLog[0].weight - weightLog[weightLog.length - 1].weight;
      if (diff > 0) {
        insights.push(`Great progress! You've lost ${diff.toFixed(1)}kg in the past ${Math.round((new Date().getTime() - new Date(weightLog[0].date).getTime()) / (24 * 60 * 60 * 1000))} days.`);
      }
    }

    if (insights.length === 0) {
      insights.push("Start logging meals and workouts to see personalized insights here!");
    }

    return insights.slice(0, 3);
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Top Section */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-black text-secondary">{greeting}, {userProfile.name.split(' ')[0]}!</h2>
          <p className="text-gray-400 font-bold text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {streak > 0 ? (
            <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-2xl border border-orange-100 shadow-sm">
              <Flame className="w-5 h-5 fill-orange-600" />
              <span className="font-black text-sm">{streak} Day Streak!</span>
            </div>
          ) : (
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Start your streak today!</p>
          )}
          <button className="p-3 rounded-2xl bg-white shadow-sm border border-gray-100 text-gray-400 hover:text-primary transition-all">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Daily Snapshot */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 md:grid md:grid-cols-4 md:mx-0 md:px-0">
        <SnapshotCard 
          icon={<Utensils className="w-5 h-5" />} 
          label="Calories" 
          value={`${consumedCalories} / ${userProfile.dailyCalories}`} 
          unit="kcal" 
          progress={consumedCalories / userProfile.dailyCalories}
          color={consumedCalories > userProfile.dailyCalories ? 'text-red-500' : consumedCalories > userProfile.dailyCalories * 0.8 ? 'text-orange-500' : 'text-green-500'}
          onClick={() => setActiveTab('meals')}
        />
        <SnapshotCard 
          icon={<Dumbbell className="w-5 h-5" />} 
          label="Workout" 
          value={`${workoutMinutes} / ${workoutTarget}`} 
          unit="min" 
          progress={workoutMinutes / workoutTarget}
          color="text-primary"
          onClick={() => setActiveTab('workouts')}
        />
        <SnapshotCard 
          icon={<Droplets className="w-5 h-5" />} 
          label="Water" 
          value={`${waterGlasses} / ${waterTarget}`} 
          unit="glasses" 
          progress={waterGlasses / waterTarget}
          color="text-blue-500"
          onClick={() => setActiveTab('meals')}
        />
        <SnapshotCard 
          icon={<Moon className="w-5 h-5" />} 
          label="Sleep" 
          value={`${sleepHours}`} 
          unit="hrs" 
          progress={sleepHours / 8}
          color={sleepQuality.color}
          badge={sleepQuality.label}
          onClick={() => setActiveTab('profile')}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Weight Progress */}
          <div className="card p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black flex items-center gap-2"><Scale className="w-6 h-6 text-primary" /> Weight Progress</h3>
              <button onClick={() => setIsWeightModalOpen(true)} className="px-4 py-2 bg-primary/5 text-primary rounded-xl text-xs font-bold hover:bg-primary/10 transition-all">Log Weight</button>
            </div>
            
            {weightData.length > 0 ? (
              <div className="space-y-6">
                <div className="relative h-64 w-full bg-gray-50/50 rounded-3xl p-4">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Goal Line */}
                    <line 
                      x1="0" y1={100 - ((userProfile.targetWeight - minWeight) / (maxWeight - minWeight)) * 100} 
                      x2="100" y2={100 - ((userProfile.targetWeight - minWeight) / (maxWeight - minWeight)) * 100} 
                      stroke="#22c55e" strokeWidth="0.5" strokeDasharray="2" 
                    />
                    {/* Data Line */}
                    <path 
                      d={`M ${weightData.map((d, i) => `${(i / (weightData.length - 1)) * 100},${100 - ((d.weight - minWeight) / (maxWeight - minWeight)) * 100}`).join(' L ')}`}
                      fill="none" stroke="currentColor" strokeWidth="2" className="text-primary"
                    />
                    {/* Points */}
                    {weightData.map((d, i) => (
                      <circle 
                        key={i}
                        cx={(i / (weightData.length - 1)) * 100}
                        cy={100 - ((d.weight - minWeight) / (maxWeight - minWeight)) * 100}
                        r="1.5" className="fill-white stroke-primary stroke-[1]"
                      />
                    ))}
                  </svg>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Started</p>
                    <p className="font-black">{weightLog[0].weight}{userProfile.weightUnit}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Current</p>
                    <p className="font-black">{weightLog[weightLog.length - 1].weight}{userProfile.weightUnit}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Change</p>
                    <div className={`flex items-center gap-1 font-black ${weightLog[weightLog.length - 1].weight < weightLog[0].weight ? 'text-green-500' : 'text-red-500'}`}>
                      {weightLog[weightLog.length - 1].weight < weightLog[0].weight ? <TrendingUp className="w-4 h-4 rotate-180" /> : <TrendingUp className="w-4 h-4" />}
                      {Math.abs(weightLog[weightLog.length - 1].weight - weightLog[0].weight).toFixed(1)}{userProfile.weightUnit}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                <Scale className="w-12 h-12 text-gray-200 mb-4" />
                <p className="text-gray-400 font-bold text-sm">Start logging your weight to see progress charts here!</p>
                <button onClick={() => setIsWeightModalOpen(true)} className="mt-4 text-primary font-bold text-sm">Log First Entry</button>
              </div>
            )}
          </div>

          {/* Weekly Activity */}
          <div className="card p-8 space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black flex items-center gap-2"><Activity className="w-6 h-6 text-primary" /> This Week's Activity</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Calories Burned</p>
            </div>
            <div className="relative h-48 flex items-end justify-between gap-2 pt-8">
              {weeklyActivity.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative">
                  <div 
                    className={`w-full rounded-t-xl transition-all duration-1000 ease-out ${
                      d.mainType === 'strength' ? 'bg-blue-500' :
                      d.mainType === 'cardio' ? 'bg-red-500' :
                      d.mainType === 'yoga' ? 'bg-purple-500' :
                      d.mainType === 'hiit' ? 'bg-orange-500' :
                      d.mainType === 'stretching' ? 'bg-green-500' : 'bg-gray-100'
                    }`} 
                    style={{ height: `${(d.totalCals / maxWeeklyCals) * 100}%`, minHeight: d.totalCals > 0 ? '8px' : '4px' }}
                  >
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                      {d.totalCals} kcal
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold ${d.date === today ? 'text-primary' : 'text-gray-400'} uppercase`}>
                    {new Date(d.date).toLocaleDateString('en-US', { weekday: 'narrow' })}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-50">
              <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Total Burned</p>
                <p className="font-black text-secondary">{weeklyActivity.reduce((acc, curr) => acc + curr.totalCals, 0)} kcal</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Active Days</p>
                <p className="font-black text-secondary">{weeklyActivity.filter(d => d.totalCals > 0).length}/7</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Best Day</p>
                <p className="font-black text-secondary">
                  {new Date(weeklyActivity.reduce((prev, current) => (prev.totalCals > current.totalCals) ? prev : current).date).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* BMI Tracker */}
          <div className="card p-8 space-y-6">
            <h3 className="text-xl font-black">BMI Tracker</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className={`text-4xl font-black ${getBMIColor(currentBMI)}`}>{currentBMI}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{getBMICategory(currentBMI)}</p>
                </div>
                {currentBMI !== prevBMI && (
                  <div className={`flex items-center gap-1 text-xs font-bold ${currentBMI < prevBMI ? 'text-green-500' : 'text-red-500'}`}>
                    {currentBMI < prevBMI ? <TrendingUp className="w-4 h-4 rotate-180" /> : <TrendingUp className="w-4 h-4" />}
                    {Math.abs(currentBMI - prevBMI).toFixed(1)}
                  </div>
                )}
              </div>
              <div className="relative h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-blue-400" style={{ width: '18.5%' }} />
                <div className="h-full bg-green-400" style={{ width: '6.5%' }} />
                <div className="h-full bg-orange-400" style={{ width: '5%' }} />
                <div className="h-full bg-red-400 flex-1" />
                <motion.div 
                  initial={{ left: 0 }}
                  animate={{ left: `${Math.min(100, (currentBMI / 40) * 100)}%` }}
                  className="absolute top-0 bottom-0 w-1 bg-secondary shadow-sm z-10"
                />
              </div>
              <div className="flex justify-between text-[8px] font-bold text-gray-300 uppercase">
                <span>15</span>
                <span>20</span>
                <span>25</span>
                <span>30</span>
                <span>35</span>
                <span>40</span>
              </div>
            </div>
          </div>

          {/* Your Goals */}
          <div className="card p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black">Your Goals</h3>
              <button onClick={() => setActiveTab('profile')} className="text-xs font-bold text-primary">Edit Goals</button>
            </div>
            <div className="space-y-6">
              <GoalProgress 
                label="Weight Goal" 
                current={weightLog.length > 0 ? weightLog[weightLog.length - 1].weight : userProfile.weight} 
                target={userProfile.targetWeight} 
                unit={userProfile.weightUnit}
                type="weight"
              />
              <GoalProgress 
                label="Workout Frequency" 
                current={weeklyActivity.filter(d => d.totalCals > 0).length} 
                target={userProfile.recommendedWorkouts} 
                unit="days"
                type="frequency"
                history={weeklyActivity.map(d => d.totalCals > 0)}
              />
              <GoalProgress 
                label="Water Goal" 
                current={weeklyActivity.filter(d => {
                  const log = mealHistory[d.date];
                  return log && log.water >= userProfile.waterGoal;
                }).length} 
                target={7} 
                unit="days"
                type="count"
              />
            </div>
          </div>

          {/* Performance Insights */}
          <div className="card p-8 space-y-6 bg-primary/5 border-primary/10">
            <h3 className="text-xl font-black flex items-center gap-2"><Lightbulb className="w-6 h-6 text-primary" /> Weekly Insights</h3>
            <div className="space-y-4">
              {getInsights().map((insight, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <p className="text-sm text-gray-600 leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="card p-8 space-y-8">
        <h3 className="text-xl font-black">Today's Schedule</h3>
        {workoutPlan ? (
          <div className="relative pl-8 space-y-8 border-l-2 border-gray-100">
            {/* Current Time Indicator */}
            <div 
              className="absolute left-[-2px] right-0 h-0.5 bg-red-500 z-10" 
              style={{ top: `${((new Date().getHours() * 60 + new Date().getMinutes()) / (24 * 60)) * 100}%` }}
            >
              <div className="absolute left-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
            </div>

            <TimelineItem 
              time="07:00 AM" 
              label="Morning Workout" 
              desc={`${workoutPlan.weekPlan[new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof WorkoutPlan['weekPlan']].type} • ${workoutPlan.weekPlan[new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof WorkoutPlan['weekPlan']].duration} min`}
              completed={todayWorkouts.length > 0}
            />
            <TimelineItem 
              time="08:30 AM" 
              label="Breakfast" 
              desc={`Target: ${Math.round(userProfile.dailyCalories * 0.25)} kcal`}
              completed={todayMeals.breakfast.length > 0}
            />
            <TimelineItem 
              time="12:30 PM" 
              label="Lunch" 
              desc={`Target: ${Math.round(userProfile.dailyCalories * 0.35)} kcal`}
              completed={todayMeals.lunch.length > 0}
            />
            <TimelineItem 
              time="05:00 PM" 
              label="Evening Walk" 
              desc="30 min • 150 kcal"
              completed={false}
            />
            <TimelineItem 
              time="07:30 PM" 
              label="Dinner" 
              desc={`Target: ${Math.round(userProfile.dailyCalories * 0.30)} kcal`}
              completed={todayMeals.dinner.length > 0}
            />
            <TimelineItem 
              time={userProfile.bedtime} 
              label="Bedtime" 
              desc="Rest & Recovery"
              completed={false}
            />
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
            <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-bold text-sm">No workout plan found.</p>
            <button onClick={() => setActiveTab('workouts')} className="mt-4 text-primary font-bold text-sm">Generate your plan in the Workouts tab</button>
          </div>
        )}
      </div>

      {/* Quick Actions Floating Bar */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-2 flex gap-2 z-50">
        <QuickActionButton icon={<Utensils className="w-5 h-5" />} onClick={() => setActiveTab('meals')} label="Log Meal" />
        <QuickActionButton icon={<Dumbbell className="w-5 h-5" />} onClick={() => setActiveTab('workouts')} label="Start Workout" />
        <QuickActionButton icon={<Scale className="w-5 h-5" />} onClick={() => setIsWeightModalOpen(true)} label="Log Weight" />
        <QuickActionButton icon={<Droplets className="w-5 h-5" />} onClick={handleQuickWater} label="Log Water" />
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-40 left-1/2 bg-secondary text-white px-6 py-3 rounded-2xl font-bold shadow-2xl z-[60]"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weight Modal */}
      <AnimatePresence>
        {isWeightModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsWeightModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black">Log Weight</h3>
                <button onClick={() => setIsWeightModalOpen(false)} className="p-2 rounded-full bg-gray-100 text-gray-400"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-6">
                    <button onClick={() => setNewWeight(prev => Math.round((prev - 0.1) * 10) / 10)} className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-primary font-black text-xl shadow-sm">-</button>
                    <div className="text-center">
                      <input 
                        type="number" 
                        value={newWeight} 
                        onChange={(e) => setNewWeight(parseFloat(e.target.value))}
                        className="text-5xl font-black text-secondary w-32 text-center bg-transparent outline-none"
                      />
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{userProfile.weightUnit}</p>
                    </div>
                    <button onClick={() => setNewWeight(prev => Math.round((prev + 0.1) * 10) / 10)} className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-primary font-black text-xl shadow-sm">+</button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Date</label>
                    <input type="date" value={weightDate} onChange={(e) => setWeightDate(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-4 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Notes (Optional)</label>
                    <textarea value={weightNote} onChange={(e) => setWeightNote(e.target.value)} placeholder="How are you feeling?" className="w-full bg-gray-50 border-none rounded-xl p-4 outline-none h-24 resize-none" />
                  </div>
                </div>
                <button onClick={handleLogWeight} className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all">Save Weight</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SnapshotCard = ({ icon, label, value, unit, progress, color, badge, onClick }: { icon: ReactNode; label: string; value: string; unit: string; progress: number; color: string; badge?: string; onClick: () => void }) => (
  <button onClick={onClick} className="card p-6 min-w-[160px] flex flex-col items-center text-center gap-4 hover:border-primary/20 transition-all group shrink-0 md:shrink">
    <div className="relative w-16 h-16">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-100" />
        <motion.circle 
          initial={{ strokeDashoffset: 176 }}
          animate={{ strokeDashoffset: 176 * (1 - Math.min(1, progress)) }}
          cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" 
          strokeDasharray={176} 
          className={`${color} transition-all duration-1000`}
          strokeLinecap="round"
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-black text-secondary">{value}</p>
      <p className="text-[10px] font-bold text-gray-400">{unit}</p>
      {badge && <span className={`mt-2 inline-block px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${color.replace('text-', 'bg-')}/10 ${color}`}>{badge}</span>}
    </div>
  </button>
);

const GoalProgress = ({ label, current, target, unit, type, history }: { label: string; current: number; target: number; unit: string; type: 'weight' | 'frequency' | 'count'; history?: boolean[] }) => {
  const progress = type === 'weight' 
    ? Math.min(100, Math.max(0, (current / target) * 100)) // This is simplified, usually weight progress is start -> target
    : (current / target) * 100;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs font-bold text-gray-500">{label}</p>
          <p className="text-sm font-black text-secondary">{current} / {target} {unit}</p>
        </div>
        {progress >= 100 && <CheckCircle2 className="w-5 h-5 text-green-500" />}
      </div>
      
      {type === 'frequency' && history ? (
        <div className="flex justify-between">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${history[i] ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-gray-100 text-gray-400'}`}>
                {history[i] && <Check className="w-3 h-3" />}
              </div>
              <span className="text-[8px] font-bold text-gray-300">{day}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, progress)}%` }}
            className={`h-full rounded-full transition-all duration-1000 ${progress >= 100 ? 'bg-green-500' : 'bg-primary'}`}
          />
        </div>
      )}
    </div>
  );
};

const TimelineItem = ({ time, label, desc, completed }: { time: string; label: string; desc: string; completed: boolean }) => (
  <div className="relative">
    <div className={`absolute left-[-38px] w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 ${completed ? 'bg-green-500' : 'bg-gray-200'}`} />
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-black text-secondary">{label}</p>
        <p className="text-[10px] font-bold text-gray-400">{desc}</p>
      </div>
      <p className="text-[10px] font-bold text-gray-300">{time}</p>
    </div>
  </div>
);

const QuickActionButton = ({ icon, onClick, label }: { icon: ReactNode; onClick: () => void; label: string }) => (
  <button 
    onClick={onClick}
    className="w-12 h-12 rounded-2xl bg-white hover:bg-primary hover:text-white text-gray-500 transition-all flex items-center justify-center group relative"
  >
    {icon}
    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
      {label}
    </span>
  </button>
);



interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const AICoach = ({ userProfile }: { userProfile: UserProfile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) return JSON.parse(saved);
    return [{
      role: 'assistant',
      content: `Hey ${userProfile.name.split(' ')[0]}! I'm FitBit, your personal AI health coach. I can help you with:\n\n- Creating personalized diet plans\n- Suggesting workouts for your goals\n- Answering nutrition questions\n- Sleep and recovery tips\n- Tracking your progress\n- General health advice\n\nJust type anything or tap a quick action below to get started!`,
      timestamp: new Date().toISOString()
    }];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('chatHistory', JSON.stringify(messages.slice(-100)));
  }, [messages]);

  const getContext = () => {
    const today = new Date().toISOString().split('T')[0];
    const mealHistory = JSON.parse(localStorage.getItem('mealHistory') || '{}');
    const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const weightLog = JSON.parse(localStorage.getItem('weightLog') || '[]');

    const todayMeals = mealHistory[today] || {};
    const recentWorkouts = workoutHistory.slice(-3);
    const currentWeight = weightLog.length > 0 ? weightLog[weightLog.length - 1].weight : userProfile.weight;

    let mealList = '';
    ['breakfast', 'morningSnack', 'lunch', 'eveningSnack', 'dinner'].forEach(meal => {
      const items = todayMeals[meal] || [];
      if (items.length > 0) {
        mealList += `${meal}: ${items.map((i: any) => i.name).join(', ')}; `;
      }
    });

    return `LIVE APP DATA FOR TODAY: 
    Current weight: ${currentWeight}${userProfile.weightUnit}. 
    Goal: ${userProfile.goal}. 
    Daily calorie target: ${userProfile.dailyCalories} kcal.
    Dietary preferences: ${userProfile.dietaryPrefs.join(', ') || 'None'}. 
    Allergies: ${userProfile.allergies.join(', ') || 'None'}.
    Meals logged today: ${mealList || 'None yet'}.
    Recent workouts: ${recentWorkouts.map((w: any) => `${w.name} (${w.date})`).join(', ') || 'None'}.`;
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const apiKey = localStorage.getItem('geminiApiKey');
    if (!apiKey) {
      setShowKeyModal(true);
      return;
    }

    const userMsg: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const context = getContext();
      const systemPrompt = `You are FitBit, a friendly and knowledgeable AI health coach inside the HealthifyYou fitness app. Your personality is warm, encouraging, and practical. You help users with diet plans, workout suggestions, nutrition advice, sleep tips, and general wellness guidance. 

Rules:
- Always be encouraging and positive
- Give specific, actionable advice (not vague)
- When suggesting meals, always include estimated calorie counts
- When suggesting workouts, include duration and difficulty level
- Keep responses concise (under 200 words unless the user asks for a detailed plan)
- Use emojis occasionally to keep the tone friendly and approachable
- If asked about medical conditions, always remind the user to consult a doctor
- Personalize every response using the user's profile data provided below

USER PROFILE DATA:
${JSON.stringify(userProfile)}

CURRENT APP DATA:
${context}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser: ${text}`
            }]
          }]
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const aiText = data.candidates[0].content.parts[0].text;
      
      // Artificial delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const aiMsg: ChatMessage = {
        role: 'assistant',
        content: aiText,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      const errMsg: ChatMessage = {
        role: 'assistant',
        content: "Oops, I couldn't process that. Please check your API key or try again.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMarkdown = (text: string) => {
    // Simple markdown-to-HTML
    let html = text
      .replace(/### (.*)/g, '<h3 class="font-bold text-lg mt-2">$1</h3>')
      .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*)\*/g, '<em>$1</em>')
      .replace(/^- (.*)/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/^\d+\. (.*)/gm, '<li class="ml-4 list-decimal">$1</li>')
      .replace(/\n/g, '<br />');
    
    return <div dangerouslySetInnerHTML={{ __html: html }} className="text-sm leading-relaxed" />;
  };

  const exportChat = () => {
    const text = messages.map(m => `[${m.timestamp}] ${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FitBit_Chat_History.txt';
    a.click();
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col bg-gray-50/50 -m-6 p-6">
      <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-200">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h3 className="font-black text-secondary">FitBit</h3>
            <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">AI Health Coach</p>
          </div>
        </div>
        <div className="relative group">
          <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <button onClick={() => { setMessages([]); localStorage.removeItem('chatHistory'); }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 font-bold">Clear Chat History</button>
            <button onClick={exportChat} className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 font-bold">Export Chat as Text</button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pb-4 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-secondary' : 'bg-green-500'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <span className="text-xs">🤖</span>}
            </div>
            <div className="space-y-1">
              <div className={`p-4 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-[#1A1A2E] text-white rounded-2xl rounded-tr-none' 
                  : 'bg-[#E8F5E9] text-secondary rounded-2xl rounded-tl-none border border-green-100'
              }`}>
                {renderMarkdown(msg.content)}
                {msg.content.includes("couldn't process that") && (
                  <button 
                    onClick={() => handleSend(messages[messages.length - 2]?.content)}
                    className="mt-3 px-4 py-2 bg-white text-secondary rounded-xl text-xs font-bold shadow-sm hover:bg-gray-50 transition-all"
                  >
                    Retry
                  </button>
                )}
              </div>
              <p className={`text-[10px] font-bold text-gray-400 ${msg.role === 'user' ? 'text-right' : ''}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <span className="text-xs">🤖</span>
            </div>
            <div className="bg-[#E8F5E9] p-4 rounded-2xl rounded-tl-none border border-green-100 shadow-sm">
              <div className="flex gap-1">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="pt-4 space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            "Create a diet plan for me",
            "Suggest today's workout",
            "Analyze my progress",
            "Give me sleep tips",
            "What should I eat next?",
            "Calculate my macros"
          ].map((chip, i) => (
            <button 
              key={i} 
              onClick={() => handleSend(chip)}
              className="px-4 py-2 rounded-full bg-white border border-gray-100 text-xs font-bold whitespace-nowrap hover:border-primary hover:text-primary transition-all shadow-sm"
            >
              {chip}
            </button>
          ))}
        </div>
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 500))}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask FitBit anything..." 
            className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 pr-24 outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-lg"
          />
          <div className="absolute right-14 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300">
            {input.length}/500
          </div>
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showKeyModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowKeyModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <Key className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-2">Enable AI Coach</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">To enable AI responses, please enter your Gemini API key. You can find this in Profile &gt; Settings later.</p>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Gemini API Key</label>
                  <input 
                    type="password"
                    placeholder="Paste your key here..."
                    className="w-full bg-gray-50 border-none rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    onChange={(e) => localStorage.setItem('geminiApiKey', e.target.value)}
                  />
                </div>
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-xs font-bold text-primary flex items-center gap-1">
                  How to get your API key <ExternalLink className="w-3 h-3" />
                </a>
                <button 
                  onClick={() => setShowKeyModal(false)}
                  className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all"
                >
                  Save & Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Profile = ({ userProfile, onLogout }: { userProfile: UserProfile; onLogout: () => void }) => {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('geminiApiKey') || '');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const testConnection = async () => {
    if (!apiKey) return;
    setTestStatus('testing');
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Hello" }] }]
        })
      });
      const data = await response.json();
      if (data.error) throw new Error();
      setTestStatus('success');
    } catch (err) {
      setTestStatus('error');
    }
  };

  const saveKey = () => {
    localStorage.setItem('geminiApiKey', apiKey);
    setShowKeyModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="card p-8 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-gray-100 mb-4 overflow-hidden border-4 border-white shadow-xl">
          <img src={userProfile.photo} alt="Avatar" referrerPolicy="no-referrer" />
        </div>
        <h2 className="text-2xl font-bold">{userProfile.name}</h2>
        <p className="text-gray-500 text-sm mb-6">Member since {new Date(userProfile.createdAt).getFullYear()}</p>
        <div className="grid grid-cols-4 gap-4 w-full">
          {[
            { label: 'Age', val: new Date().getFullYear() - new Date(userProfile.dob).getFullYear() },
            { label: 'Height', val: `${userProfile.height}${userProfile.heightUnit}` },
            { label: 'Weight', val: `${userProfile.weight}${userProfile.weightUnit}` },
            { label: 'BMI', val: userProfile.bmi },
          ].map((info, i) => (
            <div key={i} className="bg-gray-50 p-3 rounded-xl">
              <p className="text-[10px] text-gray-400 font-bold uppercase">{info.label}</p>
              <p className="text-sm font-bold">{info.val}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-primary" /> My Goals</h3>
        <div className="space-y-4">
          {[
            { label: 'Target Weight', val: `${userProfile.targetWeight} ${userProfile.weightUnit}` },
            { label: 'Daily Calorie Target', val: `${userProfile.dailyCalories} kcal` },
            { label: 'Workout Frequency', val: `${userProfile.recommendedWorkouts} days / week` },
            { label: 'Primary Goal', val: userProfile.goal },
          ].map((g, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-500">{g.label}</span>
              <span className="text-sm font-bold">{g.val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-gray-400" /> Settings</h3>
        <div className="divide-y divide-gray-50">
          <button onClick={() => setShowKeyModal(true)} className="w-full flex justify-between items-center py-4 text-sm hover:text-primary transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Key className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="font-bold">Gemini API Key</p>
                <p className="text-[10px] text-gray-400 uppercase font-bold">{apiKey ? '••••••••••••' : 'Not Configured'}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
          {['Notifications', 'Connected Apps', 'Theme Settings', 'Privacy'].map((s, i) => (
            <button key={i} className="w-full flex justify-between items-center py-4 text-sm hover:text-primary transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                  <Settings className="w-4 h-4" />
                </div>
                <span>{s}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
          ))}
        </div>
      </div>

      <button 
        onClick={onLogout}
        className="w-full card p-4 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-all active:scale-95"
      >
        <LogOut className="w-5 h-5" /> Log Out
      </button>

      <AnimatePresence>
        {showKeyModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowKeyModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black">Gemini API Key</h3>
                <button onClick={() => setShowKeyModal(false)} className="p-2 rounded-full bg-gray-100 text-gray-400"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">API Key</label>
                  <input 
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Paste your key here..."
                    className="w-full bg-gray-50 border-none rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={testConnection}
                    disabled={!apiKey || testStatus === 'testing'}
                    className={`flex-1 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      testStatus === 'success' ? 'bg-green-50 text-green-600' :
                      testStatus === 'error' ? 'bg-red-50 text-red-600' :
                      'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {testStatus === 'testing' ? 'Testing...' : 
                     testStatus === 'success' ? <><Check className="w-4 h-4" /> Valid</> :
                     testStatus === 'error' ? <><X className="w-4 h-4" /> Invalid</> :
                     'Test Connection'}
                  </button>
                  <button 
                    onClick={saveKey}
                    className="flex-1 bg-primary text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all"
                  >
                    Save Key
                  </button>
                </div>

                <div className="p-4 bg-blue-50 rounded-2xl">
                  <p className="text-xs text-blue-600 leading-relaxed">
                    <strong>How to get your API key:</strong><br />
                    1. Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline">aistudio.google.com</a><br />
                    2. Click "Get API Key"<br />
                    3. Click "Create API Key"
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Onboarding = ({ user, onComplete }: { user: any; onComplete: (profile: UserProfile) => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: user.name,
    email: user.email,
    photo: user.photo,
    weightUnit: 'kg',
    heightUnit: 'cm',
    dietaryPrefs: [],
    allergies: [],
    bedtime: '22:00',
    wakeTime: '07:00',
    waterGoal: 2,
  });

  const calculateBMI = (w: number, h: number, wUnit: string, hUnit: string) => {
    let weightKg = wUnit === 'lbs' ? w * 0.453592 : w;
    let heightCm = hUnit === 'ft' ? h * 30.48 : h;
    const bmi = weightKg / ((heightCm / 100) ** 2);
    let category = 'Normal';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';
    return { bmi: parseFloat(bmi.toFixed(1)), category };
  };

  const calculateCalories = () => {
    const age = new Date().getFullYear() - new Date(formData.dob || '').getFullYear();
    const weightKg = formData.weightUnit === 'lbs' ? (formData.weight || 0) * 0.453592 : (formData.weight || 0);
    const heightCm = formData.heightUnit === 'ft' ? (formData.height || 0) * 30.48 : (formData.height || 0);
    
    let bmr = 0;
    if (formData.gender === 'Male') {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
    } else {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
    }

    const factors: Record<string, number> = {
      'Sedentary': 1.2,
      'Lightly Active': 1.375,
      'Moderately Active': 1.55,
      'Very Active': 1.725,
      'Athlete': 1.9
    };

    let calories = bmr * (factors[formData.activityLevel || 'Sedentary']);
    if (formData.goal === 'Lose Weight') calories -= 500;
    if (formData.goal === 'Gain Weight') calories += 500;

    return Math.round(calories);
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleComplete = () => {
    const { bmi, category } = calculateBMI(formData.weight || 0, formData.height || 0, formData.weightUnit || 'kg', formData.heightUnit || 'cm');
    const calories = calculateCalories();
    const finalProfile: UserProfile = {
      ...formData,
      bmi,
      bmiCategory: category,
      dailyCalories: calories,
      recommendedWorkouts: formData.goal === 'Build Muscle' ? 5 : 3,
      createdAt: new Date().toISOString(),
    } as UserProfile;
    onComplete(finalProfile);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-primary/20 overflow-hidden">
                <img src={formData.photo} alt="Profile" referrerPolicy="no-referrer" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome, {formData.name?.split(' ')[0]}!</h2>
              <p className="text-gray-500">Let's start with some basics.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name || ''} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Date of Birth</label>
                  <input 
                    type="date" 
                    value={formData.dob || ''}
                    onChange={e => setFormData({...formData, dob: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Gender</label>
                  <select 
                    value={formData.gender || ''}
                    onChange={e => setFormData({...formData, gender: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>
            <button 
              disabled={!formData.dob || !formData.gender}
              onClick={nextStep}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 disabled:opacity-50 transition-all"
            >
              Next Step
            </button>
          </div>
        );
      case 2:
        const { bmi, category } = calculateBMI(formData.weight || 0, formData.height || 0, formData.weightUnit || 'kg', formData.heightUnit || 'cm');
        const bmiColors: Record<string, string> = {
          'Underweight': 'bg-blue-500',
          'Normal': 'bg-green-500',
          'Overweight': 'bg-yellow-500',
          'Obese': 'bg-red-500'
        };
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Body Metrics</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-400 uppercase">Weight</label>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    {['kg', 'lbs'].map(u => (
                      <button 
                        key={u}
                        onClick={() => setFormData({...formData, weightUnit: u as any})}
                        className={`px-2 py-1 text-[10px] font-bold rounded-md ${formData.weightUnit === u ? 'bg-white shadow-sm' : 'text-gray-400'}`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
                <input 
                  type="number" 
                  placeholder="0"
                  value={formData.weight || ''}
                  onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-400 uppercase">Height</label>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    {['cm', 'ft'].map(u => (
                      <button 
                        key={u}
                        onClick={() => setFormData({...formData, heightUnit: u as any})}
                        className={`px-2 py-1 text-[10px] font-bold rounded-md ${formData.heightUnit === u ? 'bg-white shadow-sm' : 'text-gray-400'}`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
                <input 
                  type="number" 
                  placeholder="0"
                  value={formData.height || ''}
                  onChange={e => setFormData({...formData, height: parseFloat(e.target.value)})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {formData.weight && formData.height ? (
              <div className="card p-6 bg-gray-50 border-none text-center">
                <p className="text-sm text-gray-500 mb-1">Your Calculated BMI</p>
                <p className="text-4xl font-black mb-2">{bmi}</p>
                <span className={`${bmiColors[category]} text-white text-xs font-bold px-3 py-1 rounded-full`}>{category}</span>
              </div>
            ) : null}

            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 uppercase">Body Type</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'Ectomorph', label: 'Lean', icon: '🏃' },
                  { id: 'Mesomorph', label: 'Muscular', icon: '💪' },
                  { id: 'Endomorph', label: 'Stocky', icon: '🏋️' },
                ].map(t => (
                  <button 
                    key={t.id}
                    onClick={() => setFormData({...formData, bodyType: t.id})}
                    className={`p-4 rounded-xl border-2 transition-all ${formData.bodyType === t.id ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white'}`}
                  >
                    <div className="text-2xl mb-1">{t.icon}</div>
                    <div className="text-[10px] font-bold uppercase">{t.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={prevStep} className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-xl font-bold">Back</button>
              <button 
                disabled={!formData.weight || !formData.height || !formData.bodyType}
                onClick={nextStep} 
                className="flex-[2] bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                Next Step
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Fitness Goals</h2>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'Lose Weight', label: 'Lose Weight', icon: '📉' },
                { id: 'Build Muscle', label: 'Build Muscle', icon: '💪' },
                { id: 'Stay Fit', label: 'Stay Fit & Healthy', icon: '❤️' },
                { id: 'Endurance', label: 'Improve Endurance', icon: '🏃' },
                { id: 'Gain Weight', label: 'Gain Weight', icon: '📈' },
              ].map(g => (
                <button 
                  key={g.id}
                  onClick={() => setFormData({...formData, goal: g.id})}
                  className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${formData.goal === g.id ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white'}`}
                >
                  <span className="text-2xl">{g.icon}</span>
                  <span className="font-bold">{g.label}</span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Target Weight ({formData.weightUnit})</label>
                <input 
                  type="number" 
                  value={formData.targetWeight || ''}
                  onChange={e => setFormData({...formData, targetWeight: parseFloat(e.target.value)})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Timeline</label>
                <select 
                  value={formData.timeline || ''}
                  onChange={e => setFormData({...formData, timeline: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select</option>
                  <option value="1 month">1 Month</option>
                  <option value="3 months">3 Months</option>
                  <option value="6 months">6 Months</option>
                  <option value="1 year">1 Year</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={prevStep} className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-xl font-bold">Back</button>
              <button 
                disabled={!formData.goal || !formData.targetWeight || !formData.timeline}
                onClick={nextStep} 
                className="flex-[2] bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                Next Step
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide">
            <h2 className="text-2xl font-bold text-center">Lifestyle</h2>
            
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 uppercase">Activity Level</label>
              <div className="space-y-2">
                {[
                  { id: 'Sedentary', desc: 'Desk job, little exercise' },
                  { id: 'Lightly Active', desc: 'Light exercise 1-3 days' },
                  { id: 'Moderately Active', desc: 'Moderate exercise 3-5 days' },
                  { id: 'Very Active', desc: 'Hard exercise 6-7 days' },
                  { id: 'Athlete', desc: 'Intense training, physical job' },
                ].map(a => (
                  <button 
                    key={a.id}
                    onClick={() => setFormData({...formData, activityLevel: a.id})}
                    className={`w-full p-3 rounded-xl border-2 text-left transition-all ${formData.activityLevel === a.id ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white'}`}
                  >
                    <div className="font-bold text-sm">{a.id}</div>
                    <div className="text-[10px] text-gray-500">{a.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 uppercase">Dietary Preference</label>
              <div className="flex flex-wrap gap-2">
                {['No Preference', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Mediterranean', 'Gluten-Free'].map(d => (
                  <button 
                    key={d}
                    onClick={() => {
                      const current = formData.dietaryPrefs || [];
                      setFormData({...formData, dietaryPrefs: current.includes(d) ? current.filter(x => x !== d) : [...current, d]});
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${formData.dietaryPrefs?.includes(d) ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Bedtime</label>
                <input type="time" value={formData.bedtime || ''} onChange={e => setFormData({...formData, bedtime: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Wake time</label>
                <input type="time" value={formData.wakeTime || ''} onChange={e => setFormData({...formData, wakeTime: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs font-bold text-gray-400 uppercase">Water Goal</label>
                <span className="text-sm font-bold text-primary">{formData.waterGoal}L</span>
              </div>
              <input 
                type="range" min="1" max="5" step="0.5" 
                value={formData.waterGoal}
                onChange={e => setFormData({...formData, waterGoal: parseFloat(e.target.value)})}
                className="w-full accent-primary" 
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button onClick={prevStep} className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-xl font-bold">Back</button>
              <button 
                disabled={!formData.activityLevel}
                onClick={nextStep} 
                className="flex-[2] bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                Next Step
              </button>
            </div>
          </div>
        );
      case 5:
        const calories = calculateCalories();
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Your Journey Starts!</h2>
            <div className="card p-6 bg-primary/5 border-primary/20 space-y-4">
              <div className="flex items-center gap-4 border-b border-primary/10 pb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img src={formData.photo} alt="Profile" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <p className="font-bold">{formData.name}</p>
                  <p className="text-xs text-gray-500">{formData.goal} • {formData.timeline}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-xl shadow-sm">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Daily Target</p>
                  <p className="text-xl font-black text-primary">{calories} <span className="text-xs font-bold">kcal</span></p>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-sm">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Workouts</p>
                  <p className="text-xl font-black text-secondary">{formData.goal === 'Build Muscle' ? 5 : 3} <span className="text-xs font-bold">/ week</span></p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed italic">
                "Based on your {formData.bodyType} body type and {formData.activityLevel.toLowerCase()} lifestyle, we've optimized your plan to help you {formData.goal.toLowerCase()} effectively."
              </p>
            </div>
            <div className="flex gap-4">
              <button onClick={prevStep} className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-xl font-bold">Back</button>
              <button 
                onClick={handleComplete} 
                className="flex-[2] bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
              >
                Start My Journey ✨
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="card p-8 w-full max-w-lg shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 h-1 bg-primary transition-all duration-500" style={{ width: `${(step / 5) * 100}%` }} />
        <div className="flex justify-between items-center mb-8">
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">Step {step} of 5</span>
          <div className="flex gap-1">
            {[1,2,3,4,5].map(s => (
              <div key={s} className={`w-2 h-2 rounded-full ${s <= step ? 'bg-primary' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>
        {renderStep()}
      </motion.div>
    </div>
  );
};

const Login = ({ onLogin }: { onLogin: (user: { name: string; email: string; photo: string }) => void }) => {
  const clientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    /* global google */
    if ((window as any).google && clientId) {
      (window as any).google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });
      (window as any).google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        { theme: "outline", size: "large", width: "100%" }
      );
    }
  }, [clientId]);

  const handleCredentialResponse = (response: any) => {
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    onLogin({
      name: payload.name,
      email: payload.email,
      photo: payload.picture
    });
  };

  const handleGuestLogin = () => {
    onLogin({
      name: "Guest User",
      email: "guest@healthifyyou.com",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-login-gradient relative overflow-hidden">
      {/* Floating Emojis */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 text-4xl animate-float">🍎</div>
        <div className="absolute top-1/3 right-1/4 text-4xl animate-float" style={{ animationDelay: '1s' }}>💪</div>
        <div className="absolute bottom-1/4 left-1/3 text-4xl animate-float" style={{ animationDelay: '2s' }}>🏃</div>
        <div className="absolute bottom-1/3 right-1/3 text-4xl animate-float" style={{ animationDelay: '1.5s' }}>🥗</div>
        <div className="absolute top-1/2 left-1/10 text-4xl animate-float" style={{ animationDelay: '0.5s' }}>💧</div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl p-10 w-full max-w-md text-center rounded-[24px] border border-white/20 shadow-2xl"
      >
        <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-primary/30">
          <Zap className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-black mb-2 text-white">Healthify<span className="text-primary">You</span></h1>
        <p className="text-white/60 mb-8 font-medium">Your AI Health Companion</p>
        
        <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/10">
          <p className="text-white/80 text-sm mb-4 font-bold">Choose your way to start:</p>
          <div className="space-y-4">
            {clientId ? (
              <div id="googleBtn" className="w-full flex justify-center"></div>
            ) : (
              <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-200 text-xs text-left">
                <p className="font-bold mb-1">💡 Google Login Tip</p>
                <p>Add your <strong>VITE_GOOGLE_CLIENT_ID</strong> to Settings to enable Google Sign-In.</p>
              </div>
            )}
            
            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">OR</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            <button 
              onClick={handleGuestLogin}
              className="w-full bg-primary/20 hover:bg-primary/30 text-primary py-4 rounded-xl font-bold border border-primary/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              ✨ Welcome as Guest
            </button>
          </div>
        </div>
        
        <p className="mt-10 text-xs text-white/40 leading-relaxed">
          By signing in, you agree to our <br />
          <span className="text-white/60 underline cursor-pointer">Terms of Service</span> & <span className="text-white/60 underline cursor-pointer">Privacy Policy</span>
        </p>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [authState, setAuthState] = useState<{ token: string | null; user: any | null }>({
    token: localStorage.getItem('authToken'),
    user: JSON.parse(localStorage.getItem('authUser') || 'null')
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(
    JSON.parse(localStorage.getItem('userProfile') || 'null')
  );
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const handleLogin = (user: any) => {
    const token = 'mock_token_' + Math.random();
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(user));
    setAuthState({ token, user });
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setUserProfile(profile);
  };

  const handleLogout = () => {
    localStorage.clear();
    setAuthState({ token: null, user: null });
    setUserProfile(null);
  };

  if (!authState.token) {
    return <Login onLogin={handleLogin} />;
  }

  if (!userProfile) {
    return <Onboarding user={authState.user} onComplete={handleOnboardingComplete} />;
  }

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'workouts', icon: Dumbbell, label: 'Workouts' },
    { id: 'meals', icon: Utensils, label: 'Meals' },
    { id: 'coach', icon: MessageSquare, label: 'AI Coach' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <Dumbbell className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Healthify<span className="text-primary">You</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all mt-auto"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 pb-24 md:pb-6 max-w-5xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && <Dashboard userProfile={userProfile} setActiveTab={setActiveTab} />}
            {activeTab === 'workouts' && <WorkoutsTab userProfile={userProfile} />}
            {activeTab === 'meals' && <MealsTab userProfile={userProfile} />}
            {activeTab === 'coach' && <AICoach userProfile={userProfile} />}
            {activeTab === 'profile' && <Profile userProfile={userProfile} onLogout={handleLogout} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as Tab)}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === item.id ? 'text-primary' : 'text-gray-300'}`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
