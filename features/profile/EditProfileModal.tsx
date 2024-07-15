import React, { useState, useEffect } from 'react'
import {
  Modal,
  ChakraProvider,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  HStack,
  Text,
  Stack,
  InputRightElement,
  Input,
  IconButton,
} from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons'
import { Button } from 'components/Button'
import styled from 'styled-components'
import { NftCard } from 'components/NFT/nft-card'

const PlaceBidModal = ({ onHandleSave, profileInfo }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [profile, setProfile] = useState(profileInfo)
  useEffect(() => {
    setProfile(profileInfo)
  }, [profileInfo])
  const onHandleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }
  return (
    <ChakraProvider>
      <IconButton
        aria-label="Edit Profile"
        icon={<EditIcon />}
        onClick={onOpen}
        variant="outline"
        colorScheme="whiteAlpha"
      />
      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay backdropFilter="blur(14px)" bg="rgba(0, 0, 0, 0.34)" />
        <Container maxW="900px">
          <Stack spacing={10}>
            <Stack>
              <Text fontSize="30px" fontWeight="700">
                Edit your Profile
              </Text>
            </Stack>
            <Stack spacing="40px">
              <Stack>
                <InputLabel>User name</InputLabel>
                <StyledInput
                  name="name"
                  onChange={onHandleChange}
                  value={profile.name}
                />
              </Stack>
              <Stack>
                <InputLabel>Bio</InputLabel>
                <StyledInput
                  name="bio"
                  onChange={onHandleChange}
                  value={profile.bio}
                />
              </Stack>
              <Stack>
                <InputLabel>Email Address</InputLabel>
                <StyledInput
                  name="mail"
                  onChange={onHandleChange}
                  value={profile.mail}
                />
              </Stack>
              <Stack>
                <InputLabel>Discord Username</InputLabel>
                <StyledInput
                  name="discord"
                  onChange={onHandleChange}
                  value={profile.discord}
                />
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
                onHandleSave(profile).then((value) => {
                  if (value) onClose()
                })
              }}
            >
              Save
            </Button>
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
  padding: 70px;
  color: white !important;
`
const InputLabel = styled.div`
  font-size: 14px;
  font-weight: 700;
  padding: 0 20px;
`
const StyledInput = styled.input`
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 15px;
  font-size: 30px;
  font-weight: 600;
  background: #272734;
  border-radius: 20px !important;
  display: flex;
  align-items: center;
  height: 70px !important;
  font-family: Mulish;
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

export default PlaceBidModal
