import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { getResellerStores } from "../../services/storeService";

const FOLLOW_STORAGE_KEY =
  "madhayana_followed_stores";

export default function BuyerStores({
  onOpenStore,
}) {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState("");

  const [followedStores, setFollowedStores] =
    useState(() => {
      try {
        return JSON.parse(
          localStorage.getItem(
            FOLLOW_STORAGE_KEY
          )
        ) || [];
      } catch {
        return [];
      }
    });

  useEffect(() => {
    async function loadStores() {
      try {
        setLoading(true);
        setError("");

        const result =
          await getResellerStores();

        setStores(result);
      } catch (loadError) {
        console.error(
          "Toko gagal dimuat:",
          loadError
        );

        setError(
          "Daftar toko belum dapat dimuat."
        );
      } finally {
        setLoading(false);
      }
    }

    loadStores();
  }, []);

  const filteredStores = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    if (!keyword) {
      return [];
    }

    return stores.filter((store) => {
      const storeId = String(
        store.storeId || ""
      )
        .trim()
        .toLowerCase();

      const storeName = String(
        store.name || ""
      )
        .trim()
        .toLowerCase();

      return (
        storeId.includes(keyword) ||
        storeName.includes(keyword)
      );
    });
  }, [stores, search]);

  function toggleFollow(storeId) {
    setFollowedStores((current) => {
      const next = current.includes(storeId)
        ? current.filter(
            (id) => id !== storeId
          )
        : [...current, storeId];

      localStorage.setItem(
        FOLLOW_STORAGE_KEY,
        JSON.stringify(next)
      );

      return next;
    });
  }

  return (
    <section className="buyer-store-page">
      <header className="buyer-store-header">
        <div>
          <span className="modern-eyebrow">
            TEMUKAN RESELLER
          </span>
          <h1>Cari Toko</h1>
          <p>
            Temukan toko, ikuti reseller,
            dan beli produk langsung dari
            profil toko.
          </p>
        </div>

        <label className="buyer-store-search">
          <i className="fi fi-rr-search" />
          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Cari ID toko, nama toko, atau reseller..."
          />
        </label>
      </header>

      {loading && (
        <div className="buyer-store-state">
          <div className="buyer-loading-spinner" />
          <p>Memuat daftar toko...</p>
        </div>
      )}

      {error && (
        <div className="buyer-store-state error">
          <i className="fi fi-rr-exclamation" />
          <p>{error}</p>
        </div>
      )}

      {!loading &&
        !error &&
        !search.trim() && (
          <div className="buyer-store-state">
            <i className="fi fi-rr-search" />
            <h3>Cari toko terlebih dahulu</h3>
            <p>
              Masukkan ID toko, nama toko,
              atau nama reseller pada kolom pencarian.
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        search.trim() &&
        filteredStores.length === 0 && (
          <div className="buyer-store-state">
            <i className="fi fi-rr-search-alt" />
            <h3>Toko tidak ditemukan</h3>
            <p>
              Tidak ada toko yang cocok dengan
              pencarian "{search.trim()}".
            </p>
          </div>
        )}

      <div className="buyer-store-grid">
        {filteredStores.map((store) => {
          const isFollowed =
            followedStores.includes(store.id);

          return (
            <article key={store.id}>
              <div className="buyer-store-logo">
                {store.photoURL ? (
                  <img
                    src={store.photoURL}
                    alt={store.name}
                  />
                ) : (
                  <span>
                    {store.name
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                )}
              </div>

              <div className="buyer-store-info">
                <span className="buyer-store-public-id">
                  <i className="fi fi-rr-fingerprint" />
                  {store.storeId}
                </span>

                <h3>{store.name}</h3>
                <p>{store.ownerName}</p>

                <div>
                  <span>
                    <i className="fi fi-rr-star" />
                    {store.rating || "Baru"}
                  </span>

                  <span>
                    <i className="fi fi-rr-users" />
                    {store.followers}
                  </span>
                </div>
              </div>

              <div className="buyer-store-actions">
                <button
                  type="button"
                  className={
                    isFollowed
                      ? "followed"
                      : ""
                  }
                  onClick={() =>
                    toggleFollow(store.id)
                  }
                >
                  <i
                    className={
                      isFollowed
                        ? "fi fi-rr-user-check"
                        : "fi fi-rr-user-add"
                    }
                  />
                  {isFollowed
                    ? "Mengikuti"
                    : "Follow"}
                </button>

                <button
                  type="button"
                  className="visit"
                  onClick={() =>
                    onOpenStore(store)
                  }
                >
                  <i className="fi fi-rr-shop" />
                  Kunjungi Toko
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
