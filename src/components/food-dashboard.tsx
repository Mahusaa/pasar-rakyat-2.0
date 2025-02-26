"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { useCart } from "~/lib/cart-context"
import { type FoodCounter } from "~/types/food-types"
import { foodCounters } from "~/lib/mock-data"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import FoodCounterCard from "./food-counter-card"
import CartSidebar from "~/components/cart-sidebar"
import { ShoppingBag } from "lucide-react"

export default function FoodDashboard() {
  const [counters, setCounters] = useState<FoodCounter[]>(foodCounters)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("default")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { cartItems, cartTotal } = useCart()

  // Filter and sort food items based on search query and sort option
  useEffect(() => {
    let filteredCounters = JSON.parse(JSON.stringify(foodCounters)) as FoodCounter[]

    // Apply search filter
    if (searchQuery) {
      filteredCounters = filteredCounters
        .map((counter) => {
          return {
            ...counter,
            items: counter.items.filter(
              (item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
          }
        })
        .filter((counter) => counter.items.length > 0)
    }


    // Apply sorting
    if (sortBy === "price-high") {
      filteredCounters = filteredCounters.map((counter) => {
        return {
          ...counter,
          items: [...counter.items].sort((a, b) => b.price - a.price),
        }
      })
    } else if (sortBy === "price-low") {
      filteredCounters = filteredCounters.map((counter) => {
        return {
          ...counter,
          items: [...counter.items].sort((a, b) => a.price - b.price),
        }
      })
    }

    setCounters(filteredCounters)
  }, [searchQuery, sortBy])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Dagangan Kantek</h1>
              <div className="flex items-center gap-4">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Cari dagangan"
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="price-high">Highest Price</SelectItem>
                    <SelectItem value="price-low">Lowest Price</SelectItem>
                  </SelectContent>
                </Select>
                <div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative rounded-full h-12 w-12 border-0  shadow-md"
                    onClick={() => setIsCartOpen(true)}
                  >
                    <ShoppingBag className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                    {cartItems.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-gradient-to-r from-teal-500 to-emerald-500 text-white border-2 border-white dark:border-zinc-800">
                        {cartItems.length}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {counters.map((counter) => (
                <FoodCounterCard key={counter.id} counter={counter} />
              ))}

              {counters.length === 0 && (
                <div className="col-span-full flex h-[300px] items-center justify-center rounded-lg border border-dashed">
                  <div className="text-center">
                    <h3 className="text-lg font-medium">No food items found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or filter to find what you&apos;re looking for.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cart sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}


