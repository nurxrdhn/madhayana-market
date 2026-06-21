import React, {useEffect, useMemo, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {loginWithGoogle, logoutGoogle, listenAuth} from './firebase';
import {categories, productsSeed, company, onboardingSlides, faqSeed} from './data';
import './styles.css';

const rp = (n)=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(Number(n||0));
const pad = (n)=>String(n).padStart(6,'0');
const seq = (key)=>{const n=Number(localStorage.getItem(key)||0)+1; localStorage.setItem(key,n); return n;};
const makeId = (prefix)=>`${prefix}-${new Date().getFullYear()}-${pad(seq(`seq_${prefix}`))}`;
const ls = (k,v)=>{try{return JSON.parse(localStorage.getItem(k)) ?? v}catch{return v}};
const save = (k,v)=>localStorage.setItem(k,JSON.stringify(v));
const icon = (name, cls='')=><span className={`material-symbols-rounded ${cls}`}>{name}</span>;
const rolePrefix = {guest:'GST', buyer:'BYR', seller:'SLR', cs:'CS', sales:'SLS', operator:'OPR', supervisor:'SPV', admin:'ADM'};

function useOutside(ref, callback){
  useEffect(()=>{
    const h=(e)=>{ if(ref.current && !ref.current.contains(e.target)) callback?.(); };
    document.addEventListener('mousedown',h);
    return()=>document.removeEventListener('mousedown',h);
  },[ref,callback]);
}

function App(){
  const [authUser,setAuthUser]=useState(null);
  const [role,setRole]=useState(()=>ls('mm_role','guest'));
  const [profile,setProfile]=useState(()=>ls('mm_profile',null));
  const [seen,setSeen]=useState(()=>ls('mm_seen_onboarding',false));
  const [page,setPage]=useState(seen?'home':'onboarding');
  const [theme,setTheme]=useState(()=>ls('mm_theme','light'));
  const [accent,setAccent]=useState(()=>ls('mm_accent','blue'));
  const [products,setProducts]=useState(()=>ls('mm_products_v50',productsSeed));
  const [cart,setCart]=useState(()=>ls('mm_cart',[]));
  const [wishlist,setWishlist]=useState(()=>ls('mm_wishlist',[]));
  const [coins,setCoins]=useState(()=>ls('mm_coins',250));
  const [q,setQ]=useState('');
  const [filter,setFilter]=useState({category:'Semua',sort:'terbaru',city:'',rating:0});
  const [drawer,setDrawer]=useState(false);
  const [filterOpen,setFilterOpen]=useState(false);
  const [profileOpen,setProfileOpen]=useState(false);
  const [notifOpen,setNotifOpen]=useState(false);
  const [chatOpen,setChatOpen]=useState(false);
  const [detail,setDetail]=useState(null);
  const [modal,setModal]=useState(null);
  const [clock,setClock]=useState(new Date());

  useEffect(()=>listenAuth((u)=>{setAuthUser(u); if(u && !profile){const pr={username:(u.email||'user').split('@')[0].replace(/[^a-z0-9_]/gi,'').toLowerCase(), userId: makeId(rolePrefix[role]||'BYR'), email:u.email, name:u.displayName, photo:u.photoURL, role}; setProfile(pr); save('mm_profile',pr);} }),[]);
  useEffect(()=>save('mm_role',role),[role]);
  useEffect(()=>save('mm_profile',profile),[profile]);
  useEffect(()=>save('mm_theme',theme),[theme]);
  useEffect(()=>save('mm_accent',accent),[accent]);
  useEffect(()=>save('mm_products_v50',products),[products]);
  useEffect(()=>save('mm_cart',cart),[cart]);
  useEffect(()=>save('mm_wishlist',wishlist),[wishlist]);
  useEffect(()=>save('mm_coins',coins),[coins]);
  useEffect(()=>{const t=setInterval(()=>setClock(new Date()),1000);return()=>clearInterval(t)},[]);

  const canManageProducts = ['operator','supervisor','admin'].includes(role);
  const canSell = ['seller','operator','supervisor','admin'].includes(role);
  const canBuy = ['buyer','seller','operator','supervisor','admin'].includes(role);

  const filtered = useMemo(()=>{
    let rows=products.filter(p=> (filter.category==='Semua'||p.category===filter.category) && (`${p.name} ${p.desc} ${p.seller} ${p.city}`.toLowerCase().includes(q.toLowerCase())));
    if(filter.city) rows=rows.filter(p=>p.city.toLowerCase().includes(filter.city.toLowerCase()));
    if(filter.rating) rows=rows.filter(p=>p.rating>=Number(filter.rating));
    if(filter.sort==='az') rows.sort((a,b)=>a.name.localeCompare(b.name));
    if(filter.sort==='za') rows.sort((a,b)=>b.name.localeCompare(a.name));
    if(filter.sort==='harga-naik') rows.sort((a,b)=>a.price-b.price);
    if(filter.sort==='harga-turun') rows.sort((a,b)=>b.price-a.price);
    if(filter.sort==='rating') rows.sort((a,b)=>b.rating-a.rating);
    return rows;
  },[products,q,filter]);

  function chooseRole(next){
    setRole(next);
    const prefix=rolePrefix[next];
    const pr={...(profile||{}), role:next, userId: profile?.userId || makeId(prefix), username: profile?.username || `${next}${Date.now().toString().slice(-4)}`};
    setProfile(pr); setSeen(true); save('mm_seen_onboarding',true); setPage('home');
  }
  async function loginAs(next='buyer'){
    try{ const r=await loginWithGoogle(); const u=r.user; const pr={role:next, userId:makeId(rolePrefix[next]), username:(u.email||'user').split('@')[0].replace(/[^a-z0-9_]/gi,'').toLowerCase(), email:u.email, name:u.displayName, photo:u.photoURL}; setRole(next); setProfile(pr); setSeen(true); setPage('home'); }
    catch(e){ alert('Login Google belum berhasil. Pastikan Google Sign-In aktif di Firebase Authentication dan domain web sudah di-authorize.'); }
  }
  function addCart(p){ if(!canBuy){setModal('loginRequired');return;} setCart(c=>c.find(x=>x.id===p.id)?c.map(x=>x.id===p.id?{...x,qty:x.qty+1}:x):[...c,{...p,qty:1}]); }
  function buyNow(p){addCart(p); if(canBuy)setPage('cart');}
  function toggleWish(id){ if(!canBuy){setModal('loginRequired');return;} setWishlist(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id]); }
  function newProduct(){ if(!canManageProducts){setModal('forbidden');return;} const p={...productsSeed[0], id:`prd-${Date.now()}`, name:'Produk Baru', seller:'Operator Madhayana', city:'Indonesia', badge:'New', comments:[]}; setProducts([p,...products]); setDetail(p); }
  function finishOnboarding(){setSeen(true); save('mm_seen_onboarding',true); setPage('role');}
  function logout(){logoutGoogle().catch(()=>{}); setRole('guest'); setProfile({role:'guest', userId:makeId('GST'), username:'guest'}); setPage('home');}

  return <div className={`app theme-${theme} accent-${accent}`}>
    {page==='onboarding' ? <Onboarding finish={finishOnboarding}/> : <>
      <Header {...{profile,authUser,role,setPage,q,setQ,drawer,setDrawer,filterOpen,setFilterOpen,profileOpen,setProfileOpen,notifOpen,setNotifOpen,cart,theme,setTheme,accent,setAccent,loginAs,logout}} />
      {drawer&&<Hamburger role={role} close={()=>setDrawer(false)} setPage={setPage} newProduct={newProduct}/>} 
      {filterOpen&&<FilterPanel filter={filter} setFilter={setFilter} close={()=>setFilterOpen(false)}/>} 
      {profileOpen&&<ProfileMenu profile={profile} role={role} setPage={setPage} close={()=>setProfileOpen(false)} logout={logout} loginAs={loginAs}/>} 
      {notifOpen&&<Notifications close={()=>setNotifOpen(false)}/>} 
      {page==='role'&&<RolePicker chooseRole={chooseRole} loginAs={loginAs}/>} 
      {page==='home'&&<Home {...{filtered,addCart,buyNow,toggleWish,wishlist,setDetail,clock,role,canManageProducts,newProduct,setPage}}/>}
      {page==='cart'&&<Cart cart={cart} setCart={setCart} canBuy={canBuy} setPage={setPage}/>} 
      {page==='checkout'&&<Checkout cart={cart} setCart={setCart} setPage={setPage}/>} 
      {page==='buyer'&&<BuyerDashboard profile={profile} coins={coins} setCoins={setCoins} wishlist={wishlist} products={products}/>} 
      {page==='seller'&&<SellerDashboard role={role}/>} 
      {page==='operator'&&<OperatorLoginGate role={role} setRole={setRole} setProfile={setProfile} profile={profile} setPage={setPage}/>} 
      {page==='opdash'&&<OperatorDashboard products={products} setProducts={setProducts} newProduct={newProduct}/>} 
      {page==='help'&&<HelpCenter/>} 
      {page==='faq'&&<FAQ/>} 
      {page==='about'&&<About/>} 
      {page==='downloads'&&<Downloads/>} 
      {detail&&<ProductDetail p={detail} close={()=>setDetail(null)} addCart={addCart} buyNow={buyNow} toggleWish={toggleWish} wished={wishlist.includes(detail.id)} canManageProducts={canManageProducts} saveProduct={(p)=>{setProducts(products.map(x=>x.id===p.id?p:x)); setDetail(p)}}/>}
      <button className="floating-chat iconBtn" onClick={()=>setChatOpen(true)}>{icon('smart_toy')}<span>Bantuan</span></button>
      {chatOpen&&<ContactCenter close={()=>setChatOpen(false)}/>} 
      <Footer setPage={setPage}/>
      <div className="running"><b>{clock.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}</b><marquee>Promo berjalan Madhayana Market • DANA/Midtrans menyusul • Produk digital otomatis masuk Pusat Unduhan • Seller wajib verifikasi.</marquee></div>
      {modal==='loginRequired'&&<SmallModal title="Login diperlukan" text="Silakan masuk sebagai Buyer atau Seller untuk membeli, wishlist, chat CS/Sales, dan checkout." close={()=>setModal(null)} action={()=>{setModal(null);setPage('role')}}/>}
      {modal==='forbidden'&&<SmallModal title="Akses ditolak" text="Fitur tambah/edit produk hanya untuk Operator, Supervisor, atau Super Admin." close={()=>setModal(null)}/>} 
    </>}
  </div>
}

function Header({profile,role,setPage,q,setQ,setDrawer,setFilterOpen,setProfileOpen,setNotifOpen,cart,theme,setTheme,accent,setAccent}){
  return <header className="topbar">
    <button className="flat" onClick={()=>setDrawer(v=>!v)}>{icon('menu')}</button>
    <button className="welcome" onClick={()=>setPage('home')}><img src="/logo.svg"/> <span>Selamat Datang, <b>{profile?.name?.split(' ')[0] || profile?.username || 'Namamu'}</b><small>{profile?.userId || 'GST-2026-000000'} · {String(role).toUpperCase()}</small></span></button>
    <div className="searchWrap"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Mau cari apa hari ini?"/><button className="flat" onClick={()=>setFilterOpen(v=>!v)}>{icon('tune')}</button><button className="flat">{icon('search')}</button></div>
    <button className="flat" onClick={()=>setNotifOpen(v=>!v)}>{icon('notifications')}<em>3</em></button>
    <button className="flat" onClick={()=>setPage('cart')}>{icon('shopping_cart')}<em>{cart.length}</em></button>
    <button className="flat" onClick={()=>setTheme(theme==='dark'?'light':'dark')}>{icon(theme==='dark'?'light_mode':'dark_mode')}</button>
    <button className="flat" onClick={()=>setAccent(accent==='blue'?'cyan':accent==='cyan'?'emerald':'blue')}>{icon('palette')}</button>
    <button className="profileBtn" onClick={()=>setProfileOpen(v=>!v)}>{profile?.photo?<img src={profile.photo}/>:icon('account_circle')} {icon('keyboard_arrow_down')}</button>
  </header>
}

function Onboarding({finish}){ const [i,setI]=useState(0); const s=onboardingSlides[i]; return <main className="onboarding"><section className="onCard"><div className="onIcon">{icon(s.icon)}</div><p>Slide {i+1} / {onboardingSlides.length}</p><h1>{s.title}</h1><h2>{s.text}</h2><div className="onDots">{onboardingSlides.map((_,n)=><button key={n} className={n===i?'active':''} onClick={()=>setI(n)}/>)}</div><div className="onActions"><button className="ghost" onClick={finish}>Lewati</button>{i<onboardingSlides.length-1?<button className="primary" onClick={()=>setI(i+1)}>Selanjutnya {icon('arrow_forward')}</button>:<button className="primary" onClick={finish}>Mulai Sekarang</button>}</div></section></main> }
function RolePicker({chooseRole,loginAs}){return <main className="rolePage"><h1>Pilih cara masuk</h1><p>Pilih sesuai kebutuhan. Operator memiliki halaman khusus dengan kode Google Authenticator.</p><div className="roleGrid"><RoleCard iconName="visibility" title="Guest" text="Jelajahi produk tanpa login. Tidak bisa beli atau tambah produk." onClick={()=>chooseRole('guest')}/><RoleCard iconName="shopping_bag" title="Buyer" text="Beli produk, checkout, wishlist, koin, voucher, dan pusat unduhan." onClick={()=>loginAs('buyer')}/><RoleCard iconName="store" title="Seller" text="Daftar toko, verifikasi, kelola produk, pesanan, dan promosi." onClick={()=>loginAs('seller')}/></div><button className="linkBtn" onClick={()=>alert('Operator masuk lewat menu Op dengan kode Google Authenticator.')}>Operator? Gunakan halaman khusus.</button></main>}
function RoleCard({iconName,title,text,onClick}){return <button className="roleCard" onClick={onClick}>{icon(iconName)}<b>{title}</b><span>{text}</span></button>}

function Hamburger({role,close,setPage,newProduct}){const ref=useRef(null); useOutside(ref,close); const menus=[['home','Home','home'],['home','Software','code'],['home','Jasa','engineering'],['home','Aplikasi','phone_android'],['home','Sertifikasi','school'],['buyer','History','history'],['cart','Payment','payments'],['help','Contact','support_agent']]; return <aside className="drawer" ref={ref}>{menus.map(m=><button key={m[1]} onClick={()=>{setPage(m[0]);close();}}>{icon(m[2])}<span>{m[1]}</span>{['Software','Jasa','Aplikasi','Sertifikasi'].includes(m[1])&&icon('keyboard_arrow_down','rightIcon')}</button>)}{['operator','supervisor','admin'].includes(role)&&<><hr/><button onClick={()=>{newProduct();close();}}>{icon('add_circle')}<span>Tambah Produk</span></button><button onClick={()=>{setPage('opdash');close();}}>{icon('admin_panel_settings')}<span>Operator Center</span></button></>}</aside>}
function FilterPanel({filter,setFilter,close}){const ref=useRef(null); useOutside(ref,close); return <section className="filterPanel" ref={ref}><h3>Filter Pencarian</h3><label>Kategori<select value={filter.category} onChange={e=>setFilter({...filter,category:e.target.value})}>{categories.map(c=><option key={c}>{c}</option>)}</select></label><label>Urutkan<select value={filter.sort} onChange={e=>setFilter({...filter,sort:e.target.value})}><option value="terbaru">Update Terbaru</option><option value="az">Abjad A-Z</option><option value="za">Abjad Z-A</option><option value="harga-naik">Harga Termurah</option><option value="harga-turun">Harga Termahal</option><option value="rating">Rating Tertinggi</option></select></label><label>Lokasi/Kota<input value={filter.city} onChange={e=>setFilter({...filter,city:e.target.value})} placeholder="Provinsi, kota, kecamatan"/></label><label>Minimal Rating<select value={filter.rating} onChange={e=>setFilter({...filter,rating:e.target.value})}><option value="0">Semua</option><option value="5">5</option><option value="4">4+</option><option value="3">3+</option></select></label><button className="primary" onClick={close}>Terapkan</button><button className="ghost" onClick={()=>setFilter({category:'Semua',sort:'terbaru',city:'',rating:0})}>Reset</button></section>}
function ProfileMenu({profile,role,setPage,close,logout,loginAs}){const ref=useRef(null); useOutside(ref,close); return <section className="profileMenu" ref={ref}><div className="profileHead">{profile?.photo?<img src={profile.photo}/>:icon('account_circle')}<b>{profile?.username || 'guest'}</b><small>{profile?.userId} · {role}</small></div>{['Profil','Pengaturan','Tambahkan akun','Switch akun'].map(t=><button key={t} onClick={close}>{t}</button>)}<button onClick={()=>{setPage('about');close();}}>Tentang Aplikasi</button>{role==='guest'?<button onClick={()=>loginAs('buyer')}>Masuk Google</button>:<button onClick={logout}>Keluar</button>}</section>}
function Notifications({close}){const ref=useRef(null); useOutside(ref,close); return <section className="notif" ref={ref}><h3>Notifikasi</h3><p>Payment gateway masih placeholder.</p><p>Seller wajib verifikasi sebelum jualan.</p><p>Privacy Policy sudah tersedia di footer.</p></section>}

function Home({filtered,addCart,buyNow,toggleWish,wishlist,setDetail,clock,role,canManageProducts,newProduct,setPage}){return <main className="home"><section className="hero"><div className="heroBanner" onClick={()=>setPage('about')}>Iklan Banner direct tetap</div><div className="heroGrid"><div className="slider"><h1>Iklan slider yang bisa diklik dan direct</h1><div className="sliderDots"><b/><b/><b/><b/><b/></div></div><Widget clock={clock}/></div></section><section className="quickCats">{categories.slice(1).map((c,i)=><button key={c}>{icon(['code','engineering','phone_android','school','inventory_2'][i])}{c}</button>)}</section><section className="sectionTitle"><h2>Produk Rekomendasi</h2>{canManageProducts&&<button className="primary" onClick={newProduct}>{icon('add')}Tambah Produk</button>}</section><div className="productGrid">{filtered.map(p=><ProductCard key={p.id} p={p} onOpen={()=>setDetail(p)} addCart={addCart} buyNow={buyNow} toggleWish={toggleWish} wished={wishlist.includes(p.id)}/>)}</div></main>}
function Widget({clock}){return <aside className="widget"><div className="tiles"><b/><b/><b/><b/></div><h3>Menu widget</h3><div className="player">{icon('shuffle')}{icon('skip_previous')}{icon('play_circle')}{icon('skip_next')}{icon('crop_free')}</div><small>{clock.toLocaleDateString('id-ID')} · {clock.toLocaleTimeString('id-ID')}</small></aside>}
function ProductCard({p,onOpen,addCart,buyNow,toggleWish,wished}){return <article className="productCard" onClick={onOpen}><div className="pic"><img src={p.image}/><span>{p.badge}</span><button className="play">{icon('play_circle')}</button></div><div className="pbody"><h3>{p.name}</h3><p className="guarantee">Garansi Harga Terbaik</p><b>{rp(p.price)}</b><small>{icon('star')} {p.rating} · {p.sold} terjual · {p.city}</small><div className="cardActions"><button title="Favorit" onClick={(e)=>{e.stopPropagation();toggleWish(p.id)}}>{icon(wished?'favorite':'favorite')}</button><button title="Keranjang" onClick={(e)=>{e.stopPropagation();addCart(p)}}>{icon('shopping_cart')}</button><button title="Beli cepat" onClick={(e)=>{e.stopPropagation();buyNow(p)}}>{icon('bolt')}</button></div></div></article>}

function ProductDetail({p,close,addCart,buyNow,toggleWish,wished,canManageProducts,saveProduct}){const [edit,setEdit]=useState(false); const [draft,setDraft]=useState(p); return <div className="modal"><section className="detail"><button className="close" onClick={close}>{icon('close')}</button><div className="detailTop"><div className="gallery"><img className="bigImg" src={draft.image}/><div className="thumbs"><img src={draft.image}/><img src={draft.image}/><img src={draft.image}/></div><div className="share">Share: {icon('share')} {icon('favorite')}</div></div><div className="detailInfo"><h1><span>{draft.badge}</span> {draft.name}</h1><p className="rating">{draft.rating} ★★★★★ | {draft.sold} Penilaian <button>Laporkan</button></p><h2>{rp(draft.price)} {draft.oldPrice&&<small>- {rp(draft.oldPrice)}</small>}</h2><p><b>Pengiriman</b> Layanan tergantung jenis produk</p><p><b>Jaminan</b> Bebas pengembalian sesuai ketentuan</p><p><b>SLA</b> {draft.specs?.SLA || 'Sesuai deskripsi produk'}</p><div className="qty"><button>{icon('remove')}</button><b>1</b><button>{icon('add')}</button></div><div className="detailActions"><button onClick={()=>addCart(draft)}>{icon('shopping_cart')}Keranjang</button><button className="primary" onClick={()=>buyNow(draft)}>{icon('bolt')}Beli Sekarang</button><button onClick={()=>toggleWish(draft.id)}>{icon(wished?'favorite':'favorite')}Favorit</button>{canManageProducts&&<button onClick={()=>setEdit(!edit)}>{icon('edit')}Edit</button>}</div>{edit&&<div className="editBox"><input value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})}/><input value={draft.image} onChange={e=>setDraft({...draft,image:e.target.value})}/><textarea value={draft.desc} onChange={e=>setDraft({...draft,desc:e.target.value})}/><button className="primary" onClick={()=>{saveProduct(draft);setEdit(false)}}>Simpan</button></div>}</div></div><SellerBox/><Tabs p={draft}/></section></div>}
function SellerBox(){return <section className="sellerBox"><div>{icon('store')}<b>Madhayana Store</b><small>Aktif 6 menit lalu · Star+</small></div><button>{icon('chat')}Chat Sekarang</button><button>{icon('storefront')}Kunjungi Toko</button><span>Penilaian <b>15,6RB</b></span><span>Chat Dibalas <b>99%</b></span><span>Bergabung <b>6 tahun lalu</b></span></section>}
function Tabs({p}){return <section className="tabs"><h2>Spesifikasi Produk</h2><div className="specs">{Object.entries(p.specs||{}).map(([k,v])=><><b>{k}</b><span>{v}</span></>)}</div><h2>Deskripsi Produk</h2><p>{p.desc}</p><h2>File Yang Didapat</h2><div className="chips">{(p.files||[]).map(f=><span key={f}>{icon('download')} {f}</span>)}</div><h2>Penilaian Produk</h2><Review/></section>}
function Review(){return <div className="review"><h3>4.9 dari 5 ★★★★★</h3><div className="chips"><button>Semua</button><button>5 Bintang</button><button>Dengan Media</button></div><p><b>a****a</b> ★★★★★</p><p>Produk sesuai deskripsi. Seller amanah dan fast respon.</p></div>}

function Cart({cart,setCart,canBuy,setPage}){const total=cart.reduce((s,p)=>s+p.price*p.qty,0); return <main className="page"><h1>Keranjang Saya</h1>{cart.length===0?<p>Keranjang masih kosong.</p>:cart.map(p=><div className="cartLine" key={p.id}><img src={p.image}/><div><b>{p.name}</b><small>{p.category} · {p.seller}</small></div><span>{rp(p.price)}</span><button onClick={()=>setCart(cart.map(x=>x.id===p.id?{...x,qty:Math.max(1,x.qty-1)}:x))}>{icon('remove')}</button><b>{p.qty}</b><button onClick={()=>setCart(cart.map(x=>x.id===p.id?{...x,qty:x.qty+1}:x))}>{icon('add')}</button><button onClick={()=>setCart(cart.filter(x=>x.id!==p.id))}>{icon('delete')}</button></div>)}<aside className="summary"><p>Total Produk: {rp(total)}</p><p>Biaya layanan placeholder: {rp(cart.length?1000:0)}</p><h2>Total Bayar: {rp(total+(cart.length?1000:0))}</h2><button className="primary" disabled={!cart.length||!canBuy} onClick={()=>setPage('checkout')}>{icon('payments')}Checkout</button></aside></main>}
function Checkout({cart,setCart,setPage}){const total=cart.reduce((s,p)=>s+p.price*p.qty,0)+1000; const inv=`INV-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${pad(seq('INV'))}`; function paid(){setCart([]);setPage('downloads');alert('Simulasi pembayaran berhasil. Produk digital masuk ke Pusat Unduhan.');} return <main className="page"><h1>Checkout Pembayaran</h1><p>Nomor Invoice: <b>{inv}</b></p><div className="payMethods"><button className="primary" onClick={paid}>{icon('account_balance_wallet')}Bayar Placeholder DANA</button><button onClick={paid}>{icon('qr_code_2')}QRIS Placeholder</button><button onClick={paid}>{icon('credit_card')}Midtrans Placeholder</button></div><h2>{rp(total)}</h2><p>DANA/Midtrans masih menyusul. Struktur halaman sudah siap untuk callback otomatis.</p></main>}
function BuyerDashboard({profile,coins,setCoins,wishlist,products}){function checkin(){setCoins(coins+25);alert('Check-in berhasil. +25 koin.')} return <main className="dash"><h1>Dashboard Buyer</h1><div className="stats"><b>{profile?.userId}</b><b>{coins} Koin</b><b>Bronze Member</b><b>{wishlist.length} Wishlist</b></div><button className="primary" onClick={checkin}>{icon('event_available')}Check-in Harian +25 Koin</button><h2>Wishlist</h2><div className="miniGrid">{products.filter(p=>wishlist.includes(p.id)).map(p=><ProductCard key={p.id} p={p} onOpen={()=>{}} addCart={()=>{}} buyNow={()=>{}} toggleWish={()=>{}} wished/>)}</div></main>}
function SellerDashboard(){return <main className="dash"><h1>Dashboard Seller</h1><div className="stats"><b>Pesanan Baru 18</b><b>Pendapatan Rp5.200.000</b><b>Rating 4.9</b><b>Chat 5</b></div><p>Seller bisa mengelola produk setelah verifikasi OP/SPV.</p></main>}
function OperatorLoginGate({role,setRole,setProfile,profile,setPage}){const [code,setCode]=useState(''); if(['operator','supervisor','admin'].includes(role)) {setPage('opdash'); return null;} return <main className="page opLogin"><h1>Operator Login</h1><p>Masukkan kode Google Authenticator. Demo code: <b>0123456</b></p><input value={code} onChange={e=>setCode(e.target.value)} placeholder="Kode 6 digit"/><button className="primary" onClick={()=>{ if(code==='0123456'){setRole('operator'); setProfile({...profile,role:'operator',userId:makeId('OPR'),username:'operator'}); setPage('opdash')} else alert('Kode salah');}}>{icon('verified_user')}Masuk Operator</button></main>}
function OperatorDashboard({products,setProducts,newProduct}){return <main className="dash"><h1>Operator Center</h1><div className="stats"><b>User 15.250</b><b>Seller 350</b><b>Produk {products.length}</b><b>Tiket 12</b></div><button className="primary" onClick={newProduct}>{icon('add_circle')}Tambah Produk</button><h2>Manajemen Produk</h2>{products.map(p=><div className="opRow" key={p.id}><img src={p.image}/><b>{p.name}</b><span>{p.category}</span><button>{icon('edit')}</button><button onClick={()=>setProducts(products.filter(x=>x.id!==p.id))}>{icon('delete')}</button></div>)}</main>}
function Downloads(){return <main className="page"><h1>Pusat Unduhan & Lisensi</h1><p>Produk digital yang sudah dibayar akan otomatis tampil di sini.</p><div className="downloadCard">{icon('download')} TradeVision AI V27 · Lisensi LIC-2026-000001 · Download</div></main>}
function HelpCenter(){return <main className="page"><h1>Pusat Bantuan</h1><p>Chatbot, Customer Service, Sales, dan Email Center tersedia melalui tombol Bantuan kanan bawah.</p></main>}
function FAQ(){return <main className="page"><h1>FAQ</h1>{faqSeed.map(f=><div className="faq" key={f.q}><b>{f.q}</b><p>{f.a}</p></div>)}</main>}
function About(){return <main className="page"><h1>Tentang Madhayana Market</h1><p>{company.name} adalah platform marketplace terpadu untuk software, jasa, aplikasi, sertifikasi, dan produk fisik dengan dukungan AI, reward, dan pusat bantuan terintegrasi.</p></main>}

function ContactCenter({close}){const [tab,setTab]=useState('bot'); const [menu,setMenu]=useState(false); const [messages,setMessages]=useState([{from:'bot',text:'Halo selamat datang. Ada yang bisa kami bantu?',time:'16.42'}]); const menuRef=useRef(null); useOutside(menuRef,()=>setMenu(false)); const sla=tab==='cs'||tab==='sales'; return <div className="contactModal"><section className="contactCenter"><aside><h2>CONTACT CENTER</h2>{[['bot','CHAT BOT','12.00 WIB 20/06/2026'],['cs','CUSTOMER SERVICE','SLA 05.00'],['sales','SALES','SLA 05.00'],['email','EMAIL','12.00 WIB 20/06/2026']].map(x=><button key={x[0]} className={tab===x[0]?'active':''} onClick={()=>setTab(x[0])}><b>{x[1]}</b><small>{x[2]}</small>{sla&&x[0]===tab&&<em className="sla green">05:00</em>}</button>)}</aside><main><header><button onClick={close}>{icon('arrow_back')}</button><b>{tab==='bot'?'CHAT BOT':tab==='cs'?'CUSTOMER SERVICE':tab==='sales'?'SALES':'EMAIL'}</b><button onClick={()=>setMenu(!menu)}>{icon('more_vert')}</button>{menu&&<div className="chatMenu" ref={menuRef}>{['Laporkan Percakapan','Nilai Layanan','Cari Pesan','Pin Pesan','Ekspor TXT','Ganti Tema','Hapus Obrolan'].map(t=><button key={t}>{t}</button>)}</div>}</header>{tab==='email'?<EmailComposer/>:<><div className="chatBody">{messages.map((m,i)=><p key={i} className={m.from==='me'?'me':'them'}>{m.text}<small>{m.time}</small></p>)}</div><div className="quickButtons"><button>Cek Pesanan</button><button>Cek status pembayaran</button><button>Cek Riwayat kegiatan</button></div><div className="chatInput"><button>{icon('attach_file')}</button><button>{icon('mood')}</button><input placeholder="Tulis pesan..."/><button onClick={()=>setMessages([...messages,{from:'me',text:'Hallo',time:'16.42'}])}>{icon('send')}</button></div></>}</main></section></div>}
function EmailComposer(){return <div className="emailBox"><input placeholder="Kepada: support@madhayana.com"/><input placeholder="Subjek"/><textarea placeholder="Tulis email seperti biasa..."/><div><button>{icon('attach_file')}Lampiran</button><button className="primary">Kirim Email</button></div></div>}
function SmallModal({title,text,close,action}){return <div className="modal small"><section><h2>{title}</h2><p>{text}</p><button onClick={close}>Tutup</button>{action&&<button className="primary" onClick={action}>Lanjut</button>}</section></div>}
function Footer({setPage}){return <footer><b>Madhayana Market</b><button onClick={()=>setPage('about')}>Tentang Kami</button><button onClick={()=>setPage('faq')}>FAQ</button><a href="/privacy.html">Kebijakan Privasi</a><a href="/terms.html">Syarat & Ketentuan</a><span>© 2026 Madhayana Market</span></footer>}

createRoot(document.getElementById('root')).render(<App/>);
