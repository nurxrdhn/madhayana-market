import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { getAuth } from "firebase/auth";
import { db } from "../firebase/config";

function getEmailNumber(email = "") {
  const username = String(email)
    .split("@")[0]
    .trim();

  const match = username.match(/(\d+)$/);

  return match?.[1] || "";
}

export function generateStoreId(user) {
  const emailNumber = getEmailNumber(
    user?.email
  );

  const uidSuffix = String(user?.uid || "")
    .slice(-4)
    .toUpperCase();

  return `TOKO-${
    emailNumber || "MKT"
  }-${uidSuffix || "0000"}`;
}

export async function getMyStoreProfile() {
  const auth = getAuth();
  const firebaseUser = auth.currentUser;

  if (!firebaseUser?.uid) {
    throw new Error(
      "Akun reseller belum terbaca. Silakan login ulang."
    );
  }

  const snapshot = await getDoc(
    doc(db, "stores", firebaseUser.uid)
  );

  if (!snapshot.exists()) {
    return {
      ownerId: firebaseUser.uid,
      storeId: generateStoreId(
        firebaseUser
      ),
      storeName:
        firebaseUser.displayName ||
        "Toko Madhayana",
      ownerName:
        firebaseUser.displayName ||
        "Reseller",
      email: firebaseUser.email || "",
      whatsapp: "",
      address: "",
      description: "",
      logoURL:
        firebaseUser.photoURL || "",
      isActive: true,
    };
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

export async function saveMyStoreProfile(
  profile
) {
  const auth = getAuth();
  const firebaseUser = auth.currentUser;

  if (!firebaseUser?.uid) {
    throw new Error(
      "Akun reseller belum terbaca. Silakan login ulang."
    );
  }

  if (!profile.storeName?.trim()) {
    throw new Error(
      "Nama toko wajib diisi."
    );
  }

  if (!profile.storeId?.trim()) {
    throw new Error(
      "ID toko tidak ditemukan."
    );
  }

  const payload = {
    ownerId: firebaseUser.uid,
    storeId: profile.storeId
      .trim()
      .toUpperCase(),

    storeName: profile.storeName.trim(),

    ownerName:
      profile.ownerName?.trim() ||
      firebaseUser.displayName ||
      "Reseller",

    email:
      profile.email?.trim() ||
      firebaseUser.email ||
      "",

    whatsapp:
      profile.whatsapp?.trim() || "",

    address:
      profile.address?.trim() || "",

    description:
      profile.description?.trim() || "",

    logoURL:
      profile.logoURL?.trim() ||
      firebaseUser.photoURL ||
      "",

    role: "reseller",
    isActive: true,

    searchName: profile.storeName
      .trim()
      .toLowerCase(),

    searchOwner: String(
      profile.ownerName ||
        firebaseUser.displayName ||
        ""
    ).toLowerCase(),

    updatedAt: serverTimestamp(),
  };

  await setDoc(
    doc(db, "stores", firebaseUser.uid),
    payload,
    {
      merge: true,
    }
  );

  return payload;
}
