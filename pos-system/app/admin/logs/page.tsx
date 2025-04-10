"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, Filter } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import AdminLayout from "@/components/admin-layout"

// Sample log data
const logData = [
  {
    id: 1,
    timestamp: "2023-04-10T14:30:00",
    user: "Admin User",
    action: "Product Created",
    details: "Added new product: Product 7",
    ip: "192.168.1.1",
    module: "Inventory",
  },
  {
    id: 2,
    timestamp: "2023-04-10T13:15:00",
    user: "Admin User",
    action: "User Updated",
    details: "Modified user permissions for Staff User",
    ip: "192.168.1.1",
    module: "User Management",
  },
  {
    id: 3,
    timestamp: "2023-04-10T11:45:00",
    user: "Admin User",
    action: "Settings Changed",
    details: "Updated tax rate from 7% to 7.5%",
    ip: "192.168.1.1",
    module: "Settings",
  },
  {
    id: 4,
    timestamp: "2023-04-09T16:20:00",
    user: "Admin User",
    action: "User Created",
    details: "Added new user: John Smith",
    ip: "192.168.1.1",
    module: "User Management",
  },
  {
    id: 5,
    timestamp: "2023-04-09T14:10:00",
    user: "Admin User",
    action: "Product Updated",
    details: "Modified price for Product 3 from $39.99 to $42.99",
    ip: "192.168.1.1",
    module: "Inventory",
  },
  {
    id: 6,
    timestamp: "2023-04-09T10:30:00",
    user: "Admin User",
    action: "Backup Created",
    details: "Manual system backup initiated",
    ip: "192.168.1.1",
    module: "System",
  },
  {
    id: 7,
    timestamp: "2023-04-08T15:45:00",
    user: "Admin User",
    action: "User Deleted",
    details: "Removed user: Jane Wilson",
    ip: "192.168.1.1",
    module: "User Management",
  },
  {
    id: 8,
    timestamp: "2023-04-08T13:20:00",
    user: "Admin User",
    action: "Report Generated",
    details: "Created sales report for Q1 2023",
    ip: "192.168.1.1",
    module: "Reports",
  },
  {
    id: 9,
    timestamp: "2023-04-08T09:15:00",
    user: "Admin User",
    action: "Ticket Closed",
    details: "Resolved ticket TKT-002: Product Exchange",
    ip: "192.168.1.1",
    module: "Tickets",
  },
  {
    id: 10,
    timestamp: "2023-04-07T16:40:00",
    user: "Admin User",
    action: "System Update",
    details: "Installed system update v2.0.5",
    ip: "192.168.1.1",
    module: "System",
  },
]

export default function AdminLogsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isClient, setIsClient] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [filteredLogs, setFilteredLogs] = useState(logData)
  const [searchQuery, setSearchQuery] = useState("")
  const [moduleFilter, setModuleFilter] = useState("all")

  useEffect(() => {
    setIsClient(true)
    // Check if user is admin
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(user)
    if (userData.role !== "admin") {
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You don't have permission to access this page.",
      })
      router.push("/")
    }
  }, [router, toast])

  useEffect(() => {
    let filtered = [...logData]

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (log) =>
          log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.details.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by module
    if (moduleFilter !== "all") {
      filtered = filtered.filter((log) => log.module === moduleFilter)
    }

    // Filter by date
    if (date) {
      const dateString = format(date, "yyyy-MM-dd")
      filtered = filtered.filter((log) => log.timestamp.startsWith(dateString))
    }

    setFilteredLogs(filtered)
  }, [searchQuery, moduleFilter, date])

  const handleExport = () => {
    toast({
      title: "Export initiated",
      description: "Log data is being exported to CSV.",
    })
    // In a real app, this would trigger a CSV download
  }

  const clearFilters = () => {
    setSearchQuery("")
    setModuleFilter("all")
    setDate(undefined)
  }

  if (!isClient) {
    return null
  }

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Admin Activity Logs</h2>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Activity Logs</CardTitle>
            <CardDescription>Detailed record of all administrative actions performed in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-row gap-2">
                <Select value={moduleFilter} onValueChange={setModuleFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modules</SelectItem>
                    <SelectItem value="Inventory">Inventory</SelectItem>
                    <SelectItem value="User Management">User Management</SelectItem>
                    <SelectItem value="Settings">Settings</SelectItem>
                    <SelectItem value="System">System</SelectItem>
                    <SelectItem value="Reports">Reports</SelectItem>
                    <SelectItem value="Tickets">Tickets</SelectItem>
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[180px] justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>

                <Button variant="outline" onClick={clearFilters}>
                  <Filter className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead className="hidden md:table-cell">Details</TableHead>
                    <TableHead className="hidden md:table-cell">IP Address</TableHead>
                    <TableHead>Module</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs truncate">{log.details}</TableCell>
                      <TableCell className="hidden md:table-cell">{log.ip}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.module}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No logs found matching your filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
