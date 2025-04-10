import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { AuditLog, User } from "./types"
import { sampleAuditLogs } from "./data"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date based on user preference
export function formatDate(date: string | Date, format = "dd-mm-yyyy"): string {
  const d = new Date(date)

  if (isNaN(d.getTime())) {
    return "Invalid date"
  }

  const day = d.getDate().toString().padStart(2, "0")
  const month = (d.getMonth() + 1).toString().padStart(2, "0")
  const year = d.getFullYear()

  switch (format) {
    case "dd-mm-yyyy":
      return `${day}-${month}-${year}`
    case "mm-dd-yyyy":
      return `${month}-${day}-${year}`
    case "yyyy-mm-dd":
      return `${year}-${month}-${day}`
    default:
      return `${day}-${month}-${year}`
  }
}

// Format time
export function formatTime(date: string | Date): string {
  const d = new Date(date)

  if (isNaN(d.getTime())) {
    return "Invalid time"
  }

  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

// Format date and time
export function formatDateTime(date: string | Date, format = "dd-mm-yyyy"): string {
  const d = new Date(date)

  if (isNaN(d.getTime())) {
    return "Invalid date/time"
  }

  return `${formatDate(d, format)} ${formatTime(d)}`
}

// Format currency
export function formatCurrency(amount: number, currency = "ZAR"): string {
  const currencyMap = {
    ZAR: { locale: "en-ZA", currency: "ZAR", symbol: "R" },
    USD: { locale: "en-US", currency: "USD", symbol: "$" },
    EUR: { locale: "en-EU", currency: "EUR", symbol: "€" },
    GBP: { locale: "en-GB", currency: "GBP", symbol: "£" },
  }

  const currencyInfo = currencyMap[currency.toUpperCase()] || currencyMap.ZAR

  return new Intl.NumberFormat(currencyInfo.locale, {
    style: "currency",
    currency: currencyInfo.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Generate a random password
export function generatePassword(length = 10): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
  let password = ""

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }

  return password
}

// Check if user has permission
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false

  // Primary admin has all permissions
  if (user.isPrimaryAdmin) return true

  // Check if user has the specific permission
  return user.permissions?.includes(permission) || false
}

// Log audit event
export function logAuditEvent(user: string, action: string, details: string, module: string): void {
  // In a real app, this would send the event to the server
  // For demo purposes, we'll just log to console
  console.log(`AUDIT: ${user} - ${action} - ${details} - ${module}`)

  // Create a new audit log entry
  const newLog: AuditLog = {
    id: sampleAuditLogs.length + 1,
    timestamp: new Date().toISOString(),
    user,
    action,
    details,
    ip: "192.168.1.1", // In a real app, this would be the actual IP
    module,
  }

  // In a real app, this would be saved to the database
  // For demo purposes, we'll add it to our sample data
  sampleAuditLogs.unshift(newLog)
}

// Hash password (simulated)
export function hashPassword(password: string): string {
  // In a real app, this would use a proper hashing algorithm like bcrypt
  // For demo purposes, we'll just do a simple encoding
  return btoa(`hashed:${password}`)
}

// Verify password (simulated)
export function verifyPassword(hashedPassword: string, plainPassword: string): boolean {
  // In a real app, this would use a proper verification method
  // For demo purposes, we'll just decode and check
  const decoded = atob(hashedPassword)
  return decoded === `hashed:${plainPassword}`
}

// Generate a session token
export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
export function getPasswordStrength(password: string): number {
  if (!password) return 0

  let strength = 0

  // Length check
  if (password.length >= 8) strength += 25

  // Contains number
  if (/\d/.test(password)) strength += 25

  // Contains lowercase
  if (/[a-z]/.test(password)) strength += 25

  // Contains uppercase or special char
  if (/[A-Z]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25

  return strength
}

// Get password strength label
export function getPasswordStrengthLabel(strength: number): string {
  if (strength < 25) return "Very weak"
  if (strength < 50) return "Weak"
  if (strength < 75) return "Medium"
  return "Strong"
}

// Get password strength color
export function getPasswordStrengthColor(strength: number): string {
  if (strength < 25) return "bg-red-100"
  if (strength < 50) return "bg-orange-100"
  if (strength < 75) return "bg-yellow-100"
  return "bg-green-100"
}
