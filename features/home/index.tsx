import { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  ChakraProvider,
  Flex,
  Stack,
  HStack,
  Text,
  Grid,
  Button,
} from '@chakra-ui/react'
import { nftViewFunction } from 'util/near'
import { NftCollection } from 'services/nft'
import SelectedNFT from './components/SelectedNFT'
import Collection from './components/Collection'

const home = () => {
  const [nftcollections, setNftCollections] = useState<NftCollection[]>([])

  const fetchCollections = async () => {
    try {
      const data = await nftViewFunction({
        methodName: 'nft_get_series',
        args: {
          from_index: '0',
          limit: 3,
        },
      })
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
      let res_categories = await fetch(process.env.NEXT_PUBLIC_CATEGORY_URL)
      let { categories } = await res_categories.json()
      const collectionList = await fetchCollections()
      for (let i = 0; i < collectionList.length; i++) {
        let res_collection: any = {}
        try {
          let ipfs_collection = await fetch(
            process.env.NEXT_PUBLIC_PINATA_URL +
              collectionList[i].metadata.reference
          )
          res_collection = await ipfs_collection.json()
          let collection_info: any = {}
          collection_info.id = collectionList[i].token_series_id
          collection_info.name = res_collection.name
          collection_info.description = res_collection.description
          collection_info.image =
            process.env.NEXT_PUBLIC_PINATA_URL + res_collection.featuredImage
          collection_info.banner_image =
            process.env.NEXT_PUBLIC_PINATA_URL + res_collection.logo
          collection_info.slug = res_collection.slug
          collection_info.creator = res_collection.owner ?? ''
          collection_info.cat_ids = categories[res_collection.category].name
          collections.push(collection_info)
        } catch (err) {
          console.log('err', err)
        }
      }
      setNftCollections(collections)
    })()
  }, [])
  return (
    <Container>
      <ChakraProvider>
        <SelectedNFT />
        <Collections>
          <Text fontSize="46px" fontWeight="bold" textAlign="center">
            Curated Collections
          </Text>
          <Stack spacing="50px">
            {nftcollections.map((nftInfo, index) => (
              <Collection info={nftInfo} key={index} />
            ))}
          </Stack>
        </Collections>
        <Flex justifyContent="center">
          <Paper width="90%">
            <HStack>
              <Stack spacing={10}>
                <Text fontSize="60px" fontWeight="700">
                  MARBLE DAO is for everyone
                </Text>
                <Text
                  fontSize="26px"
                  fontWeight="300"
                  opacity="0.5"
                  fontFamily="Mulish"
                >
                  Join the millions of creators, collectors, and curators
                  <br /> who are on this journey with you.
                </Text>
                <StyledButton>Get Started</StyledButton>
              </Stack>
              <Stack>
                <img src="/images/doubleCardLogo.png" alt="cardlogo" />
              </Stack>
            </HStack>
          </Paper>
        </Flex>
        <Stack marginTop="100px" alignItems="center">
          <Stack width="80%" spacing={10}>
            <TextTitle>Our Amazing Partners</TextTitle>
            <TextContent>
              Lorem Ipsum is simply dummy text of the printing of and <br />
              typesetting industry.
            </TextContent>
            <Grid templateColumns="repeat(5, 1fr)" gap={2}>
              <Paper>
                <StyledImg src="/images/partner1.svg" alt="partner1" />
              </Paper>
              <Paper>
                <StyledImg src="/images/rare.svg" alt="rare" />
              </Paper>
              <Paper>
                <StyledImg src="/images/opensea.svg" alt="opensea" />
              </Paper>
              <Paper>
                <StyledImg src="/images/binance.svg" alt="binance" />
              </Paper>
              <Paper>
                <StyledImg src="/images/pinata.svg" alt="pinata" />
              </Paper>
            </Grid>
          </Stack>
        </Stack>
        <Stack marginTop="100px" alignItems="center">
          <Stack width="80%" spacing={10}>
            <TextTitle>MARBLE DAO is a destination</TextTitle>
            <TextContent>
              We are laying the groundwork for MarbleDao - the next generation
              of the <br />
              internet full of limitless possibilities. In MarbleDao, your
              creativity is valued <br />
              and your digital objects belong to you.
            </TextContent>
            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
              <StyledPaper>
                <Stack spacing={5}>
                  <Round>
                    <StyledImg src="/images/createIcon.svg" alt="create" />
                  </Round>
                  <Text fontSize="36px" fontWeight="700" textAlign="center">
                    Create
                  </Text>
                  <TextContent>
                    Creative building blocks for MarbleDao
                  </TextContent>
                </Stack>
              </StyledPaper>
              <StyledPaper>
                <Stack spacing={5}>
                  <Round>
                    <StyledImg src="/images/collectIcon.svg" alt="collect" />
                  </Round>
                  <Text fontSize="36px" fontWeight="700" textAlign="center">
                    Collect
                  </Text>
                  <TextContent>
                    Unearth NFTs for your <br /> growing collection
                  </TextContent>
                </Stack>
              </StyledPaper>
              <StyledPaper>
                <Stack spacing={5}>
                  <Round>
                    <StyledImg src="/images/sellIcon.svg" alt="sell" />
                  </Round>
                  <Text fontSize="36px" fontWeight="700" textAlign="center">
                    Sell
                  </Text>
                  <TextContent>
                    Your NFTs will shine in <br /> our marketplace.
                  </TextContent>
                </Stack>
              </StyledPaper>
            </Grid>
          </Stack>
        </Stack>
      </ChakraProvider>
    </Container>
  )
}

const IntroContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 50px;
  justify-items: center;
`

const NFTInfo = styled.div``

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

const StyledImg = styled.img`
  margin: 0 auto;
`

const Container = styled.div`
  color: white;
`

const Collections = styled.div`
  padding: 50px;
`

const Paper = styled.div<{ width?: string }>`
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.06);
  border: rgba(255, 255, 255, 0.2);
  box-shadow: 0px 7px 14px 0px #0000001a;
  backdrop-filter: blur(30px);
  padding: 40px;
  width: ${({ width }) => width || '100%'};
  display: flex;
  align-items: center;
`
const StyledPaper = styled(Paper)`
  justify-content: center;
`

const TextTitle = styled.div`
  font-size: 46px;
  font-weight: 700;
  text-align: center;
`

const TextContent = styled.div`
  font-size: 26px;
  text-align: center;
  font-weight: 300;
  opacity: 0.5;
  font-family: Mulish;
`
const Round = styled.div`
  width: 180px;
  height: 180px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  border-radius: 50%;
  margin: 50px auto;
`
export default home
