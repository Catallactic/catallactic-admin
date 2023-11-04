import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAddressCard,
  faBell,
  faFileLines,
  faStar,
  IconDefinition,
} from '@fortawesome/free-regular-svg-icons'
import {
  faBug,
  faCalculator,
  faChartPie,
  faChevronUp, faCode,
  faDroplet,
  faGauge,
  faLayerGroup,
  faLocationArrow,
  faPencil,
  faPuzzlePiece,
  faRightToBracket,
} from '@fortawesome/free-solid-svg-icons'
import React, {
  PropsWithChildren, useContext, useEffect, useState,
} from 'react'
import {
  Accordion, AccordionContext, Badge, Button, Nav, useAccordionButton,
} from 'react-bootstrap'
import classNames from 'classnames'
import Link from 'next/link'

import { ContractsContext } from '../../../hooks/useContractContextHook'

type SidebarNavItemProps = {
  href: string;
  disabled?: boolean;
  icon?: IconDefinition;
} & PropsWithChildren

const SidebarNavItem = (props: SidebarNavItemProps) => {
  const {
    icon,
    children,
    href,
    disabled,
  } = props

  return (
    <Nav.Item>
      <Link href={href} passHref legacyBehavior>
        <Nav.Link className="px-3 py-2 d-flex align-items-center" disabled={disabled}>
          {icon ? <FontAwesomeIcon className="nav-icon ms-n3" icon={icon} />
            : <span className="nav-icon ms-n3" />}
          {children}
        </Nav.Link>
      </Link>
    </Nav.Item>
  )
}

const SidebarNavTitle = (props: PropsWithChildren) => {
  const { children } = props

  return (
    <li className="nav-title px-3 py-2 mt-3 text-uppercase fw-bold">{children}</li>
  )
}

type SidebarNavGroupToggleProps = {
  eventKey: string;
  icon: IconDefinition;
  setIsShow: (isShow: boolean) => void;
} & PropsWithChildren

const SidebarNavGroupToggle = (props: SidebarNavGroupToggleProps) => {
  // https://react-bootstrap.github.io/components/accordion/#custom-toggle-with-expansion-awareness
  const { activeEventKey } = useContext(AccordionContext)
  const {
    eventKey, icon, children, setIsShow,
  } = props

  const decoratedOnClick = useAccordionButton(eventKey)

  const isCurrentEventKey = activeEventKey === eventKey

  useEffect(() => {
    setIsShow(activeEventKey === eventKey)
  }, [activeEventKey, eventKey, setIsShow])

  return (
    <Button
      variant="link"
      type="button"
      className={classNames('rounded-0 nav-link px-3 py-2 d-flex align-items-center flex-fill w-100 shadow-none', {
        collapsed: !isCurrentEventKey,
      })}
      onClick={decoratedOnClick}
    >
      <FontAwesomeIcon className="nav-icon ms-n3" icon={icon} />
      {children}
      <div className="nav-chevron ms-auto text-end">
        <FontAwesomeIcon size="xs" icon={faChevronUp} />
      </div>
    </Button>
  )
}

type SidebarNavGroupProps = {
  toggleIcon: IconDefinition;
  toggleText: string;
} & PropsWithChildren

const SidebarNavGroup = (props: SidebarNavGroupProps) => {
  const {
    toggleIcon,
    toggleText,
    children,
  } = props

  const [isShow, setIsShow] = useState(false)

  return (
    <Accordion as="li" bsPrefix="nav-group" className={classNames({ show: isShow })}>
      <SidebarNavGroupToggle icon={toggleIcon} eventKey="0" setIsShow={setIsShow}>{toggleText}</SidebarNavGroupToggle>
      <Accordion.Collapse eventKey="0">
        <ul className="nav-group-items list-unstyled">
          {children}
        </ul>
      </Accordion.Collapse>
    </Accordion>
  )
}

type SidebarNavIconProps = {
  isSelected: boolean;
} & PropsWithChildren

const SidebarNavIcon = (props: SidebarNavIconProps) => {
  const { isSelected } = props

  return (
		<div>{ !isSelected ? <a href='/cryptocommodities/cryptocommodities'><small className="ps-2 ms-auto"><Badge bg="danger" className="ms-auto"> ! </Badge></small></a> : '' }</div>
  );
}

export default function SidebarNav() {

	const { selectedCrypto } = useContext(ContractsContext);

	return (
    <ul className="list-unstyled">
      <SidebarNavItem icon={faGauge} href="/"> Dashboard <small className="ms-auto"><Badge bg="danger" className="ms-auto">BETA</Badge></small></SidebarNavItem>
      <SidebarNavItem icon={faDroplet} href="/legacy">Legacy</SidebarNavItem>

      <SidebarNavTitle>Funding</SidebarNavTitle>

      <SidebarNavGroup toggleIcon={faPuzzlePiece} toggleText="Funding Rounds">
        <SidebarNavItem href="/rounds/features">Features <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
        <SidebarNavItem href="/rounds/antiwhale">AntiWhale <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
        <SidebarNavItem href="/rounds/payments">Payments <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
        <SidebarNavItem href="/rounds/operations">Operations <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
        <SidebarNavItem href="/rounds/investors">Investors <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
        <SidebarNavItem href="/rounds/contract">Contract <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavGroup toggleIcon={faPuzzlePiece} toggleText="Vesting">
				<SidebarNavItem href="/vesting/features">Features <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
				<SidebarNavItem href="/vesting/operations">Operations <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
        <SidebarNavItem href="/vesting/holders">Holders <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
        <SidebarNavItem href="/vesting/contract">Contract <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavTitle>Negotiation</SidebarNavTitle>

      <SidebarNavGroup toggleIcon={faLocationArrow} toggleText="CryptoCommodity">
				<SidebarNavItem href="#">Features <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
        <SidebarNavItem href="#">Holders <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
        <SidebarNavItem href="#">Contract <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavGroup toggleIcon={faLocationArrow} toggleText="Reserve">
        <SidebarNavItem href="#">Buttons <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
        <SidebarNavItem href="#">Buttons Group <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
        <SidebarNavItem href="#">Dropdowns <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavGroup toggleIcon={faLocationArrow} toggleText="Rewards">
        <SidebarNavItem href="#">Buttons <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
        <SidebarNavItem href="#">Buttons Group <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
        <SidebarNavItem href="#">Dropdowns <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavTitle>Distribution</SidebarNavTitle>

      <SidebarNavGroup toggleIcon={faFileLines} toggleText="Operations">
        <SidebarNavItem href="#">Form Control <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
        <SidebarNavItem href="#">Select <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
        <SidebarNavItem href="#">Checks and radios <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavGroup toggleIcon={faFileLines} toggleText="Airdrops">
        <SidebarNavItem href="#">Form Control <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
        <SidebarNavItem href="#">Select <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
        <SidebarNavItem href="#">Checks and radios <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavTitle>DeFi Services</SidebarNavTitle>

      <SidebarNavGroup toggleIcon={faFileLines} toggleText="Lending">
        <SidebarNavItem href="#">Form Control <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
        <SidebarNavItem href="#">Select <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
        <SidebarNavItem href="#">Checks and radios <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavGroup toggleIcon={faFileLines} toggleText="Staking">
        <SidebarNavItem href="#">Form Control <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
        <SidebarNavItem href="#">Select <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
        <SidebarNavItem href="#">Checks and radios <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavGroup toggleIcon={faFileLines} toggleText="Transfers">
        <SidebarNavItem href="#">Form Control <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
        <SidebarNavItem href="#">Select <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
        <SidebarNavItem href="#">Checks and radios <SidebarNavIcon isSelected={selectedCrypto != undefined} /> </SidebarNavItem>
      </SidebarNavGroup>

    </ul>
  )
}
