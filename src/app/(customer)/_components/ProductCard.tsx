import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { currencyFormat } from "@/lib/formaters";
import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({product}: {product: Product}) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="relative aspect-video">
      <Image src={product.imagePath} fill alt={product.name} />
      </div>
      <CardHeader>
        <CardTitle>
          <p className="line-clamp-1" title={product.name}>{product.name}</p>
        </CardTitle>
        <CardDescription>{currencyFormat(product.price / 100)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-2" title={product.description}>{product.description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild size='lg' className="w-full">
          <Link href={`/products/${product.id}/purchase`}>Purchase</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}