import React, { useReducer, useState, useEffect } from 'react'
import { Stack, HStack, ChakraProvider, Textarea } from '@chakra-ui/react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import axios from 'axios'
import styled from 'styled-components'
import { RoundedIcon } from 'components/RoundedIcon'
import { Button } from 'components/Button'
import Checkbox from 'components/Checkbox'
import { AppLayout } from 'components/Layout/AppLayout'
import NFTUpload from 'components/NFTUpload'
import { nftViewFunction, nftFunctionCall } from 'util/near'
import { getCurrentWallet } from 'util/sender-wallet'

const PUBLIC_PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY || ''
const PUBLIC_PINATA_SECRET_API_KEY =
  process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY || ''

export default function NFTCreate() {
  const wallet = getCurrentWallet()
  const { asPath } = useRouter()
  const token_series_id = asPath.split('/')[2]
  const [error, setError] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [original, setOriginal] = useState(false)
  const [kind, setKind] = useState(false)
  const [creative, setCreative] = useState(false)
  const [isJsonUploading, setJsonUploading] = useState(false)
  const [collection, setCollection] = useState<any>({})
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  // reducer function to handle state changes
  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_IN_DROP_ZONE':
        return { ...state, inDropZone: action.inDropZone }
      case 'ADD_FILE_TO_LIST':
        return { ...state, fileList: state.fileList.concat(action.files) }
      case 'SET_NFT':
        return { ...state, nft: action.nft }
      default:
        return state
    }
  }

  // destructuring state and dispatch, initializing fileList to empty array
  const [data, dispatch] = useReducer(reducer, {
    inDropZone: false,
    fileList: [],
    nft: '',
  })
  useEffect(() => {
    ;(async () => {
      if (token_series_id === undefined || token_series_id == '[collection]')
        return false
      const [collectionInfo, collectionSize] = await Promise.all([
        await fetchCollectionInfo(),
        await fetchCollectionSize(),
      ])
      console.log('collectionInfo: ', collectionInfo, collectionSize)
      collectionInfo.count = collectionSize
      collectionInfo.media =
        process.env.NEXT_PUBLIC_PINATA_URL + collectionInfo.metadata.media
      setCollection(collectionInfo)
    })()
  }, [token_series_id])
  async function fetchCollectionSize() {
    try {
      const data = await nftViewFunction({
        methodName: 'nft_supply_for_series',
        args: {
          token_series_id: token_series_id,
        },
      })
      console.log('nft-supply-in-serie: ', data)
      return data
    } catch (err) {
      console.log('nft supply for a collection error: ', err)
      return 0
    }
  }
  async function fetchCollectionInfo() {
    try {
      console.log('tokenseriesid: ', token_series_id)
      const data = await nftViewFunction({
        methodName: 'nft_get_series_single',
        args: {
          token_series_id: token_series_id,
        },
      })
      return data
    } catch (err) {
      console.log('collection get error: ', err)
      return {}
    }
  }
  const handleAgree = () => {
    if (original && kind && creative) {
      setAgreed(true)
      setError(false)
    } else {
      setError(true)
    }
  }
  const handleMint = async () => {
    if (!wallet.accountId) {
      toast.warning(`Please connect your wallet.`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      return
    }

    if (name == '') {
      toast.warning(`Please input the NFT name.`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      return
    }
    const jsonData: any = {}
    jsonData['name'] = name
    jsonData['description'] = description
    jsonData['uri'] = data.nft
    jsonData['owner'] = wallet.accountId
    jsonData['collectionId'] = token_series_id
    const pinataJson = {
      pinataMetadata: {
        name: name,
      },
      pinataContent: jsonData,
    }
    setJsonUploading(true)
    let url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`
    let response = await axios.post(url, pinataJson, {
      maxBodyLength: Infinity, //this is needed to prevent axios from erroring out with large files
      headers: {
        'Content-Type': `application/json`,
        pinata_api_key: PUBLIC_PINATA_API_KEY,
        pinata_secret_api_key: PUBLIC_PINATA_SECRET_API_KEY,
      },
    })
    let ipfsHash = ''
    if (response.status == 200) {
      ipfsHash = response.data.IpfsHash
      try {
        await nftFunctionCall({
          methodName: 'nft_mint',
          args: {
            token_series_id: token_series_id,
            receiver_id: wallet.accountId,
            nft_metadata: {
              media: data.nft,
              reference: ipfsHash,
            },
          },
          amount: '0.01',
        })
        toast.success(`You have created your NFT successfully.`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      } catch (error) {
        console.log('Create series error: ', error)
      }
    }
  }
  const UploadImage = () => {
    return (
      <Stack padding="0 100px" spacing="40px">
        <h2>Upload A Media File</h2>
        <NFTUpload data={data} dispatch={dispatch} item="nft-create" />
      </Stack>
    )
  }
  return (
    <AppLayout fullWidth={true}>
      <ChakraProvider>
        {wallet.accountId && (
          <Container>
            <Stack alignItems="center" spacing="50px">
              <Stack>
                <h1>Create On Marble Dao</h1>
                {!agreed && !collection.count && (
                  <p style={{ textAlign: 'center' }}>
                    Before you mint your first NFT, Please read through and
                    agree to <br />
                    our community guidelines.
                  </p>
                )}
              </Stack>
              {agreed || collection.count > 0 ? (
                <HStack alignItems="start" spacing="40px">
                  <Card>
                    {data.nft ? (
                      <Stack spacing="40px">
                        <h2>Mint An NFT</h2>
                        <Stack>
                          <h3>Add Details</h3>
                          <p>
                            Once your NFT is minted to the Marble blockchain,
                            you will not be able to edit <br /> or update any of
                            this information.
                          </p>
                        </Stack>
                        <Stack>
                          <Text>Name</Text>
                          <StyledInput
                            placeholder="Name"
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value)
                            }}
                          />
                        </Stack>
                        <Stack>
                          <Text>Description</Text>
                          <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxlength="1000"
                          />
                          <Footer>
                            <div>Use markdown syntax to embed links</div>
                            <div>{description.length}/1000</div>
                          </Footer>
                        </Stack>
                        <Stack>
                          <h3>Collections</h3>
                          <CollectionCard>
                            <RoundedIcon
                              size="70px"
                              src={collection.media}
                              alt="collection"
                            />
                            <Stack marginLeft="20px">
                              <h3>{collection && collection.metadata.title}</h3>
                              <p>{collection.count} NFTs</p>
                            </Stack>
                          </CollectionCard>
                        </Stack>
                        <Stack padding="0 150px">
                          <Button
                            className="btn-buy btn-default"
                            css={{
                              background: '$white',
                              color: '$black',
                              stroke: '$black',
                              width: '100%',
                              marginTop: '20px',
                            }}
                            variant="primary"
                            size="large"
                            onClick={handleMint}
                          >
                            Mint NFT
                          </Button>
                        </Stack>
                      </Stack>
                    ) : (
                      <UploadImage />
                    )}
                  </Card>
                  {data.nft && (
                    <NFTContainer>
                      <Stack spacing="20px">
                        <ImgDiv className="nft-img-url">
                          <Image
                            src={process.env.NEXT_PUBLIC_PINATA_URL + data.nft}
                            alt="NFT Image"
                          />
                        </ImgDiv>
                        <h2 style={{ textAlign: 'left' }}>
                          {collection.metadata.title}
                        </h2>
                      </Stack>
                    </NFTContainer>
                  )}
                </HStack>
              ) : (
                <Card>
                  <Stack spacing="70px">
                    <h2>Here&apos;s a Summary</h2>
                    <Stack>
                      <HStack>
                        <Checkbox
                          checked={original}
                          onChange={(e) => {
                            setOriginal(!original)
                          }}
                        />
                        <h3>Be Original</h3>
                      </HStack>
                      <Text>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry.{' '}
                      </Text>
                    </Stack>
                    <Stack>
                      <HStack>
                        <Checkbox
                          checked={kind}
                          onChange={(e) => setKind(!kind)}
                        />
                        <h3>Be Kind and Inclusive</h3>
                      </HStack>
                      <Text>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry.{' '}
                      </Text>
                    </Stack>
                    <Stack>
                      <HStack>
                        <Checkbox
                          checked={creative}
                          onChange={(e) => setCreative(!creative)}
                        />
                        <h3>Be Creative And Have Fun</h3>
                      </HStack>
                      <Text>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry.{' '}
                      </Text>
                    </Stack>
                  </Stack>
                  <Divider />
                  <Stack spacing="50px" padding="0 150px">
                    <a>Read our full community guidelines here</a>
                    <Stack>
                      {error && (
                        <p style={{ color: 'red' }}>
                          Please select all conditions
                        </p>
                      )}
                      <Button
                        className="btn-buy btn-default"
                        css={{
                          background: '$white',
                          color: '$black',
                          stroke: '$black',
                          width: '100%',
                        }}
                        variant="primary"
                        size="large"
                        onClick={handleAgree}
                      >
                        I Agree
                      </Button>
                    </Stack>
                  </Stack>
                </Card>
              )}
            </Stack>
          </Container>
        )}
      </ChakraProvider>
    </AppLayout>
  )
}

const Text = styled.div`
  font-size: 14px;
  font-family: Mulish;
  font-weight: 400;
  padding: 0 40px;
`
const Divider = styled.div`
  height: 0px;
  border: 1px solid #363b4e;
  margin: 60px 0;
`
const Container = styled.div`
  padding: 70px;
  p {
    font-size: 18px;
    font-family: Mulish;
    font-weight: 600;
  }
  h1 {
    font-size: 46px;
    font-weight: 600;
  }
  h2 {
    font-size: 30px;
    font-weight: 600;
    text-align: center;
  }
  h3 {
    font-size: 20px;
    font-weight: 600;
  }
  a {
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    text-decoration-line: underline;
    font-family: Mulish;
    cursor: pointer;
  }
`
const Card = styled.div`
  padding: 40px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 255, 255, 0.06) 100%
  );
  box-shadow: 0px 7px 14px rgba(0, 0, 0, 0.1),
    inset 0px 14px 24px rgba(17, 20, 29, 0.4);
  backdrop-filter: blur(30px);
  /* Note: backdrop-filter has minimal browser support */

  border-radius: 30px;
  width: 1000px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`
const StyledInput = styled.input`
  background: #272734;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09);
  backdrop-filter: blur(40px);
  border-radius: 20px;
  padding: 20px;
  font-size: 20px;
  font-family: Mulish;
`
const Input = styled(Textarea)`
  background: #272734 !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09) !important;
  backdrop-filter: blur(40px) !important;
  /* Note: backdrop-filter has minimal browser support */
  font-family: Mulish;
  border-radius: 20px !important;
`
const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  opacity: 0.5;
  font-size: 14px;
  padding: 0 10px;
  div {
    font-family: Mulish;
  }
`
const CollectionCard = styled.div`
  background: linear-gradient(0deg, #050616, #050616) padding-box,
    linear-gradient(90.65deg, #ffffff 0.82%, rgba(0, 0, 0, 0) 98.47%) border-box;
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09), inset 0px 7px 24px #6d6d78;
  backdrop-filter: blur(40px);
  border-radius: 20px;
  border: 1px solid;
  border-image-source: linear-gradient(
    90.65deg,
    #ffffff 0.82%,
    rgba(0, 0, 0, 0) 98.47%
  );
  padding: 25px;
  display: flex;
  align-items: center;
  cursor: pointer;
`
const NFTContainer = styled.div`
  width: 460px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 255, 255, 0.06) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 25px;
  border-radius: 30px;
  backdrop-filter: blur(30px);
  box-shadow: 0px 7px 14px rgba(0, 0, 0, 0.1),
    inset 0px 14px 24px rgba(17, 20, 29, 0.4);
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
