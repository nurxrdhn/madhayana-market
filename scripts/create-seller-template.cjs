const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const outputDir = path.join(
  __dirname,
  "../public/templates"
);

fs.mkdirSync(outputDir, {
  recursive: true,
});

const workbook = XLSX.utils.book_new();

/*
 * =====================================================
 * SHEET 1: TEMPLATE_STRUK
 * =====================================================
 *
 * Sheet ini menjadi gambaran layout template.
 */
const templateRows = [
  ["MADHAYANA MARKET"],
  ["STRUK PEMBELIAN"],
  [""],
  ["Seller", "{{NAMA_RESELLER}}"],
  ["Alamat", "{{ALAMAT_RESELLER}}"],
  ["Kontak", "{{KONTAK_RESELLER}}"],
  [""],
  ["Buyer", "{{NAMA_BUYER}}"],
  ["ID Buyer", "{{ID_AKUN_BUYER}}"],
  ["Email", "{{EMAIL_BUYER}}"],
  [""],
  ["No. Pesanan", "{{NO_PESANAN}}"],
  ["Tanggal", "{{TANGGAL_WAKTU}}"],
  [""],
  ["Produk", "{{NAMA_PRODUK}}"],
  ["Harga / Item", "{{HARGA_PER_ITEM}}"],
  ["Jumlah", "{{JUMLAH}}"],
  ["Total Harga", "{{TOTAL_HARGA}}"],
  ["Diskon", "{{DISKON}}"],
  ["Biaya Admin", "{{BIAYA_ADMIN}}"],
  ["TOTAL", "{{TOTAL}}"],
  [""],
  ["Pembayaran", "{{METODE_PEMBAYARAN}}"],
  ["Status", "{{STATUS_PEMBAYARAN}}"],
  [""],
  ["{{UCAPAN_TERIMA_KASIH}}"],
  ["{{HIMBAUAN}}"],
];

const templateSheet =
  XLSX.utils.aoa_to_sheet(templateRows);

templateSheet["!cols"] = [
  { wch: 24 },
  { wch: 46 },
];

XLSX.utils.book_append_sheet(
  workbook,
  templateSheet,
  "TEMPLATE_STRUK"
);

/*
 * =====================================================
 * SHEET 2: FIELDS
 * =====================================================
 */

const fields = [
  {
    key: "NAMA_RESELLER",
    label: "Nama Seller",
    data_type: "text",
    source: "seller",
    required: "YA",
    seller_editable: "YA",
    example: "Madhayana Seller",
    description: "Nama toko atau seller.",
  },
  {
    key: "ALAMAT_RESELLER",
    label: "Alamat Seller",
    data_type: "text",
    source: "seller",
    required: "YA",
    seller_editable: "YA",
    example: "Tangerang, Banten",
    description: "Alamat toko seller.",
  },
  {
    key: "KONTAK_RESELLER",
    label: "Kontak Seller",
    data_type: "text",
    source: "seller",
    required: "YA",
    seller_editable: "YA",
    example: "081234567890",
    description: "Nomor kontak seller.",
  },
  {
    key: "NAMA_BUYER",
    label: "Nama Buyer",
    data_type: "text",
    source: "buyer",
    required: "YA",
    seller_editable: "TIDAK",
    example: "Budi Santoso",
    description: "Nama pembeli.",
  },
  {
    key: "ID_AKUN_BUYER",
    label: "ID Akun Buyer",
    data_type: "text",
    source: "buyer",
    required: "YA",
    seller_editable: "TIDAK",
    example: "BYR-2026-001234",
    description: "Kode akun buyer.",
  },
  {
    key: "EMAIL_BUYER",
    label: "Email Buyer",
    data_type: "text",
    source: "buyer",
    required: "YA",
    seller_editable: "TIDAK",
    example: "buyer@example.com",
    description: "Email buyer.",
  },
  {
    key: "NO_PESANAN",
    label: "Nomor Pesanan",
    data_type: "text",
    source: "order",
    required: "YA",
    seller_editable: "TIDAK",
    example: "ORD-20260911-000001",
    description: "Nomor pesanan.",
  },
  {
    key: "TANGGAL_WAKTU",
    label: "Tanggal dan Waktu",
    data_type: "text",
    source: "order",
    required: "YA",
    seller_editable: "TIDAK",
    example: "11 September 2026, 10:30 WIB",
    description: "Tanggal dan waktu transaksi.",
  },
  {
    key: "NAMA_PRODUK",
    label: "Nama Produk",
    data_type: "text",
    source: "order",
    required: "YA",
    seller_editable: "TIDAK",
    example: "Produk Digital",
    description: "Nama produk.",
  },
  {
    key: "HARGA_PER_ITEM",
    label: "Harga per Item",
    data_type: "currency",
    source: "order",
    required: "YA",
    seller_editable: "TIDAK",
    example: "50000",
    description: "Harga satuan produk.",
  },
  {
    key: "JUMLAH",
    label: "Jumlah",
    data_type: "number",
    source: "order",
    required: "YA",
    seller_editable: "TIDAK",
    example: "2",
    description: "Jumlah produk.",
  },
  {
    key: "TOTAL_HARGA",
    label: "Total Harga",
    data_type: "currency",
    source: "order",
    required: "YA",
    seller_editable: "TIDAK",
    example: "100000",
    description: "Total harga sebelum potongan.",
  },
  {
    key: "DISKON",
    label: "Diskon",
    data_type: "currency",
    source: "order",
    required: "YA",
    seller_editable: "TIDAK",
    example: "5000",
    description: "Nilai diskon.",
  },
  {
    key: "BIAYA_ADMIN",
    label: "Biaya Admin",
    data_type: "currency",
    source: "order",
    required: "YA",
    seller_editable: "TIDAK",
    example: "2500",
    description: "Biaya administrasi.",
  },
  {
    key: "TOTAL",
    label: "Total Pembayaran",
    data_type: "currency",
    source: "order",
    required: "YA",
    seller_editable: "TIDAK",
    example: "97500",
    description: "Total pembayaran akhir.",
  },
  {
    key: "METODE_PEMBAYARAN",
    label: "Metode Pembayaran",
    data_type: "text",
    source: "payment",
    required: "YA",
    seller_editable: "TIDAK",
    example: "QRIS",
    description: "Metode pembayaran.",
  },
  {
    key: "STATUS_PEMBAYARAN",
    label: "Status Pembayaran",
    data_type: "text",
    source: "payment",
    required: "YA",
    seller_editable: "TIDAK",
    example: "Lunas",
    description: "Status pembayaran.",
  },
  {
    key: "UCAPAN_TERIMA_KASIH",
    label: "Ucapan Terima Kasih",
    data_type: "text",
    source: "seller",
    required: "YA",
    seller_editable: "YA",
    example: "Terima kasih telah berbelanja.",
    description: "Ucapan pada bagian bawah struk.",
  },
  {
    key: "HIMBAUAN",
    label: "Himbauan",
    data_type: "text",
    source: "seller",
    required: "YA",
    seller_editable: "YA",
    example: "Simpan struk ini sebagai bukti transaksi.",
    description: "Pesan tambahan pada struk.",
  },
];

const fieldsSheet =
  XLSX.utils.json_to_sheet(fields, {
    header: [
      "key",
      "label",
      "data_type",
      "source",
      "required",
      "seller_editable",
      "example",
      "description",
    ],
  });

fieldsSheet["!cols"] = [
  { wch: 24 },
  { wch: 26 },
  { wch: 14 },
  { wch: 14 },
  { wch: 12 },
  { wch: 18 },
  { wch: 32 },
  { wch: 44 },
];

XLSX.utils.book_append_sheet(
  workbook,
  fieldsSheet,
  "FIELDS"
);

/*
 * =====================================================
 * SHEET 3: CONTOH_DATA
 * =====================================================
 */

const sampleData = [
  ["key", "value"],
  ["NAMA_RESELLER", "Madhayana Seller"],
  ["ALAMAT_RESELLER", "Tangerang, Banten"],
  ["KONTAK_RESELLER", "081234567890"],
  ["NAMA_BUYER", "Budi Santoso"],
  ["ID_AKUN_BUYER", "BYR-2026-001234"],
  ["EMAIL_BUYER", "buyer@example.com"],
  ["NO_PESANAN", "ORD-20260911-000001"],
  ["TANGGAL_WAKTU", "11 September 2026, 10:30 WIB"],
  ["NAMA_PRODUK", "Produk Digital Madhayana"],
  ["HARGA_PER_ITEM", 50000],
  ["JUMLAH", 2],
  ["TOTAL_HARGA", 100000],
  ["DISKON", 5000],
  ["BIAYA_ADMIN", 2500],
  ["TOTAL", 97500],
  ["METODE_PEMBAYARAN", "QRIS"],
  ["STATUS_PEMBAYARAN", "Lunas"],
  [
    "UCAPAN_TERIMA_KASIH",
    "Terima kasih telah berbelanja di Madhayana Market.",
  ],
  [
    "HIMBAUAN",
    "Simpan struk ini sebagai bukti transaksi.",
  ],
];

const sampleSheet =
  XLSX.utils.aoa_to_sheet(sampleData);

sampleSheet["!cols"] = [
  { wch: 26 },
  { wch: 56 },
];

XLSX.utils.book_append_sheet(
  workbook,
  sampleSheet,
  "CONTOH_DATA"
);

const outputPath = path.join(
  outputDir,
  "Template-Struk-Seller-Madhayana.xlsx"
);

XLSX.writeFile(
  workbook,
  outputPath
);

console.log(
  "✓ Template Struk Seller berhasil dibuat:"
);

console.log(outputPath);
