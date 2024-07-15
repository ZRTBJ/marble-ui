import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '../Button'
import { useBaseTokenInfo } from 'hooks/useTokenInfo'
import { getTokenBalance } from 'hooks/useTokenBalance'
import { useConnectWallet } from '../../hooks/useConnectWallet'
import { useRouter } from 'next/router'
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { getProfileData } from 'store/actions/profileAction'
import {
  Astronaut,
  Nav,
  RoundedLeft,
  Setting,
  Help,
  Disconnect,
} from '../../icons'
import { IconWrapper } from '../IconWrapper'
import { ConnectedWalletButton } from '../ConnectedWalletButton'
import { getReducedAddress } from 'util/conversion'
import { RoundedIcon, RoundedIconComponent } from 'components/RoundedIcon'
import { styled } from '../theme'
import { __TEST_MODE__ } from '../../util/constants'
import { default_image } from '../../util/constants'

export function NavigationSidebar({ openNav, setOpenNav }) {
  const [accountId, setAccountId] = useState('')
  const profile = useSelector((state: any) => state.profileData.profile_status)
  const { connectWallet, disconnectWallet, setAccount } = useConnectWallet()
  const { pathname, push } = useRouter()
  const [balance, setBalance] = useState(0)
  const baseToken = useBaseTokenInfo()
  const dispatch = useDispatch()
  useEffect(() => {
    // setBalance(0)
    getTokenBalance(baseToken).then((balance) => {
      setBalance(balance)
    })
  }, [baseToken])
  useEffect(() => {
    console.log('Rerenders')
    setAccount().then((id) => {
      setAccountId(id)
    })
  }, [])
  useEffect(() => {
    getProfileData(accountId, dispatch)
  }, [accountId])

  const disconnect = async () => {
    await disconnectWallet()
    push('/')
    setAccountId('')
  }

  const isActive = (path) => (pathname === path ? 'active' : '')

  const StyledImageForLogoText = styled('img', {
    borderRadius: '0%',
  })
  return (
    <StyledWrapper className={`wrap-header ${openNav ? 'open' : ''}`}>
      <StyledMenuContainer className="wrap-menu container">
        <IconWrapper
          className="mobile-nav"
          type="button"
          icon={<Nav />}
          onClick={() => {
            setOpenNav(!openNav)
          }}
        />

        <StyledListForLinks className="top-menu-links">
          <Link href="/" passHref>
            <StyledDivForLogo as="a">
              <StyledImageForLogoText
                className="logo-img"
                src="/images/logotext.svg"
              />
            </StyledDivForLogo>
          </Link>
          <VerticalDivider />
          <StyledLink>
            <Link href="https://app.marbledao.finance/dashboard" passHref>
              <a className="dropdown-item">
                <span>Feed</span>
              </a>
            </Link>
          </StyledLink>
          <StyledLink>
            <Link href="/explore" passHref>
              <a className="dropdown-item">
                <span className={isActive('/explore')}>Browse</span>
              </a>
            </Link>
          </StyledLink>
          <StyledLink>
            <Link href="/explore" passHref>
              <a className="dropdown-item">
                <span className={isActive('/defi')}>DeFi</span>
              </a>
            </Link>
          </StyledLink>
        </StyledListForLinks>
        <ButtonField>
          {accountId ? (
            <Menu>
              <MenuButton
                borderRadius="50%"
                border="3px solid rgba(255, 255, 255, 0.2)"
              >
                <RoundedIcon
                  size="36px"
                  src={
                    profile.avatar
                      ? process.env.NEXT_PUBLIC_PINATA_URL + profile.avatar
                      : default_image
                  }
                />
              </MenuButton>
              <StyledMenuList>
                <Link href={`/profile/${accountId}`}>
                  <ProfileMenuItem>
                    <Flex>
                      <RoundedIconComponent size="58px" address={accountId} />
                    </Flex>
                    <RoundedLeft />
                  </ProfileMenuItem>
                </Link>
                <StyledMenuItem>
                  <VFlex>
                    <p>Wallet Balance</p>
                    <h1>{balance.toFixed(2)} Near</h1>
                  </VFlex>
                  <AddressWrapper>
                    <p>{getReducedAddress(accountId)}</p>&nbsp;
                    <GreenRound />
                  </AddressWrapper>
                </StyledMenuItem>
                <StyledMenuItem>
                  <Flex>
                    <Setting />
                    &nbsp; Settings
                  </Flex>
                  <RoundedLeft />
                </StyledMenuItem>
                <StyledMenuItem>
                  <Flex>
                    <Help />
                    &nbsp; Help
                  </Flex>
                  <RoundedLeft />
                </StyledMenuItem>
                <StyledMenuItem onClick={() => disconnect()}>
                  <Flex>
                    <Disconnect />
                    &nbsp; Disconnect
                  </Flex>
                  <RoundedLeft />
                </StyledMenuItem>
              </StyledMenuList>
            </Menu>
          ) : (
            <ConnectedWalletButton
              connected={!!accountId}
              walletName={accountId}
              onConnect={() => connectWallet()}
              onDisconnect={() => disconnect()}
            />
          )}
          {accountId && (
            <Link href="/create">
              <CreateButton>Create</CreateButton>
            </Link>
          )}
        </ButtonField>
      </StyledMenuContainer>
    </StyledWrapper>
  )
}

const StyledWrapper = styled('div', {
  color: '$colors$white',
  height: '118px',
  display: 'flex',
  alignItems: 'center',
  borderBottom: '1px solid #363B4E',
  background: 'rgba(8, 12, 28, 0.6)',
})
const GreenRound = styled('div', {
  width: '12px',
  height: '12px',
  background: '#24BE74',
  borderRadius: '50%',
})
const AddressWrapper = styled('div', {
  background:
    'linear-gradient(180deg, rgba(0, 0, 0, 0.06) 0%, rgba(0, 0, 0, 0.37) 100%)',
  boxShadow:
    '0px 7px 14px rgba(0, 0, 0, 0.1), inset 0px 14px 24px rgba(17, 20, 29, 0.4)',
  backdropFilter: 'blur(30px)',
  borderRadius: '10px',
  display: 'flex',
  ' p': {
    fontSize: '14px',
  },
  padding: '10px',
  alignItems: 'center',
})
const Flex = styled('div', {
  display: 'flex',
  alignItems: 'center',
  ' p': {
    fontSize: '22px',
  },
})
const VFlex = styled('div', {
  ' p': {
    fontSize: '14px',
    fontWeight: '400',
    fontFamily: 'Mulish',
  },
  ' h1': {
    fontSize: '20px',
    fontWeight: '700',
  },
})
const CreateButton = styled('div', {
  padding: '15px',
  background: '#FFFFFF',
  boxShadow:
    '0px 4px 40px rgba(42, 47, 50, 0.09), inset 0px 7px 8px rgba(0, 0, 0, 0.2)',
  borderRadius: '16px',
  cursor: 'pointer',
  color: 'Black',
  width: '130px',
  textAlign: 'center',
  marginLeft: '25px',
  fontWeight: '700',
})

const StyledMenuList = styled(MenuList, {
  boxShadow:
    '0px 7px 14px rgba(0, 0, 0, 0.1), inset 0px 14px 24px rgba(17, 20, 29, 0.4)',
  background:
    'linear-gradient(180deg, rgba(0, 0, 0, 0.06) 0%, #000000 100%) !important',
  borderRadius: '24px',
  border: '1px solid rgba(255,255,255,0.2)',
  padding: '20px',
  width: '400px',
  backdropFilter: 'blur(30px)',
})
const StyledMenuItem = styled('div', {
  background: 'rgba(05, 06, 22, 0.2)',
  boxShadow: '0px 4px 40px rgba(42, 47, 50, 0.09), inset 0px 7px 24px #6D6D78',
  backDropFilter: 'blur(40px)',
  borderRadius: '20px',
  padding: '20px 25px',
  margin: '10px 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  '&:hover': {
    opacity: '0.7 !important',
  },
})
const ProfileMenuItem = styled('div', {
  backDropFilter: 'blur(40px)',
  margin: '5px 0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
})

const StyledLink = styled('div', {
  fontSize: '16px',
  margin: '0 40px',
})

const StyledMenuContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',

  position: 'relative',
  zIndex: '$2',
  padding: '0 20px',
  width: '100%',
  ' a': {
    color: '$colors$white',
    display: 'flex',
    ' svg': {
      color: '$colors$white',
      stroke: '$colors$white',
    },
  },
})

const StyledListForLinks = styled('div', {
  display: 'flex',
  rowGap: '$space$2',
  flexDirection: 'row',
  alignItems: 'center',
})

const StyledDivForLogo = styled('div', {
  columnGap: '$space$4',
  alignItems: 'center',
  '& [data-logo]': {
    marginBottom: '$2',
  },
  fontSize: '35px',
  fontWeight: '700',
})

const ButtonField = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
})

const VerticalDivider = styled('div', {
  width: '1px',
  height: '60px',
  border: '1px solid #363B4E',
  margin: '0 20px',
})
