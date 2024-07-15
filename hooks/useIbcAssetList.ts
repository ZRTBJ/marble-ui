import { QueryKey, useQuery } from 'react-query'
import { queryClient } from 'services/queryClient'

export type IBCAssetInfo = {
  id: string
  name: string
  symbol: string
  chain_id: string
  rpc: string
  denom: string
  decimals: number
  juno_denom: string
  juno_channel: string
  token_address: string
  channel: string
  logoURI: string
}

export type IBCAssetList = {
  tokens: Array<IBCAssetInfo>
}

export const getCachedIBCAssetList = () =>
  queryClient.getQueryCache().find(['@ibc-asset-list'] as QueryKey)?.state?.data as
  | IBCAssetList
  | undefined

export const useIBCAssetList = () => {
  const { data, isLoading } = useQuery<IBCAssetList>(
    ['@ibc-asset-list'] as QueryKey,
    async () => {
      const response = await fetch(process.env.NEXT_PUBLIC_IBC_ASSETS_URL)
      return await response.json()
    },
    {
      onError(e) {
        console.error('Error loading ibc asset list:', e)
      },
      refetchOnMount: false,
      refetchIntervalInBackground: true,
      refetchInterval: 1000 * 60,
    }
  )

  return [data, isLoading] as const
}
