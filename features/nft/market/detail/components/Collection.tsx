import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import {
  ChakraProvider,
  Flex,
  HStack,
  Text,
  Stack,
  Grid,
  LinkBox,
} from '@chakra-ui/react'
import { RoundedIconComponent } from 'components/RoundedIcon'
import { NftCard } from 'components/NFT/nft-card'
import {
  nftViewFunction,
  marketplaceViewFunction,
  NFT_CONTRACT_NAME,
} from 'util/near'

const CollectionInfo = ({ info }) => {
  const [nfts, setNfts] = useState([])
  const fetchTokensInfo = useCallback(async () => {
    let collectionNFTs = []
    let nftInfo = []
    try {
      if (!info.id) return []
      nftInfo = await nftViewFunction({
        methodName: 'nft_tokens_by_series',
        args: {
          token_series_id: info.id,
          from_index: '0',
          limit: 10,
        },
      })
    } catch (error) {
      console.log('getNFTs error: ', error)
      return []
    }
    await Promise.all(
      nftInfo.map(async (element) => {
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
        let ipfs_collection = await fetch(
          process.env.NEXT_PUBLIC_PINATA_URL + element.metadata.extra
        )
        let res_nft = await ipfs_nft.json()
        let res_collection = await ipfs_collection.json()
        res_nft['tokenId'] = element.token_id.split(':')[1]
        res_nft['title'] = res_collection.name
        res_nft['owner'] = element.owner_id
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
  }, [info.id])
  useEffect(() => {
    ;(async () => {
      const tokensInfo = await fetchTokensInfo()
      setNfts(tokensInfo)
    })()
  }, [info])
  return (
    <Container>
      <ChakraProvider>
        <Flex justifyContent="space-between" marginBottom="50px">
          <HStack>
            <Image src={info.image} alt="collection" size="90px" />
            <Stack>
              <Text fontSize="30px" fontWeight="700">
                {info.name}
              </Text>
              <Text fontSize="20px" fontWeight="600">
                {info.cat_ids}
              </Text>
            </Stack>
          </HStack>
          <CreatorInfo>
            <RoundedIconComponent
              size="48px"
              address={info.creator}
              font="20px"
            />
          </CreatorInfo>
        </Flex>
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
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
        </Grid>
      </ChakraProvider>
    </Container>
  )
}

const Container = styled.div`
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.06);
  border: rgba(255, 255, 255, 0.2);
  box-shadow: 0px 7px 14px 0px #0000001a;
  backdrop-filter: blur(30px);
  margin: 10px 0;
  padding: 40px;
`
const Image = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
`
const CreatorInfo = styled.div`
  background: rgba(255, 255, 255, 0.06);
  border: rgba(255, 255, 255, 0.2);
  border-radius: 60px;
  display: flex;
  padding: 10px 30px;
  align-items: center;
  height: 70px;
  justify-content: space-around;
`

export default CollectionInfo
