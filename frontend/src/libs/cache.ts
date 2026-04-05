import { TypeCacheKey, TypeCacheKeyHelper } from "@/types/cache"

export const getCacheKey = <T extends TypeCacheKey>(keyConfig: T, prefix: string[] = []): TypeCacheKeyHelper<T> => {
  const keyFn = (name: string) => prefix.concat([name])
  const toolObj = {} as TypeCacheKey
  for (const k of Object.keys(keyConfig)) {
    const v = keyConfig[k]
    if (typeof v === "function") {
      toolObj[k] = {
        toKeyWithArgs: (...args: unknown[]) => [...keyFn(k), ...v(...args)],
        toKey: () => keyFn(k),
      }
    } else if (v instanceof Object) {
      toolObj[k] = { toKey: () => keyFn(k), ...getCacheKey(v as TypeCacheKey, keyFn(k)) }
    } else {
      toolObj[k] = {
        toKey: () => keyFn(k),
      }
    }
  }
  return toolObj as TypeCacheKeyHelper<T>
}

export const getToken = async () => {
  if (typeof window === "undefined") {
    const { cookies: serverCookies } = await import("next/headers")
    return serverCookies()?.get("authToken")?.value
  } else {
    const { default: clientCookies } = await import("js-cookie")
    return clientCookies.get("authToken")
  }
}