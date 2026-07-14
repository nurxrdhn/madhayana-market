import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase/config";

export async function getResellerStores() {
  const snapshot = await getDocs(
    collection(db, "stores")
  );

  return snapshot.docs
    .map((storeDocument) => ({
      id: storeDocument.id,
      ...storeDocument.data(),
    }))
    .filter(
      (store) =>
        store.isActive !== false
    )
    .map((store) => ({
      id: store.ownerId || store.id,
      storeId: store.storeId || "",
      name:
        store.storeName ||
        "Toko Madhayana",
      ownerName:
        store.ownerName ||
        "Reseller",
      email: store.email || "",
      photoURL: store.logoURL || "",
      address:
        store.address ||
        "Alamat belum tersedia",
      whatsapp: store.whatsapp || "",
      description:
        store.description || "",
      followers: Number(
        store.followers || 0
      ),
      rating: Number(
        store.rating || 0
      ),
    }));
}
