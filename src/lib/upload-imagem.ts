// Comprime no navegador antes de subir — mesmo padrão validado no projeto Cards.
async function comprimirImagem(file: File): Promise<Blob> {
  const MAX = 900
  const img = new window.Image()
  const objectUrl = URL.createObjectURL(file)

  return new Promise((resolve, reject) => {
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      let { width, height } = img
      if (width > height && width > MAX) {
        height = Math.round((height * MAX) / width)
        width = MAX
      } else if (height > MAX) {
        width = Math.round((width * MAX) / height)
        height = MAX
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Falha ao comprimir a imagem'))),
        'image/jpeg',
        0.82
      )
    }
    img.onerror = () => reject(new Error('Não foi possível ler a imagem'))
    img.src = objectUrl
  })
}

export async function enviarFoto(file: File): Promise<string> {
  const comprimida = await comprimirImagem(file)
  const formData = new FormData()
  formData.append('file', comprimida, 'foto.jpg')

  const resposta = await fetch('/api/upload-foto', { method: 'POST', body: formData })
  const dados = await resposta.json()

  if (!resposta.ok) {
    throw new Error(dados.error ?? 'Erro ao enviar a foto')
  }
  return dados.url as string
}
