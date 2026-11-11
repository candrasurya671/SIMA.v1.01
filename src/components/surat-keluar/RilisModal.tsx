import React, { useState } from 'react';
import { X, Send, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { SuratKeluar, UserAccount, AppSettings } from '../../types';

interface RilisModalProps {
  isOpen: boolean;
  onClose: () => void;
  surat: SuratKeluar | null;
  settings: AppSettings;
  activeUser: UserAccount;
  nextOfficialNumber: string;
  onRelease: (id: string, noSuratResmi: string, tglRilis: string) => void;
}

export const RilisModal: React.FC<RilisModalProps> = ({
  isOpen,
  onClose,
  surat,
  settings,
  activeUser,
  nextOfficialNumber,
  onRelease,
}) => {
  if (!isOpen || !surat) return null;

  const [noSuratResmi, setNoSuratResmi] = useState(surat.noSuratResmi || nextOfficialNumber);
  const now = new Date();
  const [tglRilis, setTglRilis] = useState(`${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noSuratResmi.trim()) {
      alert('Nomor surat resmi harus diisi!');
      return;
    }
    onRelease(surat.id, noSuratResmi.trim(), tglRilis);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Rilis Surat Keluar Resmi
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Draft: {surat.noDraft} · Ditandatangani Pimpinan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-2.5 text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="leading-snug">
              <p className="font-bold">Draft Telah Disetujui Pimpinan</p>
              <p className="text-[11px] text-emerald-800">
                Ditandatangani oleh {surat.penandatanganNama} (Token QR: {surat.qrCodeToken})
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500 font-medium">Perihal Surat:</span>
            <p className="font-semibold text-slate-900">{surat.perihal}</p>
            <p className="text-slate-600">Tujuan: {surat.tujuanPenerima}</p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tetapkan Nomor Surat Keluar Resmi: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={noSuratResmi}
              onChange={(e) => setNoSuratResmi(e.target.value)}
              placeholder="Contoh: 421.3/055/SMAN1/III/2026"
              required
              className="w-full p-2.5 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 text-xs"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Nomor ini akan tercatat dalam buku agenda keluar dan halaman validasi publik.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Waktu / Tanggal Rilis Resmi:
            </label>
            <input
              type="text"
              value={tglRilis}
              onChange={(e) => setTglRilis(e.target.value)}
              required
              className="w-full p-2.5 border border-slate-300 rounded-lg font-mono text-slate-800 text-xs"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Rilis Surat Sekarang</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
