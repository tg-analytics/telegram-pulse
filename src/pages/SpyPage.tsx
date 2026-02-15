import { useMemo, useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Plus,
  Trash2,
  Edit,
  Clock,
  MessageSquare,
  Hash,
  AtSign,
  MoreVertical,
  ExternalLink,
  Pause,
  Play,
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
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTrackers } from "@/hooks/useTrackers";
import { useTrackerMentions } from "@/hooks/useTrackerMentions";
import {
  createTracker,
  deleteTracker,
  updateTracker,
  type Tracker,
  type TrackerMention,
  type TrackerType,
  type TrackerStatus,
} from "@/services/trackersApi";

function formatRelativeTime(iso?: string | null): string {
  if (!iso) {
    return "No activity yet";
  }

  const parsed = parseISO(iso);
  if (Number.isNaN(parsed.getTime())) {
    return "No activity yet";
  }

  return formatDistanceToNow(parsed, { addSuffix: true });
}

function sortMentionsDesc(a: TrackerMention, b: TrackerMention) {
  const aTime = Date.parse(a.mentioned_at);
  const bTime = Date.parse(b.mentioned_at);

  if (!Number.isNaN(aTime) && !Number.isNaN(bTime) && aTime !== bTime) {
    return bTime - aTime;
  }

  return b.mention_seq - a.mention_seq;
}

const SpyPage = () => {
  const { session } = useAuth();
  const accountId = session?.account_id;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [trackerType, setTrackerType] = useState<TrackerType>("keyword");
  const [trackerValue, setTrackerValue] = useState("");
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifyTelegram, setNotifyTelegram] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTracker, setEditingTracker] = useState<Tracker | null>(null);
  const [editNotifyPush, setEditNotifyPush] = useState(true);
  const [editNotifyTelegram, setEditNotifyTelegram] = useState(true);
  const [editNotifyEmail, setEditNotifyEmail] = useState(false);

  const openEditDialog = (tracker: Tracker) => {
    setEditingTracker(tracker);
    setEditNotifyPush(tracker.notify_push);
    setEditNotifyTelegram(tracker.notify_telegram);
    setEditNotifyEmail(tracker.notify_email);
    setEditDialogOpen(true);
  };

  const trackersQuery = useTrackers(accountId);
  const mentionsQuery = useTrackerMentions(accountId, { limit: 50 });

  const trackers = trackersQuery.data?.data ?? [];
  const mentions = useMemo(
    () => [...(mentionsQuery.data?.data ?? [])].sort(sortMentionsDesc),
    [mentionsQuery.data?.data],
  );

  const trackerValueById = useMemo(() => {
    const entries = trackers.map((tracker) => [tracker.tracker_id, tracker.tracker_value] as const);
    return new Map(entries);
  }, [trackers]);

  const activeTrackerCount = useMemo(
    () => trackers.filter((tracker) => tracker.status === "active").length,
    [trackers],
  );

  const invalidateSpyQueries = async () => {
    if (!accountId) return;

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["trackers", accountId] }),
      queryClient.invalidateQueries({ queryKey: ["tracker-mentions", accountId] }),
    ]);
  };

  const createTrackerMutation = useMutation({
    mutationFn: async () => {
      if (!accountId) {
        throw new Error("Account session is missing.");
      }

      return createTracker(accountId, {
        tracker_type: trackerType,
        tracker_value: trackerValue.trim(),
        notify_push: notifyPush,
        notify_telegram: notifyTelegram,
        notify_email: notifyEmail,
      });
    },
    onSuccess: async () => {
      await invalidateSpyQueries();
      setDialogOpen(false);
      setTrackerType("keyword");
      setTrackerValue("");
      setNotifyPush(true);
      setNotifyTelegram(true);
      setNotifyEmail(false);
      toast({ title: "Tracker created", description: "Your new tracker is now active." });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to create tracker.";
      toast({
        title: "Create tracker failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  const editTrackerMutation = useMutation({
    mutationFn: async () => {
      if (!accountId || !editingTracker) {
        throw new Error("Account session or tracker is missing.");
      }

      return updateTracker(accountId, editingTracker.tracker_id, {
        notify_push: editNotifyPush,
        notify_telegram: editNotifyTelegram,
        notify_email: editNotifyEmail,
      });
    },
    onSuccess: async () => {
      await invalidateSpyQueries();
      setEditDialogOpen(false);
      setEditingTracker(null);
      toast({ title: "Tracker updated", description: "Notification settings saved." });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to update tracker.";
      toast({ title: "Update tracker failed", description: message, variant: "destructive" });
    },
  });

  const updateTrackerMutation = useMutation({
    mutationFn: async ({ tracker, nextStatus }: { tracker: Tracker; nextStatus: TrackerStatus }) => {
      if (!accountId) {
        throw new Error("Account session is missing.");
      }

      return updateTracker(accountId, tracker.tracker_id, { status: nextStatus });
    },
    onSuccess: async (_response, variables) => {
      await invalidateSpyQueries();
      toast({
        title: variables.nextStatus === "paused" ? "Tracker paused" : "Tracker resumed",
        description:
          variables.nextStatus === "paused"
            ? "Mentions for this tracker are paused."
            : "Mentions for this tracker are active again.",
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to update tracker.";
      toast({
        title: "Update tracker failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  const deleteTrackerMutation = useMutation({
    mutationFn: async (tracker: Tracker) => {
      if (!accountId) {
        throw new Error("Account session is missing.");
      }

      await deleteTracker(accountId, tracker.tracker_id);
      return tracker;
    },
    onSuccess: async (tracker) => {
      await invalidateSpyQueries();
      toast({ title: "Tracker deleted", description: `${tracker.tracker_value} was removed.` });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to delete tracker.";
      toast({
        title: "Delete tracker failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  const hasMissingAccount = !accountId;

  return (
    <MainLayout>
      <div className="pt-14 lg:pt-0 min-h-screen bg-background">
        <div className="container py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Event Tracking</h1>
              <p className="text-muted-foreground">
                Monitor keywords and channels in real-time with instant alerts
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-hero" disabled={hasMissingAccount}>
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
                  <Tabs
                    value={trackerType}
                    onValueChange={(value) => setTrackerType(value as TrackerType)}
                  >
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
                        <Input
                          id="keyword"
                          placeholder="e.g., bitcoin price, AI news"
                          value={trackerType === "keyword" ? trackerValue : ""}
                          onChange={(event) => setTrackerValue(event.target.value)}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="channel" className="pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="channel">Channel username</Label>
                        <Input
                          id="channel"
                          placeholder="e.g., @technewsdaily"
                          value={trackerType === "channel" ? trackerValue : ""}
                          onChange={(event) => setTrackerValue(event.target.value)}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-push">Push notifications</Label>
                    <Switch id="notify-push" checked={notifyPush} onCheckedChange={setNotifyPush} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-telegram">Telegram bot alerts</Label>
                    <Switch
                      id="notify-telegram"
                      checked={notifyTelegram}
                      onCheckedChange={setNotifyTelegram}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-email">Email notifications</Label>
                    <Switch id="notify-email" checked={notifyEmail} onCheckedChange={setNotifyEmail} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="gradient-hero"
                    onClick={() => createTrackerMutation.mutate()}
                    disabled={!trackerValue.trim() || createTrackerMutation.isPending}
                  >
                    {createTrackerMutation.isPending ? "Creating..." : "Create Tracker"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Tracker</DialogTitle>
                  <DialogDescription>
                    Update notification settings for this tracker
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Tabs value={editingTracker?.tracker_type ?? "keyword"}>
                    <TabsList className="w-full">
                      <TabsTrigger value="keyword" className="flex-1" disabled>
                        <Hash className="w-4 h-4 mr-2" />
                        Keyword
                      </TabsTrigger>
                      <TabsTrigger value="channel" className="flex-1" disabled>
                        <AtSign className="w-4 h-4 mr-2" />
                        Channel
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="keyword" className="pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-keyword">Keyword to track</Label>
                        <Input id="edit-keyword" value={editingTracker?.tracker_value ?? ""} disabled />
                      </div>
                    </TabsContent>
                    <TabsContent value="channel" className="pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-channel">Channel username</Label>
                        <Input id="edit-channel" value={editingTracker?.tracker_value ?? ""} disabled />
                      </div>
                    </TabsContent>
                  </Tabs>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-notify-push">Push notifications</Label>
                    <Switch id="edit-notify-push" checked={editNotifyPush} onCheckedChange={setEditNotifyPush} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-notify-telegram">Telegram bot alerts</Label>
                    <Switch id="edit-notify-telegram" checked={editNotifyTelegram} onCheckedChange={setEditNotifyTelegram} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-notify-email">Email notifications</Label>
                    <Switch id="edit-notify-email" checked={editNotifyEmail} onCheckedChange={setEditNotifyEmail} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="gradient-hero"
                    onClick={() => editTrackerMutation.mutate()}
                    disabled={editTrackerMutation.isPending}
                  >
                    {editTrackerMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>

          {hasMissingAccount && (
            <div className="bg-destructive/10 text-destructive rounded-xl p-4 mb-6">
              You must sign in to manage trackers.
            </div>
          )}

          {(trackersQuery.isError || mentionsQuery.isError) && !hasMissingAccount && (
            <div className="bg-destructive/10 text-destructive rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
              <span>
                Failed to load event tracking data.
                {trackersQuery.error instanceof Error || mentionsQuery.error instanceof Error
                  ? ` ${trackersQuery.error instanceof Error ? trackersQuery.error.message : mentionsQuery.error instanceof Error ? mentionsQuery.error.message : ""}`
                  : ""}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  trackersQuery.refetch();
                  mentionsQuery.refetch();
                }}
              >
                Retry
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1 bg-card rounded-xl shadow-card overflow-hidden"
            >
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Active Trackers</h2>
                <p className="text-sm text-muted-foreground">{activeTrackerCount} active</p>
              </div>
              {trackersQuery.isLoading ? (
                <div className="p-4 text-sm text-muted-foreground">Loading trackers...</div>
              ) : (
                <div className="divide-y divide-border">
                  {trackers.map((tracker) => (
                    <div key={tracker.tracker_id} className="p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {tracker.tracker_type === "keyword" ? (
                            <Hash className="w-4 h-4 text-primary" />
                          ) : (
                            <AtSign className="w-4 h-4 text-primary" />
                          )}
                          <span className="font-medium text-foreground">{tracker.tracker_value}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(tracker)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={updateTrackerMutation.isPending}
                              onClick={() =>
                                updateTrackerMutation.mutate({
                                  tracker,
                                  nextStatus: tracker.status === "active" ? "paused" : "active",
                                })
                              }
                            >
                              {tracker.status === "active" ? (
                                <Pause className="w-4 h-4 mr-2" />
                              ) : (
                                <Play className="w-4 h-4 mr-2" />
                              )}
                              {tracker.status === "active" ? "Pause" : "Resume"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              disabled={deleteTrackerMutation.isPending}
                              onClick={() => deleteTrackerMutation.mutate(tracker)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {tracker.mentions_count} mentions
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatRelativeTime(tracker.last_activity_at)}
                        </span>
                      </div>
                      <div className="mt-2">
                        <Badge variant={tracker.status === "active" ? "default" : "secondary"}>
                          {tracker.status === "active" ? "Active" : "Paused"}
                        </Badge>
                      </div>
                    </div>
                  ))}

                  {!trackers.length && !trackersQuery.isLoading && (
                    <div className="p-4 text-sm text-muted-foreground">No trackers yet. Create one to get started.</div>
                  )}
                </div>
              )}
            </motion.div>

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
              {mentionsQuery.isLoading ? (
                <div className="p-4 text-sm text-muted-foreground">Loading mentions...</div>
              ) : (
                <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                  {mentions.map((mention) => (
                    <div key={mention.mention_id} className="p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {mention.mention_text || trackerValueById.get(mention.tracker_id) || "Mention"}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            in {mention.channel_name ?? "Unknown channel"}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatRelativeTime(mention.mentioned_at)}
                        </span>
                      </div>
                      <p className="text-foreground mb-3">{mention.context_snippet ?? mention.mention_text}</p>
                      <Button variant="ghost" size="sm" disabled>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Post
                      </Button>
                    </div>
                  ))}

                  {!mentions.length && !mentionsQuery.isLoading && (
                    <div className="p-4 text-sm text-muted-foreground">
                      No mentions yet. Mentions will appear here in real-time.
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SpyPage;
