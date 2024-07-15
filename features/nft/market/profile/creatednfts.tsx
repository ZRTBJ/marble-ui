import * as React from 'react'
import { useCallback, useState, useEffect } from 'react'
import { Button } from 'components/Button'
import styled from 'styled-components'
import { IconWrapper } from 'components/IconWrapper'
import { Search, ColumnBig, ColumnSmall, Sidebar, ArrowLeft } from 'icons'
// import { CollectionFilter } from './filter'
import { NftTable } from 'components/NFT'

import { NftInfo } from 'services/nft'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  ChakraProvider,
  Tab,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  IconButton,
  Tag,
  TagLabel,
  TagCloseButton,
  Spinner,
} from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { State } from 'store/reducers'
import {
  nftFunctionCall,
  nftViewFunction,
  marketplaceViewFunction,
  NFT_CONTRACT_NAME,
} from 'util/near'
import {
  NFT_COLUMN_COUNT,
  UI_ERROR,
  PROFILE_STATUS,
  FILTER_STATUS_TXT,
} from 'store/types'
import { getCurrentWallet } from 'util/sender-wallet'

let nftCurrentIndex
const MyCreatedNFTs = ({ id }) => {
  const [loading, setLoading] = useState(true)
  const pageCount = 10
  const [nfts, setNfts] = useState<NftInfo[]>([])
  const [searchVal, setSearchVal] = useState('')
  const [hasMore, setHasMore] = useState(false)

  // const profileData = useSelector((state: State) => state.profileData)
  // const { profile_status } = profileData
  const wallet = getCurrentWallet()

  const getCreatedNFTs = async () => {
    try {
      let createdNFTs = []
      const series = await nftViewFunction({
        methodName: 'nft_get_series',
        args: {},
      })
      const createdSeries = series.filter((serie) => serie.creator_id === id)
      await Promise.all(
        createdSeries.map(async (element) => {
          try {
            const nftsInSerie = await nftViewFunction({
              methodName: 'nft_tokens_by_series',
              args: {
                token_series_id: element.token_series_id,
              },
            })
            createdNFTs = [...createdNFTs, ...nftsInSerie]
          } catch (err) {
            return []
          }
        })
      )
      return createdNFTs
    } catch (err) {
      return []
    }
  }

  const fetchCreatedNFTs = useCallback(async () => {
    let collectionNFTs = []
    const createdNFTs = await getCreatedNFTs()
    await Promise.all(
      createdNFTs.map(async (element) => {
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
    ;(async () => {
      const traits = await fetchCreatedNFTs()
      let hasMoreFlag = false
      setNfts(traits)
      setHasMore(hasMoreFlag)
      setLoading(false)
    })()
  }, [id])
  const getMoreNfts = async () => {
    return false
  }
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

export default MyCreatedNFTs
