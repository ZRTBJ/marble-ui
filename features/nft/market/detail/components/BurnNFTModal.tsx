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

const BurnNFTModal = ({ nftInfo, onHandle }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <ChakraProvider>
      <BurnButton className="btn-buy btn-default" onClick={onOpen}>
        Burn NFT
      </BurnButton>
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
                  Burn the NFT
                </Text>
                <Text fontSize="20px" fontFamily="Mulish">
                  Burning an NFT destroys the NFT and removes it from <br />{' '}
                  your creator profile. Please note, this action cannot be
                  <br /> reversed.
                </Text>
              </Stack>
              <BurnButton className="btn-buy btn-default" onClick={onHandle}>
                Burn the NFT
              </BurnButton>
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
const BurnButton = styled.div`
  background: #c80000;
  font-size: 18px;
  color: white;
  stroke: white;
  width: 100%;
  margin-top: 20px;
  border-radius: 10px;
  height: 70px;
  cursor: pointer;
  align-items: center;
  display: flex;
  justify-content: center;
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09),
    inset 0px 7px 8px rgba(0, 0, 0, 0.2);
`

export default BurnNFTModal
