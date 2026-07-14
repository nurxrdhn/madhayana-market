import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../firebase/config";

const productsCollection = collection(db, "products");

export function subscribeActiveProducts(onSuccess, onError) {
  const productsQuery = query(
    productsCollection,
    where("status", "==", "active")
  );

  return onSnapshot(
    productsQuery,
    (snapshot) => {
      const products = snapshot.docs.map((productDocument) => ({
        id: productDocument.id,
        ...productDocument.data(),
      }));

      onSuccess(products);
    },
    (error) => {
      console.error("Gagal membaca produk:", error);

      if (onError) {
        onError(error);
      }
    }
  );
}

export function subscribeSellerProducts(
  sellerId,
  onSuccess,
  onError
) {
  const sellerProductsQuery = query(
    productsCollection,
    where("sellerId", "==", sellerId)
  );

  return onSnapshot(
    sellerProductsQuery,
    (snapshot) => {
      const products = snapshot.docs.map((productDocument) => ({
        id: productDocument.id,
        ...productDocument.data(),
      }));

      onSuccess(products);
    },
    (error) => {
      console.error("Gagal membaca produk seller:", error);

      if (onError) {
        onError(error);
      }
    }
  );
}

export async function createProduct({
  name,
  category,
  price,
  description,
  imageURL = "",
  downloadURL = "",
  sellerId,
  sellerName,
}) {
  if (!sellerId) {
    throw new Error("Identitas reseller tidak ditemukan.");
  }

  if (!name?.trim()) {
    throw new Error("Nama produk wajib diisi.");
  }

  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    throw new Error("Harga produk tidak valid.");
  }

  return addDoc(productsCollection, {
    name: name.trim(),
    nameLowercase: name.trim().toLowerCase(),
    category: category.trim(),
    categoryLowercase: category.trim().toLowerCase(),
    price: numericPrice,
    description: description.trim(),
    imageURL,
    downloadURL,
    sellerId,
    sellerName: sellerName || "Reseller Madhayana",
    rating: 0,
    sold: 0,
    stock: -1,
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateProduct(productId, updates) {
  if (!productId) {
    throw new Error("ID produk tidak ditemukan.");
  }

  await updateDoc(doc(db, "products", productId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function approveProduct(productId, operatorId) {
  await updateProduct(productId, {
    status: "active",
    approvedBy: operatorId,
    approvedAt: serverTimestamp(),
    rejectionReason: "",
  });
}

export async function rejectProduct(
  productId,
  operatorId,
  rejectionReason
) {
  await updateProduct(productId, {
    status: "rejected",
    approvedBy: operatorId,
    rejectionReason: rejectionReason.trim(),
  });
}

export async function deleteProduct(productId) {
  await deleteDoc(doc(db, "products", productId));
}
