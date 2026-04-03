"use client"

import { useCallback } from "react"
import { RecoilRoot, SetRecoilState } from "recoil"
import { TypeFlag, atomFlag } from "@/stores/flag"

export interface RecoilProviderMainProps extends React.PropsWithChildren {
  flag?: TypeFlag
}

const RecoilProviderMain = (props: RecoilProviderMainProps) => {
  const { flag, children } = props

  const initializeState = useCallback(
    ({ set }: { set: SetRecoilState }) => {
      if (flag) set(atomFlag, flag)
    },
    [flag],
  )

  return <RecoilRoot initializeState={initializeState}>{children}</RecoilRoot>
}

export default RecoilProviderMain