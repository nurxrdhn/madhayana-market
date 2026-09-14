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

const existing = new Set();

for (const doc of snap.docs) {
  const sellerId = doc.data().sellerId;
  if (sellerId) existing.add(String(sellerId));
}

let counter = 1;

function nextSellerId() {
  while (true) {
    const id = `SLR-${String(counter).padStart(3, "0")}`;
    counter++;

    if (!existing.has(id)) {
      existing.add(id);
      return id;
    }
  }
}

let updated = 0;

for (const doc of snap.docs) {
  const data = doc.data();

  if (
    String(data.role || "").toLowerCase() === "reseller" &&
    !data.sellerId
  ) {
    const sellerId = nextSellerId();

    await doc.ref.update({
      sellerId,
    });

    console.log(
      `✓ ${data.name || data.email || doc.id} -> ${sellerId} (${data.email || "-"})`
    );

    updated++;
  }
}

console.log(`\nSelesai. ${updated} akun reseller diperbarui.`);
process.exit(0);
