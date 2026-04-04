"use client"

import { useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import styled, { css } from "styled-components"
import useMount from "@/libs/hook/useMount"
import useMap from "@/libs/hook/useMap"
import useGeolocation from "@/libs/hook/useGeolocation"
import Icon from "@/components/general/Icon"
import Button from "@/components/general/Button"

export interface MapViewMainProps extends React.HTMLAttributes<HTMLDivElement> {
  //
}

const fallbackCoordinates = {
  latitude: 37.566585446882,
  longitude: 126.978203640984,
}

const MapViewMain = (props: MapViewMainProps) => {
  const { className = "", ...restProps } = props

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const {
    geolocationStructure: { isLoaded, coordinates },
    onOverwrite,
  } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 1000 * 60 * 1,
    maximumAge: 1000 * 3600 * 24,
  })

  const {
    mapRefs: { containerRef },
    mapStructure: { isInitialized, level, center },
    onInit,
    onRemove,
  } = useMap()

  const {
    mountStructure: { isMounted },
  } = useMount(() => {
    const { level, latitude, longitude } = getSearchParams()
    const center = latitude && longitude ? { latitude, longitude } : null
    if (isLoaded && isMounted)
      onInit({
        level: level ?? 3,
        coordinates: center ?? coordinates ?? fallbackCoordinates,
      })
    return () => {
      onRemove()
    }
  }, [isLoaded, coordinates])

  const getSearchParams = () => {
    const params = Object.fromEntries(Array.from(searchParams.entries()))
    const level = /^\d+$/.test(params.level ?? "") ? parseFloat(params.level ?? "") : null
    const latitude = /^(\d+(.)?\d+)$/.test(params.latitude ?? "") ? parseFloat(params.latitude ?? "") : null
    const longitude = /^(\d+(.)?\d+)$/.test(params.longitude ?? "") ? parseFloat(params.longitude ?? "") : null
    return { level, latitude, longitude }
  }

  useEffect(() => {
    router.replace(`${pathname}?level=${level}&latitude=${center[0]}&longitude=${center[1]}`)
  }, [level, center])

  useEffect(() => {
    if (!isInitialized) return
    router.replace(`${pathname}?level=${level}&latitude=${center[0]}&longitude=${center[1]}`)
  }, [pathname])

  if (!isMounted) {
    return (
      <MapViewMainContainer $isPending={true}>
        <Icon name="Loading" aria-hidden={true} />
        <strong>로딩중이에요</strong>
      </MapViewMainContainer>
    )
  }

  if (!isLoaded) {
    return (
      <MapViewMainContainer $isPending={true}>
        <Icon name="Loading" aria-hidden={true} />
        <strong>위치정보 권한을 확인해주세요</strong>
        <Button type="button" shape="plain" variants="primary" onClick={() => onOverwrite(fallbackCoordinates)}>
          권한없이 시작하기
        </Button>
      </MapViewMainContainer>
    )
  }

  return (
    <MapViewMainContainer className={`${className}`} $isPending={!isInitialized} {...restProps}>
      <div ref={containerRef} id="map" />
    </MapViewMainContainer>
  )
}

interface MapViewMainStyled {
  $isPending: boolean
}

const MapViewMainContainer = styled.div<MapViewMainStyled>`
  position: relative;
  flex: 1 1 0px;
  #map {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  ${(props) =>
    props.$isPending &&
    css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      svg {
        font-size: 24px;
        color: rgb(var(--color-primary600));
      }
      strong {
        margin-top: 8px;
      }
    `}
  *:has(> .overlay:hover),
  *:has(> .overlay:focus),
  *:has(> .overlay.active) {
    z-index: 10 !important;
  }
  .overlay-pin {
    position: relative;
    width: 26px;
    height: 26px;
    > span {
      position: absolute;
      top: 100%;
      left: 50%;
      display: block;
      max-width: 100px;
      padding-top: 5px;
      font-size: 12px;
      line-height: 1.2;
      font-weight: 800;
      text-align: center;
      white-space: initial;
      text-shadow:
        -1px -1px 0 rgb(var(--color-neutral100)),
        1px -1px 0 rgb(var(--color-neutral100)),
        -1px 1px 0 rgb(var(--color-neutral100)),
        1px 1px 0 rgb(var(--color-neutral100));
      transform: translateX(-50%);
    }
    &:before {
      content: "";
      display: block;
      width: 100%;
      height: 100%;
      background: url(/pin.svg) 0 0 no-repeat;
      background-size: 100% auto;
    }
    &:hover,
    &:focus,
    &.active {
      > span {
        color: rgb(var(--color-primary600));
      }
      &:before {
        transform: scale(1.4);
        transform-origin: center bottom;
      }
    }
  }
  .overlay-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 16px;
    color: rgb(var(--color-neutral100));
    background: rgb(var(--color-red500));
    strong {
    }
    span {
      font-weight: 700;
    }
    &:before {
      content: "";
      position: absolute;
      top: 100%;
      left: 0;
      display: block;
      border-left: 12px solid rgb(var(--color-red500));
      border-bottom: 12px solid transparent;
      transform: translateY(-2px);
    }
    &:hover,
    &:focus,
    &.active {
      transform: scale(1.2) translateY(-2px);
      transform-origin: left bottom;
      background: rgb(var(--color-red600));
      &:before {
        border-left-color: rgb(var(--color-red600));
      }
    }
  }
`

export default MapViewMain