"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Settings,
  Package,
  LogOut,
  ClipboardList,
  Home,
  Package2,
  Search,
  Menu,
  UserPlus,
  Shield,
  Database,
  Lock,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "@/components/session-provider"
import { Badge } from "@/components/ui/badge"
import { NotificationsDropdown } from "@/components/notifications-dropdown"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const { user, logout } = useSession()
  const [isClient, setIsClient] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    if (!user) {
      router.push("/login")
      return
    }

    // Check if user is admin
    if (user.role !== "admin") {
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You don't have permission to access this page.",
      })
      router.push("/")
    }
  }, [user, router, toast])

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.push("/login")
  }

  if (!isClient || !user) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-0 md:w-16"
        } transition-all duration-300 hidden md:block border-r bg-muted/40`}
      >
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            {isSidebarOpen && <span>POS Admin</span>}
          </Link>
          {isSidebarOpen && user?.isPrimaryAdmin && (
            <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
              Primary
            </Badge>
          )}
        </div>
        <nav className="flex-1 overflow-auto py-2">
          <div className="px-3 py-2">
            <div className="space-y-1">
              <Link href="/">
                <Button variant="ghost" className={`w-full justify-start ${pathname === "/" ? "bg-muted" : ""}`}>
                  <Home className="mr-2 h-4 w-4" />
                  {isSidebarOpen && <span>Dashboard</span>}
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="ghost" className={`w-full justify-start ${pathname === "/admin" ? "bg-muted" : ""}`}>
                  <Settings className="mr-2 h-4 w-4" />
                  {isSidebarOpen && <span>Admin Panel</span>}
                </Button>
              </Link>
              <Link href="/admin/logs">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${pathname === "/admin/logs" ? "bg-muted" : ""}`}
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  {isSidebarOpen && <span>Activity Logs</span>}
                </Button>
              </Link>
              <Link href="/admin/audit-logs">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${pathname === "/admin/audit-logs" ? "bg-muted" : ""}`}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  {isSidebarOpen && <span>Security Audit</span>}
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${pathname === "/admin/users" ? "bg-muted" : ""}`}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {isSidebarOpen && <span>User Management</span>}
                </Button>
              </Link>
              <Link href="/admin/permissions">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${pathname === "/admin/permissions" ? "bg-muted" : ""}`}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  {isSidebarOpen && <span>Permissions</span>}
                </Button>
              </Link>
              <Link href="/admin/backup">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${pathname === "/admin/backup" ? "bg-muted" : ""}`}
                >
                  <Database className="mr-2 h-4 w-4" />
                  {isSidebarOpen && <span>Backup & Restore</span>}
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  {isSidebarOpen && <span>Inventory</span>}
                </Button>
              </Link>
              <Link href="/admin/system-info">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${pathname === "/admin/system-info" ? "bg-muted" : ""}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <rect width="20" height="14" x="2" y="3" rx="2" />
                    <line x1="8" x2="16" y1="21" y2="21" />
                    <line x1="12" x2="12" y1="17" y2="21" />
                  </svg>
                  {isSidebarOpen && <span>System Info</span>}
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  {isSidebarOpen && <span>Reports</span>}
                </Button>
              </Link>
            </div>
          </div>
        </nav>
        <div className="mt-auto p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            {isSidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:px-6">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <NotificationsDropdown />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                  <AvatarFallback>{user?.name?.charAt(0) || "A"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
