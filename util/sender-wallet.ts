import { createContext } from 'react';
import { Near } from 'near-api-js';
import * as nearAPI from 'near-api-js'
import SpecialWallet from './SpecialWallet';
import { getAmount, RefFiFunctionCallOptions, getGas } from './near';
import { scientificNotationToString } from './numbers';

export enum TRANSACTION_WALLET_TYPE {
  NEAR_WALLET = 'transactionHashes',
  SENDER_WALLET = 'transactionHashesSender',
}

export enum TRANSACTION_ERROR_TYPE {
  SLIPPAGE_VIOLATION = 'Slippage Violation',
  INVALID_PARAMS = 'Invalid Params',
}

const ERROR_PATTERN = {
  slippageErrorPattern: /ERR_MIN_AMOUNT|slippage error/i,
  invaliParamsErrorPattern: /invalid params/i,
};

export enum TRANSACTION_STATE {
  SUCCESS = 'success',
  FAIL = 'fail',
}

export const SENDER_WALLET_SIGNEDIN_STATE_KEY =
  'SENDER_WALLET_SIGNEDIN_STATE_VALUE';

export const getSenderLoginRes = () => {
  return localStorage.getItem(SENDER_WALLET_SIGNEDIN_STATE_KEY);
};

export const saveSenderLoginRes = (accountId?: string) => {
  localStorage.setItem(
    SENDER_WALLET_SIGNEDIN_STATE_KEY,
    // @ts-ignore
    `SENDER_WALLET_SIGNEDIN_STATE_KEY: ${accountId || window && window?.near.getAccountId()
    }`
  );
};

export const removeSenderLoginRes = () => {
  localStorage.removeItem(SENDER_WALLET_SIGNEDIN_STATE_KEY);
};

export function addQueryParams(
  baseUrl: string,
  queryParams: {
    [name: string]: string;
  }
) {
  const url = new URL(baseUrl);
  for (let key in queryParams) {
    const param = queryParams[key];
    if (param) url.searchParams.set(key, param);
  }
  return url.toString();
}

export const getTransactionHashes = (
  res: any,
  state: TRANSACTION_STATE
): string[] => {
  if (state === TRANSACTION_STATE.SUCCESS) {
    return res.response?.map((resp: any) => {
      return resp.transaction.hash;
    });
  } else {
    return [
      res?.response?.error?.context?.transactionHash ||
      res?.response?.error?.transaction_outcome?.id,
    ];
  }
};

export const setCallbackUrl = (res: any) => {
  const state = !res?.response?.error
    ? TRANSACTION_STATE.SUCCESS
    : TRANSACTION_STATE.FAIL;

  const errorType =
    state === TRANSACTION_STATE.FAIL ? res?.response?.error?.type : '';
  const transactionHashes = getTransactionHashes(res, state);

  const parsedTransactionHashes = transactionHashes?.join(',');

  const newHref = addQueryParams(
    window.location.origin + window.location.pathname,
    {
      [TRANSACTION_WALLET_TYPE.SENDER_WALLET]: parsedTransactionHashes,
      state: parsedTransactionHashes ? state : '',
      errorType,
    }
  );

  window.location.href = newHref;
};

//@ts-ignore
export enum WALLET_TYPE {
  WEB_WALLET = 'near-wallet',
  SENDER_WALLET = 'sender-wallet',
}

export enum SENDER_ERROR {
  USER_REJECT = 'User reject',
}

export const LOCK_INTERVAL = 1000 * 60 * 20;

function senderWalletFunc(window: Window) {
  this.requestSignIn = async function (contractId: string) {
    // @ts-ignore
    return window && window.near
      .requestSignIn({
        contractId,
      })
      .then((res: any) => {
        // Login reject
        if (res?.error && res?.error === SENDER_ERROR.USER_REJECT) {
          removeSenderLoginRes();
          window.location.reload();
        }

        // unknown error from near chain
        if (res?.error && res?.error?.type) {
          window.location.href = addQueryParams(window.location.href, {
            signInErrorType: res.error.type,
          });
        }

        // login success
        if (!res?.error) {
          saveSenderLoginRes();
          document
            .getElementsByClassName('sender-login-fail-toast')?.[0]
            ?.setAttribute('style', 'display:none');
        }

        return res;
      });
  };

  this.signOut = function () {
    // removeSenderLoginRes();
    // @ts-ignore
    const signedInContractSize = window && window?.near?.authData?.allKeys;

    if (
      signedInContractSize &&
      Number(Object.keys(signedInContractSize).length === 1)
    ) {
      // @ts-ignore
      return window && window.near.signOut();
    }

    if (
      signedInContractSize &&
      Object.keys(signedInContractSize).includes('aurora')
    ) {
      // @ts-ignore
      return window && window.near.signOut({
        contractId: 'aurora',
      });
    } else {
      // @ts-ignore
      return window && window.near.signOut({
        contractId: process.env.NEXT_PUBLIC_NODE_URL,
      });
    }
  };

  this.requestSignTransactions = async function (
    transactions: any,
    callbackUrl?: string
  ) {
    // @ts-ignore
    if (window && !window.near.isSignedIn()) {
      await this.requestSignIn(process.env.NEXT_PUBLIC_NODE_URL);
    }

    const senderTransaction = transactions.map((item: any) => {
      return {
        ...item,
        actions: item.functionCalls.map((fc: any) => ({
          ...fc,
          deposit: scientificNotationToString(getAmount(fc.amount).toString()),
          gas: scientificNotationToString(getGas(fc.gas).toString()),
        })),
      };
    });

    // @ts-ignore
    return window && window.near
      .requestSignTransactions({
        transactions: senderTransaction,
      })
      .then((res: any) => {
        setCallbackUrl(res);
      });
  };

  this.sendTransactionWithActions = async function (
    receiverId: string,
    functionCalls: RefFiFunctionCallOptions[]
  ) {
    // @ts-ignore
    if (window && !window.near.isSignedIn()) {
      await this.requestSignIn(process.env.NEXT_PUBLIC_NODE_URL);
    }

    // @ts-ignore
    return window && window.near
      .signAndSendTransaction({
        receiverId,
        actions: functionCalls.map((fc) => {
          return {
            ...fc,
            deposit: scientificNotationToString(
              getAmount(fc.amount).toString()
            ),
            gas: scientificNotationToString(getGas(fc.gas).toString()),
          };
        }),
      })
      .then((res: any) => {
        setCallbackUrl(res);
      });
  };

  this.walletType = WALLET_TYPE.SENDER_WALLET;
}

// senderWalletFunc.prototype = window ? window.near : undefined;

export const senderWallet = new (senderWalletFunc as any)();

export const getSenderWallet = (window: Window) => {
  // @ts-ignore
  senderWalletFunc.prototype = window && window.near;

  return new (senderWalletFunc as any)(window);
};

export const getAccountName = (accountId: string) => {
  const [account, network] = accountId.split('.');
  const niceAccountId = `${account.slice(0, 10)}...${network || ''}`;

  return account.length > 10 ? niceAccountId : accountId;
};

export const getCurrentWallet = () => {
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
  // @ts-ignore
  // Todo: must add appkeyprefix
  const wallet = new SpecialWallet(near);
  if (localStorage.getItem("accountId")) {
    wallet.account()
  }
  // To initialize connected wallet
  return {
    wallet: wallet,
    wallet_type: WALLET_TYPE.WEB_WALLET,
    accountId: wallet.getAccountId(),
    accountName: getAccountName(wallet.getAccountId()),
  };
};

export const WalletContext = createContext(null);

export const globalStateReducer = (
  state: { isSignedIn: boolean },
  action: { type: 'signIn' | 'signOut' }
) => {
  switch (action.type) {
    case 'signIn':
      return {
        ...state,
        isSignedIn: true,
      };
    case 'signOut':
      return {
        ...state,
        isSignedIn: false,
      };
  }
};
