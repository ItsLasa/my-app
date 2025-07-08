"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Package, Users, Tag, Plus, BarChart3, Settings, LogOut } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Products", href: "/products", icon: Package },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Categories", href: "/categories", icon: Tag },
  { name: "Add New Product", href: "/add-product", icon: Plus },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-[#e5e7eb] flex flex-col">
      <div className="p-6 border-b border-[#e5e7eb]">
        <h1 className="text-xl font-bold text-[#111827]">School Master</h1>
        <p className="text-sm text-[#6b7280]">Admin Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive ? "text-[#2563eb] bg-[#dbeafe]" : "text-[#6b7280] hover:bg-[#f9fafb]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className={isActive ? "font-medium" : ""}>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[#e5e7eb]">
        <div className="flex items-center gap-3 px-3 py-2 text-[#ef4444] hover:bg-[#fef2f2] rounded-lg cursor-pointer">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  )
}
