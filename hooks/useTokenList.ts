import { QueryKey, useQuery } from 'react-query'
import { queryClient } from 'services/queryClient'
import { PoolInfo } from './usePoolList'

export type TokenInfo = {
  id: string
  pool_id: number
  chain_id: string
  token_address: string
  swap_address: string
  incentives_address: string
  symbol: string
  name: string
  decimals: number
  logoURI: string
  icon: string
  tags: string[]
  denom: string
  native: boolean
}

export type TokenList = {
  name: string
  logoURI: string
  keywords: Array<string>
  timestamp: string
  base_token: TokenInfo
  native_token: TokenInfo
  wrap_token: TokenInfo
  pools: Array<PoolInfo>
  tokens: Array<TokenInfo>
  tags: Record<
    string,
    {
      name: string
      description: string
    }
  >

  version: {
    major: number
    minor: number
    patch: number
  }
}

export const getCachedTokenList = () =>
  queryClient.getQueryCache().find(['@token-list'] as QueryKey)?.state?.data as
  | TokenList
  | undefined

export const useTokenList = () => {
  const { data, isLoading } = useQuery<TokenList>(
    ['@token-list'] as QueryKey,
    async () => {
      const response = await fetch(process.env.NEXT_PUBLIC_TOKEN_BLOCK_LIST_URL)
      return await response.json()
    },
    {
      onError(e) {
        console.error('Error loading token list:', e)
      },
      refetchOnMount: false,
      refetchIntervalInBackground: true,
      refetchInterval: 1000 * 60,
    }
  )

  return [data, isLoading] as const
}
