import { z } from "zod"
import addProductSchema from "../../../new/_validation/addProductSchema"

const updateProductSchema = addProductSchema.extend({
  file: z.instanceof(File),
  image: z.instanceof(File).refine(image => image.size === 0 || image.type.startsWith('image/'), {message: 'only image file is allowed'})
})

export default updateProductSchema