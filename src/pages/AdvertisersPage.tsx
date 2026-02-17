import { useEffect, useMemo, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAdvertisers } from "@/hooks/useAdvertisers";
import { useAdvertisersSummary } from "@/hooks/useAdvertisersSummary";
import { useAdvertiserDetail } from "@/hooks/useAdvertiserDetail";
import type { Advertiser, AdvertisersFilters } from "@/services/advertisersApi";

type SortOption = "spend" | "ads" | "channels" | "engagement" | "growth";
type ActivityStatusOption = "all" | "active" | "recent";

const sortOptions: Array<{
  value: SortOption;
  label: string;
  sort_by: AdvertisersFilters["sort_by"];
  sort_order: AdvertisersFilters["sort_order"];
}> = [
  { value: "spend", label: "Highest Spend", sort_by: "estimated_spend", sort_order: "desc" },
  { value: "ads", label: "Most Ads", sort_by: "total_ads", sort_order: "desc" },
  { value: "channels", label: "Most Channels", sort_by: "channels_used", sort_order: "desc" },
  { value: "engagement", label: "Best Engagement", sort_by: "avg_engagement_rate", sort_order: "desc" },
  { value: "growth", label: "Fastest Growing", sort_by: "trend", sort_order: "desc" },
];

const timePeriods = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "365", label: "Last year" },
] as const;

function parseOptionalNumber(input: string): number | undefined {
  if (!input.trim()) return undefined;
  const value = Number(input);
  if (!Number.isFinite(value) || value < 0) return undefined;
  return value;
}

function formatCompactNumber(value?: number): string {
  if (value === undefined || Number.isNaN(value)) return "-";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatFullNumber(value?: number): string {
  if (value === undefined || Number.isNaN(value)) return "-";
  return new Intl.NumberFormat("en-US").format(value);
}

function formatCurrency(value?: number): string {
  if (value === undefined || Number.isNaN(value)) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatPercent(value?: number): string {
  if (value === undefined || Number.isNaN(value)) return "-";
  return `${value}%`;
}

function formatSigned(value?: number, suffix = ""): string {
  if (value === undefined || Number.isNaN(value)) return "-";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value}${suffix}`;
}

function formatIsoDate(value?: string | null): string {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toISOString().slice(0, 10);
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "?";
}

export default function AdvertisersPage() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("spend");
  const [timePeriodDays, setTimePeriodDays] = useState("30");
  const [minSpendInput, setMinSpendInput] = useState("");
  const [minChannelsInput, setMinChannelsInput] = useState("");
  const [minEngagement, setMinEngagement] = useState("any");
  const [activityStatus, setActivityStatus] = useState<ActivityStatusOption>("all");

  const [cursor, setCursor] = useState<string | undefined>();
  const [items, setItems] = useState<Advertiser[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalEstimate, setTotalEstimate] = useState<number | undefined>();
  const [industryMap, setIndustryMap] = useState<Record<string, string>>({});

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAdvertiserId, setSelectedAdvertiserId] = useState<string | undefined>();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchInput]);

  const parsedMinSpend = useMemo(() => parseOptionalNumber(minSpendInput), [minSpendInput]);
  const parsedMinChannels = useMemo(() => parseOptionalNumber(minChannelsInput), [minChannelsInput]);
  const parsedMinEngagement = useMemo(() => {
    if (minEngagement === "any") return undefined;
    const value = Number(minEngagement);
    return Number.isFinite(value) ? value : undefined;
  }, [minEngagement]);

  const selectedSort = useMemo(
    () => sortOptions.find((option) => option.value === sortOption) ?? sortOptions[0],
    [sortOption],
  );

  const baseFilters = useMemo<AdvertisersFilters>(() => {
    return {
      q: debouncedSearch.trim() || undefined,
      industry_slug: selectedIndustry === "all" ? undefined : selectedIndustry,
      time_period_days: Number(timePeriodDays),
      min_spend: parsedMinSpend,
      min_channels: parsedMinChannels,
      min_engagement: parsedMinEngagement,
      activity_status: activityStatus === "all" ? undefined : activityStatus,
      sort_by: selectedSort.sort_by,
      sort_order: selectedSort.sort_order,
      limit: 20,
    };
  }, [
    debouncedSearch,
    selectedIndustry,
    timePeriodDays,
    parsedMinSpend,
    parsedMinChannels,
    parsedMinEngagement,
    activityStatus,
    selectedSort.sort_by,
    selectedSort.sort_order,
  ]);

  const baseFilterKey = useMemo(() => JSON.stringify(baseFilters), [baseFilters]);

  useEffect(() => {
    setCursor(undefined);
    setItems([]);
    setNextCursor(null);
    setHasMore(false);
    setTotalEstimate(undefined);
  }, [baseFilterKey]);

  const listQuery = useAdvertisers({
    ...baseFilters,
    cursor,
  });

  const summaryQuery = useAdvertisersSummary(Number(timePeriodDays));

  useEffect(() => {
    if (!listQuery.data) return;

    const incoming = listQuery.data.data;

    setItems((previous) => {
      if (!cursor) {
        return incoming;
      }

      const seen = new Set(previous.map((item) => item.advertiser_id));
      const deduped = incoming.filter((item) => !seen.has(item.advertiser_id));
      return [...previous, ...deduped];
    });

    setNextCursor(listQuery.data.page.next_cursor);
    setHasMore(Boolean(listQuery.data.page.has_more));
    if (listQuery.data.meta.total_estimate !== undefined) {
      setTotalEstimate(listQuery.data.meta.total_estimate);
    }

    setIndustryMap((previous) => {
      const next = { ...previous };
      for (const advertiser of incoming) {
        if (advertiser.industry_slug) {
          next[advertiser.industry_slug] = advertiser.industry_name ?? advertiser.industry_slug;
        }
      }
      return next;
    });
  }, [listQuery.data, cursor]);

  const industryOptions = useMemo(() => {
    const options = Object.entries(industryMap)
      .map(([slug, label]) => ({ slug, label }))
      .sort((a, b) => a.label.localeCompare(b.label));

    if (selectedIndustry !== "all" && !options.some((option) => option.slug === selectedIndustry)) {
      options.unshift({ slug: selectedIndustry, label: selectedIndustry });
    }

    return [{ slug: "all", label: "All" }, ...options];
  }, [industryMap, selectedIndustry]);

  const selectedAdvertiser = useMemo(
    () => items.find((item) => item.advertiser_id === selectedAdvertiserId),
    [items, selectedAdvertiserId],
  );

  const detailQuery = useAdvertiserDetail(selectedAdvertiserId, dialogOpen);
  const detailAdvertiser = detailQuery.data?.data;
  const modalAdvertiser = detailAdvertiser ?? selectedAdvertiser;
  const summary = summaryQuery.data?.data;

  const openAdvertiserDialog = (advertiserId: string) => {
    setSelectedAdvertiserId(advertiserId);
    setDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-6">
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

        {summaryQuery.isError && (
          <div className="bg-destructive/10 text-destructive rounded-xl p-4 flex items-center justify-between gap-4">
            <span>Failed to load advertisers summary.</span>
            <Button variant="outline" size="sm" onClick={() => summaryQuery.refetch()}>Retry</Button>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Advertisers</CardDescription>
              <CardTitle className="text-3xl">
                {summary ? formatFullNumber(summary.active_advertisers) : "-"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <span className="text-green-500">
                  {summary ? formatSigned(summary.active_advertisers_delta) : "-"}
                </span>{" "}
                from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Ad Spend</CardDescription>
              <CardTitle className="text-3xl">
                {summary ? formatCurrency(summary.total_ad_spend) : "-"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <span className="text-green-500">
                  {summary ? formatSigned(summary.total_ad_spend_delta_percent, "%") : "-"}
                </span>{" "}
                from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Ad Campaigns</CardDescription>
              <CardTitle className="text-3xl">
                {summary ? formatCompactNumber(summary.ad_campaigns) : "-"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <span className="text-green-500">
                  {summary ? formatSigned(summary.ad_campaigns_delta_percent, "%") : "-"}
                </span>{" "}
                from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg. Engagement Rate</CardDescription>
              <CardTitle className="text-3xl">
                {summary ? formatPercent(summary.avg_engagement_rate) : "-"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <span className="text-green-500">
                  {summary ? formatSigned(summary.avg_engagement_rate_delta, "%") : "-"}
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
                  placeholder="Search advertisers..."
                  className="pl-10"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map((industry) => (
                      <SelectItem key={industry.slug} value={industry.slug}>
                        {industry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                  <SelectTrigger className="w-[170px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={timePeriodDays} onValueChange={setTimePeriodDays}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Time period" />
                  </SelectTrigger>
                  <SelectContent>
                    {timePeriods.map((period) => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    <label className="text-sm font-medium">Min. Ad Spend</label>
                    <Input
                      type="number"
                      placeholder="e.g., 100000"
                      value={minSpendInput}
                      onChange={(event) => setMinSpendInput(event.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Min. Channels</label>
                    <Input
                      type="number"
                      placeholder="e.g., 50"
                      value={minChannelsInput}
                      onChange={(event) => setMinChannelsInput(event.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Min. Engagement</label>
                    <Select value={minEngagement} onValueChange={setMinEngagement}>
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
                    <Select
                      value={activityStatus}
                      onValueChange={(value) => setActivityStatus(value as ActivityStatusOption)}
                    >
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

        <Tabs value={selectedIndustry} onValueChange={setSelectedIndustry} className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-2 bg-transparent p-0">
            {industryOptions.map((industry) => (
              <TabsTrigger
                key={industry.slug}
                value={industry.slug}
                data-testid={`industry-tab-${industry.slug}`}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4"
              >
                {industry.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {listQuery.isError && (
          <div className="bg-destructive/10 text-destructive rounded-xl p-4 flex items-center justify-between gap-4">
            <span>Failed to load advertisers.</span>
            <Button variant="outline" size="sm" onClick={() => listQuery.refetch()}>Retry</Button>
          </div>
        )}

        {(listQuery.isLoading || (listQuery.isFetching && items.length === 0)) && (
          <Card>
            <CardContent className="p-4 space-y-4" data-testid="advertisers-page-loading">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="grid grid-cols-9 gap-4 items-center">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-10 col-span-2" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-20 justify-self-end" />
                  <Skeleton className="h-6 w-16 justify-self-end" />
                  <Skeleton className="h-6 w-16 justify-self-end" />
                  <Skeleton className="h-6 w-14 justify-self-end" />
                  <Skeleton className="h-6 w-14 justify-self-end" />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {!listQuery.isLoading && items.length === 0 && !listQuery.isError && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No advertisers found for current filters.
            </CardContent>
          </Card>
        )}

        {!listQuery.isLoading && items.length > 0 && (
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
                    {items.map((advertiser, index) => (
                      <motion.tr
                        key={advertiser.advertiser_id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b hover:bg-muted/30"
                      >
                        <td className="p-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              advertiser.rank <= 3 ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            {advertiser.rank}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 rounded-lg">
                              {advertiser.logo_url ? (
                                <AvatarImage src={advertiser.logo_url} alt={advertiser.name} className="object-cover" />
                              ) : null}
                              <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                                {getInitials(advertiser.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{advertiser.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatFullNumber(advertiser.active_creatives)} active creatives
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <Badge variant="secondary">{advertiser.industry_name ?? advertiser.industry_slug ?? "Unknown"}</Badge>
                        </td>

                        <td className="p-4 text-right">
                          <span className="font-semibold text-green-500">{formatCurrency(advertiser.estimated_spend)}</span>
                        </td>
                        <td className="p-4 text-right font-medium">{formatCompactNumber(advertiser.total_ads)}</td>
                        <td className="p-4 text-right">{formatCompactNumber(advertiser.channels_used)}</td>
                        <td className="p-4 text-right">{formatPercent(advertiser.avg_engagement_rate)}</td>
                        <td className="p-4 text-right">
                          <div
                            className={`flex items-center justify-end gap-1 ${
                              advertiser.trend >= 0 ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {advertiser.trend >= 0 ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            {formatSigned(advertiser.trend, "%")}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={`Open details for ${advertiser.name}`}
                            onClick={() => openAdvertiserDialog(advertiser.advertiser_id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </motion.tr>
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
          Showing {items.length} of {totalEstimate ?? items.length} advertisers
        </p>

        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setSelectedAdvertiserId(undefined);
            }
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogDescription className="sr-only">
                Advertiser details and top channels.
              </DialogDescription>
              <div className="flex items-center gap-4 pr-6">
                <Avatar className="w-14 h-14 rounded-xl">
                  {modalAdvertiser?.logo_url ? (
                    <AvatarImage src={modalAdvertiser.logo_url} alt={modalAdvertiser.name} className="object-cover" />
                  ) : null}
                  <AvatarFallback className="rounded-xl bg-primary/10 text-primary text-lg font-semibold">
                    {modalAdvertiser ? getInitials(modalAdvertiser.name) : "?"}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <DialogTitle className="text-2xl">{modalAdvertiser?.name ?? "Advertiser"}</DialogTitle>
                  <div className="mt-1">
                    <Badge variant="secondary" className="mt-1">
                      {modalAdvertiser?.industry_name ?? modalAdvertiser?.industry_slug ?? "Unknown"}
                    </Badge>
                  </div>
                </div>
              </div>
            </DialogHeader>

            {detailQuery.isError && (
              <div className="bg-destructive/10 text-destructive rounded-xl p-4 flex items-center justify-between gap-4">
                <span>Failed to load advertiser details.</span>
                <Button variant="outline" size="sm" onClick={() => detailQuery.refetch()}>
                  Retry
                </Button>
              </div>
            )}

            {detailQuery.isLoading && (
              <div className="space-y-4 py-2" data-testid="advertiser-detail-loading">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="p-3 rounded-lg bg-muted/50 space-y-2">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-7 w-16" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-20 w-full" />
              </div>
            )}

            {modalAdvertiser && !detailQuery.isLoading && (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <DollarSign className="w-5 h-5 text-green-500 mb-1" />
                    <p className="text-lg font-bold">{formatCurrency(modalAdvertiser.estimated_spend)}</p>
                    <p className="text-xs text-muted-foreground">Est. Spend</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <Megaphone className="w-5 h-5 text-primary mb-1" />
                    <p className="text-lg font-bold">{formatCompactNumber(modalAdvertiser.total_ads)}</p>
                    <p className="text-xs text-muted-foreground">Total Ads</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <Users className="w-5 h-5 text-primary mb-1" />
                    <p className="text-lg font-bold">{formatCompactNumber(modalAdvertiser.channels_used)}</p>
                    <p className="text-xs text-muted-foreground">Channels Used</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <BarChart3 className="w-5 h-5 text-primary mb-1" />
                    <p className="text-lg font-bold">{formatPercent(modalAdvertiser.avg_engagement_rate)}</p>
                    <p className="text-xs text-muted-foreground">Avg. ER</p>
                  </div>
                </div>

                {detailAdvertiser?.description && (
                  <div className="space-y-1">
                    <h4 className="font-medium">Description</h4>
                    <p className="text-sm text-muted-foreground">{detailAdvertiser.description}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Top Channels
                  </h4>
                  {detailAdvertiser?.top_channels?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {detailAdvertiser.top_channels.map((channel) => (
                        <Badge key={channel.channel_id} variant="outline">
                          {channel.name}
                          {channel.username ? ` (${channel.username})` : ""}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No top channels available.</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Last active: {formatIsoDate(modalAdvertiser.last_active_at)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {formatFullNumber(modalAdvertiser.active_creatives)} active creatives
                  </div>
                </div>

                {detailAdvertiser?.website_url && (
                  <div className="text-sm text-muted-foreground">
                    Website: <span className="text-foreground">{detailAdvertiser.website_url}</span>
                  </div>
                )}

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
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
