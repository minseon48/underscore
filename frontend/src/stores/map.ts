"use client"

import { atom } from "recoil"
import { TypeCategoryCode } from "@/queries/api/map"

export type TypeMap = {
  mode: "Advanced" | "Simplified"
  level: number
  center: [number, number]
  bounds: [number, number, number, number]
  categoryCode: TypeCategoryCode
  businessCode: string
  isInitialized: boolean
}

export const atomMap = atom<TypeMap>({
  key: "atomMap",
  default: {
    mode: "Simplified",
    level: 3,
    center: [0, 0],
    bounds: [0, 0, 0, 0],
    categoryCode: TypeCategoryCode["FD6"],
    businessCode: "",
    isInitialized: false,
  },
  effects: [],
})