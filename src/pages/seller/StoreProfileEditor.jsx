import {
  useEffect,
  useState,
} from "react";

import {
  getMyStoreProfile,
  saveMyStoreProfile,
} from "../../services/storeProfileService";

export default function StoreProfileEditor({
  user,
}) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] =
    useState(true);
  const [saving, setSaving] =
    useState(false);
  const [message, setMessage] =
    useState("");
  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const profile =
          await getMyStoreProfile();

        setForm(profile);
      } catch (loadError) {
        console.error(
          "Profil toko gagal dimuat:",
          loadError
        );

        setError(
          loadError?.message ||
            "Profil toko gagal dimuat."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function updateField(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function saveProfile(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const saved =
        await saveMyStoreProfile(form);

      setForm((current) => ({
        ...current,
        ...saved,
      }));

      setMessage(
        "Profil toko berhasil disimpan dan sudah dapat dicari Buyer."
      );
    } catch (saveError) {
      console.error(
        "Profil toko gagal disimpan:",
        saveError
      );

      setError(
        saveError?.message ||
          "Profil toko gagal disimpan."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="store-profile-loading">
        <div className="buyer-loading-spinner" />
        <p>Memuat profil toko...</p>
      </section>
    );
  }

  if (!form) {
    return (
      <section className="store-profile-loading">
        <i className="fi fi-rr-exclamation" />
        <p>
          Profil toko belum dapat dibuka.
        </p>
      </section>
    );
  }

  return (
    <section className="seller-store-profile">
      <header className="seller-store-header">
        <div>
          <span className="modern-eyebrow">
            IDENTITAS TOKO
          </span>

          <h1>Profil Toko</h1>

          <p>
            Lengkapi identitas toko agar Buyer
            dapat menemukan dan mengikuti tokomu.
          </p>
        </div>

        <div className="seller-store-id-card">
          <i className="fi fi-rr-fingerprint" />

          <span>
            <small>ID Toko</small>
            <strong>{form.storeId}</strong>
          </span>
        </div>
      </header>

      {error && (
        <div className="seller-store-alert error">
          <i className="fi fi-rr-exclamation" />
          {error}
        </div>
      )}

      {message && (
        <div className="seller-store-alert success">
          <i className="fi fi-rr-check-circle" />
          {message}
        </div>
      )}

      <form
        className="seller-store-form"
        onSubmit={saveProfile}
      >
        <section className="seller-store-preview">
          <div className="seller-store-cover" />

          <div className="seller-store-preview-content">
            <div className="seller-store-logo-preview">
              {form.logoURL ? (
                <img
                  src={form.logoURL}
                  alt={form.storeName}
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              ) : (
                <span>
                  {form.storeName
                    ?.charAt(0)
                    ?.toUpperCase() || "T"}
                </span>
              )}
            </div>

            <div>
              <span>{form.storeId}</span>
              <h2>
                {form.storeName ||
                  "Nama Toko"}
              </h2>
              <p>
                {form.description ||
                  "Deskripsi toko akan tampil di sini."}
              </p>
            </div>
          </div>
        </section>

        <section className="seller-store-fields">
          <div className="seller-store-section-title">
            <div>
              <i className="fi fi-rr-shop" />
            </div>

            <span>
              <h2>Informasi Toko</h2>
              <p>
                Data ini akan terlihat oleh Buyer.
              </p>
            </span>
          </div>

          <div className="seller-store-form-grid">
            <label>
              <span>ID Toko</span>

              <div className="store-input readonly">
                <i className="fi fi-rr-fingerprint" />

                <input
                  value={form.storeId}
                  readOnly
                />
              </div>

              <small>
                ID dibuat otomatis dan digunakan
                Buyer untuk mencari toko.
              </small>
            </label>

            <label>
              <span>Nama Toko</span>

              <div className="store-input">
                <i className="fi fi-rr-shop" />

                <input
                  required
                  value={form.storeName || ""}
                  onChange={(event) =>
                    updateField(
                      "storeName",
                      event.target.value
                    )
                  }
                  placeholder="Contoh: Madhayana Creative"
                />
              </div>
            </label>

            <label>
              <span>Nama Pemilik</span>

              <div className="store-input">
                <i className="fi fi-rr-user" />

                <input
                  value={form.ownerName || ""}
                  onChange={(event) =>
                    updateField(
                      "ownerName",
                      event.target.value
                    )
                  }
                  placeholder="Nama reseller"
                />
              </div>
            </label>

            <label>
              <span>Email Toko</span>

              <div className="store-input">
                <i className="fi fi-rr-envelope" />

                <input
                  type="email"
                  value={form.email || ""}
                  onChange={(event) =>
                    updateField(
                      "email",
                      event.target.value
                    )
                  }
                  placeholder="email@toko.com"
                />
              </div>
            </label>

            <label>
              <span>Nomor WhatsApp</span>

              <div className="store-input">
                <i className="fi fi-brands-whatsapp" />

                <input
                  value={form.whatsapp || ""}
                  onChange={(event) =>
                    updateField(
                      "whatsapp",
                      event.target.value
                    )
                  }
                  placeholder="0812-3456-7890"
                />
              </div>
            </label>

            <label>
              <span>Alamat Singkat</span>

              <div className="store-input">
                <i className="fi fi-rr-marker" />

                <input
                  value={form.address || ""}
                  onChange={(event) =>
                    updateField(
                      "address",
                      event.target.value
                    )
                  }
                  placeholder="Jl. Melati No. 10"
                />
              </div>
            </label>

            <label className="full">
              <span>URL Logo Toko</span>

              <div className="store-input">
                <i className="fi fi-rr-picture" />

                <input
                  value={form.logoURL || ""}
                  onChange={(event) =>
                    updateField(
                      "logoURL",
                      event.target.value
                    )
                  }
                  placeholder="https://..."
                />
              </div>
            </label>

            <label className="full">
              <span>Deskripsi Toko</span>

              <textarea
                value={form.description || ""}
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value
                  )
                }
                placeholder="Jelaskan produk dan layanan tokomu..."
                maxLength={240}
              />

              <small>
                {(form.description || "").length}/240
                karakter
              </small>
            </label>
          </div>

          <button
            type="submit"
            className="seller-store-save"
            disabled={saving}
          >
            <i
              className={
                saving
                  ? "fi fi-rr-spinner"
                  : "fi fi-rr-disk"
              }
            />

            {saving
              ? "Menyimpan..."
              : "Simpan Profil Toko"}
          </button>
        </section>
      </form>
    </section>
  );
}
