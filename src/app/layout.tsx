"use client";

import { ErrorBoundary } from 'react-error-boundary'

import { AdminLayout } from 'layout'
import { SimpleLayout } from 'layout/SimpleLayout';

import injectedModule from '@web3-onboard/injected-wallets'
import { init, Web3OnboardProvider } from '@web3-onboard/react'
import { ContractsContext, useContractContextHook } from 'hooks/useContractContextHook'

import '@fortawesome/fontawesome-svg-core/styles.css'
import '../styles/globals.scss'
import '../styles/_app.css';
import { supportedChains } from 'config/config';
import { useEffect } from 'react';

declare var window: any

const web3Onboard = init({
	// This javascript object is unordered meaning props do not require a certain order
	wallets: [injectedModule()],
	chains: supportedChains,
	appMetadata: {
		name: 'Catallactic Tokenization Platform',
		description: 'Manage your CryptoCommodity Lifecycle',
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
	notify: {
		enabled: true,
		position: 'bottomRight',
	}
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

	// reload if changes
	useEffect(() => {

		console.log("Reload on changes configured")

		window.ethereum.on('accountsChanged', (accounts: any) => {
			window.location.reload();
			console.log("App reloaded");
		});
		window.ethereum.on('disconnect', (accounts: any) => {
			window.location.reload();
			console.log("App reloaded");
		});
		window.ethereum.on('chainChanged', (chainId: any) => {
			window.location.reload();
			console.log("App reloaded");
		});

	}, []);

	const contractsContextDefaultValue = useContractContextHook();

  return (
		<ErrorBoundary fallback={<div>Something went wrong</div>}>
			<Web3OnboardProvider web3Onboard={web3Onboard}>
				<ContractsContext.Provider value={contractsContextDefaultValue} >

					<html lang="en">
					<head>
						<title>Catallactic Tokenization Platform</title>
					  <link rel="icon" type="image/x-icon" href="favicon.ico"></link>
        		<meta name="description" content="Catallactic" />
					</head>
						<body>
							<AdminLayout>
								{children}
							</AdminLayout>
						</body>
					</html>

				</ContractsContext.Provider>
			</Web3OnboardProvider>
		</ErrorBoundary>
  )
}

export default RootLayout
