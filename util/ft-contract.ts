import { Near, keyStores, utils, WalletConnection } from 'near-api-js';
import * as nearAPI from 'near-api-js';
import {
  RefFiFunctionCallOptions,
  getGas,
  getAmount,
  RefFiViewFunctionOptions,
  CONTRACT_NAME
} from './near';
import SpecialWallet from './SpecialWallet';
import metadataDefaults from './metadata';
import { storageDepositForFTAction } from './creators/storage';
import db from '../store/RefDatabase';
import { getCurrentWallet, WALLET_TYPE } from './sender-wallet';

export const NEAR_ICON =
  'https://near.org/wp-content/themes/near-19/assets/img/brand-icon.png';
const BANANA_ID = 'berryclub.ek.near';
const CHEDDAR_ID = 'token.cheddar.near';
const CUCUMBER_ID = 'farm.berryclub.ek.near';
const HAPI_ID = 'd9c2d319cd7e6177336b0a9c93c21cb48d84fb54.factory.bridge.near';
const WOO_ID = '4691937a7508860f876c9c0a2a617e7d9e945d4b.factory.bridge.near';

export const ftFunctionCall = (
  tokenId: string,
  { methodName, args, gas, amount }: RefFiFunctionCallOptions
) => {
  const { keyStores } = nearAPI;
  const keyStore = new keyStores.BrowserLocalStorageKeyStore()
  const config = {
    networkId: process.env.NODE_URL,
    keyStore: keyStore,
    headers: {},
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
  };
  const near = new Near({
    keyStore,
    headers: {},
    ...config,
  });

  // create wallet connection
  const wallet = new SpecialWallet(near, CONTRACT_NAME);
  return wallet
    .account()
    .functionCall(tokenId, methodName, args, getGas(gas), getAmount(amount));
};

export const ftViewFunction = (
  tokenId: string,
  { methodName, args }: RefFiViewFunctionOptions
) => {
  const { keyStores } = nearAPI;
  const keyStore = new keyStores.BrowserLocalStorageKeyStore()
  const config = {
    networkId: process.env.NODE_URL,
    keyStore: keyStore,
    headers: {},
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
  };
  const near = new Near({
    keyStore,
    headers: {},
    ...config,
  });

  // create wallet connection
  const wallet = new SpecialWallet(near, CONTRACT_NAME);
  return wallet.account().viewFunction(tokenId, methodName, args);
};

export const ftGetBalance = (tokenId: string, account_id?: string) => {
  return ftViewFunction(tokenId, {
    methodName: 'ft_balance_of',
    args: {
      account_id: account_id || getCurrentWallet().wallet.getAccountId(),
    },
  }).catch(() => '0');
};

export interface FTStorageBalance {
  total: string;
  available: string;
}
export const ftGetStorageBalance = (
  tokenId: string,
  accountId
): Promise<FTStorageBalance | null> => {
  return ftViewFunction(tokenId, {
    methodName: 'storage_balance_of',
    args: { account_id: accountId },
  });
};

export interface TokenMetadata {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  icon: string;
  ref?: number | string;
  near?: number | string;
  aurora?: number | string;
  total?: number;
  onRef?: boolean;
  onTri?: boolean;
  amountLabel?: string;
  amount?: number;
  token_address?: string,
  nearNonVisible?: number | string;
}
export const ftGetTokenMetadata = async (
  id: string
): Promise<TokenMetadata> => {
  try {
    let metadata = await db.allTokens().where({ id: id }).first();
    if (!metadata) {
      metadata = await ftViewFunction(id, {
        methodName: 'ft_metadata',
      });
      await db.allTokens().put({
        id: id,
        name: metadata.name,
        symbol: metadata.symbol,
        decimals: metadata.decimals,
        icon: metadata.icon,
      });
    }
    if (
      !metadata.icon ||
      metadata.icon === NEAR_ICON ||
      metadata.id === BANANA_ID ||
      metadata.id === CHEDDAR_ID ||
      metadata.id === CUCUMBER_ID ||
      metadata.id === HAPI_ID ||
      metadata.id === WOO_ID
    ) {
      metadata.icon = metadataDefaults[id];
    }
    return {
      id,
      ...metadata,
    };
  } catch (err) {
    return {
      id,
      name: id,
      symbol: id?.split('.')[0].slice(0, 8),
      decimals: 6,
      icon: null,
    };
  }
};

export const ftGetTokensMetadata = async (tokenIds: string[]) => {
  const tokensMetadata = await Promise.all(
    tokenIds.map((id: string) => ftGetTokenMetadata(id))
  );

  return tokensMetadata.reduce((pre, cur, i) => {
    return {
      ...pre,
      [tokenIds[i]]: cur,
    };
  }, {});
};

export const ftRegisterExchange = async (tokenId: string) => {
  return ftFunctionCall(tokenId, storageDepositForFTAction());
};
