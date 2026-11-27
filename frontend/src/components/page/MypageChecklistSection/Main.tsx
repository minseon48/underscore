"use client"

import { useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import styled from "styled-components"
import MypageView from "@/components/display/MypageView"
import ChecklistView from "@/components/display/ChecklistView"
import Button from "@/components/general/Button"
import useInitToken from "@/libs/hook/useInitToken"
import useSearchSectionDetail from "@/queries/api/user/useSearchSectionDetail"
import useMutationChecklistItem from "@/queries/api/user/useMutationChecklistItem"
import { TypeChecklistItem } from "@/queries/api/user/checklist/type"

type Node = {
  id: number
  title: string
  memo: string | null
  checked: boolean
  children: Node[]
}

const buildTree = (items: TypeChecklistItem[], sectionId: number): Node[] => {
  const map = new Map<number, Node>()
  items.forEach((item) => {
    map.set(item.id, {
      id: item.id,
      title: item.title,
      memo: item.memo,
      checked: item.checked,
      children: [],
    })
  })

  const roots: Node[] = []
  items.forEach((item) => {
    const node = map.get(item.id)!
    if (item.parentId === sectionId) roots.push(node)
    else map.get(item.parentId!)?.children.push(node)
  })
  return roots
}

const collectDescendantIds = (node: Node): number[] =>
  node.children.flatMap((c) => [c.id, ...collectDescendantIds(c)])

const findNode = (nodes: Node[], id: number): Node | null => {
  for (const n of nodes) {
    if (n.id === id) return n
    const found = findNode(n.children, id)
    if (found) return found
  }
  return null
}

const MypageChecklistSectionMain = () => {
  const params = useParams()
  const router = useRouter()
  const checklistId = Number(params?.checklistId ?? 0)
  const sectionId = Number(params?.sectionId ?? 0)
  const { tokenReady } = useInitToken()
  const { data } = useSearchSectionDetail(checklistId, sectionId, { enabled: tokenReady })
  const { patchChecklistItemAsync } = useMutationChecklistItem()

  const tree = useMemo(
    () => buildTree(data?.items ?? [], sectionId),
    [data?.items, sectionId],
  )

  const onToggleCheck = async (id: number, checked: boolean) => {
    const node = findNode(tree, id)
    if (!node) return

    // 상위면 자신+자손 전부, 리프면 자신만
    const ids =
      node.children.length > 0 ? [id, ...collectDescendantIds(node)] : [id]

    await Promise.all(
      ids.map((itemId) => patchChecklistItemAsync({ checklistId, itemId, checked })),
    )
  }

  return (
    <Container>
      <MypageView.Header>
        <h2>{data?.section.title ?? "영역"}</h2>
        <p className="meta">
          {data?.section.checkedTaskCount ?? 0}/{data?.section.totalTaskCount ?? 0} ·{" "}
          {data?.section.progressPercent ?? 0}%
        </p>
      </MypageView.Header>

      <ProgressWrap>
        <Track>
          <Bar style={{ width: `${data?.section.progressPercent ?? 0}%` }} />
        </Track>
      </ProgressWrap>

      <Tree>
        {tree.length === 0 ? (
          <Empty>아직 항목이 없습니다. 항목 편집에서 추가해주세요.</Empty>
        ) : (
          tree.map((node) => (
            <ChecklistView.DetailItem
              key={node.id}
              node={node}
              onToggleCheck={onToggleCheck}
            />
          ))
        )}
      </Tree>

      <Actions>
        <Button
          type="button"
          variants="secondary"
          onClick={() =>
            router.push(`/mypage/checklist/${checklistId}/sections/${sectionId}/edit`)
          }
        >
          항목 편집
        </Button>
        <Button type="button" onClick={() => router.push(`/mypage/checklist/${checklistId}`)}>
          카드 목록
        </Button>
      </Actions>
    </Container>
  )
}

const Container = styled(MypageView)`
  .meta {
    margin-top: 4px;
    color: rgb(var(--color-neutral700));
  }
`

const ProgressWrap = styled.div`
  margin-top: 16px;
`

const Track = styled.div`
  height: 8px;
  overflow: hidden;
  background: rgb(var(--color-neutral300));
`

const Bar = styled.div`
  height: 100%;
  background: rgb(var(--color-primary600));
  transition: width 0.2s ease;
`

const Tree = styled.div`
  margin-top: 20px;
`

const Empty = styled.p`
  color: rgb(var(--color-neutral700));
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
`

export default MypageChecklistSectionMain
