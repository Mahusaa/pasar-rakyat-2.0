"use client"

import { useState } from "react"
import { Card } from "~/components/ui/card"
import { Skeleton } from "~/components/ui/skeleton"
import type { Order } from "~/server/db/schema"
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover"
import { Button } from "./ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "./ui/calendar"

interface HoveredCell {
  counter: string;
  time: string;
  value: number;
}

export function TransactionHeatmap({
  data,
  groupBy = "counterId"
}: {
  data: Order[];
  groupBy?: keyof Order;
}) {
  const [hoveredCell, setHoveredCell] = useState<HoveredCell | null>(null)
  const [date, setDate] = useState<Date | undefined>(undefined)

  if (!data || data.length === 0) {
    return <Skeleton className="h-64 w-full" />
  }

  const filterDataByHourRange = (entry: Order) => {
    const entryHour = new Date(entry.time).getHours()
    return entryHour >= 16 && entryHour <= 18
  }

  const roundTo5Minutes = (date: Date): Date => {
    const minutes = date.getMinutes()
    const roundedMinutes = Math.floor(minutes / 5) * 5
    const newDate = new Date(date)
    newDate.setMinutes(roundedMinutes, 0, 0)
    return newDate
  }
  const filteredData = data.filter(entry => (!date || format(new Date(entry.time), "PPP") === format(date, "PPP")) && filterDataByHourRange(entry))

  const timeGroups: Record<string, Record<string, number>> = {}

  filteredData.forEach(entry => {
    const roundedDate = roundTo5Minutes(new Date(entry.time))
    const timeKey = roundedDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    if (!timeGroups[timeKey]) {
      timeGroups[timeKey] = {}
    }
  })

  const timeLabels = Object.keys(timeGroups).sort((a, b) => {
    return new Date(`01/01/2023 ${a}`).getTime() - new Date(`01/01/2023 ${b}`).getTime()
  })

  const counters = [...new Set(filteredData.map(entry => String(entry[groupBy])))]

  counters.forEach(counter => {
    timeLabels.forEach(time => {
      timeGroups[time]![counter] = 0
    })
  })

  filteredData.forEach(entry => {
    const roundedDate = roundTo5Minutes(new Date(entry.time))
    const timeKey = roundedDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    const counter = String(entry[groupBy])

    if (timeGroups[timeKey]?.[counter] !== undefined) {
      timeGroups[timeKey][counter]++
    }
  })

  const maxValue = Math.max(...Object.values(timeGroups).flatMap(group => Object.values(group)))

  const getColor = (value: number): string => {
    if (value === 0) return "#f3f4f6"
    const intensity = Math.min(value / maxValue, 1)
    if (intensity < 0.2) return "#ffedd5"
    if (intensity < 0.4) return "#fdba74"
    if (intensity < 0.6) return "#fb923c"
    if (intensity < 0.8) return "#f97316"
    return "#ea580c"
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1">
        <div className="p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Heatmap</h1>
              <div className="flex items-center gap-4 ">

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full md:w-48 justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="mt-6">
              {!date ? (<div className="col-span-full flex h-[300px] items-center justify-center rounded-lg border border-dashed">
                <div className="text-center">
                  <h3 className="text-lg font-medium">No data found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your date to find what you&apos;re looking for.
                  </p>
                </div>
              </div>) : counters.map((counter, rowIndex) => (
                <div key={counter} className="flex items-center mb-1">
                  <div className="w-24 text-sm font-medium pr-2 truncate" title={counter}>
                    {groupBy === "counterId" ? `Counter ${counter}` : counter}
                  </div>
                  <div className="flex flex-1 h-8">
                    {timeLabels.map((time, colIndex) => {
                      const value = timeGroups[time]![counter] ?? 0
                      const isHovered = hoveredCell &&
                        hoveredCell.counter === counter &&
                        hoveredCell.time === time

                      return (
                        <div
                          key={colIndex}
                          className={`flex-1 h-full mx-px relative ${isHovered ? "ring-2 ring-primary" : ""}`}
                          style={{ backgroundColor: getColor(value) }}
                          onMouseEnter={() =>
                            setHoveredCell({
                              counter,
                              time,
                              value
                            })
                          }
                          onMouseLeave={() => setHoveredCell(null)}
                        >
                          {isHovered && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
                              <Card className="p-2 text-xs shadow-lg">
                                <div>{groupBy === "counterId" ? "Counter: " : `${groupBy}: `}{counter}</div>
                                <div>Time: {time}</div>
                                <div>Transactions: {value}</div>
                              </Card>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
              }
            </div>

            <div className="mt-6 flex items-center justify-end">
              <div className="flex items-center">
                <span className="text-xs mr-2">0</span>
                <div className="flex h-2">
                  <div className="w-8" style={{ backgroundColor: "#f3f4f6" }}></div> {/* Neutral (Gray) */}
                  <div className="w-8" style={{ backgroundColor: "#ffedd5" }}></div> {/* Very light orange */}
                  <div className="w-8" style={{ backgroundColor: "#fdba74" }}></div> {/* Light orange */}
                  <div className="w-8" style={{ backgroundColor: "#fb923c" }}></div> {/* Medium orange */}
                  <div className="w-8" style={{ backgroundColor: "#f97316" }}></div> {/* Orange */}
                  <div className="w-8" style={{ backgroundColor: "#ea580c" }}></div> {/* Dark orange */}
                </div>
                <span className="text-xs ml-2">{maxValue}</span>
                <span className="text-xs ml-1">transactions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
