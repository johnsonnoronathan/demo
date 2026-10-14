import Image from "next/image";
import styles from "./ProductGrid.module.css";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  colorway: string;
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 50vw, 25vw" className={styles.image} />
      </div>
      <div className={styles.row}>
        <h3 className={styles.name}>{product.name}</h3>
        <span className={styles.price}>€{product.price}</span>
      </div>
      <p className={styles.colorway}>{product.colorway}</p>
    </article>
  );
}
