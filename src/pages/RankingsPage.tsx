import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Users,
  Globe,
  Tag,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const countryRankings = [
  { rank: 1, name: "Tech News Daily", country: "USA", subscribers: "2.1M", growth: "+8.2%" },
  { rank: 2, name: "Crypto Insights", country: "USA", subscribers: "1.8M", growth: "+12.4%" },
  { rank: 3, name: "News Breaking", country: "USA", subscribers: "1.5M", growth: "+5.1%" },
  { rank: 4, name: "Gaming Universe", country: "USA", subscribers: "1.2M", growth: "+9.8%" },
  { rank: 5, name: "Marketing Pro", country: "USA", subscribers: "980K", growth: "+7.3%" },
];

const categoryRankings = [
  { rank: 1, name: "Tech News Daily", category: "Technology", subscribers: "2.1M", er: "4.8%" },
  { rank: 2, name: "AI Weekly", category: "Technology", subscribers: "1.4M", er: "5.2%" },
  { rank: 3, name: "Dev Community", category: "Technology", subscribers: "890K", er: "6.1%" },
  { rank: 4, name: "Startup Hub", category: "Technology", subscribers: "750K", er: "4.5%" },
  { rank: 5, name: "Code Masters", category: "Technology", subscribers: "620K", er: "5.8%" },
];

const collections = [
  { name: "Crypto & Blockchain", count: 2450, icon: "💎" },
  { name: "Tech & Startups", count: 1890, icon: "🚀" },
  { name: "News & Politics", count: 3200, icon: "📰" },
  { name: "Gaming & Esports", count: 1560, icon: "🎮" },
  { name: "Finance & Investment", count: 980, icon: "💰" },
  { name: "Education & Learning", count: 1240, icon: "📚" },
];

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
  return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">{rank}</span>;
};

const RankingsPage = () => {
  return (
    <MainLayout>
      <div className="pt-14 lg:pt-0 min-h-screen bg-background">
        <div className="container py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Rankings & Collections
            </h1>
            <p className="text-muted-foreground">
              Discover top channels by country, category, and curated collections
            </p>
          </motion.div>

          <Tabs defaultValue="countries" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <TabsList className="bg-card shadow-card p-1">
                <TabsTrigger value="countries" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  By Country
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  By Category
                </TabsTrigger>
                <TabsTrigger value="collections" className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Collections
                </TabsTrigger>
              </TabsList>
            </motion.div>

            <TabsContent value="countries">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl shadow-card overflow-hidden"
              >
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Country Rankings</h2>
                    <p className="text-sm text-muted-foreground">Top channels in 83 countries</p>
                  </div>
                  <Badge variant="secondary">USA</Badge>
                </div>
                <div className="divide-y divide-border">
                  {countryRankings.map((channel, index) => (
                    <motion.div
                      key={channel.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="w-8 flex justify-center">
                        <RankBadge rank={channel.rank} />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {channel.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{channel.name}</h3>
                        <p className="text-sm text-muted-foreground">{channel.country}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-foreground font-medium">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          {channel.subscribers}
                        </div>
                        <span className="text-sm text-success flex items-center gap-1 justify-end">
                          <TrendingUp className="w-3 h-3" />
                          {channel.growth}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="categories">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl shadow-card overflow-hidden"
              >
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Category Rankings</h2>
                    <p className="text-sm text-muted-foreground">Top channels in 41 categories</p>
                  </div>
                  <Badge variant="secondary">Technology</Badge>
                </div>
                <div className="divide-y divide-border">
                  {categoryRankings.map((channel, index) => (
                    <motion.div
                      key={channel.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="w-8 flex justify-center">
                        <RankBadge rank={channel.rank} />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {channel.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{channel.name}</h3>
                        <p className="text-sm text-muted-foreground">{channel.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-foreground font-medium">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          {channel.subscribers}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ER: {channel.er}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="collections">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection, index) => (
                  <motion.div
                    key={collection.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to="/catalog"
                      className="block bg-card rounded-xl shadow-card p-6 hover:shadow-card-hover transition-all group border border-transparent hover:border-primary/20"
                    >
                      <div className="text-4xl mb-4">{collection.icon}</div>
                      <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {collection.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {collection.count.toLocaleString()} channels
                      </p>
                      <span className="text-primary text-sm font-medium flex items-center gap-1">
                        Explore
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default RankingsPage;
