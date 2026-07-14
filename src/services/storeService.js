import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase/config";

export async function getResellerStores() {
  try {
    const snapshot = await getDocs(
      collection(db, "stores")
    );

    return snapshot.docs
      .map((storeDocument) => ({
        documentId: storeDocument.id,
        ...storeDocument.data(),
      }))
      .filter(
        (store) =>
          store.isActive !== false &&
          Boolean(store.storeId)
      )
      .map((store) => ({
        id:
          store.ownerId ||
          store.documentId,

        storeId:
          String(store.storeId || "")
            .trim()
            .toUpperCase(),

        name:
          store.storeName ||
          "Toko Madhayana",

        ownerName:
          store.ownerName ||
          "Reseller",

        email: store.email || "",

        photoURL:
          store.logoURL || "",

        address:
          store.address ||
          "Alamat belum tersedia",

        whatsapp:
          store.whatsapp || "",

        description:
          store.description || "",

        followers: Number(
          store.followers || 0
        ),

        rating: Number(
          store.rating || 0
        ),
      }));
  } catch (error) {
    console.error(
      "STORE SERVICE ERROR:",
      error
    );

    if (
      error?.code ===
      "permission-denied"
    ) {
      throw new Error(
        "Akses daftar toko ditolak oleh Firestore Rules."
      );
    }

    throw new Error(
      error?.message ||
      "Daftar toko gagal dibaca dari server."
    );
  }
}
