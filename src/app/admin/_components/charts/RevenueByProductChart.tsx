"use client";

import { currencyFormat, numberFormat } from "@/lib/formaters";
import {
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";


type RevenueByProductChartProps = {
  mostPurchasedData: {productName: string, revenue: number}[]
  mostOrderedData: {productName: string, totalOrders: number}[]
}

export default function RevenueByProductChart({mostPurchasedData, mostOrderedData}: RevenueByProductChartProps) {
  if (!mostPurchasedData.length && !mostOrderedData.length) return (
    <h1 className="w-full h-[300px] flex justify-center items-center font-bold text-3xl">No Data Available</h1>
  )
  return (
    <ResponsiveContainer width="100%" minHeight="300px">
      <PieChart>
        <Tooltip formatter={(value, name, props) => {
          const dataKey = props.dataKey
          if (dataKey === 'revenue') return currencyFormat(value as number)
          if (dataKey === 'totalOrders') return `${numberFormat(value as number)} orders`
        }} />
        <Legend payload={
          [
            { value: 'Sales', type: 'circle', id: 'ID01', color: '#82ca9d' },
            { value: 'Orders', type: 'circle', id: 'ID02', color: '#8884d8' },
          ]
        } />
        <Pie data={mostOrderedData} dataKey="totalOrders" nameKey='productName' cx="50%" cy="50%" outerRadius={60} fill="#8884d8" />
        <Pie data={mostPurchasedData} dataKey="revenue" nameKey='productName' cx="50%" cy="50%" innerRadius={70} outerRadius={90} fill="#82ca9d" label={item => currencyFormat(item.revenue)} />
      </PieChart>
    </ResponsiveContainer>
  );
}
