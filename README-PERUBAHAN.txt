MADHAYANA MARKET V101 - ROLE BASED PROTOTYPE

Perubahan utama:
1. Opening sebanyak 5 slide dengan tombol Kembali, Lanjut, Lewati, indikator slide, dan perpindahan otomatis.
2. Halaman pemilihan akses: Operator, Reseller, Buyer, dan Guest.
3. Login Operator, Reseller, dan Buyer dibuat terpisah.
4. Operator tidak memiliki pilihan pendaftaran mandiri.
5. Guest dapat masuk tanpa login dan melihat katalog.
6. Ketika Guest memilih aksi transaksi, muncul formulir nama, email, dan WhatsApp sebelum checkout.
7. Dashboard setiap peran memiliki warna, menu, statistik, aksi cepat, dan data yang berbeda.
8. Tersedia mode gelap dan tampilan responsif.
9. Build production sudah diuji berhasil.

CATATAN:
- Sistem login pada versi ini adalah prototipe antarmuka. Data sesi tersimpan di sessionStorage.
- Integrasi Firebase Authentication, Firestore, pembayaran, dan data asli dapat disambungkan pada tahap berikutnya.

MENJALANKAN PROJECT:
1. Buka Git Bash di folder project.
2. Jalankan: npm install
3. Jalankan: npm run dev
4. Buka alamat yang ditampilkan Vite.

BUILD PRODUCTION:
npm run build
