import Link from 'next/link'

export const metadata = {
  title: 'Política de Privacidade — Olha Aí',
}

export default function PoliticaDePrivacidadePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Política de Privacidade</h1>
        <p className="text-xs text-slate-400 mb-6">Última atualização: julho de 2026</p>

        <div className="space-y-5 text-sm text-slate-700 leading-relaxed">
          <p>
            O Olha Aí é um catálogo digital pra você compartilhar seus produtos por WhatsApp.
            Esta página explica quais dados a gente coleta quando você cria uma conta, pra quê,
            e quais direitos você tem sobre eles — conforme a Lei Geral de Proteção de Dados
            (LGPD).
          </p>

          <section>
            <h2 className="font-semibold text-slate-800 mb-1.5">O que coletamos no cadastro</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Nome do negócio</strong> — fica público na sua página de catálogo.</li>
              <li><strong>WhatsApp</strong> — fica público, é pra onde seus clientes te chamam.</li>
              <li><strong>E-mail</strong> — usado só pra login e recuperação de senha, não é público.</li>
              <li>
                <strong>CPF</strong> — usado só como identificador anti-fraude (pra evitar que a
                mesma pessoa crie contas repetidas só pra ganhar período grátis várias vezes).
                O CPF em texto puro <strong>nunca é gravado no nosso banco</strong> — guardamos
                apenas um código criptográfico (hash) derivado dele, que não pode ser revertido
                pra descobrir o número original.
              </li>
              <li><strong>Senha</strong> — nunca é armazenada em texto puro, fica só um hash seguro.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-slate-800 mb-1.5">O que você cadastra depois</h2>
            <p>
              Nome, preço, descrição e foto dos produtos do seu catálogo — tudo isso é público,
              já que é o objetivo do serviço (seus clientes verem e pedirem).
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-800 mb-1.5">Com quem compartilhamos</h2>
            <p>
              Não vendemos nem compartilhamos seus dados com terceiros pra fins de marketing.
              Usamos prestadores de serviço estritamente necessários pra operar o produto:
              hospedagem (Vercel), banco de dados e autenticação (Supabase), envio de e-mail
              transacional (Resend) e processamento de pagamento da assinatura (Kiwify). Cada um
              só recebe o dado mínimo necessário pra sua função.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-800 mb-1.5">Por quanto tempo guardamos</h2>
            <p>
              Enquanto sua conta estiver ativa. Se o período de teste grátis expirar sem
              assinatura, seus dados podem ser removidos automaticamente — você é avisada antes
              disso acontecer.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-800 mb-1.5">Seus direitos</h2>
            <p>
              Você pode pedir a qualquer momento pra ver, corrigir ou excluir seus dados. A
              edição de WhatsApp e e-mail já pode ser feita direto no painel, na aba Conta. Pra
              exclusão completa da conta ou qualquer outra dúvida sobre seus dados, fale com a
              gente pelo e-mail{' '}
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
