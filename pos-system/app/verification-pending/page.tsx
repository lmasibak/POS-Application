"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Package2, MailCheck, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function VerificationPendingPage() {
  const [isClient, setIsClient] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isChecking, setIsChecking] = useState(false)
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

    // If user is already verified, redirect to dashboard
    if (userData.verified) {
      router.push("/")
    }
  }, [router])

  const handleCheckStatus = async () => {
    setIsChecking(true)

    try {
      // Simulate API call to check verification status
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, randomly verify the user (20% chance)
      const isVerified = Math.random() < 0.2

      if (isVerified) {
        // Update user in localStorage
        const updatedUser = {
          ...user,
          verified: true,
        }
        localStorage.setItem("user", JSON.stringify(updatedUser))

        toast({
          title: "Verification approved!",
          description: "Your account has been verified by the administrator.",
        })

        // Redirect to dashboard
        router.push("/")
      } else {
        toast({
          variant: "default",
          title: "Still pending",
          description: "Your account verification is still pending. Please check again later.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while checking your verification status.",
      })
    } finally {
      setIsChecking(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
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
            <MailCheck className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Verification Pending</CardTitle>
          <CardDescription className="text-center">Your account is waiting for administrator approval.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p>
            An email has been sent to the primary administrator to verify your account. You will be able to access the
            system once your account has been approved.
          </p>
          <div className="rounded-lg bg-muted p-4">
            <p className="font-medium">Account Information</p>
            <p className="text-sm text-muted-foreground mt-1">Name: {user.name}</p>
            <p className="text-sm text-muted-foreground">Email: {user.email}</p>
            <p className="text-sm text-muted-foreground">Role: {user.role}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" onClick={handleCheckStatus} disabled={isChecking}>
            {isChecking ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Checking Status...
              </>
            ) : (
              "Check Verification Status"
            )}
          </Button>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
