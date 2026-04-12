"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import styled from "styled-components"
import useMap from "@/libs/hook/useMap"
import useSearchProfile from "@/queries/api/user/useSearchProfile"
import useSearchMyplaceList, { TypeSearchMyplaceResult } from "@/queries/api/user/useSearchMyplaceList"
import useMutationMyplaceDetail from "@/queries/api/user/useMutationMyplaceDetail"
import PanelView, { PanelViewSubjectStatusCode } from "@/components/display/PanelView"
import MyplaceView from "@/components/display/MyplaceView"
import Button from "@/components/general/Button"
import Pagination from "@/components/navigation/Pagination"

interface TypeSearchMyplace {
  page: number
  size: number
}

export interface MapMyplaceMainProps extends React.HTMLAttributes<HTMLDivElement> {
  //
}

const MapMyplaceMain = (props: MapMyplaceMainProps) => {
  const { className = "", ...restProps } = props

  const {
    mapStructure: { isInitialized },
    onMove,
    onOverlayFocus,
    onOverlayBlur,
    onOverlayChanged,
  } = useMap()

  const searchMyplace = useForm<TypeSearchMyplace>({
    defaultValues: {
      page: 1,
      size: 10,
    },
  })

  const { data: profileData } = useSearchProfile()

  const {
    data: myplaceData,
    isLoading,
    isFetching,
    isPending,
  } = useSearchMyplaceList(searchMyplace.watch("page"), {
    size: searchMyplace.watch("size"),
  })

  const { deleteMyplaceDetailAsync, deleteMyplaceDetailStatus } = useMutationMyplaceDetail()

  const makeOverlayOption = (place: TypeSearchMyplaceResult["items"][number]) => {
    return {
      id: `${place.id}`,
      content: `<span>${place.addressName}</span>`, // pin
      coordinates: {
        latitude: parseFloat(`${place.coordinates.latitude}`),
        longitude: parseFloat(`${place.coordinates.longitude}`),
      },
    }
  }

  const onSelect = (place: TypeSearchMyplaceResult["items"][number]) => {
    onMove({ coordinates: place.coordinates })
  }

  const onDelete = (place: TypeSearchMyplaceResult["items"][number]) => {
    deleteMyplaceDetailAsync({
      id: place.id,
    })
  }

  const onPaging = (page: number) => {
    searchMyplace.setValue("page", page)
  }

  useEffect(() => {
    if (!isInitialized) return
    searchMyplace.setValue("page", 1)
    onOverlayChanged({
      shape: "pin",
      locations: (myplaceData?.items ?? []).map(makeOverlayOption),
    })
  }, [isInitialized, myplaceData?.items])

  return (
    <MapMyplaceMainContainer className={`${className}`} {...restProps}>
      <PanelView.Subject
        {...(!isInitialized || isLoading || isFetching || deleteMyplaceDetailStatus === "pending"
          ? { statusCode: PanelViewSubjectStatusCode.Loading, statusMessage: "로딩중", hasIcon: true }
          : isPending && !isLoading
            ? { statusCode: PanelViewSubjectStatusCode.Warning, statusMessage: "알 수 없는 오류", hasIcon: true }
            : { statusCode: PanelViewSubjectStatusCode.Success, statusMessage: "검색 완료", hasIcon: false })}
        count={myplaceData?.count}
      >
        내장소
      </PanelView.Subject>
      <MapMyplaceMainResult>
        {myplaceData && Boolean(myplaceData?.items?.length) && (
          <MyplaceView.Group>
            {myplaceData?.items?.map((place) => {
              const options = {
                shape: "pin" as const,
                location: makeOverlayOption(place),
              }
              return (
                <MyplaceView.Item
                  key={place.id}
                  data={place}
                  data-target-id={`overlay${place.id}`}
                  tabIndex={0}
                  // onMouseOver={() => onOverlayFocus(options)}
                  // onMouseOut={() => onOverlayBlur(options)}
                  onSelect={() => onSelect(place)}
                  onDelete={() => onDelete(place)}
                />
              )
            })}
            {myplaceData && Boolean(myplaceData?.count) && (
              <Pagination
                page={searchMyplace.watch("page")}
                totalPages={Math.ceil(myplaceData?.count / searchMyplace.watch("size"))}
                onPaging={onPaging}
              />
            )}
          </MyplaceView.Group>
        )}
      </MapMyplaceMainResult>
      {!profileData && (
        <PanelView.Message>
          <strong>
            <em>로그인</em> 후 확인 가능해요
          </strong>
          <span>내장소를 추가하여 상권분석 결과를 비교해보세요</span>
          <Link href="/auth/join" target="_blank" passHref={true} legacyBehavior={true}>
            <Button asTag="a">로그인</Button>
          </Link>
        </PanelView.Message>
      )}
      {myplaceData && (myplaceData?.totalCount ?? 0) === 0 && (
        <PanelView.Message>
          <strong>
            등록된 <em>내장소</em>가 없어요
          </strong>
          <span>내장소를 추가하여 상권분석 결과를 비교해보세요</span>
        </PanelView.Message>
      )}
    </MapMyplaceMainContainer>
  )
}

const MapMyplaceMainResult = styled(MyplaceView)`
  nav {
    padding: 16px 0;
    background: rgb(var(--color-neutral100));
    border-top: 1px solid rgb(var(--color-neutral400));
  }
`

const MapMyplaceMainContainer = styled.div`
  /*  */
`

export default MapMyplaceMain
