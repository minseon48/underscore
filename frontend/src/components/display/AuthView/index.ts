import AuthViewMain, { AuthViewMainProps } from "@/components/display/AuthView/Main"
import AuthViewHeader, { AuthViewHeaderProps } from "@/components/display/AuthView/Header"
import AuthViewAction, { AuthViewActionProps } from "@/components/display/AuthView/Action"

export type { AuthViewMainProps, AuthViewHeaderProps, AuthViewActionProps }

export default Object.assign(AuthViewMain, {
  Header: AuthViewHeader,
  Action: AuthViewAction,
})
