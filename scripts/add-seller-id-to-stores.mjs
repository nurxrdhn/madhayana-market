import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

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

const storesSnap = await db.collection("stores").get();

let updated = 0;

for (const storeDoc of storesSnap.docs) {
  const store = storeDoc.data();
  const ownerId = store.ownerId || storeDoc.id;

  if (!ownerId) continue;

  const userSnap = await db.collection("users").doc(ownerId).get();

  if (!userSnap.exists) {
    console.log(`⚠ User pemilik toko tidak ditemukan: ${ownerId}`);
    continue;
  }

  const user = userSnap.data();
  const sellerId = user.sellerId;

  if (!sellerId) {
    console.log(`⚠ sellerId belum ada untuk owner: ${ownerId}`);
    continue;
  }

  await storeDoc.ref.update({
    sellerId,
    updatedAt: FieldValue.serverTimestamp(),
  });

  console.log(
    `✓ Store ${storeDoc.id}: ownerId=${ownerId} → sellerId=${sellerId}`
  );

  updated++;
}

console.log(`\nSelesai. ${updated} store diperbarui.`);
process.exit(0);
