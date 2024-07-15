import { ChakraProvider, Stack, Text, Flex, HStack } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import DateCountdown from 'components/DateCountdownMin'
import { useTokenInfoFromAddress } from 'hooks/useTokenInfo'
import { convertMicroDenomToDenom } from 'util/conversion'
import { getProfileInfo } from 'hooks/useProfile'
import { getReducedAddress } from 'util/conversion'

const saleType = {
  NotSale: 'NOT ON SALE',
  Auction: 'CURRENT BID',
  'Direct Sell': 'BUY NOW',
}

const backgroundColor = {
  NotSale: 'rgba(05, 06, 22, 0.2)',
  Auction: 'rgba(219, 115, 115, 0.5)',
  'Direct Sell': '#FFFFFF',
}

export function NftCard({ nft, id, type }): JSX.Element {
  const tokenInfo = useTokenInfoFromAddress(nft.ft_token_id)
  const [profile, setProfile] = useState<any>({})
  useEffect(() => {
    ;(async () => {
      const profile_info = await getProfileInfo(nft.owner)
      setProfile(profile_info)
    })()
  }, [nft])
  return (
    <NftCardDiv
      className="nft-card"
      color={backgroundColor[nft.saleType]}
      revertColor={nft.saleType === 'Direct Sell'}
    >
      <ChakraProvider>
        <ImgDiv className="nft-img-url">
          <Image src={nft.image} alt="NFT Image" />
        </ImgDiv>
        <Stack paddingTop="15px">
          <Flex justifyContent="space-between">
            <Text fontSize={24} fontWeight="700">
              {nft.name}
            </Text>
            <HStack>
              <Logo
                src={
                  profile.avatar
                    ? `${process.env.NEXT_PUBLIC_PINATA_URL + profile.avatar}`
                    : '/default.png'
                }
                alt="logo"
                size="34px"
              />
              <Text fontSize="16px">
                {profile.name || getReducedAddress(nft.owner)}
              </Text>
            </HStack>
          </Flex>
          <Flex justifyContent="space-between" paddingTop="10px">
            <Stack>
              <Text fontSize="14px">{saleType[nft.saleType]}</Text>
              {tokenInfo && (
                <Flex alignItems="center">
                  <Text fontSize="18px" fontWeight="700">
                    {convertMicroDenomToDenom(
                      nft.price,
                      tokenInfo.decimals
                    ).toFixed(2)}
                  </Text>
                  &nbsp;
                  <img
                    src={tokenInfo.logoURI}
                    alt="token"
                    width="20px"
                    height="20px"
                  />
                </Flex>
              )}
            </Stack>
            {nft.saleType === 'Auction' && (
              <Stack>
                <Text fontSize="14px">ENDS IN</Text>
                <Timetrack>
                  <DateCountdown
                    dateTo={Number(nft.ended_at) / 1000000 || Date.now()}
                    dateFrom={Number(nft.current_time) * 1000}
                    interval={0}
                    mostSignificantFigure="none"
                    numberOfFigures={3}
                  />
                </Timetrack>
              </Stack>
            )}
          </Flex>
        </Stack>
      </ChakraProvider>
    </NftCardDiv>
  )
}

const NftCardDiv = styled.div<{ color: string; revertColor: boolean }>`
  border-radius: 20px;
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09), inset 0px 7px 24px #6d6d78;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: ${({ color }) => color};
  padding: 30px;
  height: 100%;
  cursor: pointer;
  color: ${({ revertColor }) => (revertColor ? 'black' : 'white')};
`

const Timetrack = styled.div`
  .dcd-info {
    font-size: 18px;
    width: 100%;
  }
  .dcd-val {
    font-size: 18px;
  }
`

const ImgDiv = styled.div`
  width: 100%;
  padding-bottom: 100%;
  display: block;
  position: relative;
`
const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 20px;
`
const Logo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
`
