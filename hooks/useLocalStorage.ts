"use client"

import { useState, useEffect } from "react"
import type { Product, Order, Customer, Category, DashboardStats } from "@/types"
import { productStorage, orderStorage, customerStorage, categoryStorage, initializeData } from "@/lib/storage"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeData()
    setProducts(productStorage.getAll())
    setLoading(false)
  }, [])

  const addProduct = (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    const newProduct = productStorage.create(productData)
    setProducts((prev) => [...prev, newProduct])
    return newProduct
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updatedProduct = productStorage.update(id, updates)
    if (updatedProduct) {
      setProducts((prev) => prev.map((p) => (p.id === id ? updatedProduct : p)))
    }
    return updatedProduct
  }

  const deleteProduct = (id: string) => {
    const success = productStorage.delete(id)
    if (success) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
    }
    return success
  }

  const getProduct = (id: string) => {
    return products.find((p) => p.id === id)
  }

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
  }
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeData()
    setOrders(orderStorage.getAll())
    setLoading(false)
  }, [])

  const addOrder = (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">) => {
    const newOrder = orderStorage.create(orderData)
    setOrders((prev) => [...prev, newOrder])
    return newOrder
  }

  const updateOrder = (id: string, updates: Partial<Order>) => {
    const updatedOrder = orderStorage.update(id, updates)
    if (updatedOrder) {
      setOrders((prev) => prev.map((o) => (o.id === id ? updatedOrder : o)))
    }
    return updatedOrder
  }

  const deleteOrder = (id: string) => {
    const success = orderStorage.delete(id)
    if (success) {
      setOrders((prev) => prev.filter((o) => o.id !== id))
    }
    return success
  }

  const getOrder = (id: string) => {
    return orders.find((o) => o.id === id)
  }

  return {
    orders,
    loading,
    addOrder,
    updateOrder,
    deleteOrder,
    getOrder,
  }
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeData()
    setCustomers(customerStorage.getAll())
    setLoading(false)
  }, [])

  const addCustomer = (customerData: Omit<Customer, "id" | "createdAt" | "updatedAt">) => {
    const newCustomer = customerStorage.create(customerData)
    setCustomers((prev) => [...prev, newCustomer])
    return newCustomer
  }

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    const updatedCustomer = customerStorage.update(id, updates)
    if (updatedCustomer) {
      setCustomers((prev) => prev.map((c) => (c.id === id ? updatedCustomer : c)))
    }
    return updatedCustomer
  }

  const deleteCustomer = (id: string) => {
    const success = customerStorage.delete(id)
    if (success) {
      setCustomers((prev) => prev.filter((c) => c.id !== id))
    }
    return success
  }

  const getCustomer = (id: string) => {
    return customers.find((c) => c.id === id)
  }

  return {
    customers,
    loading,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomer,
  }
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeData()
    setCategories(categoryStorage.getAll())
    setLoading(false)
  }, [])

  const addCategory = (categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">) => {
    const newCategory = categoryStorage.create(categoryData)
    setCategories((prev) => [...prev, newCategory])
    return newCategory
  }

  const updateCategory = (id: string, updates: Partial<Category>) => {
    const updatedCategory = categoryStorage.update(id, updates)
    if (updatedCategory) {
      setCategories((prev) => prev.map((c) => (c.id === id ? updatedCategory : c)))
    }
    return updatedCategory
  }

  const deleteCategory = (id: string) => {
    const success = categoryStorage.delete(id)
    if (success) {
      setCategories((prev) => prev.filter((c) => c.id !== id))
    }
    return success
  }

  const getCategory = (id: string) => {
    return categories.find((c) => c.id === id)
  }

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategory,
  }
}

export function useDashboardStats(): DashboardStats {
  const { products } = useProducts()
  const { orders } = useOrders()
  const { customers } = useCustomers()

  const stats: DashboardStats = {
    totalOrders: orders.length,
    activeProducts: products.filter((p) => p.status === "Active").length,
    revenue: orders.filter((o) => o.status === "Completed").reduce((sum, order) => sum + order.total, 0),
    lowStockItems: products.filter((p) => p.quantity <= p.lowStockThreshold && p.quantity > 0).length,
    totalCustomers: customers.length,
    completedOrders: orders.filter((o) => o.status === "Completed").length,
    processingOrders: orders.filter((o) => o.status === "Processing").length,
    cancelledOrders: orders.filter((o) => o.status === "Cancelled").length,
  }

  return stats
}
