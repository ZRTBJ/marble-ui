import { ChakraProvider, Spinner, Stack, Tab, Text } from '@chakra-ui/react'
import { Button } from 'components/Button'
import { IconWrapper } from 'components/IconWrapper'
import { NftTable } from 'components/NFT'
import { Activity, Grid } from 'icons'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useDispatch, useSelector } from 'react-redux'
import { NftInfo } from 'services/nft'
import { State } from 'store/reducers'
import { NFT_COLUMN_COUNT } from 'store/types'
import styled from 'styled-components'
import { default_image, default_featured_image } from 'util/constants'
import {
  marketplaceViewFunction,
  nftViewFunction,
  NFT_CONTRACT_NAME,
} from 'util/near'
import { getCurrentWallet } from 'util/sender-wallet'
import EditCollectionModal from './components/EditCollectionModal'
import { RoundedIconComponent } from 'components/RoundedIcon'

export const CollectionTab = ({ index }) => {
  return (
    <TabWrapper>
      <Tab>
        <Button
          className={`hide tab-link ${index == 0 ? 'active' : ''}`}
          as="a"
          variant="ghost"
          iconLeft={<IconWrapper icon={<Grid />} />}
        >
          Items
        </Button>
      </Tab>
      <Tab>
        <Button
          className={`hide tab-link ${index == 1 ? 'active' : ''}`}
          as="a"
          variant="ghost"
          iconLeft={<IconWrapper icon={<Activity />} />}
        >
          Activity
        </Button>
      </Tab>
    </TabWrapper>
  )
}

interface CollectionProps {
  readonly id: string
  // readonly name: string
  // readonly collectionAddress: string
  // readonly numTokens: number
  // readonly uri: string
}

let pageCount = 10
export const Collection = ({ id }: CollectionProps) => {
  const wallet = getCurrentWallet()
  const [loading, setLoading] = useState(true)
  const [currentTokenCount, setCurrentTokenCount] = useState(0)
  const [collectionInfo, setCollectionInfo] = useState<any>({})
  const [numTokens, setNumTokens] = useState(0)
  const [isCollapse, setCollapse] = useState(false)
  const [isLargeNFT, setLargeNFT] = useState(true)
  const [filterCount, setFilterCount] = useState(0)
  const [nfts, setNfts] = useState<NftInfo[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [searchGroup, setSearchGroup] = useState('all')
  const dispatch = useDispatch()
  const uiListData = useSelector((state: State) => state.uiData)
  const { nft_column_count } = uiListData

  const filterData = useSelector((state: State) => state.filterData)
  const { filter_status } = filterData
  const [searchVal, setSearchVal] = useState('')
  const fetchCollectionInfo = useCallback(async () => {
    let result: any = {}
    let collection_info: any = {}
    try {
      collection_info = await nftViewFunction({
        methodName: 'nft_get_series_single',
        args: {
          token_series_id: id,
        },
      })
      let ipfs_collection = await fetch(
        process.env.NEXT_PUBLIC_PINATA_URL + collection_info.metadata.reference
      )
      result = await ipfs_collection.json()
    } catch (error) {
      console.log('collection_info: ', error)
    }
    result.logo = result.logo
      ? process.env.NEXT_PUBLIC_PINATA_URL + result.logo
      : default_image
    result.featuredImage = result.featuredImage
      ? process.env.NEXT_PUBLIC_PINATA_URL + result.featuredImage
      : default_featured_image
    result.creator = collection_info.creator_id
    result.name = collection_info.metadata.title
    result.symbol = collection_info.metadata.description
    result.token_series_id = collection_info.token_series_id
    setCollectionInfo(result)
    return result
  }, [id])
  const fetchTokensInfo = useCallback(async () => {
    let collectionNFTs = []
    let info = []
    let res_collection = await fetchCollectionInfo()
    try {
      info = await nftViewFunction({
        methodName: 'nft_tokens_by_series',
        args: {
          token_series_id: id,
          // from_index: '0',
          // limit: 8,
        },
      })
      setCurrentTokenCount(info.length)
    } catch (error) {
      console.log('getNFTs error: ', error)
      return []
    }

    await Promise.all(
      info.map(async (element) => {
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
          console.log('get_market_data error: ', error)
        }
        let ipfs_nft = await fetch(
          process.env.NEXT_PUBLIC_PINATA_URL + element.metadata.reference
        )

        let res_nft = await ipfs_nft.json()

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
      })
    )
    return collectionNFTs
  }, [id])
  useEffect(() => {
    ;async () => {
      if (id === undefined || id == '[name]') return false
      try {
        const num = await nftViewFunction({
          methodName: 'nft_supply_for_series',
          args: {
            token_series_id: id,
          },
        })
        setNumTokens(num)
      } catch (err) {
        console.log('nft get counts error: ', err)
      }
    }
  }, [id])
  useEffect(() => {
    ;(async () => {
      if (id === undefined || id == '[name]') return false

      const tokensInfo = await fetchTokensInfo()
      let traits = []
      for (let i = 0; i < tokensInfo.length; i++) {
        if (
          filter_status.length == 0 ||
          filter_status.indexOf(tokensInfo[i].attributes[0].value) != -1 ||
          filter_status.indexOf(tokensInfo[i].attributes[1].value) != -1 ||
          filter_status.indexOf(tokensInfo[i].attributes[2].value) != -1 ||
          filter_status.indexOf(tokensInfo[i].attributes[3].value) != -1 ||
          filter_status.indexOf(tokensInfo[i].attributes[4].value) != -1 ||
          filter_status.indexOf(tokensInfo[i].attributes[5].value) != -1 ||
          filter_status.indexOf(tokensInfo[i].attributes[7].value) != -1
        ) {
          if (searchGroup === 'all') traits.push(tokensInfo[i])
          else if (searchGroup === tokensInfo[i].saleType)
            traits.push(tokensInfo[i])
        }
      }
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
      setHasMore(currentTokenCount > numTokens)
      setLoading(false)
    })()
  }, [id, filterCount, searchVal, numTokens, searchGroup, filter_status])
  const getMoreNfts = async () => {
    // if (id === undefined || id == '[name]' || !hasMore) return false
    // let tokensInfo = []
    // let collectionNFTs = []
    // try {
    //   tokensInfo = await nftViewFunction({
    //     methodName: 'nft_tokens_by_series',
    //     args: {
    //       token_series_id: id,
    //       from_index: currentTokenCount.toString(),
    //       limit: 8,
    //     },
    //   })
    // } catch (error) {
    //   console.log('getNFTs error: ', error)
    // }
    // setCurrentTokenCount(currentTokenCount + tokensInfo.length)
    // for (let i = 0; i < tokensInfo.length; i++) {
    //   let market_data
    //   try {
    //     market_data = await marketplaceViewFunction({
    //       methodName: 'get_market_data',
    //       args: {
    //         nft_contract_id: NFT_CONTRACT_NAME,
    //         token_id: tokensInfo[i].token_id,
    //       },
    //     })
    //   } catch (error) {
    //     console.log('error: ', error)
    //   }
    //   let ipfs_nft = await fetch(
    //     process.env.NEXT_PUBLIC_PINATA_URL + tokensInfo[i].metadata.reference
    //   )
    //   let ipfs_collection = await fetch(
    //     process.env.NEXT_PUBLIC_PINATA_URL + tokensInfo[i].metadata.extra
    //   )
    //   let res_nft = await ipfs_nft.json()
    //   let res_collection = await ipfs_collection.json()
    //   console.log('collectionInfo: ', res_nft)
    //   res_nft['tokenId'] = tokensInfo[i].token_id.split(':')[1]
    //   res_nft['title'] = res_collection.name
    //   res_nft['image'] = process.env.NEXT_PUBLIC_PINATA_URL + res_nft.uri
    //   if (market_data) {
    //     res_nft['saleType'] = market_data.is_auction ? 'Auction' : 'Direct Sell'
    //     res_nft['price'] = market_data.price
    //     res_nft['started_at'] = market_data.started_at
    //     res_nft['ended_at'] = market_data.ended_at
    //   } else res_nft['saleType'] = 'NotSale'
    //   collectionNFTs.push(res_nft)
    // }
    // let traits = []
    // for (let i = 0; i < collectionNFTs.length; i++) {
    //   if (
    //     filter_status.length == 0 ||
    //     filter_status.indexOf(collectionNFTs[i].attributes[0].value) != -1 ||
    //     filter_status.indexOf(collectionNFTs[i].attributes[1].value) != -1 ||
    //     filter_status.indexOf(collectionNFTs[i].attributes[2].value) != -1 ||
    //     filter_status.indexOf(collectionNFTs[i].attributes[3].value) != -1 ||
    //     filter_status.indexOf(collectionNFTs[i].attributes[4].value) != -1 ||
    //     filter_status.indexOf(collectionNFTs[i].attributes[5].value) != -1 ||
    //     filter_status.indexOf(collectionNFTs[i].attributes[7].value) != -1
    //   ) {
    //     traits.push(collectionNFTs[i])
    //   }
    // }
    // setNfts(traits)
    // setHasMore(currentTokenCount >= numTokens)
  }

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
  return (
    <ChakraProvider>
      <CollectionWrapper>
        <Banner>
          <BannerImage src={collectionInfo.featuredImage} alt="banner" />
          <Stack spacing={5}>
            <Logo src={collectionInfo.logo} alt="logo" size="180px" />
            <Text fontSize="96px" fontWeight="900">
              {collectionInfo.name}
            </Text>
            {wallet.accountId === collectionInfo.creator && (
              <Stack width="250px">
                <EditCollectionModal collectionInfo={collectionInfo} />
              </Stack>
            )}
            <ProfileLogo>
              <RoundedIconComponent
                size="44px"
                address={collectionInfo.creator}
              />
            </ProfileLogo>
          </Stack>
        </Banner>
        <Heading>
          <Text fontSize="46px" fontWeight="700">
            NFTs
          </Text>
          {wallet.accountId === collectionInfo.creator && (
            <Link href={`/nft/${id}/create`} passHref>
              <Button
                className="btn-buy btn-default"
                css={{
                  background: '$white',
                  color: '$black',
                  stroke: '$black',
                }}
                variant="primary"
                size="large"
              >
                Mint NFT
              </Button>
            </Link>
          )}
        </Heading>
        <NftList
          className={`${isCollapse ? 'collapse-close' : 'collapse-open'}`}
        >
          {loading ? (
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                padding: '20px',
              }}
            >
              <Spinner size="xl" />
            </div>
          ) : (
            <InfiniteScroll
              dataLength={numTokens}
              next={getMoreNfts}
              hasMore={false}
              loader={<h3> Loading...</h3>}
              endMessage={<h4></h4>}
            >
              <NftTable data={nfts} id={id} type="buy" />
            </InfiniteScroll>
          )}
          {nfts.length === 0 && wallet.accountId === collectionInfo.creator && (
            <Stack
              spacing="50px"
              width="50%"
              alignItems="center"
              margin="0 auto"
            >
              <Text fontSize="30px" fontWeight="700">
                Customize Your Collection
              </Text>
              <Text fontSize="18px" fontWeight="600">
                Before you mint an NFT to your collection, customize it by
                uploading <br /> a logo, cover image and description
              </Text>
              <EditCollectionModal collectionInfo={collectionInfo} />
            </Stack>
          )}
        </NftList>
      </CollectionWrapper>
    </ChakraProvider>
  )
}

const CollectionWrapper = styled.div``
const Heading = styled.div`
  padding: 40px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #363b4e;
`
const Banner = styled.div`
  position: relative;
  height: 900px;
  width: 100%;
  display: block;
  padding: 200px 50px 50px 50px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 255, 255, 0.06) 100%
  );
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`
const BannerImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: -1;
`
const Logo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
  border: 10px solid #ffffff21;
`

const SelectOption = styled.div<{ isActive: boolean }>`
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 7px 14px 0px #0000001a, 0px 14px 24px 0px #11141d66 inset;
  border-radius: 30px;
  display: flex;
  padding: 15px;
  min-width: 170px;
  justify-content: center;
  cursor: pointer;
  color: ${({ isActive }) => (isActive ? '#FFFFFF' : 'rgba(255,255,255,0.5)')};
`

const TabWrapper = styled.div``

const NftList = styled.div`
  padding: 40px;
`
const ProfileLogo = styled.div`
  padding: 10px;
  border-radius: 60px;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  width: fit-content;
  align-items: center;
`
