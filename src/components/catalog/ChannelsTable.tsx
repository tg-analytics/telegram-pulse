import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Channel } from "@/services/channelsApi";

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

interface ChannelsTableProps {
  channels: Channel[];
  isLoading: boolean;
}

export function ChannelsTable({ channels, isLoading }: ChannelsTableProps) {
  if (isLoading) {
    return (
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="p-6 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-20 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!channels.length) {
    return (
      <div className="bg-card rounded-xl shadow-card p-12 text-center">
        <p className="text-muted-foreground">No channels found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden">
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
            {channels.map((channel, index) => (
              <motion.tr
                key={channel.channel_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <Link to={`/channel/${channel.channel_id}`} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                      {channel.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {channel.name}
                        </span>
                        {channel.verified && <CheckCircle2 className="w-4 h-4 text-primary" />}
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
                  <GrowthCell value={channel.growth_24h} showIcon />
                </td>
                <td className="px-4 py-4 text-right">
                  <GrowthCell value={channel.growth_7d} />
                </td>
                <td className="px-4 py-4 text-right">
                  <GrowthCell value={channel.growth_30d} />
                </td>
                <td className="px-4 py-4 text-right font-medium">{channel.engagement_rate}%</td>
                <td className="px-4 py-4">
                  <Badge variant="secondary">{channel.category_slug}</Badge>
                </td>
                <td className="px-4 py-4">
                  {channel.scam ? (
                    <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                      <AlertTriangle className="w-3 h-3" />
                      Scam
                    </Badge>
                  ) : channel.verified ? (
                    <Badge className="bg-success/10 text-success border-success/20">Verified</Badge>
                  ) : (
                    <Badge variant="outline">Normal</Badge>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link to={`/channel/${channel.channel_id}`}>
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
    </div>
  );
}

function GrowthCell({ value, showIcon }: { value: number; showIcon?: boolean }) {
  const positive = value >= 0;
  return (
    <span className={`flex items-center justify-end gap-1 ${positive ? "text-success" : "text-destructive"}`}>
      {showIcon && (positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />)}
      {positive ? "+" : ""}{value}%
    </span>
  );
}
