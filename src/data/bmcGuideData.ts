export interface BmcBlockGuide {
  key: string;
  number: number;
  titleId: string;
  titleEn: string;
  shortDesc: string;
  definition: string;
  guidingQuestions: string[];
  typesAndCategories: { title: string; desc: string }[];
  realWorldExamples: { company: string; category: string; description: string }[];
  quickInsertComponents: { title: string; description: string; tag: string }[];
  commonMistakes: string[];
}

export const BMC_GUIDE_DATA: BmcBlockGuide[] = [
  {
    key: 'customerSegments',
    number: 1,
    titleId: 'Segmen Pelanggan',
    titleEn: 'Customer Segments',
    shortDesc: 'Siapa kelompok orang atau organisasi berbeda yang ingin dijangkau dan dilayani perusahaan.',
    definition:
      'Segmen Pelanggan adalah jantung dari setiap model bisnis. Tanpa pelanggan yang menguntungkan, perusahaan tidak dapat bertahan lama. Bisnis dapat mengelompokkan pelanggan ke dalam segmen berbeda berdasarkan kebutuhan, perilaku, atau atribut tertentu.',
    guidingQuestions: [
      'Untuk siapa kita menciptakan nilai paling signifikan?',
      'Siapa pelanggan kita yang paling penting (pembayar utama vs pengguna akhir)?',
      'Apakah pasar kita bersifat massal (Mass Market), ceruk (Niche Market), terfragmentasi (Segmented), terdiversifikasi, atau multi-sisi (Multi-sided Platform)?',
      'Apa karakteristik demografis, psikografis, dan pekerjaan utama mereka (Jobs to be Done)?',
    ],
    typesAndCategories: [
      {
        title: 'Mass Market (Pasar Massal)',
        desc: 'Tidak membedakan segmen pelanggan; fokus pada kelompok besar orang dengan kebutuhan serupa (cth: elektronik konsumen umum).',
      },
      {
        title: 'Niche Market (Pasar Ceruk)',
        desc: 'Melayani segmen spesifik dan terspesialisasi tinggi dengan karakteristik khusus (cth: suku cadang mobil balap).',
      },
      {
        title: 'Multi-sided Platforms (Pasar Multi-Sisi)',
        desc: 'Melayani dua atau lebih segmen yang saling bergantung (cth: Airbnb melayani Host dan Traveler; Uber melayani Driver dan Penumpang).',
      },
      {
        title: 'Segmented (Terdiferensiasi)',
        desc: 'Membedakan kelompok pelanggan dengan kebutuhan yang sedikit berbeda (cth: Nasabah perbankan ritel vs nasabah prioritas).',
      },
    ],
    realWorldExamples: [
      {
        company: 'Spotify',
        category: 'Multi-Sisi',
        description: 'Pendengar musik gratis (didukung iklan), pendengar musik berbayar (Premium), dan kreator/musisi/label rekaman.',
      },
      {
        company: 'Tesla',
        category: 'Niche to Mass',
        description: 'Awalnya early adopters ramah lingkungan kelas atas (Roadster/Model S), berkembang ke pasar keluarga modern (Model 3/Y).',
      },
      {
        company: 'Slack / B2B SaaS',
        category: 'B2B SMB & Enterprise',
        description: 'Tim teknis dan produk di perusahaan rintisan serta divisi korporat multinasional.',
      },
    ],
    quickInsertComponents: [
      {
        title: 'Usaha Mikro, Kecil & Menengah (UMKM)',
        description: 'Pemilik bisnis lokal yang membutuhkan digitalisasi operasional dengan anggaran efisien.',
        tag: 'B2B SMB',
      },
      {
        title: 'Profesional Urban & Remote Workers (22-38 Tahun)',
        description: 'Pekerja digital dengan mobilitas tinggi yang mengutamakan kecepatan, fleksibilitas, dan kenyamanan.',
        tag: 'B2C Urban',
      },
      {
        title: 'Korporat Skala Menengah & Enterprise',
        description: 'Perusahaan dengan 100+ karyawan yang membutuhkan keamanan data tinggi, SLA resmi, dan integrasi sistem.',
        tag: 'B2B Enterprise',
      },
      {
        title: 'Kreator Konten & Pekerja Kreatif Lepas',
        description: 'Individu mandiri yang membutuhkan alat produksi konten berkualitas tinggi dan monetisasi audiens.',
        tag: 'Kreator',
      },
    ],
    commonMistakes: [
      'Menyebut target pasar adalah "Semua Orang" (Everyone is my customer) — jika menargetkan semua orang, Anda tidak menargetkan siapapun.',
      'Mencampuradukkan antara "Pengguna" (User) dengan "Pembayar" (Payer / Decision Maker) pada bisnis B2B atau marketplace.',
      'Tidak memvalidasi apakah segmen tersebut memiliki daya beli nyata (Purchasing Power).',
    ],
  },
  {
    key: 'valuePropositions',
    number: 2,
    titleId: 'Proposisi Nilai',
    titleEn: 'Value Propositions',
    shortDesc: 'Paket produk dan layanan yang menciptakan nilai unik untuk Segmen Pelanggan tertentu.',
    definition:
      'Proposisi Nilai adalah alasan mengapa pelanggan beralih ke bisnis Anda daripada kompetitor. Ini memecahkan masalah pelanggan atau memenuhi kebutuhan mereka secara nyata, baik berupa kebaruan, performa, kustomisasi, desain, harga, atau kemudahan akses.',
    guidingQuestions: [
      'Nilai apa yang kita berikan kepada pelanggan?',
      'Masalah pelanggan mana yang sedang kita bantu selesaikan?',
      'Kebutuhan pelanggan apa yang sedang kita penuhi?',
      'Paket produk/layanan apa yang kita tawarkan untuk setiap segmen?',
      'Apa diferensiasi utama kita dibanding alternatif yang ada saat ini (Moat / Keunggulan Tak Tertandingi)?',
    ],
    typesAndCategories: [
      {
        title: 'Kebaruan (Newness)',
        desc: 'Memenuhi kebutuhan baru yang sebelumnya belum pernah disadari atau belum ada solusinya (cth: telepon pintar pertama).',
      },
      {
        title: 'Peningkatan Performa (Performance)',
        desc: 'Memberikan hasil yang jauh lebih cepat, bertenaga, atau efisien dari standar pasar.',
      },
      {
        title: 'Kustomisasi & Personalisasi',
        desc: 'Menyesuaikan produk/layanan secara spesifik untuk preferensi individu atau bisnis.',
      },
      {
        title: 'Kemudahan Akses & Kenyamanan (Convenience)',
        desc: 'Membuat hal yang sebelumnya rumit atau repot menjadi dapat diakses dalam hitungan detik/sentuhan jari.',
      },
      {
        title: 'Efisiensi Biaya (Cost Reduction)',
        desc: 'Membantu pelanggan menghemat uang atau biaya operasional tanpa menurunkan kualitas.',
      },
    ],
    realWorldExamples: [
      {
        company: 'Uber',
        category: 'Convenience & Reliability',
        description: 'Pemesanan transportasi aman 1-klik dengan tarif transparan tanpa tawar-menawar dan pelacakan GPS langsung.',
      },
      {
        company: 'Netflix',
        category: 'Accessibility & Variety',
        description: 'Akses tanpa batas ke ribuan film dan serial orisinal berkualitas tinggi tanpa jeda iklan dengan langganan flat bulanan.',
      },
      {
        company: 'IKEA',
        category: 'Design & Affordability',
        description: 'Furnitur berdesain Skandinavia modern dengan harga sangat terjangkau melalui konsep flat-pack perakitan mandiri.',
      },
    ],
    quickInsertComponents: [
      {
        title: 'Otomatisasi Alur Kerja Instan Tanpa Coding',
        description: 'Memangkas waktu pengerjaan tugas rutin dari 4 jam menjadi 5 menit melalui integrasi cerdas.',
        tag: 'Efisiensi',
      },
      {
        title: 'Transparansi Biaya 100% Tanpa Biaya Tersembunyi',
        description: 'Pelanggan mendapatkan kejelasan penuh atas apa yang mereka bayar dengan jaminan uang kembali.',
        tag: 'Kepercayaan',
      },
      {
        title: 'Layanan Mandiri 24/7 dengan Respon Real-time',
        description: 'Akses bantuan dan transaksi instan kapan saja tanpa perlu menunggu jam kerja operasional.',
        tag: 'Kenyamanan',
      },
      {
        title: 'Solusi All-in-One Terintegrasi',
        description: 'Menggabungkan fungsionalitas 3-4 software terpisah ke dalam satu dashboard tunggal yang ringkas.',
        tag: 'Kemudahan',
      },
    ],
    commonMistakes: [
      'Menjelaskan fitur produk teknis (Feature) alih-alih manfaat nyata bagi pengguna (Benefit / Outcome).',
      'Proposisi nilai tidak selaras dengan masalah utama Segmen Pelanggan yang dituju.',
      'Klaim generik seperti "Pelayanan Terbaik" atau "Kualitas Nomor Satu" tanpa bukti pembeda yang nyata.',
    ],
  },
  {
    key: 'channels',
    number: 3,
    titleId: 'Saluran Distribusi',
    titleEn: 'Channels',
    shortDesc: 'Bagaimana perusahaan berkomunikasi dan menjangkau Segmen Pelanggannya untuk menyampaikan Proposisi Nilai.',
    definition:
      'Saluran mencakup semua titik kontak (touchpoints) antara bisnis dan pelanggan, meliputi 5 fase krusial: Kesadaran (Awareness), Evaluasi (Evaluation), Pembelian (Purchase), Pengiriman (Delivery), dan Layanan Purna Jual (After-sales).',
    guidingQuestions: [
      'Melalui saluran mana Segmen Pelanggan ingin dijangkau?',
      'Bagaimana cara kita menjangkau mereka saat ini? Saluran mana yang paling terintegrasi dan hemat biaya?',
      'Bagaimana kita meningkatkan kesadaran (Awareness) tentang produk kita?',
      'Bagaimana kita membantu pelanggan mengevaluasi Proposisi Nilai kita?',
      'Bagaimana produk atau layanan kita dikirimkan ke tangan pelanggan?',
    ],
    typesAndCategories: [
      {
        title: 'Direct Channels (Saluran Langsung)',
        desc: 'Penjualan langsung melalui website resmi, aplikasi mobile, sales force internal, atau toko ritel milik sendiri.',
      },
      {
        title: 'Indirect Channels (Saluran Tidak Langsung)',
        desc: 'Distribusi melalui marketplace pihak ketiga (Tokopedia, Shopee), toko distributor grosir, atau reseller affiliate.',
      },
      {
        title: 'Inbound Content & SEO',
        desc: 'Menarik calon pelanggan secara organik melalui artikel edukatif, video tutorial, dan optimasi mesin pencari.',
      },
      {
        title: 'Paid Performance Media',
        desc: 'Iklan bertarget di media sosial (Meta Ads, Google Search, TikTok Ads) dengan pelacakan konversi terukur.',
      },
    ],
    realWorldExamples: [
      {
        company: 'Apple',
        category: 'Hybrid Omnichannel',
        description: 'Toko fisik megah (Apple Store) untuk pengalaman langsung, Apple.com, serta jaringan mitra operator seluler dan ritel resmi.',
      },
      {
        company: 'Canva',
        category: 'Freemium Product-Led',
        description: 'Situs web browser dan aplikasi mobile instan, viral sharing template antar pengguna, dan integrasi media sosial.',
      },
    ],
    quickInsertComponents: [
      {
        title: 'Aplikasi Mobile & Website Resmi (Direct-to-Consumer)',
        description: 'Kanal utama transaksi dengan kendali penuh atas margin keuntungan dan data perilaku pelanggan.',
        tag: 'Milik Sendiri',
      },
      {
        title: 'Social Commerce & Live Streaming (TikTok / Instagram)',
        description: 'Kombinasi konten visual interaktif dan checkout instan saat sesi siaran langsung.',
        tag: 'Media Sosial',
      },
      {
        title: 'Jaringan Kemitraan Reseller & Program Afiliasi',
        description: 'Memperluas jangkauan ke kota-kota sekunder melalui sistem komisi bagi hasil per penjualan.',
        tag: 'Afiliasi',
      },
      {
        title: 'Pemasaran Inbound Edukatif (Blog SEO & Podcast)',
        description: 'Membangun otoritas industri dan akuisisi pelanggan jangka panjang dengan biaya rendah.',
        tag: 'Organik',
      },
    ],
    commonMistakes: [
      'Hanya memikirkan kanal penjualan (Purchase) dan melupakan kanal purna jual (After-sales support).',
      'Menggunakan terlalu banyak kanal sekaligus tanpa memiliki sumber daya untuk mengelola semuanya secara konsisten.',
    ],
  },
  {
    key: 'customerRelationships',
    number: 4,
    titleId: 'Hubungan Pelanggan',
    titleEn: 'Customer Relationships',
    shortDesc: 'Jenis hubungan yang dibangun dan dipelihara perusahaan dengan masing-masing Segmen Pelanggan.',
    definition:
      'Hubungan Pelanggan didorong oleh tiga motivasi utama: Mengakuisisi pelanggan baru (Customer Acquisition), Mempertahankan pelanggan lama (Customer Retention), dan Meningkatkan nilai belanja pelanggan (Upselling / Cross-selling).',
    guidingQuestions: [
      'Jenis hubungan apa yang diharapkan oleh masing-masing Segmen Pelanggan untuk kita bangun dan jaga?',
      'Seberapa mahal biaya untuk mempertahankan hubungan ini?',
      'Bagaimana hubungan ini terintegrasi dengan model bisnis kita secara keseluruhan?',
      'Apakah hubungan bersifat transaksional satu kali, otomatisasi mandiri, atau kemitraan konsultatif jangka panjang?',
    ],
    typesAndCategories: [
      {
        title: 'Bantuan Personal (Dedicated Assistance)',
        desc: 'Interaksi langsung dengan perwakilan manusia, cth: Account Manager khusus untuk klien korporat.',
      },
      {
        title: 'Layanan Mandiri (Self-Service)',
        desc: 'Menyediakan semua sarana yang dibutuhkan pelanggan untuk melayani diri mereka sendiri tanpa bantuan staf.',
      },
      {
        title: 'Layanan Otomatis (Automated Services)',
        desc: 'Menggabungkan self-service dengan kecerdasan sistem untuk mengenali karakteristik individual pelanggan.',
      },
      {
        title: 'Komunitas & Co-Creation',
        desc: 'Memfasilitasi forum komunikasi antar pengguna dan melibatkan pelanggan dalam merancang produk/konten baru.',
      },
    ],
    realWorldExamples: [
      {
        company: 'Amazon Prime',
        category: 'Automated Loyalty & Lock-in',
        description: 'Sistem rekomendasi AI personal, pengiriman kilat 1 hari gratis, dan loyalitas ekosistem menyeluruh.',
      },
      {
        company: 'Harley-Davidson',
        category: 'Community & Belonging',
        description: 'Klub penggemar H.O.G. (Harley Owners Group) yang menciptakan ikatan emosional seumur hidup melebihi sekadar sepeda motor.',
      },
    ],
    quickInsertComponents: [
      {
        title: 'Program Loyalitas & Tingkatan Member (Tiered Rewards)',
        description: 'Insentif poin cashback, diskon eksklusif hari ulang tahun, dan akses awal ke produk baru.',
        tag: 'Retensi',
      },
      {
        title: 'Pusat Bantuan Self-Serve & Dokumentasi Interaktif',
        description: 'Basis pengetahuan lengkap dengan panduan video dan chatbot AI 24/7 untuk resolusi cepat.',
        tag: 'Self-Service',
      },
      {
        title: 'Dedicated Account Manager untuk Klien Premium',
        description: 'Konsultasi rutin berkala dan jalur prioritas langsung untuk kebutuhan kustom.',
        tag: 'Personal',
      },
      {
        title: 'Komunitas Pengguna Eksklusif (Discord / WhatsApp Group)',
        description: 'Wadah berbagi studi kasus, umpan balik fitur baru, dan jejaring sesama pelaku industri.',
        tag: 'Komunitas',
      },
    ],
    commonMistakes: [
      'Menjanjikan bantuan personal intensif pada produk berbiaya murah sehingga menghancurkan margin laba.',
      'Mengabaikan pelanggan yang sudah ada (hanya fokus membakar uang untuk akuisisi pelanggan baru).',
    ],
  },
  {
    key: 'revenueStreams',
    number: 5,
    titleId: 'Sumber Pendapatan',
    titleEn: 'Revenue Streams',
    shortDesc: 'Uang yang dihasilkan perusahaan dari masing-masing Segmen Pelanggan.',
    definition:
      'Jika pelanggan adalah jantung dan proposisi nilai adalah wajah bisnis, maka arus pendapatan adalah urat nadi sirkulasi finansial. Bisnis harus memahami nilai apa yang benar-benar rela dibayar pelanggan dan mekanisme harga apa yang paling optimal.',
    guidingQuestions: [
      'Untuk nilai apa pelanggan kita benar-benar bersedia membayar?',
      'Bagaimana cara mereka membayar saat ini? Bagaimana mereka lebih suka membayar?',
      'Berapa kontribusi masing-masing arus pendapatan terhadap total pendapatan keseluruhan?',
      'Apakah model penetapan harga bersifat tetap (Fixed Pricing: daftar harga, fitur) atau dinamis (Dynamic Pricing: lelang, yield management)?',
    ],
    typesAndCategories: [
      {
        title: 'Penjualan Aset (Asset Sale)',
        desc: 'Menjual hak kepemilikan atas produk fisik atau digital (cth: menjual buku, mobil, pakaian).',
      },
      {
        title: 'Biaya Berlangganan (Subscription Fee)',
        desc: 'Menjual akses berkelanjutan ke suatu layanan secara berulang per bulan/tahun (cth: Netflix, gym).',
      },
      {
        title: 'Biaya Pemakaian (Usage Fee)',
        desc: 'Pendapatan proporsional terhadap volume penggunaan layanan (cth: tarif listrik, AWS cloud per menit).',
      },
      {
        title: 'Biaya Komisi / Brokerage (Marketplace Fee)',
        desc: 'Memotong persentase komisi dari nilai transaksi antara penjual dan pembeli (cth: Gojek, Tokopedia).',
      },
      {
        title: 'Lisensi & Royalti',
        desc: 'Memberikan izin penggunaan kekayaan intelektual (paten, software, musik) dengan imbalan biaya.',
      },
    ],
    realWorldExamples: [
      {
        company: 'Adobe',
        category: 'Transisi ke SaaS Subscription',
        description: 'Beralih dari menjual software kotak $600 sekali bayar ke langganan Creative Cloud $55/bulan berulang.',
      },
      {
        company: 'Apple',
        category: 'Diversified Hardware + Services',
        description: 'Penjualan perangkat keras (iPhone/Mac) dengan margin tinggi ditambah pendapatan berulang Services (iCloud, Apple Music, App Store cut).',
      },
    ],
    quickInsertComponents: [
      {
        title: 'Langganan Berulang Bulanan / Tahunan (MRR / ARR)',
        description: 'Arus kas stabil dengan tier paket berjenjang (Starter, Pro, Enterprise).',
        tag: 'Langganan',
      },
      {
        title: 'Komisi Transaksi Marketplace (Take Rate 5-15%)',
        description: 'Pendapatan yang berskala seiring pertumbuhan volume transaksi kotor (GMV).',
        tag: 'Komisi',
      },
      {
        title: 'Layanan Setup Awal & Kustomisasi Profesional',
        description: 'Pendapatan upfront bernilai tinggi untuk instalasi dan pelatihan tim klien enterprise.',
        tag: 'Jasa Profesional',
      },
      {
        title: 'Add-on Berbasis Penggunaan (Usage-Based Overage)',
        description: 'Biaya tambahan jika pemakaian kuota API atau data melebihi batas paket dasar.',
        tag: 'Pemakaian',
      },
    ],
    commonMistakes: [
      'Menetapkan harga hanya berdasarkan harga pokok produksi (Cost-plus pricing) tanpa mempertimbangkan nilai yang dirasakan pelanggan (Value-based pricing).',
      'Hanya mengandalkan satu sumber pendapatan tunggal yang rentan terdisrupsi.',
    ],
  },
  {
    key: 'keyResources',
    number: 6,
    titleId: 'Sumber Daya Utama',
    titleEn: 'Key Resources',
    shortDesc: 'Aset-aset paling penting yang dibutuhkan agar sebuah model bisnis dapat berfungsi.',
    definition:
      'Sumber Daya Utama memungkinkan perusahaan menciptakan dan menawarkan Proposisi Nilai, menjangkau pasar, mempertahankan hubungan dengan Segmen Pelanggan, dan memperoleh pendapatan. Sumber daya ini dapat dimiliki sendiri, disewa, atau diperoleh dari mitra kunci.',
    guidingQuestions: [
      'Sumber daya utama apa yang dibutuhkan oleh Proposisi Nilai kita?',
      'Sumber daya apa yang dibutuhkan oleh Saluran Distribusi, Hubungan Pelanggan, dan Arus Pendapatan kita?',
      'Apakah aset utama kita bersifat fisik, intelektual, manusia, atau finansial?',
    ],
    typesAndCategories: [
      {
        title: 'Sumber Daya Fisik (Physical)',
        desc: 'Bangunan fasilitas, pabrik, kendaraan, mesin, gerai ritel, dan jaringan logistik.',
      },
      {
        title: 'Sumber Daya Intelektual (Intellectual)',
        desc: 'Hak paten, merek dagang, hak cipta, dataset proprietary, algoritma rahasia dagang, dan reputasi brand.',
      },
      {
        title: 'Sumber Daya Manusia (Human)',
        desc: 'Talenta ahli penting seperti rekayasawan software senior, ilmuwan data, desainer kreatif, atau peracik rasa.',
      },
      {
        title: 'Sumber Daya Finansial (Financial)',
        desc: 'Cadangan kas tunai, jalur kredit bank, atau modal ventura untuk mempertahankan operasional awal.',
      },
    ],
    realWorldExamples: [
      {
        company: 'Google',
        category: 'Intelektual & Infrastruktur',
        description: 'Algoritma mesin pencari PageRank, pusat data (Data Center) global raksasa, dan ribuan insinyur software kelas dunia.',
      },
      {
        company: 'Nike',
        category: 'Brand Equity & Desain',
        description: 'Kekuatan merek dagang global "Swoosh", kontrak eksklusif atlet bintang dunia, dan paten material bantalan sepatu.',
      },
    ],
    quickInsertComponents: [
      {
        title: 'Infrastruktur Cloud Server & Arsitektur Database Terdistribusi',
        description: 'Fondasi komputasi dengan ketersediaan tinggi (99.9% uptime) dan auto-scaling aman.',
        tag: 'Teknologi',
      },
      {
        title: 'Tim Inti Teknis & Pertumbuhan (Engineering & Growth)',
        description: 'Kombinasi talenta rekayasa software andal dan pemasar analitik performa.',
        tag: 'SDM',
      },
      {
        title: 'Kekayaan Intelektual & Algoritma Khusus',
        description: 'Metodologi kepemilikan dan hak paten yang menjadi dinding pertahanan dari peniruan kompetitor.',
        tag: 'Intelektual',
      },
      {
        title: 'Jaringan Lokasi Strategis atau Pusat Pemenuhan (Fulfillment)',
        description: 'Fasilitas penyimpanan dan pengiriman yang meminimalkan waktu respon dan biaya logistik.',
        tag: 'Fisik',
      },
    ],
    commonMistakes: [
      'Menuliskan aset standar yang dimiliki semua orang (cth: "Laptop dan Meja") alih-alih aset kritis pembeda.',
      'Mengabaikan ketergantungan pada personil kunci (Key-person risk).',
    ],
  },
  {
    key: 'keyActivities',
    number: 7,
    titleId: 'Aktivitas Kunci',
    titleEn: 'Key Activities',
    shortDesc: 'Hal-hal paling penting yang harus dilakukan perusahaan agar model bisnisnya berhasil.',
    definition:
      'Aktivitas Kunci adalah tindakan paling krusial yang harus dilakukan perusahaan untuk beroperasi dengan sukses. Sama seperti Sumber Daya Utama, aktivitas ini diperlukan untuk menciptakan Proposisi Nilai, menjangkau pasar, dan menghasilkan pendapatan.',
    guidingQuestions: [
      'Aktivitas kunci apa yang dibutuhkan oleh Proposisi Nilai kita?',
      'Aktivitas apa yang paling penting untuk Saluran Distribusi, Hubungan Pelanggan, dan Arus Pendapatan kita?',
      'Apakah aktivitas utama kita berupa Produksi, Pemecahan Masalah (Problem Solving), atau Manajemen Platform/Jaringan?',
    ],
    typesAndCategories: [
      {
        title: 'Produksi (Production)',
        desc: 'Merancang, membuat, dan mengirimkan produk dalam kuantitas substansial atau mutu superior (dominan di industri manufaktur).',
      },
      {
        title: 'Pemecahan Masalah (Problem Solving)',
        desc: 'Menemukan solusi baru untuk masalah individu pelanggan (dominan di konsultan, rumah sakit, agensi).',
      },
      {
        title: 'Platform / Jaringan (Platform/Network)',
        desc: 'Merancang software, memelihara server, dan memfasilitasi interaksi pengguna (dominan di eBay, Gojek, SaaS).',
      },
    ],
    realWorldExamples: [
      {
        company: 'Microsoft / Apple Software',
        category: 'Pengembangan Software & Ekosistem',
        description: 'R&D sistem operasi berkesinambungan, manajemen pembaruan keamanan, dan dukungan pengembang pihak ketiga.',
      },
      {
        company: 'McKinsey & Company',
        category: 'Problem Solving & Riset',
        description: 'Analisis strategi bisnis tingkat dewan direksi, manajemen pengetahuan industri, dan rekrutmen talenta top.',
      },
    ],
    quickInsertComponents: [
      {
        title: 'Pengembangan Berkelanjutan & Pembaruan Fitur Produk (CI/CD)',
        description: 'Siklus rilis mingguan berdasarkan masukan pengguna dan analitik data.',
        tag: 'R&D',
      },
      {
        title: 'Manajemen Keamanan Sistem & Pemeliharaan Uptime 99.9%',
        description: 'Audit keamanan berkala, patching celah kerentanan, dan pemantauan server 24/7.',
        tag: 'Operasional',
      },
      {
        title: 'Eksperimen Akuisisi Pertumbuhan & Optimasi Konversi (A/B Testing)',
        description: 'Uji coba berkala pada materi iklan, halaman arahan, dan penawaran harga.',
        tag: 'Growth',
      },
      {
        title: 'Kurasi Kontrol Kualitas & Standarisasi Layanan',
        description: 'Pemeriksaan mutu ketat sebelum produk atau layanan diserahkan ke pelanggan.',
        tag: 'Mutu',
      },
    ],
    commonMistakes: [
      'Mencantumkan seluruh rutinitas harian kantor (cth: "Membayar tagihan listrik, rapat pagi") alih-alih aktivitas strategis.',
      'Melakukan aktivitas yang tidak relevan dengan Proposisi Nilai utama.',
    ],
  },
  {
    key: 'keyPartners',
    number: 8,
    titleId: 'Kemitraan Utama',
    titleEn: 'Key Partnerships',
    shortDesc: 'Jaringan pemasok dan mitra yang membuat model bisnis dapat bekerja efektif.',
    definition:
      'Perusahaan menjalin kemitraan untuk berbagai alasan: mengoptimalkan model bisnis mereka, mengurangi risiko di lingkungan kompetitif, atau memperoleh sumber daya tertentu tanpa harus membelinya sendiri.',
    guidingQuestions: [
      'Siapa mitra utama kita? Siapa pemasok utama kita?',
      'Sumber daya utama mana yang kita peroleh dari mitra?',
      'Aktivitas kunci mana yang dilakukan oleh mitra untuk kita?',
      'Apakah kemitraan bertujuan untuk aliansi strategis non-kompetitor, coopetition (kompetitor yang bekerja sama), joint venture, atau buyer-supplier relationship?',
    ],
    typesAndCategories: [
      {
        title: 'Optimalisasi dan Skala Ekonomi',
        desc: 'Bentuk paling umum yang dirancang untuk mengoptimalkan alokasi konfigurasi sumber daya dan biaya (cth: outsourcing call center).',
      },
      {
        title: 'Pengurangan Risiko dan Ketidakpastian',
        desc: 'Aliansi strategis antar kompetitor untuk bersama-sama mendanai pengembangan standar teknologi baru (cth: konsorsium Blu-ray).',
      },
      {
        title: 'Akuisisi Sumber Daya dan Aktivitas Tertentu',
        desc: 'Memanfaatkan keahlian, lisensi, atau kanal mitra daripada membangun dari nol sendiri.',
      },
    ],
    realWorldExamples: [
      {
        company: 'Spotify',
        category: 'Licensing Partnership',
        description: 'Kemitraan lisensi krusial dengan major record labels (Universal Music, Sony, Warner) untuk hak streaming lagu.',
      },
      {
        company: 'Gojek / Grab',
        category: 'Aliansi Multi-Sektor',
        description: 'Kemitraan dengan ribuan merchant kuliner, bank/fintech untuk dompet digital, dan perusahaan asuransi perjalanan.',
      },
    ],
    quickInsertComponents: [
      {
        title: 'Penyedia Infrastruktur Cloud & Kapasitas AI Global',
        description: 'Mitra teknologi fondasi untuk komputasi aman, latensi rendah, dan sertifikasi kepatuhan data.',
        tag: 'Infrastruktur',
      },
      {
        title: 'Payment Gateway Resmi & Lembaga Perbankan',
        description: 'Memfasilitasi berbagai metode pembayaran lokal (QRIS, Virtual Account, Kartu Kredit, Paylater).',
        tag: 'Finansial',
      },
      {
        title: 'Jaringan Kurir Logistik & Pemenuhan Pesanan Nasional',
        description: 'Mitra pengiriman instan dan antar-pulau dengan tarif volume khusus dan pelacakan API.',
        tag: 'Logistik',
      },
      {
        title: 'Komunitas Industri & Asosiasi Profesi Terkait',
        description: 'Penyelenggaraan event bersama untuk edukasi pasar dan pembentukan reputasi kredibel.',
        tag: 'Edukasi',
      },
    ],
    commonMistakes: [
      'Menyebut semua vendor umum sebagai "Mitra Kunci" — mitra kunci adalah mereka yang jika berhenti bekerja sama, bisnis Anda akan terhenti atau mengalami kendala berat.',
      'Tidak memiliki rencana kontinjensi (cadangan) jika mitra utama menaikkan harga atau menghentikan kontrak.',
    ],
  },
  {
    key: 'costStructure',
    number: 9,
    titleId: 'Struktur Biaya',
    titleEn: 'Cost Structure',
    shortDesc: 'Semua biaya yang dikeluarkan untuk mengoperasikan model bisnis.',
    definition:
      'Blok ini menggambarkan biaya terpenting yang dikeluarkan saat mengoperasikan model bisnis tertentu. Menciptakan dan memberikan nilai, mempertahankan Hubungan Pelanggan, dan menghasilkan pendapatan semuanya menimbulkan biaya yang harus dihitung cermat.',
    guidingQuestions: [
      'Biaya paling penting apa yang melekat dalam model bisnis kita?',
      'Sumber Daya Utama mana yang paling mahal?',
      'Aktivitas Kunci mana yang paling banyak menghabiskan biaya?',
      'Apakah model bisnis kita bersifat Cost-driven (fokus minimalkan biaya serendah mungkin) atau Value-driven (fokus pada penciptaan nilai premium)?',
    ],
    typesAndCategories: [
      {
        title: 'Biaya Tetap (Fixed Costs)',
        desc: 'Biaya yang tetap sama terlepas dari volume barang atau jasa yang diproduksi (cth: gaji staf tetap, sewa gedung, asuransi).',
      },
      {
        title: 'Biaya Variabel (Variable Costs)',
        desc: 'Biaya yang bervariasi sebanding dengan volume barang atau jasa yang diproduksi (cth: bahan baku, biaya pengiriman per paket).',
      },
      {
        title: 'Skala Ekonomi (Economies of Scale)',
        desc: 'Keuntungan biaya yang dinikmati bisnis seiring dengan meningkatnya volume produksi (biaya rata-rata per unit turun).',
      },
      {
        title: 'Cakupan Ekonomi (Economies of Scope)',
        desc: 'Keuntungan biaya yang dinikmati bisnis ketika operasional yang sama mendukung berbagai produk atau pasar.',
      },
    ],
    realWorldExamples: [
      {
        company: 'AirAsia / Ryanair',
        category: 'Cost-Driven',
        description: 'Armada pesawat tipe seragam, tiket tanpa makanan/bagasi gratis, penggunaan bandara sekunder untuk menekan biaya tiket semurah mungkin.',
      },
      {
        company: 'Rolls-Royce / Rolex',
        category: 'Value-Driven',
        description: 'Biaya tinggi dialokasikan pada pengerjaan tangan mewah eksklusif, material emas/baja 904L, dan pemasaran berprestise tinggi.',
      },
    ],
    quickInsertComponents: [
      {
        title: 'Biaya Komputasi Cloud & Lisensi API Serverless',
        description: 'Biaya variabel yang tumbuh seiring peningkatan traffic pengguna dan volume data.',
        tag: 'Teknologi',
      },
      {
        title: 'Biaya Akuisisi Pelanggan (CAC & Iklan Berbayar)',
        description: 'Pengeluaran untuk iklan Meta, Google, dan insentif promosi diskon awal pengguna.',
        tag: 'Pemasaran',
      },
      {
        title: 'Kompensasi & Gaji Talenta Kunci (Engineering & Operasional)',
        description: 'Pos biaya tetap bulanan terbesar untuk mempertahankan kualitas tim internal.',
        tag: 'Gaji SDM',
      },
      {
        title: 'Biaya Pemrosesan Transaksi Finansial (Payment Fee)',
        description: 'Potongan persentase per transaksi dari gerbang pembayaran dan transfer bank.',
        tag: 'Finansial',
      },
    ],
    commonMistakes: [
      'Meremehkan Biaya Akuisisi Pelanggan (CAC) dalam proyeksi keuangan awal.',
      'Biaya operasional tetap membengkak sebelum mencapai kecocokan produk dengan pasar (Product-Market Fit).',
    ],
  },
];
