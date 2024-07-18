'use client'

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import deleteCustomerServerAction from "../_actions/deleteCustomerServerAction";

export default function DeleteCustomerDropdownMenuItem({id}: {id: string}) {
  const router = useRouter()
  return (
    <DropdownMenuItem
      className="cursor-pointer text-destructive"
      onClick={async () => {
        // protected content
        const protectedContent = [
          '4b90d155-4e6b-4c70-be2b-a06b52449384', 
          'db1eda24-0e9f-41f3-be56-2888339c2591', 
          'abb6fbe0-d0e7-45d9-9472-a8eb1b2534ca', 
          '1f0a0019-c094-4fc1-9fc6-0d9741e3ccbc', 
          '43bbf079-86ae-4dc4-8421-e844d76c6e23', 
          '36c1be26-e973-4deb-bd72-290d2fde9c31', 
          '62d2e4a6-7e09-4006-9659-b6b89cda8424', 
          '88f633fe-5474-4d6e-8ad6-a21bdc820e8b', 
          'c5a6e1b6-159a-403e-ba52-54bbaf15b72c', 
          '9717828a-40e8-422d-a5c1-49f865794783', 
          '471c35eb-a3ab-4973-bea9-21d270e98c59', 
          '801278f6-927e-46dc-b24b-6e4924e78cd4', 
          '9b09cb69-f12b-4e73-ba63-2e13b22fbb45', 
          '4cfa53ae-c4ff-4d37-9c8a-18745e8250fa', 
          '64a4df3c-92da-45d7-bc3e-07a7b0b2dc46', 
          '192dace5-b49d-462a-bbe9-29fa7b7c0390', 
          '84b5bfa7-d024-4154-afcb-ab43395ec070', 
          '047e7085-5573-43af-bc39-e16e5e115ef7', 
          'e95aa180-41a8-4c19-a9a3-ea8045e97bfe', 
          'c1d57d40-2446-4de1-95f3-f3755579a8fa', 
          'd9aa0906-af0c-45d4-aad5-d562cba50ae0', 
          'a1a00d9b-54dd-43b9-8d44-b7b32c9ce7b2', 
          '3763323f-b556-4133-8c2c-900b06fef3ef', 
          'dbee8281-cf21-40d4-89c1-87cba56973d6', 
          'cb28dbd1-7d8e-43a9-82eb-cc7d03a8de59', 
          '49fff6de-8edf-421c-875a-aaa5d8be8e96', 
          'c205883b-492c-48ef-8ca0-27f94c1c3efb', 
          'a0768e5c-7a96-4828-8619-fb6506f1f923', 
          '8e44a28d-7beb-48ac-abe1-25d3b676701f'  
        ]
        if (protectedContent.includes(id)) {
          toast.error('Protected Content, add new content and interact with it!', {
            duration: 10000,
            position: "bottom-center"
          })
          return
        }

        const res = await deleteCustomerServerAction(id)
          if (res?.ok) {
            toast.success('customer deleted successfully', {
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