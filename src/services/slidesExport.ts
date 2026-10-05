import { BmcData, BmcItem } from '../types/bmc';

interface ExportProgressCallback {
  (status: string, progress: number): void;
}

export async function exportToGoogleSlides(
  bmc: BmcData,
  accessToken: string,
  onProgress?: ExportProgressCallback
): Promise<{ presentationId: string; url: string }> {
  onProgress?.('Menghubungi Google Slides API...', 10);

  // 1. Create a blank presentation
  const title = `${bmc.businessName || 'Business Model Canvas'} - Strategi & Pitch Deck`;
  const createRes = await fetch('https://slides.googleapis.com/v1/presentations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  if (!createRes.ok) {
    const errorData = await createRes.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message ||
        `Gagal membuat Google Slides (${createRes.status}: ${createRes.statusText})`
    );
  }

  const presentation = await createRes.json();
  const presentationId = presentation.presentationId;
  const initialSlideId = presentation.slides?.[0]?.objectId;

  onProgress?.('Menyiapkan tata letak slide presentasi...', 25);

  const requests: any[] = [];
  const slideIds = {
    cover: 'slide_cover_' + Date.now(),
    summary: 'slide_summary_' + Date.now(),
    canvas: 'slide_canvas_' + Date.now(),
    valueAndCustomer: 'slide_vp_cs_' + Date.now(),
    channelsAndRel: 'slide_chan_rel_' + Date.now(),
    engine: 'slide_engine_' + Date.now(),
    financial: 'slide_fin_' + Date.now(),
    roadmap: 'slide_roadmap_' + Date.now(),
  };

  // Helper to create slide
  const addSlide = (slideId: string) => {
    requests.push({
      createSlide: {
        objectId: slideId,
        slideLayoutReference: { predefinedLayout: 'BLANK' },
      },
    });
  };

  // Add slides
  addSlide(slideIds.cover);
  addSlide(slideIds.summary);
  addSlide(slideIds.canvas);
  addSlide(slideIds.valueAndCustomer);
  addSlide(slideIds.channelsAndRel);
  addSlide(slideIds.engine);
  addSlide(slideIds.financial);
  addSlide(slideIds.roadmap);

  // Delete initial default blank slide
  if (initialSlideId) {
    requests.push({
      deleteObject: { objectId: initialSlideId },
    });
  }

  // Helper to add shape with text
  let shapeCounter = 0;
  const addTextBox = ({
    slideId,
    x,
    y,
    width,
    height,
    text,
    fontSize = 12,
    bold = false,
    textColor = { red: 0.1, green: 0.15, blue: 0.2 },
    bgColor,
    borderColor,
  }: {
    slideId: string;
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    fontSize?: number;
    bold?: boolean;
    textColor?: { red: number; green: number; blue: number };
    bgColor?: { red: number; green: number; blue: number };
    borderColor?: { red: number; green: number; blue: number };
  }) => {
    const shapeId = `shape_${slideId}_${shapeCounter++}`;
    requests.push({
      createShape: {
        objectId: shapeId,
        shapeType: 'RECTANGLE',
        elementProperties: {
          pageObjectId: slideId,
          size: {
            width: { magnitude: width, unit: 'PT' },
            height: { magnitude: height, unit: 'PT' },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: x,
            translateY: y,
            unit: 'PT',
          },
        },
      },
    });

    const shapeProps: any = {};
    const fields: string[] = [];

    if (bgColor) {
      shapeProps.shapeBackgroundFill = {
        solidFill: { color: { rgbColor: bgColor } },
      };
      fields.push('shapeBackgroundFill.solidFill.color');
    } else {
      shapeProps.shapeBackgroundFill = {
        propertyState: 'NOT_RENDERED',
      };
      fields.push('shapeBackgroundFill.propertyState');
    }

    if (borderColor) {
      shapeProps.outline = {
        outlineFill: { solidFill: { color: { rgbColor: borderColor } } },
        weight: { magnitude: 1, unit: 'PT' },
      };
      fields.push('outline.outlineFill.solidFill.color', 'outline.weight');
    } else {
      shapeProps.outline = { propertyState: 'NOT_RENDERED' };
      fields.push('outline.propertyState');
    }

    requests.push({
      updateShapeProperties: {
        objectId: shapeId,
        fields: fields.join(','),
        shapeProperties: shapeProps,
      },
    });

    if (text) {
      requests.push({
        insertText: {
          objectId: shapeId,
          insertionIndex: 0,
          text,
        },
      });

      requests.push({
        updateTextStyle: {
          objectId: shapeId,
          fields: 'foregroundColor,bold,fontSize,fontFamily',
          textRange: { type: 'ALL' },
          style: {
            foregroundColor: { opaqueColor: { rgbColor: textColor } },
            bold,
            fontSize: { magnitude: fontSize, unit: 'PT' },
            fontFamily: 'Inter',
          },
        },
      });
    }

    return shapeId;
  };

  // Helper for Slide Header
  const addSlideHeader = (slideId: string, title: string, subtitle?: string) => {
    addTextBox({
      slideId,
      x: 30,
      y: 20,
      width: 660,
      height: 35,
      text: title,
      fontSize: 20,
      bold: true,
      textColor: { red: 0.08, green: 0.12, blue: 0.25 },
    });
    if (subtitle) {
      addTextBox({
        slideId,
        x: 30,
        y: 48,
        width: 660,
        height: 20,
        text: subtitle,
        fontSize: 10,
        textColor: { red: 0.45, green: 0.5, blue: 0.6 },
      });
    }
  };

  // --- SLIDE 1: COVER ---
  // Background card
  addTextBox({
    slideId: slideIds.cover,
    x: 0,
    y: 0,
    width: 720,
    height: 405,
    text: '',
    bgColor: { red: 0.06, green: 0.09, blue: 0.16 }, // Deep dark navy
  });
  // Badge
  addTextBox({
    slideId: slideIds.cover,
    x: 50,
    y: 70,
    width: 250,
    height: 24,
    text: 'BUSINESS MODEL CANVAS & STRATEGY',
    fontSize: 10,
    bold: true,
    textColor: { red: 0.38, green: 0.65, blue: 0.98 },
    bgColor: { red: 0.1, green: 0.18, blue: 0.32 },
    borderColor: { red: 0.2, green: 0.35, blue: 0.6 },
  });
  // Main Title
  addTextBox({
    slideId: slideIds.cover,
    x: 50,
    y: 110,
    width: 620,
    height: 70,
    text: bmc.businessName || 'Business Model Canvas',
    fontSize: 34,
    bold: true,
    textColor: { red: 1, green: 1, blue: 1 },
  });
  // Subtitle / Tagline
  addTextBox({
    slideId: slideIds.cover,
    x: 50,
    y: 185,
    width: 620,
    height: 50,
    text: bmc.tagline || bmc.executiveSummary.substring(0, 140) + '...',
    fontSize: 15,
    textColor: { red: 0.75, green: 0.82, blue: 0.9 },
  });
  // Info Footer
  const dateStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  addTextBox({
    slideId: slideIds.cover,
    x: 50,
    y: 330,
    width: 620,
    height: 30,
    text: `Dipersiapkan untuk Pemangku Kepentingan & Investor • Tanggal: ${dateStr} • Sektor: ${bmc.metadata?.industry || 'Teknologi & Inovasi'}`,
    fontSize: 10,
    textColor: { red: 0.5, green: 0.6, blue: 0.7 },
  });

  // --- SLIDE 2: EXECUTIVE SUMMARY & ELEVATOR PITCH ---
  addSlideHeader(
    slideIds.summary,
    'Ringkasan Eksekutif & Elevator Pitch',
    'Gambaran strategis model bisnis dan proposisi inti'
  );
  // Executive Summary Card
  addTextBox({
    slideId: slideIds.summary,
    x: 30,
    y: 75,
    width: 320,
    height: 200,
    text: 'RINGKASAN EKSEKUTIF\n\n' + bmc.executiveSummary,
    fontSize: 11,
    textColor: { red: 0.15, green: 0.2, blue: 0.3 },
    bgColor: { red: 0.95, green: 0.97, blue: 1 },
    borderColor: { red: 0.8, green: 0.88, blue: 0.98 },
  });
  // Elevator Pitch Card
  addTextBox({
    slideId: slideIds.summary,
    x: 370,
    y: 75,
    width: 320,
    height: 200,
    text: 'ELEVATOR PITCH (30 DETIK)\n\n"' + bmc.elevatorPitch + '"',
    fontSize: 11,
    textColor: { red: 0.15, green: 0.25, blue: 0.2 },
    bgColor: { red: 0.94, green: 0.99, blue: 0.96 },
    borderColor: { red: 0.78, green: 0.92, blue: 0.82 },
  });
  // Financial Overview Banner
  if (bmc.financialOverview) {
    const finText = `ESTIMASI MARGIN KOTOR: ${bmc.financialOverview.estimatedGrossMargin}  |  PENGGERAK BIAYA UTAMA: ${bmc.financialOverview.primaryCostDrivers.join(', ')}  |  METRIK KUNCI: ${bmc.financialOverview.keyMetrics.join(', ')}`;
    addTextBox({
      slideId: slideIds.summary,
      x: 30,
      y: 290,
      width: 660,
      height: 75,
      text: finText,
      fontSize: 10,
      textColor: { red: 0.2, green: 0.25, blue: 0.35 },
      bgColor: { red: 0.97, green: 0.97, blue: 0.99 },
      borderColor: { red: 0.85, green: 0.85, blue: 0.92 },
    });
  }

  // --- SLIDE 3: COMPLETE 9-BOX BUSINESS MODEL CANVAS ---
  addSlideHeader(
    slideIds.canvas,
    'Business Model Canvas (Peta Lengkap 9 Blok)',
    `${bmc.businessName} - Kerangka Strategis Osterwalder`
  );

  const formatBlockPoints = (items: BmcItem[], max = 4) => {
    return items
      .slice(0, max)
      .map((it) => `• ${it.title}`)
      .join('\n');
  };

  // 1. Key Partners (col 1, full top height)
  addTextBox({
    slideId: slideIds.canvas,
    x: 20,
    y: 70,
    width: 130,
    height: 200,
    text: `KEMITRAAN UTAMA\n(Key Partners)\n\n${formatBlockPoints(bmc.keyPartners, 4)}`,
    fontSize: 9,
    textColor: { red: 0.15, green: 0.2, blue: 0.3 },
    bgColor: { red: 0.94, green: 0.96, blue: 1.0 },
    borderColor: { red: 0.8, green: 0.86, blue: 0.96 },
  });

  // 2. Key Activities (col 2, top half)
  addTextBox({
    slideId: slideIds.canvas,
    x: 155,
    y: 70,
    width: 130,
    height: 97,
    text: `AKTIVITAS UTAMA\n(Key Activities)\n\n${formatBlockPoints(bmc.keyActivities, 3)}`,
    fontSize: 9,
    textColor: { red: 0.15, green: 0.2, blue: 0.3 },
    bgColor: { red: 0.94, green: 0.98, blue: 0.98 },
    borderColor: { red: 0.8, green: 0.92, blue: 0.92 },
  });

  // 3. Key Resources (col 2, bottom half)
  addTextBox({
    slideId: slideIds.canvas,
    x: 155,
    y: 173,
    width: 130,
    height: 97,
    text: `SUMBER DAYA UTAMA\n(Key Resources)\n\n${formatBlockPoints(bmc.keyResources, 3)}`,
    fontSize: 9,
    textColor: { red: 0.15, green: 0.2, blue: 0.3 },
    bgColor: { red: 0.94, green: 0.98, blue: 0.98 },
    borderColor: { red: 0.8, green: 0.92, blue: 0.92 },
  });

  // 4. Value Propositions (col 3, center tall)
  addTextBox({
    slideId: slideIds.canvas,
    x: 290,
    y: 70,
    width: 140,
    height: 200,
    text: `PROPOSISI NILAI\n(Value Propositions)\n\n${formatBlockPoints(bmc.valuePropositions, 4)}`,
    fontSize: 9,
    textColor: { red: 0.25, green: 0.15, blue: 0.05 },
    bgColor: { red: 1.0, green: 0.97, blue: 0.92 },
    borderColor: { red: 0.96, green: 0.85, blue: 0.7 },
  });

  // 5. Customer Relationships (col 4, top half)
  addTextBox({
    slideId: slideIds.canvas,
    x: 435,
    y: 70,
    width: 130,
    height: 97,
    text: `HUBUNGAN PELANGGAN\n(Customer Rel.)\n\n${formatBlockPoints(bmc.customerRelationships, 3)}`,
    fontSize: 9,
    textColor: { red: 0.2, green: 0.1, blue: 0.25 },
    bgColor: { red: 0.98, green: 0.95, blue: 1.0 },
    borderColor: { red: 0.9, green: 0.82, blue: 0.96 },
  });

  // 6. Channels (col 4, bottom half)
  addTextBox({
    slideId: slideIds.canvas,
    x: 435,
    y: 173,
    width: 130,
    height: 97,
    text: `SALURAN DISTRIBUSI\n(Channels)\n\n${formatBlockPoints(bmc.channels, 3)}`,
    fontSize: 9,
    textColor: { red: 0.2, green: 0.1, blue: 0.25 },
    bgColor: { red: 0.98, green: 0.95, blue: 1.0 },
    borderColor: { red: 0.9, green: 0.82, blue: 0.96 },
  });

  // 7. Customer Segments (col 5, tall right)
  addTextBox({
    slideId: slideIds.canvas,
    x: 570,
    y: 70,
    width: 130,
    height: 200,
    text: `SEGMEN PELANGGAN\n(Customer Segments)\n\n${formatBlockPoints(bmc.customerSegments, 4)}`,
    fontSize: 9,
    textColor: { red: 0.1, green: 0.22, blue: 0.15 },
    bgColor: { red: 0.93, green: 0.99, blue: 0.95 },
    borderColor: { red: 0.78, green: 0.92, blue: 0.82 },
  });

  // 8. Cost Structure (bottom left)
  addTextBox({
    slideId: slideIds.canvas,
    x: 20,
    y: 276,
    width: 335,
    height: 105,
    text: `STRUKTUR BIAYA (Cost Structure)\n${formatBlockPoints(bmc.costStructure, 3)}`,
    fontSize: 9,
    textColor: { red: 0.25, green: 0.1, blue: 0.1 },
    bgColor: { red: 1.0, green: 0.95, blue: 0.95 },
    borderColor: { red: 0.96, green: 0.8, blue: 0.8 },
  });

  // 9. Revenue Streams (bottom right)
  addTextBox({
    slideId: slideIds.canvas,
    x: 365,
    y: 276,
    width: 335,
    height: 105,
    text: `SUMBER PENDAPATAN (Revenue Streams)\n${formatBlockPoints(bmc.revenueStreams, 3)}`,
    fontSize: 9,
    textColor: { red: 0.08, green: 0.25, blue: 0.15 },
    bgColor: { red: 0.92, green: 0.99, blue: 0.94 },
    borderColor: { red: 0.74, green: 0.92, blue: 0.8 },
  });

  // --- SLIDE 4: VALUE PROPOSITIONS & CUSTOMER SEGMENTS ---
  addSlideHeader(
    slideIds.valueAndCustomer,
    'Proposisi Nilai & Segmen Pelanggan',
    'Fondasi Problem-Solution Fit dan Daya Tarik Pasar'
  );
  const detailedVp = bmc.valuePropositions
    .map((v, i) => `${i + 1}. ${v.title}\n   ${v.description}`)
    .join('\n\n');
  addTextBox({
    slideId: slideIds.valueAndCustomer,
    x: 30,
    y: 75,
    width: 320,
    height: 290,
    text: `PROPOSISI NILAI (VALUE PROPOSITIONS)\n\n${detailedVp}`,
    fontSize: 9,
    textColor: { red: 0.2, green: 0.15, blue: 0.05 },
    bgColor: { red: 1.0, green: 0.98, blue: 0.93 },
    borderColor: { red: 0.95, green: 0.88, blue: 0.72 },
  });
  const detailedCs = bmc.customerSegments
    .map((c, i) => `${i + 1}. ${c.title}\n   ${c.description}`)
    .join('\n\n');
  addTextBox({
    slideId: slideIds.valueAndCustomer,
    x: 370,
    y: 75,
    width: 320,
    height: 290,
    text: `SEGMEN PELANGGAN (CUSTOMER SEGMENTS)\n\n${detailedCs}`,
    fontSize: 9,
    textColor: { red: 0.1, green: 0.22, blue: 0.15 },
    bgColor: { red: 0.94, green: 0.99, blue: 0.96 },
    borderColor: { red: 0.8, green: 0.92, blue: 0.84 },
  });

  // --- SLIDE 5: CHANNELS & CUSTOMER RELATIONSHIPS ---
  addSlideHeader(
    slideIds.channelsAndRel,
    'Saluran Distribusi & Hubungan Pelanggan',
    'Strategi Go-to-Market, Akuisisi, dan Retensi Pengguna'
  );
  const detailedChannels = bmc.channels
    .map((c, i) => `${i + 1}. ${c.title}\n   ${c.description}`)
    .join('\n\n');
  addTextBox({
    slideId: slideIds.channelsAndRel,
    x: 30,
    y: 75,
    width: 320,
    height: 290,
    text: `SALURAN DISTRIBUSI (CHANNELS)\n\n${detailedChannels}`,
    fontSize: 9,
    textColor: { red: 0.15, green: 0.18, blue: 0.28 },
    bgColor: { red: 0.95, green: 0.97, blue: 1.0 },
    borderColor: { red: 0.85, green: 0.88, blue: 0.98 },
  });
  const detailedRel = bmc.customerRelationships
    .map((r, i) => `${i + 1}. ${r.title}\n   ${r.description}`)
    .join('\n\n');
  addTextBox({
    slideId: slideIds.channelsAndRel,
    x: 370,
    y: 75,
    width: 320,
    height: 290,
    text: `HUBUNGAN PELANGGAN (CUSTOMER RELATIONSHIPS)\n\n${detailedRel}`,
    fontSize: 9,
    textColor: { red: 0.25, green: 0.12, blue: 0.25 },
    bgColor: { red: 0.98, green: 0.95, blue: 1.0 },
    borderColor: { red: 0.9, green: 0.82, blue: 0.96 },
  });

  // --- SLIDE 6: OPERATIONAL ENGINE (ACTIVITIES, RESOURCES, PARTNERS) ---
  addSlideHeader(
    slideIds.engine,
    'Mesin Operasional: Mitra, Aktivitas, & Sumber Daya',
    'Aset dan Eksekusi di Balik Layar untuk Mewujudkan Nilai'
  );
  const enginePartners = bmc.keyPartners.map((p) => `• ${p.title}: ${p.description}`).join('\n\n');
  addTextBox({
    slideId: slideIds.engine,
    x: 30,
    y: 75,
    width: 210,
    height: 290,
    text: `KEMITRAAN UTAMA\n\n${enginePartners}`,
    fontSize: 8.5,
    textColor: { red: 0.15, green: 0.2, blue: 0.3 },
    bgColor: { red: 0.96, green: 0.97, blue: 1.0 },
    borderColor: { red: 0.85, green: 0.88, blue: 0.96 },
  });
  const engineActivities = bmc.keyActivities.map((a) => `• ${a.title}: ${a.description}`).join('\n\n');
  addTextBox({
    slideId: slideIds.engine,
    x: 255,
    y: 75,
    width: 210,
    height: 290,
    text: `AKTIVITAS UTAMA\n\n${engineActivities}`,
    fontSize: 8.5,
    textColor: { red: 0.1, green: 0.25, blue: 0.25 },
    bgColor: { red: 0.95, green: 0.99, blue: 0.98 },
    borderColor: { red: 0.82, green: 0.92, blue: 0.9 },
  });
  const engineResources = bmc.keyResources.map((r) => `• ${r.title}: ${r.description}`).join('\n\n');
  addTextBox({
    slideId: slideIds.engine,
    x: 480,
    y: 75,
    width: 210,
    height: 290,
    text: `SUMBER DAYA UTAMA\n\n${engineResources}`,
    fontSize: 8.5,
    textColor: { red: 0.25, green: 0.2, blue: 0.1 },
    bgColor: { red: 1.0, green: 0.98, blue: 0.94 },
    borderColor: { red: 0.94, green: 0.88, blue: 0.78 },
  });

  // --- SLIDE 7: FINANCIAL ARCHITECTURE ---
  addSlideHeader(
    slideIds.financial,
    'Arsitektur Finansial: Biaya & Pendapatan',
    'Unit Economics, Aliran Pemasukan, dan Beban Operasional'
  );
  const costPoints = bmc.costStructure
    .map((c, i) => `${i + 1}. ${c.title}\n   ${c.description}`)
    .join('\n\n');
  addTextBox({
    slideId: slideIds.financial,
    x: 30,
    y: 75,
    width: 320,
    height: 290,
    text: `STRUKTUR BIAYA (COST STRUCTURE)\n\n${costPoints}`,
    fontSize: 9,
    textColor: { red: 0.28, green: 0.1, blue: 0.1 },
    bgColor: { red: 1.0, green: 0.96, blue: 0.96 },
    borderColor: { red: 0.96, green: 0.84, blue: 0.84 },
  });
  const revPoints = bmc.revenueStreams
    .map((r, i) => `${i + 1}. ${r.title}\n   ${r.description}`)
    .join('\n\n');
  addTextBox({
    slideId: slideIds.financial,
    x: 370,
    y: 75,
    width: 320,
    height: 290,
    text: `SUMBER PENDAPATAN (REVENUE STREAMS)\n\n${revPoints}`,
    fontSize: 9,
    textColor: { red: 0.08, green: 0.26, blue: 0.14 },
    bgColor: { red: 0.93, green: 0.99, blue: 0.95 },
    borderColor: { red: 0.78, green: 0.92, blue: 0.82 },
  });

  // --- SLIDE 8: ROADMAP & STRATEGIC ACTIONS ---
  addSlideHeader(
    slideIds.roadmap,
    'Rencana Aksi & Langkah Strategis Selanjutnya',
    'Tonggak Eksekusi dan Mitigasi Risiko'
  );
  const actionItems = (bmc.nextActionItems || [
    'Validasi Problem-Solution Fit dengan 20 wawancara pelanggan potensial',
    'Bangun Prototipe MVP untuk menguji Value Proposition inti',
    'Uji saluran akuisisi awal dengan kampanye bertarget',
    'Analisis unit economics dan rasio LTV/CAC',
  ])
    .map((item, idx) => `Langkah ${idx + 1}: ${item}`)
    .join('\n\n');

  addTextBox({
    slideId: slideIds.roadmap,
    x: 30,
    y: 75,
    width: 400,
    height: 290,
    text: `ACTION ROADMAP (LANGKAH EKSEKUSI)\n\n${actionItems}`,
    fontSize: 10,
    textColor: { red: 0.15, green: 0.2, blue: 0.3 },
    bgColor: { red: 0.96, green: 0.97, blue: 1.0 },
    borderColor: { red: 0.85, green: 0.88, blue: 0.96 },
  });

  const swotSummaryText = bmc.swotSummary
    ? `KEKUATAN:\n• ${bmc.swotSummary.strengths.slice(0, 2).join('\n• ')}\n\n` +
      `PELUANG:\n• ${bmc.swotSummary.opportunities.slice(0, 2).join('\n• ')}\n\n` +
      `TANTANGAN:\n• ${bmc.swotSummary.threats.slice(0, 2).join('\n• ')}`
    : 'Tinjau analisis risiko secara berkala untuk menjaga keunggulan kompetitif.';

  addTextBox({
    slideId: slideIds.roadmap,
    x: 450,
    y: 75,
    width: 240,
    height: 290,
    text: `SOROTAN STRATEGIS & RISIKO\n\n${swotSummaryText}`,
    fontSize: 9,
    textColor: { red: 0.25, green: 0.18, blue: 0.1 },
    bgColor: { red: 1.0, green: 0.98, blue: 0.92 },
    borderColor: { red: 0.94, green: 0.88, blue: 0.74 },
  });

  onProgress?.('Menerapkan desain dan konten ke Google Slides...', 65);

  // Send batchUpdate
  const batchRes = await fetch(
    `https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    }
  );

  if (!batchRes.ok) {
    const errorData = await batchRes.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message ||
        `Gagal memperbarui slide (${batchRes.status}: ${batchRes.statusText})`
    );
  }

  onProgress?.('Selesai! Presentasi Google Slides siap.', 100);

  return {
    presentationId,
    url: `https://docs.google.com/presentation/d/${presentationId}/edit`,
  };
}
