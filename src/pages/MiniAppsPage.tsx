import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Users,
  TrendingUp,
  Star,
  ExternalLink,
  ChevronDown,
  Gamepad2,
  ShoppingBag,
  Briefcase,
  Music,
  Wallet,
  MessageCircle,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const categoryIcons: Record<string, React.ReactNode> = {
  Games: <Gamepad2 className="w-4 h-4" />,
  Shopping: <ShoppingBag className="w-4 h-4" />,
  Finance: <Wallet className="w-4 h-4" />,
  Productivity: <Briefcase className="w-4 h-4" />,
  Entertainment: <Music className="w-4 h-4" />,
  Social: <MessageCircle className="w-4 h-4" />,
};

const mockMiniApps = [
  {
    id: "1",
    name: "Hamster Kombat",
    icon: "🐹",
    category: "Games",
    dailyUsers: 2500000,
    totalUsers: 45000000,
    sessions: 8500000,
    rating: 4.8,
    growth: 15.2,
    description: "Tap-to-earn crypto game with hamster theme",
    launched: "2024-03",
  },
  {
    id: "2",
    name: "Notcoin",
    icon: "🪙",
    category: "Games",
    dailyUsers: 1800000,
    totalUsers: 35000000,
    sessions: 5200000,
    rating: 4.6,
    growth: 8.5,
    description: "Popular tap-to-earn mining game",
    launched: "2024-01",
  },
  {
    id: "3",
    name: "Wallet",
    icon: "💳",
    category: "Finance",
    dailyUsers: 1200000,
    totalUsers: 28000000,
    sessions: 3800000,
    rating: 4.9,
    growth: 22.3,
    description: "Official Telegram crypto wallet",
    launched: "2023-09",
  },
  {
    id: "4",
    name: "Fragment",
    icon: "💎",
    category: "Finance",
    dailyUsers: 450000,
    totalUsers: 8500000,
    sessions: 980000,
    rating: 4.7,
    growth: 12.1,
    description: "NFT marketplace for usernames and numbers",
    launched: "2022-10",
  },
  {
    id: "5",
    name: "Yescoin",
    icon: "✅",
    category: "Games",
    dailyUsers: 950000,
    totalUsers: 18000000,
    sessions: 2800000,
    rating: 4.4,
    growth: 28.7,
    description: "Swipe-to-earn game with social features",
    launched: "2024-04",
  },
  {
    id: "6",
    name: "Major",
    icon: "⭐",
    category: "Games",
    dailyUsers: 680000,
    totalUsers: 12000000,
    sessions: 1950000,
    rating: 4.3,
    growth: 45.2,
    description: "Star collection mini-game",
    launched: "2024-06",
  },
  {
    id: "7",
    name: "Blum",
    icon: "🌸",
    category: "Finance",
    dailyUsers: 520000,
    totalUsers: 9500000,
    sessions: 1420000,
    rating: 4.5,
    growth: 32.8,
    description: "Crypto exchange mini-app",
    launched: "2024-05",
  },
  {
    id: "8",
    name: "Catizen",
    icon: "🐱",
    category: "Games",
    dailyUsers: 380000,
    totalUsers: 7200000,
    sessions: 1100000,
    rating: 4.2,
    growth: 18.9,
    description: "Cat-themed tap game with NFTs",
    launched: "2024-04",
  },
];

const categories = ["All", "Games", "Finance", "Shopping", "Productivity", "Entertainment", "Social"];

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export default function MiniAppsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredApps = mockMiniApps.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold text-foreground">Mini Apps Analytics</h1>
          <p className="text-muted-foreground">
            Explore and analyze 4,400+ Telegram mini apps
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Mini Apps</CardDescription>
              <CardTitle className="text-3xl">4,412</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <span className="text-green-500">+127</span> this week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Daily Active Users</CardDescription>
              <CardTitle className="text-3xl">28.5M</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <span className="text-green-500">+12.3%</span> from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Sessions</CardDescription>
              <CardTitle className="text-3xl">156M</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <span className="text-green-500">+8.7%</span> from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg. Session Time</CardDescription>
              <CardTitle className="text-3xl">4:32</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <span className="text-green-500">+0:18</span> from last week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search mini apps..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select defaultValue="users">
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="users">Most Users</SelectItem>
                    <SelectItem value="growth">Fastest Growing</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="mt-2 gap-2">
                  <Filter className="w-4 h-4" />
                  Advanced Filters
                  <ChevronDown className={`w-4 h-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Min. Daily Users</label>
                    <Input type="number" placeholder="e.g., 100000" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Min. Rating</label>
                    <Select defaultValue="any">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="4">4+ Stars</SelectItem>
                        <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Launch Date</label>
                    <Select defaultValue="any">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any time</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                        <SelectItem value="90">Last 90 days</SelectItem>
                        <SelectItem value="180">Last 6 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Growth Rate</label>
                    <Select defaultValue="any">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="10">10%+ weekly</SelectItem>
                        <SelectItem value="25">25%+ weekly</SelectItem>
                        <SelectItem value="50">50%+ weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {/* Category Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-2 bg-transparent p-0">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat.toLowerCase()}
                onClick={() => setSelectedCategory(cat)}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4"
              >
                {categoryIcons[cat] && <span className="mr-2">{categoryIcons[cat]}</span>}
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Mini Apps Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredApps.map((app) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                          {app.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold">{app.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {app.category}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {app.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{formatNumber(app.dailyUsers)} DAU</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-green-500">+{app.growth}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500" />
                        <span>{app.rating}</span>
                      </div>
                      <div className="text-muted-foreground">
                        {formatNumber(app.totalUsers)} total
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Mini App</th>
                      <th className="text-left p-4 font-medium">Category</th>
                      <th className="text-right p-4 font-medium">Daily Users</th>
                      <th className="text-right p-4 font-medium">Total Users</th>
                      <th className="text-right p-4 font-medium">Sessions</th>
                      <th className="text-right p-4 font-medium">Rating</th>
                      <th className="text-right p-4 font-medium">Growth</th>
                      <th className="text-right p-4 font-medium">Launched</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApps.map((app) => (
                      <tr key={app.id} className="border-b hover:bg-muted/30 cursor-pointer">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
                              {app.icon}
                            </div>
                            <div>
                              <p className="font-medium">{app.name}</p>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {app.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary">{app.category}</Badge>
                        </td>
                        <td className="p-4 text-right font-medium">
                          {formatNumber(app.dailyUsers)}
                        </td>
                        <td className="p-4 text-right">
                          {formatNumber(app.totalUsers)}
                        </td>
                        <td className="p-4 text-right">
                          {formatNumber(app.sessions)}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Star className="w-4 h-4 text-amber-500" />
                            {app.rating}
                          </div>
                        </td>
                        <td className="p-4 text-right text-green-500">
                          +{app.growth}%
                        </td>
                        <td className="p-4 text-right text-muted-foreground">
                          {app.launched}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results count */}
        <p className="text-sm text-muted-foreground text-center">
          Showing {filteredApps.length} of {mockMiniApps.length} mini apps
        </p>
      </div>
    </MainLayout>
  );
}
