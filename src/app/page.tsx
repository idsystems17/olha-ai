import Link from 'next/link'
import Image from 'next/image'

// Mesmos prints usados no tutorial de dentro do painel (src/lib/tutorial-painel.ts) —
// texto aqui em tom de venda, não de instrução, mas a imagem é reaproveitada.
const COMO_FUNCIONA = [
  {
    imagem: '/tutorial/cardapio.jpg',
    titulo: 'Monte seu cardápio',
    texto: 'Foto, nome e preço de cada produto. Marca o que tem hoje em dois toques.',
  },
  {
    imagem: '/tutorial/aparencia.jpg',
    titulo: 'Deixe com a sua cara',
    texto: 'Escolha as cores do seu negócio e veja o catálogo ganhar vida na hora.',
  },
  {
    imagem: '/tutorial/meu-link.jpg',
    titulo: 'Compartilhe seu link',
    texto: 'QR code, WhatsApp, Instagram — o cliente clica e já cai no seu WhatsApp.',
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
          <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-slate-400 mb-6">
            Por dentro do painel
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {COMO_FUNCIONA.map(({ imagem, titulo, texto }) => (
              <div key={titulo} className="text-center">
                <div className="max-w-[160px] mx-auto rounded-2xl border-4 border-white shadow-lg overflow-hidden mb-4">
                  <Image src={imagem} alt={titulo} width={738} height={1600} className="w-full h-auto" />
                </div>
                <h3 className="font-semibold text-slate-800 text-sm">{titulo}</h3>
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
