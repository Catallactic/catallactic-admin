import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { Button, Container, Dropdown } from 'react-bootstrap'
import Breadcrumb from '../Breadcrumb/Breadcrumb'
import HeaderFeaturedNav from '../Header/HeaderFeaturedNav'

import { truncateEthAddress } from '../../../config/config'

import { useWeb3Modal } from '@web3modal/wagmi/react'

import { useNetwork } from 'wagmi'
import { useAccount } from 'wagmi'
import { useContext, useEffect } from 'react'
import { ContractsContext } from 'hooks/useContractContextHook'

type HeaderProps = {
  toggleSidebar: () => void;
  toggleSidebarMd: () => void;
}

export default function Header(props: HeaderProps) {
  const { toggleSidebar, toggleSidebarMd } = props

	// 4. Use modal hook
	const { open } = useWeb3Modal()
	const { chain } = useNetwork()
	const { address, isDisconnected } = useAccount()

	const { createEnvContracts, envContracts, loadYourCryptocommodities, CRYPTOCOMMODITIES, selectCrypto, unselectCrypto, selectedCrypto, contracts } = useContext(ContractsContext);

	useEffect(() => {
		console.log('createEnvContracts');
		createEnvContracts(chain?.id ? chain.id : 0);

		console.log('loadYourCryptocommodities');
		loadYourCryptocommodities();
	}, [])


	const onSelectCryptocommodity = async (cryptocommodityName: any)=>{
		console.log('onSelectCryptocommodity', cryptocommodityName);
		await selectCrypto(cryptocommodityName);
	}

  return (

    <header className="header sticky-top mb-4 py-2 px-sm-2 border-bottom">
			
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
            <use xlinkHref="/assets/brand/catallactic.svg#full" />
          </svg>
        </Link>

        <div className="header-nav d-none d-md-flex">
          <HeaderFeaturedNav />
        </div>

				<Dropdown onSelect={onSelectCryptocommodity}>
					<Dropdown.Toggle className="btn-lg bg-yellow text-black-50 w-100" disabled={!CRYPTOCOMMODITIES || CRYPTOCOMMODITIES.length == 0}>
						{ selectedCrypto?.SELECTED_CRYPTOCOMMODITY_NAME }
					</Dropdown.Toggle>

					<Dropdown.Menu className="w-100">
						{CRYPTOCOMMODITIES?.map((item: any, index: any) => {
							return (
								<Dropdown.Item as="button" key={index} eventKey={item} active={selectedCrypto?.SELECTED_CRYPTOCOMMODITY_NAME == item}>
									{item}
								</Dropdown.Item>
							);
						})}
					</Dropdown.Menu>
				</Dropdown>

        <div className="header-nav ms-auto">
					<button type="button" className="btn btn-primary m-2" onClick={() => open()}>{ isDisconnected || !address ? 'Connect User' : truncateEthAddress(address) }</button>
      		<button type="button" className="btn btn-primary m-2" onClick={() => open({ view: 'Networks' })}>{isDisconnected ? 'Connect Chain' : chain?.name}</button>
				</div>

      </Container>

      <div className="header-divider border-top my-2 mx-sm-n2" />

      <Container fluid>
        <Breadcrumb />
      </Container>

    </header>
  )
}
