import React, { useState } from 'react';
import { ShieldCheck, Save, Check, Key, UserCheck } from 'lucide-react';
import { Pegawai, UserAccount } from '../../types';

interface PengaturanPimpinanProps {
  pegawaiList: Pegawai[];
  allUsers: UserAccount[];
  onUpdatePimpinan: (selectedPegawaiId: string, username: string, password?: string) => void;
}

export const PengaturanPimpinan: React.FC<PengaturanPimpinanProps> = ({
  pegawaiList,
  allUsers,
  onUpdatePimpinan,
}) => {
  const pimpinanUser = allUsers.find((u) => u.role === 'pimpinan');
  const currentPimpinanPegawai = pegawaiList.find((p) => p.isPimpinan) || pegawaiList[0];

  const [selectedPegawaiId, setSelectedPegawaiId] = useState<string>(
    currentPimpinanPegawai?.id || ''
  );
  const [username, setUsername] = useState<string>(pimpinanUser?.username || 'pimpinan');
  const [password, setPassword] = useState<string>('pimpinan123');
  const [isSaved, setIsSaved] = useState(false);

  const selectedPegawai = pegawaiList.find((p) => p.id === selectedPegawaiId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePimpinan(selectedPegawaiId, username, password);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Pengaturan Pejabat Pimpinan & Tanda Tangan Digital
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Menetapkan pegawai yang bertindak sebagai Kepala Sekolah / Kepala Instansi untuk hak akses tanda tangan digital surat keluar dan otorisasi lembar disposisi
        </p>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-semibold animate-in fade-in duration-100">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Pengaturan akun pimpinan dan sertifikat digital berhasil diperbarui!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6 text-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            1. Pemilihan Pejabat Kepala Instansi
          </h2>
          <div className="mt-4 space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Pilih Pegawai sebagai Pimpinan: <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedPegawaiId}
                onChange={(e) => setSelectedPegawaiId(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 font-semibold text-xs bg-white"
              >
                {pegawaiList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.gelarDepan ? `${p.gelarDepan} ` : ''}
                    {p.nama}
                    {p.gelarBelakang ? `, ${p.gelarBelakang}` : ''} - NIP. {p.nip} ({p.jabatan})
                  </option>
                ))}
              </select>
            </div>

            {selectedPegawai && (
              <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl space-y-1.5 text-xs text-indigo-950">
                <p className="font-bold text-sm text-indigo-900">
                  {selectedPegawai.gelarDepan ? `${selectedPegawai.gelarDepan} ` : ''}
                  {selectedPegawai.nama}
                  {selectedPegawai.gelarBelakang ? `, ${selectedPegawai.gelarBelakang}` : ''}
                </p>
                <p className="font-mono text-slate-600">NIP: {selectedPegawai.nip}</p>
                <p className="text-slate-700">Jabatan: {selectedPegawai.jabatan}</p>
                <p className="text-slate-600">Email: {selectedPegawai.email}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            2. Akun Login Pimpinan (Kredensial Sistem)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Username Login Pimpinan: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-2.5 border border-slate-300 rounded-lg font-mono text-slate-900 font-semibold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Username untuk login modul pimpinan.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Password Login:
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2.5 border border-slate-300 rounded-lg font-mono text-slate-900"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Password default atau kata sandi baru.
              </span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            3. Pengesahan Sertifikat Tanda Tangan Digital (QR Code)
          </h2>
          <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Sertifikat Digital Validasi Publik Otomatis</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Setiap kali Pimpinan melakukan approval tanda tangan surat keluar, sistem akan secara otomatis meng-generate token QR code unik berstandar keabsahan dokumen dinas, yang terhubung ke portal validasi publik tanpa harus login.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan Pimpinan</span>
          </button>
        </div>
      </form>
    </div>
  );
};
