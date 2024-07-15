import * as React from 'react'
import { useEffect } from 'react'
import { LinkBox } from '@chakra-ui/react'
import Link from 'next/link'
import { NftCard } from '../nft-card'
import { NftInfo } from 'services/nft'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { State } from 'store/reducers'

export function NftTable({ data, id, type, nft_column_count = 4 }) {
  return (
    <NftGrid columns={nft_column_count}>
      {data.map((nft, index) => (
        //<Link href="https://app.marbledao.finance/marblenauts-nft" passHref key={nft.tokenId}>
        <Link
          href={`/nft/${nft.collectionId}/${nft.tokenId}`}
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
            <NftCard nft={nft} id={id} type={type} />
          </LinkBox>
        </Link>
      ))}
    </NftGrid>
  )
}
const NftGrid = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: ${({ columns }) => `repeat(${columns},1fr)`};
  grid-row-gap: 20px;
  grid-column-gap: 20px;
  padding: 20px;
  overflow: hidden;
`
