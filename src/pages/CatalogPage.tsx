import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { Search, Filter, ChevronDown, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChannels } from "@/hooks/useChannels";
import { ChannelsTable } from "@/components/catalog/ChannelsTable";
import type { ChannelFilters } from "@/services/channelsApi";

const CatalogPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ChannelFilters>({
    sort_by: "subscribers",
    sort_order: "desc",
    limit: 20,
  });
  const [cursor, setCursor] = useState<string | undefined>();

  const { data, isLoading, isError } = useChannels({ ...filters, cursor });

  const handleSearch = useCallback(() => {
    setCursor(undefined);
    setFilters((prev) => ({ ...prev, q: searchInput || undefined }));
  }, [searchInput]);

  const handleFilterChange = (key: keyof ChannelFilters, value: string) => {
    setCursor(undefined);
    setFilters((prev) => ({ ...prev, [key]: value === "all" ? undefined : value }));
  };

  const handleErChange = (value: string) => {
    setCursor(undefined);
    if (value === "all") {
      setFilters((prev) => ({ ...prev, er_min: undefined, er_max: undefined }));
    } else if (value === "low") {
      setFilters((prev) => ({ ...prev, er_min: undefined, er_max: 2 }));
    } else if (value === "medium") {
      setFilters((prev) => ({ ...prev, er_min: 2, er_max: 5 }));
    } else {
      setFilters((prev) => ({ ...prev, er_min: 5, er_max: undefined }));
    }
  };

  const loadMore = () => {
    if (data?.page?.next_cursor) {
      setCursor(data.page.next_cursor);
    }
  };

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
            <h1 className="text-3xl font-bold text-foreground mb-2">Channel Catalog</h1>
            <p className="text-muted-foreground">
              Search and discover over {data?.meta?.total_estimate ? (data.meta.total_estimate / 1_000_000).toFixed(0) + " million" : "11 million"} Telegram channels
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
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-12"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </Button>
              <Button className="h-12 gradient-hero" onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border"
              >
                <Select onValueChange={(v) => handleFilterChange("country_code", v)}>
                  <SelectTrigger><SelectValue placeholder="Country" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="US">USA</SelectItem>
                    <SelectItem value="GB">UK</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="RU">Russia</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={(v) => handleFilterChange("category_slug", v)}>
                  <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="cryptocurrencies">Cryptocurrency</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="gaming">Gaming</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={(v) => handleFilterChange("size_bucket", v)}>
                  <SelectTrigger><SelectValue placeholder="Size" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    <SelectItem value="small">{"<"} 10K</SelectItem>
                    <SelectItem value="medium">10K - 100K</SelectItem>
                    <SelectItem value="large">100K - 1M</SelectItem>
                    <SelectItem value="huge">{">"} 1M</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={handleErChange}>
                  <SelectTrigger><SelectValue placeholder="Engagement Rate" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any ER</SelectItem>
                    <SelectItem value="low">{"<"} 2%</SelectItem>
                    <SelectItem value="medium">2% - 5%</SelectItem>
                    <SelectItem value="high">{">"} 5%</SelectItem>
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
                {data?.data ? (
                  <>Showing <strong className="text-foreground">{data.data.length}</strong> channels</>
                ) : isLoading ? "Loading..." : "No results"}
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

          {/* Error state */}
          {isError && (
            <div className="bg-destructive/10 text-destructive rounded-xl p-6 mb-6 text-center">
              Failed to load channels. Please check your API token and try again.
            </div>
          )}

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ChannelsTable channels={data?.data ?? []} isLoading={isLoading} />
          </motion.div>

          {/* Load More */}
          {data?.page?.has_more && (
            <div className="flex justify-center mt-6">
              <Button variant="outline" onClick={loadMore}>
                Load More
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default CatalogPage;
