"use client"

import { ShoppingCart, Package, Plus, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { useDashboardStats, useProducts, useOrders } from "@/hooks/useLocalStorage"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export default function Component() {
  const stats = useDashboardStats()
  const { products } = useProducts()
  const { orders } = useOrders()

  // Get low stock items
  const lowStockItems = products.filter((p) => p.quantity <= p.lowStockThreshold && p.quantity > 0).slice(0, 3)

  // Get recent orders
  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

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

  return (
    <div className="flex h-screen bg-[#f9fafb]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#111827] mb-2">Dashboard Overview</h2>
            <p className="text-[#6b7280]">Welcome back! Here&apos;s what&apos;s happening with your store today.</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-[#e5e7eb]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#6b7280] mb-1">Total Orders</p>
                    <p className="text-2xl font-bold text-[#111827]">{stats.totalOrders}</p>
                    <p className="text-sm text-[#16a34a]">+12% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-[#dbeafe] rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-[#2563eb]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#e5e7eb]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#6b7280] mb-1">Active Products</p>
                    <p className="text-2xl font-bold text-[#111827]">{stats.activeProducts}</p>
                    <p className="text-sm text-[#16a34a]">+3 new this week</p>
                  </div>
                  <div className="w-12 h-12 bg-[#dcfce7] rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-[#16a34a]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#e5e7eb]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#6b7280] mb-1">Revenue</p>
                    <p className="text-2xl font-bold text-[#111827]">{formatCurrency(stats.revenue)}</p>
                    <p className="text-sm text-[#16a34a]">+8% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-[#fef9c3] rounded-lg flex items-center justify-center">
                    <span className="text-[#ca8a04] font-bold text-lg">₹</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#e5e7eb]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#6b7280] mb-1">Low Stock Items</p>
                    <p className="text-2xl font-bold text-[#111827]">{stats.lowStockItems}</p>
                    <p className="text-sm text-[#dc2626]">Needs attention</p>
                  </div>
                  <div className="w-12 h-12 bg-[#fee2e2] rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-[#dc2626]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Monthly Sales Performance */}
            <Card className="lg:col-span-2 border-[#e5e7eb]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-[#111827]">Monthly Sales Performance</CardTitle>
                <Button variant="ghost" className="text-[#2563eb] hover:text-[#1e40af]">
                  View Details
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-64 bg-[#f9fafb] rounded-lg flex items-center justify-center">
                  <p className="text-[#9ca3af]">Chart placeholder</p>
                </div>
              </CardContent>
            </Card>

            {/* Low Stock Alerts */}
            <Card className="border-[#e5e7eb]">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#111827]">Low Stock Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {lowStockItems.length > 0 ? (
                  <>
                    {lowStockItems.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          item.status === "Critical" ? "bg-[#fef2f2]" : "bg-[#fff7ed]"
                        }`}
                      >
                        <div>
                          <p className="font-medium text-[#111827]">{item.name}</p>
                          <p className="text-sm text-[#6b7280]">Only {item.quantity} left</p>
                        </div>
                        <Badge
                          className={
                            item.status === "Critical"
                              ? "bg-[#dc2626] hover:bg-[#dc2626]"
                              : "bg-[#ea580c] hover:bg-[#ea580c]"
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                    <Link href="/products">
                      <Button className="w-full bg-[#2563eb] hover:bg-[#1e40af]">View All Alerts</Button>
                    </Link>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[#6b7280]">No low stock items</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card className="border-[#e5e7eb]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-[#111827]">Recent Orders</CardTitle>
              <Link href="/add-product">
                <Button className="bg-[#2563eb] hover:bg-[#1e40af]">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Product
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#e5e7eb]">
                        <TableHead className="text-[#6b7280]">Order ID</TableHead>
                        <TableHead className="text-[#6b7280]">Customer</TableHead>
                        <TableHead className="text-[#6b7280]">Product</TableHead>
                        <TableHead className="text-[#6b7280]">Status</TableHead>
                        <TableHead className="text-[#6b7280]">Date</TableHead>
                        <TableHead className="text-[#6b7280]">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.id} className="border-[#e5e7eb]">
                          <TableCell className="font-medium text-[#111827]">{order.id}</TableCell>
                          <TableCell className="text-[#6b7280]">{order.customerName}</TableCell>
                          <TableCell className="text-[#6b7280]">
                            {order.items[0]?.productName || "N&apos;A"}
                            {order.items.length > 1 && ` +${order.items.length - 1} more`}
                          </TableCell>
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
                          <TableCell className="text-[#111827]">{formatCurrency(order.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="mt-4">
                    <Link href="/orders">
                      <Button variant="ghost" className="text-[#2563eb] hover:text-[#1e40af]">
                        View All Orders
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#6b7280]">No orders yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}