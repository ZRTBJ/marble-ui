import { useEffect, useState } from 'react'
import { Text } from '../Text'
import { styled } from '../theme'
import Link from 'next/link'
import { Button } from '../Button'
import { UpRightArrow, CollapseUp, CollapseDown } from '../../icons'
import { IconWrapper } from '../IconWrapper'
import { APP_NAME } from '../../util/constants'
import { Github } from '../../icons/Github'
import { Medium } from '../../icons/Medium'
import { Discord } from '../../icons/Discord'
import { Telegram } from '../../icons/Telegram'
import { Twitter } from '../../icons/Twitter'
import { ChakraProvider, Stack, Flex, HStack } from '@chakra-ui/react'

export const FooterBar = () => {
  const [openQuickNav, setOpenQuickNav] = useState(false)
  const [openCommunityNav, setOpenCommunityNav] = useState(true)
  const [openCompanyNav, setOpenCompanyNav] = useState(true)

  const buttonIconCss = {
    borderRadius: '50%',
    background: 'rgba(18, 21, 33)',
    boxShadow:
      '0px 4px 40px rgba(42, 47, 50, 0.09), inset 0px 7px 24px #6D6D78',
    '& svg': {
      fill: 'white',
    },
    width: '45px',
    height: '45px',
    backdropFilter: 'blur(40px)',
  }
  return (
    <ChakraProvider>
      <StyledFooter>
        <Flex width="80%" justifyContent="space-between">
          <Stack width="40%">
            <ContainerForColumn className="bottom-desc-section">
              <Link href="/" passHref>
                <StyledLogo>
                  <StyledImage
                    src="/images/logotext.svg"
                    className="footer-logo"
                  />
                </StyledLogo>
              </Link>
              <Text
                className="footer-desc"
                css={{
                  color: '#C7C7C7',
                  fontSize: '18px',
                  padding: '$space$10 0',
                  lineHeight: '32px',
                }}
              >
                Marble is the first community-driven DAO on Near Network. Marble
                is an all-in-one platform with DeFi products, NFT Marketplace
                and exclusive NFTs of real artworks.
              </Text>
              <HStack spacing={3}>
                <Button
                  as="a"
                  href={process.env.NEXT_PUBLIC_DISCORD_LINK}
                  target="__blank"
                  icon={<IconWrapper icon={<Discord />} />}
                  css={buttonIconCss}
                />
                <Button
                  as="a"
                  href={process.env.NEXT_PUBLIC_TELEGRAM_LINK}
                  target="__blank"
                  icon={<IconWrapper icon={<Telegram />} />}
                  css={buttonIconCss}
                />
                <Button
                  as="a"
                  href={process.env.NEXT_PUBLIC_TWITTER_LINK}
                  target="__blank"
                  icon={<IconWrapper icon={<Twitter />} />}
                  css={buttonIconCss}
                />
                <Button
                  as="a"
                  href={process.env.NEXT_PUBLIC_INTERFACE_GITHUB_LINK}
                  target="__blank"
                  icon={<IconWrapper icon={<Github />} />}
                  css={buttonIconCss}
                />
                <Button
                  as="a"
                  href={process.env.NEXT_PUBLIC_MEDIUM_LINK}
                  target="__blank"
                  icon={<IconWrapper icon={<Medium />} />}
                  css={buttonIconCss}
                />
              </HStack>
            </ContainerForColumn>
          </Stack>
          <Stack width="20%">
            <ContainerForColumn className="bottom-quick-section">
              <h3 className="desktop-section">MARBLE</h3>
              <ContainerForFooterLinks
                className={`footer-links ${openQuickNav ? 'open' : 'close'}`}
              >
                <Link href="#" passHref>
                  Feed
                </Link>
                <Link href="#" passHref>
                  Browse
                </Link>
                <Link href="/transfer" passHref>
                  DeFi
                </Link>
              </ContainerForFooterLinks>
            </ContainerForColumn>
          </Stack>
          <Stack width="20%">
            <ContainerForColumn className="bottom-community-section">
              <h3 className="desktop-section">COMMUNITY</h3>
              <h3
                className={`mobile-section collapse-header ${
                  openCommunityNav ? 'open' : 'close'
                }`}
                onClick={() => {
                  setOpenCommunityNav(!openCompanyNav)
                }}
              >
                Community
                {openCommunityNav ? (
                  <IconWrapper icon={<CollapseUp />} />
                ) : (
                  <IconWrapper icon={<CollapseDown />} />
                )}
              </h3>
              <ContainerForFooterLinks
                className={`footer-links ${
                  openCommunityNav ? 'open' : 'close'
                }`}
              >
                <Link href={process.env.NEXT_PUBLIC_MEDIUM_LINK} passHref>
                  Medium
                </Link>
                <Link href={process.env.NEXT_PUBLIC_TWITTER_LINK} passHref>
                  Twitter
                </Link>
                <Link href={process.env.NEXT_PUBLIC_DISCORD_LINK} passHref>
                  Discord
                </Link>
                <Link href={process.env.NEXT_PUBLIC_TELEGRAM_LINK} passHref>
                  Telegram
                </Link>
              </ContainerForFooterLinks>
            </ContainerForColumn>
          </Stack>
          <Stack width="10%">
            <ContainerForColumn className="bottom-company-section">
              <h3 className="desktop-section">Company</h3>
              <h3
                className={`mobile-section collapse-header ${
                  openCompanyNav ? 'open' : 'close'
                }`}
                onClick={() => {
                  setOpenCompanyNav(!openCompanyNav)
                }}
              >
                Company
                {openCompanyNav ? (
                  <IconWrapper icon={<CollapseUp />} />
                ) : (
                  <IconWrapper icon={<CollapseDown />} />
                )}
              </h3>
              <ContainerForFooterLinks
                className={`footer-links ${openCompanyNav ? 'open' : 'close'}`}
              >
                <Link href="https://marbledao.finance" passHref>
                  Home
                </Link>
                <Link
                  href="https://daodao.zone/dao/juno1zz3gc2p9ntzgjt8dh4dfqnlptdynxlgd4j7u2lutwdg5xwlm4pcqyxnecp"
                  passHref
                >
                  DAO
                </Link>
                <Link
                  href={process.env.NEXT_PUBLIC_INTERFACE_GITHUB_LINK}
                  passHref
                >
                  Github
                </Link>
                <Link href="https://discord.gg/zKbNUByUHR" passHref>
                  Support
                </Link>
              </ContainerForFooterLinks>
            </ContainerForColumn>
          </Stack>
        </Flex>
        <HorizontalDivider />
        <FooterText>
          Copyright ©️ 2022 Marble Dao. All rights reserved.
        </FooterText>
      </StyledFooter>
    </ChakraProvider>
  )
}
const HorizontalDivider = styled('div', {
  height: 0,
  border: '1px solid #363B4E',
  width: '80%',
  margin: '40px 0',
})
const StyledImage = styled('img', {
  // width: "50px",
  marginRight: '10px',
})
const StyledLogo = styled('div', {
  display: 'flex',
  flexDirection: 'row',
})
const ContainerForColumn = styled('div', {
  display: 'flex',
  minWidth: '180px',
  flexDirection: 'column',
  ' h3': {
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '10px',
  },
})

const ContainerForFooterLinks = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  ' a': {
    padding: '15px',
    color: '$textColors$white',
    fontSize: '16px',
    opacity: '0.5',
  },
  height: '100%',
})
const StyledFooter = styled('footer', {
  color: 'white',
  position: 'relative',
  padding: '200px 0 50px 0',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundImage: `url(/images/CurveLine.svg)`,
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
})

const FooterText = styled('div', {
  fontSize: '16px',
  textAlign: 'center',
  opacity: '0.5',
})
