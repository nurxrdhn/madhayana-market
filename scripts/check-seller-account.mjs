import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      });

const db = getFirestore(app);

const snap = await db.collection("users").get();

console.log("=== SELLER / USER YANG TERDETEKSI ===");

for (const doc of snap.docs) {
  const d = doc.data();

  if (
    String(d.role || "").toLowerCase() === "reseller" ||
    String(d.role || "").toLowerCase() === "seller" ||
    String(d.name || "").toLowerCase().includes("nur ramadhan") ||
    String(d.displayName || "").toLowerCase().includes("nur ramadhan")
  ) {
    console.log({
      docId: doc.id,
      name: d.name || d.displayName || null,
      email: d.email || null,
      role: d.role || null,
      sellerId: d.sellerId || null,
      uid: d.uid || null,
    });
  }
}

process.exit(0);
