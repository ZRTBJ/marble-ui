import {
  executeMultipleTransactions,
  ONE_YOCTO_NEAR,
  CONTRACT_NAME,
  REF_TOKEN_ID,
  refContractViewFunction,
  Transaction
} from './near';
import { toNonDivisibleNumber } from './numbers';
import { storageDepositAction } from './creators/storage';
import getConfig from './config';
import { checkTokenNeedsStorageDeposit } from './token';
import { ftGetStorageBalance } from './ft-contract';
import { NEW_ACCOUNT_STORAGE_COST } from './wrap-near';
import { getCurrentWallet } from './sender-wallet';

const XREF_TOKEN_ID = getConfig().XREF_TOKEN_ID;
export const XREF_TOKEN_DECIMALS = 18;

export const metadata = async () => {
  return await refContractViewFunction({
    methodName: 'contract_metadata',
  });
};

export const getPrice = async () => {
  return await refContractViewFunction({
    methodName: 'get_virtual_price',
  });
};

interface StakeOptions {
  amount: string;
  msg?: string;
}

export const stake = async ({ amount, msg = '' }: StakeOptions) => {
  const transactions: Transaction[] = [
    {
      receiverId: REF_TOKEN_ID,
      functionCalls: [
        {
          methodName: 'ft_transfer_call',
          args: {
            receiver_id: XREF_TOKEN_ID,
            amount: toNonDivisibleNumber(XREF_TOKEN_DECIMALS, amount),
            msg,
          },
          amount: ONE_YOCTO_NEAR,
          gas: '50000000000000',
        },
      ],
    },
  ];

  const balance = await ftGetStorageBalance(XREF_TOKEN_ID, getCurrentWallet().wallet.getAccountId());

  if (!balance || balance.total === '0') {
    transactions.unshift({
      receiverId: XREF_TOKEN_ID,
      functionCalls: [
        {
          methodName: 'storage_deposit',
          args: {
            account_id: getCurrentWallet().wallet.getAccountId(),
            registration_only: true,
          },
          gas: '50000000000000',
          amount: NEW_ACCOUNT_STORAGE_COST,
        },
      ],
    });
  }

  const needDeposit = await checkTokenNeedsStorageDeposit();
  if (needDeposit) {
    transactions.unshift({
      receiverId: CONTRACT_NAME,
      functionCalls: [storageDepositAction({ amount: needDeposit })],
    });
  }

  return executeMultipleTransactions(transactions);
};

interface UnstakeOptions {
  amount: string;
  msg?: string;
}
export const unstake = async ({ amount, msg = '' }: UnstakeOptions) => {
  const transactions: Transaction[] = [
    {
      receiverId: XREF_TOKEN_ID,
      functionCalls: [
        {
          methodName: 'unstake',
          args: {
            amount: toNonDivisibleNumber(XREF_TOKEN_DECIMALS, amount),
            msg,
          },
          amount: ONE_YOCTO_NEAR,
          gas: '100000000000000',
        },
      ],
    },
  ];

  const needDeposit = await checkTokenNeedsStorageDeposit();
  if (needDeposit) {
    transactions.unshift({
      receiverId: CONTRACT_NAME,
      functionCalls: [storageDepositAction({ amount: needDeposit })],
    });
  }

  return executeMultipleTransactions(transactions);
};
