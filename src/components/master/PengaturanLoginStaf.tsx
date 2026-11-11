import React, { useState } from 'react';
import { Lock, Plus, Edit2, Trash2, X, Check, UserCheck, Shield } from 'lucide-react';
import { UserAccount, Pegawai, Bagian } from '../../types';

interface PengaturanLoginStafProps {
  allUsers: UserAccount[];
  pegawaiList: Pegawai[];
  bagianList: Bagian[];
  onSaveUsers: (users: UserAccount[]) => void;
}

export const PengaturanLoginStaf: React.FC<PengaturanLoginStafProps> = ({
  allUsers,
  pegawaiList,
  bagianList,
  onSaveUsers,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pegawaiId, setPegawaiId] = useState(pegawaiList[0]?.id || '');
  const [bagianId, setBagianId] = useState(bagianList[0]?.id || '');
  const [role, setRole] = useState<'admin' | 'staf'>('staf');

  const handleOpenAdd = () => {
    setEditingUser(null);
    setUsername('');
    setPassword('staf123');
    setPegawaiId(pegawaiList[0]?.id || '');
    setBagianId(bagianList[0]?.id || '');
    setRole('staf');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: UserAccount) => {
    setEditingUser(u);
    setUsername(u.username);
    setPassword(u.password || 'staf123');
    setPegawaiId(u.pegawaiId || pegawaiList[0]?.id || '');
    setBagianId(u.bagianId || bagianList[0]?.id || '');
    setRole(u.role === 'admin' ? 'admin' : 'staf');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus akun login ini?')) {
      const updated = allUsers.filter((u) => u.id !== id);
      onSaveUsers(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const peg = pegawaiList.find((p) => p.id === pegawaiId);
    const nama = peg ? `${peg.gelarDepan ? peg.gelarDepan + ' ' : ''}${peg.nama}${peg.gelarBelakang ? ', ' + peg.gelarBelakang : ''}` : username;
    const jabatan = peg ? peg.jabatan : 'Staf';

    if (editingUser) {
      const updated = allUsers.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              username,
              password,
              nama,
              jabatan,
              role,
              pegawaiId,
              bagianId: role === 'staf' ? bagianId : undefined,
            }
          : u
      );
      onSaveUsers(updated);
    } else {
      const newUser: UserAccount = {
        id: `usr-${Date.now()}`,
        username,
        password,
        nama,
        jabatan,
        role,
        pegawaiId,
        bagianId: role === 'staf' ? bagianId : undefined,
      };
      onSaveUsers([...allUsers, newUser]);
    }
    setIsModalOpen(false);
  };

  const getBagianName = (id?: string) => {
    if (!id) return '-';
    const b = bagianList.find((item) => item.id === id);
    return b ? b.nama : id;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Pengaturan Akun Login Pegawai & Staf Bidang
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Memetakan akun login ke masing-masing bidang (Waka Kurikulum, Kesiswaan, Sarpras, Humas, TU, BK)
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Akun Login</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-800">
            <tr>
              <th className="py-3 px-4 w-12">No.</th>
              <th className="py-3 px-4">Username</th>
              <th className="py-3 px-4">Nama Pegawai Terpetakan</th>
              <th className="py-3 px-4">Hak Akses (Role)</th>
              <th className="py-3 px-4">Unit / Bidang Tugas</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {allUsers.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-50/70">
                <td className="py-3 px-4 font-mono text-slate-400">{index + 1}</td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">
                  {item.username}
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-slate-900 block">{item.nama}</span>
                  <span className="text-[10px] text-slate-500">{item.jabatan}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                    item.role === 'admin'
                      ? 'bg-blue-50 text-blue-700'
                      : item.role === 'pimpinan'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {item.role === 'admin' ? 'Administrator' : item.role === 'pimpinan' ? 'Pimpinan' : 'Staf Bidang'}
                  </span>
                </td>
                <td className="py-3 px-4 font-medium text-slate-800">
                  {item.role === 'staf' ? getBagianName(item.bagianId) : 'Seluruh Instansi'}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {item.role !== 'admin' && item.role !== 'pimpinan' && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
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
                {editingUser ? 'Edit Akun Pegawai' : 'Buat Akun Pegawai Baru'}
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
                  Pilih Pegawai Terdaftar: <span className="text-red-500">*</span>
                </label>
                <select
                  value={pegawaiId}
                  onChange={(e) => {
                    setPegawaiId(e.target.value);
                    const peg = pegawaiList.find((p) => p.id === e.target.value);
                    if (peg && peg.bagianId) {
                      setBagianId(peg.bagianId);
                    }
                  }}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-900"
                >
                  {pegawaiList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama} - NIP. {p.nip} ({p.jabatan})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Hak Akses (Role):
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                >
                  <option value="staf">Staf / Bidang Unit Kerja</option>
                  <option value="admin">Administrator Persuratan</option>
                </select>
              </div>

              {role === 'staf' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Pemetaan ke Bidang / Bagian: <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={bagianId}
                    onChange={(e) => setBagianId(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-medium text-slate-900"
                  >
                    {bagianList.map((bg) => (
                      <option key={bg.id} value={bg.id}>
                        {bg.nama}
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Staf hanya dapat melihat lembar disposisi yang didelegasikan ke bidang ini.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Username: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="staf.kurikulum"
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Password: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password123"
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
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
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
