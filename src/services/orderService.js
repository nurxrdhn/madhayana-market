import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  getDoc,
} from "firebase/firestore";

import { db, auth } from "../firebase/config.js";

const ordersCollection = collection(db, "orders");

export function subscribeOrders(callback, onError) {
  let stopSnapshot = () => {};
  let cancelled = false;

  async function startSubscription() {
    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("User belum login.");
      }

      const userSnap = await getDoc(
        doc(db, "users", user.uid)
      );

      if (!userSnap.exists()) {
        throw new Error("Dokumen user tidak ditemukan.");
      }

      const sellerId = userSnap.data()?.sellerId;

      if (!sellerId) {
        throw new Error("Seller ID belum tersedia pada akun.");
      }

      const sellerOrdersQuery = query(
        ordersCollection,
        where("sellerId", "==", sellerId)
      );

      if (cancelled) return;

      stopSnapshot = onSnapshot(
        sellerOrdersQuery,
        (snapshot) => {
          const orders = snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }));

          orders.sort((a, b) => {
            const aTime =
              a.createdAt?.toMillis?.() ||
              a.createdAt?.seconds * 1000 ||
              0;

            const bTime =
              b.createdAt?.toMillis?.() ||
              b.createdAt?.seconds * 1000 ||
              0;

            return bTime - aTime;
          });

          callback(orders);
        },
        (error) => {
          console.error(
            "Gagal membaca orders seller:",
            error
          );

          if (onError) {
            onError(error);
          }
        }
      );
    } catch (error) {
      console.error(
        "Gagal memulai sinkronisasi orders:",
        error
      );

      if (onError) {
        onError(error);
      }
    }
  }

  startSubscription();

  return () => {
    cancelled = true;
    stopSnapshot();
  };
}

export async function createOrder(order) {
  if (!order?.id) {
    throw new Error("Order ID wajib diisi");
  }

  await setDoc(
    doc(db, "orders", order.id),
    {
      buyer: order.buyer || "-",
      email: order.email || "-",
      product: order.product || "-",
      total: Number(order.total || 0),
      payment: order.payment || "QRIS",

      paymentStatus:
        order.paymentStatus || "Menunggu",

      status:
        order.status || "Menunggu Pembayaran",

      items: Number(order.items || 1),
      priority: order.priority || "Normal",

      sellerId: order.sellerId || null,

      mapayPaymentId:
        order.mapayPaymentId || null,

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    }
  );
}

export async function updateOrderStatus(
  orderId,
  status
) {
  await updateDoc(
    doc(db, "orders", orderId),
    {
      status,
      updatedAt: serverTimestamp(),
    }
  );
}

export async function updateManyOrderStatus(
  orderIds,
  status
) {
  await Promise.all(
    orderIds.map((orderId) =>
      updateOrderStatus(orderId, status)
    )
  );
}
