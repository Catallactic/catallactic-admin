"use client";

import { ErrorBoundary } from 'react-error-boundary'

import { AdminLayout } from 'layout'
import { SimpleLayout } from 'layout/SimpleLayout';

import { ContractsContext, useContractContextHook } from 'hooks/useContractContextHook'

import '@fortawesome/fontawesome-svg-core/styles.css'
import '../styles/globals.scss'
import '../styles/_app.css';

import injectedModule from '@web3-onboard/injected-wallets'
import { init, Web3OnboardProvider } from '@web3-onboard/react'

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

const supportedChains = [
	{
		id: 62298,
		token: 'cBTC',
		label: 'Citrea Devnet',
		rpcUrl: 'https://rpc.devnet.citrea.xyz'
	},
	{
		id: 686868,
		token: 'BTC',
		label: 'Merlin Testnet',
		rpcUrl: 'https://testnet-rpc.merlinchain.io'
	},
	{
		id: 31_337,
		token: 'ETH',
		label: 'Hardhat',
		rpcUrl: 'http://127.0.0.1:8545'
	},
];


const wallets = injectedModule()
const web3Onboard = init({
	// This javascript object is unordered meaning props do not require a certain order
	wallets: [wallets],
	chains: supportedChains,
	appMetadata: {
		name: 'Token Swap',
		description: 'Swap tokens for other tokens',
		recommendedInjectedWallets: [
			{ name: 'MetaMask', url: 'https://metamask.io' }
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

const wallets2 = web3Onboard.state.select('wallets')
wallets2.subscribe(wallet => {
	console.log("Changed wallet" + wallet)
	console.log(wallet)
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

						<ContractsContext.Provider value={contractsContextDefaultValue} >

								<html lang="en">
									<body>
										<AdminLayout>
											{children}
										</AdminLayout>
									</body>
								</html>

						</ContractsContext.Provider>

			</ErrorBoundary>
		</Web3OnboardProvider>
  )
}

export default RootLayout
