import { useRef, useState } from "react"
import { NonUndefined } from "react-hook-form"
import { Nullable } from "@/libs/utils"
import { Timer, clearTimer, setTimer } from "@/libs/timer"

type Debounce = number

type TypeStructure = {
  isDebounce: boolean
  width: number
  height: number
  windowInnerWidth: number
  windowOuterWidth: number
  windowInnerHeight: number
  windowOuterHeight: number
}

const useResize = (debounce?: Debounce) => {
  const timers = useRef<Timer>({ delay: null })
  const observer = useRef<ResizeObserver | null>(null)
  const containerRef = useRef<NonUndefined<Nullable<HTMLDivElement>>>(null)

  const [structure, setStructure] = useState<TypeStructure>(() => ({
    isDebounce: false,
    width: 0,
    height: 0,
    windowInnerWidth: 0,
    windowOuterWidth: 0,
    windowInnerHeight: 0,
    windowOuterHeight: 0,
  }))

  const onReset = () => {
    setStructure(() => ({
      isDebounce: false,
      width: 0,
      height: 0,
      windowInnerWidth: 0,
      windowOuterWidth: 0,
      windowInnerHeight: 0,
      windowOuterHeight: 0,
    }))
  }

  const onUpdate = () => {
    if (!containerRef.current && !document?.body) return
    const io = new ResizeObserver(async ([entry]) => {
      setStructure((prev) => ({
        ...prev,
        isDebounce: true,
      }))
      clearTimer(timers, { key: "delay" })
      await setTimer(timers, { key: "delay", delay: debounce ?? 0 })
      setStructure((prev) => ({
        ...prev,
        isDebounce: false,
        width: entry.contentRect.width,
        height: entry.contentRect.height,
        windowInnerWidth: window.innerWidth,
        windowOuterWidth: window.outerWidth,
        windowInnerHeight: window.innerHeight,
        windowOuterHeight: window.outerWidth,
      }))
    })
    io.observe(containerRef.current ?? document?.body)
    observer.current = io
  }

  const onRemove = () => {
    if (!observer?.current) return
    observer?.current?.disconnect()
    onReset()
  }

  return {
    resizeRef: {
      containerRef,
    },
    resizeObserver: observer,
    resizeStructure: structure,
    onUpdate,
    onRemove,
  }
}

export default useResize
