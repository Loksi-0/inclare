export const refreshIFrame = (id: string) => {
  const iframe = document.querySelector<HTMLIFrameElement>(`[id=${id}]`)

  if (!iframe) {
    return
  }

  iframe.src = iframe.src
}
