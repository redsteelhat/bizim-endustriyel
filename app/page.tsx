"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  code: string;
  price: number;
  oldPrice?: number;
  badge: string;
  rating: number;
  reviews: number;
  stock: number;
  image: string;
  description: string;
  specs: string[];
};

type CartItem = Product & { quantity: number };

const categories = [
  {
    name: "Elektrikli El Aletleri",
    kicker: "Gücü kontrol edin",
    detail: "Matkap · Taşlama · Vidalama",
    image: "/images/drill.jpg",
  },
  {
    name: "El Aletleri",
    kicker: "Her işin temelinde",
    detail: "Anahtar · Pense · Lokma",
    image: "/images/wrenches.jpg",
  },
  {
    name: "Kesici & Aşındırıcı",
    kicker: "Temiz ve hızlı sonuç",
    detail: "Disk · Testere · Zımpara",
    image: "/images/grinder.jpg",
  },
  {
    name: "Bağlantı Elemanları",
    kicker: "Sağlam bağlantılar",
    detail: "Cıvata · Somun · Dübel",
    image: "/images/fasteners.jpg",
  },
  {
    name: "İş Güvenliği",
    kicker: "Önce güvenlik",
    detail: "Eldiven · Maske · Gözlük",
    image: "/images/workshop.jpg",
  },
  {
    name: "Ölçüm & Atölye",
    kicker: "Hassasiyet kazandırır",
    detail: "Ölçüm · Düzen · Ekipman",
    image: "/images/hand-tools.jpg",
  },
];

const products: Product[] = [
  {
    id: 1,
    name: "Profesyonel Avuç Taşlama 850 W — 115 mm",
    category: "Elektrikli El Aletleri",
    code: "BE-ELK-AG850",
    price: 2799,
    oldPrice: 3199,
    badge: "Çok satan",
    rating: 4.8,
    reviews: 124,
    stock: 17,
    image: "/images/grinder.jpg",
    description:
      "Kompakt gövdesi ve güçlü motoruyla yoğun kesme ve taşlama işlerinde kontrollü kullanım sağlar.",
    specs: ["850 W motor", "115 mm disk çapı", "Devir ayarlı", "Yan tutma kolu"],
  },
  {
    id: 2,
    name: "18 V Kömürsüz Şarjlı Vidalama Seti",
    category: "Elektrikli El Aletleri",
    code: "BE-ELK-SV18",
    price: 5949,
    oldPrice: 6799,
    badge: "Usta seçimi",
    rating: 4.9,
    reviews: 86,
    stock: 9,
    image: "/images/drill.jpg",
    description:
      "Çift akü ve hızlı şarj desteğiyle montaj işlerinde ritmi koruyan profesyonel set.",
    specs: ["18 V kömürsüz motor", "2 × 2.0 Ah akü", "13 mm mandren", "Taşıma çantası"],
  },
  {
    id: 3,
    name: "Darbeli Matkap 1050 W — 13 mm",
    category: "Elektrikli El Aletleri",
    code: "BE-ELK-DM1050",
    price: 3849,
    oldPrice: 4299,
    badge: "Fiyat / performans",
    rating: 4.7,
    reviews: 59,
    stock: 12,
    image: "/images/drill.jpg",
    description:
      "Beton, metal ve ahşap uygulamalarında güçlü darbe performansı ve hassas hız kontrolü.",
    specs: ["1050 W motor", "13 mm anahtarsız mandren", "Sağ / sol dönüş", "Derinlik mesnedi"],
  },
  {
    id: 4,
    name: "İnox Kesici Disk 115 × 1 mm — 25'li Paket",
    category: "Kesici & Aşındırıcı",
    code: "BE-KES-ID115-25",
    price: 679,
    oldPrice: 749,
    badge: "Paket avantajı",
    rating: 4.8,
    reviews: 211,
    stock: 36,
    image: "/images/grinder.jpg",
    description:
      "Paslanmaz metalde hızlı, düşük çapaklı kesim için seri işlere uygun ekonomik paket.",
    specs: ["115 × 1 × 22.23 mm", "Inox uyumlu", "25 adet", "Düşük çapak"],
  },
  {
    id: 5,
    name: "1/2” Lokma Anahtar Takımı — 24 Parça",
    category: "El Aletleri",
    code: "BE-ELA-LK24",
    price: 2149,
    oldPrice: 2499,
    badge: "Profesyonel seri",
    rating: 4.9,
    reviews: 73,
    stock: 14,
    image: "/images/wrenches.jpg",
    description:
      "Bakım ve atölye işlerindeki temel ölçüleri dayanıklı taşıma çantasında bir araya getirir.",
    specs: ["Cr-V çelik", "10–32 mm lokmalar", "72 diş cırcır", "Metal kilitli çanta"],
  },
  {
    id: 6,
    name: "Ağır Hizmet Kombine Pense — 180 mm",
    category: "El Aletleri",
    code: "BE-ELA-KP180",
    price: 399,
    oldPrice: 459,
    badge: "Çok satan",
    rating: 4.7,
    reviews: 148,
    stock: 28,
    image: "/images/hand-tools.jpg",
    description:
      "Güçlü kavrama yüzeyi ve ergonomik sapıyla kesme, bükme ve montaj işlerinde rahat kontrol.",
    specs: ["180 mm", "İndüksiyon sertleştirme", "Çift bileşenli sap", "Kaymaz kavrama"],
  },
  {
    id: 7,
    name: "Galvaniz Altı Köşe Cıvata M8 × 40 — 100'lü",
    category: "Bağlantı Elemanları",
    code: "BE-BAG-M8X40-100",
    price: 289,
    badge: "Stoktan teslim",
    rating: 4.8,
    reviews: 92,
    stock: 64,
    image: "/images/fasteners.jpg",
    description:
      "Montaj ve imalat işlerinde düzenli tüketim için ekonomik, ölçüsü net paketli bağlantı çözümü.",
    specs: ["M8 × 40 mm", "8.8 kalite", "Sarı galvaniz", "100 adet"],
  },
  {
    id: 8,
    name: "Isıya Dayanıklı Kaynakçı Eldiveni",
    category: "İş Güvenliği",
    code: "BE-IGV-KEL-01",
    price: 249,
    oldPrice: 299,
    badge: "Güvenli çalışma",
    rating: 4.6,
    reviews: 44,
    stock: 31,
    image: "/images/workshop.jpg",
    description:
      "Uzun konçlu yapısıyla kaynak ve sıcak işlerde el ile bilek bölgesinin korunmasına yardımcı olur.",
    specs: ["Isıya dayanıklı deri", "Uzun konç", "Takviyeli dikiş", "Tek beden"],
  },
];

const currency = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

const navItems = [
  ["Kategoriler", "#kategoriler"],
  ["Çok Satanlar", "#urunler"],
  ["Kurumsal", "#kurumsal"],
  ["Destek", "#destek"],
];

function scrollTo(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [sort, setSort] = useState("Önerilen");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickProduct, setQuickProduct] = useState<Product | null>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [toast, setToast] = useState("");
  const cartHydrated = useRef(false);

  useEffect(() => {
    const savedCart = window.localStorage.getItem("bizim-endustriyel-cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart) as CartItem[];
        queueMicrotask(() => {
          cartHydrated.current = true;
          setCart(parsedCart);
        });
      } catch {
        window.localStorage.removeItem("bizim-endustriyel-cart");
        cartHydrated.current = true;
      }
    } else {
      cartHydrated.current = true;
    }
  }, []);

  useEffect(() => {
    if (!cartHydrated.current) return;
    window.localStorage.setItem("bizim-endustriyel-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const hasOverlay = cartOpen || Boolean(quickProduct) || quoteOpen || mobileMenu;
    document.body.style.overflow = hasOverlay ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, quickProduct, quoteOpen, mobileMenu]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("tr-TR");
    const list = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "Tümü" || product.category === selectedCategory;
      const matchesSearch =
        !normalizedSearch ||
        `${product.name} ${product.category} ${product.code}`
          .toLocaleLowerCase("tr-TR")
          .includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });

    return [...list].sort((a, b) => {
      if (sort === "Fiyat: Artan") return a.price - b.price;
      if (sort === "Fiyat: Azalan") return b.price - a.price;
      if (sort === "En Yüksek Puan") return b.rating - a.rating;
      return b.reviews + b.rating * 20 - (a.reviews + a.rating * 20);
    });
  }, [search, selectedCategory, sort]);

  const searchMatches = useMemo(() => {
    if (!search.trim()) return [];
    return products
      .filter((product) =>
        `${product.name} ${product.category} ${product.code}`
          .toLocaleLowerCase("tr-TR")
          .includes(search.trim().toLocaleLowerCase("tr-TR")),
      )
      .slice(0, 4);
  }, [search]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const freeShippingLimit = 3000;
  const shippingProgress = Math.min((cartTotal / freeShippingLimit) * 100, 100);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...current, { ...product, quantity }];
    });
    setToast(`${product.name.split(" — ")[0]} sepete eklendi.`);
  };

  const updateQuantity = (id: number, change: number) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + change } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const chooseCategory = (name: string) => {
    setSelectedCategory(name);
    scrollTo("#urunler");
  };

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    setSearchOpen(false);
    scrollTo("#urunler");
  };

  const openCartInWhatsApp = () => {
    if (!cart.length) return;
    const lines = cart.map(
      (item) => `• ${item.quantity} × ${item.name} (${item.code})`,
    );
    const message = [
      "Merhaba Bizim Endüstriyel, aşağıdaki ürünler için sipariş desteği almak istiyorum:",
      "",
      ...lines,
      "",
      `Ara toplam: ${currency.format(cartTotal)}`,
      "",
      "Stok ve teslimat bilgisini paylaşabilir misiniz?",
    ].join("\n");
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div className="announcement">
        <div className="site-shell announcement-inner">
          <p><span className="signal-dot" /> Profesyonel tedarikte hızlı çözüm</p>
          <div className="announcement-links">
            <span>Toplu alıma özel teklif</span>
            <span>Kurumsal faturalama</span>
            <button type="button" onClick={() => setQuoteOpen(true)}>Satış ekibine ulaş <span>↗</span></button>
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="site-shell header-main">
          <button
            type="button"
            className="mobile-menu-button"
            aria-label="Menüyü aç"
            onClick={() => setMobileMenu(true)}
          >
            <span /> <span />
          </button>

          <a href="#top" className="brand" aria-label="Bizim Endüstriyel ana sayfa">
            <span className="brand-mark" aria-hidden="true"><b>B</b><b>E</b></span>
            <span className="brand-copy"><strong>BİZİM</strong><small>ENDÜSTRİYEL</small></span>
          </a>

          <form className="header-search" onSubmit={submitSearch}>
            <span className="search-symbol" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => window.setTimeout(() => setSearchOpen(false), 150)}
              placeholder="Ürün, kategori, ölçü veya stok kodu ara…"
              aria-label="Ürün ara"
            />
            <button type="submit">ARA</button>
            {searchOpen && search.trim() && (
              <div className="search-results">
                <div className="search-results-label">
                  <span>HIZLI SONUÇLAR</span>
                  <span>{searchMatches.length} eşleşme</span>
                </div>
                {searchMatches.length ? (
                  searchMatches.map((product) => (
                    <button
                      type="button"
                      className="search-result"
                      key={product.id}
                      onMouseDown={() => {
                        setQuickProduct(product);
                        setSearchOpen(false);
                      }}
                    >
                      <Image src={product.image} alt="" width={48} height={44} sizes="48px" />
                      <span><strong>{product.name}</strong><small>{product.code}</small></span>
                      <b>{currency.format(product.price)}</b>
                    </button>
                  ))
                ) : (
                  <p className="no-search-result">Aramanızla eşleşen ürün bulunamadı.</p>
                )}
              </div>
            )}
          </form>

          <div className="header-actions">
            <button type="button" className="support-link" onClick={() => setQuoteOpen(true)}>
              <span className="support-icon">?</span>
              <span><small>Satış danışmanı</small><strong>Uzmanına sor</strong></span>
            </button>
            <button type="button" className="cart-button" onClick={() => setCartOpen(true)}>
              <span>SEPET</span>
              <b>{cartCount}</b>
            </button>
          </div>
        </div>

        <nav className="category-nav" aria-label="Ana menü">
          <div className="site-shell category-nav-inner">
            <button type="button" className="all-products" onClick={() => scrollTo("#kategoriler")}>
              <span className="grid-symbol" aria-hidden="true"><i /><i /><i /><i /></span>
              TÜM KATEGORİLER
            </button>
            {navItems.map(([label, href]) => (
              <a href={href} key={href}>{label}</a>
            ))}
            <button type="button" className="nav-offer" onClick={() => setQuoteOpen(true)}>
              KURUMSAL TEKLİF <span>↗</span>
            </button>
          </div>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="site-shell hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><span>01</span> ENDÜSTRİYEL TEDARİK MASASI</div>
              <h1>İşiniz<br /><em>durmasın.</em></h1>
              <p>
                Atölyeden şantiyeye; profesyonel hırdavat, sarf malzemeleri ve
                doğru ürün desteği tek noktada.
              </p>
              <div className="hero-actions">
                <button type="button" className="button button-primary" onClick={() => scrollTo("#urunler")}>
                  ÜRÜNLERİ KEŞFET <span>→</span>
                </button>
                <button type="button" className="button button-ghost" onClick={() => setQuoteOpen(true)}>
                  HIZLI TEKLİF AL
                </button>
              </div>
              <div className="hero-proof">
                <div><strong>Aynı gün</strong><span>teklif dönüş hedefi</span></div>
                <div><strong>Tek noktadan</strong><span>çok kalemli tedarik</span></div>
                <div><strong>Uzman destek</strong><span>doğru ürün seçimi</span></div>
              </div>
            </div>
            <div className="hero-visual">
              <Image
                src="/images/hero-workbench.jpg"
                alt="Profesyonel bir atölyede endüstriyel el aletleri"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 48vw"
              />
              <div className="hero-image-shade" />
              <div className="hero-visual-topline">
                <span>BİZİM / PRO SERİ</span><span>2026</span>
              </div>
              <div className="hero-product-note">
                <span className="hero-note-index">01</span>
                <div><small>İŞİNİZE UYGUN ÜRÜN</small><strong>Stok ve uyumluluk teyidiyle</strong></div>
              </div>
              <button type="button" className="hero-help" onClick={() => setQuoteOpen(true)}>
                <span>Ürünü bulamadınız mı?</span><strong>Bize sorun <b>↗</b></strong>
              </button>
            </div>
          </div>
        </section>

        <section className="service-strip" aria-label="Hizmet avantajları">
          <div className="site-shell service-strip-inner">
            <div><span className="service-number">01</span><p><strong>GÜVENLİ SİPARİŞ</strong><small>Şeffaf fiyat ve stok bilgisi</small></p></div>
            <div><span className="service-number">02</span><p><strong>HIZLI SEVKİYAT</strong><small>Stok durumuna göre hızlı çıkış</small></p></div>
            <div><span className="service-number">03</span><p><strong>TEKNİK DESTEK</strong><small>Ürün seçiminde uzman yönlendirme</small></p></div>
            <div><span className="service-number">04</span><p><strong>TOPLU ALIM</strong><small>İşletmenize özel fiyatlandırma</small></p></div>
          </div>
        </section>

        <section className="section categories-section" id="kategoriler">
          <div className="site-shell">
            <div className="section-heading">
              <div>
                <div className="eyebrow"><span>02</span> ÜRÜN GRUPLARI</div>
                <h2>İhtiyacınız olan<br />doğru yerde.</h2>
              </div>
              <p>Profesyonel kullanım için seçilmiş ürün gruplarında hızlıca ilerleyin.</p>
            </div>
            <div className="category-grid">
              {categories.map((category, index) => (
                <button
                  type="button"
                  className={`category-card category-${index + 1}`}
                  key={category.name}
                  onClick={() => chooseCategory(category.name)}
                >
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    sizes="(max-width: 680px) 80vw, (max-width: 900px) 50vw, 34vw"
                  />
                  <span className="category-overlay" />
                  <span className="category-index">0{index + 1}</span>
                  <span className="category-content">
                    <small>{category.kicker}</small>
                    <strong>{category.name}</strong>
                    <em>{category.detail}</em>
                  </span>
                  <span className="category-arrow">↗</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section products-section" id="urunler">
          <div className="site-shell">
            <div className="section-heading product-heading">
              <div>
                <div className="eyebrow eyebrow-light"><span>03</span> USTALARIN SEPETİNDE</div>
                <h2>İşin temposuna<br />ayak uyduranlar.</h2>
              </div>
              <p>Günlük profesyonel kullanımda öne çıkan ürünleri karşılaştırın, hızlıca sepetinize ekleyin.</p>
            </div>

            <div className="catalog-toolbar">
              <div className="filter-tabs" role="tablist" aria-label="Ürün kategorileri">
                {["Tümü", "Elektrikli El Aletleri", "El Aletleri", "Kesici & Aşındırıcı", "Bağlantı Elemanları", "İş Güvenliği"].map((category) => (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={selectedCategory === category}
                    className={selectedCategory === category ? "active" : ""}
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <label className="sort-control">
                <span>SIRALA</span>
                <select value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option>Önerilen</option>
                  <option>Fiyat: Artan</option>
                  <option>Fiyat: Azalan</option>
                  <option>En Yüksek Puan</option>
                </select>
              </label>
            </div>

            {search && (
              <div className="active-search">
                <span>“{search}” için {filteredProducts.length} sonuç</span>
                <button type="button" onClick={() => setSearch("")}>Aramayı temizle ×</button>
              </div>
            )}

            <div className="product-grid">
              {filteredProducts.map((product) => {
                const discount = product.oldPrice
                  ? Math.round((1 - product.price / product.oldPrice) * 100)
                  : 0;
                const isFavorite = wishlist.includes(product.id);
                return (
                  <article className="product-card" key={product.id}>
                    <div className="product-image-wrap">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 680px) 100vw, (max-width: 1180px) 50vw, 25vw"
                      />
                      <span className="product-badge">{product.badge}</span>
                      {discount > 0 && <span className="discount-badge">−%{discount}</span>}
                      <button
                        type="button"
                        className={`favorite-button ${isFavorite ? "active" : ""}`}
                        aria-label={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
                        onClick={() =>
                          setWishlist((current) =>
                            isFavorite
                              ? current.filter((id) => id !== product.id)
                              : [...current, product.id],
                          )
                        }
                      >
                        {isFavorite ? "♥" : "♡"}
                      </button>
                      <button type="button" className="quick-view-button" onClick={() => setQuickProduct(product)}>
                        HIZLI İNCELE <span>↗</span>
                      </button>
                    </div>
                    <div className="product-info">
                      <div className="product-meta"><span>{product.category}</span><span>{product.code}</span></div>
                      <h3>{product.name}</h3>
                      <div className="product-rating" aria-label={`${product.rating} üzerinden 5 puan`}>
                        <span>★★★★★</span><b>{product.rating}</b><small>({product.reviews})</small>
                      </div>
                      <div className="product-bottom">
                        <div className="price-block">
                          {product.oldPrice && <del>{currency.format(product.oldPrice)}</del>}
                          <strong>{currency.format(product.price)}</strong>
                          <small>KDV dahil</small>
                        </div>
                        <div className="stock-block"><i /> Stokta</div>
                      </div>
                      <button type="button" className="add-button" onClick={() => addToCart(product)}>
                        SEPETE EKLE <span>+</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {!filteredProducts.length && (
              <div className="empty-products">
                <span>0</span>
                <h3>Aradığınız ürünü bulamadık.</h3>
                <p>Ürün kodunu veya fotoğrafını gönderin; satış ekibimiz alternatif bulsun.</p>
                <button type="button" className="button button-primary" onClick={() => setQuoteOpen(true)}>UZMANINA SOR</button>
              </div>
            )}

            <div className="catalog-note">
              <span>Gösterilen fiyat ve stok bilgileri örnek katalog içeriğidir.</span>
              <button type="button" onClick={() => setQuoteOpen(true)}>Güncel bilgi isteyin <b>↗</b></button>
            </div>
          </div>
        </section>

        <section className="trade-section" id="kurumsal">
          <div className="site-shell trade-grid">
            <div className="trade-image">
              <Image
                src="/images/workshop.jpg"
                alt="Endüstriyel bakım atölyesi ve çalışma masası"
                fill
                sizes="(max-width: 900px) 100vw, 47vw"
              />
              <div className="trade-stamp"><span>B2B</span><small>KURUMSAL<br />TEDARİK</small></div>
            </div>
            <div className="trade-copy">
              <div className="eyebrow eyebrow-light"><span>04</span> SATIN ALMA EKİPLERİ İÇİN</div>
              <h2>Listeyi gönderin.<br /><em>Gerisini biz çözelim.</em></h2>
              <p>
                Düzenli veya yüksek adetli alımlarınızda ürün listenizi paylaşın;
                muadil, termin ve fiyat seçeneklerini tek teklifte değerlendirelim.
              </p>
              <div className="trade-benefits">
                <div><span>01</span><strong>Çok kalemli teklif</strong><small>Farklı ürün gruplarını tek listede yönetin.</small></div>
                <div><span>02</span><strong>Muadil ürün desteği</strong><small>Bütçenize ve uygulamanıza uygun alternatifler.</small></div>
                <div><span>03</span><strong>Planlı sevkiyat</strong><small>Proje takviminize göre teslimat görüşmesi.</small></div>
              </div>
              <button type="button" className="button button-orange" onClick={() => setQuoteOpen(true)}>
                TEKLİF TALEBİ OLUŞTUR <span>→</span>
              </button>
            </div>
          </div>
        </section>

        <section className="section process-section">
          <div className="site-shell">
            <div className="section-heading compact-heading">
              <div>
                <div className="eyebrow"><span>05</span> BİZİM FARKIMIZ</div>
                <h2>Sadece ürün değil,<br />doğru çözüm.</h2>
              </div>
              <p>Aradığınız parçayı bulmaktan sipariş sonrasına kadar satın alma sürecini sadeleştiriyoruz.</p>
            </div>
            <div className="process-grid">
              <article>
                <span className="process-index">01</span>
                <div className="process-icon"><span className="search-symbol" /></div>
                <h3>İhtiyacı anlayalım</h3>
                <p>Ölçü, kullanım alanı veya ürün kodunu paylaşın; doğru kategoriyi netleştirelim.</p>
                <button type="button" onClick={() => setQuoteOpen(true)}>Destek al <span>↗</span></button>
              </article>
              <article>
                <span className="process-index">02</span>
                <div className="process-icon process-icon-box"><i /></div>
                <h3>Seçenekleri sunalım</h3>
                <p>Fiyat, performans ve termin dengesine göre uygun alternatifleri birlikte değerlendirin.</p>
                <button type="button" onClick={() => scrollTo("#urunler")}>Ürünlere bak <span>↗</span></button>
              </article>
              <article>
                <span className="process-index">03</span>
                <div className="process-icon process-icon-check">✓</div>
                <h3>İşi tamamlayalım</h3>
                <p>Siparişinizi teyit edelim, sevkiyat sürecini anlaşılır biçimde takip edin.</p>
                <button type="button" onClick={() => setCartOpen(true)}>Sepeti aç <span>↗</span></button>
              </article>
            </div>
          </div>
        </section>

        <section className="find-product">
          <div className="site-shell find-product-inner">
            <div className="find-visual">
              <Image
                src="/images/fasteners.jpg"
                alt="Farklı ölçülerde metal bağlantı elemanları"
                fill
                sizes="(max-width: 680px) 100vw, 42vw"
              />
              <span className="finder-cross cross-one">+</span>
              <span className="finder-cross cross-two">+</span>
            </div>
            <div className="find-copy">
              <span className="micro-label">BULAMADIĞINIZ ÜRÜN MÜ VAR?</span>
              <h2>Fotoğrafını çekin,<br />uzmanına sorun.</h2>
              <p>Ürün fotoğrafını, ölçüsünü ya da stok kodunu paylaşın. Uyumlu ürünü birlikte bulalım.</p>
              <button type="button" className="button button-primary" onClick={() => setQuoteOpen(true)}>
                ÜRÜN DESTEĞİ AL <span>↗</span>
              </button>
            </div>
          </div>
        </section>

        <section className="section faq-section" id="destek">
          <div className="site-shell faq-grid">
            <div className="faq-intro">
              <div className="eyebrow"><span>06</span> SIK SORULANLAR</div>
              <h2>Siparişten önce<br />aklınızda kalmasın.</h2>
              <p>Başka bir sorunuz varsa ürün veya proje detayını satış ekibimize iletin.</p>
              <button type="button" className="text-link" onClick={() => setQuoteOpen(true)}>SATIŞ EKİBİNE SOR <span>↗</span></button>
            </div>
            <div className="faq-list">
              <details open>
                <summary>Bireysel ve kurumsal sipariş verebilir miyim?<span>+</span></summary>
                <p>Evet. Bireysel alışveriş yapabilir veya şirket bilgilerinizle kurumsal fatura talep edebilirsiniz.</p>
              </details>
              <details>
                <summary>Toplu alımlarda özel fiyat sunuluyor mu?<span>+</span></summary>
                <p>Yüksek adetli ve düzenli alımlar için ürün listenizi ileterek işletmenize özel teklif isteyebilirsiniz.</p>
              </details>
              <details>
                <summary>Doğru ölçü veya modeli seçtiğimden emin değilim.<span>+</span></summary>
                <p>Kullanım alanını, ölçüyü veya ürünün fotoğrafını paylaşın; uyumlu seçeneği belirlemenize yardımcı olalım.</p>
              </details>
              <details>
                <summary>Siparişim ne zaman sevk edilir?<span>+</span></summary>
                <p>Sevk süresi stok, sipariş saati ve ürün grubuna göre değişir. Sipariş öncesinde güncel termin bilgisi teyit edilir.</p>
              </details>
              <details>
                <summary>İade veya değişim yapabilir miyim?<span>+</span></summary>
                <p>Kullanılmamış ürünler geçerli mevzuat ve satış koşulları kapsamında değerlendirilir; özel hazırlanan ürünlerde farklı koşullar uygulanabilir.</p>
              </details>
            </div>
          </div>
        </section>

        <section className="closing-cta">
          <div className="site-shell closing-inner">
            <div>
              <span className="micro-label">İŞİNİZ İÇİN GEREKEN HER ŞEY</span>
              <h2>Tek siparişte.<br /><em>Doğru zamanda.</em></h2>
            </div>
            <div className="closing-action">
              <p>Profesyonel ürünleri keşfedin veya listeniz için hızlı teklif alın.</p>
              <div>
                <button type="button" className="button button-primary" onClick={() => scrollTo("#urunler")}>ALIŞVERİŞE BAŞLA <span>→</span></button>
                <button type="button" className="button button-outline-light" onClick={() => setQuoteOpen(true)}>UZMANDAN DESTEK AL</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-shell footer-grid">
          <div className="footer-brand">
            <a href="#top" className="brand brand-light" aria-label="Bizim Endüstriyel ana sayfa">
              <span className="brand-mark" aria-hidden="true"><b>B</b><b>E</b></span>
              <span className="brand-copy"><strong>BİZİM</strong><small>ENDÜSTRİYEL</small></span>
            </a>
            <p>Atölyeden şantiyeye, profesyonel hırdavat ve endüstriyel tedarikte çözüm ortağınız.</p>
            <button type="button" className="footer-support" onClick={() => setQuoteOpen(true)}>
              <span>?</span><div><small>Bir sorunuz mu var?</small><strong>Uzmanına sorun ↗</strong></div>
            </button>
          </div>
          <div>
            <h3>ÜRÜNLER</h3>
            <button type="button" onClick={() => chooseCategory("Elektrikli El Aletleri")}>Elektrikli El Aletleri</button>
            <button type="button" onClick={() => chooseCategory("El Aletleri")}>El Aletleri</button>
            <button type="button" onClick={() => chooseCategory("Kesici & Aşındırıcı")}>Kesici & Aşındırıcı</button>
            <button type="button" onClick={() => chooseCategory("Bağlantı Elemanları")}>Bağlantı Elemanları</button>
            <button type="button" onClick={() => chooseCategory("İş Güvenliği")}>İş Güvenliği</button>
          </div>
          <div>
            <h3>HIZLI ERİŞİM</h3>
            <a href="#kurumsal">Kurumsal Alım</a>
            <button type="button" onClick={() => setQuoteOpen(true)}>Teklif Talebi</button>
            <a href="#destek">Sık Sorulanlar</a>
            <button type="button" onClick={() => setCartOpen(true)}>Sepetim</button>
            <a href="#top">Ana Sayfa</a>
          </div>
          <div className="footer-newsletter">
            <h3>İŞİN ÖNÜNDE KALIN</h3>
            <p>Kampanya, yeni ürün ve toplu alım avantajlarından haberdar olun.</p>
            <form onSubmit={(event) => { event.preventDefault(); setToast("E-posta talebiniz alındı."); }}>
              <input type="email" placeholder="E-posta adresiniz" aria-label="E-posta adresiniz" required />
              <button type="submit" aria-label="E-posta listesine katıl">→</button>
            </form>
            <small>Kaydolarak iletişim izni koşullarını kabul etmiş olursunuz.</small>
          </div>
        </div>
        <div className="site-shell footer-bottom">
          <p>© 2026 Bizim Endüstriyel. Tüm hakları saklıdır.</p>
          <p>Bu sürümdeki ürün, fiyat, stok ve kampanya bilgileri temsili içeriktir.</p>
          <div><a href="#top">Gizlilik</a><a href="#top">Mesafeli Satış</a><a href="#top">KVKK</a></div>
        </div>
      </footer>

      <div className="mobile-bottom-bar">
        <button type="button" onClick={() => setQuoteOpen(true)}>UZMANINA SOR</button>
        <button type="button" onClick={() => setCartOpen(true)}>SEPET <span>{cartCount}</span></button>
      </div>

      <button type="button" className="floating-help" onClick={() => setQuoteOpen(true)}>
        <span className="floating-pulse">?</span>
        <span><small>DOĞRU ÜRÜNÜ BULUN</small><strong>Uzmanına Sor</strong></span>
      </button>

      {cartOpen && (
        <div className="overlay">
          <button type="button" className="overlay-backdrop" aria-label="Sepeti kapat" onClick={() => setCartOpen(false)} />
          <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Sepetim">
            <div className="drawer-header">
              <div><span>SEPETİM</span><small>{cartCount} ürün</small></div>
              <button type="button" aria-label="Sepeti kapat" onClick={() => setCartOpen(false)}>×</button>
            </div>
            {cart.length ? (
              <>
                <div className="shipping-progress">
                  {cartTotal >= freeShippingLimit ? (
                    <p><strong>Harika!</strong> Ücretsiz kargo eşiğini aştınız.</p>
                  ) : (
                    <p>Ücretsiz kargo için <strong>{currency.format(freeShippingLimit - cartTotal)}</strong> daha ekleyin.</p>
                  )}
                  <div><span style={{ width: `${shippingProgress}%` }} /></div>
                </div>
                <div className="cart-items">
                  {cart.map((item) => (
                    <article className="cart-item" key={item.id}>
                      <Image src={item.image} alt="" width={78} height={86} sizes="78px" />
                      <div className="cart-item-info">
                        <small>{item.code}</small>
                        <h3>{item.name}</h3>
                        <div className="quantity-control">
                          <button type="button" aria-label={`${item.name} adedini azalt`} onClick={() => updateQuantity(item.id, -1)}>−</button>
                          <span>{item.quantity}</span>
                          <button type="button" aria-label={`${item.name} adedini artır`} onClick={() => updateQuantity(item.id, 1)}>+</button>
                        </div>
                      </div>
                      <strong>{currency.format(item.price * item.quantity)}</strong>
                    </article>
                  ))}
                </div>
                <div className="cart-summary">
                  <div><span>Ara toplam</span><strong>{currency.format(cartTotal)}</strong></div>
                  <p>Kargo ve kesin stok bilgisi sipariş teyidinde netleşir.</p>
                  <button type="button" onClick={openCartInWhatsApp}>SİPARİŞ DESTEĞİ AL <span>↗</span></button>
                  <button type="button" className="continue-shopping" onClick={() => setCartOpen(false)}>Alışverişe devam et</button>
                </div>
              </>
            ) : (
              <div className="empty-cart">
                <span className="empty-cart-icon">0</span>
                <h3>Sepetiniz henüz boş.</h3>
                <p>İşiniz için gereken ürünleri keşfedin; tek tıkla sepetinize ekleyin.</p>
                <button type="button" className="button button-primary" onClick={() => { setCartOpen(false); scrollTo("#urunler"); }}>ÜRÜNLERİ KEŞFET</button>
              </div>
            )}
          </aside>
        </div>
      )}

      {quickProduct && (
        <div className="overlay modal-overlay">
          <button type="button" className="overlay-backdrop" aria-label="Hızlı incelemeyi kapat" onClick={() => setQuickProduct(null)} />
          <div className="quick-modal" role="dialog" aria-modal="true" aria-labelledby="quick-product-title">
            <button type="button" className="modal-close" aria-label="Hızlı incelemeyi kapat" onClick={() => setQuickProduct(null)}>×</button>
            <div className="quick-image">
              <Image
                src={quickProduct.image}
                alt={quickProduct.name}
                fill
                sizes="(max-width: 680px) 100vw, 52vw"
              />
              <span>{quickProduct.badge}</span>
            </div>
            <div className="quick-copy">
              <div className="product-meta"><span>{quickProduct.category}</span><span>{quickProduct.code}</span></div>
              <h2 id="quick-product-title">{quickProduct.name}</h2>
              <div className="quick-rating"><span>★★★★★</span><strong>{quickProduct.rating}</strong><small>{quickProduct.reviews} değerlendirme</small></div>
              <p>{quickProduct.description}</p>
              <ul>{quickProduct.specs.map((spec) => <li key={spec}><span>✓</span>{spec}</li>)}</ul>
              <div className="quick-price">
                <div>{quickProduct.oldPrice && <del>{currency.format(quickProduct.oldPrice)}</del>}<strong>{currency.format(quickProduct.price)}</strong><small>KDV dahil</small></div>
                <span><i /> Stokta · {quickProduct.stock} adet</span>
              </div>
              <button type="button" className="add-button" onClick={() => { addToCart(quickProduct); setQuickProduct(null); setCartOpen(true); }}>
                SEPETE EKLE <span>+</span>
              </button>
              <button type="button" className="quick-offer" onClick={() => { setQuickProduct(null); setQuoteOpen(true); }}>Bu ürün için toplu fiyat iste ↗</button>
            </div>
          </div>
        </div>
      )}

      {quoteOpen && (
        <div className="overlay modal-overlay">
          <button type="button" className="overlay-backdrop" aria-label="Teklif formunu kapat" onClick={() => setQuoteOpen(false)} />
          <div className="quote-modal" role="dialog" aria-modal="true" aria-labelledby="quote-title">
            <button type="button" className="modal-close" aria-label="Teklif formunu kapat" onClick={() => setQuoteOpen(false)}>×</button>
            <div className="quote-intro">
              <span className="micro-label">HIZLI TEKLİF MASASI</span>
              <h2 id="quote-title">İhtiyacınızı anlatın,<br />birlikte çözelim.</h2>
              <p>Ürün adı, ölçü, adet veya fotoğraf bilgisiyle başlayın. Formunuz WhatsApp üzerinden paylaşılmaya hazır hale gelir.</p>
              <div className="quote-points"><span>✓ Ürün seçimi desteği</span><span>✓ Toplu alım fiyatı</span><span>✓ Termin alternatifi</span></div>
            </div>
            <form className="quote-form" onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const message = [
                "Merhaba Bizim Endüstriyel, teklif almak istiyorum.",
                "",
                `Ad Soyad: ${form.get("name")}`,
                `Firma: ${form.get("company") || "Belirtilmedi"}`,
                `Telefon: ${form.get("phone")}`,
                `E-posta: ${form.get("email") || "Belirtilmedi"}`,
                "",
                `Talep: ${form.get("request")}`,
              ].join("\n");
              window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
              setQuoteOpen(false);
            }}>
              <div className="form-row">
                <label><span>AD SOYAD *</span><input name="name" required placeholder="Adınız Soyadınız" /></label>
                <label><span>FİRMA</span><input name="company" placeholder="Firma adı" /></label>
              </div>
              <div className="form-row">
                <label><span>TELEFON *</span><input name="phone" type="tel" required placeholder="05__ ___ __ __" /></label>
                <label><span>E-POSTA</span><input name="email" type="email" placeholder="ornek@firma.com" /></label>
              </div>
              <label><span>ÜRÜN / TALEP DETAYI *</span><textarea name="request" required rows={5} placeholder="Ürün adı, stok kodu, ölçü, adet veya kullanım alanı…" /></label>
              <label className="consent"><input type="checkbox" required /><span>İletişim bilgilerimin teklif süreci için kullanılmasını kabul ediyorum.</span></label>
              <button type="submit" className="button button-primary">TALEBİ WHATSAPP&apos;TA PAYLAŞ <span>↗</span></button>
            </form>
          </div>
        </div>
      )}

      {mobileMenu && (
        <div className="overlay mobile-menu-overlay">
          <button type="button" className="overlay-backdrop" aria-label="Menüyü kapat" onClick={() => setMobileMenu(false)} />
          <nav className="mobile-menu" aria-label="Mobil menü">
            <div className="drawer-header"><span>MENÜ</span><button type="button" aria-label="Menüyü kapat" onClick={() => setMobileMenu(false)}>×</button></div>
            {navItems.map(([label, href], index) => (
              <a href={href} key={href} onClick={() => setMobileMenu(false)}><span>0{index + 1}</span>{label}<b>↗</b></a>
            ))}
            <button type="button" className="button button-primary" onClick={() => { setMobileMenu(false); setQuoteOpen(true); }}>HIZLI TEKLİF AL</button>
          </nav>
        </div>
      )}

      <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite">
        <span>✓</span>{toast}
      </div>
    </>
  );
}
