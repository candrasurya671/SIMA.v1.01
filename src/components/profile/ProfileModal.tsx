import React, { useState } from 'react';
import { X, User, Key, Check, LogOut, Shield } from 'lucide-react';
import { UserAccount, AppSettings } from '../../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeUser: UserAccount;
  settings: AppSettings;
  onSaveProfile: (updatedUser: UserAccount) => void;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  activeUser,
  settings,
  onSaveProfile,
  onLogout,
}) => {
  if (!isOpen) return null;

  const [nama, setNama] = useState(activeUser.nama);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        alert('Konfirmasi kata sandi baru tidak cocok!');
        return;
      }
    }

    onSaveProfile({
      ...activeUser,
      nama,
      password: newPassword || activeUser.password,
    });

    setSuccessMsg('Profil dan kata sandi berhasil diperbarui!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Profil Akun & Keamanan
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {activeUser.username} · Role: {activeUser.role}
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

        {successMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Lengkap:
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="w-full p-2.5 border border-slate-300 rounded-lg font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Jabatan / Hak Akses:
            </label>
            <input
              type="text"
              value={`${activeUser.jabatan} (${activeUser.role.toUpperCase()})`}
              disabled
              className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-3">
            <h4 className="font-bold text-slate-900">Ubah Kata Sandi (Password):</h4>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kata Sandi Baru:
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Kosongkan jika tidak ingin mengubah kata sandi"
                className="w-full p-2.5 border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Ulangi Kata Sandi Baru:
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ketik ulang kata sandi baru"
                className="w-full p-2.5 border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar (Logout)</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Tutup
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
