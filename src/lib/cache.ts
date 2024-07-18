import { unstable_cache } from "next/cache"
import { cache } from "react"

type Callback = (...args: any[]) => Promise<any>
export default function caching<T extends Callback>(
  cb: T,
  keyParts: string[],
  options: {
    revalidate?: number | false,
    tag?: string[]
  } = {}
) {
  return unstable_cache(cache(cb), keyParts, options)
}