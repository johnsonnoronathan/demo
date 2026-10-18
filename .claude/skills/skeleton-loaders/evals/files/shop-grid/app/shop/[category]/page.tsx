import { ProductGrid } from "@/components/ProductGrid";

export default function CategoryPage({ params }: { params: { category: string } }) {
  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px" }}>
      <h1 style={{ textTransform: "capitalize", margin: "0 0 20px" }}>{params.category}</h1>
      <ProductGrid category={params.category} />
    </main>
  );
}
