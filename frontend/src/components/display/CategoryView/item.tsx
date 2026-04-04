"use client"

import { forwardRef } from "react"
import styled from "styled-components"
import { PolymorphicComponentPropWithRef, PolymorphicRef } from "@/types/polymorphic"
import { TypeSearchCategoryResult } from "@/queries/api/map/useSearchCategoryList"

export type CategoryViewItemProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  {
    data: TypeSearchCategoryResult["documents"][number]
  }
>

export type CategoryViewItemComponent = <C extends React.ElementType = "div">(
  props: CategoryViewItemProps<C>,
) => React.ReactNode

const CategoryViewItem: CategoryViewItemComponent = forwardRef(function CategoryViewItem<
  C extends React.ElementType = "div",
>(props: CategoryViewItemProps<C>, ref?: PolymorphicRef<C>): React.ReactNode {
  const { asTag, data, className = "", ...restProps } = props

  return (
    <CategoryViewItemContainer ref={ref} as={asTag ?? "div"} className={`${className}`} {...restProps}>
      <CategoryViewItemName>
        <strong className="place">{data.place_name}</strong>
        <em className="category">{data.category_group_name}</em>
      </CategoryViewItemName>
      <CategoryViewItemAddress>
        <span className="default">{data.address_name}</span>
        <span className="road">{data.road_address_name}</span>
      </CategoryViewItemAddress>
    </CategoryViewItemContainer>
  )
})

const CategoryViewItemName = styled.div`
  display: flex;
  align-items: center;
  .place {
    font-size: ${(props) => props.theme.typo.size.base};
    line-height: ${(props) => props.theme.typo.leading.base};
    font-weight: 500;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
  }
  .category {
    padding-left: 4px;
    font-size: ${(props) => props.theme.typo.size.sm};
    line-height: ${(props) => props.theme.typo.leading.sm};
    color: rgb(var(--color-neutral700));
  }
`

const CategoryViewItemAddress = styled.div`
  .default,
  .road {
    display: block;
    color: rgb(var(--color-neutral1100));
  }
  .road {
    color: rgb(var(--color-neutral700));
  }
`

const CategoryViewItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 12px 20px;
  text-align: left;
  background: rgb(var(--color-neutral100));
  &:focus {
    color: rgb(var(--color-primary600));
  }
`

export default CategoryViewItem