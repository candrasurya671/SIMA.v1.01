import React, { useState } from 'react';
import { X, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Disposisi, Bagian, UserAccount } from '../../types';

interface UpdateTindakLanjutModalProps {
  isOpen: boolean;
  onClose: () => void;
  disposisi: Disposisi | null;
  activeUser: UserAccount;
  bagianList: Bagian[];
  onSave: (disposisiId: string, status: 'Belum Diproses' | 'Dalam Proses' | 'Selesai', catatan: string) => void;
}

export const UpdateTindakLanjutModal: React.FC<UpdateTindakLanjutModalProps> = ({
  isOpen,
  onClose,
  disposisi,
  activeUser,
  bagianList,
  onSave,
}) => {
  if (!isOpen || !disposisi) return null;

  const currentBagianId = activeUser.bagianId || '';
  const currentTarget = disposisi.targets.find((t) => t.bagianId === currentBagianId);
  const currentBagian = bagianList.find((b) => b.id === currentBagianId);

  const [status, setStatus] = useState<'Belum Diproses' | 'Dalam Proses' | 'Selesai'>(
    currentTarget?.statusTindakLanjut || 'Dalam Proses'
  );
  const [catatan, setCatatan] = useState<string>(currentTarget?.catatanTindakLanjut || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(disposisi.id, status, catatan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Update Tindak Lanjut Disposisi
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              {disposisi.noAgenda} · {currentBagian?.nama || 'Bidang Anda'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
            <span className="font-semibold text-slate-800">Perihal:</span>
            <p className="text-slate-600">{disposisi.perihal}</p>
            {disposisi.catatanKhusus && (
              <p className="italic text-amber-800 pt-1">
                Catatan Kepala: "{disposisi.catatanKhusus}"
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Status Progres Tindak Lanjut:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('Belum Diproses')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors ${
                  status === 'Belum Diproses'
                    ? 'border-amber-500 bg-amber-50 text-amber-800 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                Belum Diproses
              </button>
              <button
                type="button"
                onClick={() => setStatus('Dalam Proses')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors ${
                  status === 'Dalam Proses'
                    ? 'border-blue-500 bg-blue-50 text-blue-800 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                Dalam Proses
              </button>
              <button
                type="button"
                onClick={() => setStatus('Selesai')}
                className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors ${
                  status === 'Selesai'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                Selesai
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Hasil / Tindakan yang Telah Dilakukan:
            </label>
            <textarea
              rows={4}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Jelaskan tindakan yang telah diambil oleh bidang Anda untuk menindaklanjuti disposisi ini..."
              required
              className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs"
            >
              Simpan Tindak Lanjut
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
