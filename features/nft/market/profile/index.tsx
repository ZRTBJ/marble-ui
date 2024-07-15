import { ChakraProvider, Spinner } from '@chakra-ui/react'
import { NftTable } from 'components/NFT'
import styled from 'styled-components'
import { useCallback, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useDispatch, useSelector } from 'react-redux'
import { NftInfo } from 'services/nft'
import { State } from 'store/reducers'
import { NFT_COLUMN_COUNT } from 'store/types'
import {
  marketplaceViewFunction,
  nftViewFunction,
  NFT_CONTRACT_NAME,
} from 'util/near'
import { getCurrentWallet } from 'util/sender-wallet'

export const MyCollectedNFTs = ({ id }) => {
  const [loading, setLoading] = useState(true)
  const pageCount = 10
  const [isLargeNFT, setLargeNFT] = useState(true)
  const [nfts, setNfts] = useState<NftInfo[]>([])
  const [filterCount, setFilterCount] = useState(0)
  const [searchVal, setSearchVal] = useState('')
  const [hasMore, setHasMore] = useState(false)
  const dispatch = useDispatch()
  const uiListData = useSelector((state: State) => state.uiData)
  const { nft_column_count } = uiListData
  console.log('id: ', id)
  // const profileData = useSelector((state: State) => state.profileData)
  // const { profile_status } = profileData
  const wallet = getCurrentWallet()
  const fetchOwnedNFTs = useCallback(async () => {
    let ownedNFTs = []
    let collectionNFTs = []
    console.log('accountId: ', wallet.accountId)
    try {
      ownedNFTs = await nftViewFunction({
        methodName: 'nft_tokens_for_owner',
        args: {
          account_id: id,
        },
      })
      console.log('ownedNFTs: ', ownedNFTs)
    } catch (err) {
      console.log('fetchOwnedNFTs Error: ', err)
    }
    await Promise.all(
      ownedNFTs.map(async (element) => {
        let res_nft: any = {}
        let res_collection: any = {}

        let market_data
        try {
          market_data = await marketplaceViewFunction({
            methodName: 'get_market_data',
            args: {
              nft_contract_id: NFT_CONTRACT_NAME,
              token_id: element.token_id,
            },
          })
        } catch (error) {
          console.log('error: ', error)
        }
        try {
          let ipfs_nft = await fetch(
            process.env.NEXT_PUBLIC_PINATA_URL + element.metadata.reference
          )
          let ipfs_collection = await fetch(
            process.env.NEXT_PUBLIC_PINATA_URL + element.metadata.extra
          )
          res_nft = await ipfs_nft.json()
          res_collection = await ipfs_collection.json()
          res_nft['tokenId'] = element.token_id.split(':')[1]
          res_nft['title'] = res_collection.name
          res_nft['image'] = process.env.NEXT_PUBLIC_PINATA_URL + res_nft.uri
          if (market_data) {
            res_nft['saleType'] = market_data.is_auction
              ? 'Auction'
              : 'Direct Sell'
            res_nft['price'] = market_data.price
            res_nft['started_at'] = market_data.started_at
            res_nft['ended_at'] = market_data.ended_at
            res_nft['current_time'] = market_data.current_time
            res_nft['ft_token_id'] = market_data.ft_token_id
          } else res_nft['saleType'] = 'NotSale'
          collectionNFTs.push(res_nft)
        } catch (err) {
          console.log('err', err)
        }
      })
    )
    return collectionNFTs
  }, [id])
  useEffect(() => {
    if (isLargeNFT) {
      if (nft_column_count <= 4) return
      //setUIData(NFT_COLUMN_COUNT, nft_column_count - 1)
      dispatch({
        type: NFT_COLUMN_COUNT,
        payload: nft_column_count - 1,
      })
    } else {
      if (nft_column_count >= 5) return
      //setUIData(NFT_COLUMN_COUNT, nft_column_count +1)
      dispatch({
        type: NFT_COLUMN_COUNT,
        payload: nft_column_count + 1,
      })
    }
  }, [dispatch, isLargeNFT])
  useEffect(() => {
    ;(async () => {
      const traits = await fetchOwnedNFTs()

      // let traits = []
      // for (let i = 0; i < ownedNFTs.length; i++) {
      //   if (
      //     profile_status.length == 0 ||
      //     profile_status.indexOf(ownedNFTs[i].attributes[0].value) != -1 ||
      //     profile_status.indexOf(ownedNFTs[i].attributes[1].value) != -1 ||
      //     profile_status.indexOf(ownedNFTs[i].attributes[2].value) != -1 ||
      //     profile_status.indexOf(ownedNFTs[i].attributes[3].value) != -1 ||
      //     profile_status.indexOf(ownedNFTs[i].attributes[4].value) != -1 ||
      //     profile_status.indexOf(ownedNFTs[i].attributes[5].value) != -1 ||
      //     profile_status.indexOf(ownedNFTs[i].attributes[7].value) != -1
      //   ) {
      //     traits.push(ownedNFTs[i])
      //   }
      // }
      let hasMoreFlag = false
      let i = 0
      let nftIndex = 0
      let isPageEnd = false
      if (traits.length == 0) isPageEnd = true
      let nftsForCollection = []
      while (!isPageEnd) {
        if (searchVal == '' || traits[i].name.indexOf(searchVal) != -1) {
          nftsForCollection.push(traits[i])
          hasMoreFlag = true
          nftIndex++
          if (nftIndex == pageCount) {
            isPageEnd = true
          }
        }
        i++
        if (i == traits.length) {
          isPageEnd = true
        }
      }
      setNfts(nftsForCollection)
      setHasMore(hasMoreFlag)
      setLoading(false)
    })()
  }, [id])
  const getMoreNfts = async () => {}
  return (
    <CollectionWrapper>
      <NftList>
        {loading ? (
          <ChakraProvider>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <Spinner size="xl" />
            </div>
          </ChakraProvider>
        ) : (
          <InfiniteScroll
            dataLength={nfts.length}
            next={getMoreNfts}
            hasMore={false}
            loader={<h3> Loading...</h3>}
            endMessage={<h4></h4>}
          >
            <NftTable data={nfts} id="0" type="sell" nft_column_count={3} />
          </InfiniteScroll>
        )}
      </NftList>
    </CollectionWrapper>
  )
}

const CollectionWrapper = styled.div``

const NftList = styled.div``
