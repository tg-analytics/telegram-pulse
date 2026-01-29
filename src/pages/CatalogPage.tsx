import { useState } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Search,
  Filter,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Download,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

// Mock data for channels
const mockChannels = [
  {
    id: "1",
    name: "Tech News Daily",
    username: "@technewsdaily",
    avatar: "TN",
    subscribers: 1250000,
    growth24h: 2.3,
    growth7d: 8.5,
    growth30d: 24.2,
    engagementRate: 4.8,
    category: "Technology",
    country: "USA",
    verified: true,
    scam: false,
  },
  {
    id: "2",
    name: "Crypto Insights",
    username: "@cryptoinsights",
    avatar: "CI",
    subscribers: 890000,
    growth24h: -0.5,
    growth7d: 3.2,
    growth30d: 12.1,
    engagementRate: 6.2,
    category: "Cryptocurrency",
    country: "Global",
    verified: true,
    scam: false,
  },
  {
    id: "3",
    name: "Marketing Pro",
    username: "@marketingpro",
    avatar: "MP",
    subscribers: 456000,
    growth24h: 1.8,
    growth7d: 5.4,
    growth30d: 18.9,
    engagementRate: 3.9,
    category: "Marketing",
    country: "UK",
    verified: false,
    scam: false,
  },
  {
    id: "4",
    name: "News Breaking",
    username: "@newsbreaking",
    avatar: "NB",
    subscribers: 2100000,
    growth24h: 0.9,
    growth7d: 2.1,
    growth30d: 8.3,
    engagementRate: 7.1,
    category: "News",
    country: "USA",
    verified: true,
    scam: false,
  },
  {
    id: "5",
    name: "Easy Money Tips",
    username: "@easymoneytips",
    avatar: "EM",
    subscribers: 120000,
    growth24h: 15.2,
    growth7d: 45.8,
    growth30d: 120.5,
    engagementRate: 1.2,
    category: "Finance",
    country: "Unknown",
    verified: false,
    scam: true,
  },
  {
    id: "6",
    name: "Gaming Universe",
    username: "@gaminguniverse",
    avatar: "GU",
    subscribers: 780000,
    growth24h: 1.1,
    growth7d: 4.2,
    growth30d: 15.3,
    engagementRate: 5.5,
    category: "Gaming",
    country: "Germany",
    verified: true,
    scam: false,
  },
];

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

const CatalogPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

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
              Channel Catalog
            </h1>
            <p className="text-muted-foreground">
              Search and discover over 11 million Telegram channels
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl shadow-card p-6 mb-6"
          >
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by channel name, username, or keywords..."
                  className="pl-12 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
              <Button className="h-12 gradient-hero">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border"
              >
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="usa">USA</SelectItem>
                    <SelectItem value="uk">UK</SelectItem>
                    <SelectItem value="germany">Germany</SelectItem>
                    <SelectItem value="russia">Russia</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="gaming">Gaming</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    <SelectItem value="small">{'<'} 10K</SelectItem>
                    <SelectItem value="medium">10K - 100K</SelectItem>
                    <SelectItem value="large">100K - 1M</SelectItem>
                    <SelectItem value="huge">{'>'} 1M</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Engagement Rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any ER</SelectItem>
                    <SelectItem value="low">{'<'} 2%</SelectItem>
                    <SelectItem value="medium">2% - 5%</SelectItem>
                    <SelectItem value="high">{'>'} 5%</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </motion.div>

          {/* Actions Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-between gap-4 mb-6"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Showing <strong className="text-foreground">{mockChannels.length}</strong> channels
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Channel
              </Button>
            </div>
          </motion.div>

          {/* Channel Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl shadow-card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Channel</th>
                    <th className="text-right px-4 py-4 text-sm font-semibold text-foreground">Subscribers</th>
                    <th className="text-right px-4 py-4 text-sm font-semibold text-foreground">24h</th>
                    <th className="text-right px-4 py-4 text-sm font-semibold text-foreground">7d</th>
                    <th className="text-right px-4 py-4 text-sm font-semibold text-foreground">30d</th>
                    <th className="text-right px-4 py-4 text-sm font-semibold text-foreground">ER</th>
                    <th className="text-left px-4 py-4 text-sm font-semibold text-foreground">Category</th>
                    <th className="text-left px-4 py-4 text-sm font-semibold text-foreground">Status</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  {mockChannels.map((channel, index) => (
                    <motion.tr
                      key={channel.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Link to={`/channel/${channel.id}`} className="flex items-center gap-3 group">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                            {channel.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                                {channel.name}
                              </span>
                              {channel.verified && (
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">{channel.username}</span>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{formatNumber(channel.subscribers)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className={`flex items-center justify-end gap-1 ${channel.growth24h >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {channel.growth24h >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {channel.growth24h >= 0 ? '+' : ''}{channel.growth24h}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className={channel.growth7d >= 0 ? 'text-success' : 'text-destructive'}>
                          {channel.growth7d >= 0 ? '+' : ''}{channel.growth7d}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className={channel.growth30d >= 0 ? 'text-success' : 'text-destructive'}>
                          {channel.growth30d >= 0 ? '+' : ''}{channel.growth30d}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right font-medium">{channel.engagementRate}%</td>
                      <td className="px-4 py-4">
                        <Badge variant="secondary">{channel.category}</Badge>
                      </td>
                      <td className="px-4 py-4">
                        {channel.scam ? (
                          <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" />
                            Scam
                          </Badge>
                        ) : channel.verified ? (
                          <Badge className="bg-success/10 text-success border-success/20">
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline">Normal</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/channel/${channel.id}`}>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CatalogPage;
