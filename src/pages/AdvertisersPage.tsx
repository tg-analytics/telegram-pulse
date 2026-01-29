import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Megaphone,
  Users,
  ChevronDown,
  ExternalLink,
  Eye,
  Building2,
  Globe,
  Calendar,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const mockAdvertisers = [
  {
    id: "1",
    name: "Binance",
    logo: "🟡",
    industry: "Crypto",
    totalAds: 4520,
    channelsUsed: 1245,
    avgEngagement: 4.2,
    estimatedSpend: 2500000,
    trend: 15.3,
    lastActive: "2024-01-28",
    topChannels: ["Crypto News", "Trading Signals", "DeFi Daily"],
    activeCreatives: 156,
  },
  {
    id: "2",
    name: "Telegram Premium",
    logo: "⭐",
    industry: "Tech",
    totalAds: 3890,
    channelsUsed: 2100,
    avgEngagement: 5.8,
    estimatedSpend: 1800000,
    trend: 22.1,
    lastActive: "2024-01-28",
    topChannels: ["Tech News", "Digital Life", "App Reviews"],
    activeCreatives: 89,
  },
  {
    id: "3",
    name: "1xBet",
    logo: "🎰",
    industry: "Gaming",
    totalAds: 3245,
    channelsUsed: 890,
    avgEngagement: 3.1,
    estimatedSpend: 1500000,
    trend: -5.2,
    lastActive: "2024-01-27",
    topChannels: ["Sports News", "Football Daily", "Betting Tips"],
    activeCreatives: 234,
  },
  {
    id: "4",
    name: "Bybit",
    logo: "🔶",
    industry: "Crypto",
    totalAds: 2980,
    channelsUsed: 756,
    avgEngagement: 3.9,
    estimatedSpend: 1200000,
    trend: 8.7,
    lastActive: "2024-01-28",
    topChannels: ["Crypto Whales", "Trading Academy", "Altcoin News"],
    activeCreatives: 112,
  },
  {
    id: "5",
    name: "Temu",
    logo: "🛒",
    industry: "E-commerce",
    totalAds: 2650,
    channelsUsed: 1580,
    avgEngagement: 2.8,
    estimatedSpend: 980000,
    trend: 45.6,
    lastActive: "2024-01-28",
    topChannels: ["Shopping Deals", "Fashion Hub", "Lifestyle Tips"],
    activeCreatives: 345,
  },
  {
    id: "6",
    name: "OKX",
    logo: "⚫",
    industry: "Crypto",
    totalAds: 2180,
    channelsUsed: 620,
    avgEngagement: 4.1,
    estimatedSpend: 850000,
    trend: 12.4,
    lastActive: "2024-01-27",
    topChannels: ["Crypto Analysis", "Bitcoin News", "NFT World"],
    activeCreatives: 78,
  },
  {
    id: "7",
    name: "AliExpress",
    logo: "🧡",
    industry: "E-commerce",
    totalAds: 1950,
    channelsUsed: 1120,
    avgEngagement: 2.5,
    estimatedSpend: 720000,
    trend: -2.8,
    lastActive: "2024-01-26",
    topChannels: ["Budget Shopping", "Tech Gadgets", "Home Decor"],
    activeCreatives: 198,
  },
  {
    id: "8",
    name: "Stake",
    logo: "🎲",
    industry: "Gaming",
    totalAds: 1780,
    channelsUsed: 445,
    avgEngagement: 3.4,
    estimatedSpend: 680000,
    trend: 18.9,
    lastActive: "2024-01-28",
    topChannels: ["Casino News", "Gaming World", "Sports Bets"],
    activeCreatives: 167,
  },
];

const industries = ["All", "Crypto", "Tech", "Gaming", "E-commerce", "Finance", "Education"];

function formatCurrency(num: number): string {
  if (num >= 1000000) return "$" + (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return "$" + (num / 1000).toFixed(0) + "K";
  return "$" + num.toString();
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export default function AdvertisersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedAdvertiser, setSelectedAdvertiser] = useState<typeof mockAdvertisers[0] | null>(null);

  const filteredAdvertisers = mockAdvertisers.filter((adv) => {
    const matchesSearch = adv.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry === "All" || adv.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
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
          <h1 className="text-3xl font-bold text-foreground">Advertiser Rankings</h1>
          <p className="text-muted-foreground">
            Discover top advertisers and analyze their Telegram marketing strategies
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Advertisers</CardDescription>
              <CardTitle className="text-3xl">12,450</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <span className="text-green-500">+234</span> this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Ad Spend</CardDescription>
              <CardTitle className="text-3xl">$48.2M</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <span className="text-green-500">+18.5%</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Ad Campaigns</CardDescription>
              <CardTitle className="text-3xl">156K</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <span className="text-green-500">+12.3%</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg. Engagement Rate</CardDescription>
              <CardTitle className="text-3xl">3.8%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <span className="text-green-500">+0.2%</span> from last month
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
                  placeholder="Search advertisers..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((ind) => (
                      <SelectItem key={ind} value={ind}>
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select defaultValue="spend">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spend">Highest Spend</SelectItem>
                    <SelectItem value="ads">Most Ads</SelectItem>
                    <SelectItem value="channels">Most Channels</SelectItem>
                    <SelectItem value="engagement">Best Engagement</SelectItem>
                    <SelectItem value="growth">Fastest Growing</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="30">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>
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
                    <label className="text-sm font-medium">Min. Ad Spend</label>
                    <Input type="number" placeholder="e.g., 100000" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Min. Channels</label>
                    <Input type="number" placeholder="e.g., 50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Min. Engagement</label>
                    <Select defaultValue="any">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="2">2%+</SelectItem>
                        <SelectItem value="3">3%+</SelectItem>
                        <SelectItem value="5">5%+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Activity Status</label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active (7 days)</SelectItem>
                        <SelectItem value="recent">Recent (30 days)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>

        {/* Industry Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-2 bg-transparent p-0">
            {industries.map((ind) => (
              <TabsTrigger
                key={ind}
                value={ind.toLowerCase()}
                onClick={() => setSelectedIndustry(ind)}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4"
              >
                {ind}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Advertisers Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Rank</th>
                    <th className="text-left p-4 font-medium">Advertiser</th>
                    <th className="text-left p-4 font-medium">Industry</th>
                    <th className="text-right p-4 font-medium">Est. Spend</th>
                    <th className="text-right p-4 font-medium">Total Ads</th>
                    <th className="text-right p-4 font-medium">Channels</th>
                    <th className="text-right p-4 font-medium">Avg. ER</th>
                    <th className="text-right p-4 font-medium">Trend</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdvertisers.map((advertiser, index) => (
                    <motion.tr
                      key={advertiser.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-muted/30 cursor-pointer"
                    >
                      <td className="p-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index < 3 ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
                            {advertiser.logo}
                          </div>
                          <div>
                            <p className="font-semibold">{advertiser.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {advertiser.activeCreatives} active creatives
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary">{advertiser.industry}</Badge>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-semibold text-green-500">
                          {formatCurrency(advertiser.estimatedSpend)}
                        </span>
                      </td>
                      <td className="p-4 text-right font-medium">
                        {formatNumber(advertiser.totalAds)}
                      </td>
                      <td className="p-4 text-right">
                        {formatNumber(advertiser.channelsUsed)}
                      </td>
                      <td className="p-4 text-right">{advertiser.avgEngagement}%</td>
                      <td className="p-4 text-right">
                        <div className={`flex items-center justify-end gap-1 ${
                          advertiser.trend >= 0 ? "text-green-500" : "text-red-500"
                        }`}>
                          {advertiser.trend >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {advertiser.trend >= 0 ? "+" : ""}{advertiser.trend}%
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedAdvertiser(advertiser)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-3xl">
                                  {advertiser.logo}
                                </div>
                                <div>
                                  <DialogTitle className="text-2xl">{advertiser.name}</DialogTitle>
                                  <DialogDescription>
                                    <Badge variant="secondary" className="mt-1">
                                      {advertiser.industry}
                                    </Badge>
                                  </DialogDescription>
                                </div>
                              </div>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                              {/* Stats Grid */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-3 rounded-lg bg-muted/50">
                                  <DollarSign className="w-5 h-5 text-green-500 mb-1" />
                                  <p className="text-lg font-bold">{formatCurrency(advertiser.estimatedSpend)}</p>
                                  <p className="text-xs text-muted-foreground">Est. Spend</p>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/50">
                                  <Megaphone className="w-5 h-5 text-primary mb-1" />
                                  <p className="text-lg font-bold">{formatNumber(advertiser.totalAds)}</p>
                                  <p className="text-xs text-muted-foreground">Total Ads</p>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/50">
                                  <Users className="w-5 h-5 text-primary mb-1" />
                                  <p className="text-lg font-bold">{formatNumber(advertiser.channelsUsed)}</p>
                                  <p className="text-xs text-muted-foreground">Channels Used</p>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/50">
                                  <BarChart3 className="w-5 h-5 text-primary mb-1" />
                                  <p className="text-lg font-bold">{advertiser.avgEngagement}%</p>
                                  <p className="text-xs text-muted-foreground">Avg. ER</p>
                                </div>
                              </div>

                              {/* Top Channels */}
                              <div>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <Building2 className="w-4 h-4" />
                                  Top Channels
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {advertiser.topChannels.map((channel) => (
                                    <Badge key={channel} variant="outline">
                                      {channel}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {/* Activity Info */}
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  Last active: {advertiser.lastActive}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Globe className="w-4 h-4" />
                                  {advertiser.activeCreatives} active creatives
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex gap-2">
                                <Button className="flex-1 gap-2">
                                  <Megaphone className="w-4 h-4" />
                                  View All Ads
                                </Button>
                                <Button variant="outline" className="flex-1 gap-2">
                                  <ExternalLink className="w-4 h-4" />
                                  View Channels
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Results count */}
        <p className="text-sm text-muted-foreground text-center">
          Showing {filteredAdvertisers.length} of {mockAdvertisers.length} advertisers
        </p>
      </div>
    </MainLayout>
  );
}
