"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import styled from "styled-components"
import useMap from "@/libs/hook/useMap"
import useSearchProfile from "@/queries/api/user/useSearchProfile"
import useSearchBusinessList from "@/queries/api/map/useSearchBusinessList"
import useSearchAnalysisList, { TypeSearchAnalysisResult } from "@/queries/api/map/useSearchAnalysisList"
import useMutationMyplaceDetail from "@/queries/api/user/useMutationMyplaceDetail"
import SearchBusiness, { TypeSearchBusiness } from "@/components/form/SearchBusiness"
import PanelView, { PanelViewSubjectStatusCode } from "@/components/display/PanelView"
import AnalysisView from "@/components/display/AnalysisView"
import Alert, { AlertStatusCode } from "@/components/feedback/Alert"
import Button from "@/components/general/Button"
import Icon from "@/components/general/Icon"

export interface MapAnalysisMainProps extends React.HTMLAttributes<HTMLDivElement> {
  //
}

const MapAnalysisMain = (props: MapAnalysisMainProps) => {
  const { className = "", ...restProps } = props

  const {
    mapStructure: { isInitialized, level, bounds, businessCode },
    onOverlayChanged,
    onOverlayFocus,
    onOverlayBlur,
    onFilterChanged,
  } = useMap()

  const searchBusiness = useForm<TypeSearchBusiness>({
    defaultValues: {
      page: 1,
      business: "",
      businessCode: "",
    },
  })

  const { data: profileData } = useSearchProfile()

  const { data: businessData } = useSearchBusinessList(searchBusiness.watch("page"))

  const {
    data: analysisData,
    isLoading,
    isFetching,
    isPending,
  } = useSearchAnalysisList(1, {
    level,
    searchBounds: bounds,
    businessCode,
  })

  const { postMyplaceDetailAsync, postMyplaceDetailStatus } = useMutationMyplaceDetail()

  const makeOverlayOption = (analysis: TypeSearchAnalysisResult["businessAttractions"][number]) => {
    return {
      id: analysis.legalDistrictCode,
      content: `<strong>${analysis.administrativeDistrictName.match(/\S+$/)?.[0] ?? ""}</strong><span>${analysis.totalScore}점</span>`,
      coordinates: {
        latitude: parseFloat(`${analysis.coordinates.latitude}`),
        longitude: parseFloat(`${analysis.coordinates.longitude}`),
      },
    }
  }

  const onSubmit = (data: TypeSearchBusiness) => {
    onFilterChanged({ businessCode: data.businessCode })
  }

  // TODO
  const onReport = (analysis: TypeSearchAnalysisResult["businessAttractions"][number]) => {
    console.log("onReport", analysis)
  }

  // TODO
  const onSave = (analysis: TypeSearchAnalysisResult["businessAttractions"][number]) => {
    postMyplaceDetailAsync({
      id: analysis.legalDistrictCode,
      addressName: analysis.administrativeDistrictName,
      coordinates: analysis.coordinates,
    })
  }

  useEffect(() => {
    if (!businessData) return
    if (searchBusiness.getValues("businessCode") ?? "") return
    searchBusiness.setValue("business", businessData?.[businessCode] ?? "")
    searchBusiness.setValue("businessCode", businessCode ?? "")
  }, [businessData])

  useEffect(() => {
    if (!isInitialized) return
    onOverlayChanged({
      shape: "box",
      locations: (analysisData?.businessAttractions ?? []).map(makeOverlayOption),
    })
  }, [isInitialized, analysisData?.businessAttractions])

  return (
    <MapAnalysisMainContainer className={`${className}`} {...restProps}>
      <PanelView.Filter>
        <SearchBusiness
          formData={searchBusiness}
          formAction={{
            submit: "조회",
          }}
          formPlaceholder={{
            businessCode: "업종 선택",
          }}
          formOptionGroups={{
            businessCode: [
              {
                label: "업종 선택",
                options: Object.entries(businessData ?? {}).map(([value, text]) => ({ value, text })),
              },
            ],
          }}
          handleValid={onSubmit}
        >
          <MapAnalysisMainAlert statusCode={AlertStatusCode.Info} statusMessage="asdf" hasIcon={true}>
            지금 멤버십에 가입하면 개업 매력도 전체 그래프와 분석 리포트를 확인 할 수 있어요
            <br />
            <Link href="/mypage/profile" target="_blank" passHref={true} legacyBehavior={true}>
              <Button asTag="a" shape="plain" suffixEl={<Icon name="ArrowRight" aria-hidden={true} />}>
                회원정보 바로가기
              </Button>
            </Link>
          </MapAnalysisMainAlert>
        </SearchBusiness>
      </PanelView.Filter>
      <PanelView.Subject
        {...(!isInitialized || isLoading || isFetching
          ? { statusCode: PanelViewSubjectStatusCode.Loading, statusMessage: "로딩중", hasIcon: true }
          : isPending && !isLoading
            ? { statusCode: PanelViewSubjectStatusCode.Warning, statusMessage: "검색 범위 초과", hasIcon: true }
            : { statusCode: PanelViewSubjectStatusCode.Success, statusMessage: "검색 완료", hasIcon: false })}
        count={analysisData?.count}
      >
        개업 매력도
      </PanelView.Subject>
      <MapAnalysisMainResult>
        {analysisData && Boolean(analysisData?.businessAttractions?.length) && (
          <AnalysisView.Group>
            {analysisData?.businessAttractions?.map((analysis) => {
              const options = {
                shape: "box" as const,
                location: makeOverlayOption(analysis),
              }
              return (
                <AnalysisView.Item
                  key={analysis.legalDistrictCode}
                  labels={analysisData.labels}
                  data={analysis}
                  data-target-id={`overlay${analysis.legalDistrictCode}`}
                  tabIndex={0}
                  onMouseOver={() => onOverlayFocus(options)}
                  onMouseOut={() => onOverlayBlur(options)}
                  onReport={() => onReport(analysis)}
                  onSave={() => onSave(analysis)}
                />
              )
            })}
          </AnalysisView.Group>
        )}
      </MapAnalysisMainResult>
      {!businessCode && (
        <PanelView.Message>
          <strong>
            <em>업종</em>을 선택해주세요
          </strong>
          <span>업종별 상권분석 및 개업 매력도를 확인해보세요</span>
        </PanelView.Message>
      )}
      {!profileData && (
        <PanelView.Message>
          <strong>
            <em>로그인</em> 후 확인 가능해요
          </strong>
          <span>업종별 상권분석 및 개업 매력도를 확인해보세요</span>
          <Link href="/auth/join" target="_blank" passHref={true} legacyBehavior={true}>
            <Button asTag="a">로그인</Button>
          </Link>
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
      {(analysisData?.count ?? 0) === 0 && !!businessCode && (
        <PanelView.Message>
          <strong>
            검색된 <em>행정동</em> 정보가 없어요
          </strong>
          <span>지도 위치를 변경하여 확인해보세요</span>
        </PanelView.Message>
      )}
      {(analysisData?.count ?? 0) > 0 && (analysisData?.businessAttractions?.length ?? 0) === 0 && (
        <PanelView.Message>
          <strong>
            상권분석은 최대 <em>20개</em>까지 조회 가능해요
          </strong>
          <span>지도 위치를 변경하여 확인해보세요</span>
        </PanelView.Message>
      )}
      {analysisData?.includesUnserviceableAreas && (
        <PanelView.Message>
          <strong>상권분석이 불가능한 지역이 포함되어있어요</strong>
          <span>
            베타 서비스 기간에는 <br />
            일부 상권에서만 분석이 가능해요 <br />
            서비스 상권: 서울특별시
          </span>
        </PanelView.Message>
      )}
    </MapAnalysisMainContainer>
  )
}

const MapAnalysisMainAlert = styled(Alert)`
  margin-top: 8px;
`

const MapAnalysisMainResult = styled(AnalysisView)`
  /*  */
`

const MapAnalysisMainContainer = styled.div`
  /*  */
`

export default MapAnalysisMain
