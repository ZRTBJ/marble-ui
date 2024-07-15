import * as React from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChakraProvider, Spinner, Grid, LinkBox } from '@chakra-ui/react'
import styled from 'styled-components'
import {
  NFT_CONTRACT_NAME,
  nftViewFunction,
  marketplaceViewFunction,
} from 'util/near'
import { NftCard } from 'components/NFT/nft-card'

const Explore = () => {
  const [nfts, setNfts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNfts = async () => {
    let collectionNFTs = []
    let info = []
    try {
      info = await nftViewFunction({
        methodName: 'nft_tokens',
        args: {},
      })
    } catch (error) {
      console.log('nft_tokens Error: ', error)
      return []
    }
    await Promise.all(
      info.map(async (element) => {
        let market_data
        if (!element.metadata.extra) return
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
        let ipfs_collection = await fetch(
          process.env.NEXT_PUBLIC_PINATA_URL + element.metadata.extra
        )
        console.log('ipfs_collection: ', ipfs_collection)
        let res_nft = await ipfs_nft.json()
        let res_collection = await ipfs_collection.json()
        console.log('res_collection: ', res_collection)
        res_nft['tokenId'] = element.token_id.split(':')[1]
        res_nft['title'] = res_collection.name
        res_nft['owner'] = element.owner_id
        res_nft['image'] = process.env.NEXT_PUBLIC_PINATA_URL + res_nft.uri
        console.log('marketData: ', market_data)
        if (market_data) {
          res_nft['saleType'] = market_data.is_auction
            ? 'Auction'
            : 'Direct Sell'
          res_nft['price'] = market_data.price
          res_nft['started_at'] = market_data.started_at
          res_nft['ended_at'] = market_data.ended_at
          res_nft['current_time'] = market_data.current_time
          res_nft['ft_token_id'] = market_data.ft_token_id
          // res_nft['collectionId'] =
        } else res_nft['saleType'] = 'NotSale'
        console.log('res_nft: ', res_nft)
        collectionNFTs.push(res_nft)
      })
    )
    return collectionNFTs
  }

  useEffect(() => {
    // fetchCollections()
    ;(async () => {
      const nftList = await fetchNfts()
      setNfts(nftList)
      setLoading(false)
    })()
  }, [])

  return (
    <ExploreWrapper>
      {loading ? (
        <ChakraProvider>
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
        </ChakraProvider>
      ) : (
        <Container>
          {nfts.map((nftInfo, index) => (
            <Link
              href={`/nft/${nftInfo.collectionId}/${nftInfo.tokenId}`}
              passHref
              key={index}
            >
              <LinkBox
                as="picture"
                transition="transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) 0s"
                _hover={{
                  transform: 'scale(1.05)',
                }}
              >
                <NftCard nft={nftInfo} id="" type="" />
              </LinkBox>
            </Link>
          ))}
        </Container>
      )}
    </ExploreWrapper>
  )
}

const ExploreWrapper = styled.div``
const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  padding: 20px;
  gap: 20px;
`
export default Explore
