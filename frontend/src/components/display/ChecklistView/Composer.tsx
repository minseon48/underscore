"use client"

import { useEffect, useState } from "react"
import styled from "styled-components"
import Button from "@/components/general/Button"
import ChecklistViewTreeItem, { TypeTreeNode } from "@/components/display/ChecklistView/TreeItem"
import { TypeChecklistItemDraft } from "@/queries/api/user/checklist/type"
import { TypePostChecklistParams } from "@/queries/api/user/useMutationChecklist"

type CreateSubmitPayload = TypePostChecklistParams
type SectionSubmitPayload = { items: TypeChecklistItemDraft[] }

type Props =
  | {
      mode?: "create"
      groupId: number
      initialNodes?: TypeTreeNode[]
      isSubmitting?: boolean
      onSubmit: (payload: CreateSubmitPayload) => void
    }
  | {
      mode: "section"
      groupId?: number
      initialNodes?: TypeTreeNode[]
      isSubmitting?: boolean
      onSubmit: (payload: SectionSubmitPayload) => void
    }

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

/** 0=1단, 1=2단 → 최대 인덱스 1 */
const MAX_ITEM_DEPTH = 1

const hasUntitledParentWithChildren = (nodes: TypeTreeNode[]): boolean =>
  nodes.some((node) => {
    const titleEmpty = !node.title.trim()
    const hasChildren = node.children.length > 0
    if (titleEmpty && hasChildren) return true
    return hasUntitledParentWithChildren(node.children)
  })

const pruneEmptyLeaves = (nodes: TypeTreeNode[]): TypeTreeNode[] =>
  nodes
    .map((node) => ({
      ...node,
      children: pruneEmptyLeaves(node.children),
    }))
    .filter((node) => node.title.trim() || node.children.length > 0)

const getDepth = (
  nodes: TypeTreeNode[],
  clientId: string,
  depth = 0,
): number | null => {
  for (const n of nodes) {
    if (n.clientId === clientId) return depth
    const found = getDepth(n.children, clientId, depth + 1)
    if (found != null) return found
  }
  return null
}

const exceedsMaxDepth = (nodes: TypeTreeNode[], depth = 0): boolean =>
  nodes.some((n) => depth > MAX_ITEM_DEPTH || exceedsMaxDepth(n.children, depth + 1))

export const flattenTree = (
  nodes: TypeTreeNode[],
  parentClientId: string | null = null,
): TypeChecklistItemDraft[] =>
  nodes.flatMap((node, index) => [
    {
      clientId: node.clientId,
      parentClientId,
      title: node.title,
      memo: node.memo?.trim() || undefined,
      sortOrder: index,
    },
    ...flattenTree(node.children, node.clientId),
  ])

const updateTitle = (nodes: TypeTreeNode[], clientId: string, title: string): TypeTreeNode[] =>
  nodes.map((n) =>
    n.clientId === clientId
      ? { ...n, title }
      : { ...n, children: updateTitle(n.children, clientId, title) },
  )

const updateMemo = (nodes: TypeTreeNode[], clientId: string, memo: string): TypeTreeNode[] =>
  nodes.map((n) =>
    n.clientId === clientId
      ? { ...n, memo }
      : { ...n, children: updateMemo(n.children, clientId, memo) },
  )

const createEmptyNode = (): TypeTreeNode => ({
  clientId: createId(),
  title: "",
  memo: "",
  children: [],
})

const addChild = (nodes: TypeTreeNode[], parentId: string): TypeTreeNode[] => {
  const parentDepth = getDepth(nodes, parentId)
  if (parentDepth == null || parentDepth >= MAX_ITEM_DEPTH) {
    return nodes
  }

  return nodes.map((n) =>
    n.clientId === parentId
      ? {
          ...n,
          children: [...n.children, createEmptyNode()],
        }
      : { ...n, children: addChild(n.children, parentId) },
  )
}

const removeNode = (nodes: TypeTreeNode[], clientId: string): TypeTreeNode[] =>
  nodes
    .filter((n) => n.clientId !== clientId)
    .map((n) => ({ ...n, children: removeNode(n.children, clientId) }))

const reorderSiblings = (
  nodes: TypeTreeNode[],
  parentId: string | null,
  fromId: string,
  toId: string,
): TypeTreeNode[] => {
  if (parentId == null) {
    const fromIndex = nodes.findIndex((n) => n.clientId === fromId)
    const toIndex = nodes.findIndex((n) => n.clientId === toId)
    if (fromIndex < 0 || toIndex < 0) return nodes

    const next = [...nodes]
    const [moved] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, moved)
    return next
  }

  return nodes.map((n) => {
    if (n.clientId === parentId) {
      const fromIndex = n.children.findIndex((c) => c.clientId === fromId)
      const toIndex = n.children.findIndex((c) => c.clientId === toId)
      if (fromIndex < 0 || toIndex < 0) return n

      const children = [...n.children]
      const [moved] = children.splice(fromIndex, 1)
      children.splice(toIndex, 0, moved)
      return { ...n, children }
    }
    return {
      ...n,
      children: reorderSiblings(n.children, parentId, fromId, toId),
    }
  })
}

const ChecklistViewComposer = (props: Props) => {
  const mode = props.mode ?? "create"
  const { initialNodes, isSubmitting, onSubmit } = props
  const groupId = mode === "create" ? props.groupId : undefined

  const [title, setTitle] = useState("")
  const [memo, setMemo] = useState("")
  const [tree, setTree] = useState<TypeTreeNode[]>(initialNodes ?? [])
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (initialized) return
    if (initialNodes && initialNodes.length > 0) {
      setTree(initialNodes)
      setInitialized(true)
    }
  }, [initialNodes, initialized])

  const onReset = () => {
    if (mode === "create") {
      setTitle("")
      setMemo("")
    }
    setTree([])
  }

  const onRegister = () => {
    if (mode === "create" && !title.trim()) {
      alert("제목을 입력해주세요.")
      return
    }
    if (hasUntitledParentWithChildren(tree)) {
      alert("하위 항목이 있는 항목은 제목을 입력해주세요.")
      return
    }

    const cleaned = pruneEmptyLeaves(tree)
    if (exceedsMaxDepth(cleaned)) {
      alert("항목은 최대 2단계까지만 구성할 수 있습니다.")
      return
    }

    const items = flattenTree(cleaned)

    if (mode === "section") {
      ;(onSubmit as (payload: SectionSubmitPayload) => void)({ items })
      return
    }

    ;(onSubmit as (payload: CreateSubmitPayload) => void)({
      groupId: groupId!,
      title: title.trim(),
      memo: memo.trim() || undefined,
    })
  }

  return (
    <Wrap>
      {mode === "create" && (
        <FieldRow>
          <label>
            제목
            <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={50} />
          </label>
          <label>
            메모
            <input value={memo} onChange={(e) => setMemo(e.target.value)} maxLength={500} />
          </label>
        </FieldRow>
      )}

      <Section>
        <SectionHead>
          <strong>구성</strong>
          <Button
            type="button"
            size="sm"
            onClick={() => setTree((prev) => [...prev, createEmptyNode()])}
          >
            추가
          </Button>
        </SectionHead>

        {tree.map((node) => (
          <ChecklistViewTreeItem
            key={node.clientId}
            node={node}
            parentId={null}
            onAddChild={(parentId) => setTree((prev) => addChild(prev, parentId))}
            onDelete={(id) => setTree((prev) => removeNode(prev, id))}
            onChangeTitle={(id, value) => setTree((prev) => updateTitle(prev, id, value))}
            onChangeMemo={(id, value) => setTree((prev) => updateMemo(prev, id, value))}
            onReorder={(parentId, fromId, toId) =>
              setTree((prev) => reorderSiblings(prev, parentId, fromId, toId))
            }
          />
        ))}
      </Section>

      <Actions>
        <Button type="button" variants="secondary" onClick={onReset}>
          초기화
        </Button>
        <Button type="button" disabled={isSubmitting} onClick={onRegister}>
          저장
        </Button>
      </Actions>
    </Wrap>
  )
}

const Wrap = styled.div``
const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
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
const Section = styled.div`
  margin-top: 20px;
  padding: 16px;
  border: 1px solid rgb(var(--color-neutral400));
`
const SectionHead = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`
const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
`

export default ChecklistViewComposer
