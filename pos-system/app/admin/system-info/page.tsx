"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import AdminLayout from "@/components/admin-layout"

export default function SystemInfoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isClient, setIsClient] = useState(false)

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

  if (!isClient) {
    return null
  }

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">System Information</h2>
          <Button variant="outline">Refresh</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Version</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">v2.1.0</div>
              <p className="text-xs text-muted-foreground">Last updated: 2023-04-01</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Database Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Connected</div>
              <p className="text-xs text-muted-foreground">Response time: 45ms</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2023-04-09</div>
              <p className="text-xs text-muted-foreground">Size: 256MB</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Server Load</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32%</div>
              <p className="text-xs text-muted-foreground">Memory usage: 2.4GB/8GB</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Components</CardTitle>
            <CardDescription>Status of all system components and services</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Component</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Core API</TableCell>
                  <TableCell>v2.1.0</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Operational
                    </Badge>
                  </TableCell>
                  <TableCell>2023-04-01</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Database</TableCell>
                  <TableCell>v5.7.38</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Operational
                    </Badge>
                  </TableCell>
                  <TableCell>2023-03-15</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Payment Gateway</TableCell>
                  <TableCell>v3.2.1</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Operational
                    </Badge>
                  </TableCell>
                  <TableCell>2023-03-28</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Reporting Engine</TableCell>
                  <TableCell>v1.8.5</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Operational
                    </Badge>
                  </TableCell>
                  <TableCell>2023-02-20</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Email Service</TableCell>
                  <TableCell>v2.0.3</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Operational
                    </Badge>
                  </TableCell>
                  <TableCell>2023-03-10</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Requirements</CardTitle>
            <CardDescription>Minimum and recommended system specifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium mb-2">Minimum Requirements</h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Operating System: Windows 10 / macOS 10.15 / Ubuntu 20.04</li>
                  <li>Processor: Dual-core 2.0 GHz</li>
                  <li>Memory: 4GB RAM</li>
                  <li>Storage: 10GB available space</li>
                  <li>Database: MySQL 5.7 or PostgreSQL 12</li>
                  <li>Browser: Chrome 88+, Firefox 85+, Safari 14+</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Recommended Specifications</h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Operating System: Windows 11 / macOS 12 / Ubuntu 22.04</li>
                  <li>Processor: Quad-core 3.0 GHz</li>
                  <li>Memory: 8GB RAM</li>
                  <li>Storage: 20GB SSD</li>
                  <li>Database: MySQL 8.0 or PostgreSQL 14</li>
                  <li>Browser: Latest version of Chrome, Firefox, or Safari</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
