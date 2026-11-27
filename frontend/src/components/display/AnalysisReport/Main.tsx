"use client"

import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { TypeSearchAnalysisReportResult } from "@/queries/api/map/useSearchAnalysisReport"
import AnalysisReportHeader from "./Header"
import AnalysisReportNav from "./Nav"
import AnalysisReportSection from "./Section"
import { REPORT_SECTIONS } from "./sections"

type Props = {
    data?: TypeSearchAnalysisReportResult
    isLoading: boolean
    isError: boolean
    onClose: () => void
 }

const AnalysisReport = ({ data, isLoading, isError, onClose }: Props) => {
    const contentRef = useRef<HTMLDivElement>(null)
    const [activeKey, setActiveKey] = useState(REPORT_SECTIONS[0].key)


    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if(e.key === "Escape") onClose()
         }
        window.addEventListener("keydown", onKeyDown)
        document.body.style.overflow = "hidden"
        return () => {
            window.removeEventListener("keydown", onKeyDown)
            document.body.style.overflow = ""
          }
        }, [onClose])


    useEffect(() => {
        if(!data || !contentRef.current) return
        const root = contentRef.current

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0]
                if(!visible) return
                const key = visible.target.id.replace("report-section-", "")
                setActiveKey(key)
                },
                {root, threshold: 0.35},
            )
            REPORT_SECTIONS.forEach(({ key }) => {
                const el = root.querySelector(`#report-section-${key}`)
                if (el) observer.observe(el)
                })

            return () => observer.disconnect()
        }, [data])

    const onSelect = (key: string) => {
        document
            .getElementById(`report-section-${key}`)
            ?.scrollIntoView({ behavior: "smooth", block: "start" })
        }

    return (
        <Backdrop onClick={onClose}>
            <Panel onClick={(e) => e.stopPropagation()}>
                <CloseButton type="button" onClick={onClose}>닫기</CloseButton>

                {isLoading && <Status>리포트 로딩중...</Status>}
                {isError && <Status>리포트를 불러오지 못했어요</Status>}

                {data && (
                    <>
                        <AnalysisReportHeader data={data} />
                        {data.errorMessage && <ErrorText>{data.errorMessage}</ErrorText>}
                        <Body>
                            <AnalysisReportNav
                                sections={REPORT_SECTIONS.map(({ key, title }) => ({ key, title }))}
                                activeKey={activeKey}
                                onSelect={onSelect}
                            />
                            <Content ref={contentRef}>
                                {REPORT_SECTIONS.map((section) => (
                                    <AnalysisReportSection
                                        key={section.key}
                                        sectionKey={section.key}
                                        title={section.title}
                                        score={data.businessAttractionScores[section.scoreIndex]}
                                        rows={section.getRows(data)}
                                    />
                                    ))}
                                </Content>
                               </Body>
                              </>
                             )}
                         </Panel>
                        </Backdrop>
        )
    }

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
`

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  width: min(960px, calc(100% - 32px));
  max-height: calc(100vh - 48px);
  overflow: hidden;
  background: rgb(var(--color-neutral100));
  border-radius: 8px;
`

const CloseButton = styled.button`
  align-self: flex-end;
  margin: 12px 16px 0;
  padding: 4px 8px;
  border: 0;
  background: transparent;
  color: rgb(var(--color-neutral800));
  cursor: pointer;
`

const Status = styled.p`
  padding: 24px;
  text-align: center;
  color: rgb(var(--color-neutral800));
`

const ErrorText = styled.p`
  margin: 0;
  padding: 8px 24px;
  color: rgb(var(--color-red600));
  font-size: ${(props) => props.theme.typo.size.sm};
  line-height: ${(props) => props.theme.typo.leading.sm};
`

const Body = styled.div`
  display: flex;
  min-height: 0;
  flex: 1 1 auto;
`

const Content = styled.div`
  flex: 1 1 auto;
  min-width: 0;
  padding: 0 24px 24px;
  overflow-y: auto;
`

export default AnalysisReport