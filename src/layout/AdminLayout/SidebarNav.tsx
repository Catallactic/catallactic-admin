import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines, IconDefinition, } from '@fortawesome/free-regular-svg-icons'
import { faChevronUp, faGauge, faLocationArrow, faPuzzlePiece, } from '@fortawesome/free-solid-svg-icons'
import React, { PropsWithChildren, useContext, useEffect, useState, } from 'react'
import { Accordion, AccordionContext, Badge, Button, Nav, useAccordionButton, } from 'react-bootstrap'
import classNames from 'classnames'
import Link from 'next/link'

// ******************************************************************************************************************************************************************
// ****************************************************************************** NavItem ***************************************************************************
// ******************************************************************************************************************************************************************
type SidebarNavItemProps = {
  href: string;
  disabled?: boolean;
  icon?: IconDefinition;
} & PropsWithChildren

const SidebarNavItem = (props: SidebarNavItemProps) => {
  const { icon, children, href, disabled, } = props

  return (
    <Nav.Item>
      <Link href={href} passHref legacyBehavior>
        <Nav.Link className="px-3 py-2 d-flex align-items-center" disabled={disabled}>
          {icon ? <FontAwesomeIcon className="nav-icon ms-n3" icon={icon} /> : <span className="nav-icon ms-n3" />}
          {children}
        </Nav.Link>
      </Link>
    </Nav.Item>
  )
}

// ******************************************************************************************************************************************************************
// ****************************************************************************** NavTitle **************************************************************************
// ******************************************************************************************************************************************************************
const SidebarNavTitle = (props: PropsWithChildren) => {
  const { children } = props

  return (
    <li className="nav-title px-3 py-2 mt-3 text-uppercase fw-bold">{children}</li>
  )
}

// ******************************************************************************************************************************************************************
// ***************************************************************************** NavGroupToogle *********************************************************************
// ******************************************************************************************************************************************************************
type SidebarNavGroupToggleProps = {
  eventKey: string;
  icon: IconDefinition;
	disabled: boolean,
  setIsShow: (isShow: boolean) => void;
} & PropsWithChildren

const SidebarNavGroupToggle = (props: SidebarNavGroupToggleProps) => {
  // https://react-bootstrap.github.io/components/accordion/#custom-toggle-with-expansion-awareness
  const { activeEventKey } = useContext(AccordionContext)
  const {
    eventKey, icon, children, disabled, setIsShow,
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
			disabled={disabled}
    >
      <FontAwesomeIcon className="nav-icon ms-n3" icon={icon} />
      {children}
      <div className="nav-chevron ms-auto text-end">
        <FontAwesomeIcon size="xs" icon={faChevronUp} />
      </div>
    </Button>
  )
}

// ******************************************************************************************************************************************************************
// ******************************************************************************** NavGroup ************************************************************************
// ******************************************************************************************************************************************************************
type SidebarNavGroupProps = {
  toggleIcon: IconDefinition;
  toggleText: string;
	disabled: boolean;
} & PropsWithChildren

const SidebarNavGroup = (props: SidebarNavGroupProps) => {
  const { toggleIcon, toggleText, children, disabled, } = props

  const [isShow, setIsShow] = useState(false)

  return (
    <Accordion as="li" bsPrefix="nav-group" className={classNames({ show: isShow })}>
      <SidebarNavGroupToggle icon={toggleIcon} eventKey="0" setIsShow={setIsShow} disabled={disabled}>{toggleText}</SidebarNavGroupToggle>
      <Accordion.Collapse eventKey="0">
        <ul className="nav-group-items list-unstyled">
          {children}
        </ul>
      </Accordion.Collapse>
    </Accordion>
  )
}

// ******************************************************************************************************************************************************************
// ******************************************************************************** NavIcon *************************************************************************
// ******************************************************************************************************************************************************************
type SidebarNavIconProps = {
  isSelected: boolean;
} & PropsWithChildren

const SidebarNavIcon = (props: SidebarNavIconProps) => {
  const { isSelected } = props

  return (
		<div>{ !isSelected ? <small className="ps-2 ms-auto"><Badge bg="danger" className="ms-auto"> ! </Badge></small> : '' }</div>
  );
}


// ******************************************************************************************************************************************************************
// *********************************************************************************** Nav **************************************************************************
// ******************************************************************************************************************************************************************
export default function SidebarNav() {

	return (
    <ul className="list-unstyled">
      <SidebarNavItem icon={faGauge} href="/dashboard"> Dashboard <small className="ms-auto"><Badge bg="danger" className="ms-auto bg-disconnected">ALPHA</Badge></small></SidebarNavItem>

      <SidebarNavTitle>Crommodty</SidebarNavTitle>

      <SidebarNavGroup toggleIcon={faLocationArrow} toggleText="Crommodity" disabled={false}>
				<SidebarNavItem href="/erc20/features">Features</SidebarNavItem>
        <SidebarNavItem href="/erc20/holders">Holders</SidebarNavItem>
        <SidebarNavItem href="/admin/contract">Contract</SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavGroup toggleIcon={faFileLines} toggleText="Airdrops" disabled={true}>
        <SidebarNavItem href="#">Form Control</SidebarNavItem>
        <SidebarNavItem href="#">Select</SidebarNavItem>
        <SidebarNavItem href="#">Checks and radios</SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavTitle>Fundraising</SidebarNavTitle>

      <SidebarNavGroup toggleIcon={faPuzzlePiece} toggleText="Fundraising" disabled={false}>
        <SidebarNavItem href="/rounds/features">Create Round</SidebarNavItem>
        <SidebarNavItem href="/rounds/operations">Manage Round</SidebarNavItem>
        <SidebarNavItem href="/rounds/antiwhale">AntiWhale</SidebarNavItem>
        <SidebarNavItem href="/rounds/payments">Payments</SidebarNavItem>
        <SidebarNavItem href="/rounds/investors">Investors</SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavGroup toggleIcon={faPuzzlePiece} toggleText="Vesting" disabled={false}>
				<SidebarNavItem href="/vesting/features">Vesting Programs</SidebarNavItem>
				<SidebarNavItem href="/vesting/operations">Vesting Schedulers</SidebarNavItem>
        <SidebarNavItem href="/vesting/holders">Holders</SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavTitle>Negotiation</SidebarNavTitle>

      <SidebarNavGroup toggleIcon={faPuzzlePiece} toggleText="Trading" disabled={false}>
			<SidebarNavItem href="/trading/tge">TGE</SidebarNavItem>
			<SidebarNavItem href="/trading/pairs">Pairs</SidebarNavItem>
        <SidebarNavItem href="/trading/reserve">Reserve</SidebarNavItem>
        <SidebarNavItem href="/trading/rewards">Rewards</SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavTitle>DeFi Services</SidebarNavTitle>

      <SidebarNavGroup toggleIcon={faLocationArrow} toggleText="Payments" disabled={true}>
        <SidebarNavItem href="#">Form Control</SidebarNavItem>
        <SidebarNavItem href="#">Select</SidebarNavItem>
        <SidebarNavItem href="#">Checks and radios</SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavGroup toggleIcon={faLocationArrow} toggleText="Wallets" disabled={true}>
        <SidebarNavItem href="#">Buttons</SidebarNavItem>
        <SidebarNavItem href="#">Buttons Group</SidebarNavItem>
        <SidebarNavItem href="#">Dropdowns</SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavGroup toggleIcon={faLocationArrow} toggleText="Cards" disabled={true}>
        <SidebarNavItem href="#">Buttons</SidebarNavItem>
        <SidebarNavItem href="#">Buttons Group</SidebarNavItem>
        <SidebarNavItem href="#">Dropdowns</SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavGroup toggleIcon={faLocationArrow} toggleText="Transfers" disabled={true}>
        <SidebarNavItem href="#">Form Control</SidebarNavItem>
        <SidebarNavItem href="#">Select</SidebarNavItem>
        <SidebarNavItem href="#">Checks and radios</SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavGroup toggleIcon={faLocationArrow} toggleText="Lending" disabled={true}>
        <SidebarNavItem href="#">Form Control</SidebarNavItem>
        <SidebarNavItem href="#">Select</SidebarNavItem>
        <SidebarNavItem href="#">Checks and radios</SidebarNavItem>
      </SidebarNavGroup>

    </ul>
  )
}
