import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { ChakraProvider, Spinner } from '@chakra-ui/react'
import { Button } from 'components/Button'
import { styled } from 'components/theme'
// import useSWR from 'swr';
import { NFT_CONTRACT_NAME, nftViewFunction } from 'util/near'
import { CategoryTab, NftCollectionTable } from 'components/NFT'
import { NftCategory, NftCollection } from 'services/nft'

const PUBLIC_MARKETPLACE = process.env.NEXT_PUBLIC_MARKETPLACE || ''

export const Explore = () => {
  const [nftcategories, setNftCategories] = useState<NftCategory[]>([])
  const [nftcollections, setNftCollections] = useState<NftCollection[]>([])
  const [activeCategoryId, setActiveCategoryId] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchCollections = async () => {
    try {
      const data = await nftViewFunction({
        methodName: 'nft_get_series',
        args: {},
      })
      console.log('data: ', data)
      return data
    } catch (error) {
      console.log('nft_get_series Error: ', error)
      return []
    }
  }

  useEffect(() => {
    // fetchCollections()
    ;(async () => {
      let collections = []
      const collectionList = await fetchCollections()
      for (let i = 0; i < collectionList.length; i++) {
        let res_collection: any = {}
        try {
          let ipfs_collection = await fetch(
            process.env.NEXT_PUBLIC_PINATA_URL +
              collectionList[i].metadata.reference
          )
          res_collection = await ipfs_collection.json()
        } catch (err) {
          console.log('err', err)
          res_collection = -{}
        }
        let collection_info: any = {}
        collection_info.id = collectionList[i].token_series_id
        collection_info.name = collectionList[i].metadata.title
        collection_info.description = res_collection.description
        collection_info.image =
          process.env.NEXT_PUBLIC_PINATA_URL + res_collection.featuredImage
        collection_info.banner_image =
          process.env.NEXT_PUBLIC_PINATA_URL + res_collection.logo
        collection_info.slug = res_collection.slug
        collection_info.creator = collectionList[i].creator_id ?? ''
        collections.push(collection_info)
      }
      setNftCollections(collections)
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
        <NftCollectionTable
          collections={nftcollections}
          activeCategoryId={activeCategoryId}
        />
      )}
    </ExploreWrapper>
  )
}

const ExploreWrapper = styled('div', {
  ' .category-menus': {
    borderBottom: '1px solid $borderColors$default',
    display: 'flex',
    justifyContent: 'space-between',
    overFlow: 'hidden',
    '&.desktop-section': {
      ' >span': {
        minWidth: '8%',
        textAlign: 'center',
        paddingBottom: '$8',
        cursor: 'pointer',
        '&.active': {
          borderBottom: '4px solid $selected',
        },
      },
    },
    '&.mobile-section': {
      ' >span': {
        minWidth: '18%',
        textAlign: 'center',
        paddingBottom: '$8',
        cursor: 'pointer',
        '&.active': {
          borderBottom: '4px solid $selected',
        },
      },
    },
  },
})
