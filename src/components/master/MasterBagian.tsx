import React, { useState } from 'react';
import { Briefcase, Plus, Edit2, Trash2, X, Check, Save } from 'lucide-react';
import { Bagian } from '../../types';

interface MasterBagianProps {
  bagianList: Bagian[];
  onSaveBagianList: (list: Bagian[]) => void;
}

export const MasterBagian: React.FC<MasterBagianProps> = ({
  bagianList,
  onSaveBagianList,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBagian, setEditingBagian] = useState<Bagian | null>(null);

  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [kepalaBagian, setKepalaBagian] = useState('');
  const [keterangan, setKeterangan] = useState('');

  const handleOpenAdd = () => {
    setEditingBagian(null);
    setKode('');
    setNama('');
    setKepalaBagian('');
    setKeterangan('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: Bagian) => {
    setEditingBagian(b);
    setKode(b.kode);
    setNama(b.nama);
    setKepalaBagian(b.kepalaBagian);
    setKeterangan(b.keterangan);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus bagian / bidang ini?')) {
      const updated = bagianList.filter((b) => b.id !== id);
      onSaveBagianList(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBagian) {
      const updated = bagianList.map((b) =>
        b.id === editingBagian.id
          ? { ...b, kode, nama, kepalaBagian, keterangan }
          : b
      );
      onSaveBagianList(updated);
    } else {
      const newBagian: Bagian = {
        id: `bg-${Date.now()}`,
        kode: kode.toUpperCase(),
        nama,
        kepalaBagian,
        keterangan,
      };
      onSaveBagianList([...bagianList, newBagian]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Master Data Bagian / Bidang Kerja
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar unit kerja (Wakasek, Tata Usaha, BK) penerima distribusi disposisi dari pimpinan
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Bagian / Bidang</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-800">
            <tr>
              <th className="py-3 px-4 w-12">No.</th>
              <th className="py-3 px-4">Kode</th>
              <th className="py-3 px-4">Nama Bagian / Bidang</th>
              <th className="py-3 px-4">Kepala / Penanggung Jawab</th>
              <th className="py-3 px-4">Keterangan Tugas</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bagianList.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-50/70">
                <td className="py-3 px-4 font-mono text-slate-400">{index + 1}</td>
                <td className="py-3 px-4 font-mono font-bold text-blue-700">{item.kode}</td>
                <td className="py-3 px-4 font-semibold text-slate-900">{item.nama}</td>
                <td className="py-3 px-4 text-slate-800">{item.kepalaBagian}</td>
                <td className="py-3 px-4 text-slate-500 max-w-xs">{item.keterangan}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded"
                      title="Edit Bagian"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                      title="Hapus Bagian"
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

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in duration-150">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-semibold text-slate-900">
                {editingBagian ? 'Edit Data Bagian' : 'Tambah Bagian Baru'}
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
                  Kode Singkatan: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={kode}
                  onChange={(e) => setKode(e.target.value)}
                  placeholder="Contoh: KUR / KES / SAR"
                  required
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono uppercase text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Bagian / Bidang: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Waka Bidang Kurikulum"
                  required
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Kepala / Penanggung Jawab:
                </label>
                <input
                  type="text"
                  value={kepalaBagian}
                  onChange={(e) => setKepalaBagian(e.target.value)}
                  placeholder="Contoh: Dra. Hj. Siti Rahmawati, M.Pd"
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Uraian Tugas / Keterangan:
                </label>
                <textarea
                  rows={3}
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Keterangan singkat lingkup kerja bagian..."
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
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
                  Simpan Bagian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
