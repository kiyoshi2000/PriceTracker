"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function HomePage() {
  const { data } = useSWR("http://localhost:3001/items", fetcher);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">PriceTracker Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        {data?.map((item: any) => (
          <a
            key={item.id}
            href={`/item/${item.id}`}
            className="border p-4 rounded shadow hover:bg-gray-100"
          >
            <h2 className="text-xl font-semibold">{item.name}</h2>
            <p className="text-sm text-gray-600 break-all">{item.url}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
