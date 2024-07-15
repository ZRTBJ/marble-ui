import React from 'react'
import { AppLayout } from 'components/Layout/AppLayout'
import { NFTDetail } from 'features/nft/market/detail'
import { useRouter } from 'next/router'

export default function Home() {

  const { asPath } = useRouter()
  const id = asPath.split('/')[3].split('?')[0]
  const collectionId = asPath.split('/')[2]
  return (
    <AppLayout fullWidth={true} hasBanner={true}>
      <NFTDetail collectionId={collectionId} id={id} />
    </AppLayout>
  )
}

