"use client"

import { useEffect } from "react"
import styled from "styled-components"
import { useForm } from "react-hook-form"
import useMap from "@/libs/hook/useMap"
import { isEquals } from "@/libs/utils"
import useSearchCategoryList, { TypeSearchCategoryResult } from "@/queries/api/map/useSearchCategoryList"
import { CategoryOptionGroups } from "@/components/form/SearchCategory/type"
import SearchCategory, { TypeSearchCategory } from "@/components/form/SearchCategory"
import PanelView, { PanelViewSubjectStatusCode } from "@/components/display/PanelView"
import CategoryView from "@/components/display/CategoryView"
import Pagination from "@/components/navigation/Pagination"
import Button from "@/components/general/Button"
import Icon from "@/components/general/Icon"

export interface MapCategoryMainProps extends React.HTMLAttributes<HTMLDivElement> {
  //
}

const MapCategoryMain = (props: MapCategoryMainProps) => {
  const { className = "", ...restProps } = props

  const {
    mapStructure: { isInitialized, level, bounds, categoryCode },
    onOverlayChanged,
    onOverlayFocus,
    onOverlayBlur,
    onFilterChanged,
  } = useMap()

  const searchCategory = useForm<TypeSearchCategory>({
    defaultValues: {
      page: 1,
      size: 10,
      category:
        CategoryOptionGroups?.flatMap(({ options }) => options)?.find(({ value }) => categoryCode === value)?.text ??
        "",
      categoryCode,
      searchBounds: [0, 0, 0, 0],
    },
  })

  const {
    data: locationData,
    isLoading,
    isFetching,
    isPending,
  } = useSearchCategoryList(searchCategory.watch("page"), {
    level,
    categoryCode: searchCategory.watch("categoryCode"),
    searchBounds: searchCategory.watch("searchBounds"),
    size: searchCategory.watch("size"),
  })

  const makeOverlayOption = (location: TypeSearchCategoryResult["documents"][number]) => {
    return {
      id: location.id,
      content: `<span>${location.place_name}</span>`,
      coordinates: { latitude: parseFloat(`${location.y}`), longitude: parseFloat(`${location.x}`) },
    }
  }

  const onPaging = (page: number) => {
    searchCategory.setValue("page", page)
  }

  const onReload = () => {
    searchCategory.setValue("page", 1)
    searchCategory.setValue("searchBounds", bounds)
  }

  const onSubmit = (data: TypeSearchCategory) => {
    searchCategory.setValue("page", 1)
    onFilterChanged({ categoryCode: data.categoryCode })
  }

  useEffect(() => {
    if (!isInitialized) return
    onOverlayChanged({
      shape: "pin",
      locations: (locationData?.documents ?? []).map(makeOverlayOption),
    })
  }, [isInitialized, locationData?.documents])

  useEffect(() => {
    if (!isInitialized) return
    searchCategory.setValue("searchBounds", bounds)
  }, [isInitialized])

  return (
    <MapCategoryMainContainer className={`${className}`} {...restProps}>
      <PanelView.Filter>
        <SearchCategory
          formData={searchCategory}
          formAction={{
            submit: "조회",
          }}
          formPlaceholder={{
            categoryCode: "카테고리 선택",
          }}
          formOptionGroups={{
            categoryCode: CategoryOptionGroups,
          }}
          handleValid={onSubmit}
        />
      </PanelView.Filter>
      <PanelView.Subject
        {...(!isInitialized || isLoading || isFetching
          ? { statusCode: PanelViewSubjectStatusCode.Loading, statusMessage: "로딩중", hasIcon: true }
          : isPending && !isLoading
            ? { statusCode: PanelViewSubjectStatusCode.Warning, statusMessage: "검색 범위 초과", hasIcon: true }
            : { statusCode: PanelViewSubjectStatusCode.Success, statusMessage: "검색 완료", hasIcon: false })}
        count={locationData?.meta?.total_count}
        suffixEl={
          !(isPending && !isLoading) &&
          !isEquals([0, 0, 0, 0], searchCategory.watch("searchBounds")) &&
          !isEquals(bounds, searchCategory.watch("searchBounds")) && (
            <Button
              type="button"
              size="sm"
              variants="secondary"
              prefixEl={<Icon name="Reload" aria-hidden={true} />}
              onClick={onReload}
            >
              현재 지도에서 재검색
            </Button>
          )
        }
      >
        장소
      </PanelView.Subject>
      <MapCategoryMainResult>
        {locationData && Boolean(locationData?.documents?.length) && (
          <CategoryView.Group>
            {locationData?.documents?.map((location) => {
              const options = {
                shape: "pin" as const,
                location: makeOverlayOption(location),
              }
              return (
                <CategoryView.Item
                  key={location.id}
                  data={location}
                  data-target-id={`overlay${location.id}`}
                  tabIndex={0}
                  onMouseOver={() => onOverlayFocus(options)}
                  onMouseOut={() => onOverlayBlur(options)}
                />
              )
            })}
          </CategoryView.Group>
        )}
        {locationData && Boolean(locationData?.meta?.pageable_count) && (
          <Pagination
            page={searchCategory.watch("page")}
            totalPages={Math.ceil(locationData.meta.pageable_count / searchCategory.watch("size"))}
            onPaging={onPaging}
          />
        )}
      </MapCategoryMainResult>
      {locationData?.meta && locationData?.meta?.total_count === 0 && (
        <PanelView.Message>
          <strong>
            검색된 <em>{searchCategory.watch("category")}</em> 정보가 없어요
          </strong>
          <span>지도 위치를 변경하여 주변정보를 확인해보세요</span>
        </PanelView.Message>
      )}
      {locationData?.meta && (locationData?.meta?.total_count ?? 0) > (locationData?.meta?.pageable_count ?? 0) && (
        <PanelView.Message>
          <strong>
            장소는 최대 <em>{locationData.meta.pageable_count}개</em>까지 조회 가능해요
          </strong>
          <span>자세한 정보는 카카오 지도에서 확인해주세요</span>
        </PanelView.Message>
      )}
      {![1, 2, 3].includes(level) && (
        <PanelView.Message>
          <strong>
            검색 범위가 <em>초과</em>되었어요
          </strong>
          <span>지도를 확대하여 확인해보세요</span>
        </PanelView.Message>
      )}
    </MapCategoryMainContainer>
  )
}

const MapCategoryMainResult = styled(CategoryView)`
  nav {
    padding: 16px 0;
    background: rgb(var(--color-neutral100));
    border-top: 1px solid rgb(var(--color-neutral400));
  }
`

const MapCategoryMainContainer = styled.div`
  /*  */
`

export default MapCategoryMain
