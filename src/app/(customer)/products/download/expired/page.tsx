import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DownloadExpiredPage() {
  return (
    <>
      <h1 className="text-3xl font-bold">Download Link Expired</h1>
      <Button asChild size='lg' className="mt-4">
        <Link href='/orders' >Get New Link</Link>
      </Button>
    </>
  )
}