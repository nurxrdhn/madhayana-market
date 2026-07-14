import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { getAuth } from "firebase/auth";
import { db } from "../firebase/config";

const TEMPLATE_COLLECTION = "receiptTemplates";
const PLATFORM_TEMPLATE_ID = "platform-default";

function cleanObject(value) {
  return JSON.parse(JSON.stringify(value ?? {}));
}

export async function savePlatformReceiptTemplate({
  sellerName,
  templateName,
  fileName,
  data,
  fields,
  category = "Struk",
}) {
  const auth = getAuth();
  const firebaseUser = auth.currentUser;

  if (!firebaseUser?.uid) {
    throw new Error(
      "Akun Firebase belum terbaca. Silakan login ulang sebagai reseller."
    );
  }

  if (!data) {
    throw new Error("Data template belum tersedia.");
  }

  const templateReference = doc(
    db,
    TEMPLATE_COLLECTION,
    PLATFORM_TEMPLATE_ID
  );

  await setDoc(
    templateReference,
    {
      sellerId: firebaseUser.uid,
      sellerEmail: firebaseUser.email || "",
      sellerName:
        sellerName ||
        firebaseUser.displayName ||
        "Madhayana Reseller",

      templateName:
        templateName || "Struk Pembelian",

      fileName: fileName || "",
      category,
      isDefault: true,
      isActive: true,

      data: cleanObject(data),
      fields: cleanObject(fields),

      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    }
  );

  return {
    id: PLATFORM_TEMPLATE_ID,
    sellerId: firebaseUser.uid,
  };
}

export async function getPlatformReceiptTemplate() {
  const snapshot = await getDoc(
    doc(
      db,
      TEMPLATE_COLLECTION,
      PLATFORM_TEMPLATE_ID
    )
  );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}
