// src/pages/_app.tsx
import type { AppProps } from 'next/app'

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiConfig, sepolia } from 'wagmi'
import { arbitrum, goerli, hardhat, mainnet, polygon, polygonMumbai } from 'wagmi/chains'

import { AdminLayout } from 'layout'
import { SimpleLayout } from 'layout/SimpleLayout';

import { ContractsContext, useContractContextHook } from 'hooks/useContractContextHook'

import '@fortawesome/fontawesome-svg-core/styles.css'
import '../styles/globals.scss'
import '../styles/_app.css';
import { ErrorBoundary } from 'react-error-boundary'

// 1. Get projectId
const projectId = '75b26af85c05f056c40e2788823e66ae'

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, arbitrum, hardhat, polygon, polygonMumbai, goerli, sepolia]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains })

function MyApp({ Component, pageProps }: AppProps) {

	const contractsContextDefaultValue = useContractContextHook();

  return (
		<ErrorBoundary fallback={<div>Something went wrong</div>}>
			<WagmiConfig config={wagmiConfig}>
				<ContractsContext.Provider value={contractsContextDefaultValue} >
					<AdminLayout>
						<Component {...pageProps} />
					</AdminLayout>
				</ContractsContext.Provider>
			</WagmiConfig>
		</ErrorBoundary>
  )
}

export default MyApp
