import { Product, Order, Customer, Category } from "@/types"

const STORAGE_KEYS = {
  PRODUCTS: "schoolmaster_products",
  ORDERS: "schoolmaster_orders",
  CUSTOMERS: "schoolmaster_customers",
  CATEGORIES: "schoolmaster_categories",
  INITIALIZED: "schoolmaster_initialized",
} as const

// Generic storage utilities
const storage = {
  get: <T>(key: string): T[] => {
    if (typeof window === 'undefined') return []
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return []
    }
  },

  set: <T>(key: string, data: T[]): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  },

  clear: (key: string): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  }
}

// Initialize with sample data
const initializeData = () => {
  if (typeof window === 'undefined') return
  
  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED)
  if (isInitialized) return

  // Sample Categories
  const categories: Category[] = [
    {
      id: 'CAT-001',
      name: 'Shirts',
      description: 'School shirts in various sizes and colors',
      status: 'Active',
      productCount: 15,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    // ... rest of the categories
  ]

  // Sample Products
  const products: Product[] = [
    {
      id: 'PRD-001',
      name: 'School Shirt - White',
      description: 'High-quality white school shirt made from comfortable cotton blend',
      category: 'Shirts',
      brand: 'School Master',
      price: 2450,
      comparePrice: 2800,
      costPrice: 1800,
      sku: 'SS-WHT-001',
      barcode: '1234567890123',
      quantity: 45,
      lowStockThreshold: 10,
      status: 'Active',
      featured: true,
      requiresShipping: true,
      images: ['/placeholder.svg?height=300&width=300'],
      variants: [
        { id: 'VAR-001', size: 'S', quantity: 15 },
        { id: 'VAR-002', size: 'M', quantity: 20 },
        { id: 'VAR-003', size: 'L', quantity: 10 }
      ],
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    // ... rest of the products
  ]

  // Sample Customers
  const customers: Customer[] = [
    {
      id: 'CUST-001',
      name: 'Priya Perera',
      email: 'priya@email.com',
      phone: '+94 77 123 4567',
      status: 'Active',
      totalOrders: 12,
      totalSpent: 28450,
      addresses: [],
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-12-10T00:00:00Z',
      lastOrderDate: '2024-12-10T00:00:00Z'
    },
    // ... rest of the customers
  ]

  // Sample Orders
  const orders: Order[] = [
    {
      id: 'ORD-001',
      customerId: 'CUST-001',
      customerName: 'Priya Perera',
      customerEmail: 'priya@email.com',
      items: [
        {
          id: 'ITEM-001',
          productId: 'PRD-001',
          productName: 'School Shirt (White)',
          quantity: 2,
          price: 2450,
          total: 4900
        }
      ],
      subtotal: 4900,
      tax: 0,
      shipping: 0,
      total: 4900,
      status: 'Completed',
      paymentMethod: 'Card',
      paymentStatus: 'Paid',
      shippingAddress: {
        id: 'ADDR-001',
        type: 'shipping',
        firstName: 'Priya',
        lastName: 'Perera',
        address1: '123 Main St',
        city: 'Colombo',
        province: 'Western',
        postalCode: '00100',
        country: 'Sri Lanka'
      },
      billingAddress: {
        id: 'ADDR-002',
        type: 'billing',
        firstName: 'Priya',
        lastName: 'Perera',
        address1: '123 Main St',
        city: 'Colombo',
        province: 'Western',
        postalCode: '00100',
        country: 'Sri Lanka'
      },
      createdAt: '2024-12-10T00:00:00Z',
      updatedAt: '2024-12-10T00:00:00Z'
    },
    // ... rest of the orders
  ]

  // Save to localStorage
  storage.set(STORAGE_KEYS.CATEGORIES, categories)
  storage.set(STORAGE_KEYS.PRODUCTS, products)
  storage.set(STORAGE_KEYS.CUSTOMERS, customers)
  storage.set(STORAGE_KEYS.ORDERS, orders)
  
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true')
}

// Data access functions
const productStorage = {
  getAll: (): Product[] => storage.get<Product>(STORAGE_KEYS.PRODUCTS),
  getById: (id: string): Product | undefined => {
    const products = storage.get<Product>(STORAGE_KEYS.PRODUCTS)
    return products.find(p => p.id === id)
  },
  create: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
    const products = storage.get<Product>(STORAGE_KEYS.PRODUCTS)
    const newProduct: Product = {
      ...product,
      id: `PRD-${String(products.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    products.push(newProduct)
    storage.set(STORAGE_KEYS.PRODUCTS, products)
    return newProduct
  },
  update: (id: string, updates: Partial<Product>): Product | null => {
    const products = storage.get<Product>(STORAGE_KEYS.PRODUCTS)
    const index = products.findIndex(p => p.id === id)
    if (index === -1) return null
    
    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    storage.set(STORAGE_KEYS.PRODUCTS, products)
    return products[index]
  },
  delete: (id: string): boolean => {
    const products = storage.get<Product>(STORAGE_KEYS.PRODUCTS)
    const filteredProducts = products.filter(p => p.id !== id)
    if (filteredProducts.length === products.length) return false
    
    storage.set(STORAGE_KEYS.PRODUCTS, filteredProducts)
    return true
  }
}

const orderStorage = {
  getAll: (): Order[] => storage.get<Order>(STORAGE_KEYS.ORDERS),
  getById: (id: string): Order | undefined => {
    const orders = storage.get<Order>(STORAGE_KEYS.ORDERS)
    return orders.find(o => o.id === id)
  },
  create: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order => {
    const orders = storage.get<Order>(STORAGE_KEYS.ORDERS)
    const newOrder: Order = {
      ...order,
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    orders.push(newOrder)
    storage.set(STORAGE_KEYS.ORDERS, orders)
    return newOrder
  },
  update: (id: string, updates: Partial<Order>): Order | null => {
    const orders = storage.get<Order>(STORAGE_KEYS.ORDERS)
    const index = orders.findIndex(o => o.id === id)
    if (index === -1) return null
    
    orders[index] = {
      ...orders[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    storage.set(STORAGE_KEYS.ORDERS, orders)
    return orders[index]
  },
  delete: (id: string): boolean => {
    const orders = storage.get<Order>(STORAGE_KEYS.ORDERS)
    const filteredOrders = orders.filter(o => o.id !== id)
    if (filteredOrders.length === orders.length) return false
    
    storage.set(STORAGE_KEYS.ORDERS, filteredOrders)
    return true
  }
}

const customerStorage = {
  getAll: (): Customer[] => storage.get<Customer>(STORAGE_KEYS.CUSTOMERS),
  getById: (id: string): Customer | undefined => {
    const customers = storage.get<Customer>(STORAGE_KEYS.CUSTOMERS)
    return customers.find(c => c.id === id)
  },
  create: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Customer => {
    const customers = storage.get<Customer>(STORAGE_KEYS.CUSTOMERS)
    const newCustomer: Customer = {
      ...customer,
      id: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    customers.push(newCustomer)
    storage.set(STORAGE_KEYS.CUSTOMERS, customers)
    return newCustomer
  },
  update: (id: string, updates: Partial<Customer>): Customer | null => {
    const customers = storage.get<Customer>(STORAGE_KEYS.CUSTOMERS)
    const index = customers.findIndex(c => c.id === id)
    if (index === -1) return null
    
    customers[index] = {
      ...customers[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    storage.set(STORAGE_KEYS.CUSTOMERS, customers)
    return customers[index]
  },
  delete: (id: string): boolean => {
    const customers = storage.get<Customer>(STORAGE_KEYS.CUSTOMERS)
    const filteredCustomers = customers.filter(c => c.id !== id)
    if (filteredCustomers.length === customers.length) return false
    
    storage.set(STORAGE_KEYS.CUSTOMERS, filteredCustomers)
    return true
  }
}

const categoryStorage = {
  getAll: (): Category[] => storage.get<Category>(STORAGE_KEYS.CATEGORIES),
  getById: (id: string): Category | undefined => {
    const categories = storage.get<Category>(STORAGE_KEYS.CATEGORIES)
    return categories.find(c => c.id === id)
  },
  create: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Category => {
    const categories = storage.get<Category>(STORAGE_KEYS.CATEGORIES)
    const newCategory: Category = {
      ...category,
      id: `CAT-${String(categories.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    categories.push(newCategory)
    storage.set(STORAGE_KEYS.CATEGORIES, categories)
    return newCategory
  },
  update: (id: string, updates: Partial<Category>): Category | null => {
    const categories = storage.get<Category>(STORAGE_KEYS.CATEGORIES)
    const index = categories.findIndex(c => c.id === id)
    if (index === -1) return null
    
    categories[index] = {
      ...categories[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    storage.set(STORAGE_KEYS.CATEGORIES, categories)
    return categories[index]
  },
  delete: (id: string): boolean => {
    const categories = storage.get<Category>(STORAGE_KEYS.CATEGORIES)
    const filteredCategories = categories.filter(c => c.id !== id)
    if (filteredCategories.length === categories.length) return false
    
    storage.set(STORAGE_KEYS.CATEGORIES, filteredCategories)
    return true
  }
}

// Explicit exports
export {
  storage,
  initializeData,
  productStorage,
  orderStorage,
  customerStorage,
  categoryStorage,
  STORAGE_KEYS
}

export type {
  Product,
  Order,
  Customer,
  Category
}