"use client"

import { getProducts } from "@/lib/utils/data-utils"
import { ProductDetailView } from "@/components/product/product-detail-view"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const products = getProducts()
  const product = products.find((p) => p.ID === id)

  if (!product) {
    notFound()
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
  )
}
