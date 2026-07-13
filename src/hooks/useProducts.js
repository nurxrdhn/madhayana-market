import { useEffect, useState } from "react";
import { subscribeActiveProducts } from "../services/productService";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeActiveProducts(
      (firestoreProducts) => {
        setProducts(firestoreProducts);
        setProductsError("");
        setProductsLoading(false);
      },
      (error) => {
        setProductsError(
          error?.message || "Produk gagal dimuat dari database."
        );
        setProductsLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return {
    products,
    productsLoading,
    productsError,
  };
}
