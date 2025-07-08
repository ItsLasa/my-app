"use client"

import { useState } from "react"
import { Search, Filter, Plus, Eye, Edit, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useCustomers } from "@/hooks/useLocalStorage"

export default function CustomersPage() {
  const { customers, loading } = useCustomers()
  const [searchTerm, setSearchTerm] = useState("")

  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate stats
  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.status === "Active").length,
    vip: customers.filter((c) => c.status === "VIP").length,
    newThisMonth: customers.filter((c) => c.status === "New").length,
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
              <h2 className="text-2xl font-bold text-[#111827] mb-2">Customers</h2>
              <p className="text-[#6b7280]">Manage your customer relationships</p>
            </div>
            <Button className="bg-[#2563eb] hover:bg-[#1e40af]">
              <Plus className="w-4 h-4 mr-2" />
              Add New Customer
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="border-[#e5e7eb]">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-[#111827]">{stats.total}</div>
                <div className="text-sm text-[#6b7280]">Total Customers</div>
                <div className="text-xs text-[#16a34a]">+15% from last month</div>
              </CardContent>
            </Card>
            <Card className="border-[#e5e7eb]">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-[#16a34a]">{stats.active}</div>
                <div className="text-sm text-[#6b7280]">Active Customers</div>
                <div className="text-xs text-[#16a34a]">+12% from last month</div>
              </CardContent>
            </Card>
            <Card className="border-[#e5e7eb]">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-[#2563eb]">{stats.vip}</div>
                <div className="text-sm text-[#6b7280]">VIP Customers</div>
                <div className="text-xs text-[#2563eb]">+8% from last month</div>
              </CardContent>
            </Card>
            <Card className="border-[#e5e7eb]">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-[#ea580c]">{stats.newThisMonth}</div>
                <div className="text-sm text-[#6b7280]">New This Month</div>
                <div className="text-xs text-[#ea580c]">+25% from last month</div>
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
                    placeholder="Search customers..."
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

          {/* Customers Table */}
          <Card className="border-[#e5e7eb]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#111827]">All Customers</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredCustomers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#e5e7eb]">
                      <TableHead className="text-[#6b7280]">Customer</TableHead>
                      <TableHead className="text-[#6b7280]">Contact</TableHead>
                      <TableHead className="text-[#6b7280]">Orders</TableHead>
                      <TableHead className="text-[#6b7280]">Total Spent</TableHead>
                      <TableHead className="text-[#6b7280]">Status</TableHead>
                      <TableHead className="text-[#6b7280]">Last Order</TableHead>
                      <TableHead className="text-[#6b7280]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id} className="border-[#e5e7eb]">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-[#2563eb] text-white text-sm">
                                {customer.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-[#111827]">{customer.name}</div>
                              <div className="text-sm text-[#6b7280]">{customer.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-[#6b7280]">
                              <Mail className="w-3 h-3" />
                              {customer.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#6b7280]">
                              <Phone className="w-3 h-3" />
                              {customer.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-[#6b7280]">{customer.totalOrders}</TableCell>
                        <TableCell className="font-medium text-[#111827]">
                          {formatCurrency(customer.totalSpent)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              customer.status === "Active"
                                ? "bg-[#dcfce7] text-[#166534] hover:bg-[#dcfce7]"
                                : customer.status === "VIP"
                                  ? "bg-[#dbeafe] text-[#1e40af] hover:bg-[#dbeafe]"
                                  : customer.status === "New"
                                    ? "bg-[#fff7ed] text-[#ea580c] hover:bg-[#fff7ed]"
                                    : "bg-[#f3f4f6] text-[#6b7280] hover:bg-[#f3f4f6]"
                            }
                          >
                            {customer.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[#6b7280]">
                          {customer.lastOrderDate ? formatDate(customer.lastOrderDate) : "Never"}
                        </TableCell>
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
                  <p className="text-[#6b7280]">No customers found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
