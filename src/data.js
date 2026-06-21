export const company = {
  name: 'Madhayana Market',
  tagline: 'Solusi Digital dalam Satu Platform',
  email: 'madhayanagroup@gmail.com',
  address: 'Indonesia',
  cs: '+62 812-0000-0000',
  sales: '+62 813-0000-0000'
};

export const categories = ['Semua','Software','Jasa','Aplikasi','Sertifikasi','Barang Fisik'];

export const productsSeed = [
  {id:'prd-1', name:'TradeVision AI V27 Ultimate', category:'Software', type:'Digital', seller:'Madhayana Lab', city:'Tangerang', price:2750000, oldPrice:3500000, stock:45, sold:'1,2RB', rating:4.9, badge:'Star+', image:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop', desc:'Software analisis trading berbasis AI. SLA aktivasi maksimal 1x24 jam setelah pembayaran berhasil.', specs:{Lisensi:'Lifetime', Platform:'Windows/Web', SLA:'Aktivasi 1x24 jam', Garansi:'7 hari kendala teknis'}, files:['Installer','Panduan PDF','Video tutorial','Pusat lisensi'], comments:[]},
  {id:'prd-2', name:'Paket Website Marketplace UMKM', category:'Jasa', type:'Jasa Digital', seller:'Madhayana Studio', city:'Jakarta', price:3500000, oldPrice:5000000, stock:12, sold:'350', rating:4.8, badge:'Promo', image:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop', desc:'Jasa pembuatan website marketplace untuk UMKM. SLA pengerjaan 7–14 hari kerja sesuai paket.', specs:{Paket:'Website UMKM', Revisi:'2 kali', SLA:'7–14 hari kerja', Support:'30 hari'}, files:['Dokumen brief','Source hasil final'], comments:[]},
  {id:'prd-3', name:'Aplikasi Chat Android Custom', category:'Aplikasi', type:'Android', seller:'Sapa Dev', city:'Bandung', price:1800000, oldPrice:2400000, stock:20, sold:'220', rating:4.7, badge:'Verified', image:'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?q=80&w=1200&auto=format&fit=crop', desc:'Aplikasi chat Android custom dengan login Google, ruang chat, dan kontak. SLA demo 3 hari kerja.', specs:{Platform:'Android', Login:'Google', SLA:'Demo 3 hari kerja', Revisi:'2 kali'}, files:['APK demo','Dokumentasi','Source code sesuai paket'], comments:[]},
  {id:'prd-4', name:'Sertifikasi Digital Marketing', category:'Sertifikasi', type:'Kelas/Sertifikat', seller:'Madhayana Academy', city:'Surabaya', price:450000, oldPrice:600000, stock:80, sold:'3RB+', rating:4.9, badge:'Best Seller', image:'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop', desc:'Program sertifikasi digital marketing. Materi otomatis masuk ke pusat unduhan setelah pembayaran.', specs:{Durasi:'2 minggu', Sertifikat:'PDF', SLA:'Akses materi instan', Ujian:'Online'}, files:['Modul PDF','Video kelas','Sertifikat PDF'], comments:[]},
  {id:'prd-5', name:'Mini PC Office Ready', category:'Barang Fisik', type:'Elektronik', seller:'Madhayana Store', city:'Tangerang', price:2450000, oldPrice:2700000, stock:15, sold:'115', rating:4.6, badge:'Ready', image:'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1200&auto=format&fit=crop', desc:'Mini PC siap pakai untuk kantor dan kasir. Pengiriman mengikuti ketersediaan kurir.', specs:{Kondisi:'Baru', Garansi:'1 tahun', Berat:'1kg', Dikirim:'Tangerang'}, files:['Invoice','Panduan singkat'], comments:[]}
];

export const onboardingSlides = [
  {title:'Selamat Datang di Madhayana Market', text:'Satu platform untuk membeli, menjual, dan mengembangkan produk digital maupun fisik.', icon:'storefront'},
  {title:'Temukan Produk yang Anda Butuhkan', text:'Cari software, aplikasi, jasa profesional, sertifikasi, dan produk fisik melalui pencarian pintar.', icon:'search'},
  {title:'Pembayaran Cepat dan Aman', text:'Pembayaran disiapkan untuk DANA, QRIS, dan Midtrans. Saat ini gateway masih mode placeholder.', icon:'payments'},
  {title:'Pusat Bantuan Terintegrasi', text:'Chatbot, Customer Service, Sales, dan Email Center tersedia dalam satu panel bantuan.', icon:'support_agent'},
  {title:'Bangun Toko Anda Sendiri', text:'Seller dapat mengelola produk, pesanan, promosi, analitik, dan pusat file.', icon:'store'},
  {title:'Koin, Voucher, dan Reward', text:'Check-in harian, belanja, review, referral, dan top up koin untuk mendapat keuntungan tambahan.', icon:'paid'},
  {title:'Lebih dari Marketplace', text:'Madhayana Market menggabungkan AI, produk digital, jasa, sertifikasi, dan sistem operasional modern.', icon:'rocket_launch'}
];

export const faqSeed = [
  {q:'Apakah Guest bisa membeli?', a:'Tidak. Guest hanya bisa melihat produk, membaca deskripsi, dan menjelajah platform.'},
  {q:'Kapan produk digital diterima?', a:'Setelah pembayaran berhasil, produk otomatis masuk ke Pusat Unduhan dan Pusat Lisensi.'},
  {q:'Bagaimana seller mendaftar?', a:'Seller harus login, mengisi data, lalu menunggu verifikasi Operator atau Supervisor.'},
  {q:'Apakah DANA/Midtrans sudah aktif?', a:'Belum. Modul pembayaran disiapkan sebagai placeholder sampai approval selesai.'}
];
