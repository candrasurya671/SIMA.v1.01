import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, ShieldCheck, FileText, QrCode } from 'lucide-react';
import { SuratKeluar, UserAccount } from '../../types';
import { StorageService } from '../../services/storageService';

interface PersetujuanModalProps {
  isOpen: boolean;
  onClose: () => void;
  surat: SuratKeluar | null;
  activeUser: UserAccount;
  onApprove: (id: string, token: string, tglTtd: string, catatan: string) => void;
  onReject: (id: string, catatanRevisi: string) => void;
}

export const PersetujuanModal: React.FC<PersetujuanModalProps> = ({
  isOpen,
  onClose,
  surat,
  activeUser,
  onApprove,
  onReject,
}) => {
  if (!isOpen || !surat) return null;

  const [mode, setMode] = useState<'review' | 'approve' | 'revise'>('review');
  const [catatanPimpinan, setCatatanPimpinan] = useState('');
  const [catatanRevisi, setCatatanRevisi] = useState('');

  const generateToken = () => {
    return StorageService.generateValidationToken();
  };

  const handleExecuteApprove = () => {
    const token = surat.qrCodeToken || generateToken();
    const now = new Date();
    const tglTtd = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`;
    onApprove(surat.id, token, tglTtd, catatanPimpinan);
    onClose();
  };

  const handleExecuteReject = () => {
    if (!catatanRevisi.trim()) {
      alert('Harap berikan catatan instruksi perbaikan kepada admin!');
      return;
    }
    onReject(surat.id, catatanRevisi);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Tinjauan & Persetujuan Draft Surat Keluar
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {surat.noDraft} · {surat.status}
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

        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Draft Details */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
            <div className="flex justify-between border-b border-slate-200/80 pb-2">
              <span className="text-slate-500 font-medium">Tujuan Penerima:</span>
              <span className="font-semibold text-slate-900">{surat.tujuanPenerima}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/80 pb-2">
              <span className="text-slate-500 font-medium">Perihal Surat:</span>
              <span className="font-semibold text-slate-900 text-right max-w-sm">{surat.perihal}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/80 pb-2">
              <span className="text-slate-500 font-medium">Tanggal Surat & Sifat:</span>
              <span className="text-slate-800 font-mono">{surat.tglSurat} · Sifat: {surat.sifat}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Pengaju Draft:</span>
              <span className="text-slate-700">{surat.pembuatDraft}</span>
            </div>
          </div>

          <div>
            <span className="font-semibold text-slate-800 block mb-1">
              Ringkasan Pokok Isi Dokumen:
            </span>
            <div className="p-3 bg-white border border-slate-200 rounded-lg leading-relaxed text-slate-800 whitespace-pre-line text-xs">
              {surat.ringkasanIsi}
            </div>
          </div>

          {/* Mode Switcher / Action Prompts */}
          {mode === 'review' && (
            <div className="pt-4 border-t border-slate-200">
              <h4 className="font-bold text-slate-900 mb-3 text-center">
                Pilih Keputusan Persetujuan Pimpinan:
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setMode('approve')}
                  className="p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 transition-colors text-center group"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h5 className="font-bold text-sm text-emerald-950">
                    1. Tanda Tangan (Approve)
                  </h5>
                  <p className="text-[11px] text-emerald-800 mt-1">
                    Setujui draft dan terbitkan QR Code Tanda Tangan Digital resmi secara otomatis.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('revise')}
                  className="p-4 rounded-xl border-2 border-amber-500 bg-amber-50/50 hover:bg-amber-50 transition-colors text-center group"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <h5 className="font-bold text-sm text-amber-950">
                    2. Berikan Catatan (Revisi)
                  </h5>
                  <p className="text-[11px] text-amber-800 mt-1">
                    Instruksikan perbaikan redaksi atau lampiran kepada Admin sebelum ditandatangani.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Approve Form View */}
          {mode === 'approve' && (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Konfirmasi Pembubuhan Tanda Tangan Digital Resmi</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Sistem akan membubuhkan sertifikat elektronik atas nama <strong>{surat.penandatanganNama}</strong> (NIP. {surat.penandatanganNip}) yang dilengkapi barcode verifikasi publik.
              </p>
              <div>
                <label className="block font-semibold text-emerald-950 mb-1">
                  Catatan Persetujuan (Opsional):
                </label>
                <input
                  type="text"
                  value={catatanPimpinan}
                  onChange={(e) => setCatatanPimpinan(e.target.value)}
                  placeholder="Contoh: Disetujui untuk dirilis dan dikirim segera..."
                  className="w-full p-2 bg-white border border-emerald-300 rounded-lg text-xs"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMode('review')}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-medium text-slate-700"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={handleExecuteApprove}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-2xs"
                >
                  Sahkan & Tanda Tangani QR
                </button>
              </div>
            </div>
          )}

          {/* Revise Form View */}
          {mode === 'revise' && (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <span>Instruksi Catatan Revisi untuk Admin</span>
              </div>
              <p className="text-xs text-amber-800">
                Jelaskan bagian mana dari draft surat keluar ini yang harus diperbaiki oleh pembuat draft.
              </p>
              <div>
                <label className="block font-semibold text-amber-950 mb-1">
                  Catatan Revisi: <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={catatanRevisi}
                  onChange={(e) => setCatatanRevisi(e.target.value)}
                  placeholder="Contoh: Lampirkan susunan panitia dan perbaiki tanggal pelaksanaan rapat menjadi hari Kamis..."
                  required
                  className="w-full p-2.5 bg-white border border-amber-300 rounded-lg text-xs"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMode('review')}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-medium text-slate-700"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={handleExecuteReject}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow-2xs"
                >
                  Kirim Catatan Revisi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
