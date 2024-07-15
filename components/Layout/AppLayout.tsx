import styled from 'styled-components'
import { NavigationSidebar } from './NavigationSidebar'
import { FooterBar } from './FooterBar'
import { useEffect, useState } from 'react'
import TagManager from 'react-gtm-module'

const tagManagerArgs = {
  gtmId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
}

//TagManager.initialize(tagManagerArgs)

export const AppLayout = ({
  footerBar = <FooterBar />,
  children,
  fullWidth,
  hasBanner = false,
}) => {
  const [openNav, setOpenNav] = useState(false)

  useEffect(() => {
    TagManager.initialize(tagManagerArgs)
  }, [])
  return (
    <>
      <StyledWrapper>
        <NavigationSidebar openNav={openNav} setOpenNav={setOpenNav} />
        <div
          className={`main-section ${fullWidth ? 'fullWidth' : ''} ${
            hasBanner ? 'hasBanner' : ''
          }`}
        >
          <StyledContainer hasBanner={hasBanner}>
            <main>{children}</main>
          </StyledContainer>
        </div>
        {/*  <StyledBottom className="container main-bottom">
          <Container className="middle mauto jc-space-between">
            <Text variant="legend" css={{ paddingRight: '$20', color: '$textColors$disabled', fontSize: '$8' }}>
              {APP_NAME} v{process.env.NEXT_PUBLIC_APP_VERSION}
            </Text>
            <StyledDivForGrid>
              <Button className="link-feedback" css={{fontSize: '$8'}}
                as="a"
                href={process.env.NEXT_PUBLIC_FEEDBACK_LINK}
                target="__blank"
                variant="ghost"
              >
                Provide feedback
              </Button>
            </StyledDivForGrid>
          </Container>
        </StyledBottom>*/}
        <StyledFooter className="footer">
          <StyledFooterWrapper className="container">
            <StyledContainer>{footerBar}</StyledContainer>
          </StyledFooterWrapper>
        </StyledFooter>
      </StyledWrapper>
    </>
  )
}

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-image: url('/images/background.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  color: white;
`

const StyledContainer = styled.div<{ hasBanner: boolean }>`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const StyledFooter = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  margin-top: 100px;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px 0 0 0;
`

const StyledFooterWrapper = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
