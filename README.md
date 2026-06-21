# Madhayana Market UI/UX v50

Versi ini memperbaiki dan menambahkan:

- Opening/onboarding 7 slide untuk user baru.
- Pilihan masuk sebagai Guest, Buyer, atau Seller.
- Operator masuk lewat halaman khusus dengan demo code `0123456` untuk Google Authenticator placeholder.
- Google Login Firebase sudah memakai `firebase/auth`, `GoogleAuthProvider`, dan `signInWithPopup`.
- Footer homepage berisi link Kebijakan Privasi dan Syarat & Ketentuan.
- Dark mode memakai CSS variable agar teks ikut berubah menjadi terang.
- Spacing daftar produk/operator diperbaiki agar gambar dan teks tidak tabrakan.
- Dropdown hamburger, filter, profil, notifikasi, dan menu chat otomatis menutup saat klik luar.
- Guest tidak bisa checkout, wishlist, chat transaksi, atau tambah produk.
- Tambah/edit produk hanya untuk Operator/Supervisor/Admin.
- Setiap role punya format ID: GST, BYR, SLR, CS, SLS, OPR, SPV, ADM.
- Card produk marketplace modern dengan flat icon action.
- Detail produk, keranjang, checkout placeholder DANA/Midtrans, dashboard buyer, seller, operator.
- Contact Center: Chatbot, CS, Sales, dan Email.
- Pusat Unduhan & Lisensi.
- Koin, check-in harian, voucher/membership placeholder.

## Catatan Firebase Google Login

Pastikan di Firebase Console:

1. Authentication > Sign-in method > Google = Enable.
2. Authentication > Settings > Authorized domains: tambahkan domain hosting yang dipakai.
3. Jika pakai localhost, `localhost` harus ada di Authorized domains.

## Jalankan

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
