import { Search, Bell } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Header() {
  return (
    <header className="bg-white border-b border-[#e5e7eb] px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9ca3af] w-4 h-4" />
          <Input
            placeholder="Search products, orders, customers..."
            className="pl-10 border-[#d1d5db] focus:border-[#2563eb] focus:ring-[#2563eb]"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="w-6 h-6 text-[#6b7280]" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#ef4444] rounded-full"></div>
          </div>

          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-[#2563eb] text-white text-sm">AU</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="font-medium text-[#111827]">Admin User</div>
              <div className="text-[#6b7280]">admin@schoolmaster</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
