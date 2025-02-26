"use client"

import { useState } from "react"
import { Plus, Minus, ShoppingBag } from "lucide-react"
import { useCart } from "~/lib/cart-context"
import type { FoodItem } from "~/types/food-types"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"

interface FoodMenuItemProps {
  item: FoodItem
  counterId: string
  counterStock: number
}

export default function FoodMenuItem({ item, counterId, counterStock }: FoodMenuItemProps) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    addToCart({
      ...item,
      counterId,
      quantity,
    })
    setQuantity(1)
  }

  const incrementQuantity = () => {
    if (quantity < counterStock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-medium text-lg text-zinc-800 dark:text-zinc-100">{item.name}</h3>
            <p className="text-lg font-bold">Rp {item.price.toLocaleString("id-ID")}</p>
          </div>

          <div className="flex flex-col items-end gap-2">
            {counterStock > 0 ? (
              <>
                <div className="flex items-center rounded-md border">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-r-none"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                    <span className="sr-only">Decrease quantity</span>
                  </Button>
                  <div className="flex h-7 w-7 items-center justify-center text-xs">{quantity}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-l-none"
                    onClick={incrementQuantity}
                    disabled={quantity >= counterStock}
                  >
                    <Plus className="h-3 w-3" />
                    <span className="sr-only">Increase quantity</span>
                  </Button>
                </div>
                <Button className="h-7 text-xs" onClick={handleAddToCart} disabled={counterStock === 0}>
                  <ShoppingBag className="w-4 h-4 mr-1" /> Add
                </Button>
              </>
            ) : (
              <span className="text-sm font-medium text-red-500">Out of stock</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


