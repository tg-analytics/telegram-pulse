import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Users,
  TrendingUp,
  Star,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useMiniAppsSummary } from "@/hooks/useMiniAppsSummary";
import { useMiniApps } from "@/hooks/useMiniApps";
import type { MiniApp, MiniAppsSummaryPeriod } from "@/services/miniAppsApi";

const categories = [
  { slug: "all", label: "All" },
  { slug: "games", label: "Games" },
  { slug: "finance", label: "Finance" },
  { slug: "shopping", label: "Shopping" },
  { slug: "productivity", label: "Productivity" },
  { slug: "entertainment", label: "Entertainment" },
  { slug: "social", label: "Social" },
] as const;

const categoryIcons: Record<string, React.ReactNode> = {
  games: <Gamepad2 className="w-4 h-4" />,
  shopping: <ShoppingBag className="w-4 h-4" />,
  finance: <Wallet className="w-4 h-4" />,
  productivity: <Briefcase className="w-4 h-4" />,
  entertainment: <Music className="w-4 h-4" />,
  social: <MessageCircle className="w-4 h-4" />,
};

type SortOption = "users" | "growth" | "rating" | "newest";

const sortMap: Record<SortOption, { sort_by: "daily_users" | "growth" | "rating" | "launched_at"; sort_order: "asc" | "desc" }> = {
  users: { sort_by: "daily_users", sort_order: "desc" },
  growth: { sort_by: "growth", sort_order: "desc" },
  rating: { sort_by: "rating", sort_order: "desc" },
  newest: { sort_by: "launched_at", sort_order: "desc" },
};

function formatCompactNumber(num: number): string {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

function formatSessionTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.abs(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatDelta(value: number): string {
  const prefix = value >= 0 ? "+" : "";
  return `${prefix}${value}`;
}

function getCategoryLabel(categorySlug: string): string {
  const found = categories.find((category) => category.slug === categorySlug);
  return found?.label ?? categorySlug;
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).slice(0, 2);
  return words.map((word) => word[0]?.toUpperCase() ?? "").join("") || "?";
}

export default function MiniAppsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [period, setPeriod] = useState<MiniAppsSummaryPeriod>("7d");
  const [sortOption, setSortOption] = useState<SortOption>("users");
  const [minDailyUsersInput, setMinDailyUsersInput] = useState("");
  const [minRating, setMinRating] = useState("any");
  const [launchWithinDays, setLaunchWithinDays] = useState("any");
  const [minGrowth, setMinGrowth] = useState("any");
  const [cursor, setCursor] = useState<string | undefined>();
  const [items, setItems] = useState<MiniApp[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalEstimate, setTotalEstimate] = useState<number | undefined>();

  const summaryQuery = useMiniAppsSummary(period);

  const parsedMinDailyUsers = useMemo(() => {
    if (!minDailyUsersInput.trim()) return undefined;
    const value = Number(minDailyUsersInput);
    return Number.isFinite(value) && value > 0 ? value : undefined;
  }, [minDailyUsersInput]);

  const parsedMinRating = useMemo(() => {
    if (minRating === "any") return undefined;
    const value = Number(minRating);
    return Number.isFinite(value) ? value : undefined;
  }, [minRating]);

  const parsedLaunchWithinDays = useMemo(() => {
    if (launchWithinDays === "any") return undefined;
    const value = Number(launchWithinDays);
    return Number.isFinite(value) ? value : undefined;
  }, [launchWithinDays]);

  const parsedMinGrowth = useMemo(() => {
    if (minGrowth === "any") return undefined;
    const value = Number(minGrowth);
    return Number.isFinite(value) ? value : undefined;
  }, [minGrowth]);

  const baseFilters = useMemo(() => {
    const sort = sortMap[sortOption];
    return {
      q: searchInput.trim() || undefined,
      category_slug: selectedCategory === "all" ? undefined : selectedCategory,
      min_daily_users: parsedMinDailyUsers,
      min_rating: parsedMinRating,
      launch_within_days: parsedLaunchWithinDays,
      min_growth: parsedMinGrowth,
      sort_by: sort.sort_by,
      sort_order: sort.sort_order,
      limit: 20,
    };
  }, [searchInput, selectedCategory, parsedMinDailyUsers, parsedMinRating, parsedLaunchWithinDays, parsedMinGrowth, sortOption]);

  const baseFilterKey = useMemo(() => JSON.stringify(baseFilters), [baseFilters]);

  useEffect(() => {
    setCursor(undefined);
    setItems([]);
    setNextCursor(null);
    setHasMore(false);
    setTotalEstimate(undefined);
  }, [baseFilterKey]);

  const listQuery = useMiniApps({
    ...baseFilters,
    cursor,
  });

  useEffect(() => {
    if (!listQuery.data) return;

    const incoming = listQuery.data.data;
    if (cursor) {
      setItems((previous) => [
        ...previous,
        ...incoming.filter((incomingItem) => !previous.some((existing) => existing.mini_app_id === incomingItem.mini_app_id)),
      ]);
    } else {
      setItems(incoming);
    }
    setNextCursor(listQuery.data.page.next_cursor);
    setHasMore(Boolean(listQuery.data.page.has_more));
    if (listQuery.data.meta.total_estimate !== undefined) {
      setTotalEstimate(listQuery.data.meta.total_estimate);
    }
  }, [listQuery.data, cursor]);

  const summary = summaryQuery.data?.data;

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mini Apps Analytics</h1>
              <p className="text-muted-foreground">Explore and analyze Telegram mini apps</p>
            </div>
            <div className="flex items-center gap-2">
              {(["7d", "30d", "90d"] as MiniAppsSummaryPeriod[]).map((item) => (
                <Button
                  key={item}
                  variant={period === item ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPeriod(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {summaryQuery.isError && (
          <div className="bg-destructive/10 text-destructive rounded-xl p-4 flex items-center justify-between gap-4">
            <span>Failed to load mini-app summary.</span>
            <Button variant="outline" size="sm" onClick={() => summaryQuery.refetch()}>Retry</Button>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Mini Apps</CardDescription>
              <CardTitle className="text-3xl">{summary ? formatNumber(summary.total_mini_apps) : "-"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <span className="text-green-500">{summary ? formatDelta(summary.total_mini_apps_delta) : "-"}</span> this period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Daily Active Users</CardDescription>
              <CardTitle className="text-3xl">{summary ? formatCompactNumber(summary.daily_active_users) : "-"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <span className="text-green-500">
                  {summary ? `${formatDelta(summary.daily_active_users_delta_percent)}%` : "-"}
                </span>{" "}
                from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Sessions</CardDescription>
              <CardTitle className="text-3xl">{summary ? formatCompactNumber(summary.total_sessions) : "-"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <span className="text-green-500">
                  {summary ? `${formatDelta(summary.total_sessions_delta_percent)}%` : "-"}
                </span>{" "}
                from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg. Session Time</CardDescription>
              <CardTitle className="text-3xl">
                {summary ? formatSessionTime(summary.avg_session_seconds) : "-"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <span className="text-green-500">
                  {summary ? `${formatDelta(summary.avg_session_seconds_delta)}s` : "-"}
                </span>{" "}
                from last period
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search mini apps..."
                  className="pl-10"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.slug} value={category.slug}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
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
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

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
                    <Input
                      type="number"
                      placeholder="e.g., 100000"
                      value={minDailyUsersInput}
                      onChange={(event) => setMinDailyUsersInput(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Min. Rating</label>
                    <Select value={minRating} onValueChange={setMinRating}>
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
                    <Select value={launchWithinDays} onValueChange={setLaunchWithinDays}>
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
                    <Select value={minGrowth} onValueChange={setMinGrowth}>
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

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-2 bg-transparent p-0">
            {categories.map((category) => (
              <TabsTrigger
                key={category.slug}
                value={category.slug}
                data-testid={`category-tab-${category.slug}`}
                onClick={() => setSelectedCategory(category.slug)}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4"
              >
                {categoryIcons[category.slug] && <span className="mr-2">{categoryIcons[category.slug]}</span>}
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {listQuery.isError && (
          <div className="bg-destructive/10 text-destructive rounded-xl p-4 flex items-center justify-between gap-4">
            <span>Failed to load mini apps.</span>
            <Button variant="outline" size="sm" onClick={() => listQuery.refetch()}>Retry</Button>
          </div>
        )}

        {(listQuery.isLoading || (listQuery.isFetching && items.length === 0)) && (
          <div data-testid="mini-apps-page-loading" className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!listQuery.isLoading && items.length === 0 && !listQuery.isError ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">No mini apps found for current filters.</CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((app) => (
              <motion.div
                key={app.mini_app_id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                          {getInitials(app.name)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{app.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {getCategoryLabel(app.category_slug)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{formatCompactNumber(app.daily_users)} DAU</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className={app.growth_weekly >= 0 ? "text-green-500" : "text-red-500"}>
                          {app.growth_weekly >= 0 ? "+" : ""}{app.growth_weekly}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500" />
                        <span>{app.rating}</span>
                      </div>
                      <div className="text-muted-foreground">{formatCompactNumber(app.total_users)} total</div>
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
                    {items.map((app) => (
                      <tr key={app.mini_app_id} className="border-b hover:bg-muted/30">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                              {getInitials(app.name)}
                            </div>
                            <div>
                              <p className="font-medium">{app.name}</p>
                              <p className="text-sm text-muted-foreground">/{app.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary">{getCategoryLabel(app.category_slug)}</Badge>
                        </td>
                        <td className="p-4 text-right font-medium">{formatCompactNumber(app.daily_users)}</td>
                        <td className="p-4 text-right">{formatCompactNumber(app.total_users)}</td>
                        <td className="p-4 text-right">{formatCompactNumber(app.sessions)}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Star className="w-4 h-4 text-amber-500" />
                            {app.rating}
                          </div>
                        </td>
                        <td className={`p-4 text-right ${app.growth_weekly >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {app.growth_weekly >= 0 ? "+" : ""}{app.growth_weekly}%
                        </td>
                        <td className="p-4 text-right text-muted-foreground">{app.launched_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {hasMore && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => {
                if (!nextCursor || listQuery.isFetching) return;
                setCursor(nextCursor);
              }}
              disabled={!nextCursor || listQuery.isFetching}
            >
              {listQuery.isFetching ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}

        <p className="text-sm text-muted-foreground text-center">
          Showing {items.length} of {totalEstimate ?? items.length} mini apps
        </p>
      </div>
    </MainLayout>
  );
}
