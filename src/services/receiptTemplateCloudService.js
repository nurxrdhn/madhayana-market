import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

const TEMPLATE_COLLECTION = "receiptTemplates";
const PLATFORM_TEMPLATE_ID = "platform-default";

function cleanObject(value) {
  return JSON.parse(JSON.stringify(value ?? {}));
}

export async function savePlatformReceiptTemplate({
  sellerId,
  sellerName,
  templateName,
  fileName,
  data,
  fields,
  category = "Struk",
}) {
  if (!sellerId) {
    throw new Error("UID reseller tidak ditemukan.");
  }

  if (!data) {
    throw new Error("Data template belum tersedia.");
  }

  await setDoc(
    doc(
      db,
      TEMPLATE_COLLECTION,
      PLATFORM_TEMPLATE_ID
    ),
    {
      sellerId,
      sellerName:
        sellerName || "Madhayana Reseller",
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
