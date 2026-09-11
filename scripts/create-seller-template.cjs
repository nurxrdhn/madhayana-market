const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

const outputDir = path.join(
  __dirname,
  "../public/templates"
);

fs.mkdirSync(outputDir, {
  recursive: true,
});

const rows = [
  [
    "KODE_PRODUK",
    "NAMA_PRODUK",
    "KATEGORI",
    "HARGA_MODAL",
    "HARGA_JUAL",
    "STOK",
    "DESKRIPSI",
  ],
  [
    "PRD001",
    "Contoh Produk",
    "Digital",
    10000,
    12000,
    100,
    "Silakan ubah data contoh ini",
  ],
];

const worksheet =
  XLSX.utils.aoa_to_sheet(rows);

worksheet["!cols"] = [
  { wch: 18 },
  { wch: 30 },
  { wch: 20 },
  { wch: 18 },
  { wch: 18 },
  { wch: 12 },
  { wch: 45 },
];

worksheet["!freeze"] = {
  xSplit: 0,
  ySplit: 1,
};

const workbook =
  XLSX.utils.book_new();

XLSX.utils.book_append_sheet(
  workbook,
  worksheet,
  "Produk Seller"
);

const instructions = [
  ["PANDUAN TEMPLATE PRODUK SELLER"],
  [""],
  ["1.", "Jangan mengubah nama kolom pada baris pertama."],
  ["2.", "Isi satu produk dalam satu baris."],
  ["3.", "HARGA_MODAL dan HARGA_JUAL menggunakan angka tanpa Rp."],
  ["4.", "STOK menggunakan angka."],
  ["5.", "Setelah selesai, simpan sebagai file Excel (.xlsx)."],
  ["6.", "Upload kembali melalui Madhayana Market."],
];

const instructionSheet =
  XLSX.utils.aoa_to_sheet(instructions);

instructionSheet["!cols"] = [
  { wch: 8 },
  { wch: 75 },
];

XLSX.utils.book_append_sheet(
  workbook,
  instructionSheet,
  "Panduan"
);

const output = path.join(
  outputDir,
  "Template-Produk-Seller-Madhayana.xlsx"
);

XLSX.writeFile(workbook, output);

console.log(
  "✓ Template Excel berhasil dibuat:",
  output
);
