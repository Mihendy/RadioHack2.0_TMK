"use client";

import { useState, useEffect } from "react";
import { getProducts } from "@/lib/utils/data-utils";
import { ProductDetailView } from "@/components/product/product-detail-view";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const [product, setProduct] = useState<typeof getProducts extends () => Promise<infer R> ? R[0] : never>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((products) => {
      const found = products.find((p) => p.ID === id);
      setProduct(found);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <p className="container px-4 py-6">Загрузка...</p>;
  }

  if (!product) {
    return <p className="container px-4 py-6">Товар не найден</p>;
  }

  return (
    <div className="container px-4 py-6">
      <Link href="/">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад в каталог
        </Button>
      </Link>

      <ProductDetailView product={product} />
    </div>
  );
}
