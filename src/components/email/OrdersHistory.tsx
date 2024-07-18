import { Body, Container, Head, Heading, Hr, Html, Preview, Tailwind } from "@react-email/components";
import OrderInformation from "./OrderInformation";

type OrdersHistoryEmailProps = {
  orders: {
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
  }[]
}

OrdersHistoryEmail.PreviewProps = {
  orders: [
    {
      product: {
        name: 'product 01 name',
        description: 'product description 01 product description product description',
        imagePath: '/products/de0d3383-270d-4b2a-a98b-36db5e82570b-ebook-logo.png'
      },
      order: {
        id: crypto.randomUUID(),
        paidPrice: 500,
        createdAt: new Date()
      },
      downloadVerificationId: crypto.randomUUID()
    },
    {
      product: {
        name: 'product name 02',
        description: 'product description 02 product description product description',
        imagePath: '/products/b061267b-f109-4a7f-9a6b-12befd518a5e-01.png'
      },
      order: {
        id: crypto.randomUUID(),
        paidPrice: 500,
        createdAt: new Date()
      },
      downloadVerificationId: crypto.randomUUID()
    }
  ]
} satisfies OrdersHistoryEmailProps

export default function OrdersHistoryEmail({orders}: OrdersHistoryEmailProps) {
  return (
    <Html>
      <Preview>Order History & Download</Preview>
      <Tailwind>
        <Head />
        <Body className="bg-gray-200 font-sans">
          <Container className="max-w-xl">
            <Heading>Orders History</Heading>
            {
              orders.map((order, index) => {
                return (
                    <OrderInformation 
                      key={index} 
                      product={order.product} 
                      order={order.order} 
                      downloadVerificationId={order.downloadVerificationId} 
                    />
                )
              })
            }
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )

}