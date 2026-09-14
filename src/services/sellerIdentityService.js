import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase/config.js";

export async function getCurrentSellerIdentity() {
  const auth = getAuth();
  const firebaseUser = auth.currentUser;

  if (!firebaseUser?.uid) {
    throw new Error("Akun seller belum login.");
  }

  const userSnapshot = await getDoc(
    doc(db, "users", firebaseUser.uid)
  );

  if (!userSnapshot.exists()) {
    throw new Error("Profil seller tidak ditemukan.");
  }

  const profile = userSnapshot.data();
  const sellerId = String(profile.sellerId || "").trim();

  if (!sellerId) {
    throw new Error("Seller ID belum tersedia pada akun.");
  }

  return {
    uid: firebaseUser.uid,
    sellerId,
    email: firebaseUser.email || profile.email || "",
    name:
      profile.name ||
      profile.displayName ||
      firebaseUser.displayName ||
      "Reseller Madhayana",
  };
}
