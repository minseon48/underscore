import { useEffect, useMemo, useRef, useState } from "react"

type Cleanup = undefined | null | void | (() => void)
type Callback = () => Cleanup
type Dependencies = readonly unknown[]

type TypeStructure = {
  isMounted: boolean
}

const useMount = (callback?: Callback, deps?: Dependencies) => {
  const cleanup = useRef<Cleanup>(null)
  const [structure, setStructure] = useState<TypeStructure>({
    isMounted: false,
  })

  const dependencies = useMemo(() => deps ?? [], [deps])

  useEffect(() => {
    setStructure((prev) => ({ ...prev, isMounted: true }))
  }, [])

  useEffect(() => {
    if (!structure.isMounted) return
    cleanup.current = callback?.()
    return () => {
      cleanup.current?.()
    }
  }, [structure.isMounted])

  useEffect(() => {
    if (!callback) return
    cleanup.current?.()
    callback?.()
  }, [...dependencies])

  return {
    mountStructure: structure,
  }
}

export default useMount
