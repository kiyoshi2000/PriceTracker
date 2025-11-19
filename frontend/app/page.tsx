"use client";

import useSWR from "swr";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddItemDialog from "@/components/AddItemDialog";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Home() {
  const { data, mutate } = useSWR("http://localhost:3001/items", fetcher);

  return (
    <div className="space-y-8 p-4 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">Monitor de Preços</h1>
        <AddItemDialog onAdded={() => mutate()} />
      </div>

      {/* Loading */}
      {!data && (
        <p className="text-gray-500">Carregando produtos...</p>
      )}

      {/* Empty State */}
      {data && data.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          <p>Nenhum produto cadastrado ainda.</p>
          <p>Use o botão acima para adicionar o primeiro 🚀</p>
        </div>
      )}

      {/* Grid de cards */}
      {data && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((item: any) => {
            const lastPrice = item.prices?.[item.prices.length - 1]?.value;

            return (
              <Card
                key={item.id}
                className="hover:shadow-lg transition relative cursor-pointer"
              >
                {/* Botão Remover */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    fetch(`http://localhost:3001/items/${item.id}`, {
                      method: "DELETE",
                    }).then(() => mutate());
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                >
                  Remover
                </button>

                {/* Card */}
                <Link href={`/item/${item.id}`}>
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-gray-500 break-all">{item.url}</p>

                    {lastPrice && (
                      <p className="mt-3 text-xl font-bold">
                        € {lastPrice}
                      </p>
                    )}
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
