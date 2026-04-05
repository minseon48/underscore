import { useState, useEffect, useRef } from "react"

type TypeStructure = {
  isVisible: boolean
}

const useOnScreen = () => {
  const [structure, setStructure] = useState<TypeStructure>({
    isVisible: false,
  })

  const observerRef = useRef<IntersectionObserver | null>(null)
  const infiniteRef = useRef<HTMLDivElement | null>(null)

  const onReset = () => {
    setStructure(() => ({ isVisible: false }))
  }

  const updateObserver = () => {
    if (!infiniteRef.current) return
    const io = new IntersectionObserver(
      ([entry], observer) => {
        setStructure((prev) => ({ ...prev, isVisible: entry.isIntersecting }))
      },
      { rootMargin: "10px" },
    )
    io.observe(infiniteRef.current)
    observerRef.current = io
  }

  const removeObserver = () => {
    if (!observerRef.current) return
    observerRef.current.disconnect()
    onReset()
  }

  useEffect(() => {
    updateObserver()
    return () => {
      removeObserver()
    }
  }, [])

  return {
    onScreenStructure: structure,
    onScreenRefs: {
      infiniteRef,
    },
    onReset,
  }
}

export default useOnScreen
