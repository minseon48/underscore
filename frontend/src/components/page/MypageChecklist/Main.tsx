"use client"

import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import styled from "styled-components"
import MypageView from "@/components/display/MypageView"
import ChecklistView from "@/components/display/ChecklistView"
import Select from "@/components/entry/Select"
import Button from "@/components/general/Button"
import useInitToken from "@/libs/hook/useInitToken"
import useSearchChecklistList from "@/queries/api/user/useSearchChecklistList"
import useSearchMyplaceGroupList from "@/queries/api/user/useSearchMyplaceGroupList"
import useMutationChecklist from "@/queries/api/user/useMutationChecklist"

type TypeCreateChecklist = {
  groupId: number | null
}

export interface MypageChecklistMainProps extends React.HTMLAttributes<HTMLDivElement> {}

const MypageChecklistMain = (props: MypageChecklistMainProps) => {
  const { className = "", ...restProps } = props
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()

  const { tokenReady } = useInitToken()
  const { data: checklistData } = useSearchChecklistList({ enabled: tokenReady })
  const { data: groupData } = useSearchMyplaceGroupList()

  const { deleteChecklistAsync } = useMutationChecklist()

  const onDeleteChecklist = async (id: number, title: string) => {
    const ok = window.confirm(
      `"${title}" 체크리스트를 삭제할까요?\n삭제하면 되돌릴 수 없습니다.`,
    )
    if (!ok) return
    await deleteChecklistAsync(id)
  }

  const createForm = useForm<TypeCreateChecklist>({
    defaultValues: { groupId: null },
  })

  const groupOptionGroups = useMemo(
    () => [
      {
        label: "내장소 그룹",
        options:
          groupData?.map((group) => ({
            value: group.id,
            text: `${group.name} (${group.placeCount})`,
          })) ?? [],
      },
    ],
    [groupData],
  )

  const onStartCreate = () => {
    createForm.reset({ groupId: null })
    setIsCreating(true)
  }

  const onCancelCreate = () => {
    createForm.reset({ groupId: null })
    setIsCreating(false)
  }

  const onSubmitCreate = async (values: TypeCreateChecklist) => {
    if (values.groupId == null) return
    setIsCreating(false)
    createForm.reset({ groupId: null })
    router.push(`/mypage/checklist/create?groupId=${values.groupId}`)
  }

  return (
    <Container className={className} {...restProps}>
      <MypageView.Header>
        <h2>체크리스트</h2>
      </MypageView.Header>

      <BoardGrid>
        {checklistData?.map((item) => (
          <ChecklistView.Board
            key={item.id}
            title={item.title}
            groupName={item.groupName}
            onOpen={() => router.push(`/mypage/checklist/${item.id}`)}
            onDelete={() => onDeleteChecklist(item.id, item.title)}
          />
        ))}

        <ChecklistView.Board isCreate={true} onCreate={onStartCreate} />
      </BoardGrid>

      {isCreating && (
        <CreatePanel>
          <p className="guide">개업 준비를 진행할 내장소 그룹을 선택하세요</p>
          <Select<TypeCreateChecklist>
            control={createForm.control}
            name="groupId"
            rules={{ required: true }}
            multiple={false}
            shape="square"
            title="그룹 선택"
            placeholder="그룹 선택"
            optionGroups={groupOptionGroups}
          />

          <div className="action">
            <Button type="button" variants="secondary" size="base" onClick={onCancelCreate}>
              취소
            </Button>
            <Button
              type="button"
              size="base"
              disabled={createForm.watch("groupId") == null}
              onClick={createForm.handleSubmit(onSubmitCreate)}
            >
              만들기
            </Button>
          </div>
        </CreatePanel>
      )}
    </Container>
  )
}

const Container = styled(MypageView)``

const BoardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 16px;
`

const CreatePanel = styled.div`
  margin-top: 16px;
  padding: 16px;
  border: 1px solid rgb(var(--color-neutral400));
  .guide {
    margin-bottom: 12px;
  }
  .action {
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }
`

export default MypageChecklistMain
