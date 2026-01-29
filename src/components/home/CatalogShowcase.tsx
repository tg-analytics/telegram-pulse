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
  Ban,
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
} from "lucide-react";

const categories = [
  { name: "Art & Design", count: "62.8k", icon: Palette },
  { name: "Beauty", count: "65.2k", icon: Sparkles },
  { name: "Betting and Casino", count: "145.5k", icon: Dice5 },
  { name: "Blogs", count: "127.5k", icon: FileText },
  { name: "Books", count: "35.3k", icon: BookOpen },
  { name: "Business", count: "80.8k", icon: Briefcase },
  { name: "Career", count: "18.4k", icon: Users },
  { name: "Cryptocurrencies", count: "58.9k", icon: DollarSign },
  { name: "Economy & Finance", count: "76.8k", icon: DollarSign },
  { name: "Education", count: "141.7k", icon: GraduationCap },
  { name: "Games", count: "93.8k", icon: Gamepad2 },
  { name: "Facts", count: "8.9k", icon: FileText },
  { name: "Family & Children", count: "20.0k", icon: Users },
  { name: "Food & Drinks", count: "27.5k", icon: Utensils },
  { name: "Healthy Lifestyle", count: "28.4k", icon: Heart },
  { name: "Home & Architecture", count: "13.9k", icon: Home },
  { name: "Humor & Entertainment", count: "47.6k", icon: Laugh },
  { name: "Law", count: "8.1k", icon: Scale },
  { name: "Linguistics", count: "7.4k", icon: BookOpen },
  { name: "Marketing & PR", count: "11.2k", icon: Megaphone },
  { name: "Medicine", count: "29.4k", icon: Stethoscope },
  { name: "Motivation & Quotes", count: "29.3k", icon: Quote },
  { name: "Movies", count: "124.6k", icon: Film },
  { name: "Music", count: "85.6k", icon: Music },
  { name: "Nature & Animals", count: "21.0k", icon: Leaf },
  { name: "News & Media", count: "72.5k", icon: Newspaper },
  { name: "Other", count: "31", icon: Box },
  { name: "Pictures", count: "10.8k", icon: Image },
  { name: "Politics", count: "36.1k", icon: Vote },
  { name: "Psychology", count: "35.2k", icon: Brain },
  { name: "Real Estate", count: "20.2k", icon: Building },
  { name: "Religion & Spirituality", count: "138.0k", icon: Church },
  { name: "Sales", count: "53.6k", icon: ShoppingBag },
  { name: "Social Networks", count: "16.1k", icon: Share2 },
  { name: "Sports", count: "42.9k", icon: Trophy },
  { name: "Technologies", count: "63.7k", icon: Cpu },
  { name: "Telegram", count: "2.8k", icon: Send },
  { name: "Transport", count: "28.7k", icon: Bus },
  { name: "Travel", count: "24.1k", icon: Plane },
];

const countries = [
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-3">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.name}
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
                      {category.count}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
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
        </motion.div>
      </div>
    </section>
  );
}
