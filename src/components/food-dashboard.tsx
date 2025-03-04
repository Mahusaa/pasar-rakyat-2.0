"use client"

import { use, useState, useEffect, useMemo } from "react"
import { Search } from "lucide-react"
import { useCart } from "~/lib/cart-context"
import { ref, onValue, type DataSnapshot } from 'firebase/database';
import { type FoodCounter, type FoodItem } from "~/types/food-types"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import FoodCounterCard from "./food-counter-card"
import CartSidebar from "~/components/cart-sidebar"
import { ShoppingBag } from "lucide-react"
import { useUser } from "~/server/auth";
import { database } from "~/server/firebase"
import { ScrollArea } from "@radix-ui/react-scroll-area";

// Define interfaces for Firebase data structure
interface FirebaseFoodItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  disabled: boolean;
}

interface FirebaseFoodCounter {
  id?: string;
  name: string;
  description?: string;
  image?: string;
  stock: number;
  items?: Record<string, FirebaseFoodItem> | FirebaseFoodItem[];
  disabled: boolean;
}

type FirebaseFoodCounters = Record<string, FirebaseFoodCounter>;

export default function FoodDashboard() {
  const [counters, setCounters] = useState<FoodCounter[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("default")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { cartItems, cartTotal } = useCart()
  const { userPromise } = useUser()
  const user = use(userPromise)


  useEffect(() => {
    // Reference to 'foodCounters' in the database
    const foodCountersRef = ref(database, 'foodCounters');

    // Set up a listener for real-time updates
    const unsubscribe = onValue(foodCountersRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val() as FirebaseFoodCounters || {};

      // Convert the Firebase object to an array with IDs
      const foodCountersList: FoodCounter[] = Object.entries(data).map(([id, counter]) => {
        // Handle items - ensure they're always in array format
        let itemsArray: FoodItem[] = [];

        if (counter.items) {
          if (Array.isArray(counter.items)) {
            itemsArray = counter.items as FoodItem[];
          } else {
            itemsArray = Object.entries(counter.items).map(([id, item]) => ({
              ...(item as FoodItem), // Spread item first
              id,
              counterId: item.id
            }));
          }
        }


        return {
          id,
          name: counter.name,
          description: counter.description ?? '',
          image: counter.image ?? '',
          stock: counter.stock ?? 0,
          items: itemsArray,
          disabled: counter.disabled ?? false,
        };
      });

      setCounters(foodCountersList);
      setLoading(false);
    });

    // Clean up listener on unmount
    return () => unsubscribe();
  }, []);

  // Filter and sort food items based on search query and sort option
  const filteredCounters = useMemo(() => {
    let result = [...counters]

    // Apply search filter name, desc, items
    if (searchQuery) {
      result = result
        .map((counter) => {
          const isCounterMatch =
            counter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            counter.description.toLowerCase().includes(searchQuery.toLowerCase())

          const filteredItems = counter.items.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()),
          )

          if (isCounterMatch) {
            return {
              ...counter,
              items: counter.items,
            }
          }

          return {
            ...counter,
            items: filteredItems,
          }
        })
        .filter((counter) => counter.items.length > 0)
    }

    // Apply sorting
    if (sortBy === "price-high") {
      result = result.map((counter) => {
        return {
          ...counter,
          items: [...counter.items].sort((a, b) => b.price - a.price),
        }
      })
    } else if (sortBy === "price-low") {
      result = result.map((counter) => {
        return {
          ...counter,
          items: [...counter.items].sort((a, b) => a.price - b.price),
        }
      })
    }

    return result
  }, [counters, searchQuery, sortBy])

  return (
    <div className="flex h-screen bg-background">
      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Dagangan Kantek</h1>
              <div className="flex items-center gap-4 ">
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
                    className="relative rounded-full h-12 w-12 border-0 shadow-md"
                    onClick={() => setIsCartOpen(true)}
                  >
                    <ShoppingBag className="h-5 w-5" />
                    {cartItems.length > 0 && (
                      <Badge
                        key={cartTotal} // This will force re-render only when cartTotal changes
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-gradient-to-r from-teal-500 to-emerald-500 text-white border-2 border-white dark:border-zinc-800 animate-bounce"
                      >
                        {cartItems.length}
                      </Badge>
                    )}
                  </Button>
                </div>


              </div>
            </div>


            <ScrollArea className="h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin ">

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-lg">Loading food counters...</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredCounters.length > 0 ? (
                    filteredCounters.map((counter) => (
                      <FoodCounterCard key={counter.id} counter={counter} />
                    ))
                  ) : (
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
              )}
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Cart sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cashier={user?.name ?? "unknown"} />
    </div>
  )
}
