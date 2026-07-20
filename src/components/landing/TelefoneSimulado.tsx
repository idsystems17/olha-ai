'use client'

import { useEffect, useState } from 'react'

// Moldura de iPhone reutilizável pro simulador da landing page. Só casca —
// quem decide o que aparece na tela é o `children` de cada tela demo.
export function TelefoneSimulado({ children }: { children: React.ReactNode }) {
  const [horario, setHorario] = useState('10:40')

  useEffect(() => {
    function atualizar() {
      const agora = new Date()
      setHorario(`${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`)
    }
    atualizar()
    const intervalo = setInterval(atualizar, 60_000)
    return () => clearInterval(intervalo)
  }, [])

  return (
    <div className="relative w-[320px] h-[660px] bg-slate-950 rounded-[46px] p-3 shadow-[0_0_60px_-15px_rgba(0,0,0,0.5)] border-[6px] border-slate-800 ring-2 ring-slate-850 mx-auto">
      <div className="relative w-full h-full bg-slate-50 rounded-[34px] overflow-hidden flex flex-col select-none shadow-inner border border-slate-900">
        <div className="absolute top-0 inset-x-0 h-9 px-6 pt-2 flex items-center justify-between text-slate-900 font-semibold text-[11px] z-30 pointer-events-none">
          <span>{horario}</span>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5 items-end h-2.5">
              <div className="w-[2px] h-[3px] bg-current rounded-xs" />
              <div className="w-[2px] h-[5px] bg-current rounded-xs" />
              <div className="w-[2px] h-[7px] bg-current rounded-xs" />
              <div className="w-[2px] h-[9px] bg-current rounded-xs" />
            </div>
            <div className="w-5 h-2.5 border border-current rounded-sm p-0.5 flex items-center">
              <div className="w-full h-full bg-current rounded-xs" />
            </div>
          </div>
        </div>

        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 pointer-events-none" />

        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-900/40 rounded-full z-30 pointer-events-none" />

        <div className="w-full h-full pt-9 flex-1 overflow-hidden relative">{children}</div>
      </div>
    </div>
  )
}
