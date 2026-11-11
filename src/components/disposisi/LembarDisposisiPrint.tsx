import React from 'react';
import { Printer, X, Download, ShieldCheck } from 'lucide-react';
import { Disposisi, SuratMasuk, Bagian, AppSettings } from '../../types';
import { InstitutionLogo } from '../common/InstitutionLogo';

interface LembarDisposisiPrintProps {
  disposisi: Disposisi;
  suratMasuk?: SuratMasuk;
  bagianList: Bagian[];
  settings: AppSettings;
  onClose: () => void;
}

export const LembarDisposisiPrint: React.FC<LembarDisposisiPrintProps> = ({
  disposisi,
  suratMasuk,
  bagianList,
  settings,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const allInstructions = [
    'Tindak Lanjuti Segera',
    'Hadiri / Wakili',
    'Pelajari & Beri Saran / Masukan',
    'Siapkan Bahan / Konsep Jawaban',
    'Koordinasikan dengan Unit Terkait',
    'Untuk Diketahui & Arsipkan',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Modal Controls (Hidden in print) */}
        <div className="no-print px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Cetak Lembar Disposisi Resmi
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Agenda: {disposisi.noAgenda} · No. Surat: {disposisi.noSurat}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet Viewport */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-100 flex justify-center">
          <div className="print-container bg-white w-full max-w-2xl p-8 rounded shadow-xs border border-slate-300 text-slate-900 text-xs">
            {/* Kop Surat */}
            <div className="flex items-center gap-4 pb-3 border-b-2 border-slate-900 text-center">
              <InstitutionLogo
                type={settings.logoType}
                customUrl={settings.customLogoUrl}
                size={65}
              />
              <div className="flex-1">
                <p className="text-[11px] font-bold tracking-wider uppercase text-slate-700 whitespace-pre-line leading-tight">
                  {settings.instansiHeader}
                </p>
                <h2 className="text-base font-extrabold tracking-tight text-slate-900 uppercase mt-0.5">
                  {settings.instansiName}
                </h2>
                <p className="text-[10px] text-slate-600 leading-tight mt-0.5">
                  {settings.alamat}, {settings.kota}, {settings.provinsi} {settings.kodePos}
                </p>
                <p className="text-[9px] text-slate-500 font-mono">
                  Telp: {settings.telepon} · Email: {settings.email} · Web: {settings.website}
                </p>
              </div>
            </div>
            <div className="h-0.5 bg-slate-900 mt-0.5 mb-4" />

            {/* Title */}
            <div className="text-center mb-4">
              <h1 className="text-sm font-bold uppercase tracking-widest text-slate-900 inline-block border-b-2 border-slate-900 pb-0.5">
                LEMBAR DISPOSISI
              </h1>
            </div>

            {/* Top Meta Box */}
            <div className="border border-slate-900 mb-4 divide-y divide-slate-900">
              <div className="grid grid-cols-2 divide-x divide-slate-900">
                <div className="p-2 space-y-1">
                  <div className="flex">
                    <span className="w-28 text-slate-600">Surat Dari</span>
                    <span className="font-semibold text-slate-900">: {disposisi.pengirim}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 text-slate-600">Nomor Surat</span>
                    <span className="font-mono font-medium">: {disposisi.noSurat}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 text-slate-600">Tanggal Surat</span>
                    <span>: {suratMasuk?.tglSurat || '-'}</span>
                  </div>
                </div>
                <div className="p-2 space-y-1">
                  <div className="flex">
                    <span className="w-28 text-slate-600">No. Agenda</span>
                    <span className="font-mono font-bold text-slate-900">: {disposisi.noAgenda}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 text-slate-600">Diterima Tgl</span>
                    <span>: {suratMasuk?.tglDiterima || '-'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 text-slate-600">Sifat Surat</span>
                    <span className="font-semibold">: {disposisi.sifat}</span>
                  </div>
                </div>
              </div>

              {/* Perihal */}
              <div className="p-2">
                <span className="text-slate-600 block mb-0.5 font-medium">Perihal / Isi Ringkas:</span>
                <p className="font-semibold text-slate-900 leading-normal">
                  {disposisi.perihal}
                </p>
              </div>

              {/* Batas Waktu */}
              <div className="p-2 flex items-center justify-between bg-slate-50">
                <span className="font-medium text-slate-700">Tanggal Batas Penyelesaian:</span>
                <span className="font-mono font-bold text-red-700">{disposisi.batasWaktu}</span>
              </div>
            </div>

            {/* Main Disposition Grid: Diteruskan Kepada vs Petunjuk/Instruksi */}
            <div className="border border-slate-900 grid grid-cols-2 divide-x divide-slate-900 mb-4">
              {/* Left Column: Diteruskan Kepada (Daftar Bidang) */}
              <div className="p-3">
                <h4 className="font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 mb-2 text-[11px]">
                  Diteruskan Kepada Sdr :
                </h4>
                <div className="space-y-1.5">
                  {bagianList.map((bg) => {
                    const isTarget = disposisi.targets.some((t) => t.bagianId === bg.id);
                    return (
                      <div key={bg.id} className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-xs border border-slate-800 flex items-center justify-center font-bold text-xs ${isTarget ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                          {isTarget ? '✓' : ''}
                        </span>
                        <span className={`text-[11px] ${isTarget ? 'font-bold text-slate-900' : 'text-slate-700'}`}>
                          {bg.nama}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Petunjuk / Instruksi */}
              <div className="p-3">
                <h4 className="font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 mb-2 text-[11px]">
                  Petunjuk / Instruksi :
                </h4>
                <div className="space-y-1.5">
                  {allInstructions.map((instruksi) => {
                    const isSelected = disposisi.instruksi.includes(instruksi);
                    return (
                      <div key={instruksi} className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-xs border border-slate-800 flex items-center justify-center font-bold text-xs ${isSelected ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                          {isSelected ? '✓' : ''}
                        </span>
                        <span className={`text-[11px] ${isSelected ? 'font-bold text-slate-900' : 'text-slate-700'}`}>
                          {instruksi}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Catatan Khusus Pimpinan */}
            <div className="border border-slate-900 p-3 mb-4 min-h-[90px]">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] mb-1">
                Catatan Khusus Pimpinan:
              </h4>
              <p className="text-[11px] text-slate-800 leading-relaxed italic bg-slate-50 p-2 rounded border border-slate-200">
                "{disposisi.catatanKhusus || 'Harap dilaksanakan dan dikoordinasikan sesuai prosedur kedinasan.'}"
              </p>
            </div>

            {/* Signature Pimpinan */}
            <div className="flex justify-end mb-4">
              <div className="text-center w-60">
                <p className="text-[11px] text-slate-700 mb-1">
                  {settings.kota}, {disposisi.tglDisposisi}
                </p>
                <p className="text-[11px] font-semibold text-slate-900">
                  {disposisi.jabatanPemberi},
                </p>
                <div className="h-16 flex items-center justify-center my-1">
                  <div className="border border-slate-400 px-3 py-1 rounded text-[10px] text-slate-600 bg-slate-50">
                    [ Disposisi Terverifikasi Sistem ]
                  </div>
                </div>
                <p className="text-[11px] font-bold text-slate-900 underline">
                  {disposisi.pemberiDisposisi}
                </p>
              </div>
            </div>

            {/* Status Tindak Lanjut oleh Bidang (Audit Footer) */}
            <div className="border-t border-slate-300 pt-3 text-[10px] text-slate-600">
              <span className="font-bold uppercase text-slate-800 block mb-1">Catatan Tindak Lanjut Bidang Penerima:</span>
              <div className="space-y-1">
                {disposisi.targets.map((t) => {
                  const bg = bagianList.find((b) => b.id === t.bagianId);
                  return (
                    <div key={t.bagianId} className="flex items-start justify-between bg-slate-50 p-1.5 rounded">
                      <div>
                        <span className="font-semibold text-slate-900">{bg?.nama || t.bagianId}: </span>
                        <span>{t.catatanTindakLanjut || 'Belum ada catatan tindak lanjut.'}</span>
                      </div>
                      <span className="font-mono text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 whitespace-nowrap ml-2">
                        {t.statusTindakLanjut}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
