export const PLATFORM_CONFIG = {
  NAME: "Madhayana Market",
  DOMAIN: "https://madhayana.com",
  COMMISSION_RATE: 0.02,
  MAX_UPLOAD_SIZE: 1024 * 1024 * 1024, // 1 GB
  SESSION_TIMEOUT_MS: 30 * 60 * 1000,   // 30 Minutes
  ACCOUNT_LOCK_ATTEMPTS: 5,
  LOCK_DURATION_MS: 15 * 60 * 1000      // 15 Minutes
};

export const ROLES = {
  GST: "Guest",
  BYR: "Buyer",
  SLR: "Seller",
  CS: "Customer Service",
  SLS: "Sales",
  OP: "Operator",
  SPV: "Supervisor",
  ADM: "Administrator"
};

export const PRODUCT_CATEGORIES = [
  "Software", "Aplikasi", "Jasa", "Sertifikasi", "Template", "Ebook", "Kursus", "Lisensi"
];

export const ORDER_STATUS = {
  PENDING: "Menunggu Pembayaran",
  PROCESSING: "Diproses",
  READY: "Siap Diunduh",
  DOWNLOADED: "Sudah Diunduh",
  COMPLETED: "Selesai",
  REFUNDED: "Refund",
  CANCELLED: "Dibatalkan"
};
