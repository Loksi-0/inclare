export const safe = async <T extends Promise<unknown>>(req: T) => {
  try {
    const data = await req

    return {
      data,
      error: null
    }
  } catch (e) {
    return {
      data: null,
      error: e
    }
  }
}
