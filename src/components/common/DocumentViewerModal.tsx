import React, { useState } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Calendar, 
  User, 
  FileText, 
  Building2,
  Copy,
  Check,
  Loader2
} from 'lucide-react';
import { AppSettings, SuratMasuk, SuratKeluar } from '../../types';
import { InstitutionLogo } from './InstitutionLogo';
import { QrCodeGenerator } from './QrCodeGenerator';
import { downloadLetterAsPdf, getLetterPdfBlobUrl } from '../../utils/pdfGenerator';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: SuratMasuk | SuratKeluar | null;
  type: 'masuk' | 'keluar';
  settings: AppSettings;
  verificationBaseUrl?: string;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  document,
  type,
  settings,
  verificationBaseUrl = typeof window !== 'undefined' ? window.location.origin : '',
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !document) return null;

  const isMasuk = type === 'masuk';
  const masuk = isMasuk ? (document as SuratMasuk) : null;
  const keluar = !isMasuk ? (document as SuratKeluar) : null;

  const verifyUrl = keluar && keluar.qrCodeToken 
    ? `${verificationBaseUrl}?verify=${keluar.qrCodeToken}`
    : '';

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      // 1. If an original file was uploaded during pembuatan surat, download that exact file!
      if (document.fileDataUrl) {
        const link = window.document.createElement('a');
        link.href = document.fileDataUrl;
        link.download = document.fileName || 'dokumen_asli.pdf';
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
        return;
      }

      // 2. Otherwise (surat asli dibuat manual tanpa berkas upload), download official PDF surat asli!
      await downloadLetterAsPdf(document, type, settings);
    } catch (err) {
      console.error('Download PDF error:', err);
      alert('Gagal mengunduh berkas. Silakan coba kembali.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleOpenStoragePdf = async () => {
    try {
      setIsGeneratingPdf(true);
      if (document.fileDataUrl) {
        // Open original uploaded file directly in a new tab
        const win = window.open();
        if (win) {
          win.document.write(`<iframe src="${document.fileDataUrl}" frameborder="0" style="border:0; width:100%; height:100%;" allowfullscreen></iframe>`);
        } else {
          window.open(document.fileDataUrl, '_blank');
        }
        return;
      }
      const blobUrl = await getLetterPdfBlobUrl(document, type, settings);
      window.open(blobUrl, '_blank');
    } catch (err) {
      console.error('Open PDF in new tab error:', err);
      // Fallback: copy direct app link
      handleCopyStorageLink();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleCopyStorageLink = () => {
    const directLink = `${verificationBaseUrl}?doc=${document.id}&type=${type}&file=${encodeURIComponent(document.fileName)}`;
    navigator.clipboard.writeText(directLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 leading-tight">
                {isMasuk ? 'Pratinjau Berkas Digital Surat Masuk' : 'Pratinjau Berkas Resmi Surat Keluar'}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {isMasuk ? `${masuk?.noAgenda} · ${masuk?.noSurat}` : `${keluar?.noSuratResmi || keluar?.noDraft}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenStoragePdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
              title="Buka berkas digital PDF asli di tab baru"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
              ) : (
                <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
              )}
              <span>Buka di Tab Baru</span>
            </button>

            <button
              type="button"
              onClick={handleCopyStorageLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
              title="Salin tautan penyimpanan digital"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                  <span>Salin Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer disabled:opacity-70"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Membuat PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh File PDF</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Preview Canvas (Simulating Institutional Letter Sheet) */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100 flex justify-center">
          <div className="bg-white w-full max-w-2xl min-h-[750px] p-8 rounded shadow-xs border border-slate-200 text-slate-900 flex flex-col justify-between">
            {/* Kop Surat */}
            <div>
              <div className="flex items-center gap-4 pb-4 border-b-2 border-slate-900">
                <InstitutionLogo
                  type={settings.logoType}
                  customUrl={settings.customLogoUrl}
                  size={64}
                />
                <div className="flex-1 text-center">
                  <p className="text-xs font-bold tracking-wider uppercase text-slate-700 whitespace-pre-line leading-tight">
                    {settings.instansiHeader}
                  </p>
                  <h2 className="text-base font-extrabold tracking-tight text-slate-900 uppercase mt-0.5">
                    {settings.instansiName}
                  </h2>
                  <p className="text-[11px] text-slate-600 mt-1 leading-normal">
                    {settings.alamat}, {settings.kota}, {settings.provinsi} {settings.kodePos}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Telp: {settings.telepon} · Email: {settings.email}
                  </p>
                </div>
              </div>
              <div className="h-0.5 bg-slate-900 mt-0.5 mb-6" />

              {/* Document Meta */}
              <div className="grid grid-cols-2 gap-4 text-xs mb-6">
                <div className="space-y-1">
                  <div className="flex">
                    <span className="w-24 text-slate-500">Nomor</span>
                    <span className="font-semibold text-slate-900">: {isMasuk ? masuk?.noSurat : (keluar?.noSuratResmi || keluar?.noDraft)}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-slate-500">Sifat</span>
                    <span className="text-slate-800">: {document.sifat}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-slate-500">Lampiran</span>
                    <span className="text-slate-800">: 1 (satu) Berkas Digital</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-slate-500">Perihal</span>
                    <span className="font-semibold text-slate-900">: {document.perihal}</span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-slate-700">
                    {settings.kota}, {isMasuk ? masuk?.tglSurat : keluar?.tglSurat}
                  </p>
                  <div className="mt-2 text-left sm:text-right">
                    <p className="text-slate-500">Kepada Yth:</p>
                    <p className="font-medium text-slate-900">
                      {isMasuk ? masuk?.tujuan : keluar?.tujuanPenerima}
                    </p>
                    <p className="text-slate-600">di Tempat</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="text-xs leading-relaxed text-slate-800 space-y-3 pt-2">
                <p className="font-semibold text-slate-900">Dengan hormat,</p>
                <div 
                  className="text-justify leading-relaxed space-y-2 [&_table]:border-collapse [&_table]:w-full [&_table]:my-3 [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:p-2 [&_th]:font-bold [&_td]:border [&_td]:border-slate-300 [&_td]:p-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:mt-2 [&_h4]:text-xs [&_h4]:font-bold [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:bg-blue-50/50 [&_blockquote]:py-1"
                  dangerouslySetInnerHTML={{ 
                    __html: (isMasuk ? masuk?.isiRingkas : keluar?.ringkasanIsi) || document.perihal 
                  }}
                />
                <p className="text-justify pt-1">
                  Demikian surat ini kami sampaikan untuk menjadi perhatian dan ditindaklanjuti sebagaimana mestinya. Atas kerja sama dan perhatian yang diberikan, kami ucapkan terima kasih.
                </p>
              </div>
            </div>

            {/* Signature Area */}
            <div className="pt-8 flex justify-end">
              <div className="text-center w-64 space-y-2">
                <p className="text-xs text-slate-700">
                  {keluar ? keluar.penandatanganJabatan : 'Pengirim Resmi'},
                </p>

                {keluar && (keluar.status === 'Disetujui' || keluar.status === 'Rilis') && keluar.qrCodeToken ? (
                  <div className="flex flex-col items-center py-1">
                    <QrCodeGenerator value={verifyUrl} size={90} />
                    <span className="text-[9px] font-mono text-emerald-700 font-semibold mt-1">
                      TERTANDATANGANI ELEKTRONIK
                    </span>
                    <span className="text-[8px] font-mono text-slate-400">
                      Token: {keluar.qrCodeToken.slice(0, 16)}...
                    </span>
                  </div>
                ) : (
                  <div className="h-16 flex items-center justify-center border border-dashed border-slate-200 rounded text-[11px] text-slate-400 my-2">
                    {isMasuk ? '[ Cap & TTD Pengirim Asli ]' : '[ Menunggu Pengesahan TTD Digital ]'}
                  </div>
                )}

                <div>
                  <p className="text-xs font-bold text-slate-900 underline">
                    {keluar ? keluar.penandatanganNama : (isMasuk ? masuk?.pengirim : settings.instansiName)}
                  </p>
                  {keluar && keluar.penandatanganNip && (
                    <p className="text-[10px] font-mono text-slate-500">
                      NIP. {keluar.penandatanganNip}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-slate-700">{document.fileName}</span>
            <span>·</span>
            <span>{document.fileSize}</span>
            <span>·</span>
            {document.fileDataUrl ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Berkas Asli Terlampir (Sesuai Unggahan)
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                Surat Asli Sistem (Dibuat Manual)
              </span>
            )}
          </div>
          {keluar && keluar.status === 'Rilis' && (
            <span className="text-emerald-600 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi Tanda Tangan QR
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
