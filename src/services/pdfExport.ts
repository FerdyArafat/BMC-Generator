import { jsPDF } from 'jspdf';
import { BmcData, BmcItem } from '../types/bmc';

interface ExportPdfOptions {
  mode: 'poster' | 'report';
  includeSwot?: boolean;
}

export function exportBmcToPdf(bmc: BmcData, options: ExportPdfOptions = { mode: 'poster' }) {
  if (options.mode === 'poster') {
    generateLandscapePosterPdf(bmc);
  } else {
    generateFullReportPdf(bmc);
  }
}

// 1. Executive Landscape A4 Canvas Poster (297 x 210 mm)
function generateLandscapePosterPdf(bmc: BmcData) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 297;
  const pageHeight = 210;
  const margin = 10;
  const contentWidth = pageWidth - margin * 2; // 277mm

  // Background
  doc.setFillColor(250, 252, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, margin, contentWidth, 22, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(bmc.businessName || 'Business Model Canvas', margin + 6, margin + 8.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(190, 210, 240);
  const taglineStr = doc.splitTextToSize(
    bmc.tagline || bmc.executiveSummary.substring(0, 110) + '...',
    contentWidth - 65
  );
  doc.text(taglineStr[0] || '', margin + 6, margin + 15);

  // Date & Tag on right
  const dateStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`TANGGAL: ${dateStr}`, pageWidth - margin - 6, margin + 8.5, { align: 'right' });
  doc.text(
    `SEKTOR: ${(bmc.metadata?.industry || 'Startup / Inovasi').toUpperCase()}`,
    pageWidth - margin - 6,
    margin + 15,
    { align: 'right' }
  );

  // 9-Box Osterwalder Layout Dimensions
  const canvasTop = margin + 24; // 34mm
  const canvasHeight = pageHeight - canvasTop - margin; // ~166mm
  const topRowHeight = canvasHeight * 0.65; // ~108mm
  const halfTopRowHeight = topRowHeight / 2 - 1; // ~53mm
  const bottomRowHeight = canvasHeight * 0.35 - 2; // ~56mm
  const bottomRowTop = canvasTop + topRowHeight + 2;

  const colWidth = (contentWidth - 8) / 5; // 5 columns top row: ~53.8mm

  // Block definitions for drawing
  const drawBlock = ({
    title,
    subTitle,
    items,
    x,
    y,
    w,
    h,
    bgRgb,
    borderRgb,
    headerRgb,
  }: {
    title: string;
    subTitle: string;
    items: BmcItem[];
    x: number;
    y: number;
    w: number;
    h: number;
    bgRgb: [number, number, number];
    borderRgb: [number, number, number];
    headerRgb: [number, number, number];
  }) => {
    // Fill & Border
    doc.setFillColor(bgRgb[0], bgRgb[1], bgRgb[2]);
    doc.setDrawColor(borderRgb[0], borderRgb[1], borderRgb[2]);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, w, h, 1.5, 1.5, 'FD');

    // Header strip
    doc.setFillColor(headerRgb[0], headerRgb[1], headerRgb[2]);
    doc.roundedRect(x, y, w, 7, 1.5, 1.5, 'F');
    // Square off bottom corners of header
    doc.rect(x, y + 4, w, 3, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(title.toUpperCase(), x + 3, y + 4.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(220, 230, 245);
    doc.text(subTitle, x + w - 3, y + 4.8, { align: 'right' });

    // Render items
    let curY = y + 10;
    const maxItems = h > 70 ? 5 : 3;
    const itemsToDraw = (items || []).slice(0, maxItems);

    for (const item of itemsToDraw) {
      if (curY + 7 > y + h - 2) break;

      // Item pill background
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(borderRgb[0], borderRgb[1], borderRgb[2]);
      doc.setLineWidth(0.15);
      const itemBoxHeight = h > 70 ? 16 : 12;
      doc.roundedRect(x + 2, curY, w - 4, itemBoxHeight, 1, 1, 'FD');

      // Title
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      const titleLines = doc.splitTextToSize(item.title, w - 8);
      doc.text(titleLines[0] || '', x + 3.5, curY + 3.5);

      // Description
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(5.5);
      doc.setTextColor(71, 85, 105);
      const descLines = doc.splitTextToSize(item.description, w - 8);
      const maxDescLines = h > 70 ? 2 : 1;
      for (let l = 0; l < Math.min(descLines.length, maxDescLines); l++) {
        doc.text(descLines[l], x + 3.5, curY + 7 + l * 2.8);
      }

      curY += itemBoxHeight + 2;
    }
  };

  // Top row X coordinates
  const col1X = margin;
  const col2X = margin + colWidth + 2;
  const col3X = margin + (colWidth + 2) * 2;
  const col4X = margin + (colWidth + 2) * 3;
  const col5X = margin + (colWidth + 2) * 4;

  // 1. Key Partners (col 1, full top height)
  drawBlock({
    title: 'Kemitraan Utama',
    subTitle: 'Key Partners',
    items: bmc.keyPartners,
    x: col1X,
    y: canvasTop,
    w: colWidth,
    h: topRowHeight,
    bgRgb: [241, 245, 249],
    borderRgb: [203, 213, 225],
    headerRgb: [51, 65, 85],
  });

  // 2. Key Activities (col 2, top half)
  drawBlock({
    title: 'Aktivitas Kunci',
    subTitle: 'Key Activities',
    items: bmc.keyActivities,
    x: col2X,
    y: canvasTop,
    w: colWidth,
    h: halfTopRowHeight,
    bgRgb: [240, 253, 250],
    borderRgb: [153, 246, 228],
    headerRgb: [13, 148, 136],
  });

  // 3. Key Resources (col 2, bottom half)
  drawBlock({
    title: 'Sumber Daya',
    subTitle: 'Key Resources',
    items: bmc.keyResources,
    x: col2X,
    y: canvasTop + halfTopRowHeight + 2,
    w: colWidth,
    h: halfTopRowHeight,
    bgRgb: [240, 249, 255],
    borderRgb: [186, 230, 253],
    headerRgb: [2, 132, 199],
  });

  // 4. Value Propositions (col 3, full top height, center core)
  drawBlock({
    title: 'Proposisi Nilai',
    subTitle: 'Value Propositions',
    items: bmc.valuePropositions,
    x: col3X,
    y: canvasTop,
    w: colWidth,
    h: topRowHeight,
    bgRgb: [255, 251, 235],
    borderRgb: [253, 230, 138],
    headerRgb: [217, 119, 6],
  });

  // 5. Customer Relationships (col 4, top half)
  drawBlock({
    title: 'Hubungan Pelanggan',
    subTitle: 'Customer Rel.',
    items: bmc.customerRelationships,
    x: col4X,
    y: canvasTop,
    w: colWidth,
    h: halfTopRowHeight,
    bgRgb: [250, 245, 255],
    borderRgb: [233, 213, 255],
    headerRgb: [147, 51, 234],
  });

  // 6. Channels (col 4, bottom half)
  drawBlock({
    title: 'Saluran Distribusi',
    subTitle: 'Channels',
    items: bmc.channels,
    x: col4X,
    y: canvasTop + halfTopRowHeight + 2,
    w: colWidth,
    h: halfTopRowHeight,
    bgRgb: [245, 243, 255],
    borderRgb: [221, 214, 254],
    headerRgb: [109, 40, 217],
  });

  // 7. Customer Segments (col 5, full top height)
  drawBlock({
    title: 'Segmen Pelanggan',
    subTitle: 'Customer Segments',
    items: bmc.customerSegments,
    x: col5X,
    y: canvasTop,
    w: colWidth,
    h: topRowHeight,
    bgRgb: [240, 253, 244],
    borderRgb: [187, 247, 208],
    headerRgb: [22, 163, 74],
  });

  // Bottom Row: Cost Structure & Revenue Streams (Split 50-50)
  const bottomWidth = (contentWidth - 2) / 2;

  // 8. Cost Structure
  drawBlock({
    title: 'Struktur Biaya',
    subTitle: 'Cost Structure',
    items: bmc.costStructure,
    x: margin,
    y: bottomRowTop,
    w: bottomWidth,
    h: bottomRowHeight,
    bgRgb: [255, 241, 242],
    borderRgb: [254, 205, 211],
    headerRgb: [225, 29, 72],
  });

  // 9. Revenue Streams
  drawBlock({
    title: 'Sumber Pendapatan',
    subTitle: 'Revenue Streams',
    items: bmc.revenueStreams,
    x: margin + bottomWidth + 2,
    y: bottomRowTop,
    w: bottomWidth,
    h: bottomRowHeight,
    bgRgb: [240, 253, 244],
    borderRgb: [187, 247, 208],
    headerRgb: [21, 128, 61],
  });

  const fileName = `${(bmc.businessName || 'BMC').replace(/[^a-zA-Z0-9]/g, '_')}_Canvas_Poster.pdf`;
  doc.save(fileName);
}

// 2. Full Multi-Page Strategy & BMC Report (Portrait A4)
function generateFullReportPdf(bmc: BmcData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // --- PAGE 1: COVER ---
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Accent line
  doc.setFillColor(59, 130, 246);
  doc.rect(margin, 40, 30, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  const titleLines = doc.splitTextToSize(bmc.businessName || 'Business Model Canvas', contentWidth);
  doc.text(titleLines, margin, 55);

  const titleHeight = titleLines.length * 11;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(190, 210, 240);
  const taglineLines = doc.splitTextToSize(bmc.tagline || 'Rancangan Strategis Model Bisnis Komprehensif', contentWidth);
  doc.text(taglineLines, margin, 55 + titleHeight);

  // Executive summary box on cover
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin, 120, contentWidth, 80, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(56, 189, 248);
  doc.text('RINGKASAN EKSEKUTIF', margin + 10, 133);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(226, 232, 240);
  const summaryLines = doc.splitTextToSize(bmc.executiveSummary, contentWidth - 20);
  doc.text(summaryLines, margin + 10, 143);

  // Elevator pitch
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(52, 211, 153);
  doc.text('ELEVATOR PITCH', margin + 10, 175);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  const pitchLines = doc.splitTextToSize(`"${bmc.elevatorPitch}"`, contentWidth - 20);
  doc.text(pitchLines, margin + 10, 183);

  // Meta footer
  const dateStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`Dokumen Strategi Bisnis • ${dateStr}`, margin, 260);
  doc.text(`Industri: ${bmc.metadata?.industry || 'Teknologi & Inovasi'}`, margin, 266);

  // --- PAGE 2: IN-DEPTH 9 BLOCKS ANALYSIS ---
  doc.addPage('a4', 'portrait');
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  const addPageHeader = (title: string, subtitle: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42);
    doc.text(title, margin, margin + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(subtitle, margin, margin + 11);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(margin, margin + 15, pageWidth - margin, margin + 15);
  };

  addPageHeader(
    'Rincian 9 Blok Model Bisnis',
    `${bmc.businessName} - Analisis Elemen Nilai & Operasional`
  );

  let curY = margin + 22;

  const renderSection = (title: string, items: BmcItem[], colorRgb: [number, number, number]) => {
    if (curY > 250) {
      doc.addPage('a4', 'portrait');
      addPageHeader('Rincian 9 Blok Model Bisnis (Lanjutan)', `${bmc.businessName}`);
      curY = margin + 22;
    }

    doc.setFillColor(colorRgb[0], colorRgb[1], colorRgb[2]);
    doc.roundedRect(margin, curY, contentWidth, 7, 1.5, 1.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(title, margin + 5, curY + 5);

    curY += 10;

    for (const item of items) {
      if (curY > 265) {
        doc.addPage('a4', 'portrait');
        addPageHeader('Rincian 9 Blok Model Bisnis (Lanjutan)', `${bmc.businessName}`);
        curY = margin + 22;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text(`• ${item.title}`, margin + 3, curY);

      if (item.tag) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text(`[${item.tag}]`, margin + contentWidth - 3, curY, { align: 'right' });
      }

      curY += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      const descLines = doc.splitTextToSize(item.description, contentWidth - 8);
      doc.text(descLines, margin + 6, curY);
      curY += descLines.length * 4 + 3;
    }

    curY += 4;
  };

  renderSection('1. PROPOSISI NILAI (VALUE PROPOSITIONS)', bmc.valuePropositions, [217, 119, 6]);
  renderSection('2. SEGMEN PELANGGAN (CUSTOMER SEGMENTS)', bmc.customerSegments, [22, 163, 74]);
  renderSection('3. SALURAN DISTRIBUSI (CHANNELS)', bmc.channels, [109, 40, 217]);
  renderSection('4. HUBUNGAN PELANGGAN (CUSTOMER RELATIONSHIPS)', bmc.customerRelationships, [147, 51, 234]);
  renderSection('5. SUMBER PENDAPATAN (REVENUE STREAMS)', bmc.revenueStreams, [21, 128, 61]);
  renderSection('6. STRUKTUR BIAYA (COST STRUCTURE)', bmc.costStructure, [225, 29, 72]);
  renderSection('7. AKTIVITAS UTAMA (KEY ACTIVITIES)', bmc.keyActivities, [13, 148, 136]);
  renderSection('8. SUMBER DAYA UTAMA (KEY RESOURCES)', bmc.keyResources, [2, 132, 199]);
  renderSection('9. KEMITRAAN UTAMA (KEY PARTNERS)', bmc.keyPartners, [51, 65, 85]);

  // --- NEXT PAGE: FINANCIAL ARCHITECTURE & ROADMAP ---
  doc.addPage('a4', 'portrait');
  addPageHeader('Arsitektur Finansial & Rencana Aksi', `${bmc.businessName} - Panduan Eksekusi`);
  curY = margin + 22;

  if (bmc.financialOverview) {
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, curY, contentWidth, 38, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('IKHTISAR FINANSIAL & UNIT ECONOMICS', margin + 5, curY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(`Estimasi Margin Kotor: ${bmc.financialOverview.estimatedGrossMargin}`, margin + 5, curY + 15);
    doc.text(`Penggerak Biaya Utama: ${bmc.financialOverview.primaryCostDrivers.join(', ')}`, margin + 5, curY + 22);
    doc.text(`Metrik Kunci (KPI): ${bmc.financialOverview.keyMetrics.join(', ')}`, margin + 5, curY + 29);

    curY += 46;
  }

  // Next Actions Roadmap
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('LANGKAH AKSI VALIDASI & PELUNCURAN', margin, curY);
  curY += 7;

  const actions = bmc.nextActionItems || [
    'Lakukan 15-20 wawancara mendalam dengan segmen pengguna awal.',
    'Rilis versi MVP sederhana untuk menguji penerimaan proposisi nilai.',
    'Hitung biaya akuisisi pelanggan (CAC) pada 2 saluran utama.',
    'Kunci kemitraan strategis awal.',
  ];

  actions.forEach((act, idx) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, curY, contentWidth, 12, 1.5, 1.5, 'FD');

    doc.setFillColor(59, 130, 246);
    doc.circle(margin + 6, curY + 6, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text(String(idx + 1), margin + 6, curY + 7, { align: 'center' });

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(act, margin + 13, curY + 7.5);

    curY += 15;
  });

  const fileName = `${(bmc.businessName || 'BMC').replace(/[^a-zA-Z0-9]/g, '_')}_Strategi_Lengkap.pdf`;
  doc.save(fileName);
}
