"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AddItemDialog({ onAdded }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    if (!url) return;
    setLoading(true);

    await fetch("http://localhost:3001/items/auto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    setUrl("");
    setLoading(false);
    onAdded();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="px-4 py-2 rounded-lg">
          Add Product
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new product</DialogTitle>
        </DialogHeader>

        <input
          type="text"
          placeholder="Paste an Amazon URL..."
          className="w-full border rounded-lg p-2 mt-4"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <Button
          onClick={handleAdd}
          disabled={loading}
          className="w-full mt-4"
        >
          {loading ? "Adding..." : "Save"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
