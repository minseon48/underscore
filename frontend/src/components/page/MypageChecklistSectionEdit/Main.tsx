"use client"

import { useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import styled from "styled-components"
import MypageView from "@/components/display/MypageView"
import ChecklistView from "@/components/display/ChecklistView"
import { TypeTreeNode } from "@/components/display/ChecklistView/TreeItem"
import Button from "@/components/general/Button"
import useInitToken from "@/libs/hook/useInitToken"
import useSearchSectionDetail from "@/queries/api/user/useSearchSectionDetail"
import useMutationSection from "@/queries/api/user/useMutationSection"
import { TypeChecklistItem } from "@/queries/api/user/checklist/type"

const toClientId = (id: number) => `id-${id}`

const buildInitialNodes = (items: TypeChecklistItem[], sectionId: number): TypeTreeNode[] => {
  const map = new Map<number, TypeTreeNode>()
  items.forEach((item) => {
    map.set(item.id, {
      clientId: toClientId(item.id),
      title: item.title,
      memo: item.memo ?? "",
      children: [],
    })
  })

  const roots: TypeTreeNode[] = []
  items.forEach((item) => {
    const node = map.get(item.id)!
    if (item.parentId === sectionId) roots.push(node)
    else {
      const parent = item.parentId != null ? map.get(item.parentId) : undefined
      parent?.children.push(node)
    }
  })
  return roots
}

const MypageChecklistSectionEditMain = () => {
  const params = useParams()
  const router = useRouter()
  const checklistId = Number(params?.checklistId ?? 0)
  const sectionId = Number(params?.sectionId ?? 0)
  const { tokenReady } = useInitToken()
  const { data, isLoading } = useSearchSectionDetail(checklistId, sectionId, {
    enabled: tokenReady,
  })
  const { putSectionItemsAsync, putSectionItemsStatus } = useMutationSection()

  const initialNodes = useMemo(
    () => buildInitialNodes(data?.items ?? [], sectionId),
    [data?.items, sectionId],
  )

  if (isLoading || !data) {
    return (
      <Container>
        <MypageView.Header>
          <h2>항목 편집</h2>
        </MypageView.Header>
        <p>불러오는 중…</p>
      </Container>
    )
  }

  return (
    <Container>
      <MypageView.Header>
        <h2>{data.section.title} 항목 편집</h2>
      </MypageView.Header>

      <ChecklistView.Composer
        key={`${sectionId}-${data.items.map((i) => i.id).join("-")}`}
        mode="section"
        initialNodes={initialNodes}
        isSubmitting={putSectionItemsStatus === "pending"}
        onSubmit={async ({ items }) => {
          await putSectionItemsAsync({ checklistId, sectionId, items })
          router.push(`/mypage/checklist/${checklistId}/sections/${sectionId}`)
        }}
      />

      <Actions>
        <Button
          type="button"
          variants="secondary"
          onClick={() =>
            router.push(`/mypage/checklist/${checklistId}/sections/${sectionId}`)
          }
        >
          취소
        </Button>
      </Actions>
    </Container>
  )
}

const Container = styled(MypageView)``

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
`

export default MypageChecklistSectionEditMain
