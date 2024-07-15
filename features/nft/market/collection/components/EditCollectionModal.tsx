import React, { useReducer, useState } from 'react'
import axios from 'axios'
import {
  Modal,
  ChakraProvider,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  Textarea,
  Stack,
} from '@chakra-ui/react'
import { toast } from 'react-toastify'
import DropZone from 'components/DropZone'
import { getCurrentWallet } from 'util/sender-wallet'
import FeaturedImageUpload from 'components/FeaturedImageUpload'
import { nftFunctionCall, checkTransaction } from 'util/near'
import { Button } from 'components/Button'
import styled from 'styled-components'

const PUBLIC_PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY || ''
const PUBLIC_PINATA_SECRET_API_KEY =
  process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY || ''
const EditCollectionModal = ({ collectionInfo }) => {
  const wallet = getCurrentWallet()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [description, setDescription] = useState('')
  const [isJsonUploading, setJsonUploading] = useState(false)
  // reducer function to handle state changes
  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_IN_DROP_ZONE':
        return { ...state, inDropZone: action.inDropZone }
      case 'ADD_FILE_TO_LIST':
        return { ...state, fileList: state.fileList.concat(action.files) }
      case 'SET_LOGO':
        return { ...state, logo: action.logo }
      case 'SET_FEATURED_IMAGE':
        return { ...state, featuredImage: action.featuredImage }
      default:
        return state
    }
  }
  // destructuring state and dispatch, initializing fileList to empty array
  const [data, dispatch] = useReducer(reducer, {
    inDropZone: false,
    fileList: [],
    logo: '',
    featuredImage: '',
  })
  const handleChange = async () => {
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
    if (data.logo == '') {
      toast.warning(`Please upload a logo image.`, {
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
    if (data.featuredImage == '') {
      toast.warning(`Please upload a featured image.`, {
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
    const jsonData = {}
    jsonData['logo'] = data.logo
    jsonData['featuredImage'] = data.featuredImage
    jsonData['name'] = collectionInfo.name
    jsonData['description'] = description
    const pinataJson = {
      pinataMetadata: {
        name: collectionInfo.name,
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
    }
    setJsonUploading(false)
    try {
      await nftFunctionCall({
        methodName: 'nft_edit_series',
        args: {
          token_series_id: collectionInfo.token_series_id,
          token_metadata: {
            media: data.logo,
            reference: ipfsHash,
            copies: 10000,
            title: collectionInfo.name,
            description: collectionInfo.symbol,
          },
        },
      })
    } catch (error) {
      console.log('Create series error: ', error)
    }
  }
  return (
    <ChakraProvider>
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
        onClick={onOpen}
      >
        Edit Collection
      </Button>
      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay backdropFilter="blur(14px)" bg="rgba(0, 0, 0, 0.34)" />
        <Container maxW="900px">
          <Stack spacing="40px">
            <Title>Edit Collection</Title>
            <Stack>
              <Text>Collection Logo</Text>
              <DropZone data={data} dispatch={dispatch} item="logo" />
            </Stack>
            <Stack>
              <Text>Cover Image</Text>
              <FeaturedImageUpload
                data={data}
                dispatch={dispatch}
                item="logo"
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
            <Stack padding="0 30px">
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
                onClick={handleChange}
                disabled={isJsonUploading}
              >
                Save Changes
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Modal>
    </ChakraProvider>
  )
}

const Container = styled(ModalContent)`
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  background: rgba(255, 255, 255, 0.06) !important;
  border-radius: 30px !important;
  padding: 50px;
  color: white !important;
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

const Title = styled.div`
  font-weight: 600;
  font-size: 30px;
  text-align: center;
`

const Text = styled.div`
  font-size: 14px;
  font-weight: 700;
  padding: 0 40px;
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

export default EditCollectionModal
