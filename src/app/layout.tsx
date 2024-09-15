"use client";

import { ErrorBoundary } from 'react-error-boundary'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { hardhat, mainnet, polygonMumbai, sepolia } from 'viem/chains'
import { coinbaseWallet, injected, walletConnect, metaMask } from 'wagmi/connectors';

import { AdminLayout } from 'layout'
import { SimpleLayout } from 'layout/SimpleLayout';

import { merlinTestnet } from 'config/networks/merlin_testnet';
import { citreaDevnet } from 'config/networks/citrea_devnet';

import { ContractsContext, useContractContextHook } from 'hooks/useContractContextHook'

import '@fortawesome/fontawesome-svg-core/styles.css'
import '../styles/globals.scss'
import '../styles/_app.css';
import { WagmiProvider, createConfig, http } from 'wagmi';

import injectedModule from '@web3-onboard/injected-wallets'
import { useConnectWallet, init, Web3OnboardProvider } from '@web3-onboard/react'

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


const queryClient = new QueryClient()
const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})
;
const wallets = injectedModule()
const web3Onboard = init({
	// This javascript object is unordered meaning props do not require a certain order
	wallets: [wallets],
	chains: [
		{
			id: 42161,
			token: 'ARB-ETH',
			label: 'Arbitrum One',
			rpcUrl: 'https://rpc.ankr.com/arbitrum'
		},
		{
			id: '0xa4ba',
			token: 'ARB',
			label: 'Arbitrum Nova',
			rpcUrl: 'https://nova.arbitrum.io/rpc'
		},
		{
			id: '0x2105',
			token: 'ETH',
			label: 'Base',
			rpcUrl: 'https://mainnet.base.org'
		},
	],
	appMetadata: {
		name: 'Token Swap',
		description: 'Swap tokens for other tokens',
		recommendedInjectedWallets: [
			{ name: 'MetaMask', url: 'https://metamask.io' },
			{ name: 'Coinbase', url: 'https://wallet.coinbase.com/' }
		]
	},
	accountCenter: {
		desktop: {
			position: 'bottomRight',
			enabled: true,
			minimal: true
		},
		mobile: {
			position: 'bottomRight',
			enabled: true,
			minimal: true
		}
	},
})

function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

	const contractsContextDefaultValue = useContractContextHook();

  return (
		<Web3OnboardProvider web3Onboard={web3Onboard}>
			<ErrorBoundary fallback={<div>Something went wrong</div>}>
				<WagmiProvider config={wagmiConfig}>
					<QueryClientProvider client={queryClient}>
						<ContractsContext.Provider value={contractsContextDefaultValue} >

								<html lang="en">
									<body>
										<AdminLayout>
											{children}
										</AdminLayout>
									</body>
								</html>

						</ContractsContext.Provider>
					</QueryClientProvider>
				</WagmiProvider>
			</ErrorBoundary>
		</Web3OnboardProvider>
  )
}

export default RootLayout
