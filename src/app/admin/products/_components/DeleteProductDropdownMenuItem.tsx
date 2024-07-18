'use client'

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import deleteProductServerAction from "../_actions/deleteProductServerAction";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function DeleteProductDropdownMenuItem({
  id,
  isDeleteDisabled,
}: {
  id: string;
  isDeleteDisabled: boolean;
}) {
  const router = useRouter()
  return (
    <DropdownMenuItem
      className="cursor-pointer text-destructive"
      disabled={isDeleteDisabled}
      onClick={async () => {
        // protected content
        const protectedContent = [
          'a912af13-fc68-482f-9a1d-40f100e0c0df',     
          'ff810de1-7c6c-411f-a958-6b32afceea2e',     
          '92e4d659-51c5-42bc-a1b1-71b7ccc19525',     
          '08e7a5b5-78b3-4113-bf90-6b3d91c8e469',     
          '7b6af094-46a0-460d-8565-1697d9af2e87',     
          '6e222fcf-91cb-4bd1-a539-bca7cb68ff01',     
          '9602a949-d77b-4b71-bb9c-11444b2447fd',     
          '626d8581-6d53-4919-8c0b-db914c547c2d',     
          '49196513-ded4-41ab-97d9-637951cd8c99'      
        ]
        if (protectedContent.includes(id)) {
          toast.error('Protected Content, add new content and interact with it!', {
            duration: 10000,
            position: "bottom-center"
          })
          return
        }

        const res = await deleteProductServerAction(id)
          if (res?.ok) {
            toast.success('product deleted successfully', {
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
