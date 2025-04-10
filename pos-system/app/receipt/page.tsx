"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Download, Printer } from "lucide-react"

export default function ReceiptPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isClient, setIsClient] = useState(false)
  const [receiptData, setReceiptData] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)
    // In a real app, we would fetch the receipt data from an API
    // For demo purposes, we'll use mock data
    setReceiptData({
      id: searchParams.get("id") || "INV-12345",
      date: new Date().toLocaleString(),
      items: [
        { id: 1, name: "Product 1", price: 19.99, quantity: 2, total: 39.98 },
        { id: 2, name: "Product 2", price: 29.99, quantity: 1, total: 29.99 },
      ],
      subtotal: 69.97,
      tax: 10.5,
      total: 80.47,
      paymentMethod: "Credit Card",
      customerName: "John Doe",
      staffName: "Jane Smith",
    })
  }, [searchParams])

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    alert("Receipt downloaded as PDF")
  }

  const handleBack = () => {
    router.push("/")
  }

  if (!isClient || !receiptData) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center border-b pb-6">
          <CardTitle className="text-xl">SA POS System</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">123 Main Street, Cape Town</p>
          <p className="text-sm text-muted-foreground">Tel: +27 21 123 4567</p>
          <p className="text-sm text-muted-foreground">VAT #: 4123456789</p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex justify-between mb-4">
            <div className="text-sm">
              <p className="font-medium">Receipt #: {receiptData.id}</p>
              <p>Date: {receiptData.date}</p>
            </div>
            <div className="text-sm text-right">
              <p>Customer: {receiptData.customerName}</p>
              <p>Staff: {receiptData.staffName}</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Item</span>
              <div className="flex">
                <span className="w-16 text-right">Price</span>
                <span className="w-10 text-center">Qty</span>
                <span className="w-20 text-right">Total</span>
              </div>
            </div>
            <Separator />
            {receiptData.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name}</span>
                <div className="flex">
                  <span className="w-16 text-right">R{item.price.toFixed(2)}</span>
                  <span className="w-10 text-center">{item.quantity}</span>
                  <span className="w-20 text-right">R{item.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>R{receiptData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>VAT (15%)</span>
              <span>R{receiptData.tax.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>R{receiptData.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mt-4">
              <span>Payment Method</span>
              <span>{receiptData.paymentMethod}</span>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Thank you for your business!</p>
            <p>Returns accepted within 14 days with receipt</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
