"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Package2, Save, ArrowLeft, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "@/components/session-provider"
import { Progress } from "@/components/ui/progress"
import { getPasswordStrength, getPasswordStrengthLabel, getPasswordStrengthColor } from "@/lib/utils"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, updateUser, isLoading } = useSession()

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
      })
    } else if (!isLoading) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    setPasswordStrength(getPasswordStrength(passwordData.newPassword))
  }, [passwordData.newPassword])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update user profile
      updateUser({
        name: profileData.name,
      })

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while updating your profile.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsChangingPassword(true)

    try {
      const { currentPassword, newPassword, confirmPassword } = passwordData

      // Check if current password is correct (for demo, we'll use hardcoded values)
      const isCorrectPassword =
        (user?.email === "admin@example.com" && currentPassword === "admin123") ||
        (user?.email === "staff@example.com" && currentPassword === "staff123") ||
        (user?.email === "primary@example.com" && currentPassword === "primary123")

      if (!isCorrectPassword) {
        toast({
          variant: "destructive",
          title: "Incorrect password",
          description: "The current password you entered is incorrect.",
        })
        setIsChangingPassword(false)
        return
      }

      // Check if passwords match
      if (newPassword !== confirmPassword) {
        toast({
          variant: "destructive",
          title: "Passwords don't match",
          description: "New password and confirmation must match.",
        })
        setIsChangingPassword(false)
        return
      }

      // Check password strength
      if (passwordStrength < 75) {
        toast({
          variant: "destructive",
          title: "Password too weak",
          description:
            "Please choose a stronger password with at least 8 characters, including numbers and special characters.",
        })
        setIsChangingPassword(false)
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update user in localStorage
      updateUser({
        passwordChanged: true,
      })

      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      toast({
        title: "Password changed",
        description: "Your password has been successfully changed.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while changing your password.",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (isLoading || !user) {
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
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <form onSubmit={handleSaveProfile}>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center space-y-2">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Avatar" />
                        <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm">
                        Change Avatar
                      </Button>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={profileData.name}
                            onChange={handleProfileChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profileData.email}
                            disabled
                            className="bg-muted"
                          />
                          <p className="text-xs text-muted-foreground">
                            Email cannot be changed. Contact an administrator for assistance.
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <div className="flex items-center space-x-2">
                          <div className="rounded-md bg-muted px-3 py-1 text-sm">
                            {user.role === "admin" ? "Administrator" : "Staff"}
                          </div>
                          {user.isPrimaryAdmin && (
                            <div className="rounded-md bg-primary/10 text-primary px-3 py-1 text-sm flex items-center">
                              <Shield className="h-3.5 w-3.5 mr-1" />
                              Primary Admin
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <form onSubmit={handleChangePassword}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Password strength:</span>
                        <span>{getPasswordStrengthLabel(passwordStrength)}</span>
                      </div>
                      <Progress
                        value={passwordStrength}
                        className={`h-1 ${getPasswordStrengthColor(passwordStrength)}`}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters and include numbers and special characters.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isChangingPassword}>
                    {isChangingPassword ? "Changing Password..." : "Change Password"}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>Manage your account security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline">Set Up</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Active Sessions</Label>
                      <p className="text-sm text-muted-foreground">Manage your active login sessions</p>
                    </div>
                    <Button variant="outline">View Sessions</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Login History</Label>
                      <p className="text-sm text-muted-foreground">View your recent login activity</p>
                    </div>
                    <Button variant="outline">View History</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
