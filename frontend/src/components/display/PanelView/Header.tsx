"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import styled from "styled-components"
import useMap from "@/libs/hook/useMap"
import useOnScreen from "@/libs/hook/useOnScreen"
import { Timer, clearTimer, setTimer } from "@/libs/timer"
import useSearchLocationList, { TypeSearchLocationResult } from "@/queries/api/map/useSearchLocationList"
import SearchLocation, { TypeSearchLocation } from "@/components/form/SearchLocation"

export interface PanelViewHeaderProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  //
}

interface TypeStructure {
  isUpdated: boolean
  isExpanded: boolean
}

const PanelViewHeader = (props: PanelViewHeaderProps) => {
  const { className = "", children, ...restProps } = props

  const timers = useRef<Timer>({ delay: null })
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [structure, setStructure] = useState<TypeStructure>({
    isUpdated: false,
    isExpanded: false,
  })

  const {
    mapStructure: { mode },
    onMove,
  } = useMap()

  const {
    onScreenRefs: { infiniteRef },
    onScreenStructure: { isVisible },
  } = useOnScreen()

  const searchLocation = useForm<TypeSearchLocation>({
    defaultValues: {
      location: "",
      searchKeyword: "",
    },
  })

  const { flatData, isSelected, hasNextPage, fetchNextPage } = useSearchLocationList({
    searchKeyword: searchLocation.watch("searchKeyword") ?? "",
  })

  const onBlur = (event: React.FocusEvent<HTMLFormElement>) => {
    if (!containerRef.current) return
    if (containerRef.current.querySelector("form")?.contains(event.relatedTarget)) return
    setStructure((prev) => ({ ...prev, isExpanded: false }))
  }

  const onSelect = async (data: TypeSearchLocationResult["documents"][number]) => {
    searchLocation.setValue("location", data.address_name)
    searchLocation.setValue("searchKeyword", data.address_name)
    onMove({ coordinates: { latitude: +data.y, longitude: +data.x } })
    setStructure((prev) => ({ ...prev, isUpdated: false, isExpanded: false }))
  }

  const onSubmit = async (data: TypeSearchLocation) => {
    if (!data?.location) {
      setStructure((prev) => ({ ...prev, isUpdated: false, isExpanded: false }))
      searchLocation.setValue("location", "")
      searchLocation.setValue("searchKeyword", "")
      return
    }
    searchLocation.setValue("searchKeyword", data?.location ?? "")
    setStructure((prev) => ({ ...prev, isUpdated: true, isExpanded: true }))
  }

  useEffect(() => {
    if (isVisible && hasNextPage) fetchNextPage()
  }, [isVisible, hasNextPage])

  useEffect(() => {
    if (!structure.isUpdated) return
    ;(async () => {
      clearTimer(timers, { key: "delay" })
      await setTimer(timers, { key: "delay", delay: 50 })
      setStructure((prev) => ({ ...prev, isUpdated: false }))
    })()
  }, [structure.isUpdated])

  return (
    <PanelViewHeaderContainer ref={containerRef} className={`${className}`} {...restProps}>
      <SearchLocation
        formData={searchLocation}
        formAction={{
          submit: "검색",
        }}
        formPlaceholder={{
          location: "행정동 검색",
        }}
        isUpdated={structure.isUpdated}
        handleValid={onSubmit}
        onBlur={onBlur}
      >
        {mode === "Advanced" && !isSelected && structure.isExpanded && Boolean(flatData.length) && (
          <SearchLocation.Group key="search">
            {flatData.map((data) => (
              <SearchLocation.Item key={data.address_name} data={data} onClick={() => onSelect(data)} />
            ))}
          </SearchLocation.Group>
        )}
        <div id="infinite" ref={infiniteRef} />
      </SearchLocation>
      {children}
    </PanelViewHeaderContainer>
  )
}

const PanelViewHeaderContainer = styled.div`
  /*  */
`

export default PanelViewHeader
