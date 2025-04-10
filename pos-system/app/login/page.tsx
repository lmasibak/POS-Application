"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Package2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "@/components/session-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { user, login, isLoading } = useSession()

  useEffect(() => {
    setIsClient(true)
    // Check if user is already logged in
    if (user) {
      // If user hasn't changed default password, redirect to change password page
      if (!user.passwordChanged) {
        router.push("/change-password")
        return
      }

      // If user is fully authenticated, redirect to dashboard
      router.push("/")
    }
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("") // Clear error when user types
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      // Validate inputs
      if (!formData.email || !formData.password) {
        setError("Please enter both email and password")
        return
      }

      const success = await login(formData.email, formData.password)

      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        })

        // The session provider will update the user state
        // Redirects will be handled in the useEffect
      } else {
        setError("Invalid email or password. Please try again.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login. Please try again.")
    }
  }

  if (!isClient) {
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
          <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Demo Credentials:</p>
              <p>Primary Admin: primary@example.com / primary123</p>
              <p>Admin: admin@example.com / admin123</p>
              <p>Staff: staff@example.com / staff123</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
