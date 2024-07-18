import { currencyFormat, dateFormat } from "@/lib/formaters";
import { Button, Column, Img, Row, Section, Text } from "@react-email/components";

type OrderInformationProps = {
  order: {
    id: string;
    paidPrice: number;
    createdAt: Date;
  };
  product: {
    name: string
    description: string
    imagePath: string
  };
  downloadVerificationId: string;
};

export default function OrderInformation({
  order,
  product,
  downloadVerificationId,
}: OrderInformationProps) {
  return (
    <Section className="border-2 border-solid border-gray-500 rounded-lg p-5 pb-0 my-4 shadow">
      <Section>
        <Row>
          <Column>
            <Text className="font-bold text-gray-500">Order ID</Text>
            <Text>{order.id}</Text>
          </Column>
          <Column>
            <Text className="font-bold text-gray-500">Purchased On</Text>
            <Text>{dateFormat(order.createdAt)}</Text>
          </Column>
          <Column>
            <Text className="font-bold text-gray-500 ">Price Paid</Text>
            <Text>{currencyFormat(order.paidPrice / 100)}</Text>
          </Column>
        </Row>
      </Section>
      <Section className="border border-solid border-gray-500 rounded-lg p-2 my-4 shadow-xl">
        <Img src={`${process.env.NEXT_PUBLIC_SERVER_URL}${product.imagePath}`} alt={product.name} className="rounded max-h-[400px] w-full object-cover" />
        <Row>
          <Column>
            <Text className="font-bold text-2xl m-0 mt-2">{product.name}</Text>
          </Column>
        </Row>
        <Row>
        <Column>
            <Text className="text-gray-500">{product.description}</Text>
          </Column>
        </Row>
        <Row>
          <Button href={`${process.env.NEXT_PUBLIC_SERVER_URL}/products/download/${downloadVerificationId}`} className="bg-black text-white py-3 w-full text-center font-bold rounded">
            Download
          </Button>
        </Row>
      </Section>
    </Section>
  );
}
