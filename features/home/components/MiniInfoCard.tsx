import React from 'react'
import styled from 'styled-components'

const MiniInfoCard = ({ title, name, logo }) => {
  return (
    <Container>
      <Title>{title}</Title>
      <Info>
        <Image src={logo} />
        <Name>&nbsp;{name}</Name>
      </Info>
    </Container>
  )
}

const Container = styled.div`
  width: 40%;
  height: 110px;
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09), inset 0px 7px 24px #6d6d78;
  border-radius: 20px;
  padding: 15px;
  border: 1px solid rgba(5, 6, 22, 0.2);
  backdrop-filter: blur(40px);
`

const Title = styled.div`
  font-size: 20px;
`
const Name = styled.div`
  font-size: 18px;
  font-weight: 600;
`
const Image = styled.img`
  width: 46px;
  height: 46px;
  border-radius: 50%;
`
const Info = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
`

export default MiniInfoCard
