import { useState } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Users,
  TrendingUp,
  Eye,
  MessageCircle,
  Share2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Download,
  Bell,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Lock,
  BadgeCheck,
  Info,
  ArrowRightLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Line,
} from "recharts";
import { cn } from "@/lib/utils";

// Mock data
const subscriberData = [
  { date: "Jan", subscribers: 5398000, er: 2.1 },
  { date: "Feb", subscribers: 5402000, er: 2.3 },
  { date: "Mar", subscribers: 5418000, er: 2.8 },
  { date: "Apr", subscribers: 5428000, er: 3.2 },
  { date: "May", subscribers: 5432000, er: 3.1 },
  { date: "Jun", subscribers: 5430000, er: 2.9 },
  { date: "Jul", subscribers: 5425000, er: 2.7 },
  { date: "Aug", subscribers: 5420000, er: 2.5 },
  { date: "Sep", subscribers: 5428000, er: 2.8 },
  { date: "Oct", subscribers: 5435000, er: 3.0 },
];

const viewsData = [
  { date: "Jan", views: 1250000, er: 2.1 },
  { date: "Feb", views: 1380000, er: 2.3 },
  { date: "Mar", views: 1520000, er: 2.8 },
  { date: "Apr", views: 1680000, er: 3.2 },
  { date: "May", views: 1590000, er: 3.1 },
  { date: "Jun", views: 1720000, er: 2.9 },
  { date: "Jul", views: 1450000, er: 2.7 },
  { date: "Aug", views: 1380000, er: 2.5 },
  { date: "Sep", views: 1620000, er: 2.8 },
  { date: "Oct", views: 1780000, er: 3.0 },
];

const similarChannels = [
  { name: "Жесть дня", avatar: "18+", subscribers: "1.90M", color: "bg-red-500" },
  { name: "Рифмы и Панчи 🎤", avatar: "РИП", subscribers: "1.50M", color: "bg-purple-500" },
  { name: "Tech Insider", avatar: "TI", subscribers: "980K", color: "bg-blue-500" },
];

const tagCloud = [
  { tag: "Technology", count: 42 },
  { tag: "AI", count: 38 },
  { tag: "Crypto", count: 24 },
  { tag: "News", count: 19 },
  { tag: "Startup", count: 15 },
  { tag: "Mobile", count: 12 },
];

const recentPosts = [
  {
    id: 1,
    text: "🚀 Breaking: New AI model released with unprecedented capabilities...",
    views: 125000,
    reactions: 4200,
    comments: 340,
    forwards: 1800,
    date: "2 hours ago",
    deleted: false,
  },
  {
    id: 2,
    text: "💡 Tech tip of the day: How to optimize your workflow with these 5 simple tools...",
    views: 89000,
    reactions: 2100,
    comments: 156,
    forwards: 920,
    date: "5 hours ago",
    deleted: false,
  },
  {
    id: 3,
    text: "📊 Weekly market analysis: What to expect in the tech sector...",
    views: 67000,
    reactions: 1500,
    comments: 89,
    forwards: 450,
    date: "1 day ago",
    deleted: true,
  },
];

const StatCard = ({ icon: Icon, label, value, change, changeType }: {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card rounded-xl shadow-card p-6"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
    <div className="flex items-end justify-between">
      <span className="text-2xl font-bold text-foreground">{value}</span>
      {change && (
        <span className={`flex items-center gap-1 text-sm font-medium ${
          changeType === "positive" ? "text-green-500" :
          changeType === "negative" ? "text-red-500" : "text-muted-foreground"
        }`}>
          {changeType === "positive" ? <ArrowUp className="w-4 h-4" /> : 
           changeType === "negative" ? <ArrowDown className="w-4 h-4" /> : null}
          {change}
        </span>
      )}
    </div>
  </motion.div>
);

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
  if (num >= 1000) return (num / 1000).toFixed(0) + "K";
  return num.toString();
}

const ChannelPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [chartType, setChartType] = useState<"subscribers" | "views">("subscribers");
  const [timePeriod, setTimePeriod] = useState("1M");

  const chartData = chartType === "subscribers" ? subscriberData : viewsData;
  const dataKey = chartType === "subscribers" ? "subscribers" : "views";

  return (
    <MainLayout>
      <div className="pt-14 lg:pt-0 min-h-screen bg-background">
        <div className="p-6 lg:p-8">
          {/* Channel Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl shadow-card p-6 mb-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-2xl font-bold text-primary-foreground">
                  TN
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-foreground">Tech News Daily</h1>
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-muted-foreground mb-2">@technewsdaily</p>
                  <p className="text-sm text-muted-foreground max-w-xl">
                    Your daily source for the latest technology news, AI breakthroughs, and digital innovation. 🚀 Trusted by 1M+ readers.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline">
                  <Bell className="w-4 h-4 mr-2" />
                  Create Alert
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button className="gradient-hero">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Telegram
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Main Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-border mb-6 overflow-x-auto">
            <div className="flex items-center gap-1">
              {[
                { id: "overview", label: "Overview", locked: false },
                { id: "advertisers", label: "Advertisers", locked: true },
                { id: "traffic", label: "Traffic sources", locked: true },
                { id: "posts", label: "Posts", locked: true },
                { id: "about", label: "About the channel", locked: true },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => !tab.locked && setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                    activeTab === tab.id
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground",
                    tab.locked && "opacity-60 cursor-not-allowed"
                  )}
                >
                  {tab.locked && <Lock className="w-4 h-4" />}
                  {tab.label}
                </button>
              ))}
            </div>
            <Button variant="outline" className="gap-2 ml-4 shrink-0">
              <BadgeCheck className="w-4 h-4 text-primary" />
              Verify channel
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={Users}
              label="Subscribers"
              value="5.43M"
              change="+2.3%"
              changeType="positive"
            />
            <StatCard
              icon={Eye}
              label="Avg. Views"
              value="1.78M"
              change="+5.1%"
              changeType="positive"
            />
            <StatCard
              icon={TrendingUp}
              label="Engagement Rate"
              value="3.2%"
              change="+0.3%"
              changeType="positive"
            />
            <StatCard
              icon={Calendar}
              label="Posts per Day"
              value="4.2"
              change="-0.5"
              changeType="negative"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Chart Section - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  {/* Chart Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    {/* Subscribers/Views Toggle */}
                    <div className="inline-flex rounded-full border p-1 bg-muted/30">
                      <button
                        onClick={() => setChartType("subscribers")}
                        className={cn(
                          "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                          chartType === "subscribers"
                            ? "bg-background shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Subscribers
                      </button>
                      <button
                        onClick={() => setChartType("views")}
                        className={cn(
                          "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                          chartType === "views"
                            ? "bg-background shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Views
                      </button>
                    </div>

                    {/* Time Period Selector */}
                    <div className="inline-flex rounded-full border p-1 bg-muted/30">
                      {["1M", "1Y", "Max"].map((period) => (
                        <button
                          key={period}
                          onClick={() => setTimePeriod(period)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1",
                            timePeriod === period
                              ? "bg-background shadow-sm text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {period !== "1M" && <Lock className="w-3 h-3" />}
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={chartData}>
                        <defs>
                          <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal vertical={false} />
                        <XAxis 
                          dataKey="date" 
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={12}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          yAxisId="left"
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={12}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(v) => formatNumber(v)}
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={12}
                          axisLine={false}
                          tickLine={false}
                          domain={[0, 5]}
                          tickFormatter={(v) => `${v}%`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                          formatter={(value: number, name: string) => [
                            name === "er" ? `${value}%` : formatNumber(value),
                            name === "er" ? "ER" : chartType === "subscribers" ? "Subscribers" : "Views"
                          ]}
                        />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey={dataKey}
                          stroke="hsl(var(--primary))"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorMain)"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="er"
                          stroke="hsl(var(--muted-foreground))"
                          strokeWidth={2}
                          dot={false}
                          strokeDasharray="5 5"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>

                  {/* ER Label */}
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <span className="font-medium">ER</span>
                    <span className="w-8 h-0.5 bg-muted-foreground/50" style={{ borderTop: "2px dashed" }} />
                    <span>Engagement Rate</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Posts */}
              <Card>
                <CardHeader className="border-b">
                  <CardTitle>Recent Posts</CardTitle>
                </CardHeader>
                <div className="divide-y divide-border">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="p-6 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-muted-foreground">{post.date}</span>
                            {post.deleted && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Deleted
                              </Badge>
                            )}
                          </div>
                          <p className="text-foreground mb-3">{post.text}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {(post.views / 1000).toFixed(0)}K views
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {post.reactions} reactions
                            </span>
                            <span className="flex items-center gap-1">
                              <Share2 className="w-4 h-4" />
                              {post.forwards} forwards
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar - 1 column */}
            <div className="space-y-6">
              {/* Similar Channels */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    Similar Channels
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {similarChannels.map((channel, i) => (
                    <div key={i} className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 rounded-lg p-2 -mx-2 transition-colors">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white",
                        channel.color
                      )}>
                        {channel.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{channel.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {channel.subscribers}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full text-primary text-sm">
                    View all similar channels →
                  </Button>
                </CardContent>
              </Card>

              {/* Tags Cloud */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    Tags Cloud
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tagCloud.map((item, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {item.tag}
                        <span className="ml-1.5 text-muted-foreground">{item.count}</span>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Incoming and Outgoing */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4" />
                    Incoming and Outgoing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-muted/30 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-4 mb-2">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-500">+12.5K</p>
                          <p className="text-xs text-muted-foreground">Incoming</p>
                        </div>
                        <div className="w-px h-8 bg-border" />
                        <div className="text-center">
                          <p className="text-2xl font-bold text-red-500">-3.2K</p>
                          <p className="text-xs text-muted-foreground">Outgoing</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Last 30 days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Verification CTA */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <BadgeCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">Verify this channel</h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        Unlock advanced demographics, audience insights, and ad analytics.
                      </p>
                      <Button size="sm" className="w-full">
                        Start Verification
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChannelPage;
