"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, UserPlus, CheckCircle, XCircle, Mail, Shield, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import AdminLayout from "@/components/admin-layout"

// Sample users data
const initialUsers = [
  {
    id: 1,
    name: "Primary Admin",
    email: "primary@example.com",
    role: "admin",
    status: "active",
    verified: true,
    isPrimaryAdmin: true,
    lastLogin: "2023-04-10T16:30:00",
  },
  {
    id: 2,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    verified: true,
    isPrimaryAdmin: false,
    lastLogin: "2023-04-10T14:30:00",
  },
  {
    id: 3,
    name: "Staff User",
    email: "staff@example.com",
    role: "staff",
    status: "active",
    verified: true,
    isPrimaryAdmin: false,
    lastLogin: "2023-04-10T13:15:00",
  },
  {
    id: 4,
    name: "John Smith",
    email: "john.smith@example.com",
    role: "staff",
    status: "inactive",
    verified: false,
    isPrimaryAdmin: false,
    lastLogin: "2023-04-05T09:45:00",
  },
  {
    id: 5,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    role: "staff",
    status: "active",
    verified: false,
    isPrimaryAdmin: false,
    lastLogin: "-",
  },
]

export default function UsersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isClient, setIsClient] = useState(false)
  const [users, setUsers] = useState(initialUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false)
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [adminPassword, setAdminPassword] = useState("")

  useEffect(() => {
    setIsClient(true)
    // Check if user is admin
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(user)
    setCurrentUser(userData)

    if (userData.role !== "admin") {
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You don't have permission to access this page.",
      })
      router.push("/")
    }
  }, [router, toast])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDeleteUser = (userId: number) => {
    // Prevent deleting primary admin
    const userToDelete = users.find((user) => user.id === userId)
    if (userToDelete?.isPrimaryAdmin) {
      toast({
        variant: "destructive",
        title: "Cannot delete primary admin",
        description: "The primary administrator account cannot be deleted.",
      })
      return
    }

    setUsers(users.filter((user) => user.id !== userId))
    toast({
      title: "User deleted",
      description: "The user has been successfully deleted.",
    })
  }

  const handleToggleStatus = (userId: number) => {
    // Prevent deactivating primary admin
    const userToToggle = users.find((user) => user.id === userId)
    if (userToToggle?.isPrimaryAdmin && userToToggle.status === "active") {
      toast({
        variant: "destructive",
        title: "Cannot deactivate primary admin",
        description: "The primary administrator account cannot be deactivated.",
      })
      return
    }

    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
      ),
    )

    const targetUser = users.find((user) => user.id === userId)
    const newStatus = targetUser?.status === "active" ? "inactive" : "active"

    toast({
      title: `User ${newStatus}`,
      description: `The user has been ${newStatus === "active" ? "activated" : "deactivated"}.`,
    })
  }

  const handleVerifyUser = (user) => {
    setSelectedUser(user)
    setIsVerifyDialogOpen(true)
  }

  const handlePromoteToAdmin = (user) => {
    if (!currentUser.isPrimaryAdmin) {
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: "Only the primary administrator can promote users to admin.",
      })
      return
    }

    setSelectedUser(user)
    setIsPromoteDialogOpen(true)
  }

  const confirmVerification = async () => {
    // In a real app, verify admin password against the server
    if (adminPassword !== "admin123" && adminPassword !== "primary123") {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: "Your admin password is incorrect.",
      })
      return
    }

    // Update user verification status
    setUsers(users.map((user) => (user.id === selectedUser.id ? { ...user, verified: true } : user)))

    toast({
      title: "User verified",
      description: `${selectedUser.name} has been verified and can now access the system.`,
    })

    // Reset and close dialog
    setAdminPassword("")
    setIsVerifyDialogOpen(false)
    setSelectedUser(null)
  }

  const confirmPromotion = async () => {
    // In a real app, verify admin password against the server
    if (adminPassword !== "primary123") {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: "Your primary admin password is incorrect.",
      })
      return
    }

    // Update user role to admin
    setUsers(users.map((user) => (user.id === selectedUser.id ? { ...user, role: "admin" } : user)))

    toast({
      title: "User promoted",
      description: `${selectedUser.name} has been promoted to administrator.`,
    })

    // Reset and close dialog
    setAdminPassword("")
    setIsPromoteDialogOpen(false)
    setSelectedUser(null)
  }

  const handleSendVerificationEmail = (user) => {
    toast({
      title: "Verification email sent",
      description: `A verification email has been sent to ${user.name}.`,
    })
  }

  if (!isClient) {
    return null
  }

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <AddUserDialog
            currentUser={currentUser}
            onUserAdded={(newUser) => {
              setUsers([
                ...users,
                {
                  ...newUser,
                  id: users.length + 1,
                  status: "active",
                  verified: false,
                  isPrimaryAdmin: false,
                  lastLogin: "-",
                },
              ])
              toast({
                title: "User added",
                description:
                  "The new user has been successfully added. They will need to verify their account before accessing the system.",
              })
            }}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Users</CardTitle>
            <CardDescription>Manage administrators and staff members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Input
                placeholder="Search users..."
                className="max-w-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.name}
                        {user.isPrimaryAdmin && (
                          <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                            <Shield className="h-3 w-3 mr-1" />
                            Primary
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                          {user.role === "admin" ? "Admin" : "Staff"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            user.status === "active"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-yellow-50 text-yellow-700 border-yellow-200"
                          }
                        >
                          {user.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.verified ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {typeof user.lastLogin === "string" && user.lastLogin !== "-"
                          ? new Date(user.lastLogin).toLocaleString()
                          : user.lastLogin}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {!user.verified && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600"
                                onClick={() => handleVerifyUser(user)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Verify
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleSendVerificationEmail(user)}>
                                <Mail className="h-4 w-4 mr-1" />
                                Send Email
                              </Button>
                            </>
                          )}
                          {user.role === "staff" && currentUser.isPrimaryAdmin && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600"
                              onClick={() => handlePromoteToAdmin(user)}
                            >
                              <Shield className="h-4 w-4 mr-1" />
                              Promote
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(user.id)}>
                            {user.status === "active" ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No users found matching your search
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Verification Dialog */}
      <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Verify User</DialogTitle>
            <DialogDescription>
              You are about to verify {selectedUser?.name}. This will allow them to access the system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="admin-password" className="text-orange-600">
                Your Admin Password
              </Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Verify your admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
                className="border-orange-200"
              />
              <p className="text-xs text-muted-foreground">
                For security, please enter your admin password to confirm this action.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVerifyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmVerification}>Verify User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Promote to Admin Dialog */}
      <Dialog open={isPromoteDialogOpen} onOpenChange={setIsPromoteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Promote to Administrator</DialogTitle>
            <DialogDescription>
              You are about to promote {selectedUser?.name} to administrator. This will give them additional system
              privileges.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center p-3 bg-amber-50 text-amber-800 rounded-md">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p className="text-sm">This action can only be performed by the primary administrator.</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="primary-admin-password" className="text-orange-600">
                Your Primary Admin Password
              </Label>
              <Input
                id="primary-admin-password"
                type="password"
                placeholder="Verify your primary admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
                className="border-orange-200"
              />
              <p className="text-xs text-muted-foreground">
                For security, please enter your primary admin password to confirm this action.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPromoteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmPromotion}>Promote User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

function AddUserDialog({ currentUser, onUserAdded }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "staff",
  })
  const [adminPassword, setAdminPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const defaultPassword = "Welcome123"

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, role: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate admin password (in a real app, this would be a server-side check)
      // For demo purposes, we'll use a simple check
      if (
        (currentUser.isPrimaryAdmin && adminPassword !== "primary123") ||
        (!currentUser.isPrimaryAdmin && adminPassword !== "admin123")
      ) {
        toast({
          variant: "destructive",
          title: "Verification failed",
          description: "Your admin password is incorrect.",
        })
        setIsLoading(false)
        return
      }

      // Check if trying to add an admin without being primary admin
      if (formData.role === "admin" && !currentUser.isPrimaryAdmin) {
        toast({
          variant: "destructive",
          title: "Permission denied",
          description: "Only the primary administrator can add new administrators.",
        })
        setIsLoading(false)
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add the new user
      onUserAdded({
        ...formData,
        // In a real app, you would not include the password in the response
        // This is just for demonstration
        defaultPassword,
      })

      // Reset form and close dialog
      setFormData({
        name: "",
        email: "",
        role: "staff",
      })
      setAdminPassword("")
      setOpen(false)

      toast({
        title: "User created successfully",
        description: `Default password: ${defaultPassword}. An email verification has been sent to the user.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to create user",
        description: "An error occurred while creating the user.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new administrator or staff account. The user will receive a default password.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
              {formData.role === "admin" && !currentUser.isPrimaryAdmin && (
                <p className="text-xs text-amber-600">
                  Note: Only the primary administrator can add new administrators.
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="default-password">Default Password</Label>
              <Input id="default-password" value={defaultPassword} disabled />
              <p className="text-xs text-muted-foreground">
                This will be the user's initial password. They will be required to change it on first login.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="admin-password" className="text-orange-600">
                Your {currentUser.isPrimaryAdmin ? "Primary Admin" : "Admin"} Password
              </Label>
              <Input
                id="admin-password"
                type="password"
                placeholder={`Verify your ${currentUser.isPrimaryAdmin ? "primary admin" : "admin"} password`}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
                className="border-orange-200"
              />
              <p className="text-xs text-muted-foreground">
                For security, please enter your password to confirm this action.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
