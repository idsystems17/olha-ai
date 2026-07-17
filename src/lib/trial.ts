export function statusTrial(trialStartedAt: string, isSubscribed: boolean) {
  const diasDesdeInicio = Math.max(
    0,
    Math.floor((Date.now() - new Date(trialStartedAt).getTime()) / (24 * 60 * 60 * 1000))
  )
  const diasRestantes = Math.max(0, 30 - diasDesdeInicio)
  const trialAcabou = !isSubscribed && diasDesdeInicio >= 30
  return { diasRestantes, trialAcabou }
}
