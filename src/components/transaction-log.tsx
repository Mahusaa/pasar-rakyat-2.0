"use client"

import { useState, useActionState, startTransition, use, useEffect } from "react"
import { CalendarIcon, Check, Download, Filter, Search } from "lucide-react"
import { format } from "date-fns"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { useUser } from "~/server/auth"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Badge } from "~/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Calendar } from "~/components/ui/calendar"
import type { Order } from "~/server/db/schema"
import { ScrollArea } from "./ui/scroll-area"
import { updatePaymentStatus } from "~/actions/payment-status"
import type { ActionResponse } from "~/actions/payment-status"

const initialState: ActionResponse = {
  success: false,
  message: '',
}


export default function TransactionLog({ orders }: { orders: Order[] }) {
  const { userPromise } = useUser()
  const user = use(userPromise)
  const [state, statusAction, isPending] = useActionState(updatePaymentStatus, initialState)
  const [searchTerm, setSearchTerm] = useState("")
  const [cashierFilter, setCashierFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [filteredTransactions, setFilteredTransactions] = useState(orders)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)


  // Calculate pagination values
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  // Handle items per page changes
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  const confirmQrisPayment = async (id: number) => {
    startTransition(() => {
      statusAction(id)
    })
  }

  const filteredLogs = orders.filter(order => {
    const isIDMatch = searchTerm === "" || order.counterId.toLowerCase().includes(searchTerm.toLowerCase());
    const isCashierMatch = cashierFilter === "all" || order.cashier === cashierFilter
    const isPaymentMatch = paymentFilter === "all" || order.paymentMethod.toLowerCase() === paymentFilter.toLowerCase()
    const isDateMatch = !date || format(order.time ?? new Date(), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")

    return isCashierMatch && isPaymentMatch && isDateMatch && isIDMatch
  })

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount)
  }

  // Function to export transactions to PDF
  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text("Transaction Logs", 14, 22)
    // Add date
    doc.setFontSize(11)
    doc.text(`Generated on: ${format(new Date(), "PPP")}`, 14, 30)

    // Format data for the table
    const tableData = filteredLogs.map((order) => [
      order.counterId,
      order.cashier,
      order.food,
      order.quantity,
      formatCurrency(Number(order.amount)),
      order.paymentMethod,
      format(order.time, "HH:mm:ss, dd MMM yyyy"),
      order.status,
    ])

    // Add table
    autoTable(doc, {
      head: [["ID", "Kasir", "Menu", "Qty", "Amount", "Payment", "Status", "Time"]],
      body: tableData,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [66, 66, 66] },
    })

    // Save the PDF
    doc.save("transaction-logs.pdf")
  }

  return (
    <div className="flex h-screen overflow-auto bg-background">
      <div className="flex-1 overflow-auto">
        <div className="p-6 flex flex-col gap-6">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Transaction Logs</h1>
              <Button variant="default" size="sm" onClick={exportToPDF}>
                <Download className="mr-2 h-4 w-4" />
                Export to PDF
              </Button>
            </div>
          </div>


          <Card>
            <CardHeader>
              <CardTitle>Filter Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex flex-grow items-center gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by ID"
                      className="pl-8 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <Select value={cashierFilter} onValueChange={setCashierFilter}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue placeholder="Cashier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kasir</SelectItem>
                      <SelectItem value="Kasir 1">Kasir 1</SelectItem>
                      <SelectItem value="Kasir 2">Kasir 2</SelectItem>
                      <SelectItem value="Kasir 3">Kasir 3</SelectItem>
                      <SelectItem value="Kasir 4">Kasir 4</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="qris">QRIS</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                    </SelectContent>
                  </Select>

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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Showing {filteredLogs.length} transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <div className="w-full">
                  <ScrollArea className="h-[300px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Kasir</TableHead>
                          <TableHead>Menu</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Time</TableHead>
                          {user?.role === "owner" && (
                            <TableHead>Action</TableHead>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLogs.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.counterId}</TableCell>
                            <TableCell><Badge variant="outline">{order.cashier}</Badge></TableCell>
                            <TableCell>{order.food}
                            </TableCell>
                            <TableCell>{order.quantity}
                            </TableCell>
                            <TableCell>{formatCurrency(Number(order.amount))}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {order.paymentMethod}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  order.status === "completed"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                }
                              >
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{format(order.time, "HH:mm:ss, dd MMM yyyy")}</TableCell>
                            {user?.role === "owner" && (
                              <TableCell>
                                {order.paymentMethod !== "cash" && order.status !== "completed" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex items-center"
                                    onClick={() => confirmQrisPayment(order.id)}
                                    disabled={isPending}
                                  >
                                    <Check className="mr-1 h-4 w-4" />
                                    Confirm
                                  </Button>
                                )}
                              </TableCell>

                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


