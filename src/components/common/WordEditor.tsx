import React, { useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  List, 
  ListOrdered, 
  Table, 
  Undo, 
  Redo, 
  RemoveFormatting, 
  Indent, 
  Outdent, 
  Minus,
  Highlighter,
  Palette
} from 'lucide-react';

interface WordEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const WordEditor: React.FC<WordEditorProps> = ({
  value,
  onChange,
  placeholder = 'Ketik isi surat atau gunakan format Word di sini...',
  minHeight = '180px',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync initial or external value changes safely without losing cursor position
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    document.execCommand(command, false, arg);
    handleInput();
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertTable = () => {
    const tableHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 10px 0; border: 1px solid #94a3b8;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="border: 1px solid #cbd5e1; padding: 6px 10px; text-align: left; font-weight: bold; width: 40px;">No</th>
            <th style="border: 1px solid #cbd5e1; padding: 6px 10px; text-align: left; font-weight: bold;">Uraian / Keterangan</th>
            <th style="border: 1px solid #cbd5e1; padding: 6px 10px; text-align: left; font-weight: bold; width: 120px;">Jumlah / Waktu</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 6px 10px;">1</td>
            <td style="border: 1px solid #cbd5e1; padding: 6px 10px;">Isi butir poin atau agenda rapat...</td>
            <td style="border: 1px solid #cbd5e1; padding: 6px 10px;">Sesuai Jadwal</td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 6px 10px;">2</td>
            <td style="border: 1px solid #cbd5e1; padding: 6px 10px;">Rincian ketentuan atau berkas lampiran...</td>
            <td style="border: 1px solid #cbd5e1; padding: 6px 10px;">Lengkap</td>
          </tr>
        </tbody>
      </table>
      <p><br></p>
    `;
    executeCommand('insertHTML', tableHtml);
  };

  const countWords = (html: string) => {
    const text = html.replace(/<[^>]*>/g, ' ').trim();
    if (!text) return 0;
    return text.split(/\s+/).filter(Boolean).length;
  };

  const countChars = (html: string) => {
    return html.replace(/<[^>]*>/g, '').length;
  };

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
      {/* MS Word-like Ribbon / Toolbar */}
      <div className="bg-slate-100 border-b border-slate-200 p-1.5 flex flex-wrap items-center gap-1 select-none text-slate-700">
        {/* Style / Heading selector */}
        <select
          onChange={(e) => executeCommand('formatBlock', e.target.value)}
          className="h-7 px-2 text-xs bg-white border border-slate-300 rounded font-medium text-slate-800 cursor-pointer hover:border-slate-400 focus:outline-hidden"
          title="Format Paragraf & Judul"
          defaultValue="p"
        >
          <option value="p">Normal (Paragraf)</option>
          <option value="h3">Heading 1 (Judul Bagian)</option>
          <option value="h4">Heading 2 (Sub-Judul)</option>
          <option value="blockquote">Kutipan / Catatan Kedinasan</option>
        </select>

        <div className="w-px h-5 bg-slate-300 mx-0.5" />

        {/* Font Style Buttons */}
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          className="p-1 hover:bg-slate-200 hover:text-slate-900 rounded text-slate-700 font-bold transition-colors cursor-pointer"
          title="Tebal (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand('italic')}
          className="p-1 hover:bg-slate-200 hover:text-slate-900 rounded text-slate-700 italic transition-colors cursor-pointer"
          title="Miring (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand('underline')}
          className="p-1 hover:bg-slate-200 hover:text-slate-900 rounded text-slate-700 underline transition-colors cursor-pointer"
          title="Garis Bawah (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand('strikeThrough')}
          className="p-1 hover:bg-slate-200 hover:text-slate-900 rounded text-slate-700 line-through transition-colors cursor-pointer"
          title="Coret (Strikethrough)"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-0.5" />

        {/* Colors & Highlight */}
        <button
          type="button"
          onClick={() => executeCommand('foreColor', '#1e3a8a')}
          className="p-1 hover:bg-slate-200 rounded text-blue-900 transition-colors cursor-pointer flex items-center gap-0.5"
          title="Warna Teks Biru Kedinasan"
        >
          <Palette className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-blue-900 inline-block" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand('hiliteColor', '#fef08a')}
          className="p-1 hover:bg-slate-200 rounded text-amber-700 transition-colors cursor-pointer flex items-center gap-0.5"
          title="Stabilo Kuning (Highlight)"
        >
          <Highlighter className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-yellow-300 inline-block" />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-0.5" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => executeCommand('justifyLeft')}
          className="p-1 hover:bg-slate-200 hover:text-slate-900 rounded text-slate-700 transition-colors cursor-pointer"
          title="Rata Kiri"
        >
          <AlignLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand('justifyCenter')}
          className="p-1 hover:bg-slate-200 hover:text-slate-900 rounded text-slate-700 transition-colors cursor-pointer"
          title="Rata Tengah"
        >
          <AlignCenter className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand('justifyRight')}
          className="p-1 hover:bg-slate-200 hover:text-slate-900 rounded text-slate-700 transition-colors cursor-pointer"
          title="Rata Kanan"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand('justifyFull')}
          className="p-1 hover:bg-slate-200 hover:text-slate-900 rounded text-slate-700 transition-colors cursor-pointer"
          title="Rata Kanan-Kiri (Justifikasi Resmi Surat)"
        >
          <AlignJustify className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-0.5" />

        {/* Lists & Indents */}
        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          className="p-1 hover:bg-slate-200 hover:text-slate-900 rounded text-slate-700 transition-colors cursor-pointer"
          title="Daftar Butir Poin (Bullets)"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          className="p-1 hover:bg-slate-200 hover:text-slate-900 rounded text-slate-700 transition-colors cursor-pointer"
          title="Daftar Penomoran (1, 2, 3...)"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand('indent')}
          className="p-1 hover:bg-slate-200 hover:text-slate-900 rounded text-slate-700 transition-colors cursor-pointer"
          title="Tambah Indentasi (Tab Masuk)"
        >
          <Indent className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand('outdent')}
          className="p-1 hover:bg-slate-200 hover:text-slate-900 rounded text-slate-700 transition-colors cursor-pointer"
          title="Kurangi Indentasi"
        >
          <Outdent className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-0.5" />

        {/* Insert Table & Horizontal Rule */}
        <button
          type="button"
          onClick={insertTable}
          className="px-2 py-0.5 hover:bg-slate-200 hover:text-slate-900 rounded text-xs font-semibold text-slate-700 transition-colors cursor-pointer inline-flex items-center gap-1 border border-slate-300 bg-white"
          title="Sisipkan Tabel Kedinasan (Format Word)"
        >
          <Table className="w-3.5 h-3.5 text-blue-700" />
          <span>Tabel</span>
        </button>

        <button
          type="button"
          onClick={() => executeCommand('insertHorizontalRule')}
          className="p-1 hover:bg-slate-200 hover:text-slate-900 rounded text-slate-700 transition-colors cursor-pointer"
          title="Garis Pembatas Horizontal"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-300 mx-0.5" />

        {/* Clear & History */}
        <button
          type="button"
          onClick={() => executeCommand('removeFormat')}
          className="p-1 hover:bg-slate-200 hover:text-slate-900 rounded text-slate-700 transition-colors cursor-pointer"
          title="Hapus Format Teks"
        >
          <RemoveFormatting className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand('undo')}
          className="p-1 hover:bg-slate-200 hover:text-slate-900 rounded text-slate-700 transition-colors cursor-pointer"
          title="Undo (Kembalikan)"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand('redo')}
          className="p-1 hover:bg-slate-200 hover:text-slate-900 rounded text-slate-700 transition-colors cursor-pointer"
          title="Redo (Ulangi)"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Canvas Styled like a Page Sheet */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        data-placeholder={placeholder}
        className="p-4 text-slate-900 text-xs leading-relaxed focus:outline-hidden overflow-y-auto selection:bg-blue-100 font-sans empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none"
        style={{ minHeight }}
      />

      {/* Word Editor Status Bar */}
      <div className="bg-slate-50 border-t border-slate-200 px-3 py-1 flex items-center justify-between text-[10px] text-slate-500 font-medium">
        <span className="flex items-center gap-1.5 text-blue-700 font-semibold">
          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
          Word Style Editor Aktif (Dukungan Format Rata Kanan-Kiri, Tabel & Butir Poin)
        </span>
        <div className="flex items-center gap-3">
          <span>{countWords(value)} kata</span>
          <span>{countChars(value)} karakter</span>
        </div>
      </div>
    </div>
  );
};
