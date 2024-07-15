import React from 'react'
import styled from 'styled-components'
import { Stack, HStack, Text } from '@chakra-ui/react'
import { convertMicroDenomToDenom } from 'util/conversion'
import { RoundedIcon } from 'components/RoundedIcon'
import { getLogoUriFromAddress } from 'util/api'

const SimpleTable = ({ data, unit, paymentToken }) => {
  return (
    <Container>
      {data.map((element, index) => (
        <BidContainer key={index} isEnd={data.length - 1 === index}>
          <HStack style={{ display: 'flex', alignItems: 'center' }}>
            <RoundedIcon
              size="56px"
              src={getLogoUriFromAddress(element.bidder_id)}
              style={{ margin: '0 10px' }}
            />
            <Text fontSize="20px" fontFamily="Mulish">
              {element.bidder_id}
            </Text>
          </HStack>
          <Text fontFamily="Mulish" fontSize="20px">
            {convertMicroDenomToDenom(element.price, unit).toFixed(2)}{' '}
            {paymentToken}
          </Text>
        </BidContainer>
      ))}
    </Container>
  )
}

const Container = styled.div`
  font-family: Mulish;
`
const BidContainer = styled.div<{ isEnd: boolean }>`
  display: flex;
  justify-content: space-between;
  ${({ isEnd }) => !isEnd && 'border-bottom: 1px solid #434960'};
  padding: 24px 0;
  align-items: center;
`

export default SimpleTable
