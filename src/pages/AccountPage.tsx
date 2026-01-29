import { useState } from "react";
import { motion } from "framer-motion";
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
  Eye,
  EyeOff,
  Check,
  X,
  Trash2,
  RefreshCw,
  BadgeCheck,
  MessageSquare,
  BarChart3,
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
import { toast } from "@/hooks/use-toast";

// Mock data
const mockChannels = [
  {
    id: "1",
    name: "Tech News Daily",
    username: "@technewsdaily",
    subscribers: 125000,
    verified: true,
    avatar: "TN",
  },
  {
    id: "2",
    name: "Crypto Insights",
    username: "@cryptoinsights",
    subscribers: 89000,
    verified: false,
    avatar: "CI",
  },
  {
    id: "3",
    name: "Marketing Tips",
    username: "@marketingtips",
    subscribers: 45000,
    verified: false,
    avatar: "MT",
  },
];

const mockApiKeys = [
  {
    id: "1",
    name: "Production API",
    key: "tlm_prod_a1b2c3d4e5f6g7h8i9j0",
    created: "2024-01-15",
    lastUsed: "2024-01-28",
    requests: 15420,
  },
  {
    id: "2",
    name: "Development",
    key: "tlm_dev_x9y8z7w6v5u4t3s2r1q0",
    created: "2024-01-20",
    lastUsed: "2024-01-27",
    requests: 3250,
  },
];

const mockTeamMembers = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "Owner", avatar: "JD" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Admin", avatar: "JS" },
  { id: "3", name: "Bob Wilson", email: "bob@example.com", role: "Viewer", avatar: "BW" },
];

export default function AccountPage() {
  const [showApiKey, setShowApiKey] = useState<string | null>(null);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [addApiKeyDialogOpen, setAddApiKeyDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard", description: "API key copied successfully" });
  };

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile, channels, and API access
          </p>
        </motion.div>

        {/* Tabs */}
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

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                      JD
                    </div>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telegram">Telegram Username</Label>
                    <Input id="telegram" defaultValue="@johndoe" />
                  </div>
                  <Button className="w-full sm:w-auto">Save Changes</Button>
                </CardContent>
              </Card>

              {/* Security Settings */}
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
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <Button className="w-full sm:w-auto">Update Password</Button>
                </CardContent>
              </Card>

              {/* Notification Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    Notifications
                  </CardTitle>
                  <CardDescription>Configure notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates via email
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Telegram Bot Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified via Telegram
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive weekly analytics digest
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Product news and offers
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              {/* Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Preferences
                  </CardTitle>
                  <CardDescription>Customize your experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select defaultValue="en">
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
                    <Select defaultValue="utc">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">Eastern Time (EST)</SelectItem>
                        <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                        <SelectItem value="cet">Central European (CET)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Use dark theme
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* My Channels Tab */}
          <TabsContent value="channels" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Channels</CardTitle>
                  <CardDescription>
                    Manage your Telegram channels and verification status
                  </CardDescription>
                </div>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Channel
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockChannels.map((channel) => (
                    <div
                      key={channel.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                          {channel.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{channel.name}</span>
                            {channel.verified && (
                              <BadgeCheck className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {channel.username} • {channel.subscribers.toLocaleString()} subscribers
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {channel.verified ? (
                          <Badge className="bg-primary/10 text-primary border-0">
                            <Check className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                Verify Channel
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Verify Channel Ownership</DialogTitle>
                                <DialogDescription>
                                  Follow these steps to verify your channel ownership
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <h4 className="font-medium">Step 1: Add Verification Code</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Add the following code to your channel description temporarily:
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <code className="flex-1 p-2 bg-muted rounded text-sm">
                                      telemetrio-verify-abc123xyz
                                    </code>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => copyToClipboard("telemetrio-verify-abc123xyz")}
                                    >
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="font-medium">Step 2: Add Analytics Bot</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Add @TelemetrioBot as an admin to enable advanced analytics
                                  </p>
                                  <Button variant="outline" className="w-full">
                                    Open Bot in Telegram
                                  </Button>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="font-medium">Verification Benefits</h4>
                                  <ul className="text-sm text-muted-foreground space-y-1">
                                    <li className="flex items-center gap-2">
                                      <Check className="w-4 h-4 text-primary" />
                                      Verified badge on your channel
                                    </li>
                                    <li className="flex items-center gap-2">
                                      <Check className="w-4 h-4 text-primary" />
                                      Advanced audience demographics
                                    </li>
                                    <li className="flex items-center gap-2">
                                      <Check className="w-4 h-4 text-primary" />
                                      Invite link analytics
                                    </li>
                                    <li className="flex items-center gap-2">
                                      <Check className="w-4 h-4 text-primary" />
                                      Ad effectiveness reports
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setVerifyDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={() => {
                                  toast({ title: "Verification Started", description: "We're checking your channel..." });
                                  setVerifyDialogOpen(false);
                                }}>
                                  Verify Now
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                        <Button variant="ghost" size="sm">
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Channel Insights Card */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Subscribers</CardDescription>
                  <CardTitle className="text-3xl">259K</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-green-500">+12.5%</span> from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Views</CardDescription>
                  <CardTitle className="text-3xl">1.2M</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-green-500">+8.3%</span> from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Avg. Engagement Rate</CardDescription>
                  <CardTitle className="text-3xl">4.8%</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-green-500">+0.3%</span> from last month
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>
                    Manage your API keys for programmatic access
                  </CardDescription>
                </div>
                <Dialog open={addApiKeyDialogOpen} onOpenChange={setAddApiKeyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Create API Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New API Key</DialogTitle>
                      <DialogDescription>
                        Generate a new API key for accessing Telemetrio data
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="keyName">Key Name</Label>
                        <Input id="keyName" placeholder="e.g., Production API" />
                      </div>
                      <div className="space-y-2">
                        <Label>Permissions</Label>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="font-normal">Read channel data</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="font-normal">Read advertising data</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="font-normal">Export data</Label>
                            <Switch />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Rate Limit</Label>
                        <Select defaultValue="1000">
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
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAddApiKeyDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => {
                        toast({ title: "API Key Created", description: "Your new API key is ready to use" });
                        setAddApiKeyDialogOpen(false);
                      }}>
                        Create Key
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockApiKeys.map((apiKey) => (
                    <div
                      key={apiKey.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Key className="w-4 h-4 text-primary" />
                          <span className="font-semibold">{apiKey.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="text-sm text-muted-foreground font-mono">
                            {showApiKey === apiKey.id
                              ? apiKey.key
                              : apiKey.key.slice(0, 12) + "•".repeat(20)}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => setShowApiKey(showApiKey === apiKey.id ? null : apiKey.id)}
                          >
                            {showApiKey === apiKey.id ? (
                              <EyeOff className="w-3 h-3" />
                            ) : (
                              <Eye className="w-3 h-3" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(apiKey.key)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Created {apiKey.created} • Last used {apiKey.lastUsed} • {apiKey.requests.toLocaleString()} requests
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* API Usage Stats */}
                <div className="mt-6 p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">API Usage This Month</h4>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-2xl font-bold">18,670</p>
                      <p className="text-sm text-muted-foreground">Total Requests</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">99.9%</p>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">124ms</p>
                      <p className="text-sm text-muted-foreground">Avg. Response Time</p>
                    </div>
                  </div>
                </div>

                {/* API Documentation Link */}
                <div className="mt-4 flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h4 className="font-medium">API Documentation</h4>
                    <p className="text-sm text-muted-foreground">
                      Learn how to integrate with our REST API
                    </p>
                  </div>
                  <Button variant="outline">View Docs</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Manage who has access to your channels and data
                  </CardDescription>
                </div>
                <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Invite Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite Team Member</DialogTitle>
                      <DialogDescription>
                        Add a new member to your team
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="inviteEmail">Email Address</Label>
                        <Input id="inviteEmail" type="email" placeholder="colleague@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Select defaultValue="viewer">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin - Full access</SelectItem>
                            <SelectItem value="editor">Editor - Can edit channels</SelectItem>
                            <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Channel Access</Label>
                        <div className="space-y-2">
                          {mockChannels.map((channel) => (
                            <div key={channel.id} className="flex items-center justify-between">
                              <Label className="font-normal">{channel.name}</Label>
                              <Switch defaultChecked />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => {
                        toast({ title: "Invitation Sent", description: "An email has been sent to the team member" });
                        setInviteDialogOpen(false);
                      }}>
                        Send Invite
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTeamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                          {member.avatar}
                        </div>
                        <div>
                          <p className="font-semibold">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={member.role === "Owner" ? "default" : "secondary"}>
                          {member.role}
                        </Badge>
                        {member.role !== "Owner" && (
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Current Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>Manage your subscription</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg border-2 border-primary bg-primary/5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold">Pro Plan</h3>
                      <Badge className="bg-primary">Active</Badge>
                    </div>
                    <p className="text-3xl font-bold">
                      $49<span className="text-lg font-normal text-muted-foreground">/month</span>
                    </p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        Unlimited channel searches
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        50 event trackers
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        API access (10K requests/month)
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        CSV/Excel exports
                      </li>
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      Change Plan
                    </Button>
                    <Button variant="outline" className="text-destructive hover:text-destructive">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Usage */}
              <Card>
                <CardHeader>
                  <CardTitle>Usage This Month</CardTitle>
                  <CardDescription>Your current usage statistics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Channel Searches</span>
                      <span>2,450 / Unlimited</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-[45%] bg-primary rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Event Trackers</span>
                      <span>32 / 50</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-[64%] bg-primary rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>API Requests</span>
                      <span>8,230 / 10,000</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-[82%] bg-amber-500 rounded-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Data Exports</span>
                      <span>15 / Unlimited</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-[25%] bg-primary rounded-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Manage your payment details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 rounded bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white text-xs font-bold">
                        VISA
                      </div>
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 12/25</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Default</Badge>
                  </div>
                  <Button variant="outline" className="w-full gap-2">
                    <Plus className="w-4 h-4" />
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>

              {/* Billing History */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>Your recent invoices</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { date: "Jan 1, 2024", amount: "$49.00", status: "Paid" },
                      { date: "Dec 1, 2023", amount: "$49.00", status: "Paid" },
                      { date: "Nov 1, 2023", amount: "$49.00", status: "Paid" },
                    ].map((invoice, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                      >
                        <div>
                          <p className="font-medium">{invoice.date}</p>
                          <p className="text-sm text-muted-foreground">Pro Plan</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-medium">{invoice.amount}</span>
                          <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                            {invoice.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
