import { z } from "zod"


const addProductSchema = z.object({
  name: z.string().min(1, {message: 'name is required'}),
  price: z.coerce.number().min(5, {message: 'price is required'}),
  description: z.string().min(1, {message: 'description is required'}),
  file: z.instanceof(File).refine(file => file.size > 0, {message: "file is required"}),
  image: z.instanceof(File).refine(image => image.size > 0, {message: "image is required"}).refine(image => image.type.startsWith('image/'), {message: 'only image file is allowed'})
})

export default addProductSchema