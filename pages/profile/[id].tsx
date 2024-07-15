import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import {
  HStack,
  Stack,
  Text,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react'
import { AppLayout } from 'components/Layout/AppLayout'
import { Button } from 'components/Button'
import { MyCollectedNFTs } from 'features/nft/market/profile'
import CreatedNFTs from 'features/nft/market/profile/creatednfts'
import { Email, DiscordT } from 'icons'
import {
  getProfileInfo,
  setImage,
  setProfileInfo,
  controlFollow,
} from 'hooks/useProfile'
import { default_image } from 'util/constants'
import { toast } from 'react-toastify'
import BannerImageUpload from 'components/BannerImageUpload'
import ProfilleLogoImageUpload from 'components/ProfileLogoImageUpload'
import EditProfileModal from 'features/profile/EditProfileModal'
import { getCurrentWallet } from 'util/sender-wallet'

export default function Home() {
  const { asPath } = useRouter()
  const [profile, setProfile] = useState<any>({})
  const id = asPath && asPath.split('/')[2].split('?')[0]
  const wallet = getCurrentWallet()
  useEffect(() => {
    ;(async () => {
      const _profile = await getProfileInfo(id)
      setProfile(_profile)
    })()
  }, [id])
  const handleSetHash = async (e) => {
    const newProfile = await setImage({ id, ...e })
    setProfile(newProfile)
  }
  const handleProfileEdit = async (e) => {
    try {
      const new_profile = await setProfileInfo({ ...profile, ...e, id })
      setProfile(new_profile)
      toast.success(`Success`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      return true
    } catch (err) {
      toast.warning(`Failed. Please try again.`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      return false
    }
  }
  const handleFollow = async () => {
    const new_profile = await controlFollow({
      id: wallet.accountId,
      target: id,
    })
    if (new_profile) {
      setProfile(new_profile)
    } else {
      toast.warning(`Failed. Please try again.`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }
  return (
    <AppLayout fullWidth={true} hasBanner={true}>
      <Container>
        <Banner>
          {/* <BannerImage src={profile.banner || default_image} alt="banner" /> */}
          <BannerImageUpload
            hash={profile.banner}
            setHash={handleSetHash}
            isActive={wallet.accountId === id}
          />
        </Banner>
        <ProfileContainer>
          <ProfileInfo>
            <LogoImage>
              <ProfilleLogoImageUpload
                isActive={wallet.accountId === id}
                hash={profile.avatar}
                setHash={handleSetHash}
              />
            </LogoImage>
            <Stack spacing="50px">
              <Stack spacing="50px">
                <h1>{profile.name || id}</h1>
                <HStack justifyContent="space-around">
                  <Stack>
                    <h1>{profile.following && profile.following.length}</h1>
                    <p>Following</p>
                  </Stack>
                  <VerticalDivider />
                  <Stack>
                    <h1>{profile.followers && profile.followers.length}</h1>
                    <p>Followers</p>
                  </Stack>
                </HStack>
                {wallet.accountId !== id && wallet.accountId && (
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
                    onClick={handleFollow}
                  >
                    {profile.followers && profile.followers.includes(id)
                      ? 'Unfollow'
                      : 'Follow'}
                  </Button>
                )}
              </Stack>
              <Text opacity="0.5" textAlign="center">
                Not followed by anyone you follow
              </Text>
              <Card>
                <h3>Bio</h3>
                <p>{profile.bio || 'Undefined'}</p>
              </Card>
              {(profile.mail || profile.discord) && (
                <Card>
                  <h3>Links</h3>
                  <LinksGrid>
                    {profile.mail && (
                      <HStack>
                        <Email /> &nbsp; <p>{profile.mail}</p>
                      </HStack>
                    )}
                    {profile.discord && (
                      <HStack>
                        <DiscordT /> &nbsp; <p>{profile.discord}</p>
                      </HStack>
                    )}
                  </LinksGrid>
                </Card>
              )}
            </Stack>
            {wallet.accountId === id && (
              <IconButtonWrapper>
                <EditProfileModal
                  profileInfo={profile}
                  onHandleSave={handleProfileEdit}
                />
              </IconButtonWrapper>
            )}
          </ProfileInfo>
          <ProfileNFTInfo>
            <Tabs>
              <StyledTabList>
                <StyledTab>{`Created`}</StyledTab>
                <StyledTab>{`Owned`}</StyledTab>
              </StyledTabList>
              <TabPanels>
                <TabPanel>
                  <CreatedNFTs id={id} />
                </TabPanel>
                <TabPanel>
                  <MyCollectedNFTs id={id} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ProfileNFTInfo>
        </ProfileContainer>
      </Container>
    </AppLayout>
  )
}

const Container = styled.div``
const Banner = styled.div`
  position: relative;
  height: 650px;
  width: 100%;
  display: block;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 255, 255, 0.06) 100%
  );
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 10;
`
const LinksGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`
const LogoImage = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 7px solid #ffffff;
  position: absolute;
  top: -100px;
  left: calc(50% - 100px);
  z-index: 1000;
`
const ProfileContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  padding: 0 50px;
  p {
    font-size: 18px;
    font-weight: 400;
    font-family: Mulish;
  }
  h3 {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 5px;
  }
  h2 {
    font-size: 22px;
    font-weight: 600;
  }
  h1 {
    font-size: 40px;
    font-weight: 600;
    text-align: center;
  }
`
const ProfileInfo = styled.div`
  padding: 200px 50px 50px 50px;
  background: rgba(05, 06, 22, 0.2);
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09), inset 0px 7px 24px #6d6d78;
  /* Note: backdrop-filter has minimal browser support */

  border-radius: 0px 0px 20px 20px;
  height: fit-content;
  position: relative;
`
const VerticalDivider = styled.div`
  border: 1px solid #5f5858;
  transform: rotate(90deg);
  width: 90px;
  height: 0px;
`
const Card = styled.div`
  background: rgba(05, 06, 22, 0.2);
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09), inset 0px 7px 24px #6d6d78;
  backdrop-filter: blur(40px);
  border-radius: 20px;
  padding: 20px;
`
const ProfileNFTInfo = styled.div`
  padding: 50px;
`
const StyledTabList = styled(TabList)`
  width: fit-content;
  border-bottom: 2px solid;
  border-color: rgba(255, 255, 255, 0.1);
  font-weight: 400;
  margin: 0px !important;
  [aria-selected='true'] {
    border-color: #ffffff !important;
    border-bottom: 2px solid;
    font-weight: 600;
    color: white;
  }
`

const StyledTab = styled(Tab)`
  font-size: 22px;
  font-weight: 400;
  padding: 20px 40px;
`
const IconButtonWrapper = styled.div`
  position: absolute;
  right: 50px;
  top: 50px;
`
