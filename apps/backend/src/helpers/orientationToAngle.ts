const anglesMap: Record<number, number> = {
  1: 0,
  3: 180,
  6: 90,
  8: 270
}

export const orientationToAngle = (orientation: number | undefined) => {
  if (!orientation) {
    return 0
  }

  return anglesMap[orientation] || 0
}
