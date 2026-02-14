import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { format, formatDistanceToNow, parseISO } from "date-fns";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import { useChannelOverview } from "@/hooks/useChannelOverview";
import type { KpiMetric, OverviewChartPoint } from "@/services/channelsApi";

const StatCard = ({
  icon: Icon,
  label,
  value,
  change,
  changeType,
}: {
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
        <span
          className={cn(
            "flex items-center gap-1 text-sm font-medium",
            changeType === "positive" && "text-green-500",
            changeType === "negative" && "text-red-500",
            changeType === "neutral" && "text-muted-foreground",
          )}
        >
          {changeType === "positive" ? <ArrowUp className="w-4 h-4" /> : null}
          {changeType === "negative" ? <ArrowDown className="w-4 h-4" /> : null}
          {change}
        </span>
      )}
    </div>
  </motion.div>
);

function formatCompactNumber(num?: number): string {
  if (num === undefined || Number.isNaN(num)) {
    return "N/A";
  }

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
}

function formatPercent(num?: number): string {
  if (num === undefined || Number.isNaN(num)) {
    return "N/A";
  }
  return `${num}%`;
}

function formatSignedCompactNumber(num: number | undefined, sign: "+" | "-"): string {
  if (num === undefined || Number.isNaN(num)) {
    return "N/A";
  }
  return `${sign}${formatCompactNumber(num)}`;
}

function formatDelta(metric?: KpiMetric): { text: string; type: "positive" | "negative" | "neutral" } {
  const deltaPercent = metric?.delta_percent;
  if (deltaPercent === undefined || Number.isNaN(deltaPercent)) {
    return { text: "N/A", type: "neutral" };
  }

  const type = deltaPercent > 0 ? "positive" : deltaPercent < 0 ? "negative" : "neutral";
  const sign = deltaPercent > 0 ? "+" : "";
  return { text: `${sign}${deltaPercent.toFixed(2)}%`, type };
}

function toChartData(points: OverviewChartPoint[]) {
  return points.map((point) => {
    const parsedDate = parseISO(point.date);
    const label = Number.isNaN(parsedDate.getTime()) ? point.date : format(parsedDate, "MMM d");

    return {
      ...point,
      label,
      er: point.engagement_rate,
    };
  });
}

function relativeTime(iso?: string): string {
  if (!iso) {
    return "Unknown date";
  }

  const parsed = parseISO(iso);
  if (Number.isNaN(parsed.getTime())) {
    return "Unknown date";
  }

  return formatDistanceToNow(parsed, { addSuffix: true });
}

function avatarFallback(name?: string | null) {
  if (!name) {
    return "CH";
  }

  return name
    .split(" ")
    .map((chunk) => chunk[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ChannelPageSkeleton() {
  return (
    <div className="p-6 lg:p-8 space-y-6" data-testid="channel-page-skeleton">
      <div className="bg-card rounded-xl shadow-card p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-20 h-20 rounded-2xl" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-full max-w-2xl" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="bg-card rounded-xl shadow-card p-6 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-28" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <Skeleton className="h-72 w-full" />
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} className="h-12 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const ChannelPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, refetch } = useChannelOverview(id);

  const [activeTab, setActiveTab] = useState("overview");
  const [chartType, setChartType] = useState<"subscribers" | "views">("subscribers");
  const [timePeriod, setTimePeriod] = useState("1M");

  const overview = data?.data;
  const channel = overview?.channel;
  const kpis = overview?.kpis;
  const chartData = useMemo(() => toChartData(overview?.chart.points ?? []), [overview?.chart.points]);

  const subscribersDelta = formatDelta(kpis?.subscribers);
  const viewsDelta = formatDelta(kpis?.avg_views);
  const engagementDelta = formatDelta(kpis?.engagement_rate);
  const postsDelta = formatDelta(kpis?.posts_per_day);

  const telegramUsername = channel?.username?.replace(/^@/, "");
  const telegramUrl = telegramUsername ? `https://t.me/${telegramUsername}` : undefined;

  const inoutIncoming = overview?.inout_30d?.incoming ?? overview?.incoming_30d;
  const inoutOutgoing = overview?.inout_30d?.outgoing ?? overview?.outgoing_30d;

  return (
    <MainLayout>
      <div className="pt-14 lg:pt-0 min-h-screen bg-background">
        {isLoading ? (
          <ChannelPageSkeleton />
        ) : isError || !overview ? (
          <div className="p-6 lg:p-8">
            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <h2 className="text-xl font-semibold">Failed to load channel overview</h2>
                <p className="text-muted-foreground">Please check your API token and try again.</p>
                <Button onClick={() => refetch()}>Retry</Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl shadow-card p-6 mb-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  {channel?.avatar_url ? (
                    <img
                      src={channel.avatar_url}
                      alt={channel.name ?? "Channel avatar"}
                      className="w-20 h-20 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-2xl font-bold text-primary-foreground">
                      {avatarFallback(channel?.name)}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold text-foreground">{channel?.name ?? "N/A"}</h1>
                      {channel?.status === "verified" ? <CheckCircle2 className="w-6 h-6 text-primary" /> : null}
                    </div>
                    <p className="text-muted-foreground mb-2">{channel?.username ?? "N/A"}</p>
                    <p className="text-sm text-muted-foreground max-w-xl">
                      {channel?.description || channel?.about_text || "N/A"}
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
                  <Button className="gradient-hero" disabled={!telegramUrl} asChild={Boolean(telegramUrl)}>
                    {telegramUrl ? (
                      <a href={telegramUrl} target="_blank" rel="noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open in Telegram
                      </a>
                    ) : (
                      <span>
                        <ExternalLink className="w-4 h-4 mr-2 inline" />
                        Open in Telegram
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>

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
                      tab.locked && "opacity-60 cursor-not-allowed",
                    )}
                  >
                    {tab.locked ? <Lock className="w-4 h-4" /> : null}
                    {tab.label}
                  </button>
                ))}
              </div>
              <Button variant="outline" className="gap-2 ml-4 shrink-0">
                <BadgeCheck className="w-4 h-4 text-primary" />
                Verify channel
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                icon={Users}
                label="Subscribers"
                value={formatCompactNumber(kpis?.subscribers.value)}
                change={subscribersDelta.text}
                changeType={subscribersDelta.type}
              />
              <StatCard
                icon={Eye}
                label="Avg. Views"
                value={formatCompactNumber(kpis?.avg_views.value)}
                change={viewsDelta.text}
                changeType={viewsDelta.type}
              />
              <StatCard
                icon={TrendingUp}
                label="Engagement Rate"
                value={formatPercent(kpis?.engagement_rate.value)}
                change={engagementDelta.text}
                changeType={engagementDelta.type}
              />
              <StatCard
                icon={Calendar}
                label="Posts per Day"
                value={kpis?.posts_per_day.value !== undefined ? String(kpis.posts_per_day.value) : "N/A"}
                change={postsDelta.text}
                changeType={postsDelta.type}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                      <div className="inline-flex rounded-full border p-1 bg-muted/30">
                        <button
                          onClick={() => setChartType("subscribers")}
                          className={cn(
                            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                            chartType === "subscribers"
                              ? "bg-background shadow-sm text-foreground"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          Subscribers
                        </button>
                        <button
                          disabled
                          title="Views chart will be available once backend provides the series"
                          className="px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground/60 cursor-not-allowed flex items-center gap-1"
                        >
                          <Lock className="w-3 h-3" />
                          Views
                        </button>
                      </div>

                      <div className="inline-flex rounded-full border p-1 bg-muted/30">
                        {["1M", "1Y", "Max"].map((period) => {
                          const isLocked = period !== "1M";
                          return (
                            <button
                              key={period}
                              onClick={() => !isLocked && setTimePeriod(period)}
                              disabled={isLocked}
                              className={cn(
                                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1",
                                timePeriod === period
                                  ? "bg-background shadow-sm text-foreground"
                                  : "text-muted-foreground hover:text-foreground",
                                isLocked && "opacity-60 cursor-not-allowed",
                              )}
                            >
                              {isLocked ? <Lock className="w-3 h-3" /> : null}
                              {period}
                            </button>
                          );
                        })}
                      </div>
                    </div>

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
                            dataKey="label"
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
                            tickFormatter={(v) => formatCompactNumber(v)}
                          />
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `${v}%`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                            formatter={(value: number, name: string) => [
                              name === "er" ? `${value}%` : formatCompactNumber(value),
                              name === "er" ? "ER" : "Subscribers",
                            ]}
                          />
                          <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="subscribers"
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

                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <span className="font-medium">ER</span>
                      <span className="w-8 h-0.5 bg-muted-foreground/50" style={{ borderTop: "2px dashed" }} />
                      <span>Engagement Rate</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="border-b">
                    <CardTitle>Recent Posts</CardTitle>
                  </CardHeader>
                  <div className="divide-y divide-border">
                    {overview.recent_posts.length ? (
                      overview.recent_posts.map((post) => (
                        <div key={post.post_id} className="p-6 hover:bg-muted/30 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-muted-foreground">{relativeTime(post.published_at)}</span>
                              </div>
                              <p className="text-foreground mb-3">{post.title || post.content_text || "Untitled post"}</p>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  {formatCompactNumber(post.views_count)} views
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="w-4 h-4" />
                                  {formatCompactNumber(post.reactions_count)} reactions
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="w-4 h-4" />
                                  {formatCompactNumber(post.comments_count)} comments
                                </span>
                                <span className="flex items-center gap-1">
                                  <Share2 className="w-4 h-4" />
                                  {formatCompactNumber(post.forwards_count)} forwards
                                </span>
                              </div>
                            </div>
                            {post.external_post_url ? (
                              <Button variant="ghost" size="sm" asChild>
                                <a href={post.external_post_url} target="_blank" rel="noreferrer" aria-label="Open post">
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-sm text-muted-foreground">No recent posts available.</div>
                    )}
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      Similar Channels
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {overview.similar_channels.length ? (
                      overview.similar_channels.map((similar) => (
                        <Link
                          key={similar.channel_id}
                          to={`/channel/${similar.channel_id}`}
                          className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 rounded-lg p-2 -mx-2 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {avatarFallback(similar.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{similar.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{similar.username ?? "N/A"}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {formatCompactNumber(similar.subscribers)}
                            </p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">No similar channels available.</div>
                    )}
                    <Button variant="ghost" className="w-full text-primary text-sm" disabled>
                      View all similar channels →
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      Tags Cloud
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {overview.tags.length ? (
                        overview.tags.map((tag) => (
                          <Badge
                            key={tag.tag_id}
                            variant="secondary"
                            className="cursor-default hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            {tag.name}
                            <span className="ml-1.5 text-muted-foreground">{Math.round(tag.relevance_score)}</span>
                          </Badge>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground">No tags available.</div>
                      )}
                    </div>
                  </CardContent>
                </Card>

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
                            <p className="text-2xl font-bold text-green-500">
                              {formatSignedCompactNumber(inoutIncoming, "+")}
                            </p>
                            <p className="text-xs text-muted-foreground">Incoming</p>
                          </div>
                          <div className="w-px h-8 bg-border" />
                          <div className="text-center">
                            <p className="text-2xl font-bold text-red-500">
                              {formatSignedCompactNumber(inoutOutgoing, "-")}
                            </p>
                            <p className="text-xs text-muted-foreground">Outgoing</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">Last 30 days</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

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
        )}
      </div>
    </MainLayout>
  );
};

export default ChannelPage;
