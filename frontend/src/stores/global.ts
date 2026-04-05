"use client"

import { atom } from "recoil"
import { ScreenSize } from "@/styles/theme/screen"

export type TypeGlobal = {
  screen: (keyof ScreenSize)[]
  navigationState: {
    isPending: boolean
    isOpened: boolean
  }
}

export const atomGlobal = atom<TypeGlobal>({
  key: "atomGlobal",
  default: {
    screen: [],
    navigationState: {
      isPending: false,
      isOpened: false,
    },
  },
  effects: [],
})
