import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Palette,
  BookOpen,
  DollarSign,
  Users,
  Home,
  Megaphone,
  Music,
  Image,
  Building,
  Trophy,
  Plane,
  Sparkles,
  Briefcase,
  BriefcaseBusiness,
  GraduationCap,
  Utensils,
  Laugh,
  Stethoscope,
  Leaf,
  Vote,
  Church,
  Cpu,
  Dice5,
  FileText,
  Gamepad2,
  Scale,
  Quote,
  Newspaper,
  ShoppingBag,
  Send,
  Film,
  Box,
  Brain,
  Share2,
  Bus,
  Heart,
  Globe,
  ArrowRight,
  LayoutGrid,
  Coins,
  Landmark,
  type LucideIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useHomeCategories } from "@/hooks/useHomeCategories";
import { useHomeCountries } from "@/hooks/useHomeCountries";
import type { HomeCategory } from "@/services/homeApi";

const fallbackCategories: HomeCategory[] = [
  { slug: "art-design", name: "Art & Design", icon: "palette", channels_count: 62800 },
  { slug: "beauty", name: "Beauty", icon: "sparkles", channels_count: 65200 },
  { slug: "betting-casino", name: "Betting and Casino", icon: "dice-5", channels_count: 145500 },
  { slug: "blogs", name: "Blogs", icon: "file-text", channels_count: 127500 },
  { slug: "books", name: "Books", icon: "book-open", channels_count: 35300 },
  { slug: "business", name: "Business", icon: "briefcase-business", channels_count: 80800 },
  { slug: "career", name: "Career", icon: "users", channels_count: 18400 },
  { slug: "cryptocurrencies", name: "Cryptocurrencies", icon: "coins", channels_count: 58900 },
  { slug: "economy-and-finance", name: "Economy & Finance", icon: "landmark", channels_count: 76800 },
  { slug: "education", name: "Education", icon: "graduation-cap", channels_count: 141700 },
  { slug: "games", name: "Games", icon: "gamepad-2", channels_count: 93800 },
  { slug: "facts", name: "Facts", icon: "file-text", channels_count: 8900 },
  { slug: "family-and-children", name: "Family & Children", icon: "users", channels_count: 20000 },
  { slug: "food-and-drinks", name: "Food & Drinks", icon: "utensils", channels_count: 27500 },
  { slug: "healthy-lifestyle", name: "Healthy Lifestyle", icon: "heart", channels_count: 28400 },
  { slug: "home-and-architecture", name: "Home & Architecture", icon: "home", channels_count: 13900 },
  { slug: "humor-and-entertainment", name: "Humor & Entertainment", icon: "laugh", channels_count: 47600 },
  { slug: "law", name: "Law", icon: "scale", channels_count: 8100 },
  { slug: "linguistics", name: "Linguistics", icon: "book-open", channels_count: 7400 },
  { slug: "marketing-and-pr", name: "Marketing & PR", icon: "megaphone", channels_count: 11200 },
  { slug: "medicine", name: "Medicine", icon: "stethoscope", channels_count: 29400 },
  { slug: "motivation-and-quotes", name: "Motivation & Quotes", icon: "quote", channels_count: 29300 },
  { slug: "movies", name: "Movies", icon: "film", channels_count: 124600 },
  { slug: "music", name: "Music", icon: "music", channels_count: 85600 },
  { slug: "nature-and-animals", name: "Nature & Animals", icon: "leaf", channels_count: 21000 },
  { slug: "news-and-media", name: "News & Media", icon: "newspaper", channels_count: 72500 },
  { slug: "other", name: "Other", icon: "box", channels_count: 31 },
  { slug: "pictures", name: "Pictures", icon: "image", channels_count: 10800 },
  { slug: "politics", name: "Politics", icon: "vote", channels_count: 36100 },
  { slug: "psychology", name: "Psychology", icon: "brain", channels_count: 35200 },
  { slug: "real-estate", name: "Real Estate", icon: "building", channels_count: 20200 },
  { slug: "religion-and-spirituality", name: "Religion & Spirituality", icon: "church", channels_count: 138000 },
  { slug: "sales", name: "Sales", icon: "shopping-bag", channels_count: 53600 },
  { slug: "social-networks", name: "Social Networks", icon: "share-2", channels_count: 16100 },
  { slug: "sports", name: "Sports", icon: "trophy", channels_count: 42900 },
  { slug: "technologies", name: "Technologies", icon: "cpu", channels_count: 63700 },
  { slug: "telegram", name: "Telegram", icon: "send", channels_count: 2800 },
  { slug: "transport", name: "Transport", icon: "bus", channels_count: 28700 },
  { slug: "travel", name: "Travel", icon: "plane", channels_count: 24100 },
];

const iconsByName: Record<string, LucideIcon> = {
  Palette,
  Sparkles,
  Dice5,
  FileText,
  BookOpen,
  Briefcase,
  BriefcaseBusiness,
  Users,
  DollarSign,
  Coins,
  Landmark,
  GraduationCap,
  Gamepad2,
  Utensils,
  Heart,
  Home,
  Laugh,
  Scale,
  Megaphone,
  Stethoscope,
  Quote,
  Film,
  Music,
  Leaf,
  Newspaper,
  Box,
  Image,
  Vote,
  Brain,
  Building,
  Church,
  ShoppingBag,
  Share2,
  Trophy,
  Cpu,
  Send,
  Bus,
  Plane,
};

function toPascalCase(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function resolveCategoryIcon(icon: string): LucideIcon {
  const iconName = toPascalCase(icon);
  return iconsByName[iconName] ?? LayoutGrid;
}

function formatCompactCount(value: number) {
  const abs = Math.abs(value);

  if (abs >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}b`;
  }

  if (abs >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`;
  }

  if (abs >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  }

  return String(value);
}

function CategoriesSkeleton() {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-3"
      data-testid="home-categories-skeleton"
    >
      {Array.from({ length: 16 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between py-1">
          <span className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-sm" />
            <Skeleton className="h-4 w-28" />
          </span>
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  );
}

function CountriesSkeleton() {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-2"
      data-testid="home-countries-skeleton"
    >
      {Array.from({ length: 16 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between py-1">
          <span className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-sm" />
            <Skeleton className="h-4 w-24" />
          </span>
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  );
}

const fallbackCountries = [
  { name: "Afghanistan", count: "10", flag: "🇦🇫" },
  { name: "Algeria", count: "8", flag: "🇩🇿" },
  { name: "Argentina", count: "2.0k", flag: "🇦🇷" },
  { name: "Armenia", count: "3.6k", flag: "🇦🇲" },
  { name: "Australia", count: "7", flag: "🇦🇺" },
  { name: "Austria", count: "89", flag: "🇦🇹" },
  { name: "Azerbaijan", count: "3.6k", flag: "🇦🇿" },
  { name: "Bangladesh", count: "25.7k", flag: "🇧🇩" },
  { name: "Belarus", count: "4.4k", flag: "🇧🇾" },
  { name: "Bolivia", count: "61", flag: "🇧🇴" },
  { name: "Brazil", count: "35.6k", flag: "🇧🇷" },
  { name: "Bulgaria", count: "26", flag: "🇧🇬" },
  { name: "Cambodia", count: "8.7k", flag: "🇰🇭" },
  { name: "Cameroon", count: "437", flag: "🇨🇲" },
  { name: "Canada", count: "9", flag: "🇨🇦" },
  { name: "Chile", count: "372", flag: "🇨🇱" },
  { name: "China", count: "179.1k", flag: "🇨🇳" },
  { name: "Colombia", count: "2.1k", flag: "🇨🇴" },
  { name: "Costa Rica", count: "58", flag: "🇨🇷" },
  { name: "Czech Republic", count: "657", flag: "🇨🇿" },
  { name: "Ecuador", count: "706", flag: "🇪🇨" },
  { name: "Egypt", count: "18.7k", flag: "🇪🇬" },
  { name: "Estonia", count: "5", flag: "🇪🇪" },
  { name: "Ethiopia", count: "20.7k", flag: "🇪🇹" },
  { name: "Finland", count: "1.9k", flag: "🇫🇮" },
  { name: "France", count: "19.6k", flag: "🇫🇷" },
  { name: "Georgia", count: "1.2k", flag: "🇬🇪" },
  { name: "Germany", count: "9.4k", flag: "🇩🇪" },
  { name: "Greece", count: "385", flag: "🇬🇷" },
  { name: "Guatemala", count: "61", flag: "🇬🇹" },
  { name: "Haiti", count: "9", flag: "🇭🇹" },
  { name: "India", count: "235.5k", flag: "🇮🇳" },
  { name: "Indonesia", count: "50.0k", flag: "🇮🇩" },
  { name: "Iran", count: "271.0k", flag: "🇮🇷" },
  { name: "Iraq", count: "127.1k", flag: "🇮🇶" },
  { name: "Israel", count: "3.6k", flag: "🇮🇱" },
  { name: "Italy", count: "16.4k", flag: "🇮🇹" },
  { name: "Japan", count: "4.9k", flag: "🇯🇵" },
  { name: "Jordan", count: "4", flag: "🇯🇴" },
  { name: "Kazakhstan", count: "7.2k", flag: "🇰🇿" },
  { name: "Kenya", count: "13", flag: "🇰🇪" },
  { name: "Korea", count: "5.6k", flag: "🇰🇷" },
  { name: "Kyrgyzstan", count: "2.7k", flag: "🇰🇬" },
  { name: "Latvia", count: "221", flag: "🇱🇻" },
  { name: "Lebanon", count: "4", flag: "🇱🇧" },
  { name: "Libya", count: "6", flag: "🇱🇾" },
  { name: "Lithuania", count: "199", flag: "🇱🇹" },
  { name: "Malaysia", count: "26.5k", flag: "🇲🇾" },
  { name: "Mexico", count: "3.7k", flag: "🇲🇽" },
  { name: "Moldova", count: "889", flag: "🇲🇩" },
  { name: "Mongolia", count: "3", flag: "🇲🇳" },
  { name: "Morocco", count: "5", flag: "🇲🇦" },
  { name: "Myanmar", count: "49.1k", flag: "🇲🇲" },
  { name: "Netherlands", count: "828", flag: "🇳🇱" },
  { name: "Nigeria", count: "6.5k", flag: "🇳🇬" },
  { name: "Oman", count: "2", flag: "🇴🇲" },
  { name: "Pakistan", count: "14", flag: "🇵🇰" },
  { name: "Palestine", count: "4", flag: "🇵🇸" },
  { name: "Panama", count: "20", flag: "🇵🇦" },
  { name: "Paraguay", count: "54", flag: "🇵🇾" },
  { name: "Peru", count: "1.6k", flag: "🇵🇪" },
  { name: "Philippines", count: "4.6k", flag: "🇵🇭" },
  { name: "Poland", count: "2.9k", flag: "🇵🇱" },
  { name: "Portugal", count: "1.5k", flag: "🇵🇹" },
  { name: "Puerto Rico", count: "28", flag: "🇵🇷" },
  { name: "Romania", count: "817", flag: "🇷🇴" },
  { name: "Russia", count: "856.2k", flag: "🇷🇺" },
  { name: "Saudi Arabia", count: "66.4k", flag: "🇸🇦" },
];

export function CatalogShowcase() {
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useHomeCategories(50);
  const {
    data: countriesData,
    isLoading: isCountriesLoading,
    isError: isCountriesError,
  } = useHomeCountries(50);

  const categories = categoriesData?.data?.length
    ? categoriesData.data
    : isCategoriesError
      ? fallbackCategories
      : [];
  const countries = countriesData?.data?.length
    ? countriesData.data.map((country) => ({
        name: country.name,
        count: formatCompactCount(country.channels_count),
        flag: country.flag_emoji,
      }))
    : isCountriesError
      ? fallbackCountries
      : [];

  return (
    <section className="py-16 bg-background">
      <div className="container space-y-12">
        {/* Categories Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-xl shadow-card p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <LayoutGrid className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">Categories</h2>
          </div>
          {isCategoriesLoading && !((categoriesData as any)?.data?.length) && <CategoriesSkeleton />}

          {!isCategoriesLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-3">
              {categories.map((category, index) => {
                const Icon = resolveCategoryIcon(category.icon);
                return (
                  <motion.div
                    key={category.slug}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.01 }}
                  >
                    <Link
                      to="/catalog"
                      className="flex items-center justify-between py-1 hover:text-primary transition-colors group"
                    >
                      <span className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-primary">
                        <Icon className="w-4 h-4" />
                        {category.name}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {formatCompactCount(category.channels_count)}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Countries Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl shadow-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold text-foreground">Countries</h2>
            </div>
            <Link
              to="/rankings"
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              Market overview
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {isCountriesLoading && !((countriesData as any)?.data?.length) && <CountriesSkeleton />}
          {!isCountriesLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-2">
              {countries.map((country, index) => (
                <motion.div
                  key={country.name}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.005 }}
                >
                  <Link
                    to="/catalog"
                    className="flex items-center justify-between py-1 hover:text-primary transition-colors group"
                  >
                    <span className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-primary">
                      <span className="text-base">{country.flag}</span>
                      {country.name}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {country.count}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
