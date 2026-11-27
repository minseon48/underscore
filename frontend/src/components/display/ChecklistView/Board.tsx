"use client"

import styled from "styled-components"
import Icon from "@/components/general/Icon"

export interface ChecklistViewBoardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  groupName?: string
  isCreate?: boolean
  onOpen?: () => void
  onCreate?: () => void
  onDelete?: () => void
}

const ChecklistViewBoard = (props: ChecklistViewBoardProps) => {
  const {
      title,
      groupName,
      isCreate = false,
      onOpen,
      onCreate,
      onDelete,
      className = "",
      ...restProps } = props

  if (isCreate) {
    return (
      <CreateButton type="button" className={className} onClick={onCreate} {...restProps}>
        <Icon name="Plus" aria-hidden={true} />
        <span className="sr-only">체크리스트 만들기</span>
      </CreateButton>
    )
  }

  return (
    <Card className={className} {...restProps}>
      {onDelete && (
          <DeleteButton
            type="button"
            aria-label="체크리스트 삭제"
            onClick={(e) => {
                e.stopPropagation()
                onDelete()
                }}
            >
            <Icon name="Close" aria-hidden={true}/>
          </DeleteButton>
          )}
      <OpenButton type="button" onClick={onOpen}>
        <strong className="title">{title}</strong>
        {groupName && <span className="meta">{groupName}</span>}
      </OpenButton>
    </Card>
  )
}
const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 160px;
  border: 1px solid rgb(var(--color-neutral400));
  background: rgb(var(--color-neutral100));
`

const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: rgb(var(--color-neutral700));
  svg {
    width: 16px;
    height: 16px;
  }
  &:hover {
    color: rgb(var(--color-neutral900));
  }
`
const OpenButton = styled.button`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 8px;
  width: 100%;
  min-height: 160px;
  padding: 20px;
  padding-right: 36px; /* X와 제목 겹침 방지 */
  text-align: left;
  border: none;
  background: transparent;
  cursor: pointer;
  .title {
    font-size: 16px;
  }
  .meta {
    color: rgb(var(--color-neutral700));
    font-size: 13px;
  }
`



const CreateButton = styled.button`
  /* 기존 BoardButton 스타일 유지 */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 8px;
  width: 100%;
  min-height: 160px;
  padding: 20px;
  text-align: left;
  border: 1px solid rgb(var(--color-neutral400));
  background: rgb(var(--color-neutral100));
  cursor: pointer;
  svg {
    width: 24px;
    height: 24px;
    margin: auto;
  }
`

export default ChecklistViewBoard
