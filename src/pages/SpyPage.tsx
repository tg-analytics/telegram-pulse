import { useState } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Eye,
  Plus,
  Bell,
  Trash2,
  Edit,
  Clock,
  MessageSquare,
  Hash,
  AtSign,
  MoreVertical,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockTrackers = [
  {
    id: 1,
    type: "keyword",
    value: "bitcoin price",
    mentions: 234,
    lastActivity: "5 min ago",
    active: true,
  },
  {
    id: 2,
    type: "channel",
    value: "@technewsdaily",
    mentions: 89,
    lastActivity: "1 hour ago",
    active: true,
  },
  {
    id: 3,
    type: "keyword",
    value: "AI breakthrough",
    mentions: 156,
    lastActivity: "30 min ago",
    active: true,
  },
  {
    id: 4,
    type: "channel",
    value: "@cryptoinsights",
    mentions: 45,
    lastActivity: "2 hours ago",
    active: false,
  },
];

const mockMentions = [
  {
    id: 1,
    tracker: "bitcoin price",
    channel: "@cryptoinsights",
    text: "📊 Bitcoin price hits new highs as institutional adoption accelerates...",
    time: "5 min ago",
  },
  {
    id: 2,
    tracker: "@technewsdaily",
    channel: "@technewsdaily",
    text: "🚀 Breaking: OpenAI announces GPT-5 with revolutionary capabilities...",
    time: "15 min ago",
  },
  {
    id: 3,
    tracker: "AI breakthrough",
    channel: "@aiweekly",
    text: "💡 Major AI breakthrough: New model achieves human-level reasoning...",
    time: "30 min ago",
  },
];

const SpyPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <MainLayout>
      <div className="pt-14 lg:pt-0 min-h-screen bg-background">
        <div className="container py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Event Tracking
              </h1>
              <p className="text-muted-foreground">
                Monitor keywords and channels in real-time with instant alerts
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-hero">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tracker
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Tracker</DialogTitle>
                  <DialogDescription>
                    Monitor keywords or channels and receive instant notifications
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Tabs defaultValue="keyword">
                    <TabsList className="w-full">
                      <TabsTrigger value="keyword" className="flex-1">
                        <Hash className="w-4 h-4 mr-2" />
                        Keyword
                      </TabsTrigger>
                      <TabsTrigger value="channel" className="flex-1">
                        <AtSign className="w-4 h-4 mr-2" />
                        Channel
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="keyword" className="pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="keyword">Keyword to track</Label>
                        <Input id="keyword" placeholder="e.g., bitcoin price, AI news" />
                      </div>
                    </TabsContent>
                    <TabsContent value="channel" className="pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="channel">Channel username</Label>
                        <Input id="channel" placeholder="e.g., @technewsdaily" />
                      </div>
                    </TabsContent>
                  </Tabs>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Push notifications</Label>
                    <Switch id="notifications" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="telegram-bot">Telegram bot alerts</Label>
                    <Switch id="telegram-bot" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="gradient-hero" onClick={() => setDialogOpen(false)}>
                    Create Tracker
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trackers List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1 bg-card rounded-xl shadow-card overflow-hidden"
            >
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Active Trackers</h2>
                <p className="text-sm text-muted-foreground">{mockTrackers.filter(t => t.active).length} active</p>
              </div>
              <div className="divide-y divide-border">
                {mockTrackers.map((tracker) => (
                  <div
                    key={tracker.id}
                    className="p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {tracker.type === "keyword" ? (
                          <Hash className="w-4 h-4 text-primary" />
                        ) : (
                          <AtSign className="w-4 h-4 text-primary" />
                        )}
                        <span className="font-medium text-foreground">{tracker.value}</span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {tracker.mentions} mentions
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {tracker.lastActivity}
                      </span>
                    </div>
                    <div className="mt-2">
                      <Badge variant={tracker.active ? "default" : "secondary"}>
                        {tracker.active ? "Active" : "Paused"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Real-time Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 bg-card rounded-xl shadow-card overflow-hidden"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-foreground">Real-time Feed</h2>
                  <p className="text-sm text-muted-foreground">Live mentions from your trackers</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-sm text-muted-foreground">Live</span>
                </div>
              </div>
              <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                {mockMentions.map((mention) => (
                  <div
                    key={mention.id}
                    className="p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{mention.tracker}</Badge>
                        <span className="text-sm text-muted-foreground">in {mention.channel}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{mention.time}</span>
                    </div>
                    <p className="text-foreground mb-3">{mention.text}</p>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Post
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SpyPage;
