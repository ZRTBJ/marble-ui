import { useMemo } from 'react'
import { useTokenList, getCachedTokenList, TokenInfo } from './useTokenList'
import { PoolInfo, usePoolList } from './usePoolList'

/* token selector functions */
export const unsafelyGetBaseToken = (
  tokenList = getCachedTokenList()
): TokenInfo | undefined => tokenList?.base_token

/* token selector functions */
export const unsafelyGetNativeToken = (
  tokenList = getCachedTokenList()
): TokenInfo | undefined => tokenList?.native_token

export const unsafelyGetTokenInfo = (
  tokenSymbol: string,
  tokensList = getCachedTokenList()?.tokens
): TokenInfo | undefined => tokensList?.find((x) => x.symbol === tokenSymbol)

export const unsafelyGetTokenInfoFromAddress = (
  address: string,
  tokensList = getCachedTokenList()?.tokens
): TokenInfo | undefined => tokensList?.find((x) => x.token_address === address)

export const unsafelyGetPoolInfoByPoolId = (
  poolId: number,
  tokenList = getCachedTokenList()
): PoolInfo | undefined => {
  return tokenList?.pools.find((x) => x.pool_id === poolId)
}
/* /token selector functions */

/* hook for base token info retrieval */
export const useBaseTokenInfo = () => {
  const [tokenList] = useTokenList()
  return useMemo(() => unsafelyGetBaseToken(tokenList), [tokenList])
}

/* hook for native token info retrieval */
export const useNativeTokenInfo = () => {
  const [tokenList] = useTokenList()
  return useMemo(() => unsafelyGetNativeToken(tokenList), [tokenList])
}

/* hook for token info retrieval based on `tokenSymbol` */
export const useTokenInfo = (tokenSymbol: string) => {
  const [tokenList] = useTokenList()
  return useMemo(
    () => unsafelyGetTokenInfo(tokenSymbol, tokenList?.tokens),
    [tokenSymbol, tokenList]
  )
}
export const useTokenInfoFromAddress = (tokenAddress: string) => {
  const [tokenList] = useTokenList()
  if(tokenAddress==='near') return unsafelyGetBaseToken()
  return unsafelyGetTokenInfoFromAddress(tokenAddress, tokenList?.tokens)
}
/* hook for token info retrieval based on `poolId` */
export const useTokenInfoByPoolId = (poolId: number) => {
  const [poolList] = usePoolList()
  const pool = poolList.find(p => p.pool_id === poolId)
  const tokenA = unsafelyGetTokenInfoFromAddress(pool?.token_address[0])
  const tokenB = unsafelyGetTokenInfoFromAddress(pool?.token_address[1])
  return [tokenA, tokenB]
}
