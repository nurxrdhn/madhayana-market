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

const snap = await db
  .collection("orders")
  .doc("ORD-MAPAY-TEST-001")
  .get();

if (!snap.exists) {
  console.log("❌ ORDER TIDAK ADA DI FIRESTORE");
} else {
  const d = snap.data();

  console.log("✓ ORDER ADA");
  console.log({
    id: snap.id,
    sellerId: d.sellerId,
    paymentStatus: d.paymentStatus,
    status: d.status,
    total: d.total,
    mapayPaymentId: d.mapayPaymentId,
  });
}

process.exit(0);
