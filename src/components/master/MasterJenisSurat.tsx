import React, { useState } from 'react';
import { Layers, Plus, Edit2, Trash2, X } from 'lucide-react';
import { JenisSurat } from '../../types';

interface MasterJenisSuratProps {
  jenisSuratList: JenisSurat[];
  onSaveJenisSuratList: (list: JenisSurat[]) => void;
}

export const MasterJenisSurat: React.FC<MasterJenisSuratProps> = ({
  jenisSuratList,
  onSaveJenisSuratList,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<JenisSurat | null>(null);

  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState<'masuk' | 'keluar' | 'keduanya'>('keduanya');
  const [keterangan, setKeterangan] = useState('');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setKode('');
    setNama('');
    setKategori('keduanya');
    setKeterangan('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: JenisSurat) => {
    setEditingItem(item);
    setKode(item.kode);
    setNama(item.nama);
    setKategori(item.kategori);
    setKeterangan(item.keterangan);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus jenis surat ini?')) {
      const updated = jenisSuratList.filter((j) => j.id !== id);
      onSaveJenisSuratList(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      const updated = jenisSuratList.map((j) =>
        j.id === editingItem.id
          ? { ...j, kode: kode.toUpperCase(), nama, kategori, keterangan }
          : j
      );
      onSaveJenisSuratList(updated);
    } else {
      const newItem: JenisSurat = {
        id: `js-${Date.now()}`,
        kode: kode.toUpperCase(),
        nama,
        kategori,
        keterangan,
      };
      onSaveJenisSuratList([...jenisSuratList, newItem]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Master Data Jenis Surat Masuk & Keluar
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Klasifikasi tata naskah dinas persuratan (Undangan, Edaran, SK, Nota Dinas, Surat Tugas)
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jenis Surat</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-800">
            <tr>
              <th className="py-3 px-4 w-12">No.</th>
              <th className="py-3 px-4">Kode Naskah</th>
              <th className="py-3 px-4">Nama Jenis Surat</th>
              <th className="py-3 px-4">Kategori Alur</th>
              <th className="py-3 px-4">Keterangan Penggunaan</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jenisSuratList.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-50/70">
                <td className="py-3 px-4 font-mono text-slate-400">{index + 1}</td>
                <td className="py-3 px-4 font-mono font-bold text-blue-700">{item.kode}</td>
                <td className="py-3 px-4 font-semibold text-slate-900">{item.nama}</td>
                <td className="py-3 px-4">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                    item.kategori === 'keduanya'
                      ? 'bg-blue-50 text-blue-700'
                      : item.kategori === 'keluar'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {item.kategori === 'keduanya' ? 'Masuk & Keluar' : `Surat ${item.kategori}`}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-500 max-w-sm">{item.keterangan}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in duration-150">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-semibold text-slate-900">
                {editingItem ? 'Edit Jenis Surat' : 'Tambah Jenis Surat Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kode Naskah: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={kode}
                  onChange={(e) => setKode(e.target.value)}
                  placeholder="Contoh: UND / EDR / SK / NOT"
                  required
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono uppercase text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Jenis Surat: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Undangan Resmi / Surat Keputusan (SK)"
                  required
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kategori Penggunaan:
                </label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                >
                  <option value="keduanya">Berlaku untuk Surat Masuk & Keluar</option>
                  <option value="masuk">Khusus Surat Masuk</option>
                  <option value="keluar">Khusus Surat Keluar</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Keterangan Penggunaan:
                </label>
                <textarea
                  rows={3}
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Keterangan singkat jenis surat..."
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
