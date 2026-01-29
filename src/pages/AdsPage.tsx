import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Search,
  Filter,
  ExternalLink,
  Eye,
  TrendingUp,
  Calendar,
  Image as ImageIcon,
  Video,
  FileText,
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

const mockAds = [
  {
    id: 1,
    preview: "🔥 Limited Time Offer! Get 50% off on premium subscriptions...",
    advertiser: "Tech Startup Pro",
    channel: "@technewsdaily",
    impressions: 245000,
    engagement: 3.2,
    type: "text",
    date: "2 hours ago",
  },
  {
    id: 2,
    preview: "🚀 Launch your career in AI with our comprehensive bootcamp...",
    advertiser: "AI Academy",
    channel: "@cryptoinsights",
    impressions: 189000,
    engagement: 4.8,
    type: "image",
    date: "5 hours ago",
  },
  {
    id: 3,
    preview: "💎 Exclusive NFT drop - Join the whitelist now...",
    advertiser: "NFT Collective",
    channel: "@marketingpro",
    impressions: 156000,
    engagement: 2.1,
    type: "video",
    date: "1 day ago",
  },
  {
    id: 4,
    preview: "📈 Multiply your investments with our proven strategy...",
    advertiser: "Investment Hub",
    channel: "@newsbreaking",
    impressions: 320000,
    engagement: 5.6,
    type: "text",
    date: "1 day ago",
  },
  {
    id: 5,
    preview: "🎮 New gaming platform with instant withdrawals...",
    advertiser: "GameFi World",
    channel: "@gaminguniverse",
    impressions: 98000,
    engagement: 6.2,
    type: "image",
    date: "2 days ago",
  },
  {
    id: 6,
    preview: "💼 Find your dream remote job - 10,000+ openings...",
    advertiser: "Remote Jobs HQ",
    channel: "@technewsdaily",
    impressions: 275000,
    engagement: 4.1,
    type: "text",
    date: "2 days ago",
  },
];

const TypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "image":
      return <ImageIcon className="w-4 h-4" />;
    case "video":
      return <Video className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

const AdsPage = () => {
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
              Ads Intelligence
            </h1>
            <p className="text-muted-foreground">
              Discover winning ad creatives and competitor campaigns across 88M+ ads
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
                  placeholder="Search by advertiser, keywords, or channel..."
                  className="pl-12 h-12"
                />
              </div>
              <Button className="h-12 gradient-hero">
                <Search className="w-4 h-4 mr-2" />
                Search Ads
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Ad Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="text">Text Only</SelectItem>
                  <SelectItem value="image">With Image</SelectItem>
                  <SelectItem value="video">With Video</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="impressions">Impressions</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Ads Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAds.map((ad, index) => (
              <motion.div
                key={ad.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="bg-card rounded-xl shadow-card overflow-hidden hover:shadow-card-hover transition-shadow group"
              >
                {/* Ad Preview Area */}
                <div className="h-40 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center p-6">
                  <p className="text-foreground text-center line-clamp-3">
                    {ad.preview}
                  </p>
                </div>

                {/* Ad Details */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <TypeIcon type={ad.type} />
                      {ad.type.charAt(0).toUpperCase() + ad.type.slice(1)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{ad.date}</span>
                  </div>

                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {ad.advertiser}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Posted on {ad.channel}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Eye className="w-4 h-4" />
                        {(ad.impressions / 1000).toFixed(0)}K
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <TrendingUp className="w-4 h-4" />
                        {ad.engagement}%
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdsPage;
