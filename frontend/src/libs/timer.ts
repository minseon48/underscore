export type Timer = { [key: string]: NodeJS.Timeout | null }

export const setTimer = <T extends Timer>(ref: React.MutableRefObject<T>, options: { key: keyof T; delay: number }) =>
  new Promise<void>((resolve) => {
    const timerId = setTimeout(() => {
      clearTimer(ref, { key: options.key })
      resolve()
    }, options.delay)
    ref.current[options.key] = timerId as T[keyof T]
  })

export const clearTimer = <T extends Timer>(ref: React.MutableRefObject<T>, options: { key: keyof T }) => {
  const timerId = ref.current[options.key]
  if (timerId) {
    clearTimeout(timerId)
    ref.current[options.key] = null as T[keyof T]
  }
}