import * as nearAPI from 'near-api-js'
import { CONTRACT_NAME } from 'util/near'

export const useConnectWallet = () => {
  const { connect, keyStores, WalletConnection } = nearAPI
  const config = {
    networkId: process.env.NEXT_PUBLIC_NODE_URL,
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    headers: {},
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    explorerUrl: 'https://explorer.testnet.near.org',
  }

  async function connectWallet() {
    // connect to NEAR
    const near = await connect(config)

    // create wallet connection
    const wallet = new WalletConnection(near, CONTRACT_NAME)
    const signed = wallet.isSignedIn()
    wallet.requestSignIn(
      process.env.NEXT_PUBLIC_CONTRACT_NAME, // contract requesting access
      process.env.NEXT_PUBLIC_SITE_TITLE, // optional,
      `${window.location.origin}${window.location.pathname}`
    )
  }

  async function isSigned() {
    const near = await connect(config)

    // create wallet connection
    // @ts-ignore
    const wallet = new WalletConnection(near)
    const signed = wallet.isSignedIn()
    return signed
  }

  async function setAccount() {
    const near = await connect(config)

    // create wallet connection
    // @ts-ignore
    const wallet = new WalletConnection(near)
    if (wallet.getAccountId()) {
      const accountId = wallet.getAccountId()
      localStorage.setItem('accountId', accountId)
      return accountId
    } else return null
  }

  async function getAccount() {
    const near = await connect(config)

    // create wallet connection
    // @ts-ignore
    const wallet = new WalletConnection(near)
    const account = wallet.account()
    return account
  }

  async function disconnectWallet() {
    // connect to NEAR
    const near = await connect(config)

    // create wallet connection
    // @ts-ignore
    const wallet = new WalletConnection(near)
    await wallet.signOut()
    localStorage.removeItem('accountId')
  }
  return { connectWallet, disconnectWallet, setAccount, getAccount, isSigned }
}
