"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  itemName: string
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-[#fee2e2] rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-[#dc2626]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#111827]">{title}</h2>
            <p className="text-[#6b7280]">{message}</p>
          </div>
        </div>

        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-lg p-3 mb-6">
          <p className="text-sm text-[#dc2626]">
            <strong>"{itemName}"</strong> will be permanently deleted. This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3">
          <Button onClick={onConfirm} className="flex-1 bg-[#dc2626] hover:bg-[#b91c1c] text-white">
            Delete
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1 border-[#d1d5db] bg-transparent">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
