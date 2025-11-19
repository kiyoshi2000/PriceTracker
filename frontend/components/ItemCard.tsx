"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

export function ItemCard({ item }) {
  return (
    <Link href={`/item/${item.id}`}>
      <Card className="p-4 hover:shadow-xl transition cursor-pointer">
        <CardHeader>
          <CardTitle>{item.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground break-all">{item.url}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
