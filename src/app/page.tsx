import Link from 'next/link'
import { MessageCircleHeart, ImagePlus, QrCode } from 'lucide-react'
import { PALETA } from '@/lib/paleta'

const PASSOS = [
  {
    icone: MessageCircleHeart,
    titulo: 'Cria sua conta',
    texto: 'Nome do negócio, WhatsApp e pronto. Seu catálogo já nasce com um link só seu.',
  },
  {
    icone: ImagePlus,
    titulo: 'Monta seu cardápio',
    texto: 'Foto, nome e preço de cada coisa que você vende. Marca o que tem hoje em dois toques.',
  },
  {
    icone: QrCode,
    titulo: 'Manda pros clientes',
    texto: 'Compartilha o link ou o QR code. Quem quiser pedir, clica e cai direto no seu WhatsApp.',
  },
] as const

const CORES_DESTAQUE = [PALETA[7], PALETA[9], PALETA[5], PALETA[1]]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 via-white to-white">
      <header className="max-w-5xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <span className="font-bold text-lg text-slate-800">Olha Aí</span>
        <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          Já tem catálogo? Entrar
        </Link>
      </header>

      <main className="flex-1">
        <section className="max-w-3xl mx-auto px-6 pt-10 pb-16 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 leading-tight">
            Seu cardápio bonito, no link do WhatsApp
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-500 max-w-xl mx-auto">
            Um catálogo simples pra mostrar o que você vende hoje — com foto, preço e um
            botão que já abre o WhatsApp com o pedido pronto. Sem aplicativo pra instalar.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              href="/cadastro"
              className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 py-4 text-sm font-semibold tracking-wide shadow-md transition-colors"
            >
              Criar meu catálogo grátis
            </Link>
            <p className="text-xs text-slate-400">
              30 dias grátis. Depois, R$ 19,90 por mês pra continuar no ar.
            </p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-6 pb-16">
          <div className="grid sm:grid-cols-3 gap-5">
            {PASSOS.map(({ icone: Icone, titulo, texto }) => (
              <div key={titulo} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
                <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-3">
                  <Icone size={20} />
                </div>
                <h2 className="font-semibold text-slate-800 text-sm">{titulo}</h2>
                <p className="mt-1.5 text-sm text-slate-500">{texto}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Prévia do catálogo — placeholder até a Izis trocar por prints reais de catálogos já em uso */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-slate-400 mb-6">
            Do jeito que o cliente vê
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {CORES_DESTAQUE.slice(0, 3).map((cor) => (
              <div
                key={cor.hex}
                className="w-32 sm:w-36 aspect-[9/16] rounded-2xl border-4 border-white shadow-lg overflow-hidden flex-shrink-0"
                style={{ background: cor.hex }}
              >
                <div className="h-full w-full flex flex-col items-center justify-center gap-2 p-3 text-white/90">
                  <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/40" />
                  <div className="h-1.5 w-12 rounded-full bg-white/40" />
                  <div className="h-1 w-16 rounded-full bg-white/25" />
                  <div className="mt-2 w-full space-y-1.5">
                    {[0, 1].map((j) => (
                      <div key={j} className="h-5 rounded-lg bg-white/15 border border-white/20" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-2xl mx-auto px-6 pb-24 text-center">
          <h2 className="text-xl font-bold text-slate-800">Simples assim, sem enrolação</h2>
          <p className="mt-2 text-sm text-slate-500">
            Sem carrinho, sem frete, sem sistema complicado. É só um lugar bonito pra mostrar o
            que você vende e mandar o cliente direto pro seu WhatsApp.
          </p>
          <Link
            href="/cadastro"
            className="mt-6 inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 py-4 text-sm font-semibold tracking-wide shadow-md transition-colors"
          >
            Criar meu catálogo grátis
          </Link>
        </section>
      </main>

      <footer className="py-8 text-center text-xs text-slate-400">
        Olha Aí
      </footer>
    </div>
  )
}
