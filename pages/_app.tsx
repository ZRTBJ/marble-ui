import 'normalize.css'
import 'react-toastify/dist/ReactToastify.css'
import 'styles/globals.scss'
import 'focus-visible'

import React, { useReducer } from 'react'
import { Provider } from 'react-redux'
import type { AppProps } from 'next/app'
// import { ErrorBoundary } from 'components/ErrorBoundary'
import { RecoilRoot } from 'recoil'
import { QueryClientProvider } from 'react-query'
import { Portal } from '@reach/portal'
import { ToastContainer } from 'react-toastify'
import { TestnetDialog } from 'components/TestnetDialog'
import { queryClient } from 'services/queryClient'
import { __TEST_MODE__ } from '../util/constants'
import { wrapper, store } from '../store/store'

function SafeHydrate({ children }) {
  return (
    <div data-app-wrapper="" lang="en-US" suppressHydrationWarning>
      {typeof window === 'undefined' ? null : children}
    </div>
  )
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <SafeHydrate>
          {/* <ErrorBoundary> */}
          <Provider store={store}>
            <Component {...pageProps} />
            {__TEST_MODE__ && <TestnetDialog />}
            <Portal>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={true}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                toastStyle={{ zIndex: 150 }}
                style={{ width: 'auto' }}
              />
            </Portal>
          </Provider>
          {/* </ErrorBoundary> */}
        </SafeHydrate>
      </QueryClientProvider>
    </RecoilRoot>
  )
}

export default MyApp
