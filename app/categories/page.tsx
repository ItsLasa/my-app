"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { useCategories, useProducts } from "@/hooks/useLocalStorage"
import type { Category } from "@/types"

export default function CategoriesPage() {
  const { categories, loading, deleteCategory } = useCategories()
  const { products } = useProducts()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>()

  // Filter categories based on search term
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Update product counts for categories
  const categoriesWithCounts = filteredCategories.map((category) => ({
    ...category,
    productCount: products.filter((p) => p.category === category.name).length,
  }))

  // Calculate stats
  const stats = {
    total: categories.length,
    active: categories.filter((c) => c.status === "Active").length,
    totalProducts: products.length,
    largestCategory: Math.max(...categories.map((c) => products.filter((p) => p.category === c.name).length), 0),
  }

  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedCategory) {
      deleteCategory(selectedCategory.id)
      setIsDeleteModalOpen(false)
      setSelectedCategory(undefined)
    }
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
              <h2 className="text-2xl font-bold text-[#111827] mb-2">Categories</h2>
              <p className="text-[#6b7280]">Organize your products into categories</p>
            </div>
            <Button className="bg-[#2563eb] hover:bg-[#1e40af]">
              <Plus className="w-4 h-4 mr-2" />
              Add New Category
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="border-[#e5e7eb]">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-[#111827]">{stats.total}</div>
                <div className="text-sm text-[#6b7280]">Total Categories</div>
              </CardContent>
            </Card>
            <Card className="border-[#e5e7eb]">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-[#16a34a]">{stats.active}</div>
                <div className="text-sm text-[#6b7280]">Active Categories</div>
              </CardContent>
            </Card>
            <Card className="border-[#e5e7eb]">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-[#2563eb]">{stats.totalProducts}</div>
                <div className="text-sm text-[#6b7280]">Total Products</div>
              </CardContent>
            </Card>
            <Card className="border-[#e5e7eb]">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-[#ea580c]">{stats.largestCategory}</div>
                <div className="text-sm text-[#6b7280]">Largest Category</div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="border-[#e5e7eb] mb-6">
            <CardContent className="p-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9ca3af] w-4 h-4" />
                <Input
                  placeholder="Search categories..."
                  className="pl-10 border-[#d1d5db]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Categories Grid */}
          {categoriesWithCounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoriesWithCounts.map((category) => (
                <Card key={category.id} className="border-[#e5e7eb] hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#dbeafe] rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-[#2563eb]" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-[#111827]">{category.name}</CardTitle>
                          <p className="text-sm text-[#6b7280]">{category.id}</p>
                        </div>
                      </div>
                      <Badge
                        className={
                          category.status === "Active"
                            ? "bg-[#dcfce7] text-[#166534] hover:bg-[#dcfce7]"
                            : "bg-[#f3f4f6] text-[#6b7280] hover:bg-[#f3f4f6]"
                        }
                      >
                        {category.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-[#6b7280] text-sm mb-4">{category.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-[#6b7280]">
                        <span className="font-medium text-[#111827]">{category.productCount}</span> products
                      </div>
                      <div className="text-sm text-[#6b7280]">Created {formatDate(category.createdAt)}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="flex-1 border-[#d1d5db] bg-transparent">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[#ef4444] border-[#ef4444] hover:bg-[#fef2f2] bg-transparent"
                        onClick={() => handleDeleteCategory(category)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-[#9ca3af] mx-auto mb-4" />
              <p className="text-[#6b7280] mb-4">No categories found</p>
              <Button className="bg-[#2563eb] hover:bg-[#1e40af]">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Category
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        itemName={selectedCategory?.name || ""}
      />
    </div>
  )
}
