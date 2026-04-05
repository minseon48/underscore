"use client"

import { AtomEffect, atom } from "recoil"

export type TypeFlag = boolean

const localStorageEffect: <T>(key: string) => AtomEffect<T> =
  (key: string) =>
  ({ setSelf, onSet }) => {
    if (typeof window === "undefined") return
    const stored = localStorage.getItem(key)
    if (stored && Boolean(stored)) setSelf(JSON.parse(stored))
    onSet((value, _value, isReset) => {
      if (isReset) return localStorage.removeItem(key)
      localStorage.setItem(key, JSON.stringify(value ?? _value))
    })
  }

export const atomFlag = atom<TypeFlag>({
  key: "atomFlag",
  default: false,
  effects: [localStorageEffect<TypeFlag>("Underscore_atomFlag")],
})
