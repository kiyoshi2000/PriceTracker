"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function PriceChart({ prices }) {
  const data = prices.map(p => ({
    date: new Date(p.createdAt).toLocaleDateString(),
    price: p.value
  }));

  return (
    <LineChart width={700} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} />
    </LineChart>
  );
}
