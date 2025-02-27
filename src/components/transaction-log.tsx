"use client"

import { useState } from "react"
import { CalendarIcon, Check, Download, Filter, Search } from "lucide-react"
import { format } from "date-fns"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Badge } from "~/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Calendar } from "~/components/ui/calendar"

// Sample transaction data
const transactions = [
  {
    id: "T001",
    customerName: "John Doe",
    menuItems: ["Fried Chicken", "Cola"],
    cashier: 1,
    paymentMethod: "Cash",
    time: new Date("2023-06-15T12:30:45"),
    totalAmount: 45000,
    status: "completed",
  },
  {
    id: "T002",
    customerName: "Jane Smith",
    menuItems: ["Burger", "Fries", "Milkshake"],
    cashier: 2,
    paymentMethod: "QRIS",
    time: new Date("2023-06-15T13:15:22"),
    totalAmount: 65000,
    status: "pending",
  },
  {
    id: "T003",
    customerName: "Robert Johnson",
    menuItems: ["Pizza", "Garlic Bread", "Soda"],
    cashier: 3,
    paymentMethod: "Credit Card",
    time: new Date("2023-06-15T14:20:33"),
    totalAmount: 120000,
    status: "completed",
  },
  {
    id: "T004",
    customerName: "Emily Davis",
    menuItems: ["Salad", "Iced Tea"],
    cashier: 1,
    paymentMethod: "QRIS",
    time: new Date("2023-06-15T15:05:17"),
    totalAmount: 35000,
    status: "pending",
  },
  {
    id: "T005",
    customerName: "Michael Wilson",
    menuItems: ["Steak", "Mashed Potatoes", "Wine"],
    cashier: 4,
    paymentMethod: "Cash",
    time: new Date("2023-06-15T18:30:55"),
    totalAmount: 250000,
    status: "completed",
  },
]

export default function TransactionLog() {
  const [searchTerm, setSearchTerm] = useState("")
  const [cashierFilter, setCashierFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [filteredTransactions, setFilteredTransactions] = useState(transactions)

  // Function to confirm QRIS payment
  const confirmQrisPayment = (id: string) => {
    setFilteredTransactions(
      filteredTransactions.map((transaction) =>
        transaction.id === id ? { ...transaction, status: "completed" } : transaction,
      ),
    )
  }

  // Function to apply filters
  const applyFilters = () => {
    let filtered = transactions

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply cashier filter
    if (cashierFilter !== "all") {
      filtered = filtered.filter((transaction) => transaction.cashier === Number.parseInt(cashierFilter))
    }

    // Apply payment method filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.paymentMethod.toLowerCase() === paymentFilter.toLowerCase(),
      )
    }

    // Apply date filter
    if (date) {
      filtered = filtered.filter((transaction) => format(transaction.time, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"))
    }

    setFilteredTransactions(filtered)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount)
  }

  // Function to export transactions to PDF
  const exportToPDF = () => {
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(18)
    doc.text("Transaction Logs", 14, 22)

    // Add date
    doc.setFontSize(11)
    doc.text(`Generated on: ${format(new Date(), "PPP")}`, 14, 30)

    // Format data for the table
    const tableData = filteredTransactions.map((transaction) => [
      transaction.id,
      transaction.customerName,
      transaction.menuItems.join(", "),
      `Cashier ${transaction.cashier}`,
      transaction.paymentMethod,
      format(transaction.time, "HH:mm:ss, dd MMM yyyy"),
      formatCurrency(transaction.totalAmount),
      transaction.status === "completed" ? "Completed" : "Pending",
    ])

    // Add table
    autoTable(doc, {
      head: [["ID", "Customer", "Menu Items", "Cashier", "Payment", "Time", "Amount", "Status"]],
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
              <Button variant="outline" size="sm" onClick={exportToPDF}>
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
                      placeholder="Search by name"
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
                      <SelectItem value="all">All Cashiers</SelectItem>
                      <SelectItem value="1">Cashier 1</SelectItem>
                      <SelectItem value="2">Cashier 2</SelectItem>
                      <SelectItem value="3">Cashier 3</SelectItem>
                      <SelectItem value="4">Cashier 4</SelectItem>
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
                      <SelectItem value="credit card">Credit Card</SelectItem>
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

                <Button onClick={applyFilters} className="mt-0 md:mt-0 w-full md:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Showing {filteredTransactions.length} transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Menu Items</TableHead>
                      <TableHead>Cashier</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{transaction.customerName}</TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            {transaction.menuItems.map((item, index) => (
                              <span key={index}>{item}</span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Cashier {transaction.cashier}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={transaction.paymentMethod === "QRIS" ? "secondary" : "outline"}>
                            {transaction.paymentMethod}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(transaction.time, "HH:mm:ss, dd MMM yyyy")}</TableCell>
                        <TableCell>{formatCurrency(transaction.totalAmount)}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              transaction.status === "completed"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            }
                          >
                            {transaction.status === "completed" ? "Completed" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {transaction.paymentMethod === "QRIS" && transaction.status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center"
                              onClick={() => confirmQrisPayment(transaction.id)}
                            >
                              <Check className="mr-1 h-4 w-4" />
                              Confirm
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


