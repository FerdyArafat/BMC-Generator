import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini SDK client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const BMC_BLOCK_ITEM_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'Judul ringkas poin (3-7 kata)' },
    description: { type: Type.STRING, description: 'Penjelasan strategis atau taktis mendalam (1-2 kalimat)' },
    tag: { type: Type.STRING, description: 'Kategori atau label penanda (cth: Utama, Digital, B2B, Retensi, dsb)' },
  },
  required: ['title', 'description'],
};

const BMC_FULL_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    businessName: { type: Type.STRING },
    tagline: { type: Type.STRING },
    executiveSummary: { type: Type.STRING },
    elevatorPitch: { type: Type.STRING },
    keyPartners: {
      type: Type.ARRAY,
      items: BMC_BLOCK_ITEM_SCHEMA,
      description: 'Pihak luar / mitra strategis, pemasok, aliansi penting',
    },
    keyActivities: {
      type: Type.ARRAY,
      items: BMC_BLOCK_ITEM_SCHEMA,
      description: 'Aktivitas inti yang harus dilakukan agar model bisnis berjalan',
    },
    keyResources: {
      type: Type.ARRAY,
      items: BMC_BLOCK_ITEM_SCHEMA,
      description: 'Aset fisik, intelektual, manusia, atau finansial utama',
    },
    valuePropositions: {
      type: Type.ARRAY,
      items: BMC_BLOCK_ITEM_SCHEMA,
      description: 'Nilai unik, solusi, dan manfaat yang ditawarkan ke pelanggan',
    },
    customerRelationships: {
      type: Type.ARRAY,
      items: BMC_BLOCK_ITEM_SCHEMA,
      description: 'Cara berinteraksi, mengakuisisi, dan merawat loyalitas pelanggan',
    },
    channels: {
      type: Type.ARRAY,
      items: BMC_BLOCK_ITEM_SCHEMA,
      description: 'Saluran pemasaran, penjualan, dan pengiriman produk/layanan',
    },
    customerSegments: {
      type: Type.ARRAY,
      items: BMC_BLOCK_ITEM_SCHEMA,
      description: 'Kelompok pelanggan atau target pasar yang dilayani',
    },
    costStructure: {
      type: Type.ARRAY,
      items: BMC_BLOCK_ITEM_SCHEMA,
      description: 'Komponen biaya terbesar dalam mengoperasikan bisnis',
    },
    revenueStreams: {
      type: Type.ARRAY,
      items: BMC_BLOCK_ITEM_SCHEMA,
      description: 'Sumber aliran pemasukan dan mekanisme penetapan harga',
    },
    financialOverview: {
      type: Type.OBJECT,
      properties: {
        estimatedGrossMargin: { type: Type.STRING },
        primaryCostDrivers: { type: Type.ARRAY, items: { type: Type.STRING } },
        keyMetrics: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['estimatedGrossMargin', 'primaryCostDrivers', 'keyMetrics'],
    },
    swotSummary: {
      type: Type.OBJECT,
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
        threats: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['strengths', 'weaknesses', 'opportunities', 'threats'],
    },
    nextActionItems: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3-5 langkah aksi konkret untuk memvalidasi atau meluncurkan bisnis',
    },
  },
  required: [
    'businessName',
    'tagline',
    'executiveSummary',
    'elevatorPitch',
    'keyPartners',
    'keyActivities',
    'keyResources',
    'valuePropositions',
    'customerRelationships',
    'channels',
    'customerSegments',
    'costStructure',
    'revenueStreams',
    'financialOverview',
    'swotSummary',
    'nextActionItems',
  ],
};

// API: Generate BMC from user input
app.post('/api/bmc/generate', async (req: Request, res: Response) => {
  try {
    const {
      businessName,
      businessIdea,
      industry,
      targetAudience,
      revenueModel,
      uniqueAdvantage,
      language = 'id',
    } = req.body;

    if (!businessIdea || typeof businessIdea !== 'string') {
      res.status(400).json({ error: 'Deskripsi ide bisnis wajib diisi.' });
      return;
    }

    const langInstruction =
      language === 'en'
        ? 'Generate everything in professional English.'
        : 'Hasilkan seluruh teks dalam Bahasa Indonesia yang profesional, jelas, modern, dan bernas.';

    const prompt = `Anda adalah seorang konsultan strategi bisnis startup dan pakar Business Model Canvas (Alexander Osterwalder framework) kelas dunia.
Tugas Anda adalah merumuskan Business Model Canvas (BMC) yang komprehensif, tajam, realistis, dan berbobot tinggi berdasarkan data ide bisnis berikut:

- Nama Bisnis: ${businessName || '(Tentukan nama kreatif yang relevan dan menarik jika belum ada)'}
- Ide Bisnis: ${businessIdea}
- Industri / Sektor: ${industry || 'Tentukan yang paling cocok'}
- Target Audiens Spesifik: ${targetAudience || 'Sesuaikan secara tajam'}
- Model Pendapatan yang Diinginkan: ${revenueModel || 'Pilih yang paling menguntungkan & scalable'}
- Keunggulan Unik (Moat/USP): ${uniqueAdvantage || 'Rumuskan diferensiasi yang kuat terhadap kompetitor'}

Petunjuk Penting:
1. Pastikan setiap dari 9 blok berisi minimal 3 hingga 5 poin berkualitas tinggi.
2. Hindari poin yang generik atau klise. Buat spesifik untuk domain bisnis yang diberikan.
3. Sambungkan logika antar blok (misalnya: Value Proposition menjawab kebutuhan Customer Segments, Channels menjadi jembatan distribusinya, Key Resources & Activities mewujudkan Value Proposition).
4. Berikan tag/kategori pada setiap poin agar rapi saat ditampilkan dalam canvas kartu.
5. ${langInstruction}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'Anda adalah Business Architect dan Venture Strategist profesional. Buat Business Model Canvas yang siap dipresentasikan ke investor, pemangku kepentingan, atau tim eksekusi bisnis.',
        responseMimeType: 'application/json',
        responseSchema: BMC_FULL_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Model tidak memberikan output.');
    }

    const parsed = JSON.parse(text);

    // Add unique IDs to each item in blocks for React state management
    const enrichWithIds = (items: any[]) =>
      (items || []).map((item, idx) => ({
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${idx}`,
        title: item.title || '',
        description: item.description || '',
        tag: item.tag || 'Umum',
        color: ['blue', 'emerald', 'amber', 'purple', 'rose', 'cyan'][idx % 6],
      }));

    const result = {
      ...parsed,
      keyPartners: enrichWithIds(parsed.keyPartners),
      keyActivities: enrichWithIds(parsed.keyActivities),
      keyResources: enrichWithIds(parsed.keyResources),
      valuePropositions: enrichWithIds(parsed.valuePropositions),
      customerRelationships: enrichWithIds(parsed.customerRelationships),
      channels: enrichWithIds(parsed.channels),
      customerSegments: enrichWithIds(parsed.customerSegments),
      costStructure: enrichWithIds(parsed.costStructure),
      revenueStreams: enrichWithIds(parsed.revenueStreams),
      metadata: {
        generatedAt: new Date().toISOString(),
        industry: industry || 'Umum',
        language,
      },
    };

    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/bmc/generate:', error);
    res.status(500).json({
      error: error.message || 'Gagal menghasilkan Business Model Canvas.',
    });
  }
});

// API: Enhance a specific BMC block
app.post('/api/bmc/enhance-block', async (req: Request, res: Response) => {
  try {
    const { blockKey, blockName, currentItems, businessContext, instruction, language = 'id' } = req.body;

    const langInstruction =
      language === 'en'
        ? 'Generate in professional English.'
        : 'Gunakan Bahasa Indonesia yang profesional dan tajam.';

    const prompt = `Anda adalah pakar strategi bisnis. Pengguna ingin meningkatkan blok "${blockName}" (${blockKey}) pada Business Model Canvas bisnis mereka.

Konteks Bisnis:
${businessContext}

Poin-poin saat ini di blok "${blockName}":
${JSON.stringify(currentItems, null, 2)}

Instruksi Tambahan dari Pengguna:
${instruction || 'Berikan 3-4 ide poin baru atau perbaikan yang inovatif dan teruji untuk memperkuat blok ini.'}

${langInstruction}
Berikan daftar rekomendasi poin baru/tambahan.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        recommendations: {
          type: Type.ARRAY,
          items: BMC_BLOCK_ITEM_SCHEMA,
        },
        advice: {
          type: Type.STRING,
          description: 'Saran strategis singkat untuk blok ini (1-2 kalimat)',
        },
      },
      required: ['recommendations', 'advice'],
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Tidak ada respon dari model.');
    }

    const parsed = JSON.parse(text);
    const enriched = (parsed.recommendations || []).map((item: any, idx: number) => ({
      id: `enhanced-${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${idx}`,
      title: item.title,
      description: item.description,
      tag: item.tag || 'AI Rekomendasi',
      color: 'purple',
    }));

    res.json({
      recommendations: enriched,
      advice: parsed.advice,
    });
  } catch (error: any) {
    console.error('Error in /api/bmc/enhance-block:', error);
    res.status(500).json({ error: error.message || 'Gagal meningkatkan blok BMC.' });
  }
});

// API: Critique & Feasibility Analysis of the BMC
app.post('/api/bmc/critique', async (req: Request, res: Response) => {
  try {
    const { canvasData, language = 'id' } = req.body;

    const prompt = `Lakukan audit kritis dan evaluasi kelayakan investasi (due diligence) terhadap Business Model Canvas berikut:
${JSON.stringify(canvasData, null, 2)}

Evaluasi berdasarkan:
1. Keselarasan Nilai dan Pelanggan (Problem-Solution & Product-Market Fit)
2. Skalabilitas & Profitabilitas (Unit economics, diversifikasi pendapatan vs beban biaya)
3. Ketahanan terhadap kompetitor (Moat, barrier to entry, network effect)
4. Risiko operasional dan eksekusi

Bahasa: ${language === 'en' ? 'English' : 'Bahasa Indonesia'}.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        overallScore: { type: Type.INTEGER, description: 'Skor kelayakan dari 0 sampai 100' },
        rating: { type: Type.STRING, description: 'Rating (cth: Sangat Potensial, Siap Validasi, Butuh Penyempurnaan)' },
        executiveSummary: { type: Type.STRING, description: 'Ringkasan audit (2-3 kalimat)' },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        criticalRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
        actionableRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
        keyQuestionsToAnswer: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: [
        'overallScore',
        'rating',
        'executiveSummary',
        'strengths',
        'criticalRisks',
        'actionableRecommendations',
        'keyQuestionsToAnswer',
      ],
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });

    const text = response.text;
    res.json(JSON.parse(text || '{}'));
  } catch (error: any) {
    console.error('Error in /api/bmc/critique:', error);
    res.status(500).json({ error: error.message || 'Gagal menganalisis BMC.' });
  }
});

// API: Elaborate a single point in depth
app.post('/api/bmc/elaborate-item', async (req: Request, res: Response) => {
  try {
    const { blockName, itemTitle, itemDesc, businessContext, language = 'id' } = req.body;

    const langInstruction =
      language === 'en'
        ? 'Answer in professional, actionable English.'
        : 'Gunakan Bahasa Indonesia yang profesional, terstruktur, dan siap dieksekusi.';

    const prompt = `Anda adalah konsultan strategi bisnis. Pengguna memiliki poin berikut pada blok "${blockName}":
Judul: ${itemTitle}
Deskripsi Saat Ini: ${itemDesc}

Konteks Bisnis:
${businessContext}

Tugas:
Perdalam poin ini menjadi penjelasan operasional yang tajam (elaborate), jelaskan taktik pelaksanaan, metrik keberhasilan, dan dampaknya pada model bisnis.
${langInstruction}`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        enhancedTitle: { type: Type.STRING },
        enhancedDescription: { type: Type.STRING },
        strategicTactic: { type: Type.STRING, description: 'Langkah taktis pelaksanaan' },
        successMetric: { type: Type.STRING, description: 'KPI atau metrik keberhasilan terukur' },
        recommendedTag: { type: Type.STRING },
      },
      required: ['enhancedTitle', 'enhancedDescription', 'strategicTactic', 'successMetric', 'recommendedTag'],
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });

    const text = response.text;
    res.json(JSON.parse(text || '{}'));
  } catch (error: any) {
    console.error('Error in /api/bmc/elaborate-item:', error);
    res.status(500).json({ error: error.message || 'Gagal memperdalam poin.' });
  }
});

// API: Generate SWOT analysis based on current BMC data
app.post('/api/bmc/generate-swot', async (req: Request, res: Response) => {
  try {
    const { canvasData, language = 'id' } = req.body;

    const langInstruction =
      language === 'en'
        ? 'Generate all SWOT points in sharp, executive-level English.'
        : 'Gunakan Bahasa Indonesia yang profesional, tajam, analitis, dan berbobot tinggi.';

    const prompt = `Anda adalah seorang konsultan strategi dan analis bisnis terkemuka.
Lakukan analisis SWOT (Strengths, Weaknesses, Opportunities, Threats) komprehensif berdasarkan data Business Model Canvas berikut:

Bisnis: ${canvasData.businessName || 'Bisnis Tanpa Nama'}
Tagline/Ringkasan: ${canvasData.tagline || canvasData.executiveSummary || ''}
Proposisi Nilai: ${JSON.stringify(canvasData.valuePropositions || [])}
Segmen Pelanggan: ${JSON.stringify(canvasData.customerSegments || [])}
Saluran Distribusi: ${JSON.stringify(canvasData.channels || [])}
Hubungan Pelanggan: ${JSON.stringify(canvasData.customerRelationships || [])}
Sumber Pendapatan: ${JSON.stringify(canvasData.revenueStreams || [])}
Struktur Biaya: ${JSON.stringify(canvasData.costStructure || [])}
Aktivitas Kunci: ${JSON.stringify(canvasData.keyActivities || [])}
Sumber Daya Utama: ${JSON.stringify(canvasData.keyResources || [])}
Kemitraan Utama: ${JSON.stringify(canvasData.keyPartners || [])}

Petunjuk Analisis:
1. Kekuatan (Strengths): Faktor internal positif, aset unik, keunggulan kompetitif, dan diferensiasi nyata dari model bisnis ini (minimal 3-5 poin).
2. Kelemahan (Weaknesses): Keterbatasan internal, hambatan sumber daya, biaya awal tinggi, atau kerentanan operasional (minimal 3-5 poin).
3. Peluang (Opportunities): Faktor eksternal yang menguntungkan, tren pasar, perubahan perilaku konsumen, atau potensi ekspansi yang dapat dimanfaatkan (minimal 3-5 poin).
4. Ancaman (Threats): Risiko eksternal, ancaman persaingan, regulasi, fluktuasi ekonomi, atau perubahan teknologi yang membahayakan (minimal 3-5 poin).
5. Rekomendasi Strategis (Strategic Recommendations): 3-4 rekomendasi aksi nyata untuk memaksimalkan kekuatan guna menangkap peluang (Strategi SO) dan memitigasi kelemahan terhadap ancaman (Strategi WT).

${langInstruction}`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Kekuatan internal bisnis' },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Kelemahan internal bisnis' },
        opportunities: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Peluang pasar eksternal' },
        threats: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Ancaman & risiko eksternal' },
        strategicRecommendations: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Rekomendasi taktis berbasis matriks SWOT',
        },
      },
      required: ['strengths', 'weaknesses', 'opportunities', 'threats', 'strategicRecommendations'],
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });

    const text = response.text;
    res.json(JSON.parse(text || '{}'));
  } catch (error: any) {
    console.error('Error in /api/bmc/generate-swot:', error);
    res.status(500).json({ error: error.message || 'Gagal menghasilkan analisis SWOT.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`BMC Server running on http://localhost:${port}`);
  });
}

startServer();
