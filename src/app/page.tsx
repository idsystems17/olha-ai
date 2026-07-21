import Link from 'next/link'
import { Dancing_Script } from 'next/font/google'
import { ArrowRight, CheckCircle2, Smartphone, ShoppingBag, PlayCircle } from 'lucide-react'

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: '600' })

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Olha Aí',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'Catálogo digital simples e prático pra quem vende pelo WhatsApp. Foto, preço e um botão que já leva pro pedido pronto, sem taxa por venda.',
  offers: {
    '@type': 'Offer',
    price: '19.90',
    priceCurrency: 'BRL',
    description: 'Mensal, após 30 dias grátis sem pedir cartão.',
  },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 via-white to-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      <header className="max-w-3xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 flex items-center justify-center shadow-sm">
            <span className={`${dancingScript.className} text-white text-[10px] leading-none`}>Olha Aí</span>
          </div>
        </div>
        <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          Já tem catálogo? Entrar
        </Link>
      </header>

      <main className="flex-1">
        {/* HERO */}
        <section className="max-w-2xl mx-auto px-6 pt-8 pb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 leading-tight">
            Sua vitrine bonita, no link do WhatsApp
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Um catálogo simples pra mostrar o que você vende hoje — com foto, preço e um botão que já
            abre o WhatsApp com o pedido pronto. Sem aplicativo pra instalar, sem taxa por venda.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              href="/cadastro"
              className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 py-4 text-sm font-semibold tracking-wide shadow-md transition-colors group"
            >
              <span>Criar meu catálogo grátis</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="text-sm sm:text-base font-medium text-slate-600">
              30 dias grátis. Depois, R$ 19,90 por mês pra continuar no ar.
            </p>
          </div>
        </section>

        {/* CHAMADA PRA DEMO INTERATIVA */}
        <section className="max-w-2xl mx-auto px-6 pb-16">
          <Link
            href="/como-funciona"
            className="group block rounded-3xl bg-gradient-to-r from-rose-500 to-orange-500 p-6 sm:p-8 shadow-lg shadow-orange-500/20 hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                <PlayCircle className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">
                  100% interativo, sem precisar criar conta
                </p>
                <h2 className="text-white font-bold text-lg sm:text-xl leading-snug">
                  Veja o Olha Aí funcionando de verdade — teste ao vivo
                </h2>
              </div>
              <ArrowRight className="w-6 h-6 text-white flex-shrink-0 transition-transform group-hover:translate-x-1 hidden sm:block" />
            </div>
          </Link>
        </section>

        {/* DIFERENCIAIS */}
        <section className="max-w-3xl mx-auto px-6 pb-20">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-slate-400 mb-8">
            Diga adeus ao &ldquo;manda foto no privado&rdquo; e &ldquo;qual o valor?&rdquo;
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-800 text-sm">Botão &ldquo;Disponível&rdquo;</h3>
              <p className="mt-1.5 text-sm text-slate-500">
                Acabou o bolo de cenoura? Desativa com um toque. O cliente só pede o que está pronto.
              </p>
            </div>
            <div>
              <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-800 text-sm">Criação rápida, direto do celular</h3>
              <p className="mt-1.5 text-sm text-slate-500">
                Nome, WhatsApp e as fotos do celular. Sem app pra instalar, sem complicação.
              </p>
            </div>
            <div>
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-800 text-sm">Pedido direto no seu WhatsApp</h3>
              <p className="mt-1.5 text-sm text-slate-500">
                O cliente clica em &ldquo;Pedir&rdquo; e a mensagem já chega pronta. Sem taxa, sem intermediário.
              </p>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="max-w-2xl mx-auto px-6 pb-24 text-center">
          <h2 className="text-xl font-bold text-slate-800">Simples assim, sem enrolação</h2>
          <p className="mt-2 text-sm text-slate-500">
            Sem carrinho, sem frete, sem sistema complicado. É só um lugar bonito pra mostrar o
            que você vende e mandar o cliente direto pro seu WhatsApp.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/cadastro"
              className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 py-4 text-sm font-semibold tracking-wide shadow-md transition-colors"
            >
              Criar meu catálogo grátis
            </Link>
            <Link
              href="/como-funciona"
              className="inline-flex items-center justify-center gap-1.5 text-slate-600 hover:text-slate-800 text-sm font-semibold px-4 py-4"
            >
              <PlayCircle className="w-4 h-4" />
              Testar antes, ao vivo
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-xs text-orange-400">Olha Aí</footer>
    </div>
  )
}
