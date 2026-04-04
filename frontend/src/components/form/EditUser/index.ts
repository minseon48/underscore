import { FieldValues } from "react-hook-form"
import EditUserMain, { EditUserMainProps } from "@/components/form/EditUser/Main"

export interface TypeEditUser extends FieldValues {
  name: string
  email: string
}

export type { EditUserMainProps }

export default Object.assign(EditUserMain, {
  //
})
