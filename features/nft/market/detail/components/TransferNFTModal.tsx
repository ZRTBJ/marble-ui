import React, { useState } from 'react'
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
import { Button } from 'components/Button'
import styled from 'styled-components'
import { NftCard } from 'components/NFT/nft-card'

const TransferNFTModal = ({ nftInfo, onHandle }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [address, setAddress] = useState('')
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
        Transfer NFT
      </Button>
      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay backdropFilter="blur(14px)" bg="rgba(0, 0, 0, 0.34)" />
        <Container maxW="1320px">
          <HStack
            spacing={10}
            justifyContent="space-between"
            alignItems="start"
          >
            <Stack spacing={10} width="55%">
              <Stack>
                <Text fontSize="30px" fontWeight="700">
                  Transfer NFT
                </Text>
                <Text fontSize="20px" fontFamily="Mulish">
                  Transfer the NFT to another user or wallet by entering
                  <br /> a valid address below
                </Text>
              </Stack>
              <Stack>
                <StyledInput
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                />
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
                  onHandle(address)
                }}
              >
                Transfer NFT
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

const StyledInput = styled.input`
  padding: 15px;
  font-size: 20px;
  font-weight: 600;
  background: #272734;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09);
  backdrop-filter: blur(40px);
  /* Note: backdrop-filter has minimal browser support */
  font-family: Mulish;
  border-radius: 20px;
  height: 70px;
`

export default TransferNFTModal
