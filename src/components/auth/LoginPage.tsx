import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  QrCode, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { AppSettings, UserAccount } from '../../types';
import { InstitutionLogo } from '../common/InstitutionLogo';

interface LoginPageProps {
  settings: AppSettings;
  allUsers: UserAccount[];
  onLogin: (user: UserAccount) => void;
  onOpenPublicVerification: () => void;
  loggedOutMessage?: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  settings,
  allUsers,
  onLogin,
  onOpenPublicVerification,
  loggedOutMessage,
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      // Find matching user by username
      const matched = allUsers.find(
        (u) => u.username.toLowerCase() === username.trim().toLowerCase()
      );

      if (!matched) {
        setErrorMessage('Username tidak terdaftar dalam sistem!');
        setIsLoading(false);
        return;
      }

      // Check password (if password is set, verify; otherwise allow)
      if (matched.password && matched.password !== password) {
        setErrorMessage('Kata sandi yang Anda masukkan salah. Silakan coba lagi.');
        setIsLoading(false);
        return;
      }

      // Successful login
      setIsLoading(false);
      onLogin(matched);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner with Public Verification Shortcut */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <InstitutionLogo
            type={settings.logoType}
            customUrl={settings.customLogoUrl}
            size={36}
          />
          <div>
            <span className="text-xs font-bold text-white tracking-tight block">
              {settings.systemName}
            </span>
            <span className="text-[10px] text-slate-400 block truncate max-w-xs sm:max-w-md">
              {settings.instansiName}
            </span>
          </div>
        </div>

        <button
          onClick={onOpenPublicVerification}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors shadow-2xs"
        >
          <QrCode className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Pindai / Cek</span>
          <span>Validasi QR Dokumen</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Card Wrapper */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            {/* Header / Logo in Card */}
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-blue-600/10 border border-blue-500/20 rounded-2xl mb-3 shadow-inner">
                <InstitutionLogo
                  type={settings.logoType}
                  customUrl={settings.customLogoUrl}
                  size={52}
                />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Masuk ke Sistem Persuratan
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-normal">
                {settings.systemSubName}
              </p>
            </div>

            {/* Logged Out Toast Notification */}
            {loggedOutMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-5 p-3 bg-emerald-950/60 border border-emerald-700/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{loggedOutMessage}</span>
              </motion.div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-5 p-3 bg-rose-950/60 border border-rose-700/50 rounded-xl text-xs text-rose-300 flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nama Pengguna (Username)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username Anda..."
                    required
                    autoComplete="username"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Kata Sandi (Password)
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    required
                    autoComplete="current-password"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                    title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me & Security info */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0 focus:ring-offset-0"
                  />
                  <span className="text-[11px] text-slate-400">Ingat sesi saya</span>
                </label>

                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  SSL Enkripsi
                </span>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memverifikasi Akun...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>


          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 text-center border-t border-slate-900 bg-slate-950/80 text-[11px] text-slate-500">
        <p>
          © 2026 {settings.instansiName} · {settings.systemName}
        </p>
      </footer>
    </div>
  );
};
