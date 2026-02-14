import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  TrendingDown,
  Users,
  Globe,
  Tag,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCategoryRankings,
  useCountryRankings,
  useRankingCollections,
} from "@/hooks/useRankings";
import type { RankingChannel } from "@/services/channelsApi";

const DEFAULT_COUNTRY_CODE = "US";
const DEFAULT_CATEGORY_NAME = "Technology";

function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
}

function formatTrendValue(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value}%`;
}

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
  return (
    <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">
      {rank}
    </span>
  );
};

function RankingsRows({ channels }: { channels: RankingChannel[] }) {
  return (
    <div className="divide-y divide-border">
      {channels.map((channel, index) => {
        const isPositiveTrend = channel.trend_value >= 0;
        const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown;

        return (
          <motion.div
            key={channel.channel_id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors"
          >
            <div className="w-8 flex justify-center">
              <RankBadge rank={channel.rank} />
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
              {channel.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">{channel.name}</h3>
              <p className="text-sm text-muted-foreground">{channel.context_label}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-foreground font-medium">
                <Users className="w-4 h-4 text-muted-foreground" />
                {formatCompactNumber(channel.subscribers)}
              </div>
              <span
                className={`text-sm flex items-center gap-1 justify-end ${
                  isPositiveTrend ? "text-success" : "text-destructive"
                }`}
              >
                <TrendIcon className="w-3 h-3" />
                {formatTrendValue(channel.trend_value)}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function RankingsSkeleton({ testId }: { testId: string }) {
  return (
    <div className="p-4 space-y-4" data-testid={testId}>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4">
          <Skeleton className="w-8 h-5" />
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="w-20 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-16 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

function CollectionsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="collections-skeleton">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-card rounded-xl shadow-card p-6 space-y-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

const RankingsPage = () => {
  const {
    data: countryData,
    isLoading: isCountryLoading,
    isError: isCountryError,
    refetch: refetchCountries,
  } = useCountryRankings(DEFAULT_COUNTRY_CODE, 10);

  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
    refetch: refetchCategories,
  } = useCategoryRankings("technology", 10);

  const {
    data: collectionsData,
    isLoading: isCollectionsLoading,
    isError: isCollectionsError,
    refetch: refetchCollections,
  } = useRankingCollections(20);

  return (
    <MainLayout>
      <div className="pt-14 lg:pt-0 min-h-screen bg-background">
        <div className="container py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Rankings & Collections</h1>
            <p className="text-muted-foreground">
              Discover top channels by country, category, and curated collections
            </p>
          </motion.div>

          <Tabs defaultValue="countries" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <TabsList className="bg-card shadow-card p-1">
                <TabsTrigger value="countries" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  By Country
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  By Category
                </TabsTrigger>
                <TabsTrigger value="collections" className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Collections
                </TabsTrigger>
              </TabsList>
            </motion.div>

            <TabsContent value="countries">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl shadow-card overflow-hidden"
              >
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Country Rankings</h2>
                    <p className="text-sm text-muted-foreground">
                      Top {countryData?.meta.total_ranked_channels ?? 0} channels in{" "}
                      {countryData?.meta.country_name ?? "United States"}
                    </p>
                  </div>
                  <Badge variant="secondary">{countryData?.meta.country_code ?? DEFAULT_COUNTRY_CODE}</Badge>
                </div>

                {isCountryLoading && <RankingsSkeleton testId="country-rankings-skeleton" />}

                {isCountryError && (
                  <div className="p-6 text-center space-y-3" data-testid="country-rankings-error">
                    <p className="text-destructive">Failed to load country rankings.</p>
                    <Button variant="outline" size="sm" onClick={() => refetchCountries()}>
                      Retry
                    </Button>
                  </div>
                )}

                {!isCountryLoading && !isCountryError && !countryData?.data.length && (
                  <div className="p-8 text-center text-muted-foreground" data-testid="country-rankings-empty">
                    No rankings available.
                  </div>
                )}

                {!isCountryLoading && !isCountryError && Boolean(countryData?.data.length) && (
                  <RankingsRows channels={countryData?.data ?? []} />
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="categories">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl shadow-card overflow-hidden"
              >
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Category Rankings</h2>
                    <p className="text-sm text-muted-foreground">
                      Top {categoryData?.meta.total_ranked_channels ?? 0} channels in{" "}
                      {categoryData?.meta.category_name ?? DEFAULT_CATEGORY_NAME}
                    </p>
                  </div>
                  <Badge variant="secondary">{categoryData?.meta.category_name ?? DEFAULT_CATEGORY_NAME}</Badge>
                </div>

                {isCategoryLoading && <RankingsSkeleton testId="category-rankings-skeleton" />}

                {isCategoryError && (
                  <div className="p-6 text-center space-y-3" data-testid="category-rankings-error">
                    <p className="text-destructive">Failed to load category rankings.</p>
                    <Button variant="outline" size="sm" onClick={() => refetchCategories()}>
                      Retry
                    </Button>
                  </div>
                )}

                {!isCategoryLoading && !isCategoryError && !categoryData?.data.length && (
                  <div className="p-8 text-center text-muted-foreground" data-testid="category-rankings-empty">
                    No rankings available.
                  </div>
                )}

                {!isCategoryLoading && !isCategoryError && Boolean(categoryData?.data.length) && (
                  <RankingsRows channels={categoryData?.data ?? []} />
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="collections">
              {isCollectionsLoading && <CollectionsSkeleton />}

              {isCollectionsError && (
                <div className="bg-card rounded-xl shadow-card p-6 text-center space-y-3" data-testid="collections-error">
                  <p className="text-destructive">Failed to load collections.</p>
                  <Button variant="outline" size="sm" onClick={() => refetchCollections()}>
                    Retry
                  </Button>
                </div>
              )}

              {!isCollectionsLoading && !isCollectionsError && !collectionsData?.data.length && (
                <div className="bg-card rounded-xl shadow-card p-8 text-center text-muted-foreground" data-testid="collections-empty">
                  No collections available.
                </div>
              )}

              {!isCollectionsLoading && !isCollectionsError && Boolean(collectionsData?.data.length) && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {collectionsData?.data.map((collection, index) => (
                    <motion.div
                      key={collection.collection_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={collection.cta_target}
                        className="block bg-card rounded-xl shadow-card p-6 hover:shadow-card-hover transition-all group border border-transparent hover:border-primary/20"
                      >
                        <div className="text-4xl mb-4">{collection.icon}</div>
                        <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                          {collection.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{collection.description}</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          {formatCompactNumber(collection.channels_count)} channels
                        </p>
                        <span className="text-primary text-sm font-medium flex items-center gap-1">
                          {collection.cta_label}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default RankingsPage;
