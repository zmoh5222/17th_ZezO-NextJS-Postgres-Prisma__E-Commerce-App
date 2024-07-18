"use client";

import { numberFormat } from "@/lib/formaters";
import {
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";


export default function OrdersByProductChart({data}: {data: {productName: string, totalOrders: number}[]}) {
  if (!data.length) return (
    <h1 className="w-full h-[300px] flex justify-center items-center font-bold text-3xl">No Data Available</h1>
  )
  return (
    <ResponsiveContainer width="100%" minHeight="300px">
      <PieChart>
        <Tooltip formatter={(value) => numberFormat(value as number)} />
        <Pie data={data} label={item => item.productName} dataKey="totalOrders" nameKey='productName' fill="#8884d8" />
      </PieChart>
    </ResponsiveContainer>
  );
}
