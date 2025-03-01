"use client"

import { ref, runTransaction } from "firebase/database"
import { Label } from "./ui/label"
import { useState } from "react"
import { ShoppingBag, Trash2, Minus, Plus, Utensils, Banknote, CreditCard, QrCode, Loader2 } from "lucide-react"
import { useCart } from "~/lib/cart-context"
import { Button } from "~/components/ui/button"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "~/components/ui/sheet"
import { Separator } from "~/components/ui/separator"
import { database } from "~/server/firebase"
import { toast } from "sonner"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { useRouter } from "next/navigation"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
  cashier: string
}
type PaymentMethod = "cash" | "qris" | "transfer"

export default function CartSidebar({ isOpen, onClose, cashier }: CartSidebarProps) {
  const { cartItems, removeFromCart, updateCartItemQuantity, clearCart, cartTotal, countersStock } = useCart()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("qris")
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const handleCheckout = async () => {
    const menu: string[] = [];
    setIsLoading(true)
    try {
      const failedItems: string[] = []
      const rollbackItems: { ref: ReturnType<typeof ref>; previousStock: number }[] = []

      for (const item of cartItems) {
        const stockRef = ref(database, `foodCounters/${item.counterId}/stock`)

        await runTransaction(stockRef, (currentStock) => {
          if (currentStock === null) {
            failedItems.push(`${item.name} tidak ada`)
            return currentStock
          }

          if (item.quantity > currentStock) {
            failedItems.push(`${item.name} stoknya tidak cukup! Tersisa: ${currentStock}`)
            return currentStock
          }

          // 🔥 Push rollback data BEFORE stock updated
          rollbackItems.push({ ref: stockRef, previousStock: currentStock as number })

          menu.push(item.name)
          return currentStock - item.quantity // Update stock
        })
      }

      if (failedItems.length > 0) {
        // 🔥 Rollback transaction
        for (const rollback of rollbackItems) {
          await runTransaction(rollback.ref, () => rollback.previousStock)
        }

        toast.error(`Transaksi gagal!\n${failedItems.join("\n")}`, {
          style: {
            background: "#f0bfb5",
          }
        })
        setIsLoading(false)
        return
      }

      await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: cartTotal,
          paymentMethod,
          cashier,
          menu,
        }),
      })
      setIsLoading(false)

      toast.success(`Transaksi berhasil!\nTotal: Rp ${cartTotal.toLocaleString("id-ID")}`,
        {
          style: {
            background: "#f0fdf4",
          }
        }
      )
      clearCart()
      onClose()
    } catch (error) {
      const err = error as Error
      setIsLoading(false)
      toast.error(`Transaction failed, Error Aplication, ${err}`)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="px-1">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Your Cart
            </SheetTitle>
          </div>
        </SheetHeader>
        <Separator className="my-4" />

        {cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground">Add items to your cart to see them here.</p>
            <Button onClick={onClose} className="mt-4">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={`${item.counterId}-${item.id}`} className="flex gap-4">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Utensils className="h-8 w-8" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{item.name}</h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeFromCart(item.id, item.counterId)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateCartItemQuantity(item.id, item.counterId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Decrease</span>
                          </Button>
                          <span className="w-4 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateCartItemQuantity(item.id, item.counterId, item.quantity + 1)}
                            disabled={item.quantity >= (countersStock[item.counterId] ?? 0) + item.quantity}
                          >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Increase</span>
                          </Button>
                        </div>
                        <span className="font-medium">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="mt-6 space-y-4">
              <Separator />
              <div className="space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>Rp {cartTotal.toLocaleString("id-ID")}</span>
                </div>
              </div>
              {/* Payment Method Selection */}
              <div className="space-y-2">
                <h4 className="font-medium">Payment Method</h4>
                <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="cash"
                      className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-accent ${paymentMethod === "cash" ? "bg-accent border-primary" : ""}`}
                      onClick={() => setPaymentMethod("cash")}
                    >
                      <RadioGroupItem value="cash" id="cash" />
                      <div className="flex items-center gap-2 cursor-pointer flex-1">
                        <Banknote className="h-4 w-4" />
                        <span>Cash</span>
                      </div>
                    </Label>

                    <Label
                      htmlFor="qris"
                      className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-accent ${paymentMethod === "qris" ? "bg-accent border-primary" : ""}`}
                      onClick={() => setPaymentMethod("qris")}
                    >
                      <RadioGroupItem value="qris" id="qris" />
                      <div className="flex items-center gap-2 cursor-pointer flex-1">
                        <QrCode className="h-4 w-4" />
                        <span>QRIS</span>
                      </div>
                    </Label>

                    <Label
                      htmlFor="transfer"
                      className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-accent ${paymentMethod === "transfer" ? "bg-accent border-primary" : ""}`}
                      onClick={() => setPaymentMethod("transfer")}
                    >
                      <RadioGroupItem value="transfer" id="transfer" />
                      <div className="flex items-center gap-2 cursor-pointer flex-1">
                        <CreditCard className="h-4 w-4" />
                        <span>Bank Transfer</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={clearCart}>
                  Clear Cart
                </Button>
                <Button className="flex-1" onClick={handleCheckout} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Loading...
                    </>
                  ) : "Checkout"}
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}


