"use client"

import styled from "styled-components"
import { TypeSearchMyplaceGroupResult } from "@/queries/api/user/useSearchMyplaceGroupList"
import Button from "@/components/general/Button"
import Icon from "@/components/general/Icon"

export interface MyplaceViewFolderProps extends React.HTMLAttributes<HTMLDivElement> {
    data: TypeSearchMyplaceGroupResult[number]
    onOpen?: () => void
    onEdit?: () => void
    onDelete?: () => void
    }

const MyplaceViewFolder = (props: MyplaceViewFolderProps) => {
    const { data, onOpen, onEdit, onDelete, className = "", ...restProps } = props

    return(
        <MyplaceViewFolderContainer className={`${className}`} {...restProps}>
          <button type="button" className="folder" onClick={onOpen}>
            <Icon name="Folder" aria-hidden={true}/>
            <strong className="name">{data.name}</strong>
            <span className="count">
              {data.placeCount}/{data.maxCount}
            </span>
          </button>
          <div className="action">
            {onEdit && !data.isDefault && (
                <Button type="button" shape="plain" variants="secondary" size="sm" onClick={onEdit}>
                  수정
                </Button>
                )}
            {onDelete && (
                <Button type="button" shape="plain" variants="secondary" size="sm" onClick={onDelete}>
                  삭제
                </Button>
                )}
            </div>
           </MyplaceViewFolderContainer>
        )
    }

const MyplaceViewFolderContainer = styled.div`
   display: flex;
     align-items: center;
     gap: 4px;
     width: 100%;
     padding: 14px 20px;
     background: rgb(var(--color-neutral100));
     .folder {
       flex: 1 1 0px;
       display: flex;
       align-items: center;
       gap: 8px;
       min-width: 0px;
       text-align: left;
       svg {
         flex: none;
         width: 20px;
         height: 20px;
       }
     }
     .name {
       overflow: hidden;
       white-space: nowrap;
       text-overflow: ellipsis;
       font-size: ${(props) => props.theme.typo.size.base};
       line-height: ${(props) => props.theme.typo.leading.base};
       font-weight: 500;
     }
     .count {
       flex: none;
       font-size: ${(props) => props.theme.typo.size.sm};
       color: rgb(var(--color-neutral600));
     }
     .action {
       flex: none;
       display: flex;
       gap: 8px;
     }
   `

 export default MyplaceViewFolder