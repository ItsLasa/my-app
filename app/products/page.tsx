"use client"

import { useState } from "react"
import { Search, Filter, Plus, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ProductModal } from "@/components/product-modal"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { useProducts } from "@/hooks/useLocalStorage"
import type { Product } from "@/types"

export default function ProductsPage() {
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts()
  const [searchTerm, setSearchTerm] = useState("")
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate stats
  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === "Active").length,
    lowStock: products.filter((p) => p.status === "Low Stock").length,
    outOfStock: products.filter((p) => p.status === "Out of Stock").length,
  }

  const handleCreateProduct = () => {
    setSelectedProduct(undefined)
    setModalMode("create")
    setIsProductModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setModalMode("edit")
    setIsProductModalOpen(true)
  }

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteModalOpen(true)
  }

  const handleSaveProduct = (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    if (modalMode === "create") {
      addProduct(productData)
    } else if (selectedProduct) {
      updateProduct(selectedProduct.id, productData)
    }
  }

  const handleConfirmDelete = () => {
    if (selectedProduct) {
      deleteProduct(selectedProduct.id)
      setIsDeleteModalOpen(false)
      setSelectedProduct(undefined)
    }
  }

  const formatCurrency = (amount: number) => {
    return `Rs ${amount.toLocaleString()}`
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
              <h2 className="text-2xl font-bold text-[#111827] mb-2">Products</h2>
              <p className="text-[#6b7280]">Manage your school uniform inventory</p>
            </div>
            <Button onClick={handleCreateProduct} className="bg-[#2563eb] hover:bg-[#1e40af]">
              <Plus className="w-4 h-4 mr-2" />
              Add New Product
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="border-[#e5e7eb]">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-[#111827]">{stats.total}</div>
                <div className="text-sm text-[#6b7280]">Total Products</div>
              </CardContent>
            </Card>
            <Card className="border-[#e5e7eb]">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-[#16a34a]">{stats.active}</div>
                <div className="text-sm text-[#6b7280]">Active Products</div>
              </CardContent>
            </Card>
            <Card className="border-[#e5e7eb]">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-[#ea580c]">{stats.lowStock}</div>
                <div className="text-sm text-[#6b7280]">Low Stock</div>
              </CardContent>
            </Card>
            <Card className="border-[#e5e7eb]">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-[#dc2626]">{stats.outOfStock}</div>
                <div className="text-sm text-[#6b7280]">Out of Stock</div>
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
                    placeholder="Search products..."
                    className="pl-10 border-[#d1d5db]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="border-[#d1d5db] bg-transparent">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card className="border-[#e5e7eb]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#111827]">All Products</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredProducts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#e5e7eb]">
                      <TableHead className="text-[#6b7280]">Product</TableHead>
                      <TableHead className="text-[#6b7280]">Category</TableHead>
                      <TableHead className="text-[#6b7280]">Price</TableHead>
                      <TableHead className="text-[#6b7280]">Stock</TableHead>
                      <TableHead className="text-[#6b7280]">Status</TableHead>
                      <TableHead className="text-[#6b7280]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id} className="border-[#e5e7eb]">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images[0] || "/placeholder.svg?height=40&width=40"}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg bg-[#f3f4f6]"
                            />
                            <div>
                              <div className="font-medium text-[#111827]">{product.name}</div>
                              <div className="text-sm text-[#6b7280]">{product.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-[#6b7280]">{product.category}</TableCell>
                        <TableCell className="font-medium text-[#111827]">{formatCurrency(product.price)}</TableCell>
                        <TableCell className="text-[#6b7280]">{product.quantity}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              product.status === "Active"
                                ? "bg-[#dcfce7] text-[#166534] hover:bg-[#dcfce7]"
                                : product.status === "Low Stock"
                                  ? "bg-[#fff7ed] text-[#ea580c] hover:bg-[#fff7ed]"
                                  : product.status === "Critical"
                                    ? "bg-[#fee2e2] text-[#dc2626] hover:bg-[#fee2e2]"
                                    : "bg-[#f3f4f6] text-[#6b7280] hover:bg-[#f3f4f6]"
                            }
                          >
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="text-[#6b7280] hover:text-[#111827]">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#6b7280] hover:text-[#111827]"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#ef4444] hover:text-[#dc2626]"
                              onClick={() => handleDeleteProduct(product)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#6b7280]">No products found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
        mode={modalMode}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
        itemName={selectedProduct?.name || ""}
      />
    </div>
  )
}
