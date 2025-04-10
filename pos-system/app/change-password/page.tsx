"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Package2, ShieldCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

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

    // If user has already changed their password, redirect to dashboard
    if (userData.passwordChanged) {
      router.push("/")
    }
  }, [router])

  useEffect(() => {
    // Simple password strength checker
    const { newPassword } = formData // Declare newPassword here
    if (!newPassword) {
      setPasswordStrength(0)
      return
    }

    let strength = 0
    // Length check
    if (newPassword.length >= 8) strength += 25
    // Contains number
    if (/\d/.test(newPassword)) strength += 25
    // Contains lowercase
    if (/[a-z]/.test(newPassword)) strength += 25
    // Contains uppercase or special char
    if (/[A-Z]/.test(newPassword) || /[^A-Za-z0-9]/.test(newPassword)) strength += 25

    setPasswordStrength(strength)
  }, [formData.newPassword])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { currentPassword, newPassword, confirmPassword } = formData

      // Check if current password is correct (for demo, we'll use hardcoded values)
      const isDefaultPassword =
        (user.email === "admin@example.com" && currentPassword === "admin123") ||
        (user.email === "staff@example.com" && currentPassword === "staff123") ||
        currentPassword === "Welcome123" // Default password for new users

      if (!isDefaultPassword) {
        toast({
          variant: "destructive",
          title: "Incorrect password",
          description: "The current password you entered is incorrect.",
        })
        setIsLoading(false)
        return
      }

      // Check if passwords match
      if (newPassword !== confirmPassword) {
        toast({
          variant: "destructive",
          title: "Passwords don't match",
          description: "New password and confirmation must match.",
        })
        setIsLoading(false)
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
        setIsLoading(false)
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update user in localStorage
      const updatedUser = {
        ...user,
        passwordChanged: true,
        // If user is primary admin, they're automatically verified
        verified: user.isPrimaryAdmin ? true : user.verified || false,
      }
      localStorage.setItem("user", JSON.stringify(updatedUser))

      toast({
        title: "Password changed successfully",
        description: "You can now access the system.",
      })

      // Redirect to dashboard
      router.push("/")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while changing your password.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isClient || !user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="flex items-center justify-center mb-8">
        <Package2 className="h-10 w-10 mr-2" />
        <h1 className="text-2xl font-bold">SA POS System</h1>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Change Default Password</CardTitle>
          <CardDescription className="text-center">
            For security reasons, you must change your default password before accessing the system.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                placeholder="Enter your current password"
                value={formData.currentPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="Enter your new password"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Password strength:</span>
                  <span>
                    {passwordStrength < 25
                      ? "Very weak"
                      : passwordStrength < 50
                        ? "Weak"
                        : passwordStrength < 75
                          ? "Medium"
                          : "Strong"}
                  </span>
                </div>
                <Progress
                  value={passwordStrength}
                  className={`h-1 ${
                    passwordStrength < 25
                      ? "bg-red-100"
                      : passwordStrength < 50
                        ? "bg-orange-100"
                        : passwordStrength < 75
                          ? "bg-yellow-100"
                          : "bg-green-100"
                  }`}
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
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Changing Password..." : "Change Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
