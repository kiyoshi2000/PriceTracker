"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AddItemDialog({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !url) {
      toast.error("Preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url }),
      });

      if (!response.ok) {
        toast.error("Erro ao cadastrar o produto.");
        setLoading(false);
        return;
      }

      toast.success("Produto cadastrado!");

      // limpa dados
      setName("");
      setUrl("");

      // FECHA O MODAL antes de atualizar os cards
      setOpen(false);

      // FORÇA SWR RELOAD
      onAdded();

    } catch (e) {
      toast.error("Erro ao conectar ao backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Adicionar Produto</Button>
      </DialogTrigger>

      <DialogContent className="bg-white max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div>
            <Label>Nome</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Monitor LG 24"
            />
          </div>

          <div>
            <Label>URL</Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Cole a URL da Amazon"
            />
          </div>

          <Button disabled={loading} onClick={handleSubmit}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
