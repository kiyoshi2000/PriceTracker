"use client";

import { use } from "react";
import useSWR from "swr";
import PriceChart from "../../../components/PriceChart";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  // Next.js 16 – unwrap params
  const { id } = use(params);

  const { data } = useSWR(`http://localhost:3001/items/${id}`, fetcher);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{data.name}</h1>

      <a
        href={data.url}
        className="text-blue-600 underline"
        target="_blank"
        rel="noreferrer"
      >
        Link do produto
      </a>

      <div className="mt-6">
        {data.prices?.length > 0 ? (
          <PriceChart prices={data.prices} />
        ) : (
          <p className="text-gray-500 mt-4">
            Nenhum preço coletado ainda — execute manualmente:
            <br />
            <code className="bg-gray-200 p-1 rounded">
              POST /items/{id}/scrape
            </code>
          </p>
        )}
      </div>
    </div>
  );
}
