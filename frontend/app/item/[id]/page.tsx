"use client";

import useSWR from "swr";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PriceChart from "@/components/PriceChart";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function ItemPage({ params }: any) {
  const id = params.id;
  const { data, mutate } = useSWR(`http://localhost:3001/items/${id}`, fetcher);

  if (!data) return <p>Carregando...</p>;

  async function runScraper() {
    const res = await fetch(`http://localhost:3001/items/${id}/scrape`, {
      method: "POST"
    });

    if (res.ok) toast.success("Preço atualizado!");
    mutate();
  }

  const lastPrice = data.prices?.[data.prices.length - 1]?.value;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{data.name}</CardTitle>
        </CardHeader>

        <CardContent>
          <a href={data.url} target="_blank" className="text-blue-600 underline">
            Abrir na Amazon
          </a>

          {lastPrice && (
            <p className="mt-4 text-3xl font-bold">
              € {lastPrice}
            </p>
          )}

          <Button className="mt-4" onClick={runScraper}>
            Atualizar agora
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Preços</CardTitle>
        </CardHeader>

        <CardContent>
          {data.prices?.length ? (
            <PriceChart prices={data.prices} />
          ) : (
            <p className="text-gray-500">Nenhum preço encontrado.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
