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

const isTokenExpired = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    const exp = payload.exp * 1000
    // 만료 30초 전이면 미리 갱신
    return Date.now() >= exp - 30_000
  } catch {
    return true
  }
}

let reissuePromise: Promise<string | undefined> | null = null

const reissueAccessToken = async (): Promise<string | undefined> => {
  if (reissuePromise) return reissuePromise

  reissuePromise = (async () => {
    try {
      const axios = (await import("axios")).default
      const { default: Cookies } = await import("js-cookie")
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reissue`,
        {},
        { withCredentials: true },
      )
      const token = res.headers["authorization"]?.replace(/^Bearer\s+/i, "")
      if (token) {
        Cookies.set("authToken", token, { path: "/" })
        return token
      }
      return undefined
    } catch {
      return undefined
    } finally {
      reissuePromise = null
    }
  })()

  return reissuePromise
}

/** 클라이언트에서는 만료 시 /reissue 후 유효한 access 토큰을 반환 */
export const getToken = async () => {
  if (typeof window === "undefined") {
    const { cookies: serverCookies } = await import("next/headers")
    return serverCookies()?.get("authToken")?.value
  }

  const { default: clientCookies } = await import("js-cookie")
  const token = clientCookies.get("authToken")

  if (token && !isTokenExpired(token)) {
    return token
  }

  return reissueAccessToken()
}