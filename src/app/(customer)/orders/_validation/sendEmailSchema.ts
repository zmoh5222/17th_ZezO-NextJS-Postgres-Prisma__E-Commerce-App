import { z } from "zod"

const sendEmailSchema = z.string().email()

export default sendEmailSchema