"use client";

import { numberFormat } from "@/lib/formaters";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function UsersByDayChart({data}: {data: {day: string, totalUsers: number}[]}) {
  return (
    <ResponsiveContainer width="100%" minHeight="300px">
      <BarChart data={data}>
        <CartesianGrid stroke="hsl(var(--muted))" />
        <XAxis dataKey="day" />
        <YAxis
          tickFormatter={(tick) => numberFormat(tick)}
        />
        <Tooltip formatter={(value) => numberFormat(value as number)} cursor={{fill: "hsl(var(--muted))"}} />
        <Legend />
        <Bar dataKey="totalUsers" name="Total Users" />
      </BarChart>
    </ResponsiveContainer>
  );
}
