import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '',
});

const BMC_BLOCK_ITEM_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    tag: { type: Type.STRING },
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

export default async (req: Request) => {
  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  const url = new URL(req.url);
  const path = url.pathname;

  try {
    const body = await req.json().catch(() => ({}));

    // 1. Generate BMC
    if (path.endsWith('/generate') || path.endsWith('/bmc/generate')) {
      const { businessName, businessIdea, industry, targetAudience, revenueModel, uniqueAdvantage, language = 'id' } = body;
      const langInstruction =
        language === 'en'
          ? 'Generate everything in professional English.'
          : 'Hasilkan seluruh teks dalam Bahasa Indonesia yang profesional, jelas, modern, dan bernas.';

      const prompt = `Anda adalah konsultan strategi bisnis startup dan pakar Business Model Canvas.
Nama Bisnis: ${businessName || 'Bisnis Baru'}
Ide: ${businessIdea}
Industri: ${industry}
Target: ${targetAudience}
Model Pendapatan: ${revenueModel}
USP: ${uniqueAdvantage}
${langInstruction}`;

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
          color: ['blue', 'emerald', 'amber', 'purple', 'rose', 'cyan'][idx % 6],
        }));

      const fullBmc = {
        businessName: parsed.businessName || businessName || 'Business Model Canvas',
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
          industry: industry || 'Umum',
          language,
        },
      };

      return new Response(JSON.stringify(fullBmc), { status: 200, headers });
    }

    // 2. Enhance Block
    if (path.endsWith('/enhance-block') || path.endsWith('/bmc/enhance-block')) {
      const { blockTitle, blockKey, currentItems, businessContext } = body;
      const prompt = `Bisnis: ${businessContext}
Blok: ${blockTitle} (${blockKey})
Poin saat ini: ${JSON.stringify(currentItems)}
Berikan 3-5 poin baru berkualitas tinggi dalam JSON.`;

      const schema = {
        type: Type.OBJECT,
        properties: { recommendations: { type: Type.ARRAY, items: BMC_BLOCK_ITEM_SCHEMA } },
        required: ['recommendations'],
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema: schema },
      });

      return new Response(response.text, { status: 200, headers });
    }

    // 3. Generate SWOT
    if (path.endsWith('/generate-swot') || path.endsWith('/bmc/generate-swot')) {
      const { canvasData } = body;
      const prompt = `Analisis SWOT komprehensif berdasarkan BMC: ${JSON.stringify(canvasData)}`;
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
        config: { responseMimeType: 'application/json', responseSchema: schema },
      });

      return new Response(response.text, { status: 200, headers });
    }

    // 4. Critique
    if (path.endsWith('/critique') || path.endsWith('/bmc/critique')) {
      const { canvasData } = body;
      const prompt = `Audit kelayakan BMC: ${JSON.stringify(canvasData)}`;
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
        config: { responseMimeType: 'application/json', responseSchema: schema },
      });

      return new Response(response.text, { status: 200, headers });
    }

    return new Response(JSON.stringify({ error: 'Endpoint tidak ditemukan.' }), { status: 404, headers });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), { status: 500, headers });
  }
};
