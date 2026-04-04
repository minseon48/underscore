"use client"

import React, { forwardRef } from "react"
import styled from "styled-components"
import { PolymorphicComponentPropWithRef, PolymorphicRef } from "@/types/polymorphic"
import { TypeSearchMyplaceResult } from "@/queries/api/user/useSearchMyplaceList"
import Button from "@/components/general/Button"
import Icon from "@/components/general/Icon"

export type MyplaceViewItemProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  {
    data: TypeSearchMyplaceResult["items"][number]
    onSelect?: () => void
    onDelete?: () => void
  }
>

export type MyplaceViewItemComponent = <C extends React.ElementType = "div">(
  props: MyplaceViewItemProps<C>,
) => React.ReactNode

const MyplaceViewItem: MyplaceViewItemComponent = forwardRef(function MyplaceViewItem<
  C extends React.ElementType = "div",
>(props: MyplaceViewItemProps<C>, ref?: PolymorphicRef<C>): React.ReactNode {
  const { asTag, data, className = "", children, onSelect, onDelete, ...restProps } = props

  return (
    <MyplaceViewItemContainer ref={ref} as={asTag ?? "div"} className={`${className}`} {...restProps}>
      <MyplaceViewItemContent>
        <strong className="place">{data.addressName}</strong>
        <div className="helper">
          {onSelect && (
            <Button
              type="button"
              shape="plain"
              prefixEl={<Icon name="Environment" aria-hidden={true} />}
              className="helper-select"
              onClick={onSelect}
            >
              지도 이동하기
            </Button>
          )}
        </div>
      </MyplaceViewItemContent>
      <MyplaceViewItemAction>
        {onDelete && (
          <Button type="button" shape="plain" variants="secondary" size="sm" onClick={onDelete}>
            삭제
          </Button>
        )}
      </MyplaceViewItemAction>
    </MyplaceViewItemContainer>
  )
})

const MyplaceViewItemContent = styled.div`
  position: relative;
  flex: 1 1 0px;
  display: flex;
  flex-direction: column;
  min-width: 0px;
  .place {
    display: block;
    font-size: ${(props) => props.theme.typo.size.base};
    line-height: ${(props) => props.theme.typo.leading.base};
    font-weight: 500;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
  }
  .helper {
    margin-top: 4px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    &:empty {
      display: none;
    }
  }
`

const MyplaceViewItemAction = styled.div`
  flex: none;
`

const MyplaceViewItemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 14px 20px;
  text-align: left;
  background: rgb(var(--color-neutral100));
  &:focus {
    color: rgb(var(--color-primary600));
  }
`

export default MyplaceViewItem