'use client'

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import deleteOrderServerAction from "../_actions/deleteOrderServerAction";
import toast from "react-hot-toast";

export default function DeleteOrderDropdownMenuItem({id}: {id: string}) {
  const router = useRouter()
  return (
    <DropdownMenuItem
      className="cursor-pointer text-destructive"
      onClick={async () => {
        // protected content
        const protectedContent = [
          'ba8037b0-1935-4f0d-b676-c97e53b0aebf', 
          'bf7765ac-a3fa-4f7e-b904-c19225f21f6d', 
          '69a846f5-018f-41b2-a9bd-75771bd7f2d1', 
          'e8c0895d-4d4a-4d6f-8717-c615467579c2', 
          '7331c923-c296-487a-8ea6-77787086c123', 
          '3709b731-a86b-4c98-a2d8-9daba3430bf3', 
          '1944fdf7-b514-44c1-9e98-583431f0dabf', 
          'ebb1ad05-593c-497f-aff8-10989344b3e9', 
          'cb546792-484c-49b3-a5f1-bac0ef4d2f89', 
          '0a2f4454-5e1c-455d-8026-94db8d439887', 
          '67185edb-787e-4239-83e9-96a5e46c9513', 
          'c83d47fe-949b-4be1-a7bc-c1f67c55db06', 
          'aab70f0f-0ed0-4141-b4b1-a0b2a55700da', 
          'd61fa2f4-ade4-46c8-975c-4c95ddc9d502', 
          'f14ee4e9-3bb7-4a68-a793-01c6942bad8b', 
          '5a8f43c9-073e-4737-b3dd-d74c208e6d31', 
          '7b468a1b-3a3e-4c9f-9249-fb3d18433aaa', 
          'b2de365f-49bb-4dbc-8bd1-726b5a2c97c8', 
          '8238f98b-0286-4ea4-bf8b-51b83718bc06', 
          'f6bda858-d7ac-4750-baa5-1a8eeba4aab7', 
          '728f5457-e92a-4ff5-b9ab-16ee5aaf8d5f', 
          'e746c22a-55fd-4af5-9b9c-75aafd9e91cb', 
          '23dddff1-8d4d-44dd-9c08-b53920874a99', 
          'bcdcc93f-c95d-4119-9894-9c4b93245ce7', 
          '9cf3ac76-70b8-4f27-bd74-0a155befe783', 
          '79ad810d-69d4-4a41-be61-621a005efa62', 
          'e91bb85b-8029-4b2c-8a88-0f4d89e8f4e6', 
          '87928e64-5e49-43da-b22d-5e8fbf61c114', 
          'ecfedfd6-c4d5-400c-bcea-7f1f9f0224b7', 
          '53f90a9d-47c4-421c-924f-60f4a7197110', 
          'c2deebfc-18c4-4ad6-80be-15f5ee2da46a', 
          '8c3be575-d2cd-42d5-a4f5-3ac26f44c693', 
          '4b87690e-f409-4cbb-9cb4-daf76bef1deb', 
          '168a4c75-cab1-4140-a6c2-d7486a1e74fe', 
          'f224bc1e-92da-4611-937d-038b6a91a885'  
        ]
        if (protectedContent.includes(id)) {
          toast.error('Protected Content, add new content and interact with it!', {
            duration: 10000,
            position: "bottom-center"
          })
          return
        }

        const res = await deleteOrderServerAction(id)
          if (res?.ok) {
            toast.success('order deleted successfully', {
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