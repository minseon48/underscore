import { useRef } from "react"
import { useRecoilState } from "recoil"
import { TypeMap, atomMap } from "@/stores/map"
import { TypeCategoryCode } from "@/queries/api/map"

const KAKAO_SDK_URL = `${process.env.NEXT_PUBLIC_API_KAKAO_URL}/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_API_KAKAO_JS_KEY}&autoload=false&libraries=services&clusterer`

type Level = number
type Coordinates = { latitude: number; longitude: number }
type Location = { id: string; content: string; coordinates: Coordinates }

const useMap = () => {
  const [map, setMap] = useRecoilState(atomMap)

  const scriptRef = useRef<HTMLScriptElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const setupRef = useRef<{ level: Level; coordinates: Coordinates }>({
    level: 3,
    coordinates: { latitude: 0, longitude: 0 },
  })

  const handleLoad = () => {
    window.kakao.maps.load(() => {
      const { level, coordinates } = setupRef.current
      const options = { center: new window.kakao.maps.LatLng(coordinates.latitude, coordinates.longitude), level }
      const kakaoMap = new window.kakao.maps.Map(containerRef.current, options)
      window.kakaoMap = kakaoMap
      window.kakao.maps.event.addListener(window.kakaoMap, "idle", handleChanged)
      setMap((prev) => ({ ...prev, isInitialized: true }))
      handleChanged()
    })
  }

  const handleChanged = () => {
    const level = window.kakaoMap.getLevel()
    const center = window.kakaoMap.getCenter().toString()
    const bounds = window.kakaoMap.getBounds().toString()
    setMap((prev) => ({
      ...prev,
      level: level,
      center: center.match(/(\d+(.)?\d+)/g).map(parseFloat) as TypeMap["center"],
      bounds: bounds.match(/(\d+(.)?\d+)/g).map(parseFloat) as TypeMap["bounds"],
    }))
    document.querySelectorAll(".overlay").forEach((overlay) => overlay.removeEventListener("click", handleOverlayClick))
    document.querySelectorAll(".overlay").forEach((overlay) => overlay.addEventListener("click", handleOverlayClick))
  }

  const handleOverlayClick = (event: Event) => {
    const target = event.target instanceof HTMLElement ? event.target.closest("button") : null
    const overlayId = target?.dataset?.overlayId
    document.querySelectorAll(`[data-target-id]`).forEach((element) => {
      if (!(element instanceof HTMLElement) || element?.dataset?.targetId !== overlayId) return
      setMap((prev) => ({ ...prev, mode: "Advanced" }))
      element?.focus?.()
    })
  }

  const onInit = ({ level, coordinates }: { level: Level; coordinates: Coordinates }) => {
    if (map.isInitialized) return
    if (!containerRef.current) return
    setupRef.current = { level, coordinates }
    scriptRef.current = document.createElement("script")
    scriptRef.current.async = true
    scriptRef.current.src = KAKAO_SDK_URL
    scriptRef.current.setAttribute("strategy", "beforeInteractive")
    document.head.appendChild(scriptRef.current)
    scriptRef.current.addEventListener("load", handleLoad)
  }

  const onFilterChanged = (option: { businessCode?: string; categoryCode?: TypeCategoryCode }) => {
    setMap((prev) => ({ ...prev, ...option }))
  }

  const onOverlayChanged = ({ shape, locations }: { shape: "pin" | "box"; locations: Location[] }) => {
    document.querySelectorAll(".overlay").forEach((overlay) => overlay.removeEventListener("click", handleOverlayClick))
    if (window.kakaoOverlays) window.kakaoOverlays.forEach((overlay) => overlay.setMap(null))
    const overlays = locations.map((location) => {
      const center = new window.kakao.maps.LatLng(location.coordinates.latitude, location.coordinates.longitude)
      const overlay = new window.kakao.maps.CustomOverlay({
        clickable: true,
        position: center,
        ...(shape === "pin"
          ? { xAnchor: 0.5, yAnchor: 0.9 }
          : shape === "box"
            ? { xAnchor: 0, yAnchor: 1.1 }
            : { xAnchor: 0.5, yAnchor: 0.5 }),
        content: `<button type="button" class="overlay overlay-${shape}" data-overlay-id="overlay${location.id}">
          ${location.content}
        </button>`,
      })
      overlay.setMap(window.kakaoMap)
      return overlay
    })

    window.kakaoOverlays = overlays
    document.querySelectorAll(`.overlay-${shape}`).forEach((overlay) => {
      overlay.addEventListener("click", handleOverlayClick)
    })
  }

  const onOverlayFocus = ({ shape, location }: { shape: "pin" | "box"; location: Location }) => {
    const overlayId = `overlay${location.id}`
    document.querySelectorAll(`.overlay-${shape}[data-overlay-id]`).forEach((element) => {
      if (!(element instanceof HTMLElement) || element?.dataset?.overlayId !== overlayId) return
      setMap((prev) => ({ ...prev, mode: "Advanced" }))
      element.classList.add("active")
      element?.focus?.()
    })
  }

  const onOverlayBlur = ({ shape, location }: { shape: "pin" | "box"; location: Location }) => {
    const overlayId = `overlay${location.id}`
    document.querySelectorAll(`.overlay-${shape}[data-overlay-id]`).forEach((element) => {
      if (!(element instanceof HTMLElement) || element?.dataset?.overlayId !== overlayId) return
      setMap((prev) => ({ ...prev, mode: "Advanced" }))
      element.classList.remove("active")
      element?.focus?.()
    })
  }

  const onMove = ({ coordinates }: { coordinates: Coordinates }) => {
    const center = new window.kakao.maps.LatLng(coordinates.latitude, coordinates.longitude)
    window.kakaoMap.relayout()
    window.kakaoMap.setLevel(3)
    window.kakaoMap.setCenter(center)
    handleChanged()
  }

  const onRemove = () => {
    setMap((prev) => ({ ...prev, isInitialized: false, bounds: [0, 0, 0, 0] }))
    if (scriptRef.current) scriptRef.current.removeEventListener("load", handleLoad)
    if (window.kakaoMap) window.kakao.maps.event.addListener(window.kakaoMap, "idle", handleChanged)
  }

  return {
    mapStructure: map,
    mapRefs: {
      containerRef,
    },
    onInit,
    onMove,
    onOverlayChanged,
    onOverlayFocus,
    onOverlayBlur,
    onFilterChanged,
    onRemove,
  }
}

export default useMap
