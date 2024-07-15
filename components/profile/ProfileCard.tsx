import * as React from 'react'
import styled from 'styled-components'
import { default_image } from 'util/constants'

const ProfileCard = ({ profileInfo }) => {
  return (
    <Container>
      <ImgDiv className="nft-img-url">
        <Image
          src={
            profileInfo.banner
              ? process.env.NEXT_PUBLIC_PINATA_URL + profileInfo.banner
              : default_image
          }
          alt="NFT Image"
        />
        <LogoImage
          src={
            profileInfo.avatar
              ? process.env.NEXT_PUBLIC_PINATA_URL + profileInfo.avatar
              : default_image
          }
          alt="avatar"
        />
      </ImgDiv>
      <InfoDiv>
        <h1>{profileInfo.name}</h1>
        <h3>{profileInfo.id}</h3>
        <p>{profileInfo.bio}</p>
      </InfoDiv>
    </Container>
  )
}

export default ProfileCard

const Container = styled.div`
  padding: 30px;
  border-radius: 60px;
  background: rgba(05, 06, 22, 0.2);
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09), inset 0px 7px 24px #6d6d78;
  backdrop-filter: blur(40px);
  /* Note: backdrop-filter has minimal browser support */
  cursor: pointer;
  border-radius: 20px;
  height: 100%;
`
const ImgDiv = styled.div`
  width: 100%;
  padding-bottom: 100%;
  display: block;
  position: relative;
`
const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 20px;
`
const LogoImage = styled.img`
  position: absolute;
  order: 4px solid rgba(255, 255, 255, 0.8);
  width: 112px;
  height: 112px;
  border-radius: 50%;
  bottom: -56px;
  left: calc(50% - 56px);
`
const InfoDiv = styled.div`
  margin-top: 70px;
  text-align: center;
`
