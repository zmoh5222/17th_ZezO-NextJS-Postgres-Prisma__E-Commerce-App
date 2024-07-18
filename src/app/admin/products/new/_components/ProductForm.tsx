'use client'

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { currencyFormat } from "@/lib/formaters";
import { useState } from "react";
import addProductAction from "../_actions/addProductAction";
import { useFormState } from "react-dom";
import { AlertCard } from "@/components/AlertCard";
import FormButton from "../../../../../components/FormButton";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Product } from "@prisma/client";
import updateProductAction from "../../[id]/edit/_actions/updateProductAction";
import Image from "next/image";


export default function ProductForm({product}: {product?: Product}) {
  const [state, action] = useFormState(product ? updateProductAction.bind(null, product.id) : addProductAction, null)
  const router = useRouter()
  const [price, setPrice] = useState<string>(product ? String(product.price) : '')
  const [image, setImage] = useState<string | null>(null)

  if (state?.ok) {
    if (!product) {
      toast.success('Product Added Successfully', {
        duration: 3000,
        position: "bottom-center"
      })
    } else if (product) {
      toast.success('Product Updated Successfully', {
        duration: 3000,
        position: "bottom-center"
      })
    }
    router.replace('/admin/products')
    router.refresh()
  }

  return (
    <form action={action} className="mt-5 grid w-full max-w-xl items-center gap-3">
      <Input type="text" id="name" name="name" placeholder="Name" required  defaultValue={product?.name} />
      {(state?.error && 'name' in state?.error && state?.error?.name) && <AlertCard variant="destructive" title="Error" message={state?.error?.name[0]} />}

      <Textarea id="description" name="description" placeholder="Description" required defaultValue={product?.description} />
      {(state?.error && 'description' in state?.error && state?.error?.description) && <AlertCard variant="destructive" title="Error" message={state?.error?.description[0]} />}

      <div className="space-y-2">
        <Label htmlFor="price">Price in cents</Label>
        <Input type="number" id="price" name="price" value={price} onChange={e => setPrice(e.target.value)} required />
        {
          price && (
            <span className="text-muted-foreground ms-1">
              {currencyFormat(Number(price) / 100)}
            </span>
          )
        }
        
        {(state?.error && 'price' in state?.error && state?.error?.price) && <AlertCard variant="destructive" title="Error" message={state?.error?.price[0]} />}
      </div>


      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" id="file" name="file" required={!!!product?.filePath} />
        {product && <span>{product?.filePath.split('/')[1]}</span>}
        {(state?.error && 'file' in state?.error && state?.error?.file) && <AlertCard variant="destructive" title="Error" message={state?.error?.file[0]} />}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" required={!!!product?.imagePath} onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) setImage(URL.createObjectURL(file))
        }} />
        {product && <span>{product?.imagePath.split('/')[2]}</span>}
        {(product && !image) && <Image src={image ? image : product.imagePath} width={200} height={200} alt="product" className="rounded" />}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {image && <img src={image} alt="product" className="h-[200px] w-auto rounded"/>}
        {(state?.error && 'image' in state?.error && state?.error?.image) && <AlertCard variant="destructive" title="Error" message={state?.error?.image[0]} />}
      </div>
      
      <FormButton BtnName={product ? "Update Product" : "Add Product"} />
      
      {(state?.error && 'message' in state?.error && state?.error?.message) && <AlertCard variant="destructive" title="Error" message={state?.error?.message} />}
    </form>
  )
}