"use client"

import { ref, runTransaction } from "firebase/database"
import { ShoppingBag, Trash2, Minus, Plus, Utensils } from "lucide-react"
import { useCart } from "~/lib/cart-context"
import { Button } from "~/components/ui/button"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "~/components/ui/sheet"
import { Separator } from "~/components/ui/separator"
import { database } from "~/server/firebase"
import { toast } from "sonner"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cartItems, removeFromCart, updateCartItemQuantity, clearCart, cartTotal, countersStock } = useCart()


  const handleCheckout = async () => {
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

          return currentStock - item.quantity // Update Stock
        })
      }

      if (failedItems.length > 0) {
        for (const rollback of rollbackItems) {
          await runTransaction(rollback.ref, () => rollback.previousStock)
        }

        toast.error(`Transaksi gagal!\n${failedItems.join("\n")}`, {
          style: {
            background: "#f0bfb5",
          }
        })
        return
      }

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
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={clearCart}>
                  Clear Cart
                </Button>
                <Button className="flex-1" onClick={handleCheckout}>
                  Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}


