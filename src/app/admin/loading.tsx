import { Loader2, LoaderPinwheel } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex justify-center">
      <LoaderPinwheel className="size-24 animate-spin" />
    </div>
  )
}