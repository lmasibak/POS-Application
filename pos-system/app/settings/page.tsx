"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { VerificationBanner } from "@/components/verification-banner"
import { CreditCard, Package2, Receipt, Save, Server, Shield, DollarSign } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isClient, setIsClient] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(storedUser)
    setUser(userData)
  }, [router])

  const handleSaveSettings = async () => {
    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings saved",
        description: "Your settings have been successfully updated.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while saving your settings.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Package2 className="h-6 w-6" />
          <span className="font-semibold">SA POS System</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/")}>
            Back to Dashboard
          </Button>
        </div>
      </header>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <VerificationBanner />

        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-7">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage your basic system settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="af">Afrikaans</SelectItem>
                          <SelectItem value="zu">Zulu</SelectItem>
                          <SelectItem value="xh">Xhosa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="africa-johannesburg">
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="africa-johannesburg">Africa/Johannesburg (GMT+2)</SelectItem>
                          <SelectItem value="africa-cairo">Africa/Cairo (GMT+2)</SelectItem>
                          <SelectItem value="europe-london">Europe/London (GMT+0)</SelectItem>
                          <SelectItem value="america-new_york">America/New York (GMT-5)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select defaultValue="zar">
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="zar">South African Rand (ZAR)</SelectItem>
                          <SelectItem value="usd">US Dollar (USD)</SelectItem>
                          <SelectItem value="eur">Euro (EUR)</SelectItem>
                          <SelectItem value="gbp">British Pound (GBP)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date-format">Date Format</Label>
                      <Select defaultValue="dd-mm-yyyy">
                        <SelectTrigger id="date-format">
                          <SelectValue placeholder="Select date format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                          <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                          <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Receipt Settings</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="receipt-footer">Receipt Footer Text</Label>
                        <Textarea
                          id="receipt-footer"
                          placeholder="Enter text to appear at the bottom of receipts"
                          defaultValue="Thank you for your business! Returns accepted within 14 days with receipt."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="receipt-printer">Default Receipt Printer</Label>
                        <Select defaultValue="thermal-printer">
                          <SelectTrigger id="receipt-printer">
                            <SelectValue placeholder="Select printer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="thermal-printer">Thermal Printer</SelectItem>
                            <SelectItem value="laser-printer">Laser Printer</SelectItem>
                            <SelectItem value="pdf">Save as PDF</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex items-center space-x-2 pt-2">
                          <Switch id="auto-print" defaultChecked />
                          <Label htmlFor="auto-print">Automatically print receipt after sale</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Manage your company details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" defaultValue="SA POS System" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vat-number">VAT Number</Label>
                    <Input id="vat-number" defaultValue="4123456789" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-email">Email</Label>
                    <Input id="company-email" type="email" defaultValue="info@sapos.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-phone">Phone</Label>
                    <Input id="company-phone" defaultValue="+27 21 123 4567" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="company-address">Address</Label>
                    <Textarea id="company-address" defaultValue="123 Main Street, Cape Town, 8001, South Africa" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-website">Website</Label>
                    <Input id="company-website" defaultValue="https://www.sapos.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-logo">Company Logo</Label>
                    <Input id="company-logo" type="file" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <div className="md:col-span-2">
                      <Button>Change Password</Button>
                    </div>
                  </div>

                  <Separator />

                  <h3 className="text-lg font-medium">Login Security</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch id="two-factor" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="session-timeout">Session Timeout</Label>
                        <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
                      </div>
                      <Switch id="session-timeout" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeout-duration">Timeout Duration (minutes)</Label>
                      <Input id="timeout-duration" type="number" defaultValue="30" />
                    </div>
                  </div>

                  {user?.isPrimaryAdmin && (
                    <>
                      <Separator />

                      <h3 className="text-lg font-medium">Primary Admin Controls</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="force-password-reset">Force Password Reset</Label>
                            <p className="text-sm text-muted-foreground">
                              Require all users to reset their passwords on next login
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Force Reset
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="security-audit">Security Audit Log</Label>
                            <p className="text-sm text-muted-foreground">View all security-related events</p>
                          </div>
                          <Button variant="outline" size="sm">
                            View Logs
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Billing Settings</CardTitle>
                <CardDescription>Manage your billing preferences and tax settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Tax Settings</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
                      <Input id="tax-rate" type="number" defaultValue="15" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tax-calculation">Tax Calculation</Label>
                      <Select defaultValue="inclusive">
                        <SelectTrigger id="tax-calculation">
                          <SelectValue placeholder="Select tax calculation method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inclusive">Tax Inclusive</SelectItem>
                          <SelectItem value="exclusive">Tax Exclusive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tax-number-label">Tax Number Label</Label>
                      <Input id="tax-number-label" defaultValue="VAT #" />
                    </div>
                    <div className="flex items-center space-x-2 pt-8">
                      <Switch id="show-tax-breakdown" defaultChecked />
                      <Label htmlFor="show-tax-breakdown">Show tax breakdown on receipts</Label>
                    </div>
                  </div>

                  <Separator />

                  <h3 className="text-lg font-medium">Payment Methods</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <Label htmlFor="accept-credit-cards">Credit/Debit Cards</Label>
                      </div>
                      <Switch id="accept-credit-cards" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <Label htmlFor="accept-cash">Cash</Label>
                      </div>
                      <Switch id="accept-cash" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Receipt className="h-5 w-5 text-muted-foreground" />
                        <Label htmlFor="accept-invoices">Invoices</Label>
                      </div>
                      <Switch id="accept-invoices" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-low-stock">Low Stock Alerts</Label>
                        <p className="text-sm text-muted-foreground">Receive emails when products are running low</p>
                      </div>
                      <Switch id="email-low-stock" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-daily-summary">Daily Sales Summary</Label>
                        <p className="text-sm text-muted-foreground">Receive a daily summary of sales</p>
                      </div>
                      <Switch id="email-daily-summary" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-new-users">New User Registrations</Label>
                        <p className="text-sm text-muted-foreground">Receive emails when new users register</p>
                      </div>
                      <Switch id="email-new-users" defaultChecked />
                    </div>
                  </div>

                  <Separator />

                  <h3 className="text-lg font-medium">System Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="system-updates">System Updates</Label>
                        <p className="text-sm text-muted-foreground">Notify when system updates are available</p>
                      </div>
                      <Switch id="system-updates" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="security-alerts">Security Alerts</Label>
                        <p className="text-sm text-muted-foreground">Notify about important security events</p>
                      </div>
                      <Switch id="security-alerts" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of your POS system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Theme</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="theme-mode">Theme Mode</Label>
                      <Select defaultValue="light">
                        <SelectTrigger id="theme-mode">
                          <SelectValue placeholder="Select theme mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <div className="flex items-center gap-2">
                        <Input id="primary-color" type="color" defaultValue="#0f172a" className="w-12 h-8 p-1" />
                        <Input defaultValue="#0f172a" className="flex-1" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accent-color">Accent Color</Label>
                      <div className="flex items-center gap-2">
                        <Input id="accent-color" type="color" defaultValue="#2563eb" className="w-12 h-8 p-1" />
                        <Input defaultValue="#2563eb" className="flex-1" />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <h3 className="text-lg font-medium">Layout</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="compact-mode">Compact Mode</Label>
                        <p className="text-sm text-muted-foreground">Use a more compact layout to fit more content</p>
                      </div>
                      <Switch id="compact-mode" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="large-text">Large Text</Label>
                        <p className="text-sm text-muted-foreground">Increase text size for better readability</p>
                      </div>
                      <Switch id="large-text" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Configure advanced system settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {user?.isPrimaryAdmin ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">System Maintenance</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="backup-frequency">Automatic Backup Frequency</Label>
                        <Select defaultValue="daily">
                          <SelectTrigger id="backup-frequency">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="backup-retention">Backup Retention (days)</Label>
                        <Input id="backup-retention" type="number" defaultValue="30" />
                      </div>
                      <div className="md:col-span-2 flex gap-2">
                        <Button variant="outline">
                          <Server className="mr-2 h-4 w-4" />
                          Backup Now
                        </Button>
                        <Button variant="outline">
                          <Server className="mr-2 h-4 w-4" />
                          Restore Backup
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <h3 className="text-lg font-medium">Database Management</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Database Optimization</Label>
                          <p className="text-sm text-muted-foreground">Optimize database for better performance</p>
                        </div>
                        <Button variant="outline">Optimize Now</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Clear Cache</Label>
                          <p className="text-sm text-muted-foreground">Clear system cache to free up memory</p>
                        </div>
                        <Button variant="outline">Clear Cache</Button>
                      </div>
                    </div>

                    <Separator />

                    <h3 className="text-lg font-medium">System Reset</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-destructive">Reset System</Label>
                          <p className="text-sm text-muted-foreground">Reset the system to factory defaults</p>
                        </div>
                        <Button variant="destructive">Reset System</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Primary Admin Access Required</h3>
                    <p className="text-muted-foreground max-w-md">
                      Advanced settings are only accessible to primary administrators. Please contact your system
                      administrator for assistance.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
