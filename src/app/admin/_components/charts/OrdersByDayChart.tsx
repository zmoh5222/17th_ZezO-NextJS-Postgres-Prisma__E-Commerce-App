"use client";

import { currencyFormat, numberFormat } from "@/lib/formaters";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function OrdersByDayChart({data}: {data: {day: string, totalOrders: number}[]}) {
  return (
    <ResponsiveContainer width="100%" minHeight="300px">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis
          tickFormatter={(tick) => currencyFormat(tick)}
          yAxisId='left'
        />
        <YAxis yAxisId='right' orientation="right" tickFormatter={(tick) => numberFormat(tick)} />
        <Tooltip formatter={(value, name) => {
          if (name === 'Sales') return currencyFormat(value as number)
          if (name === 'Orders') return numberFormat(value as number)
        }} />
        <Legend />
        <Line dataKey="sumOfOrders" type="monotone" name="Sales" dot={false} yAxisId='left' stroke="#82ca9d" activeDot={{ r: 6 }} />
        <Line dataKey="totalOrders" type="monotone" name="Orders" dot={false} yAxisId='right' stroke="#8884d8"/>
      </LineChart>
    </ResponsiveContainer>
  );
}
