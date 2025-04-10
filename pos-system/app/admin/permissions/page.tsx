"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import AdminLayout from "@/components/admin-layout"
import { useSession } from "@/components/session-provider"
import { PermissionGuard } from "@/components/permission-guard"
import { defaultUsers, permissionGroups } from "@/lib/data"
import { Shield, Save, Search } from "lucide-react"

export default function PermissionsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useSession()
  const [isClient, setIsClient] = useState(false)
  const [users, setUsers] = useState(defaultUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Check if user is logged in
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handlePermissionChange = (userId: number, permission: string, checked: boolean) => {
    setUsers(
      users.map((u) => {
        if (u.id === userId) {
          const permissions = u.permissions || []
          if (checked) {
            return { ...u, permissions: [...permissions, permission] }
          } else {
            return { ...u, permissions: permissions.filter((p) => p !== permission) }
          }
        }
        return u
      }),
    )
  }

  const handleSavePermissions = async () => {
    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Permissions saved",
        description: "User permissions have been updated successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while saving permissions.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!isClient) {
    return null
  }

  return (
    <AdminLayout>
      <PermissionGuard permission="manage_users">
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">User Permissions</h2>
            <Button onClick={handleSavePermissions} disabled={isSaving}>
              {isSaving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Manage Permissions</CardTitle>
              <CardDescription>Configure access rights for users in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="rounded-md border overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px] min-w-[200px]">User</TableHead>
                      {permissionGroups.map((group) => (
                        <TableHead key={group.name} colSpan={group.permissions.length} className="text-center">
                          {group.name}
                        </TableHead>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableHead>Name / Role</TableHead>
                      {permissionGroups.flatMap((group) =>
                        group.permissions.map((permission) => (
                          <TableHead key={permission} className="text-center">
                            {permission
                              .split("_")
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ")}
                          </TableHead>
                        )),
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">
                          <div>
                            {u.name}
                            {u.isPrimaryAdmin && (
                              <div className="flex items-center text-xs text-primary mt-1">
                                <Shield className="h-3 w-3 mr-1" />
                                Primary Admin
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                          </div>
                        </TableCell>
                        {permissionGroups.flatMap((group) =>
                          group.permissions.map((permission) => (
                            <TableCell key={`${u.id}-${permission}`} className="text-center">
                              <Checkbox
                                checked={u.permissions?.includes(permission) || u.isPrimaryAdmin}
                                onCheckedChange={(checked) => {
                                  if (!u.isPrimaryAdmin) {
                                    handlePermissionChange(u.id, permission, checked as boolean)
                                  }
                                }}
                                disabled={u.isPrimaryAdmin}
                              />
                            </TableCell>
                          )),
                        )}
                      </TableRow>
                    ))}
                    {filteredUsers.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={1 + permissionGroups.flatMap((g) => g.permissions).length}
                          className="text-center py-4"
                        >
                          No users found matching your search
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
