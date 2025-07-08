export interface Product {
  id: string
  name: string
  description: string
  category: string
  brand: string
  price: number
  comparePrice?: number
  costPrice?: number
  sku: string
  barcode?: string
  quantity: number
  lowStockThreshold: number
  status: "Active" | "Draft" | "Archived" | "Low Stock" | "Critical" | "Out of Stock"
  featured: boolean
  requiresShipping: boolean
  images: string[]
  variants: ProductVariant[]
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: string
  size?: string
  color?: string
  price?: number
  quantity?: number
  sku?: string
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: "Pending" | "Processing" | "Shipped" | "Completed" | "Cancelled"
  paymentMethod: "Card" | "Bank Transfer" | "Cash"
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded"
  shippingAddress: Address
  billingAddress: Address
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  variant?: string
  quantity: number
  price: number
  total: number
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  status: "Active" | "Inactive" | "VIP" | "New"
  totalOrders: number
  totalSpent: number
  addresses: Address[]
  notes?: string
  createdAt: string
  updatedAt: string
  lastOrderDate?: string
}

export interface Address {
  id: string
  type: "shipping" | "billing"
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  province: string
  postalCode: string
  country: string
  phone?: string
}

export interface Category {
  id: string
  name: string
  description: string
  status: "Active" | "Inactive"
  productCount: number
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalOrders: number
  activeProducts: number
  revenue: number
  lowStockItems: number
  totalCustomers: number
  completedOrders: number
  processingOrders: number
  cancelledOrders: number
}
