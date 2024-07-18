'use client'

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import CouponActivateDeactivateToggleServerAction from "../_actions/CouponActivateDeactivateToggleServerAction"
import toast from "react-hot-toast"

export default function ActivateDeactivateCouponToggleDropdownMenuItem({
  id,
  isActive
}: {
  id: string,
  isActive: boolean
}) {
  const router = useRouter()
  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={async () => {
        const res = await CouponActivateDeactivateToggleServerAction(id, isActive)
        if (res?.ok) {
          toast.success('Toggle coupon done successfully', {
            duration: 3000,
            position: "bottom-center"
          })
        }
        router.refresh()
      }
      }
    >
      {isActive ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  )
}