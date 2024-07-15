import { useQuery, QueryKey } from 'react-query'
import { queryClient } from 'services/queryClient'
import { TokenInfo } from './useTokenList'

export type PoolInfo = {
  id: string
  pool_id: number
  token_id: string
  token_address: string[]
  symbol: string
  name: string
  decimals: number
  logoURI: string
  tags: string[]
  denom: string
  native: boolean
  fee: number
}

export type TokenList = {
  name: string
  logoURI: string
  keywords: Array<string>
  timestamp: string
  base_token: TokenInfo
  native_token: TokenInfo
  tokens: Array<TokenInfo>
  pools: Array<PoolInfo>
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

export const usePoolList = () => {
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

  return [data?.pools || [], isLoading] as const
}
