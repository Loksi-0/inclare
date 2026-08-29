type PopupOpts = {
  buttonRect: DOMRect
  popupRect: DOMRect
}

export const getPopupPosition = ({ buttonRect, popupRect }: PopupOpts) => {
  const PADDING = 10

  let postionX: 'left' | 'right' = 'left'
  let positionY: 'top' | 'bottom' = 'top'

  if (buttonRect.x > window.innerWidth / 2) {
    postionX = 'right'
  }

  if (buttonRect.y < window.innerHeight / 2) {
    positionY = 'bottom'
  }

  let popupX
  let popupY

  if (postionX === 'left') {
    popupX = 0
  } else {
    popupX = buttonRect.width - popupRect.width
  }

  if (positionY === 'top') {
    popupY = (popupRect.height + PADDING) * -1
  } else {
    popupY = buttonRect.height + PADDING
  }

  return { popupX, popupY }
}
