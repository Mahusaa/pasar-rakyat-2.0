"use client"
import { useState } from "react"
import { Utensils, ChevronDown, ChevronUp, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "~/components/ui/card"
import type { FoodCounter } from "~/types/food-types"
import { Badge } from "~/components/ui/badge"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"
import FoodMenuItem from "./food-menu-item"

interface FoodCounterCardProps {
  counter: FoodCounter
}

export default function FoodCounterCard({ counter }: FoodCounterCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Utensils className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <CardTitle>{counter.name}</CardTitle>
              <Badge
                className={cn(counter.stock > 0 ? "bg-green-500" : "bg-red-500")}
              >
                Stock: {counter.stock}
              </Badge>
            </div>
            <CardDescription>{counter.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow p-0">
        {/* This div will take up available space and push the button to the bottom */}
        <div className="flex-grow">
          {isExpanded && (
            <ScrollArea className="h-[300px] px-6">
              <div className="space-y-4 pb-4">
                {counter.items.map((item) => (
                  <FoodMenuItem key={item.id} item={item} counterId={counter.id} counterStock={counter.stock} />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Button section always at the bottom */}
        <div className="px-6 py-2 mt-auto">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span>{isExpanded ? "Hide menu" : "Show menu"}</span>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

