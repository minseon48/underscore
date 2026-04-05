type Cast<X, Y> = X extends Y ? X : Y

type Fn = (...args: any[]) => any[]

export type TypeCacheKey = {
  [k: string]: TypeCacheKey | Fn | unknown
}

export type TypeCacheKeyHelper<T extends TypeCacheKey, P extends string[] = []> = {
  [k in keyof T]: T[k] extends (...args: any[]) => any[]
    ? {
        toKey: () => [...P, k]
        toKeyWithArgs: (...args: Parameters<T[k]>) => [...P, k, ...ReturnType<T[k]>]
      }
    : T[k] extends TypeCacheKey
      ? { toKey: () => [...P, k] } & TypeCacheKeyHelper<Cast<T[k], TypeCacheKey>, Cast<[...P, k], string[]>>
      : { toKey: () => [...P, k] }
}

export type TypeFetchList<T, P, K extends TypeCacheKey = Record<string, never>> = (page: P, filter: K) => Promise<T>
