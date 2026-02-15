import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  User,
  Shield,
  Key,
  Settings,
  Bell,
  CreditCard,
  Users,
  Download,
  Plus,
  Copy,
  Check,
  X,
  Trash2,
  MessageSquare,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useAccountProfile } from "@/hooks/useAccountProfile";
import { useAccountTeam } from "@/hooks/useAccountTeam";
import { useAccountApiKeys } from "@/hooks/useAccountApiKeys";
import { useAccountBilling } from "@/hooks/useAccountBilling";
import { useAccountChannels } from "@/hooks/useAccountChannels";

type ThemeValue = "light" | "dark" | "system";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function formatDate(value?: string | null) {
  if (!value) return "Never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString();
}

function formatDateTime(value?: string | null) {
  if (!value) return "Never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleString();
}

function initials(first?: string | null, last?: string | null) {
  const firstInitial = first?.trim()?.[0] ?? "";
  const lastInitial = last?.trim()?.[0] ?? "";
  const joined = `${firstInitial}${lastInitial}`.toUpperCase();
  return joined || "U";
}

export default function AccountPage() {
  const { session } = useAuth();
  const accountId = session?.account_id;

  const profile = useAccountProfile();
  const team = useAccountTeam(accountId);
  const api = useAccountApiKeys(accountId);
  const billing = useAccountBilling(accountId);
  const accountChannels = useAccountChannels(accountId);

  const [addApiKeyDialogOpen, setAddApiKeyDialogOpen] = useState(false);
  const [addChannelDialogOpen, setAddChannelDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");

  const [languageCode, setLanguageCode] = useState("en");
  const [timezone, setTimezone] = useState("UTC");
  const [theme, setTheme] = useState<ThemeValue>("system");

  const [emailNotifications, setEmailNotifications] = useState(false);
  const [telegramBotAlerts, setTelegramBotAlerts] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [marketingUpdates, setMarketingUpdates] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");
  const [channelId, setChannelId] = useState("");
  const [aliasName, setAliasName] = useState("");
  const [monitoringEnabled, setMonitoringEnabled] = useState(true);

  const [apiKeyName, setApiKeyName] = useState("");
  const [scopeReadChannels, setScopeReadChannels] = useState(true);
  const [scopeReadAds, setScopeReadAds] = useState(true);
  const [scopeExport, setScopeExport] = useState(false);
  const [rateLimit, setRateLimit] = useState("1000");
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);

  const [planCode, setPlanCode] = useState("pro");
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);

  const me = profile.meQuery.data;
  const preferences = profile.preferencesQuery.data?.data;
  const notifications = profile.notificationsQuery.data?.data;

  useEffect(() => {
    if (!me) return;
    setFirstName(me.first_name ?? "");
    setLastName(me.last_name ?? "");
    setTelegramUsername(me.telegram_username ?? "");
  }, [me]);

  useEffect(() => {
    if (!preferences) return;
    setLanguageCode(preferences.language_code);
    setTimezone(preferences.timezone);
    setTheme(preferences.theme);
  }, [preferences]);

  useEffect(() => {
    if (!notifications) return;
    setEmailNotifications(notifications.email_notifications);
    setTelegramBotAlerts(notifications.telegram_bot_alerts);
    setWeeklyReports(notifications.weekly_reports);
    setMarketingUpdates(notifications.marketing_updates);
    setPushNotifications(notifications.push_notifications);
  }, [notifications]);

  useEffect(() => {
    const subscription = billing.subscriptionQuery.data?.data;
    if (!subscription) return;
    setPlanCode(subscription.plan_code);
    setCancelAtPeriodEnd(subscription.cancel_at_period_end);
  }, [billing.subscriptionQuery.data?.data]);

  const apiUsage = api.apiUsageQuery.data?.data;
  const successRate = useMemo(() => {
    if (!apiUsage) return null;
    return Math.max(0, 100 - apiUsage.error_rate);
  }, [apiUsage]);

  const invoices = useMemo(
    () => billing.invoicesQuery.data?.pages.flatMap((page) => page.data) ?? [],
    [billing.invoicesQuery.data?.pages],
  );

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard", description: `${label} copied successfully` });
  };

  const handleProfileSave = async () => {
    try {
      await profile.updateMeMutation.mutateAsync({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        telegram_username: telegramUsername.trim(),
      });
      toast({ title: "Profile updated", description: "Your personal information was saved." });
    } catch (error) {
      toast({
        title: "Profile update failed",
        description: getErrorMessage(error, "Could not save profile changes."),
        variant: "destructive",
      });
    }
  };

  const handlePreferencesSave = async () => {
    try {
      await profile.updatePreferencesMutation.mutateAsync({
        language_code: languageCode,
        timezone,
        theme,
      });
      toast({ title: "Preferences saved", description: "Your preferences were updated." });
    } catch (error) {
      toast({
        title: "Preferences update failed",
        description: getErrorMessage(error, "Could not save preferences."),
        variant: "destructive",
      });
    }
  };

  const handleNotificationsSave = async () => {
    try {
      await profile.updateNotificationsMutation.mutateAsync({
        email_notifications: emailNotifications,
        telegram_bot_alerts: telegramBotAlerts,
        weekly_reports: weeklyReports,
        marketing_updates: marketingUpdates,
        push_notifications: pushNotifications,
      });
      toast({ title: "Notifications updated", description: "Notification settings were saved." });
    } catch (error) {
      toast({
        title: "Notification update failed",
        description: getErrorMessage(error, "Could not save notifications."),
        variant: "destructive",
      });
    }
  };

  const handleInviteMember = async () => {
    try {
      await team.inviteMemberMutation.mutateAsync({
        email: inviteEmail.trim(),
        role: inviteRole,
        channel_access: [],
      });
      setInviteEmail("");
      setInviteRole("viewer");
      setInviteDialogOpen(false);
      toast({ title: "Invitation sent", description: "Team invitation has been sent." });
    } catch (error) {
      toast({
        title: "Invite failed",
        description: getErrorMessage(error, "Could not send team invitation."),
        variant: "destructive",
      });
    }
  };

  const handleAddChannel = async () => {
    try {
      await accountChannels.addChannelMutation.mutateAsync({
        channel_id: channelId.trim(),
        alias_name: aliasName.trim(),
        monitoring_enabled: monitoringEnabled,
        is_favorite: false,
      });

      setChannelId("");
      setAliasName("");
      setMonitoringEnabled(true);
      setAddChannelDialogOpen(false);

      toast({ title: "Channel added", description: "Channel has been connected to this account." });
    } catch (error) {
      toast({
        title: "Add channel failed",
        description: getErrorMessage(error, "Could not add channel."),
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (memberId: string, label: string) => {
    const confirmed = window.confirm(`Remove ${label} from this account?`);
    if (!confirmed) return;

    try {
      await team.removeMemberMutation.mutateAsync(memberId);
      toast({ title: "Member removed", description: `${label} has been removed.` });
    } catch (error) {
      toast({
        title: "Remove failed",
        description: getErrorMessage(error, "Could not remove member."),
        variant: "destructive",
      });
    }
  };

  const handleCreateApiKey = async () => {
    try {
      const scopes = [
        scopeReadChannels ? "read:channels" : null,
        scopeReadAds ? "read:ads" : null,
        scopeExport ? "export" : null,
      ].filter(Boolean) as string[];

      const response = await api.createApiKeyMutation.mutateAsync({
        name: apiKeyName.trim(),
        scopes,
        rate_limit_per_hour: Number(rateLimit),
      });

      setCreatedSecret(response.data.secret);
      setApiKeyName("");
      setScopeReadChannels(true);
      setScopeReadAds(true);
      setScopeExport(false);
      setRateLimit("1000");

      toast({ title: "API key created", description: "Secret is shown once. Copy it now." });
    } catch (error) {
      toast({
        title: "Create API key failed",
        description: getErrorMessage(error, "Could not create API key."),
        variant: "destructive",
      });
    }
  };

  const handleRevokeApiKey = async (apiKeyId: string, name: string) => {
    const confirmed = window.confirm(`Revoke API key \"${name}\"?`);
    if (!confirmed) return;

    try {
      await api.revokeApiKeyMutation.mutateAsync(apiKeyId);
      toast({ title: "API key revoked", description: `${name} is no longer active.` });
    } catch (error) {
      toast({
        title: "Revoke failed",
        description: getErrorMessage(error, "Could not revoke API key."),
        variant: "destructive",
      });
    }
  };

  const handleSaveSubscription = async () => {
    try {
      await billing.updateSubscriptionMutation.mutateAsync({
        plan_code: planCode,
        cancel_at_period_end: cancelAtPeriodEnd,
      });
      toast({ title: "Subscription updated", description: "Billing plan settings were updated." });
    } catch (error) {
      toast({
        title: "Subscription update failed",
        description: getErrorMessage(error, "Could not update subscription."),
        variant: "destructive",
      });
    }
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const response = await billing.invoiceDownloadMutation.mutateAsync(invoiceId);
      window.open(response.data.url, "_blank", "noopener,noreferrer");
      toast({ title: "Download started", description: "Invoice link opened in a new tab." });
    } catch (error) {
      toast({
        title: "Download failed",
        description: getErrorMessage(error, "Could not get invoice download link."),
        variant: "destructive",
      });
    }
  };

  const accountMissing = !accountId;

  const teamMembers = team.teamQuery.data?.data ?? [];
  const channels = accountChannels.channels;
  const apiKeys = api.activeApiKeys;
  const subscription = billing.subscriptionQuery.data?.data;
  const usage = billing.usageQuery.data?.data;

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
          <p className="text-muted-foreground">Manage your profile, channels, and API access</p>
        </motion.div>

        {accountMissing && (
          <Card className="border-destructive/50">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">
                Account session is missing. Please sign in again to manage account settings.
              </p>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="channels" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">My Channels</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="gap-2">
              <Key className="w-4 h-4" />
              <span className="hidden sm:inline">API Keys</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Team</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.meQuery.isError && (
                    <p className="text-sm text-destructive">{getErrorMessage(profile.meQuery.error, "Failed to load profile.")}</p>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                      {initials(firstName, lastName)}
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        disabled={profile.meQuery.isLoading || accountMissing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        disabled={profile.meQuery.isLoading || accountMissing}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={me?.email ?? ""} disabled readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telegram">Telegram Username</Label>
                    <Input
                      id="telegram"
                      value={telegramUsername}
                      onChange={(event) => setTelegramUsername(event.target.value)}
                      disabled={profile.meQuery.isLoading || accountMissing}
                    />
                  </div>
                  <Button
                    className="w-full sm:w-auto"
                    onClick={handleProfileSave}
                    disabled={profile.updateMeMutation.isPending || accountMissing}
                  >
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Security
                  </CardTitle>
                  <CardDescription>Manage your security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" disabled />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Backend endpoint is not available yet</p>
                    </div>
                    <Switch disabled />
                  </div>
                  <Button className="w-full sm:w-auto" disabled>
                    Not Available Yet
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    Notifications
                  </CardTitle>
                  <CardDescription>Configure notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.notificationsQuery.isError && (
                    <p className="text-sm text-destructive">
                      {getErrorMessage(profile.notificationsQuery.error, "Failed to load notifications.")}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <Label>Email Notifications</Label>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                      disabled={profile.notificationsQuery.isLoading || accountMissing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Telegram Bot Alerts</Label>
                    <Switch
                      checked={telegramBotAlerts}
                      onCheckedChange={setTelegramBotAlerts}
                      disabled={profile.notificationsQuery.isLoading || accountMissing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Weekly Reports</Label>
                    <Switch
                      checked={weeklyReports}
                      onCheckedChange={setWeeklyReports}
                      disabled={profile.notificationsQuery.isLoading || accountMissing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Marketing Updates</Label>
                    <Switch
                      checked={marketingUpdates}
                      onCheckedChange={setMarketingUpdates}
                      disabled={profile.notificationsQuery.isLoading || accountMissing}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Push Notifications</Label>
                    <Switch
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                      disabled={profile.notificationsQuery.isLoading || accountMissing}
                    />
                  </div>
                  <Button
                    className="w-full sm:w-auto"
                    onClick={handleNotificationsSave}
                    disabled={profile.updateNotificationsMutation.isPending || accountMissing}
                  >
                    Save Notifications
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Preferences
                  </CardTitle>
                  <CardDescription>Customize your experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.preferencesQuery.isError && (
                    <p className="text-sm text-destructive">
                      {getErrorMessage(profile.preferencesQuery.error, "Failed to load preferences.")}
                    </p>
                  )}
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select
                      value={languageCode}
                      onValueChange={setLanguageCode}
                      disabled={profile.preferencesQuery.isLoading || accountMissing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ru">Russian</SelectItem>
                        <SelectItem value="uk">Ukrainian</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Input
                      value={timezone}
                      onChange={(event) => setTimezone(event.target.value)}
                      disabled={profile.preferencesQuery.isLoading || accountMissing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select
                      value={theme}
                      onValueChange={(value) => setTheme(value as ThemeValue)}
                      disabled={profile.preferencesQuery.isLoading || accountMissing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    className="w-full sm:w-auto"
                    onClick={handlePreferencesSave}
                    disabled={profile.updatePreferencesMutation.isPending || accountMissing}
                  >
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="channels" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Channels</CardTitle>
                  <CardDescription>
                    Connected channels for this account with verification and monitoring status.
                  </CardDescription>
                </div>
                <Dialog
                  open={addChannelDialogOpen}
                  onOpenChange={(open) => {
                    setAddChannelDialogOpen(open);
                    if (!open) {
                      setChannelId("");
                      setAliasName("");
                      setMonitoringEnabled(true);
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button className="gap-2" disabled={accountMissing}>
                      <Plus className="w-4 h-4" />
                      Add Channel
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Channel</DialogTitle>
                      <DialogDescription>Connect a channel to this account.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="channelId">Channel ID</Label>
                        <Input
                          id="channelId"
                          value={channelId}
                          onChange={(event) => setChannelId(event.target.value)}
                          placeholder="9f28253d-8ffd-4d2f-a67c-ebaf0f6ba2f2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="aliasName">Alias Name</Label>
                        <Input
                          id="aliasName"
                          value={aliasName}
                          onChange={(event) => setAliasName(event.target.value)}
                          placeholder="Primary Tech Channel"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="monitoringEnabled">Monitoring enabled</Label>
                        <Switch
                          id="monitoringEnabled"
                          checked={monitoringEnabled}
                          onCheckedChange={setMonitoringEnabled}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAddChannelDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddChannel}
                        disabled={accountChannels.addChannelMutation.isPending || !channelId.trim() || accountMissing}
                      >
                        Connect Channel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-4">
                {accountChannels.channelsQuery.isLoading && (
                  <p className="text-sm text-muted-foreground">Loading channels...</p>
                )}

                {accountChannels.channelsQuery.isError && (
                  <p className="text-sm text-destructive">
                    {getErrorMessage(accountChannels.channelsQuery.error, "Failed to load account channels.")}
                  </p>
                )}

                {!accountChannels.channelsQuery.isLoading &&
                  !accountChannels.channelsQuery.isError &&
                  channels.length === 0 && (
                    <p className="text-sm text-muted-foreground">No channels connected to this account yet.</p>
                  )}

                <div className="space-y-3">
                  {channels.map((channel) => (
                    <div
                      key={channel.channel_id}
                      className="rounded-lg border p-4 bg-card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground">{channel.alias_name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{channel.channel_id}</p>
                        <p className="text-xs text-muted-foreground">Added {formatDate(channel.added_at)}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {channel.is_favorite && <Badge>Favorite</Badge>}
                        <Badge variant={channel.monitoring_enabled ? "default" : "secondary"}>
                          {channel.monitoring_enabled ? "Monitoring On" : "Monitoring Off"}
                        </Badge>
                        {channel.verified === true && <Badge variant="outline">Verified</Badge>}
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/channel/${channel.channel_id}`}>Open Channel</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {accountChannels.hasNextPage && (
                  <Button
                    variant="outline"
                    onClick={() => accountChannels.fetchNextPage()}
                    disabled={accountChannels.isFetchingNextPage || accountMissing}
                  >
                    {accountChannels.isFetchingNextPage ? "Loading..." : "Load More"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Manage your API keys for programmatic access</CardDescription>
                </div>
                <Dialog
                  open={addApiKeyDialogOpen}
                  onOpenChange={(open) => {
                    setAddApiKeyDialogOpen(open);
                    if (!open) {
                      setCreatedSecret(null);
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button className="gap-2" disabled={accountMissing}>
                      <Plus className="w-4 h-4" />
                      Create API Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New API Key</DialogTitle>
                      <DialogDescription>Generate a new API key for API access.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="keyName">Key Name</Label>
                        <Input id="keyName" value={apiKeyName} onChange={(event) => setApiKeyName(event.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Permissions</Label>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="font-normal">Read channel data</Label>
                            <Switch checked={scopeReadChannels} onCheckedChange={setScopeReadChannels} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="font-normal">Read advertising data</Label>
                            <Switch checked={scopeReadAds} onCheckedChange={setScopeReadAds} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="font-normal">Export data</Label>
                            <Switch checked={scopeExport} onCheckedChange={setScopeExport} />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Rate Limit</Label>
                        <Select value={rateLimit} onValueChange={setRateLimit}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="100">100 requests/hour</SelectItem>
                            <SelectItem value="1000">1,000 requests/hour</SelectItem>
                            <SelectItem value="10000">10,000 requests/hour</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {createdSecret && (
                        <div className="rounded-lg border p-3 bg-muted/50 space-y-2">
                          <p className="text-sm font-medium">Secret (shown once)</p>
                          <code className="block text-xs break-all">{createdSecret}</code>
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(createdSecret, "API key secret")}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Secret
                          </Button>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAddApiKeyDialogOpen(false)}>
                        Close
                      </Button>
                      <Button
                        onClick={handleCreateApiKey}
                        disabled={api.createApiKeyMutation.isPending || !apiKeyName.trim() || accountMissing}
                      >
                        Create Key
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {api.apiKeysQuery.isError && (
                  <p className="mb-4 text-sm text-destructive">{getErrorMessage(api.apiKeysQuery.error, "Failed to load API keys.")}</p>
                )}

                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.api_key_id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Key className="w-4 h-4 text-primary" />
                          <span className="font-semibold">{apiKey.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Prefix {apiKey.key_prefix} • Created {formatDate(apiKey.created_at)} • Last used {formatDateTime(apiKey.last_used_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleRevokeApiKey(apiKey.api_key_id, apiKey.name)}
                          disabled={api.revokeApiKeyMutation.isPending || accountMissing}
                          aria-label={`Revoke ${apiKey.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {!api.apiKeysQuery.isLoading && apiKeys.length === 0 && (
                    <p className="text-sm text-muted-foreground">No active API keys.</p>
                  )}
                </div>

                <div className="mt-6 p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">API Usage ({api.from} to {api.to})</h4>
                  {api.apiUsageQuery.isError ? (
                    <p className="text-sm text-destructive">{getErrorMessage(api.apiUsageQuery.error, "Failed to load usage metrics.")}</p>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-2xl font-bold">{apiUsage?.total_requests?.toLocaleString() ?? "-"}</p>
                        <p className="text-sm text-muted-foreground">Total Requests</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{successRate !== null ? `${successRate.toFixed(1)}%` : "-"}</p>
                        <p className="text-sm text-muted-foreground">Success Rate</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {typeof apiUsage?.avg_latency_ms === "number" ? `${apiUsage.avg_latency_ms.toFixed(1)}ms` : "-"}
                        </p>
                        <p className="text-sm text-muted-foreground">Avg. Response Time</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage who has access to your account</CardDescription>
                </div>
                <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2" disabled={accountMissing}>
                      <Plus className="w-4 h-4" />
                      Invite Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite Team Member</DialogTitle>
                      <DialogDescription>Add a new member to your account</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="inviteEmail">Email Address</Label>
                        <Input
                          id="inviteEmail"
                          type="email"
                          placeholder="colleague@example.com"
                          value={inviteEmail}
                          onChange={(event) => setInviteEmail(event.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Select value={inviteRole} onValueChange={setInviteRole}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleInviteMember}
                        disabled={team.inviteMemberMutation.isPending || !inviteEmail.trim() || accountMissing}
                      >
                        Send Invite
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {team.teamQuery.isError && (
                  <p className="mb-4 text-sm text-destructive">{getErrorMessage(team.teamQuery.error, "Failed to load team members.")}</p>
                )}

                <div className="space-y-4">
                  {teamMembers.map((member) => {
                    const fullName = [member.first_name, member.last_name].filter(Boolean).join(" ").trim();
                    const label = fullName || member.email;

                    return (
                      <div key={member.member_id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                            {initials(member.first_name, member.last_name)}
                          </div>
                          <div>
                            <p className="font-semibold">{label}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="secondary">{member.role}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleRemoveMember(member.member_id, label)}
                            disabled={team.removeMemberMutation.isPending || accountMissing}
                            aria-label={`Remove ${label}`}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {!team.teamQuery.isLoading && teamMembers.length === 0 && (
                    <p className="text-sm text-muted-foreground">No members found.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>Manage your subscription</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {billing.subscriptionQuery.isError && (
                    <p className="text-sm text-destructive">
                      {getErrorMessage(billing.subscriptionQuery.error, "Failed to load subscription.")}
                    </p>
                  )}
                  <div className="space-y-2">
                    <Label>Plan Code</Label>
                    <Input value={planCode} onChange={(event) => setPlanCode(event.target.value)} disabled={accountMissing} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Cancel at period end</p>
                      <p className="text-sm text-muted-foreground">
                        Current period ends {formatDate(subscription?.current_period_end)}
                      </p>
                    </div>
                    <Switch checked={cancelAtPeriodEnd} onCheckedChange={setCancelAtPeriodEnd} disabled={accountMissing} />
                  </div>
                  <Button
                    onClick={handleSaveSubscription}
                    disabled={billing.updateSubscriptionMutation.isPending || accountMissing}
                  >
                    Save Subscription
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usage This Month</CardTitle>
                  <CardDescription>
                    {billing.from} to {billing.to}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {billing.usageQuery.isError ? (
                    <p className="text-sm text-destructive">{getErrorMessage(billing.usageQuery.error, "Failed to load usage.")}</p>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span>Channel Searches</span>
                        <span>{usage?.channel_searches?.toLocaleString() ?? "-"}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Event Trackers</span>
                        <span>{usage?.event_trackers_count?.toLocaleString() ?? "-"}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>API Requests</span>
                        <span>{usage?.api_requests_count?.toLocaleString() ?? "-"}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Exports</span>
                        <span>{usage?.exports_count?.toLocaleString() ?? "-"}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Manage your payment details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {billing.paymentMethodsQuery.isError && (
                    <p className="text-sm text-destructive">
                      {getErrorMessage(billing.paymentMethodsQuery.error, "Failed to load payment methods.")}
                    </p>
                  )}
                  <div className="space-y-2">
                    {billing.sortedPaymentMethods.map((method) => (
                      <div key={method.payment_method_id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                          <p className="font-medium">
                            {method.brand} •••• {method.last4}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Expires {method.exp_month}/{method.exp_year}
                          </p>
                        </div>
                        {method.is_default && <Badge variant="secondary">Default</Badge>}
                      </div>
                    ))}
                    {!billing.paymentMethodsQuery.isLoading && billing.sortedPaymentMethods.length === 0 && (
                      <p className="text-sm text-muted-foreground">No payment methods found.</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => toast({ title: "Coming soon", description: "Payment method creation is not enabled yet." })}
                    disabled={accountMissing}
                  >
                    <Plus className="w-4 h-4" />
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>Your recent invoices</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {billing.invoicesQuery.isError && (
                    <p className="mb-4 text-sm text-destructive">{getErrorMessage(billing.invoicesQuery.error, "Failed to load invoices.")}</p>
                  )}
                  <div className="space-y-2">
                    {invoices.map((invoice) => (
                      <div key={invoice.invoice_id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div>
                          <p className="font-medium">{invoice.invoice_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {invoice.currency} {invoice.amount_total.toFixed(2)} • {invoice.period_start} to {invoice.period_end}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="secondary">{invoice.status}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadInvoice(invoice.invoice_id)}
                            disabled={billing.invoiceDownloadMutation.isPending || accountMissing}
                            aria-label={`Download ${invoice.invoice_number}`}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {!billing.invoicesQuery.isLoading && invoices.length === 0 && (
                      <p className="text-sm text-muted-foreground">No invoices found.</p>
                    )}
                  </div>

                  {billing.invoicesQuery.hasNextPage && (
                    <Button
                      variant="outline"
                      className="mt-4 w-full"
                      onClick={() => billing.invoicesQuery.fetchNextPage()}
                      disabled={billing.invoicesQuery.isFetchingNextPage || accountMissing}
                    >
                      {billing.invoicesQuery.isFetchingNextPage ? "Loading..." : "Load More"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
