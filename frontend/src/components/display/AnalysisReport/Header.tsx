"use client"

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
import { TypeSearchAnalysisReportResult } from "@/queries/api/map/useSearchAnalysisReport"

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler)

const Labels: Record<string, string> = {
    "Floating Population": "유동인구",
    Stores: "점포",
    IncomeConsumption: "지출",
    ResidentPopulation: "상주인구",
    IndexQuarterlyQuotients: "상권",
    Selling: "매출",
 }

type Props = {
    data: TypeSearchAnalysisReportResult
}

const AnalysisReportHeader = ({ data }: Props) => {
    const radarData: ChartData<"radar"> = {
        labels: data.labels.map((label) => Labels[label] ?? label),
        datasets: [
            {
              label: "개업 매력도",
              data: data.businessAttractionScores,
              backgroundColor: "rgba(22, 119, 255, 0.32)",
              borderWidth: 1,
              borderColor: "rgb(22, 119, 255)",
              },
            ],
        }

    const radarOptions: ChartOptions<"radar"> = {
        responsive: false,
        elements: { point: { radius: 0 }},
        scales: {
            r: {
                min: 0,
                max: 20,
                ticks: { display: false, stepSize: 5 },
                },
            },
        }

    return (
        <Header>
            <Info>
                <Address>{data.address}</Address>
                <Industry>{data.serviceIndustryName}</Industry>
                <Score>
                    개업 매력도 <em>{data.totalScore}</em>점
                </Score>
            </Info>
            <Radar data={radarData} options={radarOptions} width={180} height={160} />
        </Header>
        )
    }

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid rgb(var(--color-neutral500));
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`

const Address = styled.strong`
  display: block;
  font-size: ${(props) => props.theme.typo.size.base};
  line-height: ${(props) => props.theme.typo.leading.base};
  font-weight: 500;
`

const Industry = styled.span`
  display: block;
  font-size: ${(props) => props.theme.typo.size.sm};
  line-height: ${(props) => props.theme.typo.leading.sm};
  color: rgb(var(--color-neutral800));
`

const Score = styled.span`
  display: block;
  margin-top: 4px;
  font-size: ${(props) => props.theme.typo.size.sm};
  line-height: ${(props) => props.theme.typo.leading.sm};
  em {
    font-size: ${(props) => props.theme.typo.size.xl};
    line-height: ${(props) => props.theme.typo.leading.xl};
    font-weight: 500;
    color: rgb(var(--color-primary600));
  }
`

export default AnalysisReportHeader