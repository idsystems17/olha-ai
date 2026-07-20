'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Dancing_Script } from 'next/font/google'
import {
  ArrowRight, Sparkles, CheckCircle2, Smartphone, MessageSquare,
  Globe, LayoutGrid, ShoppingBag, Check,
} from 'lucide-react'
import { PERFIS_DEMO, type PerfilDemo, type ItemDemo } from '@/lib/tutorial-demo-data'
import { TelefoneSimulado } from './TelefoneSimulado'
import { CadastroDemoScreen } from './CadastroDemoScreen'
import { PainelDemoScreen } from './PainelDemoScreen'
import { CatalogoDemoScreen } from './CatalogoDemoScreen'

// Mesma fonte usada na marca "Olha Aí" no rodapé do catálogo público
// (src/app/[slug]/page.tsx), pra manter a identidade visual consistente.
const dancingScript = Dancing_Script({ subsets: ['latin'], weight: '600' })

type Tela = 'cadastro' | 'painel' | 'catalogo'

const CONTROLES: { id: Tela; label: string; icone: typeof Globe }[] = [
  { id: 'cadastro', label: 'Cadastro', icone: Sparkles },
  { id: 'painel', label: 'Painel', icone: LayoutGrid },
  { id: 'catalogo', label: 'Catálogo do cliente', icone: Globe },
]

const NEGOCIO_NOVO_ITEM: ItemDemo = {
  id: 'novo-1',
  name: 'Meu Primeiro Produto',
  price: 15,
  description: 'Descrição do produto. Clique pra editar ou marcar "Disponível"!',
  imageUrl: '/demo-tutorial/item-bolo-vulcao.jpg',
  isAvailableToday: true,
}

const LARANJA_MARCA = '#ea580c'

export function TutorialInterativo() {
  const [perfilAtivo, setPerfilAtivo] = useState<PerfilDemo>(PERFIS_DEMO[0])
  const [items, setItems] = useState<ItemDemo[]>(PERFIS_DEMO[0].items)
  const [corPrincipal, setCorPrincipal] = useState(PERFIS_DEMO[0].corPrincipal)
  const [corSecundaria, setCorSecundaria] = useState<string | null>(PERFIS_DEMO[0].corSecundaria)
  const [lojaAberta, setLojaAberta] = useState(true)
  const [tela, setTela] = useState<Tela>('catalogo')
  const [toast, setToast] = useState<{ titulo: string; sub: string } | null>(null)

  function mostrarToast(titulo: string, sub: string) {
    setToast({ titulo, sub })
    setTimeout(() => setToast(null), 4000)
  }

  function selecionarPerfil(perfil: PerfilDemo) {
    setPerfilAtivo(perfil)
    setItems(perfil.items)
    setCorPrincipal(perfil.corPrincipal)
    setCorSecundaria(perfil.corSecundaria)
    setLojaAberta(perfil.isOpen)
    setTela('catalogo')
    mostrarToast('Carregado!', `O catálogo de "${perfil.name}" está ativo no simulador.`)
  }

  function concluirCadastroDemo(nomeNegocio: string) {
    setPerfilAtivo({
      id: 'novo-negocio',
      title: nomeNegocio,
      category: 'Novo negócio',
      name: nomeNegocio,
      slug: nomeNegocio.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      whatsapp: '',
      bio: `Bem-vindo ao catálogo de ${nomeNegocio}! Veja o que está disponível hoje.`,
      logoUrl: '',
      corPrincipal: LARANJA_MARCA,
      corSecundaria: null,
      diasRestantes: 30,
      isSubscribed: false,
      isOpen: true,
      items: [NEGOCIO_NOVO_ITEM],
    })
    setItems([NEGOCIO_NOVO_ITEM])
    setCorPrincipal(LARANJA_MARCA)
    setCorSecundaria(null)
    setLojaAberta(true)
    setTela('painel')
    mostrarToast('Catálogo criado!', `Pronto! "${nomeNegocio}" já está pronto pra configurar.`)
  }

  function alternarItem(id: string) {
    setItems((atual) => atual.map((i) => (i.id === id ? { ...i, isAvailableToday: !i.isAvailableToday } : i)))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white flex flex-col">
      {/* HERO */}
      <section className="w-full max-w-2xl mx-auto px-6 pt-10 pb-8 md:pt-16 md:pb-10 text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 flex items-center justify-center shadow-sm mb-6">
          <span className={`${dancingScript.className} text-white text-lg leading-none`}>Olha Aí</span>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-xs font-semibold mb-4 border border-rose-100">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Catálogo digital simples e prático pra quem vende pelo WhatsApp</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 leading-tight">
          Simplicidade para quem vende pelo WhatsApp.
        </h1>
        <p className="mt-4 text-base text-slate-500 max-w-md leading-relaxed">
          O jeito mais fácil de mostrar o que você vende hoje: foto, preço e um botão que já leva
          pro seu WhatsApp com o pedido pronto. O simulador abaixo é <strong>100% interativo</strong>:
          clica, testa as telas e veja como fica na prática, sem precisar criar conta ainda.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
          <Link
            href="/cadastro"
            className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full px-7 py-3.5 text-sm font-semibold shadow-md transition-colors group"
          >
            <span>Criar meu catálogo grátis</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-slate-700">
            Já tem catálogo? Entrar
          </Link>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          30 dias grátis, sem pedir cartão. Depois, R$ 19,90/mês pra continuar no ar.
        </p>
      </section>

      {/* Seletor de perfis de demonstração */}
      <section className="w-full max-w-2xl mx-auto px-6 pb-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Veja exemplos de quem já vende assim
          </h3>
          <div className="space-y-2.5">
            {PERFIS_DEMO.map((perfil) => {
              const ativo = perfilAtivo.id === perfil.id
              return (
                <button
                  key={perfil.id}
                  onClick={() => selecionarPerfil(perfil)}
                  className={`w-full text-left p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                    ativo ? 'border-orange-300 bg-orange-50/60' : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail pequeno de demonstração, não é LCP */}
                    <img
                      src={perfil.logoUrl}
                      alt={perfil.name}
                      className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-800 text-xs truncate">{perfil.title}</h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        {perfil.category} • {perfil.items.length} itens
                      </p>
                    </div>
                  </div>
                  {ativo ? (
                    <span className="flex-shrink-0 text-orange-600">
                      <Check className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="flex-shrink-0 text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-semibold">
                      Ver
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Exemplos fictícios só pra ilustrar — quando você assinar, o catálogo é 100% seu, com
            seus produtos e suas fotos.
          </p>
        </div>
      </section>

      {/* Controle de tela do simulador */}
      <section className="w-full max-w-2xl mx-auto px-6 pb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-orange-500" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Veja por dentro</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {CONTROLES.map(({ id, label, icone: Icone }) => (
              <button
                key={id}
                onClick={() => setTela(id)}
                className={`py-3 px-2 rounded-xl font-bold text-[11px] transition-all flex flex-col items-center justify-center gap-1 border ${
                  tela === id
                    ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white border-transparent shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-200'
                }`}
              >
                <Icone className="w-4 h-4" />
                <span className="text-center leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Celular simulado */}
      <section className="w-full bg-slate-900 flex items-center justify-center p-3 sm:p-6 md:p-10 relative overflow-x-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full blur-[110px] opacity-25 transition-all duration-700"
          style={{ background: corPrincipal }}
        />

        {toast && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 bg-slate-900 border border-slate-700 text-white rounded-2xl py-3 px-5 shadow-2xl flex items-center gap-3 max-w-sm animate-fade-in">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 flex-shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="font-bold text-xs">{toast.titulo}</p>
              <p className="text-[10px] text-slate-400 leading-normal">{toast.sub}</p>
            </div>
          </div>
        )}

        <TelefoneSimulado>
          {tela === 'cadastro' && <CadastroDemoScreen onConcluir={concluirCadastroDemo} />}
          {tela === 'painel' && (
            <PainelDemoScreen
              perfil={perfilAtivo}
              items={items}
              onToggleItem={alternarItem}
              corPrincipal={corPrincipal}
              corSecundaria={corSecundaria}
              onSetCorPrincipal={setCorPrincipal}
              onSetCorSecundaria={setCorSecundaria}
              lojaAberta={lojaAberta}
              onToggleLoja={() => setLojaAberta((v) => !v)}
              onVerCatalogo={() => setTela('catalogo')}
              onToast={mostrarToast}
            />
          )}
          {tela === 'catalogo' && (
            <CatalogoDemoScreen
              perfil={perfilAtivo}
              items={items}
              corPrincipal={corPrincipal}
              corSecundaria={corSecundaria}
              lojaAberta={lojaAberta}
              onToast={mostrarToast}
            />
          )}
        </TelefoneSimulado>
      </section>

      {/* Diferenciais */}
      <section className="w-full max-w-2xl mx-auto px-6 py-10 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight text-center">
          Diga adeus ao &ldquo;manda foto no privado&rdquo; e &ldquo;qual o valor?&rdquo;
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex gap-3 items-start">
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-xs">Botão &ldquo;Disponível&rdquo;</h4>
              <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                Acabou o bolo de cenoura? Desativa com um toque. O cliente só pede o que está pronto.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-xs">Criação rápida, direto do celular</h4>
              <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                Nome, WhatsApp e as fotos do celular. Sem app pra instalar, sem complicação.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-xs">Pedido direto no seu WhatsApp</h4>
              <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                O cliente clica em &ldquo;Pedir&rdquo; e a mensagem já chega pronta. Sem taxa, sem intermediário.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="w-full max-w-2xl mx-auto px-6 pb-14">
        <Link
          href="/cadastro"
          className="w-full inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-2xl transition-all text-sm"
        >
          Criar meu catálogo grátis
        </Link>
      </section>
    </div>
  )
}
