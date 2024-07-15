import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { HStack, Text } from '@chakra-ui/react'
import { getLogoUriFromAddress } from 'util/api'
import { APP_NAME } from 'util/constants'

export const RoundedIcon = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
  border: 1px solid #ffffff;
`

export const RoundedIconComponent = ({ size, address, font = '14px' }) => {
  const [src, setSrc] = useState('')
  const [user, setUser] = useState('')
  useEffect(() => {
    ;(async () => {
      const { avatar, name } = await getLogoUriFromAddress(address)
      setSrc(avatar)
      setUser(name)
    })()
  }, [address])
  return (
    <HStack>
      <RoundedIcon size={size} src={src} />
      <Text fontSize={font} fontWeight="800" fontFamily="Mulish">
        {user}
      </Text>
    </HStack>
  )
}
