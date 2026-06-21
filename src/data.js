export const categories = ['Semua', 'Software', 'Jasa', 'Aplikasi', 'Sertifikasi', 'Barang Fisik'];

export const company = {
  name: 'Madhayana Market',
  tagline: 'Solusi Digital dalam Satu Platform',
  email: 'madhayanagroup@gmail.com',
  website: 'https://madhayana.com',
  address: 'Indonesia',
  hours: 'Senin - Minggu, 09.00 - 21.00 WIB',
  customerService: '+62 812-0000-0000',
  sales: '+62 813-0000-0000'
};

export const menuTree = [
  { title: 'Home', icon: '🏠', items: [] },
  { title: 'Software', icon: '💻', items: ['Website', 'Trading Tools', 'POS', 'Source Code', 'Lisensi'] },
  { title: 'Jasa', icon: '🛠️', items: ['Website', 'Desain', 'Mobile App', 'Digital Marketing', 'Konsultasi'] },
  { title: 'Aplikasi', icon: '📱', items: ['Android', 'iOS', 'Web App', 'Desktop'] },
  { title: 'Sertifikasi', icon: '🎓', items: ['Komputer', 'Digital Marketing', 'Programmer', 'BNSP'] },
  { title: 'History', icon: '🧾', items: [] },
  { title: 'Payment', icon: '💳', items: ['Invoice', 'DANA', 'QRIS', 'Midtrans Placeholder'] },
  { title: 'Contact', icon: '☎️', items: ['Chatbot', 'Customer Service', 'Sales', 'Email'] }
];

export const faqSeed = [
  {id:'faq1', q:'Bagaimana cara membeli produk?', a:'Pilih produk, baca deskripsi dan SLA, klik Beli Sekarang, lalu selesaikan pembayaran. Produk digital otomatis masuk ke Pusat Unduhan.'},
  {id:'faq2', q:'Apakah DANA dan Midtrans sudah aktif?', a:'Belum. Modul checkout sudah disiapkan sebagai placeholder. Integrasi final tinggal disambungkan setelah approval.'},
  {id:'faq3', q:'Bagaimana sistem koin?', a:'User bisa mendapat koin dari check-in harian, transaksi, review, referral, atau top up koin.'},
  {id:'faq4', q:'Apa fungsi Pusat Lisensi?', a:'Untuk menyimpan serial number, masa aktif, status aktivasi, dan perangkat aktif khusus produk software.'}
];

export const productsSeed = [
 {id:'p1', name:'TradeVision AI V27 Ultimate', category:'Software', type:'Digital', price:750000, oldPrice:1250000, stock:99, sold:'1,2RB', views:'15RB', rating:4.9, city:'Tangerang', seller:'Madhayana Official', badge:'Star+', image:'https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=900&auto=format&fit=crop', desc:'Software analisis market real-time dengan dashboard sinyal, alert, dan pusat lisensi. SLA aktivasi maksimal 10 menit setelah pembayaran berhasil.', includes:['Installer', 'Lisensi 1 tahun', 'Video tutorial', 'Update minor', 'Support teknis'], specs:{Kategori:'Software', Versi:'27.0', Lisensi:'1 Tahun', Platform:'Windows/Web', SLA:'Aktivasi otomatis maksimal 10 menit'}, comments:[]},
 {id:'p2', name:'Paket Website Marketplace UMKM', category:'Jasa', type:'Jasa Profesional', price:2500000, oldPrice:3500000, stock:12, sold:'320', views:'8RB', rating:4.8, city:'Jakarta Selatan', seller:'Madhayana Studio', badge:'Best Seller', image:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=900&auto=format&fit=crop', desc:'Jasa pembuatan website marketplace modern. SLA pengerjaan 7-14 hari kerja tergantung paket dan revisi.', includes:['UI/UX', 'Frontend', 'Dashboard admin', 'Dokumentasi', 'Revisi 2x'], specs:{Kategori:'Jasa', Durasi:'7-14 hari', Revisi:'2x', Garansi:'30 Hari', SLA:'Respon awal maksimal 1 jam'}, comments:[]},
 {id:'p3', name:'Aplikasi Chat Android Custom', category:'Aplikasi', type:'Mobile App', price:1850000, oldPrice:2400000, stock:8, sold:'210', views:'6,5RB', rating:4.7, city:'Bandung', seller:'Madhayana Apps', badge:'Verified', image:'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?q=80&w=900&auto=format&fit=crop', desc:'Paket aplikasi chat Android dengan login Google, daftar kontak, dan realtime message.', includes:['APK', 'Source code', 'Firebase setup', 'Dokumentasi'], specs:{Kategori:'Aplikasi', Platform:'Android', Backend:'Firebase', SLA:'File otomatis setelah pembayaran'}, comments:[]},
 {id:'p4', name:'Sertifikasi Digital Marketing', category:'Sertifikasi', type:'Training', price:399000, oldPrice:650000, stock:45, sold:'980', views:'12RB', rating:4.9, city:'Online', seller:'Madhayana Academy', badge:'Promo', image:'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=900&auto=format&fit=crop', desc:'Kelas dan sertifikasi dasar digital marketing. Jadwal kelas dan sertifikat otomatis tersedia di dashboard buyer.', includes:['Modul PDF', 'Video belajar', 'Sertifikat PDF', 'Grup konsultasi'], specs:{Kategori:'Sertifikasi', Metode:'Online', Sertifikat:'PDF', SLA:'Akses modul otomatis'}, comments:[]},
 {id:'p5', name:'Mini PC Office Ready', category:'Barang Fisik', type:'Hardware', price:1750000, oldPrice:1950000, stock:18, sold:'150', views:'3,2RB', rating:4.6, city:'Surabaya', seller:'Madhayana Hardware', badge:'Ready', image:'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=900&auto=format&fit=crop', desc:'Mini PC untuk kantor, sekolah, dan kasir. Pengiriman mengikuti ekspedisi yang tersedia.', includes:['Unit Mini PC', 'Adaptor', 'Garansi 1 Tahun'], specs:{Kategori:'Barang Fisik', Kondisi:'Baru', Garansi:'1 Tahun', Dikirim:'Surabaya'}, comments:[]}
];

export const promosSeed = [
 {id:'bn1',title:'Marketplace Digital Terpadu', sub:'Software, jasa, aplikasi, sertifikasi, dan produk fisik dalam satu ekosistem.', cta:'Jelajahi Produk', target:'home', badge:'HIGHLIGHT'},
 {id:'bn2',title:'Koin Harian Madhayana', sub:'Check-in setiap hari, kumpulkan koin, tukarkan voucher atau top up koin.', cta:'Ambil Koin', target:'coins', badge:'LOYALTY'},
 {id:'bn3',title:'DANA / Midtrans Siap Sambung', sub:'Checkout sudah memakai placeholder. Integrasi final menyusul setelah approval.', cta:'Lihat Checkout', target:'checkout', badge:'PAYMENT'}
];
