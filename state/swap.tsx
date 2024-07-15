import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { getPool, Pool, StablePool, getStablePool } from '../util/pool';
import {
  estimateSwap as estimateStableSwap,
  EstimateSwapView,
} from '../util/stable-swap';

import { TokenMetadata } from '../util/ft-contract';
import {
  percentLess,
} from '../util/numbers';

import {
  checkTransaction,
  estimateSwap,
  PoolMode,
  swap,
} from '../util/swap';

import { swap as stableSwap } from '../util/stable-swap';

import getConfig from '../util/config';

import { getCurrentWallet, WalletContext } from '../util/sender-wallet';
import {
  POOL_TOKEN_REFRESH_INTERVAL,
  STABLE_TOKEN_IDS,
  STABLE_POOL_ID,
} from '../util/near';

import {
  getExpectedOutputFromActions,
  getAverageFeeForRoutes,
} from '../util/smartRouteLogic';
import {
  failToast,
  getURLInfo,
  swapToast,
} from '../components/transactionTipPopUp';
import { getErrorMessage } from '../components/transactionTipPopUp';
import { checkTransactionStatus } from '../util/swap';
import {
  parsedTransactionSuccessValue,
  checkCrossSwapTransactions,
} from '../components/transactionTipPopUp';

export enum SWAP_MODE {
  NORMAL = 'normal',
  STABLE = 'stable',
}
const ONLY_ZEROS = /^0*\.?0*$/;

interface SwapOptions {
  tokenIn: TokenMetadata;
  tokenInAmount: string;
  tokenOut: TokenMetadata;
  slippageTolerance: number;
  setLoadingData?: (loading: boolean) => void;
  loadingData?: boolean;
  loadingTrigger?: boolean;
  setLoadingTrigger?: (loadingTrigger: boolean) => void;
  stablePool?: StablePool;
  loadingPause?: boolean;
  setLoadingPause?: (pause: boolean) => void;
  swapMode?: SWAP_MODE;
  reEstimateTrigger?: boolean;
  supportLedger?: boolean;
  requestingTrigger?: boolean;
  requested?: boolean;
  setRequested?: (requested?: boolean) => void;
  setRequestingTrigger?: (requestingTrigger?: boolean) => void;
}

export const useSwap = ({
  tokenIn,
  tokenInAmount,
  tokenOut,
  slippageTolerance,
  setLoadingData,
  loadingData,
  loadingTrigger,
  setLoadingTrigger,
  loadingPause,
  swapMode,
  reEstimateTrigger,
  supportLedger,
}: SwapOptions) => {
  const [pool, setPool] = useState<Pool>();
  const [canSwap, setCanSwap] = useState<boolean>();
  const [tokenOutAmount, setTokenOutAmount] = useState<string>('');
  const [swapError, setSwapError] = useState<Error>();
  const [swapsToDo, setSwapsToDo] = useState<EstimateSwapView[]>();
  const [avgFee, setAvgFee] = useState<number>(0);

  const router = useRouter()
  const [count, setCount] = useState<number>(0);

  const { txHash, pathname, errorType } = getURLInfo();

  const minAmountOut = tokenOutAmount
    ? percentLess(slippageTolerance, tokenOutAmount)
    : null;
  const refreshTime = Number(POOL_TOKEN_REFRESH_INTERVAL) * 1000;

  const setAverageFee = (estimates: EstimateSwapView[]) => {
    const estimate = estimates[0];

    let avgFee: number = 0;
    if (estimates.length === 1) {
      avgFee = estimates[0].pool.fee;
    } else if (
      estimate.status === PoolMode.SMART ||
      estimate.status === PoolMode.STABLE
    ) {
      avgFee = estimates.reduce((pre, cur) => pre + cur.pool.fee, 0);
    } else {
      avgFee = getAverageFeeForRoutes(
        estimate.allRoutes,
        estimate.allNodeRoutes,
        estimate.totalInputAmount
      );
    }
    setAvgFee(avgFee);
  };

  useEffect(() => {
    if (txHash && getCurrentWallet().wallet.isSignedIn()) {
      checkTransaction(txHash)
        .then((res: any) => {
          const transactionErrorType = getErrorMessage(res);
          const transaction = res.transaction;
          return {
            isSwap:
              transaction?.actions[1]?.['FunctionCall']?.method_name ===
              'ft_transfer_call' ||
              transaction?.actions[0]?.['FunctionCall']?.method_name ===
              'ft_transfer_call' ||
              transaction?.actions[0]?.['FunctionCall']?.method_name === 'swap',
            transactionErrorType,
          };
        })
        .then(({ isSwap, transactionErrorType }) => {
          if (isSwap) {
            !transactionErrorType && !errorType && swapToast(txHash);
            transactionErrorType && failToast(txHash, transactionErrorType);
          }
          router.push(pathname);
        });
    }
  }, [txHash]);

  const getEstimate = () => {
    setCanSwap(false);
    if (tokenIn && tokenOut && tokenIn.id !== tokenOut.id) {
      setSwapError(null);
      if (!tokenInAmount || ONLY_ZEROS.test(tokenInAmount)) {
        setTokenOutAmount('0');
        return;
      }

      estimateSwap({
        tokenIn,
        tokenOut,
        amountIn: tokenInAmount,
        setLoadingData,
        loadingTrigger: loadingTrigger && !loadingPause,
        swapMode,
        supportLedger,
      })
        .then(async (estimates) => {
          if (!estimates) throw '';
          if (tokenInAmount && !ONLY_ZEROS.test(tokenInAmount)) {
            setAverageFee(estimates);

            if (!loadingTrigger) {
              setSwapError(null);
              const expectedOut = (
                await getExpectedOutputFromActions(
                  estimates,
                  tokenOut.token_address,
                  slippageTolerance
                )
              ).toString();

              setTokenOutAmount(expectedOut);
              setSwapsToDo(estimates);
              setCanSwap(true);
            }
          }

          setPool(estimates[0].pool);
        })
        .catch((err) => {
          if (!loadingTrigger) {
            setCanSwap(false);
            setTokenOutAmount('');
            setSwapError(err);
          }
        })
        .finally(() => setLoadingTrigger(false));
    } else if (
      tokenIn &&
      tokenOut &&
      !tokenInAmount &&
      ONLY_ZEROS.test(tokenInAmount) &&
      tokenIn.id !== tokenOut.id
    ) {
      setTokenOutAmount('0');
    }
  };

  useEffect(() => {
    getEstimate();
  }, [
    loadingTrigger,
    loadingPause,
    tokenIn,
    tokenOut,
    tokenInAmount,
    reEstimateTrigger,
    supportLedger,
  ]);

  useEffect(() => {
    let id: any = null;
    if (!loadingTrigger && !loadingPause) {
      id = setInterval(() => {
        setLoadingTrigger(true);
        setCount(count + 1);
      }, refreshTime);
    } else {
      clearInterval(id);
    }
    return () => {
      clearInterval(id);
    };
  }, [count, loadingTrigger, loadingPause]);

  const makeSwap = (useNearBalance: boolean) => {
    swap({
      slippageTolerance,
      swapsToDo,
      tokenIn,
      amountIn: tokenInAmount,
      tokenOut,
      useNearBalance,
    }).catch(setSwapError);
  };

  return {
    canSwap,
    tokenOutAmount,
    minAmountOut,
    pool,
    setCanSwap,
    swapError,
    makeSwap,
    avgFee,
    pools: swapsToDo?.map((estimate) => estimate.pool),
    swapsToDo,
    isParallelSwap: swapsToDo?.every((e) => e.status === PoolMode.PARALLEL),
    isSmartRouteV2Swap: swapsToDo?.every((e) => e.status !== PoolMode.SMART),
  };
};

export const useStableSwap = ({
  tokenIn,
  tokenInAmount,
  tokenOut,
  slippageTolerance,
  loadingTrigger,
  setLoadingTrigger,
  stablePool,
}: SwapOptions) => {
  const [pool, setPool] = useState<Pool>();
  const [canSwap, setCanSwap] = useState<boolean>();
  const [tokenOutAmount, setTokenOutAmount] = useState<string>('');
  const [swapError, setSwapError] = useState<Error>();
  const [noFeeAmount, setNoFeeAmount] = useState<string>('');
  const [tokenInAmountMemo, setTokenInAmountMemo] = useState<string>('');
  const router = useRouter();

  const { txHash, pathname, errorType } = getURLInfo();

  const minAmountOut = tokenOutAmount
    ? percentLess(slippageTolerance, tokenOutAmount)
    : null;

  const getEstimate = () => {
    setCanSwap(false);
    if (tokenIn && tokenOut && tokenIn.id !== tokenOut.id) {
      setSwapError(null);

      estimateStableSwap({
        tokenIn,
        tokenOut,
        amountIn: tokenInAmount,
        loadingTrigger,
        setLoadingTrigger,
        StablePoolInfo: stablePool,
        setCanSwap,
      })
        .then(({ estimate, pool, dy }) => {
          if (!estimate || !pool) throw '';
          if (tokenInAmount && !ONLY_ZEROS.test(tokenInAmount)) {
            setCanSwap(true);
            if (!loadingTrigger) {
              setNoFeeAmount(dy);
              setTokenOutAmount(estimate);
            }
            setPool(pool);
          }
        })
        .catch((err) => {
          setCanSwap(false);
          setTokenOutAmount('');
          setNoFeeAmount('');
          setSwapError(err);
        });
    } else if (
      tokenIn &&
      tokenOut &&
      !tokenInAmount &&
      ONLY_ZEROS.test(tokenInAmount) &&
      tokenIn.id !== tokenOut.id
    ) {
      setTokenOutAmount('0');
    }
  };

  useEffect(() => {
    if (txHash && getCurrentWallet().wallet.isSignedIn()) {
      checkTransaction(txHash)
        .then((res: any) => {
          const slippageErrorPattern = /ERR_MIN_AMOUNT|slippage error/i;

          const isSlippageError = res.receipts_outcome.some((outcome: any) => {
            return slippageErrorPattern.test(
              outcome?.outcome?.status?.Failure?.ActionError?.kind
                ?.FunctionCallError?.ExecutionError
            );
          });

          const transaction = res.transaction;
          return {
            isSwap:
              transaction?.actions[1]?.['FunctionCall']?.method_name ===
              'ft_transfer_call' ||
              transaction?.actions[0]?.['FunctionCall']?.method_name ===
              'ft_transfer_call' ||
              transaction?.actions[0]?.['FunctionCall']?.method_name === 'swap',
            isSlippageError,
          };
        })
        .then(({ isSwap, isSlippageError }) => {
          if (isSwap) {
            !isSlippageError && !errorType && swapToast(txHash);
            isSlippageError && failToast(txHash, 'Slippage Violation');
          }
          router.push(pathname);
        });
    }
  }, [txHash]);

  useEffect(() => {
    setTokenInAmountMemo(tokenInAmount);
    if (loadingTrigger && !ONLY_ZEROS.test(tokenInAmountMemo)) return;

    getEstimate();
  }, [tokenIn, tokenOut, tokenInAmount]);

  useEffect(() => {
    getEstimate();
  }, [loadingTrigger]);

  const makeSwap = (useNearBalance: boolean) => {
    stableSwap({
      pool,
      tokenIn,
      amountIn: tokenInAmount,
      tokenOut,
      minAmountOut,
      useNearBalance,
    }).catch(setSwapError);
  };

  return {
    canSwap,
    tokenOutAmount,
    minAmountOut,
    pool,
    swapError,
    makeSwap,
    noFeeAmount,
  };
};

export const useCrossSwap = ({
  tokenIn,
  tokenInAmount,
  tokenOut,
  slippageTolerance,
  supportLedger,
  setRequested,
  loadingTrigger,
  setLoadingTrigger,
  loadingPause,
  requested,
}: SwapOptions) => {
  const [pool, setPool] = useState<Pool>();
  const [canSwap, setCanSwap] = useState<boolean>();
  const [tokenOutAmount, setTokenOutAmount] = useState<string>('');
  const [swapError, setSwapError] = useState<Error>();
  const [swapsToDo, setSwapsToDo] = useState<EstimateSwapView[]>();

  const [swapsToDoRef, setSwapsToDoRef] = useState<EstimateSwapView[]>();

  const [swapsToDoTri, setSwapsToDoTri] = useState<EstimateSwapView[]>();

  const [avgFee, setAvgFee] = useState<number>(0);

  const router = useRouter();
  const [count, setCount] = useState<number>(0);
  const refreshTime = Number(POOL_TOKEN_REFRESH_INTERVAL) * 1000;

  const { txHash, pathname, errorType, txHashes } = getURLInfo();

  const minAmountOut = tokenOutAmount
    ? percentLess(slippageTolerance, tokenOutAmount)
    : null;

  const { globalState } = useContext(WalletContext);

  const isSignedIn = globalState.isSignedIn;

  const setAverageFee = (estimates: EstimateSwapView[]) => {
    const estimate = estimates[0];

    let avgFee: number = 0;
    if (estimates.length === 1) {
      avgFee = estimates[0].pool.fee;
    } else if (
      estimate.status === PoolMode.SMART ||
      estimate.status === PoolMode.STABLE
    ) {
      avgFee = estimates.reduce((pre, cur) => pre + cur.pool.fee, 0);
    } else {
      avgFee = getAverageFeeForRoutes(
        estimate.allRoutes,
        estimate.allNodeRoutes,
        estimate.totalInputAmount
      );
    }
    setAvgFee(avgFee);
  };

  useEffect(() => {
    if (txHashes && txHashes.length > 0 && isSignedIn) {
      checkCrossSwapTransactions(txHashes).then(
        (res: { status: boolean; hash: string; errorType?: string }) => {
          const { status, hash, errorType } = res;

          if (errorType || !status) {
            failToast(hash, errorType);
          } else {
            swapToast(hash);
          }
        }
      );
      router.push(pathname);
    }
  }, [txHashes]);

  const getEstimateCrossSwap = () => {
    setCanSwap(false);
    setSwapError(null);

    estimateSwap({
      tokenIn,
      tokenOut,
      amountIn: tokenInAmount,
      loadingTrigger: loadingTrigger && !loadingPause,
      supportLedger,
      swapPro: true,
      setSwapsToDoRef,
      setSwapsToDoTri,
    })
      .then(async (estimates) => {
        if (tokenInAmount && !ONLY_ZEROS.test(tokenInAmount)) {
          setAverageFee(estimates);

          setSwapsToDo(estimates);
          setCanSwap(true);
        }

        setPool(estimates[0].pool);
      })
      .catch((err) => {
        setCanSwap(false);
        setTokenOutAmount('');
        setSwapError(err);
        console.error(err);
      })
      .finally(() => {
        loadingTrigger && !requested && setRequested(true);
        setLoadingTrigger(false);
      });
  };

  useEffect(() => {
    if (!swapsToDo) return;
    getExpectedOutputFromActions(
      swapsToDo,
      tokenOut.id,
      slippageTolerance
    ).then((res: any) => setTokenOutAmount(res.toString()));
  }, [swapsToDo, slippageTolerance]);

  useEffect(() => {
    if (loadingTrigger || requested) getEstimateCrossSwap();
  }, [loadingTrigger, supportLedger]);

  useEffect(() => {
    if (!requested) return;
    let id: any = null;
    if (!loadingTrigger && !loadingPause) {
      id = setInterval(() => {
        setLoadingTrigger(true);
        setCount(count + 1);
      }, refreshTime);
    } else {
      clearInterval(id);
    }
    return () => {
      clearInterval(id);
    };
  }, [count, loadingTrigger, loadingPause, requested]);

  const makeSwap = (useNearBalance: boolean) => {
    swap({
      slippageTolerance,
      swapsToDo,
      tokenIn,
      amountIn: tokenInAmount,
      tokenOut,
      useNearBalance,
    }).catch(setSwapError);
  };

  return {
    canSwap,
    tokenOutAmount,
    minAmountOut,
    pool,
    setCanSwap,
    swapError,
    makeSwap,
    avgFee,
    pools: swapsToDo?.map((estimate) => estimate.pool),
    swapsToDo,
    setSwapError,
    swapsToDoRef,
    swapsToDoTri,
  };
};
