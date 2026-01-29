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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
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
} from "recharts";

// Mock data
const growthData = [
  { date: "Jan 1", subscribers: 1100000, views: 450000 },
  { date: "Jan 8", subscribers: 1120000, views: 520000 },
  { date: "Jan 15", subscribers: 1150000, views: 480000 },
  { date: "Jan 22", subscribers: 1180000, views: 550000 },
  { date: "Jan 29", subscribers: 1200000, views: 620000 },
  { date: "Feb 5", subscribers: 1230000, views: 580000 },
  { date: "Feb 12", subscribers: 1250000, views: 640000 },
];

const postData = [
  { date: "Mon", views: 45000, reactions: 2300, forwards: 890 },
  { date: "Tue", views: 52000, reactions: 2800, forwards: 1200 },
  { date: "Wed", views: 48000, reactions: 2100, forwards: 780 },
  { date: "Thu", views: 61000, reactions: 3400, forwards: 1500 },
  { date: "Fri", views: 55000, reactions: 2900, forwards: 1100 },
  { date: "Sat", views: 42000, reactions: 1900, forwards: 650 },
  { date: "Sun", views: 38000, reactions: 1700, forwards: 520 },
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
  icon: any;
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
          changeType === "positive" ? "text-success" :
          changeType === "negative" ? "text-destructive" : "text-muted-foreground"
        }`}>
          {changeType === "positive" ? <ArrowUp className="w-4 h-4" /> : 
           changeType === "negative" ? <ArrowDown className="w-4 h-4" /> : null}
          {change}
        </span>
      )}
    </div>
  </motion.div>
);

const ChannelPage = () => {
  return (
    <MainLayout>
      <div className="pt-14 lg:pt-0 min-h-screen bg-background">
        <div className="container py-8">
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

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={Users}
              label="Subscribers"
              value="1.25M"
              change="+2.3%"
              changeType="positive"
            />
            <StatCard
              icon={Eye}
              label="Avg. Views"
              value="89.4K"
              change="+5.1%"
              changeType="positive"
            />
            <StatCard
              icon={TrendingUp}
              label="Engagement Rate"
              value="4.8%"
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

          {/* Charts */}
          <Tabs defaultValue="growth" className="mb-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl shadow-card overflow-hidden"
            >
              <div className="p-6 border-b border-border">
                <TabsList>
                  <TabsTrigger value="growth">Audience Growth</TabsTrigger>
                  <TabsTrigger value="posts">Post Performance</TabsTrigger>
                  <TabsTrigger value="engagement">Engagement</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="growth" className="p-6 pt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthData}>
                      <defs>
                        <linearGradient id="colorSubscribers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="subscribers"
                        stroke="hsl(199 89% 48%)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorSubscribers)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="posts" className="p-6 pt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={postData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="views" fill="hsl(199 89% 48%)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="reactions" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="forwards" fill="hsl(38 92% 50%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="engagement" className="p-6 pt-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="views" stroke="hsl(199 89% 48%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </motion.div>
          </Tabs>

          {/* Recent Posts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl shadow-card overflow-hidden"
          >
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Recent Posts</h2>
            </div>
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
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChannelPage;
