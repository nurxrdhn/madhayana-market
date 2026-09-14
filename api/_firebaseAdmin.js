import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

function getPrivateKey() {
  const value = process.env.FIREBASE_PRIVATE_KEY;

  if (!value) {
    throw new Error("FIREBASE_PRIVATE_KEY belum dikonfigurasi");
  }

  return value.replace(/\\n/g, "\n");
}

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert({
          projectId:
            process.env.FIREBASE_PROJECT_ID || "madhayana-80f71",
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: getPrivateKey(),
        }),
      });

export const adminDb = getFirestore(app);
export const adminFieldValue = FieldValue;
