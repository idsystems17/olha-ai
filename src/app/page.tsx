import Link from 'next/link'
import Image from 'next/image'
import { MessageCircleHeart, ImagePlus, QrCode } from 'lucide-react'

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
            <p className="text-sm sm:text-base font-medium text-slate-600">
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

        {/* Print real de um catálogo de demonstração (Bolos da Ana) — trocar
            por um catálogo real assim que a Izis tiver o primeiro cliente. */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-slate-400 mb-6">
            Do jeito que o cliente vê
          </h2>
          <div className="max-w-[280px] mx-auto rounded-3xl border-4 border-white shadow-xl overflow-hidden">
            <Image
              src="/preview-catalogo.png"
              alt="Exemplo de catálogo no Olha Aí, com fotos, preços e botão de pedido pelo WhatsApp"
              width={840}
              height={1340}
              className="w-full h-auto"
              priority
            />
          </div>
          <div className="text-center mt-4">
            <Link
              href="/exemplo"
              className="text-sm font-semibold text-orange-600 hover:text-orange-700 underline underline-offset-2"
            >
              Ver catálogo de exemplo ao vivo
            </Link>
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
