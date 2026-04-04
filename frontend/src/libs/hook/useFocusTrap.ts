import { useCallback, useRef } from "react"
import { Timer, clearTimer, setTimer } from "@/libs/timer"

const focusableSelector = [
  "a[href]",
  "area[href]",
  "button",
  "input",
  "select",
  "textarea",
  "video[controls]",
  "audio[controls]",
  "[contenteditable='']",
  "[contenteditable='true']",
  "[tabindex]",
]

type Listeners = [string, (evnet: KeyboardEvent) => void][]

const useFocusTrap = (listeners?: Listeners) => {
  const timers = useRef<Timer>({ delay: null })
  const isInitialized = useRef<boolean>(false)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const focusableRef = useRef<HTMLElement[] | null>(null)
  const activeRef = useRef<HTMLElement | null>(null)
  const returnRef = useRef<HTMLButtonElement | null>(null)

  const keydownTab = (event: KeyboardEvent) => {
    if (!focusableRef.current?.length) return
    const { length, 0: first, [length - 1]: last } = focusableRef.current
    if (event.target === first && event.shiftKey) {
      event.preventDefault()
      last.focus()
    }
    if (event.target === last && !event.shiftKey) {
      event.preventDefault()
      first.focus()
    }
  }

  const keydownListener = useCallback(
    (event: KeyboardEvent) => {
      const keys = [["Tab", keydownTab], ...(listeners ?? [])] as Listeners
      const listener = new Map(keys).get(event.key)
      return listener && listener(event)
    },
    [listeners],
  )

  const onActivate = useCallback(() => {
    isInitialized.current = true
    activeRef.current = document.activeElement as HTMLElement
    focusableRef.current = (
      Array.from(containerRef.current?.querySelectorAll(focusableSelector.join(", ")) ?? []) as HTMLElement[]
    ).filter((el) => Number(el.getAttribute("tabindex")) >= 0)
    containerRef.current?.addEventListener("keydown", keydownListener)
    focusableRef.current?.[0]?.focus()
  }, [])

  const onDeactivate = useCallback(async (options?: { isReturnFocus?: boolean }) => {
    containerRef.current?.removeEventListener("keydown", keydownListener)
    if (isInitialized.current && (options?.isReturnFocus ?? true)) {
      clearTimer(timers, { key: "delay" })
      await setTimer(timers, { key: "delay", delay: 50 })
      if (returnRef.current) returnRef.current?.focus()
      else activeRef.current?.focus()
    }
    isInitialized.current = false
    activeRef.current = null
    focusableRef.current = []
  }, [])

  return {
    focusTrapRefs: {
      containerRef,
      returnRef,
    },
    onActivate,
    onDeactivate,
  }
}

export default useFocusTrap