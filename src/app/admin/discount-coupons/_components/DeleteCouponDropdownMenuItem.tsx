'use client'

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import deleteCouponServerAction from "../_actions/deleteCouponServerAction";

export default function DeleteCouponDropdownMenuItem({
  id,
  isDeleteDisabled
}: {
  id: string,
  isDeleteDisabled: boolean
}) {
  const router = useRouter()
  return (
    <DropdownMenuItem
      className="cursor-pointer text-destructive"
      disabled={isDeleteDisabled}
      onClick={async () => {
        // protected content
        const protectedContent = [
          '1a246c1f-4704-42a3-9b9a-a149fcc1dd92', 
          '4aa525d2-ad89-4bca-b8cc-a9f983af9e86', 
          '8ec8b01d-c853-4c5c-b579-3b21c6a8bf43', 
          '22e851b2-a422-4f91-9bae-43201b551350', 
          'a0b9dd2e-ca94-4589-b394-de412cb0a7f9', 
          '1c99ea54-a8ed-425b-b03d-b9caf43b2f1e', 
          '0fb96371-90cd-4234-be02-b4fe027b80b3', 
          '4eaa2a34-7328-4fbd-8c5f-b8d1fb942c6c', 
          '61370782-93d8-4fe7-99da-0853605bf623', 
          '5fa4c4da-50fe-4adf-88ea-daaf565be848', 
          'b3da7843-42fd-4a47-890a-f8f108cc4a25', 
          'f937f990-4007-4b62-baba-df2a3f5f8636', 
          '1e2b795a-f0d9-41c8-8ff9-c7653ae8ae93', 
          '752d2627-e95a-41fd-9106-67e4e97f7a43', 
          'e476f55b-643b-4cdd-bf82-790e23bcd454', 
          'd3e6c0ae-144b-4fa7-a5a6-920c4cf8d31e', 
          '4674c76f-b040-48f2-911a-89d8c3a21e72'  
        ]
        if (protectedContent.includes(id)) {
          toast.error('Protected Content, add new content and interact with it!', {
            duration: 10000,
            position: "bottom-center"
          })
          return
        }

        const res = await deleteCouponServerAction(id)
          if (res?.ok) {
            toast.success('coupon deleted successfully', {
              duration: 3000,
              position: "bottom-center"
            })
          }
        router.refresh()
      }}
    >
      Delete
    </DropdownMenuItem>
  );
}