'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { enviarFoto } from '@/lib/upload-imagem'

interface ImageUploaderProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

export function ImageUploader({ value, onChange, label }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processarArquivo = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErro('Envie apenas imagens.')
      return
    }
    setErro('')
    setEnviando(true)
    try {
      const url = await enviarFoto(file)
      onChange(url)
    } catch {
      setErro('Não foi possível enviar a foto. Tente de novo.')
    } finally {
      setEnviando(false)
    }
  }, [onChange])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processarArquivo(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processarArquivo(file)
    e.target.value = ''
  }

  // Ctrl+V com imagem — só quando não há foto ainda
  const handlePaste = useCallback((e: ClipboardEvent) => {
    if (value || enviando) return
    const items = e.clipboardData?.items
    if (!items) return
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) processarArquivo(file)
        break
      }
    }
  }, [value, enviando, processarArquivo])

  useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [handlePaste])

  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-semibold text-slate-600 block">{label}</label>}

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
          {/* eslint-disable-next-line @next/next/no-img-element -- fotos vêm do Supabase Storage, domínio dinâmico por tenant */}
          <img src={value} alt="Foto enviada" className="w-full h-36 object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-slate-800 text-xs font-semibold rounded-lg shadow hover:bg-slate-100"
            >
              Trocar foto
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow"
              aria-label="Remover foto"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          {enviando && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
            </div>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => !enviando && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all select-none ${
            isDragging ? 'border-slate-500 bg-slate-100' : 'border-slate-200 hover:border-slate-400 bg-slate-50'
          }`}
        >
          {enviando ? (
            <Loader2 className="w-6 h-6 mx-auto mb-2 animate-spin text-slate-400" />
          ) : (
            <Upload className="w-6 h-6 mx-auto mb-2 text-slate-400" />
          )}
          <p className="text-xs font-semibold text-slate-500">
            {enviando ? 'Enviando...' : (
              <>Toque pra escolher uma foto ou arraste aqui</>
            )}
          </p>
          {!enviando && <p className="text-[10px] text-slate-400 mt-1">Ou cole com Ctrl+V</p>}
        </div>
      )}

      {erro && <p className="text-xs text-red-600">{erro}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
      />
    </div>
  )
}
