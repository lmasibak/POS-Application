"use client"

import { useState, useEffect } from "react"
import { AlertCircle, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function VerificationBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check if user is logged in and needs verification
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)

      // Show banner if user is not verified
      if (userData.passwordChanged && !userData.verified) {
        setIsVisible(true)
      }
    }
  }, [])

  if (!isVisible || !user) {
    return null
  }

  return (
    <Alert className="border-amber-500 bg-amber-50 text-amber-800 mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Verification Pending</AlertTitle>
      <AlertDescription className="flex justify-between items-center">
        <span>
          Your account is awaiting administrator verification. Some features may be limited until verification is
          complete.
        </span>
        <Button variant="ghost" size="sm" className="text-amber-800" onClick={() => setIsVisible(false)}>
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  )
}
