import React, { useReducer, useState, useEffect } from 'react'
import Head from 'next/head'
import { AppLayout } from 'components/Layout/AppLayout'
import CreateProfile from 'features/profile/create'
import { styled } from 'components/theme'

import { useConnectWallet } from '../../hooks/useConnectWallet'
import { ConnectedWalletButton } from 'components/ConnectedWalletButton'

export default function Home() {
  const [fullWidth, setFullWidth] = useState(true)
  const { connectWallet, disconnectWallet, setAccount } = useConnectWallet()
  const [accountId, setAccountId] = useState('')
  useEffect(() => {
    console.log('Rerenders')
    setAccount().then((id) => {
      setAccountId(formatId(id))
    })
  }, [])

  console.log('Render navbar')

  const formatId = (id) => {
    if (!id) return ''
    if (id.length < 20) return id
    else return id.slice(0, 8) + '...' + id.slice(id.length - 6)
  }

  const disconnect = async () => {
    await disconnectWallet()
    setAccountId('')
  }
  return (
    <AppLayout fullWidth={fullWidth}>
      {Boolean(accountId) && (
        <Container className="middle mauto">
          <CreateProfile />
        </Container>
      )}
      {!Boolean(accountId) && (
        <WalletContainer>
          <ConnectedWalletButton
            connected={Boolean(accountId)}
            walletName={accountId}
            onConnect={connectWallet}
            onDisconnect={disconnect}
          />
        </WalletContainer>
      )}
    </AppLayout>
  )
}

const Container = styled('div', {
  '&.middle': {
    width: '100%',
  },
})
const WalletContainer = styled('div', {
  justifyContent: 'center',
  margin: '$18 0',
  display: 'flex',
})
