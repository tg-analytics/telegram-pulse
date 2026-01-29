import { motion } from "framer-motion";
import {
  TrendingUp,
  Eye,
  Users,
  FileText,
  ThumbsUp,
  Flame,
  MessageCircle,
  Share2,
  ArrowUp,
  ArrowDown,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const engagementData = [
  { month: "Jan", subscribers: 85000 },
  { month: "Feb", subscribers: 92000 },
  { month: "Mar", subscribers: 212346 },
  { month: "Apr", subscribers: 145000 },
  { month: "May", subscribers: 168000 },
  { month: "Jun", subscribers: 195000 },
  { month: "Jul", subscribers: 280000 },
];

const audienceMembers = [
  { name: "Joson Simpson", avatar: "JS", verified: true, country: "🇺🇸", subscribed: "3 months" },
  { name: "Emily Miller", avatar: "EM", verified: true, premium: true, country: "🇪🇸", subscribed: "8 days" },
  { name: "Kevin Brown", avatar: "KB", verified: false, country: "🇹🇷", subscribed: "2 weeks" },
];

export function AnalyticsShowcase() {
  return (
    <section className="py-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Powerful Analytics at Your Fingertips
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get deep insights into channel performance, audience behavior, and content effectiveness
          </p>
        </motion.div>

        {/* Analytics Cards Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Audience Engagement Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Audience Engagement
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Analyze the channel's traffic sources and the posts it used for advertising.
                </p>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Promo annotation */}
                  <div className="absolute top-8 left-12 z-10 bg-card border rounded-lg px-3 py-2 shadow-lg">
                    <p className="text-lg font-bold text-green-500">+212 346</p>
                    <p className="text-xs text-muted-foreground">
                      Promo in <span className="inline-flex gap-0.5">🔵🟢🟣</span> 123 channels
                    </p>
                  </div>
                  
                  {/* Chart */}
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={engagementData}>
                        <defs>
                          <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="month" 
                          axisLine={false} 
                          tickLine={false}
                          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis hide />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                          formatter={(value: number) => [value.toLocaleString(), 'Subscribers']}
                        />
                        <Area
                          type="monotone"
                          dataKey="subscribers"
                          stroke="hsl(var(--primary))"
                          strokeWidth={3}
                          fill="url(#colorSubs)"
                          dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Activity + Audience Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Activity Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Eye className="w-5 h-5 text-primary" />
                  Activity
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Monitor metrics such as subscriber growth, views, ER (engagement rate), and more.
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">Subscribers</span>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500 border-0">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    23%
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">Views</span>
                  </div>
                  <Badge className="bg-red-500/10 text-red-500 border-0">
                    <ArrowDown className="w-3 h-3 mr-1" />
                    16%
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded text-xs font-bold flex items-center justify-center bg-muted-foreground/20">
                      ER
                    </div>
                    <span className="font-medium">Engagement</span>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500 border-0">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    10%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Audience Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-primary" />
                  Audience
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Explore the audience, their activity, and the duration of their subscription.
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                {audienceMembers.map((member, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {member.avatar}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-sm">{member.name}</span>
                        {member.verified && (
                          <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        {member.premium && (
                          <Star className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                      <span className="text-lg">{member.country}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Subscribed</p>
                      <p className="text-sm font-medium">{member.subscribed}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Posts Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-primary" />
                  Posts
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Analyze posts even after the author has deleted them. Telemetrio saves{" "}
                  <span className="text-primary font-semibold">~35.3M</span> new posts daily.
                </p>
              </CardHeader>
              <CardContent>
                {/* Post Preview Card */}
                <div className="rounded-xl border bg-card overflow-hidden">
                  {/* Post Image */}
                  <div className="h-40 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/30 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-primary/20 mx-auto mb-2 flex items-center justify-center">
                        <span className="text-3xl">📱</span>
                      </div>
                      <p className="text-sm font-medium text-foreground/80">Telegram Apps</p>
                    </div>
                  </div>

                  {/* Reactions */}
                  <div className="p-3 border-b flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sm">
                      <ThumbsUp className="w-4 h-4 text-primary" />
                      <span>1,642</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span>31</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span>🤩</span>
                      <span>22</span>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-3 space-y-2">
                    <h4 className="font-semibold text-sm">
                      Sunday Roundup: Boosting productivity, gaming, and crypto on Telegram
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      GasPump Improvements: Check out the recent updates from the leading memecoin launchpad...
                    </p>
                    <button className="text-xs text-primary font-medium hover:underline">
                      Show all...
                    </button>
                  </div>

                  {/* Post Meta */}
                  <div className="px-3 pb-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Nov 24, 11:10</span>
                    <span className="text-red-500">📌 Nov 25, 12:54</span>
                  </div>

                  {/* Post Stats */}
                  <div className="border-t px-3 py-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>23</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="w-3 h-3" />
                      <span>115</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>24,421</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
