"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useProducts, useCategories } from "@/hooks/useLocalStorage"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AddProductPage() {
  const router = useRouter()
  const { addProduct } = useProducts()
  const { categories } = useCategories()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: 0,
    comparePrice: 0,
    costPrice: 0,
    sku: "",
    barcode: "",
    quantity: 0,
    lowStockThreshold: 10,
    status: "Active" as const,
    featured: false,
    requiresShipping: true,
    trackQuantity: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Determine status based on quantity
      let status: "Active" | "Draft" | "Archived" | "Low Stock" | "Critical" | "Out of Stock" = formData.status
      if (formData.trackQuantity) {
        if (formData.quantity === 0) {
          status = "Out of Stock"
        } else if (formData.quantity <= formData.lowStockThreshold) {
          status = formData.quantity <= 5 ? "Critical" : "Low Stock"
        }
      }

      const productData = {
        ...formData,
        status,
        images: ["/placeholder.svg?height=300&width=300"],
        variants: [],
      }

      addProduct(productData)
      router.push("/products")
    } catch (error) {
      console.error("Error creating product:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveAsDraft = () => {
    const draftData = {
      ...formData,
      status: "Draft" as const,
      images: ["/placeholder.svg?height=300&width=300"],
      variants: [],
    }

    addProduct(draftData)
    router.push("/products")
  }

  return (
    <div className="flex h-screen bg-[#f9fafb]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/products">
              <Button variant="outline" size="sm" className="border-[#d1d5db] bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Button>
            </Link>
            <div>
              <h2 className="text-2xl font-bold text-[#111827] mb-2">Add New Product</h2>
              <p className="text-[#6b7280]">Create a new product for your school uniform store</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Product Information */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-[#e5e7eb]">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#111827]">Product Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="productName" className="text-[#374151]">
                          Product Name *
                        </Label>
                        <Input
                          id="productName"
                          placeholder="e.g., School Shirt - White"
                          className="border-[#d1d5db] focus:border-[#2563eb]"
                          value={formData.name}
                          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sku" className="text-[#374151]">
                          SKU *
                        </Label>
                        <Input
                          id="sku"
                          placeholder="e.g., SS-WHT-M"
                          className="border-[#d1d5db] focus:border-[#2563eb]"
                          value={formData.sku}
                          onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-[#374151]">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Enter product description..."
                        className="border-[#d1d5db] focus:border-[#2563eb] min-h-[100px]"
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-[#374151]">
                          Category *
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                          required
                        >
                          <SelectTrigger className="border-[#d1d5db] focus:border-[#2563eb]">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="brand" className="text-[#374151]">
                          Brand
                        </Label>
                        <Input
                          id="brand"
                          placeholder="e.g., School Master"
                          className="border-[#d1d5db] focus:border-[#2563eb]"
                          value={formData.brand}
                          onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#e5e7eb]">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#111827]">Pricing & Inventory</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-[#374151]">
                          Price (Rs) *
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          placeholder="0.00"
                          className="border-[#d1d5db] focus:border-[#2563eb]"
                          value={formData.price || ""}
                          onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="comparePrice" className="text-[#374151]">
                          Compare at Price (Rs)
                        </Label>
                        <Input
                          id="comparePrice"
                          type="number"
                          placeholder="0.00"
                          className="border-[#d1d5db] focus:border-[#2563eb]"
                          value={formData.comparePrice || ""}
                          onChange={(e) => setFormData((prev) => ({ ...prev, comparePrice: Number(e.target.value) }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="costPrice" className="text-[#374151]">
                          Cost per Item (Rs)
                        </Label>
                        <Input
                          id="costPrice"
                          type="number"
                          placeholder="0.00"
                          className="border-[#d1d5db] focus:border-[#2563eb]"
                          value={formData.costPrice || ""}
                          onChange={(e) => setFormData((prev) => ({ ...prev, costPrice: Number(e.target.value) }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="barcode" className="text-[#374151]">
                          Barcode
                        </Label>
                        <Input
                          id="barcode"
                          placeholder="e.g., 1234567890123"
                          className="border-[#d1d5db] focus:border-[#2563eb]"
                          value={formData.barcode}
                          onChange={(e) => setFormData((prev) => ({ ...prev, barcode: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="trackQuantity"
                          checked={formData.trackQuantity}
                          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, trackQuantity: !!checked }))}
                        />
                        <Label htmlFor="trackQuantity" className="text-[#374151]">
                          Track quantity
                        </Label>
                      </div>

                      {formData.trackQuantity && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="quantity" className="text-[#374151]">
                              Quantity *
                            </Label>
                            <Input
                              id="quantity"
                              type="number"
                              placeholder="0"
                              className="border-[#d1d5db] focus:border-[#2563eb]"
                              value={formData.quantity || ""}
                              onChange={(e) => setFormData((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
                              required={formData.trackQuantity}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lowStockThreshold" className="text-[#374151]">
                              Low Stock Threshold
                            </Label>
                            <Input
                              id="lowStockThreshold"
                              type="number"
                              placeholder="10"
                              className="border-[#d1d5db] focus:border-[#2563eb]"
                              value={formData.lowStockThreshold || ""}
                              onChange={(e) =>
                                setFormData((prev) => ({ ...prev, lowStockThreshold: Number(e.target.value) }))
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-[#e5e7eb]">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#111827]">Product Images</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-[#d1d5db] rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 text-[#9ca3af] mx-auto mb-4" />
                      <div className="text-[#6b7280] mb-2">
                        <span className="font-medium text-[#2563eb] cursor-pointer">Click to upload</span> or drag and
                        drop
                      </div>
                      <div className="text-sm text-[#9ca3af]">PNG, JPG, GIF up to 10MB</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card className="border-[#e5e7eb]">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-[#111827]">Product Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-[#374151]">
                        Status
                      </Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: "Active" | "Draft" | "Archived") =>
                          setFormData((prev) => ({ ...prev, status: value }))
                        }
                      >
                        <SelectTrigger className="border-[#d1d5db] focus:border-[#2563eb]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="featured"
                          checked={formData.featured}
                          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: !!checked }))}
                        />
                        <Label htmlFor="featured" className="text-[#374151]">
                          Featured product
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="requiresShipping"
                          checked={formData.requiresShipping}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({ ...prev, requiresShipping: !!checked }))
                          }
                        />
                        <Label htmlFor="requiresShipping" className="text-[#374151]">
                          This product requires shipping
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <Button type="submit" className="w-full bg-[#2563eb] hover:bg-[#1e40af]" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Save Product"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-[#d1d5db] bg-transparent"
                    onClick={handleSaveAsDraft}
                    disabled={isSubmitting}
                  >
                    Save as Draft
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
