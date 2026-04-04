"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import styled from "styled-components"
import useSearchProfile from "@/queries/api/user/useSearchProfile"
import useMutationProfile from "@/queries/api/user/useMutationProfile"
import AuthView from "@/components/display/AuthView"
import EditUser, { TypeEditUser } from "@/components/form/EditUser"
import Button from "@/components/general/Button"

export interface AuthEditProfileMainProps extends React.HTMLAttributes<HTMLDivElement> {
  //
}

const AuthEditProfileMain = (props: AuthEditProfileMainProps) => {
  const { className = "", ...restProps } = props

  const router = useRouter()

  const { data: profileData } = useSearchProfile()

  const { postProfileAsync, postProfileStatus } = useMutationProfile()

  const editUser = useForm<TypeEditUser>({
    defaultValues: {
      name: profileData?.name,
      email: profileData?.email,
    },
  })

  const onSubmit = (data: TypeEditUser) => {
    postProfileAsync({
      name: data?.name,
      email: data.email,
    })
  }

  useEffect(() => {
    if (postProfileStatus === "success") router.replace("/mypage/profile")
  }, [postProfileStatus])

  return (
    <AuthEditProfileMainContainer className={`${className}`} {...restProps}>
      <AuthView.Header>
        <h2>회원정보 수정</h2>
        <p>회원 정보를 입력해주세요</p>
      </AuthView.Header>
      <EditUser formData={editUser} handleValid={onSubmit} />
      <AuthView.Action>
        <Button type="submit" form="edit-user" disabled={postProfileStatus === "pending"}>
          저장하기
        </Button>
      </AuthView.Action>
    </AuthEditProfileMainContainer>
  )
}

const AuthEditProfileMainContainer = styled(AuthView)`
  /*  */
`

export default AuthEditProfileMain
