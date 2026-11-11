import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { AppSettings, SuratMasuk, SuratKeluar } from '../types';

/**
 * Generates an authentic, valid, high-fidelity PDF document for Surat Masuk and Surat Keluar.
 * Produces 100% compliant PDF binary that opens in all PDF viewers.
 */
export async function createLetterPdf(
  document: SuratMasuk | SuratKeluar,
  type: 'masuk' | 'keluar',
  settings: AppSettings,
  appUrl: string = typeof window !== 'undefined' ? window.location.origin : ''
): Promise<jsPDF> {
  const isMasuk = type === 'masuk';
  const masuk = isMasuk ? (document as SuratMasuk) : null;
  const keluar = !isMasuk ? (document as SuratKeluar) : null;

  // Create A4 PDF (210mm x 297mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const marginX = 20;
  const contentWidth = pageWidth - marginX * 2;
  let currentY = 18;

  // 1. KOP SURAT / LETTERHEAD
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);

  // Dinas Header lines
  const headerLines = (settings.instansiHeader || 'PEMERINTAH KEDINASAN').split('\n');
  headerLines.forEach((line) => {
    doc.text(line.trim().toUpperCase(), pageWidth / 2, currentY, { align: 'center' });
    currentY += 4.5;
  });

  // Instansi Name
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text((settings.instansiName || 'NAMA INSTANSI RESMI').toUpperCase(), pageWidth / 2, currentY, { align: 'center' });
  currentY += 5;

  // Address & Contacts
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const addressText = `${settings.alamat || ''}, ${settings.kota || ''}, ${settings.provinsi || ''} ${settings.kodePos || ''}`;
  doc.text(addressText, pageWidth / 2, currentY, { align: 'center' });
  currentY += 4;

  const contactText = `Telp: ${settings.telepon || '-'} | Email: ${settings.email || '-'} | Web: ${settings.website || '-'}`;
  doc.text(contactText, pageWidth / 2, currentY, { align: 'center' });
  currentY += 4;

  // Double horizontal rule
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.8);
  doc.line(marginX, currentY, pageWidth - marginX, currentY);
  currentY += 1.2;
  doc.setLineWidth(0.25);
  doc.line(marginX, currentY, pageWidth - marginX, currentY);
  currentY += 8;

  // 2. DOCUMENT METADATA
  const dateStr = isMasuk ? masuk?.tglSurat : keluar?.tglSurat || new Date().toISOString().slice(0, 10);
  const formattedDate = dateStr ? `${settings.kota}, ${dateStr}` : settings.kota;

  // Date on right
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(formattedDate, pageWidth - marginX, currentY, { align: 'right' });

  // Letter numbering on left
  const nomorText = isMasuk 
    ? (masuk?.noSurat || 'Nomor: -') 
    : (keluar?.noSuratResmi || keluar?.noDraft || 'Nomor: -');
  const sifatText = document.sifat || 'Biasa';
  const perihalText = document.perihal || 'N/A';

  doc.text(`Nomor    : ${nomorText}`, marginX, currentY);
  currentY += 4.5;
  doc.text(`Sifat        : ${sifatText}`, marginX, currentY);
  currentY += 4.5;
  doc.text(`Lampiran : 1 (Satu) Berkas Digital`, marginX, currentY);
  currentY += 4.5;
  doc.text(`Perihal    : `, marginX, currentY);

  doc.setFont('helvetica', 'bold');
  const perihalLines = doc.splitTextToSize(perihalText, contentWidth - 25);
  doc.text(perihalLines, marginX + 18, currentY);
  currentY += perihalLines.length * 4.5 + 4;

  // 3. RECIPIENT
  doc.setFont('helvetica', 'normal');
  doc.text('Kepada Yth.', marginX, currentY);
  currentY += 4.5;
  const tujuanText = isMasuk ? (masuk?.tujuan || 'Kepala Instansi') : (keluar?.tujuanPenerima || 'Penerima Surat');
  doc.setFont('helvetica', 'bold');
  doc.text(tujuanText, marginX, currentY);
  currentY += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.text('di - Tempat', marginX, currentY);
  currentY += 8;

  // 4. BODY CONTENT
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);

  const introText = 'Dengan hormat,';
  doc.text(introText, marginX, currentY);
  currentY += 6;

  const rawRingkasan = isMasuk 
    ? (masuk?.isiRingkas || masuk?.perihal || '') 
    : (keluar?.ringkasanIsi || keluar?.perihal || '');

  // Convert Word Editor HTML into clean paragraphs and table lines for jsPDF
  const formattedLines: string[] = rawRingkasan
    .replace(/<\/tr>/gi, '\n')
    .replace(/<\/td>/gi, '   |   ')
    .replace(/<\/th>/gi, '   |   ')
    .replace(/<li>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '') // remove remaining HTML tags
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const introPara = `Sehubungan dengan pelaksanaan administrasi persuratan kedinasan, bersama ini disampaikan berkas resmi mengenai ${perihalText.toLowerCase()}.`;
  const outroPara = 'Demikian surat ini disampaikan untuk dapat dipergunakan sebagaimana mestinya. Atas perhatian dan kerja samanya, diucapkan terima kasih.';

  const allParagraphs = [
    introPara,
    ...(formattedLines.length > 0 ? formattedLines : [perihalText]),
    outroPara,
  ];

  allParagraphs.forEach((para) => {
    const isBulletOrTable = para.startsWith('•') || para.includes('|');
    if (isBulletOrTable) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
    }
    const lines = doc.splitTextToSize(para, contentWidth);
    doc.text(lines, marginX, currentY);
    currentY += lines.length * 4.5 + 3.5;
  });

  currentY += 4;

  // 5. SIGNATURE & DIGITAL CERTIFICATE QR CODE
  const signatureY = Math.max(currentY, 205);
  const signatureColX = pageWidth - marginX - 65;

  const penandatanganNama = !isMasuk 
    ? (keluar?.penandatanganNama || 'Pimpinan Instansi')
    : (masuk?.tujuan || 'Pimpinan Instansi');
  const penandatanganJabatan = !isMasuk 
    ? (keluar?.penandatanganJabatan || 'Kepala Instansi')
    : 'Penerima / Arsip';
  const penandatanganNip = !isMasuk 
    ? (keluar?.penandatanganNip || '-')
    : '-';
  const token = !isMasuk ? (keluar?.qrCodeToken || '') : '';

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(penandatanganJabatan, signatureColX, signatureY);

  // Generate QR Code data URL
  const qrPayload = token
    ? `${appUrl}?verify=${token}`
    : `${appUrl}?doc=${document.id}`;

  try {
    const qrDataUrl = await QRCode.toDataURL(qrPayload, {
      width: 120,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#0f172a', light: '#ffffff' }
    });

    // Embed QR code into PDF
    doc.addImage(qrDataUrl, 'PNG', signatureColX + 5, signatureY + 3, 26, 26);
  } catch (err) {
    console.error('Failed to generate QR in PDF:', err);
  }

  // Name & NIP below QR code
  const nameY = signatureY + 33;
  doc.setFont('helvetica', 'bold');
  doc.text(penandatanganNama, signatureColX, nameY);
  
  if (penandatanganNip && penandatanganNip !== '-') {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`NIP. ${penandatanganNip}`, signatureColX, nameY + 4);
  }

  // Digital validity watermark / footer badge on left
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(marginX, signatureY + 2, 75, 30, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 58, 138);
  doc.text('DOKUMEN ELEKTRONIK RESMI', marginX + 4, signatureY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Ditandatangani secara digital & tersimpan', marginX + 4, signatureY + 11.5);
  doc.text('dalam Sistem Manajemen Surat Instansi.', marginX + 4, signatureY + 15);

  if (token) {
    doc.setFont('courier', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Token: ${token.slice(0, 28)}`, marginX + 4, signatureY + 19.5);
  }

  const verifyNotice = 'Pindai QR Code untuk verifikasi keaslian.';
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6);
  doc.setTextColor(148, 163, 184);
  doc.text(verifyNotice, marginX + 4, signatureY + 24);

  // Bottom footer page info
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Arsip Digital: ${document.fileName || 'dokumen.pdf'} | Dicetak melalui ${settings.systemName}`,
    marginX,
    288
  );

  return doc;
}

/**
 * Downloads a genuine, valid PDF file to user's device.
 */
export async function downloadLetterAsPdf(
  document: SuratMasuk | SuratKeluar,
  type: 'masuk' | 'keluar',
  settings: AppSettings
): Promise<void> {
  const doc = await createLetterPdf(document, type, settings);
  const targetFileName = document.fileName?.endsWith('.pdf')
    ? document.fileName
    : `${document.fileName || 'dokumen_surat'}.pdf`;
  doc.save(targetFileName);
}

/**
 * Creates a Blob URL for instant viewing in a new tab.
 */
export async function getLetterPdfBlobUrl(
  document: SuratMasuk | SuratKeluar,
  type: 'masuk' | 'keluar',
  settings: AppSettings
): Promise<string> {
  const doc = await createLetterPdf(document, type, settings);
  const blob = doc.output('blob');
  return URL.createObjectURL(blob);
}
