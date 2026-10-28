"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import styled from "styled-components"
import useMap from "@/libs/hook/useMap"
import useSearchProfile from "@/queries/api/user/useSearchProfile"
import useSearchMyplaceList, { TypeSearchMyplaceResult } from "@/queries/api/user/useSearchMyplaceList"
import useMutationMyplaceDetail from "@/queries/api/user/useMutationMyplaceDetail"
import useSearchMyplaceGroupList from "@/queries/api/user/useSearchMyplaceGroupList"
import useMutationMyplaceGroup from "@/queries/api/user/useMutationMyplaceGroup"
import useSearchMembership from "@/queries/api/user/useSearchMembership"
import useSearchAdministrativeDistrictList, {
  TypeSearchAdministrativeDistrictResult,
} from "@/queries/api/user/useSearchAdministrativeDistrictList"
import SearchLocation, { TypeSearchLocation } from "@/components/form/SearchLocation"
import { TypeSubscriptionCode } from "@/components/form/ChangeMembership/type"
import Input from "@/components/entry/input"
import Select from "@/components/entry/Select"
import PanelView, { PanelViewSubjectStatusCode } from "@/components/display/PanelView"
import MyplaceView from "@/components/display/MyplaceView"
import Button from "@/components/general/Button"
import Pagination from "@/components/navigation/Pagination"

interface TypeSearchMyplace {
  page: number
  size: number
}

interface TypeCreateGroup {
  name: string
}

interface TypeCreatePlace {
  groupId: number
  administrativeCode: string
  addressName: string
  latitude: number
  longitude: number
  memo: string
  location: string
  searchKeyword: string
}

export interface MapMyplaceMainProps extends React.HTMLAttributes<HTMLDivElement> {
  //
}

const MapMyplaceMain = (props: MapMyplaceMainProps) => {
  const { className = "", ...restProps } = props

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
  const [isGroupFormOpen, setIsGroupFormOpen] = useState(false)
  const [isPlaceFormOpen, setIsPlaceFormOpen] = useState(false)
  const [isLocationUpdated, setIsLocationUpdated] = useState(false)
  const [isLocationExpanded, setIsLocationExpanded] = useState(false)

  const createGroup = useForm<TypeCreateGroup>({
    defaultValues: {
      name: "",
    },
  })

  const createPlace = useForm<TypeCreatePlace>({
    defaultValues: {
      groupId: 0,
      administrativeCode: "",
      addressName: "",
      latitude: 0,
      longitude: 0,
      memo: "",
      location: "",
      searchKeyword: "",
    },
  })

  const searchLocation = useForm<TypeSearchLocation>({
    defaultValues: {
      location: "",
      searchKeyword: "",
    },
  })

  const groupName = createGroup.watch("name") ?? ""
  const isGroupNameValid = groupName.trim().length > 0 && groupName.trim().length <= 30
  const placeMemo = createPlace.watch("memo") ?? ""
  const placeAdministrativeCode = createPlace.watch("administrativeCode") ?? ""
  const placeGroupId = createPlace.watch("groupId")
  const isPlaceFormValid =
    !!placeGroupId && !!placeAdministrativeCode && placeMemo.trim().length <= 100

  const {
    data: groupData,
    isLoading: isGroupLoading,
    isFetching: isGroupFetching,
    isError: isGroupError,
  } = useSearchMyplaceGroupList()
  const { postMyplaceGroupAsync, postMyplaceGroupStatus, deleteMyplaceGroupAsync } = useMutationMyplaceGroup()
  const { postMyplaceDetailAsync,
          postMyplaceDetailStatus,
          deleteMyplaceDetailAsync,
          deleteMyplaceDetailStatus,} = useMutationMyplaceDetail()

  const {
    mapStructure: { isInitialized },
    onMove,
    onOverlayChanged,
  } = useMap()

  const searchMyplace = useForm<TypeSearchMyplace>({
    defaultValues: {
      page: 1,
      size: 10,
    },
  })

  const { data: profileData } = useSearchProfile()
  const { data: membershipData } = useSearchMembership()

  const selectedGroup = groupData?.find((group) => group.id === selectedGroupId)

  const isGroupFull =
    !!selectedGroup && selectedGroup.placeCount >= selectedGroup.maxCount
  const {
    data: myplaceData,
    isLoading: isPlaceLoading,
    isFetching: isPlaceFetching,
    isError: isPlaceError,
  } = useSearchMyplaceList(searchMyplace.watch("page"), {
    size: searchMyplace.watch("size"),
    groupId: selectedGroupId ?? 0,
  })

  const { items: districtItems } = useSearchAdministrativeDistrictList(
    searchLocation.watch("searchKeyword") ?? "",
  )
  const groupOptionGroups = useMemo(
    () => [
      {
        label: "그룹",
        options: (groupData ?? []).map((group) => ({
          value: group.id,
          text: group.name,
        })),
      },
    ],
    [groupData],
  )

  const onOpenGroupForm = () => {
    createGroup.reset({ name: "" })
    setIsGroupFormOpen(true)
  }

  const onCloseGroupForm = () => {
    setIsGroupFormOpen(false)
  }

  const onSubmitGroup = async ({ name }: TypeCreateGroup) => {
    try {
      await postMyplaceGroupAsync({ name: name.trim() })
      setIsGroupFormOpen(false)
      createGroup.reset({ name: "" })
    } catch {
      //
    }
  }

  const onOpenGroup = (groupId: number) => {
    setSelectedGroupId(groupId)
    setIsPlaceFormOpen(false)
    searchMyplace.setValue("page", 1)
  }

  const onBackToGroups = () => {
    setSelectedGroupId(null)
    setIsPlaceFormOpen(false)
  }

  const onOpenPlaceForm = () => {
    createPlace.reset({
      groupId: selectedGroupId ?? 0,
      administrativeCode: "",
      addressName: "",
      latitude: 0,
      longitude: 0,
      memo: "",
      location: "",
      searchKeyword: "",
    })
    searchLocation.reset({
      location: "",
      searchKeyword: "",
    })
    setIsLocationExpanded(false)
    setIsPlaceFormOpen(true)
  }

  const onClosePlaceForm = () => {
    setIsPlaceFormOpen(false)
  }

  const onSelectDistrict = (data: TypeSearchAdministrativeDistrictResult[number]) => {
    const { administrativeCode, addressName, coordinates } = data

    searchLocation.setValue("location", addressName)
    searchLocation.setValue("searchKeyword", addressName)

    createPlace.setValue("administrativeCode", administrativeCode)
    createPlace.setValue("addressName", addressName)
    createPlace.setValue("latitude", coordinates.latitude)
    createPlace.setValue("longitude", coordinates.longitude)
    createPlace.setValue("location", addressName)

    if(isInitialized){
    onMove({ coordinates })
    setIsLocationUpdated(false)
    setIsLocationExpanded(false)
    }
  }

  const onSubmitLocationSearch = async (data: TypeSearchLocation) => {
    if (!data?.location) {
      setIsLocationUpdated(false)
      setIsLocationExpanded(false)
      searchLocation.setValue("location", "")
      searchLocation.setValue("searchKeyword", "")
      return
    }
    searchLocation.setValue("searchKeyword", data.location)
    setIsLocationUpdated(true)
    setIsLocationExpanded(true)
  }

  const onSubmitPlace = async (data: TypeCreatePlace) => {
    try {
      await postMyplaceDetailAsync({
        groupId: data.groupId,
        id: data.administrativeCode,
        addressName: data.addressName,
        coordinates: {
          latitude: data.latitude,
          longitude: data.longitude,
        },
        memo: data.memo.trim() || undefined,
      })
      setIsPlaceFormOpen(false)
      setSelectedGroupId(data.groupId)
      searchMyplace.setValue("page", 1)
    } catch {
      //
    }
  }

  const makeOverlayOption = (place: TypeSearchMyplaceResult["items"][number]) => {
    return {
      id: `${place.id}`,
      content: `<span>${place.addressName}</span>`,
      coordinates: {
        latitude: parseFloat(`${place.coordinates.latitude}`),
        longitude: parseFloat(`${place.coordinates.longitude}`),
      },
    }
  }

  const onSelect = (place: TypeSearchMyplaceResult["items"][number]) => {
    onMove({ coordinates: place.coordinates })
  }

  const onPaging = (page: number) => {
    searchMyplace.setValue("page", page)
  }

  const onDeletePlace = async (placeId: number) => {
    if (!confirm("이 장소를 삭제할까요?")) return
    try {
      await deleteMyplaceDetailAsync({ id: placeId })
    } catch {
      //
    }
  }

  const onDeleteGroup = async (groupId: number) => {
    if (!confirm("그룹을 삭제할까요? 그룹에 저장된 장소도 함께 삭제됩니다.")) return
    try {
      await deleteMyplaceGroupAsync({ id: groupId })
      if (selectedGroupId === groupId) {
        setSelectedGroupId(null)
      }
    } catch {
      //
    }
  }

  useEffect(() => {
    if (!isInitialized || selectedGroupId == null || isPlaceFormOpen) return
    onOverlayChanged({
      shape: "pin",
      locations: (myplaceData?.items ?? []).map(makeOverlayOption),
    })
  }, [isInitialized, selectedGroupId, isPlaceFormOpen, myplaceData?.items])

  useEffect(() => {
    if (!isLocationUpdated) return
    setIsLocationUpdated(false)
  }, [isLocationUpdated])

  const isGroupListView = selectedGroupId == null && !isGroupFormOpen
  const isPlaceListView = selectedGroupId != null && !isPlaceFormOpen && !isGroupFormOpen

  return (
    <MapMyplaceMainContainer className={`${className}`} {...restProps}>
      {isGroupListView && (
        <PanelView.Subject
          {...(isGroupLoading || (isGroupFetching && !groupData) || postMyplaceGroupStatus === "pending"
            ? { statusCode: PanelViewSubjectStatusCode.Loading, statusMessage: "로딩중", hasIcon: true }
            : isGroupError
              ? { statusCode: PanelViewSubjectStatusCode.Warning, statusMessage: "알 수 없는 오류", hasIcon: true }
              : { statusCode: PanelViewSubjectStatusCode.Success, statusMessage: "검색 완료", hasIcon: false })}
          count={groupData?.length}
          suffixEl={
            profileData ? (
              <Button type="button" variants="secondary" size="sm" onClick={onOpenGroupForm}>
                새 그룹
              </Button>
            ) : null
          }
        >
          내장소
        </PanelView.Subject>
      )}

      {isPlaceListView && (
        <PanelView.Subject
          {...(isPlaceLoading || (isPlaceFetching && !myplaceData)
            ? { statusCode: PanelViewSubjectStatusCode.Loading, statusMessage: "로딩중", hasIcon: true }
            : isPlaceError
              ? { statusCode: PanelViewSubjectStatusCode.Warning, statusMessage: "알 수 없는 오류", hasIcon: true }
              : { statusCode: PanelViewSubjectStatusCode.Success, statusMessage: "검색 완료", hasIcon: false })}
          count={myplaceData?.totalCount}
          suffixEl={
            <>
              <Button type="button" variants="secondary" size="sm" onClick={onBackToGroups}>
                뒤로
              </Button>
              <Button type="button" variants="secondary" size="sm" disabled = {isGroupFull} onClick={onOpenPlaceForm}>
                새 장소
              </Button>
            </>
          }
        >
          {selectedGroup?.name ?? "내장소"}
        </PanelView.Subject>
      )}

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

      {isGroupFormOpen ? (
        <GroupCreateForm onSubmit={createGroup.handleSubmit(onSubmitGroup)}>
          <strong className="title">그룹 추가하기</strong>
          <Input<TypeCreateGroup>
            control={createGroup.control}
            name="name"
            placeholder="그룹 이름을 입력해주세요"
            maxLength={30}
          />
          <p className="helper">{groupName.length}/30</p>
          <div className="action">
            <Button type="button" variants="secondary" size="base" onClick={onCloseGroupForm}>
              취소
            </Button>
            <Button type="submit" size="base" disabled={!isGroupNameValid || postMyplaceGroupStatus === "pending"}>
              등록
            </Button>
          </div>
        </GroupCreateForm>
      ) : isPlaceFormOpen ? (
        <PlaceCreateForm>
          <strong className="title">장소 추가하기</strong>
          <SearchLocation
            formData={searchLocation}
            formAction={{
              submit: "검색",
            }}
            formPlaceholder={{
              location: "행정동 검색",
            }}
            isUpdated={isLocationUpdated}
            handleValid={onSubmitLocationSearch}
          >
            {isLocationExpanded && Boolean(districtItems.length) && (
              <SearchLocation.Group key="search">
                {districtItems.map((data) => (
                  <button
                    key={data.administrativeCode}
                    type="button"
                    role="option"
                    className={
                        createPlace.watch("administrativeCode") === data.administrativeCode
                          ? "selected"
                          : ""
                        }
                    onClick={() => onSelectDistrict(data)}
                   >
                    {data.addressName}
                 </button>
                 ))}
              </SearchLocation.Group>
            )}
            <div id="infinite"/>
          </SearchLocation>
          <Select<TypeCreatePlace>
            control={createPlace.control}
            name="groupId"
            rules={{ required: true }}
            multiple={false}
            shape="square"
            title="그룹 선택"
            placeholder="그룹 선택"
            optionGroups={groupOptionGroups}
          />
          <textarea
            className="memo"
            placeholder="메모"
            maxLength={100}
            {...createPlace.register("memo")}
          />
          <p className="helper">{placeMemo.length}/100</p>
          <div className="action">
            <Button type="button" variants="secondary" size="base" onClick={onClosePlaceForm}>
              취소
            </Button>
            <Button
              type="button"
              size="base"
              disabled={!isPlaceFormValid || postMyplaceDetailStatus === "pending"}
              onClick={createPlace.handleSubmit(onSubmitPlace)}
            >
              등록
            </Button>
          </div>
        </PlaceCreateForm>
      ) : selectedGroupId == null ? (
        <MapMyplaceMainResult>
          {Boolean(groupData?.length) && (
            <MyplaceView.Group>
              {groupData?.map((group) => (
                <MyplaceView.Folder
                  key={group.id}
                  data={group}
                  onOpen={() => onOpenGroup(group.id)}
                  onDelete={() => onDeleteGroup(group.id)}
                />
              ))}
            </MyplaceView.Group>
          )}
        </MapMyplaceMainResult>
      ) : (
        <>
          <MapMyplaceMainResult>
            {Boolean(myplaceData?.items?.length) && (
              <MyplaceView.Group>
                {myplaceData?.items?.map((place) => (
                  <MyplaceView.Item
                    key={place.id}
                    data={place}
                    onSelect={() => onSelect(place)}
                    onDelete={() => onDeletePlace(place.id)}
                  />
                ))}
                {Boolean(myplaceData?.totalCount) && (
                  <Pagination
                    page={searchMyplace.watch("page")}
                    totalPages={Math.ceil((myplaceData?.totalCount ?? 0) / searchMyplace.watch("size"))}
                    onPaging={onPaging}
                  />
                )}
              </MyplaceView.Group>
            )}
          </MapMyplaceMainResult>
          {myplaceData && (myplaceData.totalCount ?? 0) === 0 && (
            <PanelView.Message>
              <strong>
                등록된 <em>내장소</em>가 없어요
              </strong>
              <span>내장소를 추가하여 상권분석 결과를 비교해보세요</span>
            </PanelView.Message>
          )}
          {isGroupFull && (
              <PanelView.Message>
                <strong>
                  이 그룹에는 최대 <em>100개</em>까지 저장할 수 있어요
                </strong>
                <span>다른 그룹을 만들거나 기존 장소를 정리해 주세요</span>
              </PanelView.Message>
             )}
        </>
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

const GroupCreateForm = styled.form`
  padding: 20px;
  .title {
    display: block;
    margin-bottom: 12px;
    font-weight: 500;
  }
  .helper {
    margin-top: 4px;
    text-align: right;
    font-size: ${(props) => props.theme.typo.size.sm};
    color: rgb(var(--color-neutral600));
  }
  .action {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 16px;
  }
`

const PlaceCreateForm = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  .title {
    display: block;
    margin-bottom: 4px;
    font-weight: 500;
  }
  .memo {
    width: 100%;
    min-height: 120px;
    padding: 12px;
    border: 1px solid rgb(var(--color-neutral500));
    border-radius: 6px;
    resize: vertical;
    font-size: ${(props) => props.theme.typo.size.base};
    line-height: ${(props) => props.theme.typo.leading.base};
  }
  .helper {
    margin-top: -4px;
    text-align: right;
    font-size: ${(props) => props.theme.typo.size.sm};
    color: rgb(var(--color-neutral600));
  }
  .action {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 4px;
  }
`

export default MapMyplaceMain
