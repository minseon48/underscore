"use client"

import styled from "styled-components"
import { ReportRow } from "./sections"

type Props = {
    sectionKey: string
    title: string
    score: number
    rows: ReportRow[]
}

const AnalysisReportSection = ({ sectionKey, title, score, rows }: Props) => {
    return (
        <Section id={`report-section-${sectionKey}`}>
            <Title>
                {title}
                <em>{score}점</em>
            </Title>
            <Table>
                <tbody>
                 {rows.map((row) => (
                     <tr key={row.label}>
                        <th>{row.label}</th>
                        <td>{row.value}</td>
                     </tr>
                     ))}
                 </tbody>
               </Table>
              </Section>
        )
    }

const Section = styled.section`
  padding: 20px 0;
  & + & {
    border-top: 1px solid rgb(var(--color-neutral500));
  }
`

const Title = styled.h3`
  margin: 0 0 12px;
  font-size: ${(props) => props.theme.typo.size.base};
  line-height: ${(props) => props.theme.typo.leading.base};
  font-weight: 500;
  em {
    margin-left: 8px;
    color: rgb(var(--color-primary600));
    font-style: normal;
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    padding: 8px 0;
    font-size: ${(props) => props.theme.typo.size.sm};
    line-height: ${(props) => props.theme.typo.leading.sm};
    text-align: left;
    border-bottom: 1px solid rgb(var(--color-neutral400));
  }
  th {
    width: 40%;
    color: rgb(var(--color-neutral800));
    font-weight: 400;
  }
  td {
    color: rgb(var(--color-neutral1100));
  }
`

export default AnalysisReportSection