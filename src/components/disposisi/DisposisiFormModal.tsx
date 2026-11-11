import React, { useState } from 'react';
import { X, GitFork, Calendar, CheckSquare, AlertCircle } from 'lucide-react';
import { SuratMasuk, Bagian, Disposisi, SifatSurat, UserAccount } from '../../types';

interface DisposisiFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  suratMasuk: SuratMasuk | null;
  bagianList: Bagian[];
  activeUser: UserAccount;
  pimpinanName: string;
  pimpinanJabatan: string;
  onSave: (disposisiData: Omit<Disposisi, 'id' | 'createdAt'>) => void;
}

export const DisposisiFormModal: React.FC<DisposisiFormModalProps> = ({
  isOpen,
  onClose,
  suratMasuk,
  bagianList,
  activeUser,
  pimpinanName,
  pimpinanJabatan,
  onSave,
}) => {
  if (!isOpen || !suratMasuk) return null;

  const todayStr = new Date().toISOString().slice(0, 10);
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [tglDisposisi, setTglDisposisi] = useState<string>(todayStr);
  const [batasWaktu, setBatasWaktu] = useState<string>(nextWeek);
  const [sifat, setSifat] = useState<SifatSurat>(suratMasuk.sifat || 'Penting');
  const [selectedBagianIds, setSelectedBagianIds] = useState<string[]>([]);
  const [selectedInstruksi, setSelectedInstruksi] = useState<string[]>([
    'Tindak Lanjuti Segera',
  ]);
  const [catatanKhusus, setCatatanKhusus] = useState<string>('');

  const availableInstruksi = [
    'Tindak Lanjuti Segera',
    'Hadiri / Wakili',
    'Pelajari & Beri Saran / Masukan',
    'Siapkan Bahan / Konsep Jawaban',
    'Koordinasikan dengan Unit Terkait',
    'Untuk Diketahui & Arsipkan',
  ];

  const handleToggleBagian = (id: string) => {
    setSelectedBagianIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleInstruksi = (text: string) => {
    setSelectedInstruksi((prev) =>
      prev.includes(text) ? prev.filter((item) => item !== text) : [...prev, text]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBagianIds.length === 0) {
      alert('Pilih minimal satu bidang penerima disposisi!');
      return;
    }

    const targets = selectedBagianIds.map((id) => ({
      bagianId: id,
      statusTindakLanjut: 'Belum Diproses' as const,
    }));

    onSave({
      suratMasukId: suratMasuk.id,
      noAgenda: suratMasuk.noAgenda,
      noSurat: suratMasuk.noSurat,
      perihal: suratMasuk.perihal,
      pengirim: suratMasuk.pengirim,
      tglDisposisi,
      batasWaktu,
      sifat,
      pemberiDisposisi: pimpinanName,
      jabatanPemberi: pimpinanJabatan,
      targets,
      instruksi: selectedInstruksi,
      catatanKhusus,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <GitFork className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Formulir Lembar Disposisi Surat Masuk
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {suratMasuk.noAgenda} · {suratMasuk.noSurat}
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

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Reference Info */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Asal Surat / Pengirim:</span>
              <span className="font-semibold text-slate-800">{suratMasuk.pengirim}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Perihal:</span>
              <span className="font-semibold text-slate-900 text-right max-w-md">{suratMasuk.perihal}</span>
            </div>
          </div>

          {/* Sifat & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sifat Disposisi</label>
              <select
                value={sifat}
                onChange={(e) => setSifat(e.target.value as SifatSurat)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="Biasa">Biasa</option>
                <option value="Penting">Penting</option>
                <option value="Sangat Segera">Sangat Segera</option>
                <option value="Rahasia">Rahasia</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tgl Disposisi</label>
              <input
                type="date"
                value={tglDisposisi}
                onChange={(e) => setTglDisposisi(e.target.value)}
                required
                className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Batas Penyelesaian</label>
              <input
                type="date"
                value={batasWaktu}
                onChange={(e) => setBatasWaktu(e.target.value)}
                required
                className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono text-red-600 font-bold"
              />
            </div>
          </div>

          {/* Diteruskan Kepada (Multi-bidang) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-semibold text-slate-800">
                Diteruskan Kepada (Pilih 1 atau Lebih Bidang): <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {selectedBagianIds.length} bidang terpilih
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
              {bagianList.map((bg) => {
                const isChecked = selectedBagianIds.includes(bg.id);
                return (
                  <label
                    key={bg.id}
                    className={`flex items-start gap-2 p-2 rounded border cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-blue-50/80 border-blue-400 text-blue-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleBagian(bg.id)}
                      className="mt-0.5 rounded text-blue-600"
                    />
                    <div className="min-w-0">
                      <p className="leading-snug">{bg.nama}</p>
                      <p className="text-[10px] text-slate-500 font-normal">{bg.kepalaBagian}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Petunjuk / Instruksi */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1.5">
              Petunjuk / Instruksi Disposisi:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableInstruksi.map((ins) => {
                const isChecked = selectedInstruksi.includes(ins);
                return (
                  <label
                    key={ins}
                    className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-indigo-50/80 border-indigo-400 text-indigo-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleInstruksi(ins)}
                      className="rounded text-indigo-600"
                    />
                    <span>{ins}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Catatan Khusus Pimpinan */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Catatan Khusus Pimpinan:
            </label>
            <textarea
              rows={3}
              value={catatanKhusus}
              onChange={(e) => setCatatanKhusus(e.target.value)}
              placeholder="Berikan instruksi spesifik atau arahan teknis kepada bidang penerima..."
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* Footer Controls */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Pemberi Disposisi: <strong>{pimpinanName}</strong> ({pimpinanJabatan})
            </span>
            <div className="flex gap-2">
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
                Terbitkan Lembar Disposisi
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
