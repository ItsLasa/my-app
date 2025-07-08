"use client"

import { useState } from "react"
import { Search, Filter, Download, Eye, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useOrders } from "@/hooks/useLocalStorage"

export default function OrdersPage() {
  const { orders, loading, updateOrder } = useOrders()
  const [searchTerm, setSearchTerm] = useState("")

  // Filter orders based on search term
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate stats
  const stats = {
    total: orders.length,
    completed: orders.filter((o) => o.status === "Completed").length,
    processing: orders.filter((o) => o.status === "Processing").length,
    cancelled: orders.filter((o) => o.status === "Cancelled").length,
  }

  const formatCurrency = (amount: number) => {
    return `Rs ${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-[#f9fafb]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-[#6b7280]">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#f9fafb]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#111827] mb-2">Orders</h2>
              <p className="text-[#6b7280]">Manage and track all customer orders</p>
            </div>
            <Button className="bg-[#2563eb] hover:bg-[#1e40af]">
              <Download className="w-4 h-4 mr-2" />
              Export Orders
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="border-[#e5e7eb]">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-[#111827]">{stats.total}</div>
                <div className="text-sm text-[#6b7280]">Total Orders</div>
                <div className="text-xs text-[#16a34a]">+12% from last month</div>
              </CardContent>
            </Card>
            <Card className="border-[#e5e7eb]">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-[#16a34a]">{stats.completed}</div>
                <div className="text-sm text-[#6b7280]">Completed</div>
                <div className="text-xs text-[#16a34a]">+8% from last month</div>
              </CardContent>
            </Card>
            <Card className="border-[#e5e7eb]">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-[#ea580c]">{stats.processing}</div>
                <div className="text-sm text-[#6b7280]">Processing</div>
                <div className="text-xs text-[#ea580c]">+3% from last month</div>
              </CardContent>
            </Card>
            <Card className="border-[#e5e7eb]">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-[#dc2626]">{stats.cancelled}</div>
                <div className="text-sm text-[#6b7280]">Cancelled</div>
                <div className="text-xs text-[#dc2626]">-2% from last month</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="border-[#e5e7eb] mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9ca3af] w-4 h-4" />
                  <Input
                    placeholder="Search orders..."
                    className="pl-10 border-[#d1d5db]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="border-[#d1d5db] bg-transparent">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter by Status
                </Button>
                <Button variant="outline" className="border-[#d1d5db] bg-transparent">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter by Date
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card className="border-[#e5e7eb]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#111827]">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredOrders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#e5e7eb]">
                      <TableHead className="text-[#6b7280]">Order ID</TableHead>
                      <TableHead className="text-[#6b7280]">Customer</TableHead>
                      <TableHead className="text-[#6b7280]">Items</TableHead>
                      <TableHead className="text-[#6b7280]">Amount</TableHead>
                      <TableHead className="text-[#6b7280]">Status</TableHead>
                      <TableHead className="text-[#6b7280]">Date</TableHead>
                      <TableHead className="text-[#6b7280]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id} className="border-[#e5e7eb]">
                        <TableCell className="font-medium text-[#111827]">{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-[#111827]">{order.customerName}</div>
                            <div className="text-sm text-[#6b7280]">{order.customerEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-[#6b7280]">
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </TableCell>
                        <TableCell className="font-medium text-[#111827]">{formatCurrency(order.total)}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              order.status === "Completed"
                                ? "bg-[#dcfce7] text-[#166534] hover:bg-[#dcfce7]"
                                : order.status === "Processing"
                                  ? "bg-[#fef9c3] text-[#854d0e] hover:bg-[#fef9c3]"
                                  : order.status === "Shipped"
                                    ? "bg-[#dbeafe] text-[#1e40af] hover:bg-[#dbeafe]"
                                    : order.status === "Pending"
                                      ? "bg-[#fff7ed] text-[#ea580c] hover:bg-[#fff7ed]"
                                      : "bg-[#fee2e2] text-[#dc2626] hover:bg-[#fee2e2]"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[#6b7280]">{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="text-[#6b7280] hover:text-[#111827]">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-[#6b7280] hover:text-[#111827]">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#6b7280]">No orders found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
