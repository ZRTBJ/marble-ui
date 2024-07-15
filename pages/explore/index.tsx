import {
  ChakraProvider,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import { AppLayout } from 'components/Layout/AppLayout'
import { Explore } from 'features/nft/market/explore'
import NFTExplorer from 'features/nft/market/nftexplore'
import Profiles from 'features/nft/market/profile/allprofiles'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { nftViewFunction } from 'util/near'
import { fetchAllProfileCounts } from 'hooks/useProfile'

export default function Explores() {
  const [nfts, setNfts] = useState('')
  const [collections, setCollections] = useState('')
  const [profiles, setProfiles] = useState<any>({})
  async function fetchAllNFTCounts() {
    const allNFTs = await nftViewFunction({
      methodName: 'nft_total_supply',
      args: {},
    })
    return allNFTs
  }
  async function fetchAllCollectionCounts() {
    const allCollections = await nftViewFunction({
      methodName: 'nft_get_series_supply',
      args: {},
    })
    return allCollections
  }

  useEffect(() => {
    // fetchCollections()
    ;(async () => {
      const [totalNFTs, totalCollections, totalProfiles] = await Promise.all([
        fetchAllNFTCounts(),
        fetchAllCollectionCounts(),
        fetchAllProfileCounts(),
      ])
      setNfts(totalNFTs)
      setCollections(totalCollections)
      setProfiles(totalProfiles)
    })()
  }, [])
  return (
    <ChakraProvider>
      <AppLayout fullWidth={true}>
        <Tabs>
          <StyledTabList>
            <StyledTab>{`NFTs(${nfts})`}</StyledTab>
            <StyledTab>{`Collections(${collections})`}</StyledTab>
            <StyledTab>{`Profiles(${profiles.profiles})`}</StyledTab>
          </StyledTabList>
          <TabPanels>
            <TabPanel>
              <NFTExplorer />
            </TabPanel>
            <TabPanel>
              <Explore />
            </TabPanel>
            <TabPanel>
              <Profiles />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </AppLayout>
    </ChakraProvider>
  )
}
const StyledTabList = styled(TabList)`
  width: fit-content;
  border-bottom: 2px solid;
  border-color: rgba(255, 255, 255, 0.1) !important;
  font-weight: 400;
  .css-1ltezim[aria-selected='true'] {
    border-color: #ffffff;
    font-weight: 600;
    color: white;
  }
`

const StyledTab = styled(Tab)`
  font-size: 22px;
  font-weight: 400;
  padding: 20px;
  margin: 0 20px;
`
