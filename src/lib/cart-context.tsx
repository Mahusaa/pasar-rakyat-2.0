"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { type CartItem } from "~/types/food-types"

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (itemId: string, counterId: string) => void
  updateCartItemQuantity: (itemId: string, counterId: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (cartItem) => cartItem.id === item.id && cartItem.counterId === item.counterId,
      )

      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems]
        const existingItem = updatedItems[existingItemIndex]
        if (!existingItem) return prevItems

        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + item.quantity
        }
        return updatedItems
      } else {
        return [...prevItems, item]
      }
    })
  }

  const removeFromCart = (itemId: string, counterId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => !(item.id === itemId && item.counterId === counterId)))
  }

  const updateCartItemQuantity = (itemId: string, counterId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, counterId)
      return
    }

    setCartItems((prevItems) => {
      const itemIndex = prevItems.findIndex((item) => item.id === itemId && item.counterId === counterId)
      if (itemIndex === -1) return prevItems

      const updatedItems = [...prevItems]
      const existingItem = updatedItems[itemIndex]
      if (!existingItem) return prevItems

      updatedItems[itemIndex] = {
        ...existingItem,
        quantity: newQuantity
      }
      return updatedItems
    })
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
