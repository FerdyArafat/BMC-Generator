import { GoogleGenAI, Type } from '@google/genai';
import { BmcData, BmcItem } from '../types/bmc';

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
    keyPartners: { type: Type.ARRAY, items: BMC_BLOCK_ITEM_SCHEMA },
    keyActivities: { type: Type.ARRAY, items: BMC_BLOCK_ITEM_SCHEMA },
    keyResources: { type: Type.ARRAY, items: BMC_BLOCK_ITEM_SCHEMA },
    valuePropositions: { type: Type.ARRAY, items: BMC_BLOCK_ITEM_SCHEMA },
    customerRelationships: { type: Type.ARRAY, items: BMC_BLOCK_ITEM_SCHEMA },
    channels: { type: Type.ARRAY, items: BMC_BLOCK_ITEM_SCHEMA },
    customerSegments: { type: Type.ARRAY, items: BMC_BLOCK_ITEM_SCHEMA },
    costStructure: { type: Type.ARRAY, items: BMC_BLOCK_ITEM_SCHEMA },
    revenueStreams: { type: Type.ARRAY, items: BMC_BLOCK_ITEM_SCHEMA },
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

export const getStoredApiKey = (): string => {
  return (
    import.meta.env.VITE_GEMINI_API_KEY ||
    localStorage.getItem('gemini_api_key') ||
    ''
  );
};

export const setStoredApiKey = (key: string): void => {
  localStorage.setItem('gemini_api_key', key.trim());
};

const getClientAi = (): GoogleGenAI => {
  const key = getStoredApiKey();
  if (!key) {
    throw new Error(
      'Kunci API Gemini belum tersedia untuk hosting statis ini. Silakan atur Environment Variable GEMINI_API_KEY di Netlify atau masukkan API Key di menu pengaturan.'
    );
  }
  return new GoogleGenAI({ apiKey: key });
};

// Helper to safely parse API responses and detect Netlify HTML SPA rewrites
async function requestOrFallback<T>(
  url: string,
  body: any,
  clientFallback: () => Promise<T>
): Promise<T> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const contentType = res.headers.get('content-type') || '';
    const text = await res.text();

    // If server returned HTML (Netlify SPA redirected /* to index.html), fallback to client-side
    if (contentType.includes('text/html') || text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
      console.warn(`[aiBmcService] Endpoint ${url} mengembalikan HTML (hosting statis Netlify). Menjalankan fallback client-side...`);
      return await clientFallback();
    }

    if (!res.ok) {
      // Try to parse error json
      let errMsg = `Error ${res.status}: Gagal memproses permintaan`;
      try {
        const errJson = JSON.parse(text);
        if (errJson.error) errMsg = errJson.error;
      } catch (_) {}

      // If 404 or 500, attempt client-side fallback
      if (res.status === 404 || res.status === 502) {
        return await clientFallback();
      }
      throw new Error(errMsg);
    }

    return JSON.parse(text) as T;
  } catch (error: any) {
    // If it was already our clean error, rethrow
    if (error.message && !error.message.includes('Unexpected token') && !error.message.includes('Failed to fetch')) {
      // Check if it was a client fallback error
      if (error.message.includes('Kunci API Gemini')) throw error;
    }
    // Attempt client fallback
    console.warn(`[aiBmcService] Fetch ${url} gagal, mencoba pemrosesan client-side...`, error);
    return await clientFallback();
  }
}

// 1. Generate BMC
export async function apiGenerateBmc(payload: {
  businessName: string;
  businessIdea: string;
  industry: string;
  targetAudience: string;
  revenueModel: string;
  uniqueAdvantage: string;
  language?: string;
}): Promise<BmcData> {
  return requestOrFallback('/api/bmc/generate', payload, async () => {
    const ai = getClientAi();
    const langInstruction =
      payload.language === 'en'
        ? 'Generate everything in professional English.'
        : 'Hasilkan seluruh teks dalam Bahasa Indonesia yang profesional, jelas, modern, dan bernas.';

    const prompt = `Anda adalah seorang konsultan strategi bisnis startup dan pakar Business Model Canvas (Alexander Osterwalder framework) kelas dunia.
Tugas Anda adalah merumuskan Business Model Canvas (BMC) yang komprehensif, tajam, realistis, dan berbobot tinggi berdasarkan data ide bisnis berikut:

- Nama Bisnis: ${payload.businessName || '(Tentukan nama kreatif yang relevan dan menarik jika belum ada)'}
- Ide Bisnis: ${payload.businessIdea}
- Industri / Sektor: ${payload.industry || 'Tentukan yang paling cocok'}
- Target Audiens Spesifik: ${payload.targetAudience || 'Sesuaikan secara tajam'}
- Model Pendapatan yang Diinginkan: ${payload.revenueModel || 'Pilih yang paling menguntungkan & scalable'}
- Keunggulan Unik (Moat/USP): ${payload.uniqueAdvantage || 'Rumuskan diferensiasi yang kuat terhadap kompetitor'}

Petunjuk Penting:
1. Pastikan setiap dari 9 blok berisi minimal 3 hingga 5 poin berkualitas tinggi.
2. Hindari poin yang generik atau klise. Buat spesifik untuk domain bisnis yang diberikan.
3. Sambungkan logika antar blok.
4. Berikan tag/kategori pada setiap poin agar rapi saat ditampilkan dalam canvas kartu.
5. ${langInstruction}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: BMC_FULL_SCHEMA,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const enrichWithIds = (items: any[]) =>
      (items || []).map((item, idx) => ({
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${idx}`,
        title: item.title || '',
        description: item.description || '',
        tag: item.tag || 'Umum',
        color: (['blue', 'emerald', 'amber', 'purple', 'rose', 'cyan'] as const)[idx % 6],
      }));

    return {
      businessName: parsed.businessName || payload.businessName || 'Business Model Canvas',
      tagline: parsed.tagline || '',
      executiveSummary: parsed.executiveSummary || '',
      elevatorPitch: parsed.elevatorPitch || '',
      keyPartners: enrichWithIds(parsed.keyPartners),
      keyActivities: enrichWithIds(parsed.keyActivities),
      keyResources: enrichWithIds(parsed.keyResources),
      valuePropositions: enrichWithIds(parsed.valuePropositions),
      customerRelationships: enrichWithIds(parsed.customerRelationships),
      channels: enrichWithIds(parsed.channels),
      customerSegments: enrichWithIds(parsed.customerSegments),
      costStructure: enrichWithIds(parsed.costStructure),
      revenueStreams: enrichWithIds(parsed.revenueStreams),
      financialOverview: parsed.financialOverview,
      swotSummary: parsed.swotSummary,
      nextActionItems: parsed.nextActionItems,
      metadata: {
        generatedAt: new Date().toISOString(),
        industry: payload.industry || 'Umum',
        language: (payload.language === 'en' ? 'en' : 'id') as 'en' | 'id',
      },
    };
  });
}

// 2. Enhance Block
export async function apiEnhanceBlock(payload: {
  blockKey: string;
  blockTitle: string;
  currentItems: BmcItem[];
  businessContext: string;
  language?: string;
}): Promise<{ recommendations: Array<{ title: string; description: string; tag: string }> }> {
  return requestOrFallback('/api/bmc/enhance-block', payload, async () => {
    const ai = getClientAi();
    const prompt = `Anda adalah konsultan strategi bisnis senior.
Bisnis: ${payload.businessContext}
Blok yang sedang dianalisis: "${payload.blockTitle}" (${payload.blockKey})
Poin yang sudah ada saat ini:
${JSON.stringify(payload.currentItems.map((i) => i.title))}

Tugas:
Berikan 3 hingga 5 rekomendasi poin baru yang strategis, inovatif, dan belum tercakup pada poin yang sudah ada di atas.
Format respon dalam JSON.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        recommendations: {
          type: Type.ARRAY,
          items: BMC_BLOCK_ITEM_SCHEMA,
        },
      },
      required: ['recommendations'],
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });

    return JSON.parse(response.text || '{}');
  });
}

// 3. Generate SWOT
export async function apiGenerateSwot(payload: {
  canvasData: BmcData;
  language?: string;
}): Promise<{
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  strategicRecommendations: string[];
}> {
  return requestOrFallback('/api/bmc/generate-swot', payload, async () => {
    const ai = getClientAi();
    const prompt = `Lakukan analisis SWOT komprehensif berdasarkan data Business Model Canvas berikut:
Bisnis: ${payload.canvasData.businessName}
Proposisi Nilai: ${JSON.stringify(payload.canvasData.valuePropositions || [])}
Segmen Pelanggan: ${JSON.stringify(payload.canvasData.customerSegments || [])}
Saluran: ${JSON.stringify(payload.canvasData.channels || [])}
Hubungan: ${JSON.stringify(payload.canvasData.customerRelationships || [])}
Pendapatan: ${JSON.stringify(payload.canvasData.revenueStreams || [])}
Biaya: ${JSON.stringify(payload.canvasData.costStructure || [])}
Aktivitas: ${JSON.stringify(payload.canvasData.keyActivities || [])}
Sumber Daya: ${JSON.stringify(payload.canvasData.keyResources || [])}
Mitra: ${JSON.stringify(payload.canvasData.keyPartners || [])}`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
        threats: { type: Type.ARRAY, items: { type: Type.STRING } },
        strategicRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
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

    return JSON.parse(response.text || '{}');
  });
}

// 4. Critique BMC
export async function apiCritiqueBmc(payload: {
  canvasData: BmcData;
  language?: string;
}): Promise<any> {
  return requestOrFallback('/api/bmc/critique', payload, async () => {
    const ai = getClientAi();
    const prompt = `Evaluasi secara kritis kelayakan Business Model Canvas berikut:
Bisnis: ${payload.canvasData.businessName}
Ide: ${payload.canvasData.executiveSummary}
Data 9 Blok: ${JSON.stringify(payload.canvasData)}`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        overallScore: { type: Type.NUMBER },
        healthRating: { type: Type.STRING },
        executiveSummaryCritique: { type: Type.STRING },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        vulnerabilities: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              blockName: { type: Type.STRING },
              riskLevel: { type: Type.STRING },
              issue: { type: Type.STRING },
              actionableAdvice: { type: Type.STRING },
            },
            required: ['blockName', 'riskLevel', 'issue', 'actionableAdvice'],
          },
        },
        strategicPivots: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['overallScore', 'healthRating', 'executiveSummaryCritique', 'strengths', 'vulnerabilities', 'strategicPivots'],
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });

    return JSON.parse(response.text || '{}');
  });
}

// 5. Elaborate Item
export async function apiElaborateItem(payload: {
  blockName: string;
  itemTitle: string;
  itemDesc: string;
  businessContext: string;
  language?: string;
}): Promise<any> {
  return requestOrFallback('/api/bmc/elaborate-item', payload, async () => {
    const ai = getClientAi();
    const prompt = `Perdalam poin berikut:
Blok: ${payload.blockName}
Judul: ${payload.itemTitle}
Deskripsi: ${payload.itemDesc}
Konteks: ${payload.businessContext}`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        enhancedTitle: { type: Type.STRING },
        enhancedDescription: { type: Type.STRING },
        strategicTactic: { type: Type.STRING },
        successMetric: { type: Type.STRING },
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

    return JSON.parse(response.text || '{}');
  });
}
