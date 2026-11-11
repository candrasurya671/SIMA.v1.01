import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QrCodeGeneratorProps {
  value: string;
  size?: number;
  className?: string;
  caption?: string;
}

export const QrCodeGenerator: React.FC<QrCodeGeneratorProps> = ({
  value,
  size = 140,
  className = '',
  caption,
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(
      value,
      {
        width: size,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      },
      (err, url) => {
        if (!err && url) {
          setDataUrl(url);
        }
      }
    );
  }, [value, size]);

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {dataUrl ? (
        <img
          src={dataUrl}
          alt="QR Code Tanda Tangan Digital"
          className="border border-slate-200 bg-white p-1 rounded shadow-xs"
          style={{ width: size, height: size }}
        />
      ) : (
        <div
          className="border border-slate-200 bg-slate-50 flex items-center justify-center text-xs text-slate-400"
          style={{ width: size, height: size }}
        >
          Memuat QR...
        </div>
      )}
      {caption && (
        <span className="text-[11px] font-mono text-slate-500 mt-1 text-center">
          {caption}
        </span>
      )}
    </div>
  );
};
