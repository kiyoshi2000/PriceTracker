"use client";

import useSWR from "swr";
import { ItemCard } from "@/components/ItemCard";
import AddItemDialog from "@/components/AddItemDialog";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function Home() {
  const { data, mutate } = useSWR("http://localhost:3001/items", fetcher);

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-10">
      <div className="flex items-center justify-between px-2">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Price Tracker
        </h1>

        <AddItemDialog onAdded={mutate} />
      </div>

      {!data ? (
        <p className="text-gray-500 px-2">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 px-2">
          {data.map((item: any) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
