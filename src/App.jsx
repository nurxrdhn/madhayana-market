import React, { useEffect, useMemo, useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import "@flaticon/flaticon-uicons/css/all/all.css";
import "./styles/globals.css";
import useProducts from "./hooks/useProducts";
import ExcelReceiptStudio from "./pages/seller/ExcelReceiptStudio";
import BuyerReceiptModal from "./pages/buyer/BuyerReceiptModal";
import BuyerStores from "./pages/buyer/BuyerStores";
import BuyerStoreProfile from "./pages/buyer/BuyerStoreProfile";
import { getPlatformReceiptTemplate } from "./services/receiptTemplateCloudService";

const slides = [
  {
    icon: "fi fi-rr-store-alt",
    label: "MADHAYANA MARKET",
    title: "Satu ekosistem untuk seluruh kebutuhan digital",
    description:
      "Temukan perangkat lunak, lisensi, template, kursus, jasa, dan produk digital pilihan dalam satu platform.",
  },
  {
    icon: "fi fi-rr-shield-check",
    label: "TRANSAKSI TERLINDUNGI",
    title: "Belanja lebih aman dengan perlindungan transaksi",
    description:
      "Pembayaran, pesanan, invoice, dan riwayat transaksi tercatat sehingga pembeli dan penjual mendapat perlindungan.",
  },
  {
    icon: "fi fi-rr-bolt",
    label: "CEPAT DAN PRAKTIS",
    title: "Produk digital dapat diterima lebih cepat",
    description:
      "File, lisensi, dan informasi pesanan dapat dikirim secara otomatis setelah pembayaran berhasil diverifikasi.",
  },
  {
    icon: "fi fi-rr-shop",
    label: "TUMBUH BERSAMA",
    title: "Bangun dan kembangkan toko digitalmu",
    description:
      "Reseller dapat mengelola produk, pesanan, promosi, pendapatan, serta performa toko melalui satu dashboard.",
  },
  {
    icon: "fi fi-rr-users-alt",
    label: "MULAI SEKARANG",
    title: "Pilih cara kamu menggunakan Madhayana",
    description:
      "Masuk sebagai buyer, reseller, operator, atau jelajahi produk terlebih dahulu sebagai guest.",
  },
];

const roles = [
  {
    key: "buyer",
    title: "Buyer",
    code: "BYR",
    icon: "fi fi-rr-shopping-bag",
    description: "Belanja, simpan produk favorit, dan kelola pesanan.",
    className: "buyer",
  },
  {
    key: "reseller",
    title: "Reseller",
    code: "RSL",
    icon: "fi fi-rr-shop",
    description: "Jual produk dan kelola perkembangan toko digital.",
    className: "reseller",
  },
  {
    key: "operator",
    title: "Operator",
    code: "OPR",
    icon: "fi fi-rr-headset",
    description: "Mengelola aktivitas dan operasional Madhayana Market.",
    className: "operator",
  },
  {
    key: "guest",
    title: "Guest",
    code: "GST",
    icon: "fi fi-rr-eye",
    description: "Jelajahi marketplace tanpa harus membuat akun.",
    className: "guest",
  },
];

const dashboardData = {
  buyer: {
    title: "Beranda Buyer",
    subtitle: "Temukan produk digital terbaik untuk kebutuhanmu.",
    icon: "fi fi-rr-shopping-bag",
    menus: [
      ["fi fi-rr-home", "Beranda"],
      ["fi fi-rr-box", "Pesanan"],
      ["fi fi-rr-heart", "Favorit"],
      ["fi fi-rr-download", "Unduhan"],
      ["fi fi-rr-coins", "Koin"],
      ["fi fi-rr-user", "Profil"],
    ],
    stats: [
      ["Pesanan aktif", "3", "fi fi-rr-box"],
      ["Madhayana Coin", "1.250", "fi fi-rr-coins"],
      ["Produk favorit", "12", "fi fi-rr-heart"],
    ],
  },
  reseller: {
    title: "Dashboard Reseller",
    subtitle: "Kelola penjualan dan perkembangan tokomu.",
    icon: "fi fi-rr-shop",
    menus: [
      ["fi fi-rr-home", "Ringkasan"],
      ["fi fi-rr-box-open", "Produk"],
      ["fi fi-rr-shopping-cart", "Pesanan"],
      ["fi fi-rr-chart-line-up", "Statistik"],
      ["fi fi-rr-wallet", "Saldo"],
      ["fi fi-rr-user", "Profil Toko"],
    ],
    stats: [
      ["Penjualan bulan ini", "Rp12,8 jt", "fi fi-rr-chart-histogram"],
      ["Pesanan baru", "18", "fi fi-rr-shopping-cart"],
      ["Saldo tersedia", "Rp4,6 jt", "fi fi-rr-wallet"],
    ],
  },
  operator: {
    title: "Pusat Operasional",
    subtitle: "Pantau dan kelola aktivitas marketplace.",
    icon: "fi fi-rr-headset",
    menus: [
      ["fi fi-rr-home", "Ringkasan"],
      ["fi fi-rr-check-circle", "Verifikasi Produk"],
      ["fi fi-rr-receipt", "Transaksi"],
      ["fi fi-rr-users-alt", "Pengguna"],
      ["fi fi-rr-wallet", "Settlement"],
      ["fi fi-rr-comment-alt", "Tiket Bantuan"],
    ],
    stats: [
      ["Produk menunggu", "24", "fi fi-rr-box"],
      ["Transaksi diproses", "128", "fi fi-rr-receipt"],
      ["Tiket terbuka", "17", "fi fi-rr-comment-alt"],
    ],
  },
  guest: {
    title: "Jelajahi Madhayana",
    subtitle: "Lihat produk terlebih dahulu sebelum bertransaksi.",
    icon: "fi fi-rr-eye",
    menus: [
      ["fi fi-rr-home", "Beranda"],
      ["fi fi-rr-apps", "Kategori"],
      ["fi fi-rr-sparkles", "Produk Baru"],
      ["fi fi-rr-flame", "Terlaris"],
      ["fi fi-rr-info", "Tentang"],
    ],
    stats: [
      ["Produk digital", "2.480+", "fi fi-rr-apps"],
      ["Seller aktif", "460+", "fi fi-rr-shop"],
      ["Kategori", "18", "fi fi-rr-grid"],
    ],
  },
};

const products = [
  {
    name: "Premium React Dashboard",
    category: "Template",
    price: "Rp150.000",
    icon: "fi fi-rr-layout-fluid",
  },
  {
    name: "Lisensi Aplikasi Kasir",
    category: "Software",
    price: "Rp490.000",
    icon: "fi fi-rr-computer",
  },
  {
    name: "Paket Branding UMKM",
    category: "Desain",
    price: "Rp275.000",
    icon: "fi fi-rr-palette",
  },
  {
    name: "Kursus Digital Marketing",
    category: "Kursus",
    price: "Rp119.000",
    icon: "fi fi-rr-graduation-cap",
  },
];

function GoogleLogo() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.7-3.3-11.3-7.9l-6.5 5C9.5 39.4 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.2-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

function Brand() {
  return (
    <div className="modern-brand">
      <div className="modern-brand-logo">M</div>
      <div>
        <strong>MADHAYANA</strong>
        <span>MARKET</span>
      </div>
    </div>
  );
}

function MadhayanaApp() {
  const {
    user,
    loading,
    login,
    register,
    loginGoogle,
    enterAsGuest,
    logout,
  } = useAuth();

  const [page, setPage] = useState(() =>
    localStorage.getItem("madhayana_intro_done") ? "roles" : "opening"
  );
  const [slide, setSlide] = useState(0);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showExcelStudio, setShowExcelStudio] = useState(false);

  useEffect(() => {
    if (user) setPage("dashboard");
  }, [user]);

  if (loading) {
    return (
      <main className="modern-loading">
        <div className="modern-loading-logo">M</div>
        <strong>Menyiapkan Madhayana Market</strong>
      </main>
    );
  }

  if (page === "opening") {
    const active = slides[slide];

    return (
      <main className="modern-opening">
        <div className="modern-orb orb-one" />
        <div className="modern-orb orb-two" />

        <header className="modern-topbar">
          <Brand />
          <button
            className="modern-text-button"
            onClick={() => {
              localStorage.setItem("madhayana_intro_done", "1");
              setPage("roles");
            }}
          >
            Lewati
          </button>
        </header>

        <section className="modern-opening-card">
          <div className="modern-opening-visual">
            <div className="modern-opening-icon">
              <i className={active.icon} />
            </div>
            <span>0{slide + 1}</span>
          </div>

          <div className="modern-opening-content">
            <span className="modern-eyebrow">{active.label}</span>
            <h1>{active.title}</h1>
            <p>{active.description}</p>

            <div className="modern-dots">
              {slides.map((item, index) => (
                <button
                  key={item.title}
                  className={index === slide ? "active" : ""}
                  onClick={() => setSlide(index)}
                />
              ))}
            </div>

            <div className="modern-opening-actions">
              <button
                className="modern-button secondary"
                disabled={slide === 0}
                onClick={() => setSlide((current) => current - 1)}
              >
                <i className="fi fi-rr-arrow-left" />
                Kembali
              </button>

              <button
                className="modern-button primary"
                onClick={() => {
                  if (slide === slides.length - 1) {
                    localStorage.setItem("madhayana_intro_done", "1");
                    setPage("roles");
                  } else {
                    setSlide((current) => current + 1);
                  }
                }}
              >
                {slide === slides.length - 1 ? "Mulai Sekarang" : "Selanjutnya"}
                <i className="fi fi-rr-arrow-right" />
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (page === "roles") {
    return (
      <main className="modern-role-page">
        <header className="modern-topbar">
          <Brand />
          <button
            className="modern-text-button"
            onClick={() => {
              localStorage.removeItem("madhayana_intro_done");
              setSlide(0);
              setPage("opening");
            }}
          >
            Putar ulang perkenalan
          </button>
        </header>

        <section className="modern-role-section">
          <div className="modern-heading">
            <span className="modern-eyebrow">PILIH JENIS AKSES</span>
            <h1>Kamu ingin masuk sebagai apa?</h1>
            <p>
              Tampilan, menu, dan fitur akan disesuaikan berdasarkan jenis
              pengguna yang dipilih.
            </p>
          </div>

          <div className="modern-role-grid">
            {roles.map((role) => (
              <button
                key={role.key}
                className={`modern-role-card ${role.className}`}
                onClick={() => {
                  if (role.key === "guest") {
                    enterAsGuest();
                    setPage("dashboard");
                  } else {
                    setSelectedRole(role);
                    setPage("auth");
                  }
                }}
              >
                <div className="modern-role-icon">
                  <i className={role.icon} />
                </div>

                <div className="modern-role-content">
                  <div>
                    <h2>{role.title}</h2>
                    <span>{role.code}</span>
                  </div>
                  <p>{role.description}</p>
                </div>

                <i className="fi fi-rr-arrow-up-right modern-role-arrow" />
              </button>
            ))}
          </div>

          <div className="modern-security-note">
            <i className="fi fi-rr-shield-check" />
            Operator tidak dapat mendaftar sendiri. Akun operator hanya dibuat
            oleh Super Admin.
          </div>
        </section>
      </main>
    );
  }

  if (page === "auth" && selectedRole) {
    return (
      <AuthPage
        role={selectedRole}
        login={login}
        register={register}
        loginGoogle={loginGoogle}
        onBack={() => setPage("roles")}
      />
    );
  }

  if (
    page === "dashboard" &&
    user &&
    user.role === "reseller" &&
    showExcelStudio
  ) {
    return (
      <ExcelReceiptStudio
        user={user}
        onBack={() =>
          setShowExcelStudio(false)
        }
      />
    );
  }

  if (page === "dashboard" && user) {
    return (
      <Dashboard
        user={user}
        onOpenExcelStudio={() =>
          setShowExcelStudio(true)
        }
        onLogout={async () => {
          await logout();
          setPage("roles");
        }}
      />
    );
  }

  return null;
}

function AuthPage({ role, login, register, loginGoogle, onBack }) {
  const operatorMode = role.key === "operator";
  const [mode, setMode] = useState(operatorMode ? "login" : "register");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const update = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (mode === "register" && form.password !== form.confirmPassword) {
      setMessage("Konfirmasi kata sandi tidak sama.");
      return;
    }

    try {
      setLoading(true);

      if (mode === "register") {
        await register({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: role.key,
        });
      } else {
        const profile = await login({
          email: form.email,
          password: form.password,
        });

        if (operatorMode && profile.role !== "operator") {
          throw new Error("Akun ini bukan akun operator.");
        }
      }
    } catch (error) {
      console.error("AUTH ERROR:", error);

      const firebaseMessages = {
        "auth/invalid-credential": "Email atau kata sandi tidak sesuai.",
        "auth/email-already-in-use": "Email tersebut sudah terdaftar.",
        "auth/popup-closed-by-user": "Jendela login Google ditutup.",
        "auth/popup-blocked": "Popup Google diblokir oleh browser.",
        "auth/unauthorized-domain": "Domain belum diizinkan di Firebase.",
        "auth/operation-not-allowed": "Metode login belum diaktifkan di Firebase.",
        "permission-denied": "Firestore menolak penyimpanan profil pengguna.",
      };

      setMessage(
        firebaseMessages[error.code] ||
        `${error.code || "error"}: ${error.message || "Proses autentikasi gagal."}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      setMessage("");
      await loginGoogle(role.key);
    } catch (error) {
      console.error("GOOGLE AUTH ERROR:", error);

      const firebaseMessages = {
        "auth/popup-closed-by-user": "Jendela login Google ditutup.",
        "auth/popup-blocked": "Popup Google diblokir oleh browser.",
        "auth/unauthorized-domain": "Domain belum diizinkan di Firebase.",
        "auth/operation-not-allowed": "Login Google belum diaktifkan di Firebase.",
        "permission-denied": "Login berhasil, tetapi Firestore menolak penyimpanan profil.",
      };

      setMessage(
        firebaseMessages[error.code] ||
        `${error.code || "error"}: ${error.message || "Login Google gagal."}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`modern-auth-page auth-${role.className}`}>
      <section className="modern-auth-visual">
        <button className="modern-back-button" onClick={onBack}>
          <i className="fi fi-rr-arrow-left" />
          Kembali
        </button>

        <div>
          <div className="modern-auth-role-icon">
            <i className={role.icon} />
          </div>
          <span className="modern-eyebrow">PORTAL {role.title.toUpperCase()}</span>
          <h1>
            {operatorMode
              ? "Kelola operasional Madhayana Market"
              : role.key === "reseller"
                ? "Bangun toko digitalmu bersama Madhayana"
                : "Nikmati pengalaman belanja digital yang lebih praktis"}
          </h1>
          <p>{role.description}</p>

          <div className="modern-auth-features">
            <span>
              <i className="fi fi-rr-check-circle" />
              Dashboard khusus berdasarkan peran
            </span>
            <span>
              <i className="fi fi-rr-check-circle" />
              Sistem autentikasi menggunakan Firebase
            </span>
            <span>
              <i className="fi fi-rr-check-circle" />
              Data akun tersimpan secara aman
            </span>
          </div>
        </div>
      </section>

      <section className="modern-auth-form-area">
        <form className="modern-auth-card" onSubmit={submit}>
          <Brand />

          <span className="modern-eyebrow">
            {mode === "register" ? "BUAT AKUN BARU" : "SELAMAT DATANG"}
          </span>

          <h2>
            {mode === "register"
              ? `Daftar sebagai ${role.title}`
              : `Masuk sebagai ${role.title}`}
          </h2>

          <p>
            {operatorMode
              ? "Gunakan akun operator yang telah diberikan oleh Super Admin."
              : "Gunakan email atau lanjutkan menggunakan akun Google."}
          </p>

          {!operatorMode && (
            <>
              <button
                type="button"
                className="modern-google-button"
                onClick={handleGoogle}
                disabled={loading}
              >
                <GoogleLogo />
                {mode === "register"
                  ? "Daftar dengan Google"
                  : "Masuk dengan Google"}
              </button>

              <div className="modern-divider">
                <span>atau gunakan email</span>
              </div>
            </>
          )}

          {mode === "register" && (
            <ModernInput
              icon="fi fi-rr-user"
              label="Nama lengkap"
              name="name"
              value={form.name}
              onChange={update}
              placeholder="Masukkan nama lengkap"
            />
          )}

          <ModernInput
            icon="fi fi-rr-envelope"
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={update}
            placeholder="nama@gmail.com"
          />

          {mode === "register" && (
            <ModernInput
              icon="fi fi-rr-phone-call"
              label="Nomor WhatsApp"
              name="phone"
              value={form.phone}
              onChange={update}
              placeholder="08xxxxxxxxxx"
            />
          )}

          <ModernInput
            icon="fi fi-rr-lock"
            label="Kata sandi"
            name="password"
            type="password"
            value={form.password}
            onChange={update}
            placeholder="Minimal 6 karakter"
          />

          {mode === "register" && (
            <ModernInput
              icon="fi fi-rr-lock"
              label="Konfirmasi kata sandi"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={update}
              placeholder="Ulangi kata sandi"
            />
          )}

          {message && <div className="modern-error">{message}</div>}

          <button
            type="submit"
            className="modern-button primary full"
            disabled={loading}
          >
            {loading
              ? "Memproses..."
              : mode === "register"
                ? "Daftar dan Buka Beranda"
                : "Masuk ke Beranda"}
            <i className="fi fi-rr-arrow-right" />
          </button>

          {!operatorMode && (
            <button
              type="button"
              className="modern-switch-auth"
              onClick={() =>
                setMode((current) =>
                  current === "register" ? "login" : "register"
                )
              }
            >
              {mode === "register"
                ? "Sudah mempunyai akun? Masuk sekarang"
                : `Belum mempunyai akun? Daftar sebagai ${role.title}`}
            </button>
          )}

          {operatorMode && (
            <div className="modern-operator-note">
              <i className="fi fi-rr-shield-check" />
              Akun operator hanya dibuat oleh Super Admin.
            </div>
          )}
        </form>
      </section>
    </main>
  );
}

function ModernInput({
  icon,
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <label className="modern-field">
      <span>{label}</span>
      <div>
        <i className={icon} />
        <input
          required
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    </label>
  );
}


function Dashboard({
  user,
  onLogout,
  onOpenExcelStudio,
}) {
  const role = user.role || "buyer";

  if (role === "buyer") {
    return <BuyerDashboard user={user} onLogout={onLogout} />;
  }

  return (
    <RoleDashboard
      role={role}
      user={user}
      onLogout={onLogout}
      onOpenExcelStudio={onOpenExcelStudio}
    />
  );
}

function BuyerDashboard({ user, onLogout }) {
  const menuItems = [
    ["fi fi-rr-home", "Beranda"],
    ["fi fi-rr-shop", "Toko"],
    ["fi fi-rr-box", "Pesanan"],
    ["fi fi-rr-heart", "Favorit"],
    ["fi fi-rr-shopping-cart", "Keranjang"],
    ["fi fi-rr-download", "Unduhan"],
    ["fi fi-rr-coins", "Koin"],
    ["fi fi-rr-user", "Profil"],
  ];

  const [activeMenu, setActiveMenu] = useState("Beranda");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [coin, setCoin] = useState(Number(user.coin || 1250));

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("madhayana_buyer_favorites")
      ) || [];
    } catch {
      return [];
    }
  });

  const [profileForm, setProfileForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
  });

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("madhayana_buyer_cart")
      ) || [];
    } catch {
      return [];
    }
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
const [selectedStore,setSelectedStore]=useState(null);
  const [generatedReceipt, setGeneratedReceipt] = useState(null);

  const {
    products: firestoreProducts,
    productsLoading,
    productsError,
  } = useProducts();

  const staticProducts = products.map((product, index) => ({
    ...product,
    id: `demo-product-${index + 1}`,
    numericPrice: Number(
      String(product.price)
        .replace("Rp", "")
        .replaceAll(".", "")
        .replaceAll(" ", "")
    ),
    rating: 4.9,
    sold: [128, 92, 64, 207][index],
    isDemo: true,
  }));

  const buyerProducts =
    firestoreProducts.length > 0
      ? firestoreProducts.map((product) => ({
          ...product,
          price:
            typeof product.price === "number"
              ? formatRupiah(product.price)
              : product.price,
          numericPrice:
            typeof product.price === "number"
              ? product.price
              : parsePrice(product.price),
          rating: Number(product.rating || 0),
          sold: Number(product.sold || 0),
          icon:
            product.icon ||
            "fi fi-rr-box-open",
        }))
      : staticProducts;

  const orders = [
    {
      id: "ORD-2026-00182",
      product: "Premium React Dashboard",
      date: "13 Juli 2026",
      total: "Rp150.000",
      status: "Selesai",
    },
    {
      id: "ORD-2026-00156",
      product: "Lisensi Aplikasi Kasir",
      date: "10 Juli 2026",
      total: "Rp490.000",
      status: "Diproses",
    },
    {
      id: "ORD-2026-00131",
      product: "Kursus Digital Marketing",
      date: "7 Juli 2026",
      total: "Rp119.000",
      status: "Menunggu pembayaran",
    },
  ];

  const downloads = [
    {
      id: "download-1",
      name: "Premium React Dashboard Demo",
      type: "TXT",
      size: "1 KB",
      icon: "fi fi-rr-layout-fluid",
      url: "/downloads/premium-react-dashboard-demo.txt",
      filename: "premium-react-dashboard-demo.txt",
    },
    {
      id: "download-2",
      name: "Invoice ORD-2026-00182",
      type: "TXT",
      size: "1 KB",
      icon: "fi fi-rr-file-invoice",
      url: "/downloads/invoice-ord-2026-00182.txt",
      filename: "invoice-ord-2026-00182.txt",
    },
  ];

  const filteredProducts = buyerProducts.filter((product) => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return true;

    return (
      product.name.toLowerCase().includes(keyword) ||
      product.category.toLowerCase().includes(keyword)
    );
  });

  const favoriteProducts = buyerProducts.filter((product) =>
    favorites.includes(product.id)
  );

  const firstName =
    profileForm.name?.trim().split(" ")[0] || "Buyer";

  const showNotice = (message) => {
    setNotice(message);

    window.setTimeout(() => {
      setNotice("");
    }, 2800);
  };

  const toggleFavorite = (productId) => {
    setFavorites((current) => {
      const next = current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId];

      localStorage.setItem(
        "madhayana_buyer_favorites",
        JSON.stringify(next)
      );

      return next;
    });
  };

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find(
        (item) => item.id === product.id
      );

      const next = existing
        ? current.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item
          )
        : [
            ...current,
            {
              ...product,
              quantity: 1,
            },
          ];

      localStorage.setItem(
        "madhayana_buyer_cart",
        JSON.stringify(next)
      );

      return next;
    });

    showNotice(`${product.name} masuk ke keranjang.`);
  };

  const updateCartQuantity = (productId, amount) => {
    setCart((current) => {
      const next = current
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: Math.max(
                  0,
                  item.quantity + amount
                ),
              }
            : item
        )
        .filter((item) => item.quantity > 0);

      localStorage.setItem(
        "madhayana_buyer_cart",
        JSON.stringify(next)
      );

      return next;
    });
  };

  const removeFromCart = (productId) => {
    setCart((current) => {
      const next = current.filter(
        (item) => item.id !== productId
      );

      localStorage.setItem(
        "madhayana_buyer_cart",
        JSON.stringify(next)
      );

      return next;
    });

    showNotice("Produk dihapus dari keranjang.");
  };

  const saveProfile = (event) => {
    event.preventDefault();

    localStorage.setItem(
      "madhayana_buyer_profile",
      JSON.stringify(profileForm)
    );

    showNotice("Perubahan profil berhasil disimpan.");
  };

  const addCoin = (amount) => {
    setCoin((current) => current + amount);
    showNotice(`${amount.toLocaleString("id-ID")} koin berhasil ditambahkan.`);
  };

  return (
    <main className="modern-dashboard dashboard-buyer">
      {notice && (
        <div className="buyer-toast">
          <i className="fi fi-rr-check-circle" />
          {notice}
        </div>
      )}

      <header className="modern-dashboard-header">
        <Brand />

        <div className="modern-dashboard-search">
          <i className="fi fi-rr-search" />

          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);

              if (activeMenu !== "Beranda") {
                setActiveMenu("Beranda");
              }
            }}
            placeholder="Cari produk, software, jasa, atau kursus..."
          />
        </div>

        <div className="modern-dashboard-actions">
          <button
            type="button"
            onClick={() =>
              showNotice("Belum ada notifikasi baru.")
            }
          >
            <i className="fi fi-rr-bell" />
          </button>

          <div className="modern-profile">
            <div className="modern-avatar">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={profileForm.name}
                />
              ) : (
                firstName.charAt(0).toUpperCase()
              )}
            </div>

            <div>
              <strong>{profileForm.name || "Buyer"}</strong>
              <span>Buyer</span>
            </div>
          </div>
        </div>
      </header>

      <div className="modern-dashboard-layout">
        <aside className="modern-sidebar">
          <div className="modern-role-badge">
            <i className="fi fi-rr-shopping-bag" />
            <span>Buyer</span>
          </div>

          <nav>
            {menuItems.map(([icon, label]) => (
              <button
                type="button"
                key={label}
                className={
                  activeMenu === label ? "active" : ""
                }
                onClick={() => {
                  setActiveMenu(label);

                  if (label !== "Toko") {
                    setSelectedStore(null);
                  }
                }}
              >
                <i className={icon} />
                {label}

                {label === "Favorit" &&
                  favorites.length > 0 && (
                    <small>{favorites.length}</small>
                  )}

                {label === "Keranjang" &&
                  cart.length > 0 && (
                    <small>
                      {cart.reduce(
                        (total, item) =>
                          total + item.quantity,
                        0
                      )}
                    </small>
                  )}
              </button>
            ))}
          </nav>

          <button
            type="button"
            className="modern-logout"
            onClick={onLogout}
          >
            <i className="fi fi-rr-sign-out-alt" />
            Keluar
          </button>
        </aside>

        <section className="modern-main-content">
          {activeMenu === "Toko" && (
            selectedStore ? (
              <BuyerStoreProfile
                store={selectedStore}
                products={buyerProducts}
                onBack={() =>
                  setSelectedStore(null)
                }
                addToCart={addToCart}
                openDetail={
                  setSelectedProduct
                }
              />
            ) : (
              <BuyerStores
                onOpenStore={(store) => {
                  setSelectedStore(store);
                  showNotice(
                    `Membuka toko ${store.name}.`
                  );
                }}
              />
            )
          )}

          {activeMenu === "Beranda" && (
            <BuyerHome
              firstName={firstName}
              products={filteredProducts}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              setActiveMenu={setActiveMenu}
              coin={coin}
              orders={orders}
              showNotice={showNotice}
              search={search}
              addToCart={addToCart}
              openDetail={setSelectedProduct}
              productsLoading={productsLoading}
              productsError={productsError}
            />
          )}

          {activeMenu === "Pesanan" && (
            <BuyerOrders
              orders={orders}
              showNotice={showNotice}
            />
          )}

          {activeMenu === "Favorit" && (
            <BuyerFavorites
              products={favoriteProducts}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              setActiveMenu={setActiveMenu}
              showNotice={showNotice}
            />
          )}

          {activeMenu === "Keranjang" && (
            <BuyerCart
              cart={cart}
              updateQuantity={updateCartQuantity}
              removeFromCart={removeFromCart}
              openCheckout={() => setShowCheckout(true)}
              setActiveMenu={setActiveMenu}
            />
          )}

          {activeMenu === "Unduhan" && (
            <BuyerDownloads
              downloads={downloads}
              showNotice={showNotice}
            />
          )}

          {activeMenu === "Koin" && (
            <BuyerCoins
              coin={coin}
              addCoin={addCoin}
            />
          )}

          {activeMenu === "Profil" && (
            <BuyerProfile
              form={profileForm}
              setForm={setProfileForm}
              saveProfile={saveProfile}
              user={user}
            />
          )}
        </section>
      </div>

      {selectedProduct && (
        <BuyerProductModal
          product={selectedProduct}
          favorite={favorites.includes(
            selectedProduct.id
          )}
          toggleFavorite={toggleFavorite}
          addToCart={addToCart}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {showCheckout && (
        <BuyerCheckoutModal
          cart={cart}
          onClose={() => setShowCheckout(false)}
          onContinue={async (paymentMethod) => {
            let template;

            try {
              template =
                await getPlatformReceiptTemplate();
            } catch (templateError) {
              console.error(
                "Template Firestore gagal dibaca:",
                templateError
              );

              showNotice(
                "Template struk gagal dibaca dari server."
              );
              return;
            }

            if (!template) {
              showNotice(
                "Template default reseller belum tersedia."
              );
              return;
            }

            const now = new Date();

            const orderNumber =
              `ORD-${now.getFullYear()}${String(
                now.getMonth() + 1
              ).padStart(2, "0")}${String(
                now.getDate()
              ).padStart(2, "0")}-${String(
                now.getTime()
              ).slice(-6)}`;

            const grossTotal = cart.reduce(
              (sum, item) =>
                sum +
                parsePrice(item.price) *
                  item.quantity,
              0
            );

            const discount = 0;
            const adminFee = 1000;
            const finalTotal =
              grossTotal - discount + adminFee;

            const templateData =
              template.data || {};

            setGeneratedReceipt({
              sellerName:
                templateData.NAMA_RESELLER ||
                template.sellerName ||
                "Madhayana Reseller",

              sellerAddress:
                templateData.ALAMAT_RESELLER ||
                "Alamat reseller",

              sellerContact:
                templateData.KONTAK_RESELLER ||
                "Kontak reseller",

              logoURL:
                templateData.LOGO_RESELLER || "",

              buyerName:
                user.name ||
                user.displayName ||
                "Buyer Madhayana",

              buyerId:
                user.userCode ||
                user.id ||
                user.uid ||
                `BYR-${String(
                  now.getTime()
                ).slice(-8)}`,

              buyerEmail:
                user.email || "-",

              orderNumber,

              invoiceNumber:
                orderNumber.replace(
                  "ORD-",
                  "INV-"
                ),

              transactionId:
                `TRX-${String(
                  now.getTime()
                ).slice(-10)}`,

              date:
                now.toLocaleDateString(
                  "id-ID",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }
                ),

              time:
                `${now.toLocaleTimeString(
                  "id-ID",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  }
                )} WIB`,

              paymentMethod,
              items: cart.map((item) => ({
                id: item.id,
                name: item.name,
                icon: item.icon,
                quantity: item.quantity,
                unitPrice:
                  parsePrice(item.price),
                subtotal:
                  parsePrice(item.price) *
                  item.quantity,
              })),

              grossTotal,
              discount,
              adminFee,
              finalTotal,

              thankYou:
                templateData
                  .UCAPAN_TERIMA_KASIH ||
                "Terima kasih telah berbelanja di Madhayana Market.",

              notice:
                templateData.HIMBAUAN ||
                "Simpan bukti pembelian ini apabila diperlukan.",

              orderURL:
                `https://madhayana.com/order/${orderNumber}`,
            });

            setShowCheckout(false);
            setCart([]);
            localStorage.removeItem(
              "madhayana_buyer_cart"
            );

            showNotice(
              "Pesanan berhasil dibuat."
            );
          }}
        />
      )}

      {generatedReceipt && (
        <BuyerReceiptModal
          receipt={generatedReceipt}
          onClose={() =>
            setGeneratedReceipt(null)
          }
        />
      )}
    </main>
  );
}

function BuyerHome({
  firstName,
  products,
  favorites,
  toggleFavorite,
  setActiveMenu,
  coin,
  orders,
  showNotice,
  search,
  addToCart,
  openDetail,
  productsLoading,
  productsError,
}) {
  return (
    <>
      <div className="modern-dashboard-hero">
        <div>
          <span className="modern-eyebrow">
            BUYER DASHBOARD
          </span>

          <h1>
            Halo, {firstName}
            <span>!</span>
          </h1>

          <p>
            Temukan produk digital terbaik dan kelola
            seluruh pembelianmu dari satu tempat.
          </p>

          <button
            type="button"
            className="modern-button light"
            onClick={() => {
              document
                .getElementById("buyer-products")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
          >
            <i className="fi fi-rr-shopping-bag" />
            Mulai Belanja
          </button>
        </div>

        <div className="modern-dashboard-hero-icon">
          <i className="fi fi-rr-shopping-bag" />
        </div>
      </div>

      <div className="modern-stats">
        <article
          className="buyer-clickable-stat"
          onClick={() => setActiveMenu("Pesanan")}
        >
          <div>
            <i className="fi fi-rr-box" />
          </div>
          <span>Pesanan aktif</span>
          <strong>{orders.length}</strong>
        </article>

        <article
          className="buyer-clickable-stat"
          onClick={() => setActiveMenu("Koin")}
        >
          <div>
            <i className="fi fi-rr-coins" />
          </div>
          <span>Madhayana Coin</span>
          <strong>
            {coin.toLocaleString("id-ID")}
          </strong>
        </article>

        <article
          className="buyer-clickable-stat"
          onClick={() => setActiveMenu("Favorit")}
        >
          <div>
            <i className="fi fi-rr-heart" />
          </div>
          <span>Produk favorit</span>
          <strong>{favorites.length}</strong>
        </article>
      </div>

      <section
        className="modern-product-section"
        id="buyer-products"
      >
        <div className="modern-section-header">
          <div>
            <span className="modern-eyebrow">
              PILIHAN POPULER
            </span>

            <h2>
              {search
                ? `Hasil pencarian "${search}"`
                : "Rekomendasi untukmu"}
            </h2>
          </div>

          <span className="buyer-result-count">
            {products.length} produk
          </span>
        </div>

        {productsLoading ? (
          <div className="buyer-products-loading">
            <div className="buyer-loading-spinner" />
            <strong>Memuat produk...</strong>
          </div>
        ) : productsError ? (
          <BuyerEmpty
            icon="fi fi-rr-exclamation"
            title="Produk gagal dimuat"
            description={productsError}
          />
        ) : products.length === 0 ? (
          <BuyerEmpty
            icon="fi fi-rr-search"
            title="Produk tidak ditemukan"
            description="Coba gunakan kata pencarian yang berbeda."
          />
        ) : (
          <div className="modern-products">
            {products.map((product) => (
              <BuyerProductCard
                key={product.id}
                product={product}
                favorite={favorites.includes(product.id)}
                toggleFavorite={toggleFavorite}
                showNotice={showNotice}
                addToCart={addToCart}
                openDetail={openDetail}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function BuyerProductCard({
  product,
  favorite,
  toggleFavorite,
  showNotice,
  addToCart,
  openDetail,
}) {
  return (
    <article>
      <div className="modern-product-image">
        <i className={product.icon} />

        <button
          type="button"
          className={favorite ? "is-favorite" : ""}
          onClick={() => toggleFavorite(product.id)}
          aria-label="Tambahkan ke favorit"
        >
          <i
            className={
              favorite
                ? "fi fi-sr-heart"
                : "fi fi-rr-heart"
            }
          />
        </button>
      </div>

      <span>{product.category}</span>
      <h3>{product.name}</h3>

      <div className="modern-rating">
        <i className="fi fi-sr-star" />
        {product.rating}
        <small>{product.sold} terjual</small>
      </div>

      <footer>
        <strong>{product.price}</strong>

        <button
          type="button"
          onClick={() => addToCart(product)}
          aria-label="Tambahkan ke keranjang"
        >
          <i className="fi fi-rr-shopping-cart-add" />
        </button>
      </footer>

      <button
        type="button"
        className="buyer-detail-button"
        onClick={() => openDetail(product)}
      >
        Lihat Detail
      </button>
    </article>
  );
}


function parsePrice(price) {
  return Number(
    String(price)
      .replace("Rp", "")
      .replaceAll(".", "")
      .replaceAll(" ", "")
  ) || 0;
}

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function BuyerCart({
  cart,
  updateQuantity,
  removeFromCart,
  openCheckout,
  setActiveMenu,
}) {
  const total = cart.reduce(
    (sum, item) =>
      sum + parsePrice(item.price) * item.quantity,
    0
  );

  return (
    <BuyerPageHeader
      eyebrow="KERANJANG BELANJA"
      title="Keranjang"
      description="Periksa produk sebelum melanjutkan ke pembayaran."
    >
      {cart.length === 0 ? (
        <BuyerEmpty
          icon="fi fi-rr-shopping-cart"
          title="Keranjang masih kosong"
          description="Tambahkan produk yang ingin dibeli terlebih dahulu."
          action="Mulai Belanja"
          onAction={() => setActiveMenu("Beranda")}
        />
      ) : (
        <div className="buyer-cart-layout">
          <div className="buyer-cart-list">
            {cart.map((item) => (
              <article key={item.id}>
                <div className="buyer-cart-image">
                  <i className={item.icon} />
                </div>

                <div className="buyer-cart-info">
                  <span>{item.category}</span>
                  <h3>{item.name}</h3>
                  <strong>{item.price}</strong>
                </div>

                <div className="buyer-quantity">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.id, -1)
                    }
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.id, 1)
                    }
                  >
                    +
                  </button>
                </div>

                <strong className="buyer-cart-subtotal">
                  {formatRupiah(
                    parsePrice(item.price) *
                      item.quantity
                  )}
                </strong>

                <button
                  type="button"
                  className="buyer-remove-cart"
                  onClick={() =>
                    removeFromCart(item.id)
                  }
                  aria-label="Hapus produk"
                >
                  <i className="fi fi-rr-trash" />
                </button>
              </article>
            ))}
          </div>

          <aside className="buyer-cart-summary">
            <h3>Ringkasan Belanja</h3>

            <div>
              <span>Total produk</span>
              <strong>
                {cart.reduce(
                  (sum, item) =>
                    sum + item.quantity,
                  0
                )}
              </strong>
            </div>

            <div>
              <span>Subtotal</span>
              <strong>{formatRupiah(total)}</strong>
            </div>

            <div>
              <span>Biaya layanan</span>
              <strong>Rp0</strong>
            </div>

            <footer>
              <span>Total pembayaran</span>
              <strong>{formatRupiah(total)}</strong>
            </footer>

            <button
              type="button"
              className="modern-button primary full"
              onClick={openCheckout}
            >
              Lanjut ke Checkout
              <i className="fi fi-rr-arrow-right" />
            </button>
          </aside>
        </div>
      )}
    </BuyerPageHeader>
  );
}

function BuyerProductModal({
  product,
  favorite,
  toggleFavorite,
  addToCart,
  onClose,
}) {
  return (
    <div
      className="modern-modal-backdrop"
      onMouseDown={onClose}
    >
      <article
        className="buyer-product-modal"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          className="modern-modal-close"
          onClick={onClose}
        >
          <i className="fi fi-rr-cross-small" />
        </button>

        <div className="buyer-product-modal-image">
          <i className={product.icon} />
        </div>

        <div className="buyer-product-modal-content">
          <span className="modern-eyebrow">
            {product.category}
          </span>

          <h2>{product.name}</h2>

          <div className="modern-rating">
            <i className="fi fi-sr-star" />
            {product.rating}
            <small>{product.sold} terjual</small>
          </div>

          <p>
            Produk digital pilihan Madhayana Market.
            Produk dapat digunakan untuk mendukung
            kebutuhan pekerjaan, bisnis, maupun
            pembelajaran.
          </p>

          <ul>
            <li>Produk digital siap digunakan</li>
            <li>Invoice pembelian tersedia</li>
            <li>Dukungan dari seller</li>
            <li>Akses unduhan setelah pembayaran</li>
          </ul>

          <strong className="buyer-modal-price">
            {product.price}
          </strong>

          <div className="buyer-modal-actions">
            <button
              type="button"
              className="buyer-outline-button"
              onClick={() =>
                toggleFavorite(product.id)
              }
            >
              <i
                className={
                  favorite
                    ? "fi fi-sr-heart"
                    : "fi fi-rr-heart"
                }
              />
              {favorite
                ? "Hapus Favorit"
                : "Simpan Favorit"}
            </button>

            <button
              type="button"
              className="modern-button primary"
              onClick={() => {
                addToCart(product);
                onClose();
              }}
            >
              <i className="fi fi-rr-shopping-cart-add" />
              Tambah Keranjang
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

function BuyerCheckoutModal({
  cart,
  onClose,
  onContinue,
}) {
  const [paymentMethod, setPaymentMethod] =
    useState("");

  const total = cart.reduce(
    (sum, item) =>
      sum + parsePrice(item.price) * item.quantity,
    0
  );

  return (
    <div
      className="modern-modal-backdrop"
      onMouseDown={onClose}
    >
      <form
        className="buyer-checkout-modal"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
        onSubmit={(event) => {
          event.preventDefault();
          onContinue(paymentMethod);
        }}
      >
        <button
          type="button"
          className="modern-modal-close"
          onClick={onClose}
        >
          <i className="fi fi-rr-cross-small" />
        </button>

        <div className="modern-modal-icon">
          <i className="fi fi-rr-credit-card" />
        </div>

        <h2>Ringkasan Checkout</h2>

        <p>
          Periksa pesanan sebelum memilih metode
          pembayaran.
        </p>

        <div className="buyer-checkout-items">
          {cart.map((item) => (
            <div key={item.id}>
              <span>
                {item.name} × {item.quantity}
              </span>

              <strong>
                {formatRupiah(
                  parsePrice(item.price) *
                    item.quantity
                )}
              </strong>
            </div>
          ))}
        </div>

        <div className="buyer-checkout-total">
          <span>Total</span>
          <strong>{formatRupiah(total)}</strong>
        </div>

        <label className="modern-field">
          <span>Metode pembayaran</span>

          <div>
            <i className="fi fi-rr-credit-card" />

            <select
              required
              value={paymentMethod}
              onChange={(event) =>
                setPaymentMethod(
                  event.target.value
                )
              }
            >
              <option value="" disabled>
                Pilih metode pembayaran
              </option>
              <option value="QRIS">QRIS</option>
              <option value="DANA">DANA</option>
              <option value="Transfer Bank">
                Transfer Bank
              </option>
              <option value="Madhayana Coin">
                Madhayana Coin
              </option>
            </select>
          </div>
        </label>

        <button
          type="submit"
          className="modern-button primary full"
        >
          Buat Pesanan
          <i className="fi fi-rr-arrow-right" />
        </button>

        <small>
          Tahap berikutnya akan menghubungkan tombol
          ini ke payment gateway dan Firestore.
        </small>
      </form>
    </div>
  );
}

function BuyerOrders({ orders, showNotice }) {
  return (
    <BuyerPageHeader
      eyebrow="AKTIVITAS TRANSAKSI"
      title="Pesanan Saya"
      description="Pantau status pembayaran dan proses pesananmu."
    >
      <div className="buyer-order-list">
        {orders.map((order) => (
          <article key={order.id}>
            <div className="buyer-order-icon">
              <i className="fi fi-rr-box" />
            </div>

            <div className="buyer-order-main">
              <small>{order.id}</small>
              <h3>{order.product}</h3>
              <span>{order.date}</span>
            </div>

            <div className="buyer-order-price">
              <strong>{order.total}</strong>
              <span
                className={`buyer-status status-${order.status
                  .toLowerCase()
                  .replaceAll(" ", "-")}`}
              >
                {order.status}
              </span>
            </div>

            <button
              type="button"
              className="buyer-outline-button"
              onClick={() =>
                showNotice(
                  `Detail pesanan ${order.id} dibuka.`
                )
              }
            >
              Detail
            </button>
          </article>
        ))}
      </div>
    </BuyerPageHeader>
  );
}

function BuyerFavorites({
  products,
  favorites,
  toggleFavorite,
  setActiveMenu,
  showNotice,
}) {
  return (
    <BuyerPageHeader
      eyebrow="PRODUK TERSIMPAN"
      title="Favorit"
      description="Produk yang kamu tandai akan tersimpan di halaman ini."
    >
      {products.length === 0 ? (
        <BuyerEmpty
          icon="fi fi-rr-heart"
          title="Belum ada produk favorit"
          description="Tekan ikon hati pada produk yang ingin disimpan."
          action="Cari Produk"
          onAction={() => setActiveMenu("Beranda")}
        />
      ) : (
        <div className="modern-products">
          {products.map((product) => (
            <BuyerProductCard
              key={product.id}
              product={product}
              favorite={favorites.includes(product.id)}
              toggleFavorite={toggleFavorite}
              showNotice={showNotice}
            />
          ))}
        </div>
      )}
    </BuyerPageHeader>
  );
}

function BuyerDownloads({ downloads, showNotice }) {
  return (
    <BuyerPageHeader
      eyebrow="PRODUK DIGITAL"
      title="Unduhan"
      description="Akses file produk yang sudah selesai dibeli."
    >
      <div className="buyer-download-grid">
        {downloads.map((file) => (
          <article key={file.id}>
            <div className="buyer-file-icon">
              <i className={file.icon} />
            </div>

            <div>
              <h3>{file.name}</h3>
              <span>
                {file.type} • {file.size}
              </span>
            </div>

            <a
              className="buyer-download-button"
              href={file.url}
              download={file.filename}
              onClick={() =>
                showNotice(
                  `Unduhan ${file.name} dimulai.`
                )
              }
            >
              <i className="fi fi-rr-download" />
              Unduh
            </a>
          </article>
        ))}
      </div>
    </BuyerPageHeader>
  );
}

function BuyerCoins({ coin, addCoin }) {
  const packages = [
    {
      coin: 100,
      price: "Rp10.000",
    },
    {
      coin: 500,
      price: "Rp48.000",
    },
    {
      coin: 1000,
      price: "Rp95.000",
    },
  ];

  return (
    <BuyerPageHeader
      eyebrow="MADHAYANA REWARDS"
      title="Koin dan Membership"
      description="Gunakan koin untuk mendapatkan keuntungan dan potongan transaksi."
    >
      <div className="buyer-coin-balance">
        <div>
          <i className="fi fi-rr-coins" />
        </div>

        <span>Saldo koin saat ini</span>
        <strong>
          {coin.toLocaleString("id-ID")}
        </strong>
        <small>Gold Member</small>
      </div>

      <h2 className="buyer-subheading">
        Pilih paket top up
      </h2>

      <div className="buyer-coin-packages">
        {packages.map((item) => (
          <article key={item.coin}>
            <i className="fi fi-rr-coins" />
            <strong>
              {item.coin.toLocaleString("id-ID")} Koin
            </strong>
            <span>{item.price}</span>

            <button
              type="button"
              className="modern-button primary"
              onClick={() => addCoin(item.coin)}
            >
              Pilih Paket
            </button>
          </article>
        ))}
      </div>
    </BuyerPageHeader>
  );
}

function BuyerProfile({
  form,
  setForm,
  saveProfile,
  user,
}) {
  const update = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <BuyerPageHeader
      eyebrow="PENGATURAN AKUN"
      title="Profil Saya"
      description="Kelola informasi yang digunakan pada transaksi."
    >
      <form
        className="buyer-profile-form"
        onSubmit={saveProfile}
      >
        <div className="buyer-profile-avatar">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={form.name}
            />
          ) : (
            form.name?.charAt(0)?.toUpperCase() || "B"
          )}
        </div>

        <div className="buyer-profile-fields">
          <ModernInput
            icon="fi fi-rr-user"
            label="Nama lengkap"
            name="name"
            value={form.name}
            onChange={update}
            placeholder="Masukkan nama lengkap"
          />

          <ModernInput
            icon="fi fi-rr-envelope"
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={update}
            placeholder="nama@gmail.com"
          />

          <ModernInput
            icon="fi fi-rr-phone-call"
            label="Nomor WhatsApp"
            name="phone"
            value={form.phone}
            onChange={update}
            placeholder="08xxxxxxxxxx"
          />

          <button
            type="submit"
            className="modern-button primary"
          >
            <i className="fi fi-rr-disk" />
            Simpan Perubahan
          </button>
        </div>
      </form>
    </BuyerPageHeader>
  );
}

function BuyerPageHeader({
  eyebrow,
  title,
  description,
  children,
}) {
  return (
    <section className="buyer-page">
      <header className="buyer-page-heading">
        <span className="modern-eyebrow">
          {eyebrow}
        </span>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>

      <div className="buyer-page-content">
        {children}
      </div>
    </section>
  );
}

function BuyerEmpty({
  icon,
  title,
  description,
  action,
  onAction,
}) {
  return (
    <div className="buyer-empty">
      <div>
        <i className={icon} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>

      {action && (
        <button
          type="button"
          className="modern-button primary"
          onClick={onAction}
        >
          {action}
        </button>
      )}
    </div>
  );
}

function RoleDashboard({
  role,
  user,
  onLogout,
  onOpenExcelStudio,
}) {
  const config =
    dashboardData[role] || dashboardData.guest;

  const [activeMenu, setActiveMenu] = useState(
    config.menus[0][1]
  );

  const firstName =
    user.name?.trim().split(" ")[0] || "Pengguna";

  return (
    <main
      className={`modern-dashboard dashboard-${role}`}
    >
      <header className="modern-dashboard-header">
        <Brand />

        <div className="modern-dashboard-search">
          <i className="fi fi-rr-search" />
          <input placeholder="Cari di dashboard..." />
        </div>

        <div className="modern-dashboard-actions">
          <button type="button">
            <i className="fi fi-rr-bell" />
          </button>

          <div className="modern-profile">
            <div className="modern-avatar">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name}
                />
              ) : (
                firstName.charAt(0).toUpperCase()
              )}
            </div>

            <div>
              <strong>{user.name}</strong>
              <span>{role}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="modern-dashboard-layout">
        <aside className="modern-sidebar">
          <div className="modern-role-badge">
            <i className={config.icon} />
            <span>{role}</span>
          </div>

          <nav>
            {config.menus.map(([icon, label]) => (
              <button
                type="button"
                key={label}
                className={
                  activeMenu === label ? "active" : ""
                }
                onClick={() => setActiveMenu(label)}
              >
                <i className={icon} />
                {label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            className="modern-logout"
            onClick={onLogout}
          >
            <i className="fi fi-rr-sign-out-alt" />
            Keluar
          </button>
        </aside>

        <section className="modern-main-content">
          <div className="modern-dashboard-hero">
            <div>
              <span className="modern-eyebrow">
                {activeMenu}
              </span>
              <h1>
                Halo, {firstName}
                <span>!</span>
              </h1>
              <p>{config.subtitle}</p>

              {role === "reseller" && (
                <button
                  type="button"
                  className="modern-button light"
                  onClick={onOpenExcelStudio}
                >
                  <i className="fi fi-rr-file-excel" />
                  Upload Template Excel
                </button>
              )}
            </div>

            <div className="modern-dashboard-hero-icon">
              <i className={config.icon} />
            </div>
          </div>

          <div className="modern-stats">
            {config.stats.map(([label, value, icon]) => (
              <article key={label}>
                <div>
                  <i className={icon} />
                </div>
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
          </div>

          <section className="modern-product-section">
            <div className="modern-section-header">
              <div>
                <span className="modern-eyebrow">
                  DASHBOARD {role.toUpperCase()}
                </span>
                <h2>{activeMenu}</h2>
              </div>
            </div>

            <BuyerEmpty
              icon={config.icon}
              title={`Modul ${activeMenu}`}
              description="Modul ini akan diaktifkan pada tahap berikutnya."
            />
          </section>
        </section>
      </div>
    </main>
  );
}

function GuestModal({ onClose, onRegister }) {
  return (
    <div className="modern-modal-backdrop">
      <div className="modern-modal">
        <button className="modern-modal-close" onClick={onClose}>
          <i className="fi fi-rr-cross-small" />
        </button>

        <div className="modern-modal-icon">
          <i className="fi fi-rr-shopping-cart" />
        </div>

        <h2>Lengkapi data sebelum bertransaksi</h2>
        <p>
          Guest dapat melihat katalog. Untuk melakukan transaksi, silakan
          mendaftar sebagai Buyer terlebih dahulu.
        </p>

        <button className="modern-button primary full" onClick={onRegister}>
          Daftar sebagai Buyer
          <i className="fi fi-rr-arrow-right" />
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <MadhayanaApp />
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
