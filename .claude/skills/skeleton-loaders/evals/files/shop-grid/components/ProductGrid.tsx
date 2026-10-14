"use client";

import useSWR from "swr";
import { ProductCard, type Product } from "./ProductCard";
import styles from "./ProductGrid.module.css";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export function ProductGrid({ category }: { category: string }) {
  const { data, error, isLoading } = useSWR<Product[]>(`/api/products?category=${category}`, fetcher);

  if (error) {
    return <p className={styles.error}>We couldn't load these products. Please refresh to try again.</p>;
  }

  if (isLoading || !data) {
    return (
      <div className={styles.spinnerWrap}>
        <div className={styles.spinner} role="status" aria-label="Loading products" />
      </div>
    );
  }

  return (
    <ul className={styles.grid}>
      {data.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
