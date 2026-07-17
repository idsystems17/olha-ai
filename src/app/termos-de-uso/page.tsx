import Link from 'next/link'

export const metadata = {
  title: 'Termos de Uso — Olha Aí',
}

export default function TermosDeUsoPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Termos de Uso</h1>
        <p className="text-xs text-slate-400 mb-6">Última atualização: julho de 2026</p>

        <div className="space-y-5 text-sm text-slate-700 leading-relaxed">
          <section>
            <h2 className="font-semibold text-slate-800 mb-1.5">O que é o Olha Aí</h2>
            <p>
              O Olha Aí é uma ferramenta que permite criar um catálogo digital de produtos,
              compartilhável por link, com pedidos feitos diretamente pelo WhatsApp da vendedora
              ou vendedor. Ao criar uma conta, você concorda com estes termos.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-800 mb-1.5">Sua conta</h2>
            <p>
              Você é responsável pelas informações que publica no seu catálogo (produtos, preços,
              fotos, descrição) e pela veracidade dos dados informados no cadastro. Não é permitido
              usar o Olha Aí pra anunciar produtos ilegais, ou se passar por outra pessoa/empresa.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-800 mb-1.5">Período de teste e assinatura</h2>
            <p>
              A conta começa com um período de teste gratuito. Depois disso, o catálogo público
              só continua ativo pra quem assina o plano pago. Os pagamentos são processados pela
              Kiwify; dúvidas sobre cobrança podem ser tratadas direto com o suporte deles ou com
              a gente.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-800 mb-1.5">O que não fazemos</h2>
            <p>
              O Olha Aí é só a vitrine e o canal de contato — não processamos pagamento de
              produtos, não fazemos entrega, e não somos parte da negociação entre você e seus
              clientes. Qualquer combinado sobre o pedido (preço, entrega, forma de pagamento) é
              direto entre vocês, pelo WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-800 mb-1.5">Encerramento de conta</h2>
            <p>
              Você pode encerrar sua conta a qualquer momento — veja como na nossa{' '}
              <Link href="/politica-de-privacidade" className="text-orange-600 font-semibold">
                Política de Privacidade
              </Link>. Também podemos suspender contas que violem estes termos.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-800 mb-1.5">Dúvidas</h2>
            <p>
              Fale com a gente pelo e-mail{' '}
              <a href="mailto:contato@olhaai.idsist.com.br" className="text-orange-600 font-semibold">
                contato@olhaai.idsist.com.br
              </a>.
            </p>
          </section>
        </div>

        <p className="text-center mt-8">
          <Link href="/cadastro" className="text-orange-600 font-semibold text-sm">← Voltar</Link>
        </p>
      </div>
    </div>
  )
}
