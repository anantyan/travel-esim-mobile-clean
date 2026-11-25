import type {
  EsimProductType,
  EsimRegion,
} from "@/domain/entities/esim-product.entity";

export interface RawEsimProductDto {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly region: EsimRegion;
  readonly type: EsimProductType;
  readonly quota_label: string;
  readonly active_days: number;
  readonly price_idr: number;
  readonly description: string;
  readonly image_url: string;
  readonly features: readonly string[];
  readonly coverage_countries: readonly string[];
  readonly gallery_urls: readonly string[];
  readonly data_size_options: readonly string[];
  readonly day_options: readonly number[];
}

export interface RawPaymentMethodDto {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly category: "balance" | "virtual_account" | "ewallet" | "qris";
  readonly fee_idr: number;
  readonly balance_idr?: number;
  readonly description: string;
}

export const STATIC_ESIM_PRODUCTS: readonly RawEsimProductDto[] = [
  {
    id: "esim-sg-7d",
    slug: "esim-singapore",
    name: "eSIM Singapore",
    region: "asia",
    type: "instant",
    quota_label: "3 GB",
    active_days: 7,
    price_idr: 69000,
    description:
      "Koneksi 5G/4G LTE langsung aktif di Singapura via Singtel & StarHub tanpa kartu fisik.",
    image_url:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80",
    features: [
      "SIM/eSIM dengan koneksi cepat hingga 4G.",
      "SIM tersedia dalam tiga ukuran; eSIM dilengkapi dengan kode QR dan petunjuk pemasangan.",
      "Terhubung ke operator terbaik untuk cakupan dan kecepatan optimal.",
      "Masa berlaku data dimulai saat pertama kali digunakan di negara tujuan.",
      "Paket mulai dari 500MB/hari hingga 30GB/bulan, dengan durasi dari 1 hari hingga 1 bulan.",
    ],
    coverage_countries: ["Singapore"],
    gallery_urls: [
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1508964942454-1a56651d54ac?auto=format&fit=crop&w=600&q=80",
    ],
    data_size_options: ["3GB", "5GB", "10GB", "15GB"],
    day_options: [7, 14, 24, 30],
  },
  {
    id: "esim-id-7d",
    slug: "esim-indonesia",
    name: "eSIM Indonesia",
    region: "asia",
    type: "topupable",
    quota_label: "5 GB",
    active_days: 7,
    price_idr: 52000,
    description:
      "Paket data lokal Nusantara dengan dukungan top-up kuota kapan saja di seluruh Indonesia.",
    image_url:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
    features: [
      "Bisa Top-Up Kuota kapan saja sebelum masa aktif berakhir.",
      "Cakupan nasional 4G/5G di kota besar dan destinasi wisata.",
      "Aktivasi langsung via kode QR tanpa registrasi kartu fisik.",
      "Masa berlaku data dimulai saat pertama kali terhubung di jaringan lokal.",
      "Mendukung tethering/hotspot untuk perangkat lain.",
    ],
    coverage_countries: ["Indonesia"],
    gallery_urls: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=600&q=80",
    ],
    data_size_options: ["3GB", "5GB", "10GB", "15GB"],
    day_options: [7, 14, 24, 30],
  },
  {
    id: "esim-us-10d",
    slug: "esim-usa",
    name: "eSIM USA",
    region: "america",
    type: "instant",
    quota_label: "10 GB",
    active_days: 14,
    price_idr: 185000,
    description:
      "Internet berkecepatan tinggi di seluruh negara bagian Amerika Serikat via T-Mobile & AT&T.",
    image_url:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80",
    features: [
      "Aktivasi QR Instan langsung siap pakai saat mendarat.",
      "Dual carrier otomatis T-Mobile & AT&T untuk sinyal stabil.",
      "Bebas biaya roaming internasional selama perjalanan.",
      "Masa berlaku aktif otomatis saat pertama kali dipakai.",
      "Mendukung tethering/hotspot tanpa batas kecepatan.",
    ],
    coverage_countries: ["United States"],
    gallery_urls: [
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80",
    ],
    data_size_options: ["3GB", "5GB", "10GB", "15GB"],
    day_options: [7, 14, 24, 30],
  },
  {
    id: "esim-kr-7d",
    slug: "esim-south-korea",
    name: "eSIM South Korea",
    region: "asia",
    type: "topupable",
    quota_label: "5 GB",
    active_days: 7,
    price_idr: 98000,
    description:
      "Akses data stabil di Seoul, Busan, hingga Pulau Jeju dengan dukungan top-up masa aktif.",
    image_url:
      "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=600&q=80",
    features: [
      "Bisa Top-Up Kuota dan perpanjang masa aktif secara instan.",
      "Terhubung ke jaringan SK Telecom 5G berkecepatan tinggi.",
      "Dilengkapi kode QR dan panduan aktivasi iOS & Android.",
      "Cocok untuk navigasi Naver Map dan transaksi harian.",
      "Tethering lancar untuk laptop dan tablet.",
    ],
    coverage_countries: ["South Korea"],
    gallery_urls: [
      "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=600&q=80",
    ],
    data_size_options: ["3GB", "5GB", "10GB", "15GB"],
    day_options: [7, 14, 24, 30],
  },
  {
    id: "esim-au-10d",
    slug: "esim-australia",
    name: "eSIM Australia",
    region: "oceania",
    type: "instant",
    quota_label: "10 GB",
    active_days: 14,
    price_idr: 145000,
    description:
      "Jaringan Optus & Telstra siap pakai untuk perjalanan bisnis maupun liburan ke Australia.",
    image_url:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80",
    features: [
      "Aktivasi QR Instan tanpa perlu ke gerai operator.",
      "Cakupan Sydney, Melbourne, Perth, hingga area regional.",
      "Bebas biaya tersembunyi dan tidak memerlukan kartu fisik.",
      "Masa berlaku aktif saat tersambung ke jaringan Australia.",
      "Mendukung tethering/hotspot penuh.",
    ],
    coverage_countries: ["Australia"],
    gallery_urls: [
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=600&q=80",
    ],
    data_size_options: ["3GB", "5GB", "10GB", "15GB"],
    day_options: [7, 14, 24, 30],
  },
  {
    id: "esim-eu-14d",
    slug: "esim-europe-multi",
    name: "eSIM Europe 30 Countries",
    region: "europe",
    type: "topupable",
    quota_label: "15 GB",
    active_days: 14,
    price_idr: 235000,
    description:
      "Satu eSIM untuk 30+ negara Uni Eropa & Inggris dengan perpindahan jaringan otomatis.",
    image_url:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
    features: [
      "Cakupan 30+ negara Schengen, Swiss, dan Inggris.",
      "Bisa Top-Up Kuota kapan pun selama perjalanan lintas negara.",
      "Perpindahan operator otomatis saat melintasi perbatasan.",
      "Kecepatan 5G/4G LTE untuk peta dan pemesanan tiket.",
      "Panduan instalasi lengkap via email.",
    ],
    coverage_countries: [
      "France",
      "Germany",
      "Italy",
      "Netherlands",
      "Spain",
      "Switzerland",
      "United Kingdom",
    ],
    gallery_urls: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=600&q=80",
    ],
    data_size_options: ["3GB", "5GB", "10GB", "15GB"],
    day_options: [7, 14, 24, 30],
  },
  {
    id: "esim-za-7d",
    slug: "esim-south-africa",
    name: "eSIM South Africa",
    region: "africa",
    type: "instant",
    quota_label: "5 GB",
    active_days: 7,
    price_idr: 165000,
    description:
      "Koneksi andal di Cape Town, Johannesburg, dan area wisata safari tanpa ganti kartu fisik.",
    image_url:
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=600&q=80",
    features: [
      "Aktivasi QR Instan sebelum keberangkatan.",
      "Terhubung ke jaringan Vodacom dengan sinyal kuat.",
      "Dukungan pelanggan 24/7 via WhatsApp & Email.",
      "Masa berlaku dimulai saat pertama kali terhubung.",
      "Mendukung tethering/hotspot.",
    ],
    coverage_countries: ["South Africa"],
    gallery_urls: [
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=600&q=80",
    ],
    data_size_options: ["3GB", "5GB", "10GB", "15GB"],
    day_options: [7, 14, 24, 30],
  },
];

export const STATIC_PAYMENT_METHODS: readonly RawPaymentMethodDto[] = [
  {
    id: "pm-saldo",
    code: "SALDO",
    name: "Saldo",
    category: "balance",
    fee_idr: 500,
    balance_idr: 200000,
    description: "Pembayaran instan menggunakan saldo akun MKP Mobile",
  },
  {
    id: "pm-bca-va",
    code: "BCA_VA",
    name: "VA BCA",
    category: "virtual_account",
    fee_idr: 2500,
    description: "Verifikasi otomatis melalui m-BCA atau KlikBCA",
  },
  {
    id: "pm-mandiri-va",
    code: "MANDIRI_VA",
    name: "VA Mandiri",
    category: "virtual_account",
    fee_idr: 2500,
    description: "Pembayaran mudah melalui aplikasi Livin' by Mandiri",
  },
  {
    id: "pm-bri-va",
    code: "BRI_VA",
    name: "VA BRI",
    category: "virtual_account",
    fee_idr: 2500,
    description: "Pembayaran praktis melalui BRImo atau ATM BRI",
  },
];
