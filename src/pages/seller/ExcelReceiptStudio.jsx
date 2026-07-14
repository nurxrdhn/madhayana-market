import { forwardRef, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { QRCodeSVG } from "qrcode.react";

const REQUIRED_SHEETS = [
  "TEMPLATE_STRUK",
  "FIELDS",
  "CONTOH_DATA",
];

const REQUIRED_KEYS = [
  "NAMA_RESELLER",
  "ALAMAT_RESELLER",
  "KONTAK_RESELLER",
  "NAMA_BUYER",
  "ID_AKUN_BUYER",
  "EMAIL_BUYER",
  "NO_PESANAN",
  "TANGGAL_WAKTU",
  "NAMA_PRODUK",
  "HARGA_PER_ITEM",
  "JUMLAH",
  "TOTAL_HARGA",
  "DISKON",
  "BIAYA_ADMIN",
  "TOTAL",
  "METODE_PEMBAYARAN",
  "STATUS_PEMBAYARAN",
  "UCAPAN_TERIMA_KASIH",
  "HIMBAUAN",
];

function normalizeKey(value) {
  return String(value || "")
    .trim()
    .toUpperCase();
}

function numberValue(value) {
  if (typeof value === "number") {
    return value;
  }

  return (
    Number(
      String(value || 0)
        .replace(/[^\d-]/g, "")
    ) || 0
  );
}

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(numberValue(value));
}

function createInvoiceNumber(orderNumber) {
  const cleanOrder = String(
    orderNumber || "ORD-20260714-000001"
  ).replace(/^ORD-?/, "");

  return `INV-${cleanOrder}`;
}

function createTransactionId(orderNumber) {
  const source = String(
    orderNumber || Date.now()
  )
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(-8)
    .toUpperCase();

  return `TRX-${source}`;
}

function splitDateTime(value) {
  const text = String(
    value || "14 Juli 2026, 14:35 WIB"
  );

  const parts = text.split(",");

  return {
    date: parts[0]?.trim() || "-",
    time:
      parts.slice(1).join(",").trim() ||
      "-",
  };
}

function buildDataMap(rows) {
  return rows.reduce((result, row) => {
    const key = normalizeKey(row.key);

    if (key) {
      result[key] = row.value ?? "";
    }

    return result;
  }, {});
}

function buildFieldMap(rows) {
  return rows.reduce((result, row) => {
    const key = normalizeKey(row.key);

    if (key) {
      result[key] = {
        key,
        label: row.label || key,
        dataType: row.data_type || "text",
        source: row.source || "",
        required:
          normalizeKey(row.required) === "YA",
        sellerEditable:
          normalizeKey(row.seller_editable) === "YA",
        example: row.example || "",
        description: row.description || "",
      };
    }

    return result;
  }, {});
}

export default function ExcelReceiptStudio({
  user,
  onBack,
}) {
  const receiptRef = useRef(null);

  const [fileName, setFileName] = useState("");
  const [templateData, setTemplateData] =
    useState(null);
  const [fieldDefinitions, setFieldDefinitions] =
    useState({});
  const [templateCells, setTemplateCells] =
    useState([]);
  const [error, setError] = useState("");
  const [processing, setProcessing] =
    useState(false);

  const computedData = useMemo(() => {
    if (!templateData) {
      return null;
    }

    const quantity = numberValue(
      templateData.JUMLAH
    );

    const unitPrice = numberValue(
      templateData.HARGA_PER_ITEM
    );

    const grossTotal =
      numberValue(templateData.TOTAL_HARGA) ||
      unitPrice * quantity;

    const discount = numberValue(
      templateData.DISKON
    );

    const adminFee = numberValue(
      templateData.BIAYA_ADMIN
    );

    const finalTotal =
      numberValue(templateData.TOTAL) ||
      grossTotal - discount + adminFee;

    const dateTime = splitDateTime(
      templateData.TANGGAL_WAKTU
    );

    const orderNumber =
      templateData.NO_PESANAN ||
      "ORD-20260714-000001";

    return {
      ...templateData,
      JUMLAH: quantity,
      HARGA_PER_ITEM: unitPrice,
      TOTAL_HARGA: grossTotal,
      DISKON: discount,
      BIAYA_ADMIN: adminFee,
      TOTAL: finalTotal,

      NO_INVOICE:
        templateData.NO_INVOICE ||
        createInvoiceNumber(orderNumber),

      ID_TRANSAKSI:
        templateData.ID_TRANSAKSI ||
        createTransactionId(orderNumber),

      TANGGAL_TRANSAKSI:
        templateData.TANGGAL_TRANSAKSI ||
        dateTime.date,

      WAKTU_TRANSAKSI:
        templateData.WAKTU_TRANSAKSI ||
        dateTime.time,

      ORDER_URL:
        templateData.ORDER_URL ||
        `https://madhayana.com/order/${encodeURIComponent(
          orderNumber
        )}`,

      STATUS_PEMBAYARAN:
        "BERHASIL",
    };
  }, [templateData]);

  const editableFields = useMemo(
    () =>
      Object.values(fieldDefinitions).filter(
        (field) => field.sellerEditable
      ),
    [fieldDefinitions]
  );

  async function readExcel(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setProcessing(true);

    try {
      if (
        !file.name.toLowerCase().endsWith(".xlsx")
      ) {
        throw new Error(
          "File harus menggunakan format .xlsx."
        );
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error(
          "Ukuran template maksimal 5 MB."
        );
      }

      const buffer = await file.arrayBuffer();

      const workbook = XLSX.read(buffer, {
        type: "array",
        cellFormula: true,
        cellStyles: true,
      });

      const missingSheets =
        REQUIRED_SHEETS.filter(
          (sheetName) =>
            !workbook.SheetNames.includes(sheetName)
        );

      if (missingSheets.length > 0) {
        throw new Error(
          `Sheet wajib belum tersedia: ${missingSheets.join(
            ", "
          )}.`
        );
      }

      const fieldsRows =
        XLSX.utils.sheet_to_json(
          workbook.Sheets.FIELDS,
          {
            defval: "",
          }
        );

      const sampleRows =
        XLSX.utils.sheet_to_json(
          workbook.Sheets.CONTOH_DATA,
          {
            defval: "",
          }
        );

      const parsedFields =
        buildFieldMap(fieldsRows);

      const parsedData =
        buildDataMap(sampleRows);

      const missingKeys =
        REQUIRED_KEYS.filter(
          (key) => !parsedFields[key]
        );

      if (missingKeys.length > 0) {
        throw new Error(
          `Key wajib belum tersedia pada sheet FIELDS: ${missingKeys.join(
            ", "
          )}.`
        );
      }

      const templateRows =
        XLSX.utils.sheet_to_json(
          workbook.Sheets.TEMPLATE_STRUK,
          {
            header: 1,
            defval: "",
            raw: false,
          }
        );

      setFileName(file.name);
      setFieldDefinitions(parsedFields);
      setTemplateData(parsedData);
      setTemplateCells(templateRows);
    } catch (readError) {
      console.error(readError);

      setFileName("");
      setTemplateData(null);
      setFieldDefinitions({});
      setTemplateCells([]);

      setError(
        readError.message ||
          "Template Excel gagal dibaca."
      );
    } finally {
      setProcessing(false);
      event.target.value = "";
    }
  }

  function updateEditableField(key, value) {
    setTemplateData((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function createReceiptCanvas() {
    if (!receiptRef.current) {
      throw new Error(
        "Preview struk belum tersedia."
      );
    }

    return html2canvas(receiptRef.current, {
      scale: 2.5,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      windowWidth:
        receiptRef.current.scrollWidth,
      windowHeight:
        receiptRef.current.scrollHeight,
    });
  }

  async function downloadJpg() {
    try {
      setProcessing(true);

      const canvas =
        await createReceiptCanvas();

      const link =
        document.createElement("a");

      link.download = `${
        computedData.NO_PESANAN ||
        "bukti-pembelian"
      }.jpg`;

      link.href = canvas.toDataURL(
        "image/jpeg",
        0.95
      );

      link.click();
    } catch (downloadError) {
      setError(downloadError.message);
    } finally {
      setProcessing(false);
    }
  }

  async function shareJpg() {
    try {
      setProcessing(true);

      const canvas =
        await createReceiptCanvas();

      const blob = await new Promise(
        (resolve) =>
          canvas.toBlob(
            resolve,
            "image/jpeg",
            0.95
          )
      );

      if (!blob) {
        throw new Error(
          "Gambar struk gagal dibuat."
        );
      }

      const receiptFile = new File(
        [blob],
        `${
          computedData.NO_PESANAN ||
          "bukti-pembelian"
        }.jpg`,
        {
          type: "image/jpeg",
        }
      );

      if (
        navigator.share &&
        navigator.canShare?.({
          files: [receiptFile],
        })
      ) {
        await navigator.share({
          title: "Bukti Pembelian",
          text:
            "Bukti pembelian Madhayana Market",
          files: [receiptFile],
        });

        return;
      }

      const link =
        document.createElement("a");

      link.download = receiptFile.name;
      link.href = URL.createObjectURL(blob);
      link.click();

      URL.revokeObjectURL(link.href);
    } catch (shareError) {
      if (
        shareError.name !== "AbortError"
      ) {
        setError(
          shareError.message ||
            "Struk gagal dibagikan."
        );
      }
    } finally {
      setProcessing(false);
    }
  }

  async function downloadPdf() {
    try {
      setProcessing(true);

      const canvas =
        await createReceiptCanvas();

      const imageData = canvas.toDataURL(
        "image/jpeg",
        0.96
      );

      const pdfWidth = 100;
      const pdfHeight =
        (canvas.height * pdfWidth) /
        canvas.width;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [
          pdfWidth,
          Math.max(pdfHeight, 140),
        ],
      });

      pdf.addImage(
        imageData,
        "JPEG",
        0,
        0,
        pdfWidth,
        pdfHeight
      );

      pdf.save(
        `${
          computedData.NO_PESANAN ||
          "bukti-pembelian"
        }.pdf`
      );
    } catch (pdfError) {
      setError(
        pdfError.message ||
          "PDF gagal dibuat."
      );
    } finally {
      setProcessing(false);
    }
  }

  return (
    <main className="excel-receipt-page">
      <header className="excel-receipt-header">
        <div>
          <button
            type="button"
            className="excel-back-button"
            onClick={onBack}
          >
            <i className="fi fi-rr-arrow-left" />
            Kembali
          </button>

          <span className="modern-eyebrow">
            RESELLER TEMPLATE STUDIO
          </span>

          <h1>Template Struk Excel</h1>

          <p>
            Unggah template Excel standar.
            Sistem akan membaca field, data contoh,
            dan menampilkan preview struk secara
            otomatis.
          </p>
        </div>

        <div className="excel-user-card">
          <div>
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.name}
              />
            ) : (
              user?.name
                ?.charAt(0)
                ?.toUpperCase() || "R"
            )}
          </div>

          <span>
            <strong>
              {user?.name || "Reseller"}
            </strong>
            <small>Reseller</small>
          </span>
        </div>
      </header>

      {error && (
        <div className="excel-error-message">
          <i className="fi fi-rr-exclamation" />
          {error}
        </div>
      )}

      <div className="excel-receipt-layout">
        <aside className="excel-control-panel">
          <section className="excel-panel-card">
            <div className="excel-panel-heading">
              <div>
                <i className="fi fi-rr-file-excel" />
              </div>

              <span>
                <strong>Upload Excel</strong>
                <small>
                  Hanya format .xlsx, maksimal 5 MB
                </small>
              </span>
            </div>

            <label className="excel-upload-area">
              <input
                type="file"
                accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={readExcel}
              />

              <i className="fi fi-rr-cloud-upload-alt" />

              <strong>
                Pilih Template Excel
              </strong>

              <span>
                Klik atau tarik file ke area ini
              </span>
            </label>

            {processing && (
              <div className="excel-processing">
                <div className="buyer-loading-spinner" />
                Memproses template...
              </div>
            )}

            {fileName && (
              <div className="excel-file-success">
                <i className="fi fi-rr-check-circle" />

                <div>
                  <strong>{fileName}</strong>
                  <span>
                    Template berhasil dibaca
                  </span>
                </div>
              </div>
            )}
          </section>

          {computedData && (
            <section className="excel-panel-card">
              <div className="excel-panel-title">
                <h2>Hasil Pembacaan</h2>
              </div>

              <div className="excel-read-summary">
                <div>
                  <span>Sheet ditemukan</span>
                  <strong>
                    {REQUIRED_SHEETS.length}
                  </strong>
                </div>

                <div>
                  <span>Field terbaca</span>
                  <strong>
                    {
                      Object.keys(
                        fieldDefinitions
                      ).length
                    }
                  </strong>
                </div>

                <div>
                  <span>Baris template</span>
                  <strong>
                    {templateCells.length}
                  </strong>
                </div>
              </div>
            </section>
          )}

          {templateData && editableFields.length > 0 && (
            <section className="excel-panel-card">
              <div className="excel-panel-title">
                <h2>Data Reseller</h2>
                <p>
                  Field ini boleh diubah oleh
                  reseller.
                </p>
              </div>

              <div className="excel-edit-fields">
                {editableFields.map(
                  (field) => (
                    <label key={field.key}>
                      <span>{field.label}</span>

                      <input
                        value={
                          templateData?.[
                            field.key
                          ] ?? ""
                        }
                        onChange={(event) =>
                          updateEditableField(
                            field.key,
                            event.target.value
                          )
                        }
                        placeholder={
                          field.example
                        }
                      />
                    </label>
                  )
                )}
              </div>
            </section>
          )}
        </aside>

        <section className="excel-preview-panel">
          <div className="excel-preview-heading">
            <div>
              <span className="modern-eyebrow">
                LIVE PREVIEW
              </span>
              <h2>Pratinjau Struk</h2>
              <p>
                Preview dan file unduhan memakai
                tampilan yang sama.
              </p>
            </div>
          </div>

          {!computedData ? (
            <div className="excel-empty-preview">
              <div>
                <i className="fi fi-rr-receipt" />
              </div>

              <h3>
                Belum ada template yang dibaca
              </h3>

              <p>
                Unggah template Excel Madhayana
                untuk menampilkan preview.
              </p>
            </div>
          ) : (
            <>
              <ReceiptPreview
                ref={receiptRef}
                data={computedData}
              />

              <div className="excel-receipt-actions">
                <button
                  type="button"
                  className="excel-share-button"
                  onClick={shareJpg}
                  disabled={processing}
                >
                  <i className="fi fi-rr-share" />
                  Bagikan JPG
                </button>

                <button
                  type="button"
                  className="excel-jpg-button"
                  onClick={downloadJpg}
                  disabled={processing}
                >
                  <i className="fi fi-rr-picture" />
                  Download JPG
                </button>

                <button
                  type="button"
                  className="excel-pdf-button"
                  onClick={downloadPdf}
                  disabled={processing}
                >
                  <i className="fi fi-rr-file-pdf" />
                  Download PDF
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

const ReceiptPreview = forwardRef(
  function ReceiptPreview({ data }, ref) {
    return (
      <article
        ref={ref}
        className="excel-receipt-card"
      >
        <div className="receipt-watermark">
          MADHAYANA MARKET
        </div>

        <header className="excel-receipt-brand">
          <div className="excel-receipt-logo">
            {data.LOGO_RESELLER &&
            String(data.LOGO_RESELLER).startsWith(
              "http"
            ) ? (
              <img
                src={data.LOGO_RESELLER}
                alt={data.NAMA_RESELLER}
                crossOrigin="anonymous"
                onError={(event) => {
                  event.currentTarget.style.display =
                    "none";
                }}
              />
            ) : (
              <span>
                {data.NAMA_RESELLER
                  ?.charAt(0)
                  ?.toUpperCase() || "M"}
              </span>
            )}
          </div>

          <div>
            <h2>
              {data.NAMA_RESELLER ||
                "Nama Reseller"}
            </h2>

            <p>
              {data.ALAMAT_RESELLER ||
                "Alamat reseller"}
            </p>

            <small>
              {data.KONTAK_RESELLER ||
                "Kontak reseller"}
            </small>
          </div>
        </header>

        <div className="excel-receipt-success">
          <div>
            <i className="fi fi-rr-check" />
          </div>

          <span>
            <small>Status Pembayaran</small>
            <strong>
              PEMBAYARAN BERHASIL
            </strong>
          </span>
        </div>

        <section className="excel-receipt-section">
          <h3>Data Buyer</h3>

          <ReceiptRow
            label="Nama User"
            value={data.NAMA_BUYER}
          />

          <ReceiptRow
            label="ID Akun"
            value={data.ID_AKUN_BUYER}
          />

          <ReceiptRow
            label="Email"
            value={data.EMAIL_BUYER}
          />
        </section>

        <section className="excel-receipt-section">
          <h3>Informasi Transaksi</h3>

          <ReceiptRow
            label="No. Pesanan"
            value={data.NO_PESANAN}
          />

          <ReceiptRow
            label="No. Invoice"
            value={data.NO_INVOICE}
          />

          <ReceiptRow
            label="ID Transaksi"
            value={data.ID_TRANSAKSI}
          />

          <ReceiptRow
            label="Tanggal"
            value={data.TANGGAL_TRANSAKSI}
          />

          <ReceiptRow
            label="Waktu"
            value={data.WAKTU_TRANSAKSI}
          />

          <ReceiptRow
            label="Metode Bayar"
            value={data.METODE_PEMBAYARAN}
          />
        </section>

        <section className="excel-receipt-section">
          <h3>Rincian Produk</h3>

          <div className="excel-product-card">
            <div>
              <i className="fi fi-rr-box-open" />
            </div>

            <span>
              <strong>
                {data.NAMA_PRODUK}
              </strong>

              <small>
                {data.JUMLAH} ×{" "}
                {formatRupiah(
                  data.HARGA_PER_ITEM
                )}
              </small>
            </span>

            <strong>
              {formatRupiah(
                data.TOTAL_HARGA
              )}
            </strong>
          </div>
        </section>

        <section className="excel-receipt-section">
          <h3>Ringkasan Pembayaran</h3>

          <ReceiptRow
            label="Total Harga"
            value={formatRupiah(
              data.TOTAL_HARGA
            )}
          />

          <ReceiptRow
            label="Diskon"
            value={`- ${formatRupiah(
              data.DISKON
            )}`}
            className="discount"
          />

          <ReceiptRow
            label="Biaya Admin"
            value={formatRupiah(
              data.BIAYA_ADMIN
            )}
          />

          <div className="excel-receipt-total">
            <span>Total Pembayaran</span>

            <strong>
              {formatRupiah(data.TOTAL)}
            </strong>
          </div>
        </section>

        <section className="receipt-verification">
          <div className="receipt-qr">
            <QRCodeSVG
              value={data.ORDER_URL}
              size={82}
              level="M"
              bgColor="#ffffff"
              fgColor="#172033"
            />
          </div>

          <div>
            <strong>Verifikasi Transaksi</strong>

            <p>
              Pindai kode QR untuk membuka detail
              pesanan di Madhayana Market.
            </p>

            <small>
              {data.NO_PESANAN}
            </small>
          </div>
        </section>

        <footer className="excel-receipt-footer">
          <strong>
            {data.UCAPAN_TERIMA_KASIH ||
              "Terima kasih telah berbelanja."}
          </strong>

          <p>
            {data.HIMBAUAN ||
              "Simpan bukti transaksi ini apabila diperlukan."}
          </p>

          <div className="receipt-system-note">
            Dokumen ini dibuat secara otomatis oleh
            sistem Madhayana Market dan tidak
            memerlukan tanda tangan maupun stempel.
          </div>

          <div className="receipt-platform-name">
            MADHAYANA MARKET
          </div>
        </footer>
      </article>
    );
  }
);

function ReceiptRow({
  label,
  value,
  className = "",
}) {
  return (
    <div
      className={`excel-receipt-row ${className}`}
    >
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );

}
