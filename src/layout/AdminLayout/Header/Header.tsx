import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { Button, Container } from 'react-bootstrap'
import Breadcrumb from '../Breadcrumb/Breadcrumb'
import HeaderFeaturedNav from '../Header/HeaderFeaturedNav'

import { truncateEthAddress } from '../../../config/config'

import { useWeb3Modal } from '@web3modal/wagmi/react'

import { useNetwork } from 'wagmi'
import { useAccount } from 'wagmi'

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

  return (

    <header className="header sticky-top mb-4 py-2 px-sm-2 border-bottom">
			
      <Container fluid className="header-navbar d-flex align-items-center">
				
        <Button
          variant="link"
          className="header-toggler d-md-none px-md-0 me-md-3 rounded-0 shadow-none"
          type="button"
          onClick={toggleSidebar}
        >
          <FontAwesomeIcon icon={faBars} />
        </Button>
        <Button
          variant="link"
          className="header-toggler d-none d-md-inline-block px-md-0 me-md-3 rounded-0 shadow-none"
          type="button"
          onClick={toggleSidebarMd}
        >
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

        <div className="header-nav ms-auto">
					<button type="button" className="btn btn-primary m-2" onClick={() => open()}>{ isDisconnected ? 'Connect User' : address }</button>
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
