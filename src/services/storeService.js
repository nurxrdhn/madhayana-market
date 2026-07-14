import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase/config";

export async function getResellerStores() {
  const snapshot = await getDocs(
    collection(db, "users")
  );

  return snapshot.docs
    .map((document) => ({
      id: document.id,
      ...document.data(),
    }))
    .filter(
      (user) =>
        user.role === "reseller" ||
        user.role === "seller"
    )
    .map((seller) => ({
      id: seller.id,
      name:
        seller.storeName ||
        seller.name ||
        seller.displayName ||
        "Toko Madhayana",
      ownerName:
        seller.name ||
        seller.displayName ||
        "Reseller",
      email: seller.email || "",
      photoURL:
        seller.logoURL ||
        seller.photoURL ||
        "",
      address:
        seller.address ||
        "Alamat toko belum tersedia",
      whatsapp:
        seller.whatsapp ||
        seller.phone ||
        "",
      followers: Number(
        seller.followers || 0
      ),
      rating: Number(
        seller.rating || 0
      ),
    }));
}
