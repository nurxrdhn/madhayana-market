import { useMemo, useState } from "react";

const FOLLOW_STORAGE_KEY =
  "madhayana_followed_stores";

function formatRupiah(value) {
  const number = Number(
    String(value || 0).replace(/[^\d]/g, "")
  );

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
}

export default function BuyerStoreProfile({
  store,
  products = [],
  onBack,
  addToCart,
  openDetail,
}) {
  const [followed, setFollowed] = useState(() => {
    try {
      const saved =
        JSON.parse(
          localStorage.getItem(
            FOLLOW_STORAGE_KEY
          )
        ) || [];

      return saved.includes(store.id);
    } catch {
      return false;
    }
  });

  const storeProducts = useMemo(() => {
    return products.filter((product) => {
      const productSellerId =
        product.sellerId ||
        product.resellerId ||
        product.ownerId;

      return productSellerId === store.id;
    });
  }, [products, store.id]);

  function toggleFollow() {
    try {
      const saved =
        JSON.parse(
          localStorage.getItem(
            FOLLOW_STORAGE_KEY
          )
        ) || [];

      const next = saved.includes(store.id)
        ? saved.filter((id) => id !== store.id)
        : [...saved, store.id];

      localStorage.setItem(
        FOLLOW_STORAGE_KEY,
        JSON.stringify(next)
      );

      setFollowed(next.includes(store.id));
    } catch (error) {
      console.error(
        "Gagal menyimpan follow toko:",
        error
      );
    }
  }

  function openWhatsapp() {
    const number = String(
      store.whatsapp || ""
    ).replace(/[^\d]/g, "");

    if (!number) {
      return;
    }

    const indonesiaNumber =
      number.startsWith("0")
        ? `62${number.slice(1)}`
        : number;

    window.open(
      `https://wa.me/${indonesiaNumber}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <section className="buyer-store-profile-page">
      <button
        type="button"
        className="buyer-store-back"
        onClick={onBack}
      >
        <i className="fi fi-rr-arrow-left" />
        Kembali ke Daftar Toko
      </button>

      <section className="buyer-store-profile-hero">
        <div className="buyer-store-profile-cover" />

        <div className="buyer-store-profile-content">
          <div className="buyer-store-profile-logo">
            {store.photoURL ? (
              <img
                src={store.photoURL}
                alt={store.name}
              />
            ) : (
              <span>
                {store.name
                  ?.charAt(0)
                  ?.toUpperCase() || "T"}
              </span>
            )}
          </div>

          <div className="buyer-store-profile-main">
            <span className="modern-eyebrow">
              TOKO RESELLER
            </span>

            <h1>{store.name}</h1>

            <p>
              Dikelola oleh{" "}
              <strong>{store.ownerName}</strong>
            </p>

            <div className="buyer-store-profile-meta">
              <span>
                <i className="fi fi-rr-star" />
                {store.rating || "Toko baru"}
              </span>

              <span>
                <i className="fi fi-rr-users" />
                {store.followers || 0} pengikut
              </span>

              <span>
                <i className="fi fi-rr-box-open" />
                {storeProducts.length} produk
              </span>
            </div>
          </div>

          <div className="buyer-store-profile-actions">
            <button
              type="button"
              className={
                followed
                  ? "follow followed"
                  : "follow"
              }
              onClick={toggleFollow}
            >
              <i
                className={
                  followed
                    ? "fi fi-rr-user-check"
                    : "fi fi-rr-user-add"
                }
              />

              {followed
                ? "Mengikuti"
                : "Follow Toko"}
            </button>

            {store.whatsapp && (
              <button
                type="button"
                className="contact"
                onClick={openWhatsapp}
              >
                <i className="fi fi-brands-whatsapp" />
                Hubungi
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="buyer-store-information">
        <article>
          <div>
            <i className="fi fi-rr-marker" />
          </div>

          <span>
            <small>Alamat toko</small>
            <strong>
              {store.address ||
                "Alamat belum tersedia"}
            </strong>
          </span>
        </article>

        <article>
          <div>
            <i className="fi fi-rr-envelope" />
          </div>

          <span>
            <small>Email</small>
            <strong>
              {store.email ||
                "Email belum tersedia"}
            </strong>
          </span>
        </article>

        <article>
          <div>
            <i className="fi fi-rr-shield-check" />
          </div>

          <span>
            <small>Status toko</small>
            <strong>Reseller Terverifikasi</strong>
          </span>
        </article>
      </div>

      <header className="buyer-store-products-heading">
        <div>
          <span className="modern-eyebrow">
            KATALOG TOKO
          </span>

          <h2>Produk dari {store.name}</h2>

          <p>
            Pilih produk dan lakukan pembelian
            langsung dari toko ini.
          </p>
        </div>

        <span>
          {storeProducts.length} produk
        </span>
      </header>

      {storeProducts.length === 0 ? (
        <div className="buyer-store-products-empty">
          <div>
            <i className="fi fi-rr-box-open" />
          </div>

          <h3>Belum ada produk aktif</h3>

          <p>
            Reseller belum menerbitkan produk atau
            produk masih dalam proses peninjauan.
          </p>
        </div>
      ) : (
        <div className="buyer-store-product-grid">
          {storeProducts.map((product) => (
            <article key={product.id}>
              <div className="buyer-store-product-image">
                {product.thumbnailURL ||
                product.imageURL ? (
                  <img
                    src={
                      product.thumbnailURL ||
                      product.imageURL
                    }
                    alt={product.name}
                  />
                ) : (
                  <i
                    className={
                      product.icon ||
                      "fi fi-rr-box-open"
                    }
                  />
                )}
              </div>

              <div className="buyer-store-product-info">
                <span>
                  {product.category || "Digital"}
                </span>

                <h3>{product.name}</h3>

                <div>
                  <small>
                    <i className="fi fi-rr-star" />
                    {product.rating || "Baru"}
                  </small>

                  <small>
                    {product.sold || 0} terjual
                  </small>
                </div>

                <strong>
                  {typeof product.price === "number"
                    ? formatRupiah(product.price)
                    : product.price}
                </strong>
              </div>

              <div className="buyer-store-product-actions">
                <button
                  type="button"
                  className="detail"
                  onClick={() =>
                    openDetail(product)
                  }
                >
                  <i className="fi fi-rr-eye" />
                  Detail
                </button>

                <button
                  type="button"
                  className="cart"
                  onClick={() =>
                    addToCart(product)
                  }
                >
                  <i className="fi fi-rr-shopping-cart-add" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
