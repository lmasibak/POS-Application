"use client"

// Update the Home component to use the PosSystem component from the new file
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PosSystem from "./pos-system"

export default function Home() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  if (!isClient || !isAuthenticated) {
    return null
  }

  return <PosSystem />
}
