import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Stack, HStack } from '@chakra-ui/react'
import Checkbox from 'components/Checkbox'
import { getAllUsers } from 'hooks/useProfile'
import ProfileCard from 'components/profile/ProfileCard'
import Link from 'next/link'
import { LinkBox } from '@chakra-ui/react'

const AllProfiles = () => {
  const [profiles, setProfiles] = useState([])
  useEffect(() => {
    ;(async () => {
      const allUsers = await getAllUsers()
      setProfiles(allUsers)
    })()
  }, [])
  console.log('profiles: ', profiles)
  return (
    <Container>
      <Card>
        <Stack>
          <Stack spacing="20px">
            <h1>Type</h1>
            <HorizontalDivider />
            <Stack spacing="30px">
              <HStack justifyContent="space-between">
                <HStack>
                  <Checkbox /> <h3>Creator</h3>
                </HStack>
                <h3>46,428</h3>
              </HStack>
              <HStack justifyContent="space-between">
                <HStack>
                  <Checkbox /> <h3>Collector</h3>
                </HStack>
                <h3>46,428</h3>
              </HStack>
              <HStack justifyContent="space-between">
                <HStack>
                  <Checkbox /> <h3>Other</h3>
                </HStack>
                <h3>46,428</h3>
              </HStack>
            </Stack>
          </Stack>
        </Stack>
      </Card>
      <ProfilesContainer>
        {profiles.map((profile, index) => (
          <Link href={`/profile/${profile.id}`} passHref key={index}>
            <LinkBox
              as="picture"
              transition="transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) 0s"
              _hover={{
                transform: 'scale(1.05)',
              }}
            >
              <ProfileCard profileInfo={profile} />
            </LinkBox>
          </Link>
        ))}
      </ProfilesContainer>
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  padding: 50px;
  p {
    font-family: Mulish;
    font-size: 14px;
    text-align: center;
  }
  h1 {
    font-size: 24px;
    font-weight: 700;
  }
  h2 {
    font-size: 18px;
    font-weight: 700;
  }
  h3 {
    font-size: 16px;
    font-family: Mulish;
    font-weight: 700;
  }
`
const ProfilesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 0 50px;
  column-gap: 20px;
  row-gap: 20px;
`
const Card = styled.div`
  background: rgba(05, 06, 22, 0.2);
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09), inset 0px 7px 24px #6d6d78;
  backdrop-filter: blur(40px);
  border-radius: 20px;
  padding: 30px;
`
const HorizontalDivider = styled.div`
  width: 100%;
  height: 0px;
  border: 1px solid #434960;
`

export default AllProfiles
