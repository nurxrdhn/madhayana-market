import crypto from "crypto";
import {
  adminDb,
  adminFieldValue,
} from "./_firebaseAdmin.js";

const MAX_TIMESTAMP_AGE = 5 * 60;

async function readRawBody(req) {
  if (typeof req.body === "string") {
    return req.body;
  }

  if (
    req.body &&
    typeof req.body === "object"
  ) {
    return JSON.stringify(req.body);
  }

  const chunks = [];

  for await (const chunk of req) {
    chunks.push(
      Buffer.isBuffer(chunk)
        ? chunk
        : Buffer.from(chunk)
    );
  }

  return Buffer.concat(chunks).toString("utf8");
}

function safeCompare(a, b) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (
    aBuffer.length !== bBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    aBuffer,
    bBuffer
  );
}

function verifySignature({
  rawBody,
  timestamp,
  signature,
}) {
  const secret =
    process.env.MAPAY_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error(
      "MAPAY_WEBHOOK_SECRET belum dikonfigurasi"
    );
  }

  if (!timestamp || !signature) {
    return false;
  }

  const timestampNumber =
    Number(timestamp);

  if (
    !Number.isFinite(timestampNumber)
  ) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);

  if (
    Math.abs(now - timestampNumber) >
    MAX_TIMESTAMP_AGE
  ) {
    return false;
  }

  const expected =
    crypto
      .createHmac("sha256", secret)
      .update(
        `${timestamp}.${rawBody}`
      )
      .digest("hex");

  const received =
    String(signature).replace(
      /^sha256=/,
      ""
    );

  return safeCompare(
    expected,
    received
  );
}

async function processPaymentPaid(event) {
  const data = event.data || {};

  const orderId = String(
    data.order_id || ""
  ).trim();

  if (!orderId) {
    throw new Error(
      "order_id tidak ditemukan pada webhook"
    );
  }

  const eventRef = adminDb
    .collection("mapay_webhook_events")
    .doc(event.event_id);

  const orderRef = adminDb
    .collection("orders")
    .doc(orderId);

  await adminDb.runTransaction(
    async (transaction) => {
      const eventSnapshot =
        await transaction.get(eventRef);

      if (eventSnapshot.exists) {
        return;
      }

      const orderSnapshot =
        await transaction.get(orderRef);

      if (!orderSnapshot.exists) {
        throw new Error(
          `Order ${orderId} tidak ditemukan`
        );
      }

      transaction.update(orderRef, {
        paymentStatus: "Lunas",
        status: "Perlu Diproses",

        mapayPaymentId:
          data.payment_id || null,

        paymentMethod:
          data.method || null,

        mapayPaidAt:
          data.paid_at || null,

        updatedAt:
          adminFieldValue.serverTimestamp(),
      });

      transaction.set(eventRef, {
        eventId: event.event_id,
        eventType: event.event,
        orderId,
        paymentId:
          data.payment_id || null,

        receivedAt:
          adminFieldValue.serverTimestamp(),
      });
    }
  );
}

export default async function handler(
  req,
  res
) {
  if (req.method !== "POST") {
    res.setHeader(
      "Allow",
      "POST"
    );

    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    const rawBody =
      await readRawBody(req);

    const timestamp =
      req.headers[
        "x-mapay-timestamp"
      ];

    const signature =
      req.headers[
        "x-mapay-signature"
      ];

    const valid =
      verifySignature({
        rawBody,
        timestamp,
        signature,
      });

    if (!valid) {
      return res.status(401).json({
        success: false,
        message:
          "Signature webhook tidak valid",
      });
    }

    const event =
      JSON.parse(rawBody);

    if (
      !event.event_id ||
      !event.event
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payload webhook tidak valid",
      });
    }

    if (
      event.event ===
      "payment.paid"
    ) {
      await processPaymentPaid(
        event
      );
    }

    return res.status(200).json({
      success: true,
      event_id:
        event.event_id,
      event:
        event.event,
      message:
        "Webhook MaPay berhasil diproses",
    });
  } catch (error) {
    console.error(
      "MAPAY WEBHOOK ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Webhook gagal diproses",
    });
  }
}
