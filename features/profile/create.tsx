import * as React from 'react'
import { useCallback, useState, useReducer, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Link from 'next/link'
import { styled } from 'components/theme'
import { Button } from 'components/Button'
import { IconWrapper } from 'components/IconWrapper'
import {
  YourSite,
  Discord,
  Instagram,
  MediumM,
  Telegram,
  Template1,
  CheckIcon,
} from 'icons'
import { NftInfo, NftCategory, NftCollection } from 'services/nft'
import {
  ChakraProvider,
  Input,
  InputGroup,
  InputLeftAddon,
  Image,
  Textarea,
  Select,
  AspectRatio,
  Stack,
  HStack,
  IconButton,
} from '@chakra-ui/react'
import { CloseIcon, SmallAddIcon } from '@chakra-ui/icons'
import { toast } from 'react-toastify'
import DropZone from 'components/DropZone'
import FeaturedImageUpload from 'components/FeaturedImageUpload'
import BannerImageUpload from 'components/BannerImageUpload'
import { nftFunctionCall, checkTransaction } from 'util/near'
import { getCurrentWallet } from 'util/sender-wallet'
import {
  failToast,
  getURLInfo,
  successToast,
  getErrorMessage,
} from 'components/transactionTipPopUp'
import { Near } from 'icons'

const PUBLIC_PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY || ''
const PUBLIC_PINATA_SECRET_API_KEY =
  process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY || ''
let themeValue = '1'

const ProfileCreate = () => {
  const router = useRouter()
  const { txHash, pathname, errorType } = getURLInfo()
  //const toast = useToast()
  const [nftcategories, setNftCategories] = useState<NftCategory[]>([])
  const [isJsonUploading, setJsonUploading] = useState(false)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('0')
  const [website, setWebsite] = useState('')
  const [discord, setDiscord] = useState('')
  const [instagram, setInstagram] = useState('')
  const [medium, setMedium] = useState('')
  const [telegram, setTelegram] = useState('')
  const [explicit, setExplicit] = useState('')
  const [collectionIpfsHash, setCollectionIpfsHash] = useState('')
  const wallet = getCurrentWallet()
  const [royaltyValues, setRoyaltyValues] = useState([
    { name: wallet.accountId, price: '10' },
  ])
  const handleNameChange = (event) => {
    setName(event.target.value)
  }
  const handleSlugChange = (event) => {
    setSlug(event.target.value)
  }
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value)
  }
  const handleCategoryChange = (event) => {
    setCategory(event.target.value)
  }
  const handleWebsiteChange = (event) => {
    setWebsite(event.target.value)
  }
  const handleDiscordChange = (event) => {
    setDiscord(event.target.value)
  }
  const handleInstagramChange = (event) => {
    setInstagram(event.target.value)
  }
  const handleMediumChange = (event) => {
    setMedium(event.target.value)
  }
  const handleTelegramChange = (event) => {
    setTelegram(event.target.value)
  }
  const handleRoyaltyChange = (i, e) => {
    const newFormValues = [...royaltyValues]
    newFormValues[i][e.target.name] = e.target.value

    setRoyaltyValues(newFormValues)
  }
  const addFormFields = () => {
    setRoyaltyValues([...royaltyValues, { name: '', price: '' }])
  }

  const removeFormFields = (i, e) => {
    const newFormValues = [...royaltyValues]
    newFormValues.splice(i, 1)
    setRoyaltyValues(newFormValues)
  }

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
      case 'SET_BANNER':
        return { ...state, banner: action.banner }
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
    banner: '',
  })

  useEffect(() => {
    ;(async () => {
      if (!wallet.accountId) {
        return
      }
      let res_categories = await fetch(process.env.NEXT_PUBLIC_CATEGORY_URL)
      let categories = await res_categories.json()
      setNftCategories(categories.categories)
    })()
  }, [wallet.accountId])
  useEffect(() => {
    if (txHash && getCurrentWallet().wallet.isSignedIn()) {
      checkTransaction(txHash)
        .then((res: any) => {
          const transactionErrorType = getErrorMessage(res)
          const transaction = res.transaction
          return {
            isSwap:
              transaction?.actions[1]?.['FunctionCall']?.method_name ===
                'ft_transfer_call' ||
              transaction?.actions[0]?.['FunctionCall']?.method_name ===
                'ft_transfer_call' ||
              transaction?.actions[0]?.['FunctionCall']?.method_name ===
                'nft_create_series',
            transactionErrorType,
          }
        })
        .then(({ isSwap, transactionErrorType }) => {
          if (isSwap) {
            !transactionErrorType && !errorType && successToast(txHash)
            transactionErrorType && failToast(txHash, transactionErrorType)
            router.push('/explore')
            return
          }
          router.push(pathname)
        })
    }
  }, [txHash])
  return (
    <Container>
      <p>
        <span className="required">*</span> Required Fields
      </p>
      <LogoFeaturedContainer>
        <LogoContainer>
          <h3>
            Logo image <span className="required">*</span>
          </h3>
          <p>
            This image will also be used for navigation. 350*350 recommended.
          </p>
          <AspectRatio maxW="350px" ratio={1}>
            <DropZone data={data} dispatch={dispatch} item="logo" />
          </AspectRatio>
        </LogoContainer>
        <FeaturedContainer>
          <h3>Featured image</h3>
          <p>
            This image will also be used for Featured your collection on home
            page, category pages, or other promotional areas of OpenSea. 600*400
            recommended.
          </p>
          <AspectRatio maxW="600px" ratio={1.5}>
            <FeaturedImageUpload
              data={data}
              dispatch={dispatch}
              item="featured"
            />
          </AspectRatio>
        </FeaturedContainer>
      </LogoFeaturedContainer>
      <ChakraProvider>
        <CollectionItem className="collection-item">
          <h3>
            Name <span className="required">*</span>
          </h3>
          <Input
            pr="48px"
            type="text"
            placeholder="Example: Treasures of the Sea"
            value={name}
            onChange={handleNameChange}
          />
        </CollectionItem>
        <CollectionItem className="collection-item">
          <h3>
            URL <span className="required">*</span>
          </h3>
          <p>
            Customize your URL on Marble NFT Marketplace. Must only contain
            lowercase letters, numbers, and hyphens.
          </p>
          <InputGroup size="sm">
            <InputLeftAddon children={`${window.location.origin}/`} />
            <Input
              placeholder="collection-name"
              value={slug}
              onChange={handleSlugChange}
            />
          </InputGroup>
        </CollectionItem>
        <CollectionItem className="collection-item">
          <h3>Description</h3>
          <p>Markdown syntax is supported. 0 of 1000 characters used.</p>
          <Textarea value={description} onChange={handleDescriptionChange} />
        </CollectionItem>
        <CollectionItem className="collection-item">
          <h3>Category</h3>
          <p>
            Adding a category will help make your item discoverable on Marble
            NFT Marketplace.
          </p>
          <Select
            id="category_id"
            value={category}
            onChange={handleCategoryChange}
          >
            {nftcategories.length > 0 &&
              nftcategories.map((category, idx) => (
                <option value={category.id} key={`cat${idx}`}>
                  {category.name == 'All' ? '' : category.name}
                </option>
              ))}
          </Select>
        </CollectionItem>
        <CollectionItem className="collection-item">
          <h3>Link</h3>
          <Stack spacing={0} className="link-group">
            <InputGroup className="link-item first-item">
              <InputLeftAddon pointerEvents="none">
                <YourSite />
              </InputLeftAddon>
              <Input
                type="text"
                placeholder="yoursite.io"
                value={website}
                onChange={handleWebsiteChange}
              />
            </InputGroup>
            <InputGroup className="link-item">
              <InputLeftAddon pointerEvents="none">
                <Discord />
                https://discord.gg/
              </InputLeftAddon>
              <Input
                placeholder="abcdef"
                value={discord}
                onChange={handleDiscordChange}
              />
            </InputGroup>
            <InputGroup className="link-item">
              <InputLeftAddon pointerEvents="none">
                <Instagram />
                https://www.instagram.com/
              </InputLeftAddon>
              <Input
                type="text"
                placeholder="YourInstagramHandle"
                value={instagram}
                onChange={handleInstagramChange}
              />
            </InputGroup>
            <InputGroup className="link-item">
              <InputLeftAddon pointerEvents="none">
                <MediumM />
                https://medium.com/@
              </InputLeftAddon>
              <Input
                type="text"
                placeholder="YourMediumHandle"
                value={medium}
                onChange={handleMediumChange}
              />
            </InputGroup>
            <InputGroup className="link-item last-item">
              <InputLeftAddon pointerEvents="none">
                <Telegram />
                https://t.me/
              </InputLeftAddon>
              <Input
                type="text"
                placeholder="abcdef"
                value={telegram}
                onChange={handleTelegramChange}
              />
            </InputGroup>
          </Stack>
        </CollectionItem>
        <CollectionItem className="collection-item">
          <Button
            className="btn-default"
            css={{
              background: '$black',
              color: '$white',
              stroke: '$white',
            }}
            variant="primary"
            size="large"
            onClick={() => {
              // createCollection()
            }}
            disabled={isJsonUploading}
          >
            Create
          </Button>
          {collectionIpfsHash != '' && (
            <span>
              Pinata IpfsHash:{' '}
              <Link
                href={`https://gateway.pinata.cloud/ipfs/${collectionIpfsHash}`}
                passHref
              >
                {collectionIpfsHash}
              </Link>
            </span>
          )}
        </CollectionItem>
      </ChakraProvider>
    </Container>
  )
}

const Container = styled('div', {
  maxWidth: '1400px',
  '.collection-item': {
    marginBottom: '$16',
  },
  h3: {
    fontWeight: 'bold',
  },
  p: {
    color: '$textColors$secondary',
  },
  margin: '0 auto',
})
const LogoFeaturedContainer = styled('div', {
  display: 'flex',
})
const LogoContainer = styled('div', {})
const FeaturedContainer = styled('div', {})
const CollectionItem = styled('div', {
  '.link-group': {
    border: '1px solid $chakraborder',
    borderRadius: '$2',
    '.link-item': {
      borderLeft: '0px',
      borderRight: '0px',
      borderTop: '0px',
      borderBottom: '1px solid $chakraborder',
      '>div': {
        border: '0px',
        borderRadius: '0px',
        background: 'transparent',
        paddingRight: '1px',
        svg: {
          marginRight: '$8',
          width: '26px',
          height: '25px',
          path: {
            fill: '$chakraicon',
          },
        },
      },
      '>input': {
        border: '0px',
        borderRadius: '0px',
        paddingLeft: '0px',
        boxShadow: 'none',
      },
      '&.last-item': {
        border: '0px',
      },
    },
  },
  '.chain-group': {
    border: '1px solid $chakraborder',
    borderRadius: '$2',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    svg: {
      width: '$7',
      margin: '$4',
    },
  },
  '.theme-group': {
    p: {
      textAlign: 'center',
    },
    div: {
      gap: '$8',
      ' label': {
        maxWidth: '380px',
      },
    },
    'div[data-checked]': {
      border: '1px solid $borderColors$themeSelected',
    },
    '.active': {
      ' .check-icon': {
        display: 'block',
      },
    },
  },
})

export default ProfileCreate
