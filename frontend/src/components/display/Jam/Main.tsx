"use client"

import { useState } from "react"
import useMount from "@/libs/hook/useMount"

export interface JamMainProps extends React.HTMLAttributes<HTMLDivElement> {
  delay: number
}

interface TypeStructure {
  isReady: boolean
}

const JamMain = (props: JamMainProps) => {
  const { delay = 500, className = "", ...restProps } = props

  const [structure, setStructure] = useState<TypeStructure>({
    isReady: false,
  })

  const {
    mountStructure: { isMounted },
  } = useMount(() => {
    setTimeout(() => setStructure((prev) => ({ ...prev, isReady: true })), delay)
  }, [])

  const jamError = () => {
    throw new Error("Error!")
  }

  if (!isMounted) return null
  if (!structure.isReady) return null

  return <div className={`${className} ${jamError()}`} {...restProps} />
}

export default JamMain