import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

function getPrivateKey() {
  const value = process.env.FIREBASE_PRIVATE_KEY;
  if (!value) throw new Error("FIREBASE_PRIVATE_KEY belum ada");
  return value.replace(/\\n/g, "\n");
}

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: getPrivateKey(),
        }),
      });

const db = getFirestore(app);

const orderId = "ORD-MAPAY-TEST-001";

await db.collection("orders").doc(orderId).set(
  {
    buyer: "Test MaPay",
    email: "test@mapay.local",
    product: "Produk Uji MaPay",
    total: 25000,
    payment: "QRIS",
    paymentStatus: "Menunggu",
    status: "Menunggu Pembayaran",
    items: 1,
    priority: "Normal",
    sellerId: "SLR-001",
    mapayPaymentId: null,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  },
  { merge: true }
);

console.log(`✓ Order test berhasil dibuat: ${orderId}`);
process.exit(0);
