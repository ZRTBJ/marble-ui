import React, { useReducer, useState, useEffect } from 'react'
import Link from 'next/link'
import { Stack, Text, HStack, IconButton, Flex, Grid } from '@chakra-ui/react'
import { CloseIcon, AddIcon } from '@chakra-ui/icons'
import { Button } from 'components/Button'
import { toast } from 'react-toastify'
import { AppLayout } from 'components/Layout/AppLayout'
import { nftFunctionCall, checkTransaction } from 'util/near'
import { getCurrentWallet } from 'util/sender-wallet'
import styled from 'styled-components'

export default function Collection() {
  const wallet = getCurrentWallet()
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [royaltyValues, setRoyaltyValues] = useState([
    { name: wallet.accountId, price: '10' },
  ])
  const handleRoyaltyChange = (i, e) => {
    const newFormValues = [...royaltyValues]
    newFormValues[i][e.target.name] = e.target.value

    setRoyaltyValues(newFormValues)
  }
  const addFormFields = () => {
    setRoyaltyValues([...royaltyValues, { name: '', price: '' }])
  }

  const removeFormFields = (i, e) => {
    const newFormValues = [...royaltyValues]
    newFormValues.splice(i, 1)
    setRoyaltyValues(newFormValues)
  }

  const handleChange = async () => {
    if (!wallet.accountId) {
      toast.warning(`Please connect your wallet.`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      return
    }
    if (name == '') {
      toast.warning(`Please input the collection name.`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      return
    }
    const royalty = {}
    let totalRoyalty = 0
    royaltyValues.forEach((element) => {
      if (!element.price || !element.name) return
      royalty[element.name] = Number(element.price) * 100
      totalRoyalty += Number(element.price)
    })
    if (totalRoyalty > 70) {
      toast.warning(`Maximum royalty cannot exceed 70%.`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      return
    }
    try {
      await nftFunctionCall({
        methodName: 'nft_create_series',
        args: {
          token_metadata: {
            description: symbol,
            copies: 10000,
            title: name,
          },
          price: null,
          royalty: royalty,
          creator_id: wallet.accountId,
        },
        amount: '0.00854',
      })
    } catch (error) {
      console.log('Create series error: ', error)
    }
  }
  return (
    <AppLayout fullWidth={true}>
      {wallet.accountId && (
        <Container>
          <Stack spacing="50px">
            <Title>Create On Marble Dao</Title>
            <Collections>
              <Stack spacing="50px">
                <Stack>
                  <Text fontSize="30px" fontWeight="700">
                    Create A Collection
                  </Text>
                  <SubText>Deploy a smart contract to showcase NFTs</SubText>
                </Stack>
                <Stack>
                  <Text fontSize="20px" fontWeight="700">
                    Set Up Your Smart Contract
                  </Text>
                  <SubText>
                    The following details are used to create your smart
                    contract. They will <br /> be added to the blockchain and
                    cannot be edited.
                  </SubText>
                  <StyledLink>Learn more about smart contracts</StyledLink>
                </Stack>
                <Stack>
                  <Text marginLeft="30px" fontSize="14px" fontWeight="700">
                    Collection Name
                  </Text>
                  <StyledInput
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                    }}
                  />
                </Stack>
                <Stack>
                  <Text marginLeft="30px" fontSize="14px" fontWeight="700">
                    Collection Symbol
                  </Text>
                  <StyledInput
                    value={symbol}
                    onChange={(e) => {
                      setSymbol(e.target.value)
                    }}
                  />
                </Stack>
                <Stack>
                  <Text fontSize="30px" fontWeight="600">
                    ROYALTY
                  </Text>
                  <Text fontSize="16px" fontWeight="500" fontFamily="Mulish">
                    Enable a split to autonatically divide any funds or
                    royalties earned from the <br /> NFT with up to five
                    recipients, including yourself.
                  </Text>
                </Stack>
                <Stack width="100%">
                  {royaltyValues.map((element, index) => (
                    <Grid templateColumns="repeat(2, 1fr)" gap={6} key={index}>
                      <Stack>
                        {index === 0 && (
                          <Text
                            marginLeft="30px"
                            fontSize="14px"
                            fontWeight="700"
                          >
                            Account Name
                          </Text>
                        )}
                        <StyledInput
                          name="name"
                          value={element.name || ''}
                          onChange={(e) => handleRoyaltyChange(index, e)}
                        />
                      </Stack>

                      <HStack justifyContent="space-between">
                        <Stack width={index ? '80%' : '100%'}>
                          {index === 0 && (
                            <Text
                              marginLeft="30px"
                              fontSize="14px"
                              fontWeight="700"
                            >
                              Percentage Fee(%)
                            </Text>
                          )}
                          <StyledInput
                            name="price"
                            type="number"
                            value={element.price || ''}
                            onChange={(e) => handleRoyaltyChange(index, e)}
                            style={{ marginRight: '20px' }}
                          />
                        </Stack>
                        {index ? (
                          <IconWrapper width="70px">
                            <IconButton
                              aria-label="icon"
                              icon={<CloseIcon />}
                              onClick={(e) => removeFormFields(index, e)}
                            />
                          </IconWrapper>
                        ) : null}
                      </HStack>
                    </Grid>
                  ))}
                  {royaltyValues.length < 5 && (
                    <IconWrapper>
                      <IconButton
                        aria-label="icon"
                        icon={<AddIcon />}
                        onClick={addFormFields}
                        width="100%"
                      />
                    </IconWrapper>
                  )}
                </Stack>
                <Stack padding="0 20%">
                  <Button
                    className="btn-buy btn-default"
                    css={{
                      background: '$white',
                      color: '$black',
                      stroke: '$black',
                      width: '100%',
                      padding: '20px',
                    }}
                    variant="primary"
                    size="large"
                    onClick={handleChange}
                  >
                    Continue
                  </Button>
                </Stack>
              </Stack>
            </Collections>
          </Stack>
        </Container>
      )}
    </AppLayout>
  )
}

const Container = styled.div`
  padding: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const Title = styled.div`
  font-size: 46px;
  font-weight: 600;
  text-align: center;
`
const Collections = styled.div`
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 255, 255, 0.06) 100%
  );
  box-shadow: 0px 7px 14px rgba(0, 0, 0, 0.1),
    inset 0px 14px 24px rgba(17, 20, 29, 0.4);
  backdrop-filter: blur(30px);
  border-radius: 30px;
  width: 1000px;
  padding: 50px;
  border: 1px solid;
  border-image-source: linear-gradient(
    106.01deg,
    rgba(255, 255, 255, 0.2) 1.02%,
    rgba(255, 255, 255, 0) 100%
  );
`
const SubText = styled.div`
  font-size: 18px;
  font-family: Mulish;
  font-weight: 600;
`
const StyledLink = styled.a`
  font-size: 18px;
  font-family: Mulish;
  font-weight: 600;
  color: #cccccc;
`

const StyledInput = styled.input`
  background: #272734;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09);
  backdrop-filter: blur(40px);
  border-radius: 20px;
  padding: 20px;
  font-size: 20px;
  font-family: Mulish;
`
const IconWrapper = styled.div<{ width?: string; m?: string }>`
  background: rgba(225, 225, 225, 0.3);
  padding: 20px;
  display: flex;
  width: ${({ width }) => width || '100%'};
  height: 70px;
  border-radius: 20px;
  margin: ${({ m }) => m || '0'};
  align-items: center;
  justify-content: center;
`
