"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Product } from "@/types"
import { useCategories } from "@/hooks/useLocalStorage"

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void
  product?: Product
  mode: "create" | "edit"
}

export function ProductModal({ isOpen, onClose, onSave, product, mode }: ProductModalProps) {
  const { categories } = useCategories()
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
    status: "Active" as Product["status"],
    featured: false,
    requiresShipping: true,
  })

  useEffect(() => {
    if (product && mode === "edit") {
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        brand: product.brand,
        price: product.price,
        comparePrice: product.comparePrice || 0,
        costPrice: product.costPrice || 0,
        sku: product.sku,
        barcode: product.barcode || "",
        quantity: product.quantity,
        lowStockThreshold: product.lowStockThreshold,
        status: product.status,
        featured: product.featured,
        requiresShipping: product.requiresShipping,
      })
    } else {
      setFormData({
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
        status: "Active",
        featured: false,
        requiresShipping: true,
      })
    }
  }, [product, mode, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Determine status based on quantity
    let status: Product["status"] = formData.status
    if (formData.quantity === 0) {
      status = "Out of Stock"
    } else if (formData.quantity <= formData.lowStockThreshold) {
      status = formData.quantity <= 5 ? "Critical" : "Low Stock"
    }

    const productData: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
      ...formData,
      status,
      images: ["/placeholder.svg?height=300&width=300"],
      variants: [],
    }

    onSave(productData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#e5e7eb]">
          <h2 className="text-xl font-bold text-[#111827]">{mode === "create" ? "Add New Product" : "Edit Product"}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
                className="border-[#d1d5db]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
                required
                className="border-[#d1d5db]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="border-[#d1d5db]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="border-[#d1d5db]">
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
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
                className="border-[#d1d5db]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (Rs)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                required
                className="border-[#d1d5db]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comparePrice">Compare Price (Rs)</Label>
              <Input
                id="comparePrice"
                type="number"
                value={formData.comparePrice}
                onChange={(e) => setFormData((prev) => ({ ...prev, comparePrice: Number(e.target.value) }))}
                className="border-[#d1d5db]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="costPrice">Cost Price (Rs)</Label>
              <Input
                id="costPrice"
                type="number"
                value={formData.costPrice}
                onChange={(e) => setFormData((prev) => ({ ...prev, costPrice: Number(e.target.value) }))}
                className="border-[#d1d5db]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
                required
                className="border-[#d1d5db]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                value={formData.lowStockThreshold}
                onChange={(e) => setFormData((prev) => ({ ...prev, lowStockThreshold: Number(e.target.value) }))}
                className="border-[#d1d5db]"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, featured: !!checked }))}
              />
              <Label htmlFor="featured">Featured product</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requiresShipping"
                checked={formData.requiresShipping}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, requiresShipping: !!checked }))}
              />
              <Label htmlFor="requiresShipping">Requires shipping</Label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1 bg-[#2563eb] hover:bg-[#1e40af]">
              {mode === "create" ? "Create Product" : "Update Product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-[#d1d5db] bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
