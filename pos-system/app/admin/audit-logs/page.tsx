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
import { CalendarIcon, Download, Filter, Search } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import AdminLayout from "@/components/admin-layout"
import { useSession } from "@/components/session-provider"
import { PermissionGuard } from "@/components/permission-guard"
import { sampleAuditLogs } from "@/lib/data"
import { formatDateTime } from "@/lib/utils"

export default function AuditLogsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useSession()
  const [isClient, setIsClient] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [filteredLogs, setFilteredLogs] = useState(sampleAuditLogs)
  const [searchQuery, setSearchQuery] = useState("")
  const [moduleFilter, setModuleFilter] = useState("all")

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  useEffect(() => {
    let filtered = [...sampleAuditLogs]

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

  // Get unique modules for filter
  const modules = Array.from(new Set(sampleAuditLogs.map((log) => log.module)))

  return (
    <AdminLayout>
      <PermissionGuard permission="view_audit_logs">
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Security Audit Logs</h2>
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Logs
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Activity Logs</CardTitle>
              <CardDescription>
                Detailed record of all security and administrative actions performed in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="flex flex-row gap-2">
                  <Select value={moduleFilter} onValueChange={setModuleFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by module" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Modules</SelectItem>
                      {modules.map((module) => (
                        <SelectItem key={module} value={module}>
                          {module}
                        </SelectItem>
                      ))}
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
                        <TableCell>{formatDateTime(log.timestamp)}</TableCell>
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
      </PermissionGuard>
    </AdminLayout>
  )
}
