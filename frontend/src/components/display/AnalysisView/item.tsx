"use client"

import React, { forwardRef } from "react"
import styled from "styled-components"
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ChartData,
  ChartOptions,
} from "chart.js"
import { Radar } from "react-chartjs-2"
import { PolymorphicComponentPropWithRef, PolymorphicRef } from "@/types/polymorphic"
import { TypeSearchAnalysisResult } from "@/queries/api/map/useSearchAnalysisList"
import Button from "@/components/general/Button"
import Icon from "@/components/general/Icon"

export type AnalysisViewItemProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  {
    labels: TypeSearchAnalysisResult["labels"]
    data: TypeSearchAnalysisResult["businessAttractions"][number]
    onReport?: () => void
    onSave?: () => void
  }
>

export type AnalysisViewItemComponent = <C extends React.ElementType = "div">(
  props: AnalysisViewItemProps<C>,
) => React.ReactNode

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler)

const Labels: { [key in string]: string } = {
  ["Floating Population"]: "유동인구",
  ["Stores"]: "점포",
  ["IncomeConsumption"]: "지출",
  ["ResidentPopulation"]: "상주인구",
  ["IndexQuarterlyQuotients"]: "상권",
  ["Selling"]: "매출",
}

const AnalysisViewItem: AnalysisViewItemComponent = forwardRef(function AnalysisViewItem<
  C extends React.ElementType = "div",
>(props: AnalysisViewItemProps<C>, ref?: PolymorphicRef<C>): React.ReactNode {
  const { asTag, labels, data, className = "", onReport, onSave, ...restProps } = props

  const radarData: ChartData<"radar"> = {
    labels: labels.map((label) => Labels?.[label] ?? label),
    datasets: [
      {
        label: "개업 매력도",
        data: data.businessAttractionScores,
        backgroundColor: "rgba(22, 119, 255, 0.32)", // primary600
        borderWidth: 1,
        borderColor: "rgb(22, 119, 255)", // primary600
      },
    ],
  }

  const radarOptions: ChartOptions<"radar"> = {
    responsive: false,
    elements: {
      point: {
        radius: 0,
      },
    },
    scales: {
      r: {
        min: 0,
        max: 20,
        ticks: {
          display: false,
          stepSize: 5,
        },
        grid: {
          color: "rgb(217, 217, 217)", // neutral500
        },
        pointLabels: {
          padding: 4,
          color: "rgb(89, 89, 89)", // neutral800
          font: {
            size: 11,
          },
        },
      },
    },
  }

  return (
    <AnalysisViewItemContainer ref={ref} as={asTag ?? "div"} className={`${className}`} {...restProps}>
      <AnalysisViewItemContent>
        <strong className="place">{data?.administrativeDistrictName}</strong>
        <span className="score">
          개업 매력도 <em>{data?.totalScore}</em>점
        </span>
        <div className="helper">
          {onReport && (
            <Button
              type="button"
              shape="plain"
              prefixEl={<Icon name="LineChart" aria-hidden={true} />}
              onClick={onReport}
            >
              분석리포트 열기
            </Button>
          )}
          {onSave && (
            <Button
              type="button"
              shape="plain"
              prefixEl={<Icon name="Environment" aria-hidden={true} />}
              onClick={onSave}
            >
              내장소 추가
            </Button>
          )}
        </div>
      </AnalysisViewItemContent>
      <AnalysisViewItemRadar data={radarData} options={radarOptions} width="120" height="112" />
    </AnalysisViewItemContainer>
  )
})

const AnalysisViewItemContent = styled.div`
  flex: 1 1 0px;
  display: flex;
  flex-direction: column;
  min-width: 0px;
  .place {
    display: block;
    font-size: ${(props) => props.theme.typo.size.base};
    line-height: ${(props) => props.theme.typo.leading.base};
    font-weight: 500;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
  }
  .score {
    display: block;
    font-size: ${(props) => props.theme.typo.size.sm};
    line-height: ${(props) => props.theme.typo.leading.sm};
    color: rgb(var(--color-neutral1100));
    em {
      font-size: ${(props) => props.theme.typo.size.xl};
      line-height: ${(props) => props.theme.typo.leading.xl};
      font-weight: 500;
      color: rgb(var(--color-primary600));
    }
  }
  .helper {
    margin-top: 4px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    &:empty {
      display: none;
    }
  }
`

const AnalysisViewItemRadar = styled(Radar)`
  flex: none;
`

const AnalysisViewItemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 14px 15px 14px 20px;
  text-align: left;
  background: rgb(var(--color-neutral100));
  &:focus {
    color: rgb(var(--color-primary600));
  }
`

export default AnalysisViewItem