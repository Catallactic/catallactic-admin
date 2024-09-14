"use client";

import type { AppProps } from 'next/app'
import { ErrorBoundary } from 'react-error-boundary'

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiConfig, sepolia } from 'wagmi'
import { goerli, hardhat, polygonMumbai } from 'wagmi/chains'

import { AdminLayout } from 'layout'
import { SimpleLayout } from 'layout/SimpleLayout';

import { merlinTestnet } from 'config/networks/merlin_testnet';
import { citreaDevnet } from 'config/networks/citrea_devnet';

import { ContractsContext, useContractContextHook } from 'hooks/useContractContextHook'

import '@fortawesome/fontawesome-svg-core/styles.css'
import '../styles/globals.scss'
import '../styles/_app.css';

/*declare let window:any
window.ethereum.on('accountsChanged', (accounts: any) => {
	window.location.reload();
});
window.ethereum.on('disconnect', (accounts: any) => {
	window.location.reload();
});
const setListener = provider => {
	provider.on("chainChanged", _ => window.location.reload());
};
window.ethereum.on('chainChanged', (chainId: any) => {
	window.location.reload();
});*/

// 1. Get projectId
const projectId = '75b26af85c05f056c40e2788823e66ae'

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}
const chains = [citreaDevnet, merlinTestnet, polygonMumbai, hardhat]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains })

function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

	const contractsContextDefaultValue = useContractContextHook();

  return (
		<ErrorBoundary fallback={<div>Something went wrong</div>}>
			<WagmiConfig config={wagmiConfig}>
				<ContractsContext.Provider value={contractsContextDefaultValue} >
					<html lang="en">
						<body>
							<AdminLayout>
								{children}
							</AdminLayout>
						</body>
					</html>
				</ContractsContext.Provider>
			</WagmiConfig>
		</ErrorBoundary>
  )
}

export default RootLayout
