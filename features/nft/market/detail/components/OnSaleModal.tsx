import React from 'react'
import {
  Modal,
  ChakraProvider,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  HStack,
  Text,
  Stack,
  Input,
} from '@chakra-ui/react'
import Select, { components } from 'react-select'
import { HERA_CONTRACT_NAME } from 'util/near'
import { Button } from 'components/Button'
import styled from 'styled-components'
import { NftCard } from 'components/NFT/nft-card'

const options = [
  {
    value: 'near',
    label: 'Near',
    icon: 'https://raw.githubusercontent.com/MarbleDAO/brand-assets/main/block.png',
  },
  {
    value: HERA_CONTRACT_NAME,
    label: 'Hera',
    icon: 'https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/juno.png',
  },
]

const OnSaleModal = ({
  setPrice,
  onHandle,
  nftInfo,
  setIsAuction,
  isAuction,
  setToken,
  token,
  setStartDate,
  setEndDate,
  setReservePrice,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  console.log('nftINfo: ', nftInfo)
  const { Option } = components
  const IconOption = (props) => (
    <Option {...props}>
      <HStack>
        <img src={props.data.icon} style={{ width: '50px' }} />
        <Text>{props.data.label}</Text>
      </HStack>
    </Option>
  )

  const customStyles = {
    control: (base, state) => ({
      ...base,
      height: '70px',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.2) !important',
      background: '#272734',
      color: '#FFFFFF',
    }),
    menuList: (base, state) => ({
      ...base,
      background: '#272734',
    }),
    option: (base, state) => ({
      ...base,
      color: 'white',
      background: '#272734',
      borderRadius: '20px',
      ':hover': {
        background: '#272734',
        opacity: '0.8',
      },
    }),
    singleValue: (base, state) => ({
      ...base,
      color: 'white',
    }),
    valueContainer: (base, state) => ({
      ...base,
      display: 'flex',
    }),
    menu: (base, state) => ({
      ...base,
      zIndex: '10',
    }),
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
        Sell Your NFT
      </Button>
      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay backdropFilter="blur(14px)" bg="rgba(0, 0, 0, 0.34)" />
        <Container maxW="1320px">
          <HStack spacing={10} justifyContent="space-around" alignItems="start">
            <Stack spacing={10}>
              <Stack textAlign="center">
                <Text fontSize="30px" fontWeight="600">
                  Sell Your NFT
                </Text>
              </Stack>
              <Stack direction="row" spacing={20} alignItems="center">
                <StyledRadio
                  onClick={(e) => setIsAuction(true)}
                  isActive={isAuction}
                >
                  <Text fontSize="22px" fontWeight="700">
                    Auction
                  </Text>
                  <Text fontSize="14px" fontFamily="Mulish">
                    The highest offer wins the auction.
                  </Text>
                </StyledRadio>
                <StyledRadio
                  onClick={(e) => setIsAuction(false)}
                  isActive={!isAuction}
                >
                  <Text fontSize="22px" fontWeight="700">
                    Fixed Sale
                  </Text>
                  <Text fontSize="14px" fontFamily="Mulish">
                    Fixed price to buy
                  </Text>
                </StyledRadio>
              </Stack>
              <Stack>
                <Text fontSize="14px">Payment Token</Text>
                <Select
                  defaultValue={options[0]}
                  options={options}
                  components={{
                    Option: IconOption,
                    SingleValue: IconOption,
                    IndicatorSeparator: () => null,
                    Input: () => null,
                  }}
                  styles={customStyles}
                  onChange={(e) => {
                    console.log('e.target.value: ', e)
                    setToken(e.value)
                  }}
                />
              </Stack>
              <Stack direction="row" alignItems="center" marginTop="20px">
                <Stack spacing={8} style={{ padding: '5px 0' }} width="100%">
                  <HStack spacing={8}>
                    <Stack width={isAuction ? '50%' : '100%'}>
                      <Text marginLeft="20px">Price</Text>
                      <StyledInput
                        placeholder="Type your value"
                        type="number"
                        onChange={setPrice}
                      />
                    </Stack>
                    {isAuction && (
                      <Stack width="50%">
                        <Text marginLeft="20px">Reserve Price</Text>
                        <StyledInput
                          placeholder="Type your value"
                          type="number"
                          onChange={setReservePrice}
                        />
                      </Stack>
                    )}
                  </HStack>

                  {isAuction && (
                    <HStack spacing={8}>
                      <Stack width="50%">
                        <Text marginLeft="20px">Start at</Text>
                        <StyledInput
                          placeholder="Type your value"
                          type="datetime-local"
                          // value={startDate.toISOString()}
                          onChange={setStartDate}
                        />
                      </Stack>
                      <Stack width="50%">
                        <Text marginLeft="20px">End at</Text>
                        <StyledInput
                          placeholder="Type your value"
                          type="datetime-local"
                          onChange={setEndDate}
                        />
                      </Stack>
                    </HStack>
                  )}
                </Stack>
              </Stack>
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
                onClick={() => {
                  onHandle()
                }}
              >
                Put On Sale
              </Button>
              <Text margin="10px 0 0 0">
                5% transaction fee goes to treasury wallet
              </Text>
            </Stack>
            <Stack height="556px" width="434px">
              <NftCard nft={nftInfo} id="" type="" />
            </Stack>
          </HStack>
        </Container>
      </Modal>
    </ChakraProvider>
  )
}

const Container = styled(ModalContent)`
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  background: rgba(255, 255, 255, 0.06) !important;
  border-radius: 30px !important;
  padding: 70px;
  color: white !important;
  overflow: hidden;
`
const StyledRadio = styled.div<{ isActive: boolean }>`
  color: ${({ isActive }) => (isActive ? 'black' : 'white')};
  border-radius: 16px;
  box-shadow: ${({ isActive }) =>
    isActive
      ? '0px 4px 40px rgba(42, 47, 50, 0.09), inset 0px 7px 8px rgba(0, 0, 0, 0.2)'
      : 'inset 0px 7px 8px rgba(0, 0, 0, 0.2)'};
  border: ${({ isActive }) => (isActive ? '' : '1px solid #FFFFFF')};
  padding: 30px;
  width: 300px;
  height: 111px;
  cursor: pointer;
  background: ${({ isActive }) => (isActive ? '#FFFFFF' : '')};
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const StyledInput = styled(Input)`
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  background: #272734 !important;
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09) !important;
  backdrop-filter: blur(40px) !important;
  border-radius: 20px !important;
  height: 70px !important;
`

export default OnSaleModal
