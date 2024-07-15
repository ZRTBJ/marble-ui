import { Near, keyStores, utils, WalletConnection } from 'near-api-js';
import { functionCall } from 'near-api-js/lib/transaction';
import BN from 'bn.js';
import getConfig, { getExtraStablePoolConfig } from './config';
import * as nearAPI from 'near-api-js'
import SpecialWallet from './SpecialWallet';
import { JsonRpcProvider } from 'near-api-js/lib/providers';
// import { getCurrentWallet, senderWallet } from './sender-wallet';
import {
  WALLET_TYPE,
} from './sender-wallet';
import { useConnectWallet } from 'hooks/useConnectWallet';
import { getCurrentWallet } from './sender-wallet';

const config = getConfig();

export const CONTRACT_NAME = config.CONTRACT_NAME;

export const REF_ADBOARD_CONTRACT_ID = config.REF_ADBOARD_CONTRACT_ID;

export const POOL_TOKEN_REFRESH_INTERVAL = config.POOL_TOKEN_REFRESH_INTERVAL;

export const STABLE_TOKEN_IDS = config.STABLE_TOKEN_IDS;

export const STABLE_POOL_ID = config.STABLE_POOL_ID;

export const STABLE_POOL_USN_ID = config.STABLE_POOL_USN_ID;

export const STABLE_TOKEN_USN_IDS = config.STABLE_TOKEN_USN_IDS;

export const isStableToken = (id: string) => {
  return (
    STABLE_TOKEN_IDS.includes(id) ||
    STABLE_TOKEN_USN_IDS.includes(id) ||
    BTCIDS.includes(id) ||
    CUSDIDS.includes(id)
  );
};

export const {
  BTCIDS,
  CUSDIDS,
  BTC_STABLE_POOL_ID,
  CUSD_STABLE_POOL_ID,
  BTC_STABLE_POOL_INDEX,
  CUSD_STABLE_POOL_INDEX,
} = getExtraStablePoolConfig();

export const extraStableTokenIds = BTCIDS.concat(CUSDIDS).filter((_) => !!_);

export const AllStableTokenIds = new Array(
  // @ts-ignore
  ...new Set(
    STABLE_TOKEN_USN_IDS.concat(STABLE_TOKEN_IDS).concat(extraStableTokenIds)
  )
);

export const ALL_STABLE_POOL_IDS = [
  STABLE_POOL_ID,
  STABLE_POOL_USN_ID,
  BTC_STABLE_POOL_ID,
  CUSD_STABLE_POOL_ID,
]
  .filter((_) => _)
  .map((id) => id.toString());

export const BLACKLIST_POOL_IDS = config.BLACKLIST_POOL_IDS;

export const filterBlackListPools = (pool: any & { id: any }) =>
  !BLACKLIST_POOL_IDS.includes(pool.id.toString());

export const STABLE_TOKEN_INDEX = config.STABLE_TOKEN_INDEX;

export const STABLE_TOKEN_USN_INDEX = config.STABLE_TOKEN_USN_INDEX;

export const BTC_POOL_INDEX = getConfig().BTC_IDS_INDEX;
export const TOKEN_DENOMS = {
  'near':24,
  'hera.cmdev0.testnet':8
};
export const getStableTokenIndex = (stable_pool_id: string | number) => {
  const id = stable_pool_id.toString();
  switch (id) {
    case STABLE_POOL_ID.toString():
      return STABLE_TOKEN_INDEX;
    case STABLE_POOL_USN_ID.toString():
      return STABLE_TOKEN_USN_INDEX;
    case BTC_STABLE_POOL_ID:
      return BTC_STABLE_POOL_INDEX;
    case CUSD_STABLE_POOL_ID:
      return CUSD_STABLE_POOL_INDEX;
  }
};

export const isStablePool = (id: string | number) => {
  return ALL_STABLE_POOL_IDS.map((id) => id.toString()).includes(id.toString());
};

export const BTC_POOL_ID = config.BTC_POOL_ID;

export const REF_AIRDRAOP_CONTRACT_ID = config.REF_AIRDROP_CONTRACT_ID;

export const REF_TOKEN_ID = config.REF_TOKEN_ID;
const XREF_TOKEN_ID = getConfig().XREF_TOKEN_ID;

export const LP_STORAGE_AMOUNT = '0.01';

export const ONE_YOCTO_NEAR = '0.000000000000000000000001';

export const NFT_CONTRACT_NAME = config.NFT_CONTRACT_NAME;

export const MARKETPLACE_CONTRACT_NAME = config.MARKETPLACE_CONTRACT_NAME;
export const HERA_CONTRACT_NAME = config.HERA_CONTRACT_NAME
export const getGas = (gas: string) =>
  gas ? new BN(gas) : new BN('300000000000000');
export const getAmount = (amount: string) =>
  amount ? new BN(utils.format.parseNearAmount(amount)) : new BN('0');

export interface RefFiViewFunctionOptions {
  methodName: string;
  args?: object;
}

export interface RefFiFunctionCallOptions extends RefFiViewFunctionOptions {
  gas?: string;
  amount?: string;
}

export const refFiFunctionCall = ({
  methodName,
  args,
  gas,
  amount,
}: RefFiFunctionCallOptions) => {

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
    .functionCall(
      CONTRACT_NAME,
      methodName,
      args,
      getGas(gas),
      getAmount(amount)
    );
};

export const refFiViewFunction = ({
  methodName,
  args,
}: RefFiViewFunctionOptions) => {

  const { keyStores } = nearAPI;
  const keyStore = new keyStores.BrowserLocalStorageKeyStore()
  const config = {
    networkId: process.env.NEXT_PUBLIC_NODE_URL,
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
  return wallet.account().viewFunction(CONTRACT_NAME, methodName, args);
};

/////////////////////////////////////////////
/////////////////  NFT  /////////////////////
/////////////////////////////////////////////

export const nftViewFunction = ({
  methodName,
  args,
}: RefFiViewFunctionOptions) => {

  const { keyStores } = nearAPI;
  const keyStore = new keyStores.BrowserLocalStorageKeyStore()
  const config = {
    networkId: process.env.NEXT_PUBLIC_NODE_URL,
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
  const wallet = new SpecialWallet(near, NFT_CONTRACT_NAME);
  return wallet.account().viewFunction(NFT_CONTRACT_NAME, methodName, args);
};
export const nftFunctionCall = ({
  methodName,
  args,
  gas,
  amount,
}: RefFiFunctionCallOptions) => {
  const { wallet, wallet_type } = getCurrentWallet();
  return wallet
    .account()
    .functionCall(
      NFT_CONTRACT_NAME,
      methodName,
      args,
      getGas(gas),
      getAmount(amount)
    );
};

/////////////////////////////////////////////
//////////////  Marketplace  ////////////////
/////////////////////////////////////////////
export const marketplaceViewFunction = ({
  methodName,
  args,
}: RefFiViewFunctionOptions) => {

  const { keyStores } = nearAPI;
  const keyStore = new keyStores.BrowserLocalStorageKeyStore()
  const config = {
    networkId: process.env.NEXT_PUBLIC_NODE_URL,
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
  const wallet = new SpecialWallet(near, MARKETPLACE_CONTRACT_NAME);
  return wallet.account().viewFunction(MARKETPLACE_CONTRACT_NAME, methodName, args);
};
export const marketplaceFunctionCall = ({
  methodName,
  args,
  gas,
  amount,
}: RefFiFunctionCallOptions) => {
  const { wallet, wallet_type } = getCurrentWallet();
  return wallet
    .account()
    .functionCall(
      MARKETPLACE_CONTRACT_NAME,
      methodName,
      args,
      getGas(gas),
      getAmount(amount)
    );
};

export const refFiManyFunctionCalls = (
  functionCalls: RefFiFunctionCallOptions[]
) => {
  const actions = functionCalls.map((fc) =>
    functionCall(fc.methodName, fc.args, getGas(fc.gas), getAmount(fc.amount))
  );
  const { wallet } = getCurrentWallet();

  return wallet.account().sendTransactionWithActions(CONTRACT_NAME, actions);
};

export interface Transaction {
  receiverId: string;
  functionCalls: RefFiFunctionCallOptions[];
}

export const executeMultipleTransactions = async (
  transactions: Transaction[],
  callbackUrl?: string
) => {
  const { wallet } = getCurrentWallet()
  const currentTransactions =
    await Promise.all(
      transactions.map((t, i) => {
        return wallet.createTransaction({
          receiverId: t.receiverId,
          nonceOffset: i + 1,
          actions: t.functionCalls.map((fc) =>
            functionCall(
              fc.methodName,
              fc.args,
              getGas(fc.gas),
              getAmount(fc.amount)
            )
          ),
        });
      }))

  return wallet.requestSignTransactions(currentTransactions, callbackUrl);
};
export const sendTransactionForMarketplace = async(params: Transaction) => {
  const wallet = getCurrentWallet()
  const transactionForStorageDeposit:Transaction = {
    receiverId: MARKETPLACE_CONTRACT_NAME,
    functionCalls: [{
      methodName:'storage_deposit',
      args: {
        account_id: wallet.accountId
      },
      amount: '0.00859'
    }]
  }
  console.log('params: ', params)
  executeMultipleTransactions([transactionForStorageDeposit,params])
}
export const refFarmFunctionCall = ({
  methodName,
  args,
  gas,
  amount,
}: RefFiFunctionCallOptions) => {
  const { wallet, wallet_type } = getCurrentWallet();

  return wallet
    .account()
    .functionCall(
      process.env.NEXT_PUBLIC_FARM_CONTRACT_NAME,
      methodName,
      args,
      getAmount(amount)
    );
};
export const checkTransactionStatus = (txHash: string) => {
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
  return near.connection.provider.txStatus(
    txHash,
    getCurrentWallet().wallet.getAccountId()
  );
};
export const checkTransaction = (txHash: string) => {
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
  return (near.connection.provider as JsonRpcProvider).sendJsonRpc(
    'EXPERIMENTAL_tx_status',
    [txHash, getCurrentWallet().wallet.getAccountId()]
  );
};
export const refFarmViewFunction = ({
  methodName,
  args,
}: RefFiViewFunctionOptions) => {

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
  const wallet = new SpecialWallet(near, process.env.NEXT_PUBLIC_FARM_CONTRACT_NAME);
  return wallet.account().viewFunction(process.env.NEXT_PUBLIC_FARM_CONTRACT_NAME, methodName, args);
};

export const executeFarmMultipleTransactions = async (
  transactions: Transaction[],
  callbackUrl?: string
) => {
  const { wallet, wallet_type } = getCurrentWallet();

  const currentTransactions = await Promise.all(
    transactions.map((t, i) => {
      return wallet.createTransaction({
        receiverId: t.receiverId,
        nonceOffset: i + 1,
        actions: t.functionCalls.map((fc) =>
          functionCall(
            fc.methodName,
            fc.args,
            getGas(fc.gas),
            getAmount(fc.amount)
          )
        ),
      });
    }))

  return wallet.requestSignTransactions(currentTransactions, callbackUrl);
};

export interface RefContractViewFunctionOptions
  extends RefFiViewFunctionOptions {
  gas?: string;
  amount?: string;
  contarctId?: string;
}

export const refContractViewFunction = ({
  methodName,
  args,
}: RefContractViewFunctionOptions) => {

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
  return wallet.account().viewFunction(XREF_TOKEN_ID, methodName, args);
};
