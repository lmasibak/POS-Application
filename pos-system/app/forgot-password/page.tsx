"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Package2, ArrowLeft, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, this would send a password reset email
      setIsSubmitted(true)

      toast({
        title: "Reset link sent",
        description: "If an account exists with this email, you will receive a password reset link.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="flex items-center justify-center mb-8">
        <Package2 className="h-10 w-10 mr-2" />
        <h1 className="text-2xl font-bold">SA POS System</h1>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            {isSubmitted ? "Check your email for a reset link" : "Enter your email and we'll send you a reset link"}
          </CardDescription>
        </CardHeader>
        {isSubmitted ? (
          <CardContent className="space-y-4 flex flex-col items-center pt-4">
            <CheckCircle className="h-16 w-16 text-green-500 mb-2" />
            <p className="text-center">
              We've sent a password reset link to <strong>{email}</strong>. Please check your email and follow the
              instructions to reset your password.
            </p>
            <p className="text-sm text-muted-foreground text-center">
              If you don't see the email, check your spam folder or try again.
            </p>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </CardFooter>
          </form>
        )}
        <div className="p-4 pt-0 text-center">
          <Link href="/login" className="text-sm text-primary inline-flex items-center hover:underline">
            <ArrowLeft className="mr-1 h-3 w-3" />
            Back to login
          </Link>
        </div>
      </Card>
    </div>
  )
}
