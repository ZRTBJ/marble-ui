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
  InputGroup,
  InputRightElement,
  Input,
} from '@chakra-ui/react'
import { Button } from 'components/Button'
import styled from 'styled-components'
import { NftCard } from 'components/NFT/nft-card'

const UpdateMarketModal = ({
  tokenInfo,
  onChange,
  onHandle,
  nftInfo,
  onReserveChange,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const TokenLogo = () => {
    return (
      <TokenLogoWrapper>
        <img src={tokenInfo?.logoURI} alt="token" width="35px" />
        <Text>{tokenInfo?.name}</Text>
      </TokenLogoWrapper>
    )
  }
  console.log('nftINfo: ', nftInfo)
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
        Update Price
      </Button>
      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay backdropFilter="blur(14px)" bg="rgba(0, 0, 0, 0.34)" />
        <Container maxW="1320px">
          <HStack spacing={10} justifyContent="space-around">
            <Stack spacing={10} width="600px">
              {/* <Stack>
                <Text fontSize='20px' fontWeight='600'></Text>
              </Stack> */}
              <Stack>
                <Text fontSize="20px">New Price</Text>
                <InputGroup>
                  <StyledInput
                    placeholder="Enter New Price"
                    type="number"
                    onChange={onChange}
                  />
                  <StyledInputRightElement children={<TokenLogo />} />
                </InputGroup>
              </Stack>
              <Stack>
                <Text fontSize="20px">New Reserve Price</Text>
                <InputGroup>
                  <StyledInput
                    placeholder="Enter New Reserve Price"
                    type="number"
                    onChange={onReserveChange}
                  />
                  <StyledInputRightElement children={<TokenLogo />} />
                </InputGroup>
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
                onClick={onHandle}
              >
                Update Price
              </Button>
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
`

const StyledInput = styled(Input)`
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 15px;
  font-size: 30px;
  font-weight: 600;
  background: #272734;
  border-radius: 20px !important;
  display: flex;
  align-items: center;
  height: 70px !important;
`

const TokenLogoWrapper = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 60px;
  padding: 10px 20px 10px 10px;
  display: flex;
  align-items: center;
`

const StyledInputRightElement = styled.div`
  position: absolute;
  right: 30px;
  top: 8px;
`

export default UpdateMarketModal
