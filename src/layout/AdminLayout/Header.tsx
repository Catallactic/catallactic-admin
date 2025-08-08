import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faCoins, faUser } from '@fortawesome/free-solid-svg-icons'
import { Button, Container, Dropdown, DropdownDivider, Nav } from 'react-bootstrap'
import Link from 'next/link'

import { useContext, useEffect } from 'react'
import { useConnectWallet, useNotifications, useSetChain, useWallets } from '@web3-onboard/react'
import { ContractsContext } from 'hooks/useContractContextHook'
import { useRouter } from 'next/navigation'
import ChevronList from './ChevronList'
import ChevronChildrenList from './ChevronChildrenList'

type HeaderProps = {
  toggleSidebar: () => void;
  toggleSidebarMd: () => void;
	process: string;
	setProcess: (process: string) => void;
}

export default function Header(props: HeaderProps) {

	// *************************************************************************************************************************
	// ******************************************************** Read Data ******************************************************
	// *************************************************************************************************************************
	const { toggleSidebar, toggleSidebarMd } = props

	const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
	const [{ connectedChain }] = useSetChain()
	const connectedWallets = useWallets()
	const [notifications, customNotification, updateNotify] = useNotifications()
  const router = useRouter()

	// https://github.com/blocknative/web3-onboard/issues/1666
	// https://github.com/blocknative/react-demo/blob/4bf91352edf35e42415989d3997688b529a4a4cf/src/App.js#L31
	// const [notifications, customNotification, updateNotify] = useNotifications()

	const { createEnvContracts, envContracts, loadYourCryptocommodities, CRYPTOCOMMODITIES, selectCrypto, unselectCrypto, selectedCrypto, contracts } = useContext(ContractsContext);

	// *************************************************************************************************************************
	// ******************************************************* Load Data *******************************************************
	// *************************************************************************************************************************
	var METAMASK_CHAINS:any;
	const getMETAMASK_CHAINS = function() {
		if(!METAMASK_CHAINS && process.env.NEXT_PUBLIC_METAMASK_CHAINS) {
			METAMASK_CHAINS = JSON.parse(process.env.NEXT_PUBLIC_METAMASK_CHAINS ? process.env.NEXT_PUBLIC_METAMASK_CHAINS : '[]' )
		}
		return METAMASK_CHAINS;
	}

	useEffect(() => {

		customNotification({
			eventCode: 'connect',
			type: 'success',
			message: connectedWallets.length > 0 ? 'Wallet has connected' : 'Wallet has disconnected',
			autoDismiss: 5000,
			//onClick: () => window.open(`https://www.blocknative.com`)
		})
		
		if (connectedWallets.length == 0) {
			console.log('No chainId found. Aborting..')
			return;
		}

		createEnvContracts(Number(connectedChain?.id) ? Number(connectedChain?.id) : 0);

		console.log('loadYourCryptocommodities');
		loadYourCryptocommodities();

	}, [connectedWallets])

	useEffect(() => {
		console.log('wallet: ', wallet)
		console.log('connectedWallets: ', connectedWallets)
		if (connectedWallets.length > 0 && !selectedCrypto) {
			console.log('Moving to /admin/cryptocommodities')
			router.push('/admin/cryptocommodities')
		}
	}, [connectedWallets, selectedCrypto])


	/*useEffect(() => {

		const wallets = web3Onboard.state.select('wallets')
		wallets.subscribe(wallet => {
			console.log("Changed wallet" + wallet)
			console.log(wallet)

			const { update, dismiss } = customNotification({
				eventCode: 'dbUpdate',
				type: 'hint',
				message: 'Custom hint notification created by the dapp',
				onClick: () => window.open(`https://www.blocknative.com`)
			})

		})

	}, []);*/
	
	// *************************************************************************************************************************
	// ******************************************************** Update Data ****************************************************
	// *************************************************************************************************************************
	const onSelectCryptocommodity = async (cryptocommodityName: any)=>{
		console.log('onSelectCryptocommodity', cryptocommodityName);
		await selectCrypto(cryptocommodityName);

		customNotification({
			eventCode: 'connect',
			type: 'success',
			message: 'Connected to CrytoCommodity ' + cryptocommodityName,
			autoDismiss: 5000,
			//onClick: () => window.open(`https://www.blocknative.com`)
		})
	}

	// *************************************************************************************************************************
	// ************************************************************ UI *********************************************************
	// *************************************************************************************************************************
  return (

    <header className="header sticky-top mb-4 py-2 px-sm-2 border-bottom bg-header">
			
      <Container fluid className="header-navbar d-flex align-items-center">
				
        <Button variant="link" className="header-toggler d-md-none px-md-0 me-md-3 rounded-0 shadow-none" type="button" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </Button>
        <Button variant="link" className="header-toggler d-none d-md-inline-block px-md-0 me-md-3 rounded-0 shadow-none" type="button" onClick={toggleSidebarMd}>
          <FontAwesomeIcon icon={faBars} />
        </Button>

        <Link href="/" className="header-brand d-md-none">
          <svg width="80" height="46">
            <title>Catallactic Logo</title>
            <use xlinkHref="assets/brand/catallactic.svg#full" />
          </svg>
        </Link>

				{/*
        <div className="header-nav d-none d-md-flex">
					<Nav>
						<Nav.Item>
							<Link href="/admin/environment" passHref legacyBehavior>
								<Nav.Link className="p-2">Environment</Nav.Link>
							</Link>
						</Nav.Item>
					</Nav>
        </div>
				*/}

        <div className="header-nav ms-auto">
	
					{/* https://github.com/Mohammed-Poolwla/structuring-next13/tree/main/src */}
					{/* CryptoCommodities icon */}
					{wallet && CRYPTOCOMMODITIES && CRYPTOCOMMODITIES.length > 0 ?
						<Dropdown className="btn mx-2 my-0 dropdown p-0 border-0" onSelect={onSelectCryptocommodity} >

							<Dropdown.Toggle className="w-100 bg-header border-0" disabled={!CRYPTOCOMMODITIES || CRYPTOCOMMODITIES.length == 0}>
								{ selectedCrypto?.SELECTED_CRYPTOCOMMODITY_NAME ? <span className='text-white mx-2 text-decoration-none'> {selectedCrypto?.SELECTED_CRYPTOCOMMODITY_NAME} </span>: <FontAwesomeIcon size="xl" icon={faCoins} className='text-white mx-2' /> }
							</Dropdown.Toggle>

							<Dropdown.Menu className="w-auto">
								{CRYPTOCOMMODITIES?.map((item: any, index: any) => {
									return (
										<Dropdown.Item as="button" key={index} eventKey={item} active={selectedCrypto?.SELECTED_CRYPTOCOMMODITY_NAME == item}>
											{item}
										</Dropdown.Item>
									);
								})}
								<DropdownDivider/>
								<Dropdown.Item as="button" key="ALL" eventKey="ALL">
									<Link href="/admin/cryptocommodities" passHref legacyBehavior>
										<span className='text-decoration-none'>CryptoCommodities Finder</span>
									</Link>
								</Dropdown.Item>
							</Dropdown.Menu>

						</Dropdown>
					
					: wallet && CRYPTOCOMMODITIES && CRYPTOCOMMODITIES.length == 0 ? 
					<Button className='bg-header border-0'>
						<Link href="/admin/cryptocommodities" passHref legacyBehavior>
							{ selectedCrypto?.SELECTED_CRYPTOCOMMODITY_NAME ? <span className='text-white mx-2 text-decoration-none'> {selectedCrypto?.SELECTED_CRYPTOCOMMODITY_NAME} </span>: <FontAwesomeIcon size="xl" icon={faCoins} className='text-white mx-2' /> }
						</Link>
					</Button>

					: '' }

					{/* User account icon */}
					{wallet ?
						<Button className='bg-header border-0'>
							<Link href="/admin/accounts" passHref legacyBehavior>
								<FontAwesomeIcon size="xl" icon={faUser} className='text-white cursor-pointer mx-2' />
							</Link>
						</Button>
					: '' }

					<button type="button" className={"btn mx-2 text-white text-uppercase fw-bolder " + (connecting ? "bg-connecting" : wallet ? "bg-connected" : "bg-disconnected") } disabled={connecting} onClick={() => (wallet ? disconnect(wallet) : connect())}>
						{connecting ? 'Connecting' : wallet ? getMETAMASK_CHAINS().find(function (el: any) { return parseInt(el.id) == parseInt(wallet.chains[0].id); })?.name : 'Connect'}
					</button>

				</div>

      </Container>

			{ wallet && CRYPTOCOMMODITIES && selectedCrypto && CRYPTOCOMMODITIES.includes(selectedCrypto.SELECTED_CRYPTOCOMMODITY_NAME) ?
	      <div className="header-divider border-top my-2 mx-sm-n2" />
			: '' }

			{ wallet && CRYPTOCOMMODITIES && selectedCrypto && CRYPTOCOMMODITIES.includes(selectedCrypto.SELECTED_CRYPTOCOMMODITY_NAME) ?
				<Container fluid>
					<ChevronList chevron={props.process} setChevron={props.setProcess} />
				</Container>
			: '' }

			{ wallet && CRYPTOCOMMODITIES && selectedCrypto  && CRYPTOCOMMODITIES.includes(selectedCrypto.SELECTED_CRYPTOCOMMODITY_NAME) ?
				<Container fluid><ChevronChildrenList process={props.process} /></Container>
			: '' }

    </header>
  )
}
