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
}

export interface RawPaymentMethodDto {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly category: "ewallet" | "virtual_account" | "qris";
  readonly fee_idr: number;
  readonly description: string;
}

export const STATIC_ESIM_PRODUCTS: readonly RawEsimProductDto[] = [
  {
    id: "esim-sg-7d",
    slug: "esim-singapore",
    name: "eSIM Singapore",
    region: "asia",
    type: "instant",
    quota_label: "10 GB",
    active_days: 7,
    price_idr: 69000,
    description:
      "Koneksi 5G/4G LTE langsung aktif di Singapura via Singtel & StarHub tanpa kartu fisik.",
    image_url: "https://picsum.photos/seed/esim-singapore-marina/600/450",
    features: [
      "Aktivasi QR Instan",
      "Jaringan 5G Singtel",
      "Hotspot / Tethering Aktif",
    ],
  },
  {
    id: "esim-id-7d",
    slug: "esim-indonesia",
    name: "eSIM Indonesia",
    region: "asia",
    type: "topupable",
    quota_label: "15 GB",
    active_days: 7,
    price_idr: 52000,
    description:
      "Paket data lokal Nusantara dengan dukungan top-up kuota kapan saja di seluruh Indonesia.",
    image_url: "https://picsum.photos/seed/esim-indonesia-bali/600/450",
    features: [
      "Bisa Top-Up Kuota",
      "Cakupan Nasional 4G/5G",
      "Tanpa Registrasi KTP Ulang",
    ],
  },
  {
    id: "esim-us-10d",
    slug: "esim-usa",
    name: "eSIM USA",
    region: "america",
    type: "instant",
    quota_label: "20 GB",
    active_days: 10,
    price_idr: 185000,
    description:
      "Internet berkecepatan tinggi di seluruh negara bagian Amerika Serikat via T-Mobile & AT&T.",
    image_url: "https://picsum.photos/seed/esim-usa-manhattan/600/450",
    features: [
      "Aktivasi QR Instan",
      "Dual Carrier T-Mobile/AT&T",
      "Bebas Roaming",
    ],
  },
  {
    id: "esim-kr-7d",
    slug: "esim-south-korea",
    name: "eSIM South Korea",
    region: "asia",
    type: "topupable",
    quota_label: "12 GB",
    active_days: 7,
    price_idr: 98000,
    description:
      "Akses data stabil di Seoul, Busan, hingga Pulau Jeju dengan dukungan top-up masa aktif.",
    image_url: "https://picsum.photos/seed/esim-korea-seoul/600/450",
    features: [
      "Bisa Top-Up Kuota",
      "Jaringan SK Telecom 5G",
      "Tethering Lancar",
    ],
  },
  {
    id: "esim-au-10d",
    slug: "esim-australia",
    name: "eSIM Australia",
    region: "oceania",
    type: "instant",
    quota_label: "10 GB",
    active_days: 10,
    price_idr: 145000,
    description:
      "Jaringan Optus & Telstra siap pakai untuk perjalanan bisnis maupun liburan ke Australia.",
    image_url: "https://picsum.photos/seed/esim-australia-sydney/600/450",
    features: [
      "Aktivasi QR Instan",
      "Cakupan Kota & Regional",
      "Bebas Biaya Tersembunyi",
    ],
  },
  {
    id: "esim-eu-14d",
    slug: "esim-europe-multi",
    name: "eSIM Europe 30 Countries",
    region: "europe",
    type: "topupable",
    quota_label: "25 GB",
    active_days: 14,
    price_idr: 235000,
    description:
      "Satu eSIM untuk 30+ negara Uni Eropa & Inggris dengan perpindahan jaringan otomatis.",
    image_url: "https://picsum.photos/seed/esim-europe-paris/600/450",
    features: [
      "Multi-Negara Schengen",
      "Bisa Top-Up Kuota",
      "Kecepatan 5G/4G LTE",
    ],
  },
  {
    id: "esim-za-7d",
    slug: "esim-south-africa",
    name: "eSIM South Africa",
    region: "africa",
    type: "instant",
    quota_label: "8 GB",
    active_days: 7,
    price_idr: 165000,
    description:
      "Koneksi andal di Cape Town, Johannesburg, dan area wisata safari tanpa ganti kartu fisik.",
    image_url: "https://picsum.photos/seed/esim-africa-capetown/600/450",
    features: ["Aktivasi QR Instan", "Jaringan Vodacom", "Support 24/7"],
  },
];

export const STATIC_PAYMENT_METHODS: readonly RawPaymentMethodDto[] = [
  {
    id: "pm-qris",
    code: "QRIS",
    name: "QRIS Instan",
    category: "qris",
    fee_idr: 0,
    description: "Bayar via GoPay, OVO, Dana, ShopeePay, atau Mobile Banking",
  },
  {
    id: "pm-bca-va",
    code: "BCA_VA",
    name: "BCA Virtual Account",
    category: "virtual_account",
    fee_idr: 2500,
    description: "Verifikasi otomatis melalui m-BCA atau KlikBCA",
  },
  {
    id: "pm-mandiri-va",
    code: "MANDIRI_VA",
    name: "Mandiri Virtual Account",
    category: "virtual_account",
    fee_idr: 2500,
    description: "Pembayaran mudah melalui aplikasi Livin' by Mandiri",
  },
  {
    id: "pm-gopay",
    code: "GOPAY",
    name: "GoPay E-Wallet",
    category: "ewallet",
    fee_idr: 1000,
    description: "Redirect instan ke aplikasi Gojek",
  },
];
