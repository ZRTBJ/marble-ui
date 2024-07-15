import React from 'react'
import styled from 'styled-components'

const Card = ({ title, children }) => {
  return (
    <Container>
      <Title>{title}</Title>
      <Content>{children}</Content>
    </Container>
  )
}

const Container = styled.div`
  padding: 30px;
  width: 100%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
`

const Title = styled.div`
  font-size: 20px;
  font-weight: 700;
`

const Content = styled.div`
  padding: 10px 0 0 0;
`
export default Card
