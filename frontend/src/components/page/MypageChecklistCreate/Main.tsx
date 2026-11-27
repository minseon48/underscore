"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import styled from "styled-components"
import MypageView from "@/components/display/MypageView"
import Button from "@/components/general/Button"
import useMutationChecklist from "@/queries/api/user/useMutationChecklist"

const MypageChecklistCreateMain = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const groupId = Number(searchParams.get("groupId") ?? 0)
  const [title, setTitle] = useState("")
  const [memo, setMemo] = useState("")
  const { postChecklistAsync, postChecklistStatus } = useMutationChecklist()

  if (!groupId) {
    return (
      <Container>
        <MypageView.Header>
          <h2>체크리스트</h2>
        </MypageView.Header>
        <p>그룹을 먼저 선택해주세요.</p>
      </Container>
    )
  }

  const onSubmit = async () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.")
      return
    }
    const created = await postChecklistAsync({
      groupId,
      title: title.trim(),
      memo: memo.trim() || undefined,
    })
    router.push(`/mypage/checklist/${created.id}`)
  }

  return (
    <Container>
      <MypageView.Header>
        <h2>체크리스트 만들기</h2>
      </MypageView.Header>
      <Field>
        <label>
          제목
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={50}
            placeholder="예: 카페 개업 준비"
          />
        </label>
        <label>
          메모
          <input
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            maxLength={500}
            placeholder="선택"
          />
        </label>
      </Field>
      <Actions>
        <Button type="button" variants="secondary" onClick={() => router.push("/mypage/checklist")}>
          취소
        </Button>
        <Button type="button" disabled={postChecklistStatus === "pending"} onClick={onSubmit}>
          만들기
        </Button>
      </Actions>
    </Container>
  )
}

const Container = styled(MypageView)``

const Field = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 16px;

  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  input {
    padding: 10px 12px;
    border: 1px solid rgb(var(--color-neutral400));
  }
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
`

export default MypageChecklistCreateMain
