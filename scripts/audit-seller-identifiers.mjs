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

const usersSnap = await db.collection("users").get();

const sellerMap = new Map();

for (const doc of usersSnap.docs) {
  const d = doc.data();

  if (String(d.role || "").toLowerCase() === "reseller") {
    sellerMap.set(doc.id, {
      uid: doc.id,
      email: d.email || null,
      name: d.name || d.displayName || null,
      sellerId: d.sellerId || null,
    });
  }
}

console.log("\n=== SELLERS ===");

for (const seller of sellerMap.values()) {
  console.log(seller);
}

async function auditCollection(name) {
  const snap = await db.collection(name).get();

  console.log(`\n=== ${name.toUpperCase()} (${snap.size}) ===`);

  for (const doc of snap.docs) {
    const d = doc.data();

    const possibleSeller =
      d.sellerId ??
      d.ownerId ??
      d.storeOwnerId ??
      d.resellerId ??
      null;

    if (possibleSeller) {
      console.log({
        docId: doc.id,
        sellerReference: possibleSeller,
        field:
          d.sellerId != null
            ? "sellerId"
            : d.ownerId != null
            ? "ownerId"
            : d.storeOwnerId != null
            ? "storeOwnerId"
            : "resellerId",
      });
    }
  }
}

await auditCollection("products");
await auditCollection("stores");
await auditCollection("receiptTemplates");
await auditCollection("orders");

process.exit(0);
