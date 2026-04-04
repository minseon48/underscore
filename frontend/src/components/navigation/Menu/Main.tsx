"use client"

import { useState } from "react"
import styled from "styled-components"
import { isEquals } from "@/libs/utils"
import MenuItem, { MenuItemProps } from "@/components/navigation/Menu/Item"
import MenuGroup from "@/components/navigation/Menu/Group"

export interface MenuMainProps extends React.HTMLAttributes<HTMLDivElement> {
  items: MenuItemProps["origin"][]
  defaultOpenKeys?: MenuItemProps["origin"]["key"][]
  defaultSelectedKeys?: MenuItemProps["origin"]["key"][]
  onNavigated?: () => void
}

interface TypeStructure {
  openKeys: MenuItemProps["origin"]["key"][]
  selectedKeys: MenuItemProps["origin"]["key"][]
}

const MenuMain = (props: MenuMainProps) => {
  const {
    items = [],
    defaultOpenKeys = [],
    defaultSelectedKeys = [],
    className = "",
    onNavigated,
    ...restProps
  } = props

  const [structure, setStructure] = useState<TypeStructure>({
    openKeys: defaultOpenKeys,
    selectedKeys: defaultSelectedKeys,
  })

  const findPath = (
    items: MenuItemProps["origin"][],
    targetItem: MenuItemProps["origin"],
    currentPath: MenuItemProps["origin"][] = [],
  ): MenuItemProps["origin"][] | null => {
    for (const item of items) {
      const newPath = [...currentPath, item]
      if (item.key === targetItem.key) return newPath
      if (item.items && item.items.length > 0) {
        const foundPath = findPath(item.items, targetItem, newPath)
        if (foundPath) return foundPath
      }
    }
    return null
  }

  const findParent = (
    items: MenuItemProps["origin"][],
    targetItems: MenuItemProps["origin"][],
  ): MenuItemProps["origin"] | null => {
    for (const item of items) {
      if (isEquals(item?.items ?? [], targetItems)) return item
      if (item.items && item.items.length > 0) {
        const foundPath = findParent(item.items, targetItems)
        if (foundPath) return foundPath
      }
    }
    return null
  }

  const onOpenChange = (origin: MenuItemProps["origin"]) => {
    setStructure((prev) => {
      const currentOpened = prev.openKeys.includes(origin.key)
      const otherKeys = prev.openKeys.filter((openKey) => openKey !== origin.key)
      return {
        ...prev,
        openKeys: !currentOpened ? [...otherKeys, origin.key] : [...otherKeys],
      }
    })
  }

  const onSelectChange = (origin: MenuItemProps["origin"]) => {
    onNavigated?.()
    setStructure((prev) => {
      const foundPath = findPath(items, origin) ?? []
      const foundPathKey = foundPath.map((item) => item.key)
      return {
        ...prev,
        openKeys: foundPathKey.slice(0, foundPathKey.length - 1),
        selectedKeys: foundPathKey,
      }
    })
  }

  const render = (renderItems: MenuItemProps["origin"][], depth: number) => {
    return (
      <MenuGroup isReady={depth === 0 ? true : structure.openKeys.includes(findParent(items, renderItems)?.key ?? "")}>
        {renderItems.map((renderItem) => (
          <MenuItem
            key={renderItem.key}
            origin={renderItem}
            depth={depth}
            isOpened={structure.openKeys.includes(renderItem.key)}
            isSelected={structure.selectedKeys.includes(renderItem.key)}
            onOpenChange={onOpenChange}
            onSelectChange={onSelectChange}
          >
            {renderItem.items && renderItem.items.length > 0 && render(renderItem.items, depth + 1)}
          </MenuItem>
        ))}
      </MenuGroup>
    )
  }

  return (
    <MenuMainContainer className={`${className}`} {...restProps}>
      {render(items, 0)}
    </MenuMainContainer>
  )
}

const MenuMainContainer = styled.div`
  /*  */
`

export default MenuMain
