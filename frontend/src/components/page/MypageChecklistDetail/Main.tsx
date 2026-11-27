"use client"

import { useParams, useRouter } from "next/navigation"
import styled from "styled-components"
import MypageView from "@/components/display/MypageView"
import Button from "@/components/general/Button"
import useInitToken from "@/libs/hook/useInitToken"
import useSearchChecklistOverview from "@/queries/api/user/useSearchChecklistOverview"
import useMutationSection from "@/queries/api/user/useMutationSection"

const MypageChecklistDetailMain = () => {
  const params = useParams()
  const router = useRouter()
  const checklistId = Number(params?.checklistId ?? 0)
  const { tokenReady } = useInitToken()
  const { data } = useSearchChecklistOverview(checklistId, { enabled: tokenReady })
  const { postSectionAsync, postSectionStatus } = useMutationSection()

  const onAddSection = async () => {
    const title = window.prompt("추가할 영역 이름")
    if (!title?.trim()) return
    await postSectionAsync({ checklistId, title: title.trim() })
  }

  return (
    <Container>
      <MypageView.Header>
        <h2>{data?.title ?? "체크리스트"}</h2>
        <p className="group">{data?.groupName}</p>
      </MypageView.Header>

      <ProgressWrap>
        <Track>
          <Bar style={{ width: `${data?.progressPercent ?? 0}%` }} />
        </Track>
        <span>{data?.progressPercent ?? 0}%</span>
      </ProgressWrap>

      <Grid>
        {data?.sections.map((section) => (
          <Card key={section.id}>
            <button
              type="button"
              className="body"
              onClick={() => {
                const base = `/mypage/checklist/${checklistId}/sections/${section.id}`
                if (section.totalTaskCount === 0) {
                  router.push(`${base}/edit`)
                } else {
                  router.push(base)
                }
              }}
            >
              <strong>{section.title}</strong>
              <span>
                {section.checkedTaskCount}/{section.totalTaskCount} · {section.progressPercent}%
              </span>
              <MiniTrack>
                <MiniBar style={{ width: `${section.progressPercent}%` }} />
              </MiniTrack>
            </button>
            <Button
              type="button"
              size="sm"
              variants="secondary"
              onClick={() =>
                router.push(`/mypage/checklist/${checklistId}/sections/${section.id}/edit`)
              }
            >
              {section.totalTaskCount === 0 ? "항목 추가" : "항목 편집"}
            </Button>
          </Card>
        ))}
        <AddCard type="button" disabled={postSectionStatus === "pending"} onClick={onAddSection}>
          + 영역 추가
        </AddCard>
      </Grid>

      <Actions>
        <Button type="button" onClick={() => router.push("/mypage/checklist")}>
          목록
        </Button>
      </Actions>
    </Container>
  )
}

const Container = styled(MypageView)`
  .group {
    margin-top: 4px;
    color: rgb(var(--color-neutral700));
  }
`

const ProgressWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
`

const Track = styled.div`
  flex: 1;
  height: 8px;
  overflow: hidden;
  background: rgb(var(--color-neutral300));
`

const Bar = styled.div`
  height: 100%;
  background: rgb(var(--color-primary600));
  transition: width 0.2s ease;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  margin-top: 20px;
`

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border: 1px solid rgb(var(--color-neutral400));
  background: rgb(var(--color-neutral100));

  .body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0;
    text-align: left;
    border: none;
    background: transparent;
    cursor: pointer;
    color: inherit;
  }

  strong {
    font-size: 16px;
  }

  span {
    font-size: 13px;
    color: rgb(var(--color-neutral700));
  }
`

const MiniTrack = styled.div`
  height: 4px;
  overflow: hidden;
  background: rgb(var(--color-neutral300));
`

const MiniBar = styled.div`
  height: 100%;
  background: rgb(var(--color-primary600));
`

const AddCard = styled.button`
  min-height: 120px;
  border: 1px dashed rgb(var(--color-neutral500));
  background: transparent;
  cursor: pointer;
  color: rgb(var(--color-neutral700));

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
`

export default MypageChecklistDetailMain
