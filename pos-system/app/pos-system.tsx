"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  Ticket,
  Settings,
  LogOut,
  Search,
  PlusCircle,
  DollarSign,
  CreditCard,
  Receipt,
  Shield,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { VerificationBanner } from "@/components/verification-banner"

export default function PosSystem() {
  const [activeTab, setActiveTab] = useState("pos")
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.push("/login")
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r bg-muted/40">
        <div className="flex h-14 items-center border-b px-4">
          <h2 className="text-lg font-semibold">POS System</h2>
          {user?.isPrimaryAdmin && (
            <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
              Primary Admin
            </Badge>
          )}
        </div>
        <nav className="flex-1 overflow-auto py-2">
          <div className="px-3 py-2">
            <h3 className="mb-2 text-xs font-medium text-muted-foreground">Main</h3>
            <div className="space-y-1">
              <Button
                variant={activeTab === "pos" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("pos")}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Point of Sale
              </Button>
              <Button
                variant={activeTab === "tickets" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("tickets")}
              >
                <Ticket className="mr-2 h-4 w-4" />
                Tickets
                <Badge className="ml-auto" variant="outline">
                  3
                </Badge>
              </Button>
              <Button
                variant={activeTab === "inventory" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("inventory")}
              >
                <Package className="mr-2 h-4 w-4" />
                Inventory
              </Button>
              <Button
                variant={activeTab === "customers" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("customers")}
              >
                <Users className="mr-2 h-4 w-4" />
                Customers
              </Button>
              <Button
                variant={activeTab === "reports" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("reports")}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Reports
              </Button>
            </div>
          </div>
          <div className="px-3 py-2">
            <h3 className="mb-2 text-xs font-medium text-muted-foreground">Settings</h3>
            <div className="space-y-1">
              <Link href="/settings">
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </Link>
              {(user?.role === "admin" || user?.isPrimaryAdmin) && (
                <Link href="/admin">
                  <Button variant="ghost" className="w-full justify-start">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Panel
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </nav>
        <div className="mt-auto p-4 border-t">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="grid gap-0.5 text-xs">
              <div className="font-medium">{user?.name || "User"}</div>
              <div className="text-muted-foreground capitalize">{user?.role || "Staff"}</div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Settings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings" className="w-full">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:px-6">
          <Button variant="outline" size="icon" className="md:hidden">
            <ShoppingCart className="h-4 w-4" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products, tickets, customers..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings" className="w-full">
                  Settings
                </Link>
              </DropdownMenuItem>
              {(user?.role === "admin" || user?.isPrimaryAdmin) && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/admin")}>
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Panel
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {/* Verification Banner */}
          <VerificationBanner />

          {activeTab === "pos" && <PosTab />}
          {activeTab === "tickets" && <TicketsTab />}
          {activeTab === "inventory" && <InventoryTab />}
          {activeTab === "customers" && <CustomersTab />}
          {activeTab === "reports" && <ReportsTab />}
        </main>
      </div>
    </div>
  )
}

function PosTab() {
  const [cart, setCart] = useState([
    { id: 1, name: "Product 1", price: 19.99, quantity: 2 },
    { id: 2, name: "Product 2", price: 29.99, quantity: 1 },
  ])

  const products = [
    { id: 1, name: "Product 1", price: 19.99, category: "Category A", image: "/placeholder.svg?height=80&width=80" },
    { id: 2, name: "Product 2", price: 29.99, category: "Category A", image: "/placeholder.svg?height=80&width=80" },
    { id: 3, name: "Product 3", price: 39.99, category: "Category B", image: "/placeholder.svg?height=80&width=80" },
    { id: 4, name: "Product 4", price: 49.99, category: "Category B", image: "/placeholder.svg?height=80&width=80" },
    { id: 5, name: "Product 5", price: 59.99, category: "Category C", image: "/placeholder.svg?height=80&width=80" },
    { id: 6, name: "Product 6", price: 69.99, category: "Category C", image: "/placeholder.svg?height=80&width=80" },
  ]

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart(cart.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
  }

  const router = useRouter()

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Product Categories and Items */}
      <div className="col-span-1 lg:col-span-2">
        <div className="mb-6">
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="category-a">Category A</TabsTrigger>
              <TabsTrigger value="category-b">Category B</TabsTrigger>
              <TabsTrigger value="category-c">Category C</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="m-0">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-square relative">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium">{product.name}</h3>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-muted-foreground">{product.category}</span>
                          <span className="font-medium">R{product.price}</span>
                        </div>
                        <Button className="w-full mt-3" size="sm" onClick={() => addToCart(product)}>
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="category-a" className="m-0">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products
                  .filter((product) => product.category === "Category A")
                  .map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="aspect-square relative">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium">{product.name}</h3>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm text-muted-foreground">{product.category}</span>
                            <span className="font-medium">R{product.price}</span>
                          </div>
                          <Button className="w-full mt-3" size="sm" onClick={() => addToCart(product)}>
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            {/* Similar content for other categories */}
          </Tabs>
        </div>
      </div>

      {/* Cart */}
      <div className="col-span-1">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Current Sale</CardTitle>
            <CardDescription>
              {cart.length} {cart.length === 1 ? "item" : "items"} in cart
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-[calc(100vh-400px)]">
              {cart.length > 0 ? (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="grid gap-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">R{item.price} each</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
                  <div className="text-center">
                    <ShoppingCart className="mx-auto h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-2 text-lg font-medium">Cart is empty</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Add products to the cart to continue</p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex flex-col border-t pt-6">
            <div className="space-y-2 w-full">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>R{calculateTotal()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tax (15%)</span>
                <span>R{(Number.parseFloat(calculateTotal()) * 0.15).toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between font-medium">
                <span>Total</span>
                <span>R{(Number.parseFloat(calculateTotal()) * 1.15).toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Button variant="outline">Hold</Button>
                <Button variant="outline">Discount</Button>
              </div>
              <Button
                className="w-full mt-2"
                onClick={() => router.push("/receipt?id=INV-" + Math.floor(Math.random() * 10000))}
              >
                Checkout
              </Button>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button variant="outline" size="sm" className="flex flex-col h-auto py-2">
                  <CreditCard className="h-4 w-4 mb-1" />
                  <span className="text-xs">Card</span>
                </Button>
                <Button variant="outline" size="sm" className="flex flex-col h-auto py-2">
                  <DollarSign className="h-4 w-4 mb-1" />
                  <span className="text-xs">Cash</span>
                </Button>
                <Button variant="outline" size="sm" className="flex flex-col h-auto py-2">
                  <Receipt className="h-4 w-4 mb-1" />
                  <span className="text-xs">Invoice</span>
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function TicketsTab() {
  const tickets = [
    {
      id: "TKT-001",
      customer: "John Smith",
      subject: "Refund Request",
      status: "Open",
      priority: "High",
      created: "2023-04-10T10:30:00",
      lastUpdated: "2023-04-10T14:45:00",
    },
    {
      id: "TKT-002",
      customer: "Jane Doe",
      subject: "Product Exchange",
      status: "In Progress",
      priority: "Medium",
      created: "2023-04-09T09:15:00",
      lastUpdated: "2023-04-10T11:20:00",
    },
    {
      id: "TKT-003",
      customer: "Robert Johnson",
      subject: "Missing Item",
      status: "Open",
      priority: "High",
      created: "2023-04-08T16:45:00",
      lastUpdated: "2023-04-09T10:30:00",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Tickets</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Tickets</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="m-0 mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium">Ticket ID</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Customer</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Subject</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Priority</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Created</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Last Updated</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {tickets.map((ticket) => (
                      <tr
                        key={ticket.id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4 align-middle">{ticket.id}</td>
                        <td className="p-4 align-middle">{ticket.customer}</td>
                        <td className="p-4 align-middle">{ticket.subject}</td>
                        <td className="p-4 align-middle">
                          <Badge
                            variant={
                              ticket.status === "Open"
                                ? "destructive"
                                : ticket.status === "In Progress"
                                  ? "default"
                                  : "outline"
                            }
                          >
                            {ticket.status}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          <Badge
                            variant={
                              ticket.priority === "High"
                                ? "destructive"
                                : ticket.priority === "Medium"
                                  ? "default"
                                  : "outline"
                            }
                          >
                            {ticket.priority}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">{new Date(ticket.created).toLocaleString()}</td>
                        <td className="p-4 align-middle">{new Date(ticket.lastUpdated).toLocaleString()}</td>
                        <td className="p-4 align-middle">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Similar content for other tabs */}
      </Tabs>
    </div>
  )
}

function InventoryTab() {
  const inventory = [
    {
      id: 1,
      name: "Product 1",
      sku: "SKU001",
      category: "Category A",
      price: 19.99,
      cost: 10.0,
      stock: 45,
      reorderLevel: 10,
    },
    {
      id: 2,
      name: "Product 2",
      sku: "SKU002",
      category: "Category A",
      price: 29.99,
      cost: 15.0,
      stock: 32,
      reorderLevel: 8,
    },
    {
      id: 3,
      name: "Product 3",
      sku: "SKU003",
      category: "Category B",
      price: 39.99,
      cost: 20.0,
      stock: 18,
      reorderLevel: 5,
    },
    {
      id: 4,
      name: "Product 4",
      sku: "SKU004",
      category: "Category B",
      price: 49.99,
      cost: 25.0,
      stock: 7,
      reorderLevel: 10,
    },
    {
      id: 5,
      name: "Product 5",
      sku: "SKU005",
      category: "Category C",
      price: 59.99,
      cost: 30.0,
      stock: 3,
      reorderLevel: 5,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Inventory Management</h2>
        <div className="flex gap-2">
          <Button variant="outline">Import</Button>
          <Button variant="outline">Export</Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium">ID</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">SKU</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Category</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Price</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Cost</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Stock</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {inventory.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle">{item.id}</td>
                    <td className="p-4 align-middle">{item.name}</td>
                    <td className="p-4 align-middle">{item.sku}</td>
                    <td className="p-4 align-middle">{item.category}</td>
                    <td className="p-4 align-middle">R{item.price.toFixed(2)}</td>
                    <td className="p-4 align-middle">R{item.cost.toFixed(2)}</td>
                    <td className="p-4 align-middle">{item.stock}</td>
                    <td className="p-4 align-middle">
                      <Badge variant={item.stock <= item.reorderLevel ? "destructive" : "outline"}>
                        {item.stock <= item.reorderLevel ? "Low Stock" : "In Stock"}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CustomersTab() {
  const customers = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "(555) 123-4567",
      totalSpent: 1245.67,
      lastPurchase: "2023-04-05T14:30:00",
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "(555) 987-6543",
      totalSpent: 876.54,
      lastPurchase: "2023-04-08T11:15:00",
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      phone: "(555) 456-7890",
      totalSpent: 2345.67,
      lastPurchase: "2023-04-01T09:45:00",
    },
    {
      id: 4,
      name: "Emily Wilson",
      email: "emily.wilson@example.com",
      phone: "(555) 234-5678",
      totalSpent: 543.21,
      lastPurchase: "2023-04-07T16:20:00",
    },
    {
      id: 5,
      name: "Michael Brown",
      email: "michael.brown@example.com",
      phone: "(555) 876-5432",
      totalSpent: 1987.65,
      lastPurchase: "2023-04-09T13:10:00",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Customer Management</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium">ID</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Email</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Phone</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Total Spent</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Last Purchase</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle">{customer.id}</td>
                    <td className="p-4 align-middle">{customer.name}</td>
                    <td className="p-4 align-middle">{customer.email}</td>
                    <td className="p-4 align-middle">{customer.phone}</td>
                    <td className="p-4 align-middle">R{customer.totalSpent.toFixed(2)}</td>
                    <td className="p-4 align-middle">{new Date(customer.lastPurchase).toLocaleString()}</td>
                    <td className="p-4 align-middle">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ReportsTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Reports & Analytics</h2>
        <div className="flex gap-2">
          <Button variant="outline">Export</Button>
          <Button variant="outline">Print</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R59.32</div>
            <p className="text-xs text-muted-foreground">+7.4% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Monthly sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border rounded-md">
              <p className="text-muted-foreground">Sales Chart Visualization</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="w-[46px] h-[46px] relative mr-4">
                    <img
                      src={`/placeholder.svg?height=46&width=46`}
                      alt={`Product ${i}`}
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">Product {i}</p>
                    <p className="text-sm text-muted-foreground">{Math.floor(Math.random() * 100)} units sold</p>
                  </div>
                  <div className="font-medium">R{(Math.random() * 1000).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest sales transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium">Transaction ID</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Customer</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Amount</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Payment Method</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle">TRX-{1000 + i}</td>
                    <td className="p-4 align-middle">Customer {i}</td>
                    <td className="p-4 align-middle">{new Date().toLocaleDateString()}</td>
                    <td className="p-4 align-middle">R{(Math.random() * 500).toFixed(2)}</td>
                    <td className="p-4 align-middle">
                      <Badge variant="outline">Completed</Badge>
                    </td>
                    <td className="p-4 align-middle">Credit Card</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
