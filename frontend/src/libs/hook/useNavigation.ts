import { useRef } from "react"
import { useRecoilState } from "recoil"
import { Timer, clearTimer, setTimer } from "@/libs/timer"
import { atomGlobal } from "@/stores/global"

const useNavigation = () => {
  const timers = useRef<Timer>({ delay: null })
  const [global, setGlobal] = useRecoilState(atomGlobal)

  const onOpen = async () => {
    clearTimer(timers, { key: "delay" })
    setGlobal((prev) => ({ ...prev, navigationState: { isPending: true, isOpened: false } }))
    clearTimer(timers, { key: "delay" })
    await setTimer(timers, { key: "delay", delay: 50 })
    document.documentElement.classList.add("open-navigation")
    setGlobal((prev) => ({ ...prev, navigationState: { isPending: false, isOpened: true } }))
  }

  const onClose = async () => {
    clearTimer(timers, { key: "delay" })
    setGlobal((prev) => ({ ...prev, navigationState: { isPending: true, isOpened: true } }))
    clearTimer(timers, { key: "delay" })
    await setTimer(timers, { key: "delay", delay: 200 })
    document.documentElement.classList.remove("open-navigation")
    setGlobal((prev) => ({ ...prev, navigationState: { isPending: false, isOpened: false } }))
  }

  return {
    navigationStructure: global.navigationState,
    onOpen,
    onClose,
  }
}

export default useNavigation
