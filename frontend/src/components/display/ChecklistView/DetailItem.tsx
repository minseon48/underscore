"use client"

import { useState, type ChangeEvent } from "react"
import styled from "styled-components"

export type TypeDetailNode = {
  id: number
  title: string
  memo: string | null
  checked: boolean
  children: TypeDetailNode[]
}

type Props = {
  node: TypeDetailNode
  depth?: number
  onToggleCheck: (id: number, checked: boolean) => void
}

const ChecklistViewDetailItem = ({ node, depth = 0, onToggleCheck }: Props) => {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = node.children.length > 0

  const childCheckedCount = node.children.filter((c) => c.checked).length
  const allChildrenChecked = hasChildren && childCheckedCount === node.children.length
  const someChildrenChecked = hasChildren && childCheckedCount > 0 && !allChildrenChecked
  const displayChecked = hasChildren ? allChildrenChecked : node.checked

  return (
    <Wrap $depth={depth}>
      <Row>
        {hasChildren ? (
          <Toggle type="button" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "▼" : "▶"}
          </Toggle>
        ) : (
          <Spacer />
        )}
        <Check
          type="checkbox"
          checked={displayChecked}
          ref={(el: HTMLInputElement | null) => {
            if (el) el.indeterminate = someChildrenChecked
          }}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onToggleCheck(node.id, e.target.checked)
          }
        />
        <Title>{node.title}</Title>
      </Row>
      {node.memo ? <MemoText>{node.memo}</MemoText> : null}
      {hasChildren &&
        expanded &&
        node.children.map((child) => (
          <ChecklistViewDetailItem
            key={child.id}
            node={child}
            depth={depth + 1}
            onToggleCheck={onToggleCheck}
          />
        ))}
    </Wrap>
  )
}

const Wrap = styled.div<{ $depth: number }>`
  width: 100%;
  margin-bottom: 12px;
  padding-left: ${({ $depth }) => $depth * 20}px;
  box-sizing: border-box;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`

const Toggle = styled.button`
  flex: none;
  width: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
`

const Spacer = styled.span`
  flex: none;
  width: 24px;
`

const Check = styled.input`
  flex: none;
  width: 16px;
  height: 16px;
  margin: 0;
  padding: 0;
  border: 1px solid rgb(var(--color-neutral500));
  background: rgb(var(--color-neutral100));
  accent-color: rgb(var(--color-primary600));
  appearance: auto;
  -webkit-appearance: checkbox;
  cursor: pointer;
`

const Title = styled.strong`
  flex: 1 1 auto;
  min-width: 0;
  text-align: left;
  font-weight: 500;
`

const MemoText = styled.p`
  margin: 6px 0 0 32px;
  color: rgb(var(--color-neutral700));
  font-size: 14px;
  line-height: 1.4;
`

export default ChecklistViewDetailItem
