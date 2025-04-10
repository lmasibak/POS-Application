"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/types"
import { defaultUsers } from "@/lib/data"
import { logAuditEvent } from "@/lib/utils"

interface SessionContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  isLoading: boolean
}

const SessionContext = createContext<SessionContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  updateUser: () => {},
  isLoading: true,
})

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      setIsLoading(true)
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)

          // Update last login time
          const updatedUser = {
            ...userData,
            lastLogin: new Date().toISOString(),
          }
          localStorage.setItem("user", JSON.stringify(updatedUser))
        }
      } catch (error) {
        console.error("Session error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    // Set up session timeout
    const sessionTimeout = setInterval(() => {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        if (userData.security?.sessionTimeout) {
          const lastActivity = localStorage.getItem("lastActivity")
          if (lastActivity) {
            const inactiveTime = Date.now() - Number.parseInt(lastActivity)
            const timeoutDuration = (userData.security?.timeoutDuration || 30) * 60 * 1000

            if (inactiveTime > timeoutDuration) {
              logout()
              router.push("/login")
              alert("Your session has expired due to inactivity.")
            }
          }
        }
      }
    }, 60000) // Check every minute

    // Update last activity on user interaction
    const updateActivity = () => {
      localStorage.setItem("lastActivity", Date.now().toString())
    }

    window.addEventListener("mousemove", updateActivity)
    window.addEventListener("keydown", updateActivity)
    window.addEventListener("click", updateActivity)

    // Initial activity timestamp
    updateActivity()

    return () => {
      clearInterval(sessionTimeout)
      window.removeEventListener("mousemove", updateActivity)
      window.removeEventListener("keydown", updateActivity)
      window.removeEventListener("click", updateActivity)
    }
  }, [router])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, check against hardcoded credentials
      let foundUser = null

      if (email === "primary@example.com" && password === "primary123") {
        foundUser = defaultUsers.find((u) => u.email === "primary@example.com")
      } else if (email === "admin@example.com" && password === "admin123") {
        foundUser = defaultUsers.find((u) => u.email === "admin@example.com")
      } else if (email === "staff@example.com" && password === "staff123") {
        foundUser = defaultUsers.find((u) => u.email === "staff@example.com")
      }

      if (foundUser) {
        // Update last login
        const updatedUser = {
          ...foundUser,
          lastLogin: new Date().toISOString(),
        }

        // Store in localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser))
        setUser(updatedUser)

        // Log audit event
        logAuditEvent(updatedUser.name, "User Login", `User logged in successfully`, "Authentication")

        return true
      }

      // Log failed login attempt
      logAuditEvent("Unknown", "Failed Login", `Failed login attempt for email: ${email}`, "Authentication")

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    if (user) {
      // Log audit event
      logAuditEvent(user.name, "User Logout", `User logged out`, "Authentication")
    }

    localStorage.removeItem("user")
    localStorage.removeItem("lastActivity")
    setUser(null)
  }

  const updateUser = (userData: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...userData }
    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  return (
    <SessionContext.Provider value={{ user, login, logout, updateUser, isLoading }}>{children}</SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext)
