import { Body, Container, Head, Heading, Html, Preview, Tailwind } from "@react-email/components";
import OrderInformation from "./OrderInformation";

type PurchaseReceiptEmailProps = {
  product: {
    name: string
    description: string
    imagePath: string
  }
  order: {
    id: string
    paidPrice: number
    createdAt: Date
  }
  downloadVerificationId: string
}

PurchaseReceiptEmail.PreviewProps = {
  product: {
    name: 'product name',
    description: 'product description product description product description',
    imagePath: '/products/b061267b-f109-4a7f-9a6b-12befd518a5e-01.png'
  },
  order: {
    id: crypto.randomUUID(),
    paidPrice: 500,
    createdAt: new Date()
  },
  downloadVerificationId: crypto.randomUUID()
} satisfies PurchaseReceiptEmailProps

export default function PurchaseReceiptEmail({product, order, downloadVerificationId}: PurchaseReceiptEmailProps) {
  return (
    <Html>
      <Preview>Download {product.name}</Preview>
      <Tailwind>
        <Head />
        <Body className="bg-gray-200 font-sans">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <OrderInformation product={product} order={order} downloadVerificationId={downloadVerificationId} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )

}