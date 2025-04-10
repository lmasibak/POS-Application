"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import AdminLayout from "@/components/admin-layout"
import { useSession } from "@/components/session-provider"
import { PermissionGuard } from "@/components/permission-guard"
import { formatDateTime } from "@/lib/utils"
import { Database, Download, HardDrive, RotateCw, Upload, Clock, CheckCircle2 } from "lucide-react"

export default function BackupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useSession()
  const [isClient, setIsClient] = useState(false)
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [backupProgress, setBackupProgress] = useState(0)
  const [backupFrequency, setBackupFrequency] = useState("daily")
  const [backupRetention, setBackupRetention] = useState("30")

  // Sample backup history
  const backupHistory = [
    {
      id: 1,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      size: "256 MB",
      type: "Automatic",
      status: "Completed",
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      size: "255 MB",
      type: "Automatic",
      status: "Completed",
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      size: "254 MB",
      type: "Manual",
      status: "Completed",
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      size: "253 MB",
      type: "Automatic",
      status: "Completed",
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      size: "252 MB",
      type: "Automatic",
      status: "Completed",
    },
  ]

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  const handleBackup = async () => {
    setIsBackingUp(true)
    setBackupProgress(0)

    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsBackingUp(false)
          toast({
            title: "Backup completed",
            description: "System backup has been completed successfully.",
          })
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const handleRestore = (backupId: number) => {
    toast({
      title: "Restore initiated",
      description: `Restoring system from backup #${backupId}. This may take a few minutes.`,
    })
  }

  const handleDownload = (backupId: number) => {
    toast({
      title: "Download initiated",
      description: `Backup #${backupId} is being prepared for download.`,
    })
  }

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Backup settings have been updated successfully.",
    })
  }

  if (!isClient) {
    return null
  }

  return (
    <AdminLayout>
      <PermissionGuard permission="manage_backups">
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">System Backup & Restore</h2>
            <Button onClick={handleBackup} disabled={isBackingUp}>
              {isBackingUp ? (
                <>
                  <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                  Backing Up...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Backup Now
                </>
              )}
            </Button>
          </div>

          {isBackingUp && (
            <Card className="mb-4">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Backup in progress...</span>
                    <span>{backupProgress}%</span>
                  </div>
                  <Progress value={backupProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Backup History</CardTitle>
                <CardDescription>View and manage system backups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {backupHistory.map((backup) => (
                        <TableRow key={backup.id}>
                          <TableCell>{formatDateTime(backup.timestamp)}</TableCell>
                          <TableCell>{backup.size}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {backup.type === "Automatic" ? (
                                <Clock className="mr-1 h-3 w-3" />
                              ) : (
                                <HardDrive className="mr-1 h-3 w-3" />
                              )}
                              {backup.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              {backup.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleRestore(backup.id)}>
                                <Upload className="mr-1 h-3 w-3" />
                                Restore
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDownload(backup.id)}>
                                <Download className="mr-1 h-3 w-3" />
                                Download
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Backup Settings</CardTitle>
                <CardDescription>Configure automatic backup schedule</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Backup Frequency</label>
                  <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Backup Retention (days)</label>
                  <Select value={backupRetention} onValueChange={setBackupRetention}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select retention period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Storage Location</label>
                  <Select defaultValue="local">
                    <SelectTrigger>
                      <SelectValue placeholder="Select storage location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local Storage</SelectItem>
                      <SelectItem value="cloud">Cloud Storage</SelectItem>
                      <SelectItem value="both">Both (Local & Cloud)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" onClick={handleSaveSettings}>
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </PermissionGuard>
    </AdminLayout>
  )
}
