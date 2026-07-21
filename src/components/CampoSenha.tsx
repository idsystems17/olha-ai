'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export function CampoSenha({
  className,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  const [mostrar, setMostrar] = useState(false)

  return (
    <div className="relative">
      <input {...props} type={mostrar ? 'text' : 'password'} className={`${className} pr-10`} />
      <button
        type="button"
        onClick={() => setMostrar((v) => !v)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        aria-label={mostrar ? 'Ocultar senha' : 'Mostrar senha'}
        tabIndex={-1}
      >
        {mostrar ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  )
}
