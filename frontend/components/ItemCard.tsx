"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Globe } from "lucide-react";

export function ItemCard({ item }) {
  const last = item.prices[item.prices.length - 1];
  const prev = item.prices[item.prices.length - 2];

  const trend =
    prev && last.value < prev.value
      ? "down"
      : prev && last.value > prev.value
      ? "up"
      : "same";

  const domain = new URL(item.url).hostname.replace("www.", "");

  return (
    <Link href={`/item/${item.id}`}>
      <Card className="p-5 hover:shadow-xl transition-all duration-200 cursor-pointer bg-white/80 backdrop-blur border border-gray-200 rounded-2xl">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl font-semibold leading-snug line-clamp-2">
            {item.name}
          </CardTitle>

          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Globe size={14} /> {domain}
          </div>
        </CardHeader>

        <CardContent className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold tracking-tight">€ {last.value}</span>

            {trend === "down" && (
              <span className="text-green-600 flex items-center gap-1">
                <ArrowDown size={18} /> Cheaper
              </span>
            )}

            {trend === "up" && (
              <span className="text-red-600 flex items-center gap-1">
                <ArrowUp size={18} /> More Expensive
              </span>
            )}

            {trend === "same" && (
              <span className="text-gray-500 text-sm">Stable</span>
            )}
          </div>

          <button className="mt-4 w-full rounded-xl py-2 border text-sm bg-gray-100 hover:bg-gray-200 transition">
            View product
          </button>
        </CardContent>
      </Card>
    </Link>
  );
}
