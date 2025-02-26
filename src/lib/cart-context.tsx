"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type CartItem } from "~/types/food-types"
import { foodCounters } from "./mock-data"

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (itemId: string, counterId: string) => void
  updateCartItemQuantity: (itemId: string, counterId: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  countersStock: Record<string, number>
  updateCounterStock: (counterId: string, change: number) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [countersStock, setCountersStock] = useState<Record<string, number>>({})

  // Initialize counters stock
  useEffect(() => {
    const initialStock: Record<string, number> = {}
    foodCounters.forEach((counter) => {
      initialStock[counter.id] = counter.stock
    })
    setCountersStock(initialStock)
  }, [])

  const updateCounterStock = (counterId: string, change: number) => {
    setCountersStock((prev) => {
      const currentStock = prev[counterId] ?? 0;
      // Don't allow negative stock and handle stock restoration correctly
      return {
        ...prev,
        [counterId]: Math.max(0, currentStock - change),
      };
    })
  }

  const addToCart = (item: CartItem) => {
    // Check if there's enough stock
    if ((countersStock[item.counterId] ?? 0) < item.quantity) {
      alert("Not enough stock available!")
      return
    }

    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (cartItem) => cartItem.id === item.id && cartItem.counterId === item.counterId,
      )

      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        const updatedItems = [...prevItems]
        const existingItem = updatedItems[existingItemIndex];

        if (!existingItem) return prevItems;

        const newQuantity = existingItem.quantity + item.quantity

        // Ensure quantity doesn't exceed stock
        if (newQuantity > (countersStock[item.counterId] ?? 0)) {
          alert("Not enough stock available!")
          return prevItems
        }

        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity
        }

        return updatedItems
      } else {
        // Add new item to cart
        return [...prevItems, item]
      }
    })

    // Update counter stock after cart update
    updateCounterStock(item.counterId, item.quantity)
  }

  const removeFromCart = (itemId: string, counterId: string) => {
    const itemToRemove = cartItems.find((item) => item.id === itemId && item.counterId === counterId)

    if (itemToRemove) {
      // Remove item from cart first
      setCartItems((prevItems) => prevItems.filter((item) => !(item.id === itemId && item.counterId === counterId)))

      // Then restore counter stock (negative change means adding back to stock)
      updateCounterStock(counterId, -itemToRemove.quantity)
    }
  }

  const updateCartItemQuantity = (itemId: string, counterId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, counterId)
      return
    }

    const item = cartItems.find((item) => item.id === itemId && item.counterId === counterId)
    if (!item) return;

    const quantityDiff = newQuantity - item.quantity

    // Check if there's enough stock for the increase
    if (quantityDiff > 0 && quantityDiff > (countersStock[counterId] ?? 0)) {
      alert("Not enough stock available!")
      return
    }

    // Update item quantity first
    setCartItems((prevItems) => {
      const itemIndex = prevItems.findIndex((item) => item.id === itemId && item.counterId === counterId)
      if (itemIndex === -1) return prevItems

      const updatedItems = [...prevItems]
      const existingItem = updatedItems[itemIndex];

      if (!existingItem) return prevItems;

      // Create a full CartItem object with all required properties
      updatedItems[itemIndex] = {
        ...existingItem,
        quantity: newQuantity
      }

      return updatedItems
    })

    // Then update counter stock
    updateCounterStock(counterId, quantityDiff)
  }

  const clearCart = () => {
    // Store items before clearing to properly restore stock
    const itemsToRestore = [...cartItems]

    // Clear cart first
    setCartItems([])

    // Then restore all counter stocks
    itemsToRestore.forEach((item) => {
      updateCounterStock(item.counterId, -item.quantity)
    })
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
        countersStock,
        updateCounterStock,
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
