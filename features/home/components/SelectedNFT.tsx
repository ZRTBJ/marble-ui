import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { Stack, Text, HStack } from '@chakra-ui/react'
import {
  nftViewFunction,
  marketplaceViewFunction,
  NFT_CONTRACT_NAME,
} from 'util/near'
import { RoundedIconComponent } from 'components/RoundedIcon'
import { convertMicroDenomToDenom } from 'util/conversion'

const SelectedNFT = () => {
  const [showData, setShowData] = useState<any>({})
  const loadNft = useCallback(async () => {
    try {
      const [data, collection, marketData] = await Promise.all([
        nftViewFunction({
          methodName: 'nft_token',
          args: {
            token_id: `6:2`,
          },
        }),
        nftViewFunction({
          methodName: 'nft_get_series_single',
          args: {
            token_series_id: `6`,
          },
        }),
        marketplaceViewFunction({
          methodName: 'get_market_data',
          args: {
            nft_contract_id: NFT_CONTRACT_NAME,
            token_id: `6:2`,
          },
        }),
      ])
      setShowData({
        creator: collection.creator_id,
        collectionName: collection.metadata.title,
        collectionLogo:
          process.env.NEXT_PUBLIC_PINATA_URL + collection.metadata.media,
        reservePrice:
          marketData.reserve_price &&
          convertMicroDenomToDenom(marketData.reserve_price, 24),
        nftLogo: process.env.NEXT_PUBLIC_PINATA_URL + data.metadata.media,
      })
    } catch (err) {
      console.log('NFT Contract Error: ', err)
    }
  }, [])
  useEffect(() => {
    loadNft()
  }, [])
  return (
    <IntroContainer>
      <div>
        <Stack spacing={20}>
          <Title>
            {/* TILL DEATH DO US PART */}
            Till Death Do Us Part
          </Title>
          <HStack spacing={5}>
            <MiniInfoCard>
              <MiniInfoTitle>Created by</MiniInfoTitle>
              <RoundedIconComponent
                size="36px"
                address={showData.creator}
                font="16px"
              />
            </MiniInfoCard>
            <MiniInfoCard>
              <MiniInfoTitle>Collection</MiniInfoTitle>
              <Info>
                <Image src={showData.collectionLogo} />
                <Name>&nbsp;{showData.collectionName}</Name>
              </Info>
            </MiniInfoCard>
          </HStack>
          {showData.reservePrice && (
            <Stack>
              <Text fontSize="20px">Reserve</Text>
              <HStack>
                <Text fontSize="36px" fontWeight="900">
                  {showData.reservePrice} Near
                </Text>
                <Text fontSize="22px" fontWeight="600">
                  $214
                </Text>
              </HStack>
            </Stack>
          )}
          <Stack>
            <Link href="nft/6/2">
              <StyledButton>View Nft</StyledButton>
            </Link>
          </Stack>
        </Stack>
      </div>
      <NFTPicture>
        <ImgDiv>
          <Img alt="logo" src={showData.nftLogo} />
        </ImgDiv>
      </NFTPicture>
    </IntroContainer>
  )
}
const StyledButton = styled.button`
  width: 326px;
  height: 68px;
  background: white;
  border-radius: 16px;
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09),
    inset 0px 7px 8px rgba(0, 0, 0, 0.2);
  color: black;
  font-size: 18px;
  font-weight: bold;
`
const IntroContainer = styled.div`
  display: flex;
  margin-top: 50px;
  justify-content: space-between;
`
const Title = styled.div`
  font-size: 50px;
  font-weight: 700;
  @media (max-width: 1550px) {
    font-size: 40px;
  }
`
const MiniInfoCard = styled.div`
  width: 40%;
  height: 110px;
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09), inset 0px 7px 24px #6d6d78;
  border-radius: 20px;
  padding: 15px;
  border: 1px solid rgba(5, 6, 22, 0.2);
  backdrop-filter: blur(40px);
`

const MiniInfoTitle = styled.div`
  font-size: 16px;
  margin: 0 0 10px 0;
`
const Name = styled.div`
  font-size: 16px;
  font-weight: 600;
  font-family: Mulish;
`
const Image = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
`
const Info = styled.div`
  display: flex;
  align-items: center;
`
const NFTPicture = styled.div`
  width: 40%;
  border-radius: 30px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 255, 255, 0.06) 100%
  );
  box-shadow: 0px 7px 14px rgba(0, 0, 0, 0.1),
    inset 0px 14px 24px rgba(17, 20, 29, 0.4);
  padding: 37px;
`
const ImgDiv = styled.div`
  width: 100%;
  height: 100%;
  padding-bottom: 100%;
  display: block;
  position: relative;
  border-radius: 20px;
`
const Img = styled.img`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 40px;
`
export default SelectedNFT
