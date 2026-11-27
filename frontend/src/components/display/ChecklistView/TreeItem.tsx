"use client"

import { useState } from "react"
import styled from "styled-components"
import Button from "@/components/general/Button"

export type TypeTreeNode = {
  clientId: string
  title: string
  memo?: string
  children: TypeTreeNode[]
}

type Props = {
  node: TypeTreeNode
  parentId: string | null
  depth?: number
  onAddChild: (parentId: string) => void
  onDelete: (clientId: string) => void
  onChangeTitle: (clientId: string, title: string) => void
  onReorder: (parentId: string | null, fromId: string, toId: string) => void
  onChangeMemo: (clientId: string, memo: string) => void
}

/** 0=1단, 1=2단 → 최대 인덱스 1 */
const MAX_ITEM_DEPTH = 1

const ChecklistViewTreeItem = ({
  node,
  parentId,
  depth = 0,
  onAddChild,
  onDelete,
  onChangeTitle,
  onReorder,
  onChangeMemo,
}: Props) => {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = node.children.length > 0

  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", node.clientId)
    e.dataTransfer.effectAllowed = "move"
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const fromId = e.dataTransfer.getData("text/plain")
    if (!fromId || fromId === node.clientId) return
    onReorder(parentId, fromId, node.clientId)
  }

  return (
    <Wrap style={{ paddingLeft: depth * 20 }}>
      <Row onDragOver={onDragOver} onDrop={onDrop}>
        <Handle draggable onDragStart={onDragStart} title="드래그하여 순서 변경">
          ⋮⋮
        </Handle>

        {hasChildren ? (
          <Toggle type="button" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "▼" : "▶"}
          </Toggle>
        ) : (
          <ToggleSpacer />
        )}

        <input
          value={node.title}
          placeholder="항목 제목"
          onChange={(e) => onChangeTitle(node.clientId, e.target.value)}
        />
        {depth < MAX_ITEM_DEPTH && (
          <Button type="button" shape="plain" size="sm" onClick={() => onAddChild(node.clientId)}>
            하위 추가
          </Button>
        )}
        <Button type="button" shape="plain" size="sm" onClick={() => onDelete(node.clientId)}>
          삭제
        </Button>
      </Row>

      <MemoInput
        value={node.memo ?? ""}
        placeholder="메모 (선택)"
        maxLength={500}
        onChange={(e) => onChangeMemo(node.clientId, e.target.value)}
      />

      {hasChildren &&
        expanded &&
        node.children.map((child) => (
          <ChecklistViewTreeItem
            key={child.clientId}
            node={child}
            parentId={node.clientId}
            depth={depth + 1}
            onAddChild={onAddChild}
            onDelete={onDelete}
            onChangeTitle={onChangeTitle}
            onReorder={onReorder}
            onChangeMemo={onChangeMemo}
          />
        ))}
    </Wrap>
  )
}

const Wrap = styled.div``

const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
  input {
    flex: 1;
    padding: 8px 10px;
    border: 1px solid rgb(var(--color-neutral400));
  }
`

const Handle = styled.span`
  cursor: grab;
  user-select: none;
  color: rgb(var(--color-neutral600));
  padding: 0 4px;
`

const Toggle = styled.button`
  width: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
`

const ToggleSpacer = styled.span`
  width: 24px;
`

const MemoInput = styled.input`
  display: block;
  box-sizing: border-box;
  width: calc(100% - 40px);
  margin: 0 0 12px 40px;
  padding: 8px 10px;
  border: 1px solid rgb(var(--color-neutral400));
  background: rgb(var(--color-neutral100));
`

export default ChecklistViewTreeItem
