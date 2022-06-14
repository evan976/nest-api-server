export const createUUID = () => {
  const INITIAL_COUNTER = 46656
  let counter = INITIAL_COUNTER
  let lastTime = 0

  return () => {
    const now = Date.now()

    if (now === lastTime) {
      counter++
    } else {
      counter = INITIAL_COUNTER
      lastTime = now
    }
    return `${now}${counter}`
  }
}