// User types
export interface User {
  id: number
  name: string
  email: string
  role: "admin" | "staff"
  status: "active" | "inactive"
  verified: boolean
  isPrimaryAdmin?: boolean
  passwordChanged: boolean
  lastLogin: string
  permissions?: string[]
  createdAt: string
}

// Permission types
export type Permission =
  | "manage_users"
  | "manage_inventory"
  | "manage_sales"
  | "manage_customers"
  | "manage_tickets"
  | "view_reports"
  | "manage_settings"
  | "process_refunds"
  | "view_audit_logs"
  | "manage_backups"

export interface PermissionGroup {
  name: string
  permissions: Permission[]
}

// Audit log types
export interface AuditLog {
  id: number
  timestamp: string
  user: string
  action: string
  details: string
  ip: string
  module: string
}

// Notification types
export interface Notification {
  id: number
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  read: boolean
  timestamp: string
  link?: string
}

// Product types
export interface Product {
  id: number
  name: string
  sku: string
  category: string
  price: number
  cost: number
  stock: number
  reorderLevel: number
  image?: string
}

// Customer types
export interface Customer {
  id: number
  name: string
  email: string
  phone: string
  totalSpent: number
  lastPurchase: string
}

// Ticket types
export interface Ticket {
  id: string
  customer: string
  subject: string
  status: "Open" | "In Progress" | "Closed"
  priority: "High" | "Medium" | "Low"
  created: string
  lastUpdated: string
}

// Transaction types
export interface Transaction {
  id: string
  customer: string
  date: string
  amount: number
  status: string
  paymentMethod: string
}

// System settings
export interface SystemSettings {
  general: {
    language: string
    timezone: string
    currency: string
    dateFormat: string
    receiptFooter: string
    receiptPrinter: string
    autoPrint: boolean
  }
  company: {
    name: string
    vatNumber: string
    email: string
    phone: string
    address: string
    website: string
    logo?: string
  }
  security: {
    twoFactorAuth: boolean
    sessionTimeout: boolean
    timeoutDuration: number
  }
  billing: {
    taxRate: number
    taxCalculation: "inclusive" | "exclusive"
    taxNumberLabel: string
    showTaxBreakdown: boolean
    acceptCreditCards: boolean
    acceptCash: boolean
    acceptInvoices: boolean
  }
  notifications: {
    emailLowStock: boolean
    emailDailySummary: boolean
    emailNewUsers: boolean
    systemUpdates: boolean
    securityAlerts: boolean
  }
  appearance: {
    themeMode: "light" | "dark" | "system"
    primaryColor: string
    accentColor: string
    compactMode: boolean
    largeText: boolean
  }
  advanced: {
    backupFrequency: "hourly" | "daily" | "weekly" | "monthly"
    backupRetention: number
  }
}
