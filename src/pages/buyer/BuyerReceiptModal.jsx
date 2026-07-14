import { forwardRef, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { QRCodeSVG } from "qrcode.react";

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function ReceiptRow({ label, value, className = "" }) {
  return (
    <div className={`buyer-receipt-row ${className}`}>
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );
}

const ReceiptDocument = forwardRef(
  function ReceiptDocument({ receipt }, ref) {
    return (
      <article ref={ref} className="buyer-generated-receipt">
        <div className="buyer-receipt-watermark">
          MADHAYANA MARKET
        </div>

        <header className="buyer-receipt-seller">
          <div className="buyer-receipt-logo">
            {receipt.logoURL ? (
              <img
                src={receipt.logoURL}
                alt={receipt.sellerName}
                crossOrigin="anonymous"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : (
              receipt.sellerName?.charAt(0)?.toUpperCase() || "M"
            )}
          </div>

          <div>
            <h2>{receipt.sellerName}</h2>
            <p>{receipt.sellerAddress}</p>
            <small>{receipt.sellerContact}</small>
          </div>
        </header>

        <div className="buyer-receipt-success">
          <div>
            <i className="fi fi-rr-check" />
          </div>

          <span>
            <small>Status Pembayaran</small>
            <strong>PEMBAYARAN BERHASIL</strong>
          </span>
        </div>

        <section className="buyer-receipt-section">
          <h3>Data Buyer</h3>

          <ReceiptRow
            label="Nama User"
            value={receipt.buyerName}
          />

          <ReceiptRow
            label="ID Akun"
            value={receipt.buyerId}
          />

          <ReceiptRow
            label="Email"
            value={receipt.buyerEmail}
          />
        </section>

        <section className="buyer-receipt-section">
          <h3>Informasi Transaksi</h3>

          <ReceiptRow
            label="No. Pesanan"
            value={receipt.orderNumber}
          />

          <ReceiptRow
            label="No. Invoice"
            value={receipt.invoiceNumber}
          />

          <ReceiptRow
            label="ID Transaksi"
            value={receipt.transactionId}
          />

          <ReceiptRow
            label="Tanggal"
            value={receipt.date}
          />

          <ReceiptRow
            label="Waktu"
            value={receipt.time}
          />

          <ReceiptRow
            label="Metode Bayar"
            value={receipt.paymentMethod}
          />
        </section>

        <section className="buyer-receipt-section">
          <h3>Rincian Produk</h3>

          <div className="buyer-receipt-products">
            {receipt.items.map((item) => (
              <article key={item.id}>
                <div>
                  <i className={item.icon || "fi fi-rr-box-open"} />
                </div>

                <span>
                  <strong>{item.name}</strong>
                  <small>
                    {item.quantity} × {formatRupiah(item.unitPrice)}
                  </small>
                </span>

                <strong>
                  {formatRupiah(item.subtotal)}
                </strong>
              </article>
            ))}
          </div>
        </section>

        <section className="buyer-receipt-section">
          <h3>Ringkasan Pembayaran</h3>

          <ReceiptRow
            label="Total Harga"
            value={formatRupiah(receipt.grossTotal)}
          />

          <ReceiptRow
            label="Diskon"
            value={`- ${formatRupiah(receipt.discount)}`}
            className="discount"
          />

          <ReceiptRow
            label="Biaya Admin"
            value={formatRupiah(receipt.adminFee)}
          />

          <div className="buyer-receipt-final-total">
            <span>Total Pembayaran</span>
            <strong>{formatRupiah(receipt.finalTotal)}</strong>
          </div>
        </section>

        <section className="buyer-receipt-verification">
          <div>
            <QRCodeSVG
              value={receipt.orderURL}
              size={82}
              level="M"
            />
          </div>

          <span>
            <strong>Verifikasi Transaksi</strong>
            <p>
              Pindai kode QR untuk membuka detail pesanan.
            </p>
            <small>{receipt.orderNumber}</small>
          </span>
        </section>

        <footer className="buyer-receipt-footer">
          <strong>{receipt.thankYou}</strong>
          <p>{receipt.notice}</p>

          <div>
            Dokumen ini dibuat secara otomatis oleh sistem
            Madhayana Market dan tidak memerlukan tanda
            tangan maupun stempel.
          </div>

          <small>MADHAYANA MARKET</small>
        </footer>
      </article>
    );
  }
);

export default function BuyerReceiptModal({
  receipt,
  onClose,
}) {
  const receiptRef = useRef(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function createCanvas() {
    if (!receiptRef.current) {
      throw new Error("Preview struk belum tersedia.");
    }

    return html2canvas(receiptRef.current, {
      scale: 2.5,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
    });
  }

  async function downloadJpg() {
    try {
      setProcessing(true);
      setError("");

      const canvas = await createCanvas();
      const link = document.createElement("a");

      link.download = `${receipt.orderNumber}.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 0.96);
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
      setError("");

      const canvas = await createCanvas();

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.96)
      );

      if (!blob) {
        throw new Error("Gambar struk gagal dibuat.");
      }

      const file = new File(
        [blob],
        `${receipt.orderNumber}.jpg`,
        { type: "image/jpeg" }
      );

      if (
        navigator.share &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({
          title: "Bukti Pembelian",
          text: `Bukti pembelian ${receipt.orderNumber}`,
          files: [file],
        });

        return;
      }

      const link = document.createElement("a");
      const objectURL = URL.createObjectURL(blob);

      link.download = file.name;
      link.href = objectURL;
      link.click();

      URL.revokeObjectURL(objectURL);
    } catch (shareError) {
      if (shareError.name !== "AbortError") {
        setError(
          shareError.message || "Struk gagal dibagikan."
        );
      }
    } finally {
      setProcessing(false);
    }
  }

  async function downloadPdf() {
    try {
      setProcessing(true);
      setError("");

      const canvas = await createCanvas();
      const image = canvas.toDataURL("image/jpeg", 0.97);

      const pdfWidth = 100;
      const pdfHeight =
        (canvas.height * pdfWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pdfWidth, Math.max(pdfHeight, 140)],
      });

      pdf.addImage(
        image,
        "JPEG",
        0,
        0,
        pdfWidth,
        pdfHeight
      );

      pdf.save(`${receipt.orderNumber}.pdf`);
    } catch (pdfError) {
      setError(pdfError.message || "PDF gagal dibuat.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div
      className="modern-modal-backdrop buyer-receipt-backdrop"
      onMouseDown={onClose}
    >
      <section
        className="buyer-receipt-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="buyer-receipt-modal-header">
          <div>
            <span className="modern-eyebrow">
              BUKTI TRANSAKSI
            </span>
            <h2>Pratinjau Struk</h2>
            <p>
              Isi preview sama dengan file yang akan
              diunduh.
            </p>
          </div>

          <button
            type="button"
            className="modern-modal-close"
            onClick={onClose}
          >
            <i className="fi fi-rr-cross-small" />
          </button>
        </header>

        {error && (
          <div className="buyer-receipt-error">
            <i className="fi fi-rr-exclamation" />
            {error}
          </div>
        )}

        <div className="buyer-receipt-scroll">
          <ReceiptDocument
            ref={receiptRef}
            receipt={receipt}
          />
        </div>

        <div className="buyer-receipt-modal-actions">
          <button
            type="button"
            onClick={shareJpg}
            disabled={processing}
          >
            <i className="fi fi-rr-share" />
            Bagikan JPG
          </button>

          <button
            type="button"
            className="jpg"
            onClick={downloadJpg}
            disabled={processing}
          >
            <i className="fi fi-rr-picture" />
            Download JPG
          </button>

          <button
            type="button"
            className="pdf"
            onClick={downloadPdf}
            disabled={processing}
          >
            <i className="fi fi-rr-file-pdf" />
            Download PDF
          </button>
        </div>
      </section>
    </div>
  );
}
