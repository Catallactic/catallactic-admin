import { faBook } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

function OffCanvas() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button onClick={handleShow} className='bg-secondary-subtle position-absolute top-0 end-0 border-0'>
				<FontAwesomeIcon className="sidebar-toggler-chevron" icon={faBook} fontSize={24} />
      </Button>

      <Offcanvas show={show} onHide={handleClose} placement='end' className="bg-secondary-subtle">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fs-3 fw-bold">FUNDRAISING PROCESS</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>

					<p className="fs-4">Create CryptoCommodity</p>
					<p className="mb-0" onClick={() => (redirect('/admin/cryptocommodities'))} >ISSUER: Create Cryptocommodity</p>
          <p className="mb-0" onClick={() => (redirect('/admin/cryptocommodities'))} >ISSUER: Select Cryptocommodity</p>
          <p className="mb-0" onClick={() => (redirect('/admin/cryptocommodities'))} >ISSUER: Install Facets</p>
          <p className="mb-0" onClick={() => (redirect('/admin/cryptocommodities'))} >ISSUER: Create Storage</p>
          <p className="mb-0" onClick={() => (redirect('/erc20/features'))} >ISSUER: Initialize Cryptocommodity ERC-20 with Name, Symbol, Cryptocommodity Supply</p>
					<br/>

					<p className="fs-4">Create Funding Round</p>
					<p className="mb-0" onClick={() => (redirect('/vesting/features'))} >ISSUER: Create Vesting Period</p>
          <p className="mb-0" onClick={() => (redirect('/rounds/features'))} >ISSUER: Create Funding Round</p>
          <p className="mb-0" onClick={() => (redirect('/rounds/antiwhale'))} >ISSUER: Configure Antiwhale</p>
          <p className="mb-0" onClick={() => (redirect('/rounds/payments'))} >ISSUER: Install Payment Methods</p>
          <p className="mb-0" onClick={() => (redirect('/rounds/payments'))} >ISSUER: Set the setReceiveFacet (the Crowdsale facet address)</p>
					<br/>

					<p className="fs-4">Manage Funding Round</p>
					<p className="mb-0" onClick={() => (redirect('/rounds/operations'))} >ISSUER: Start Funding Round</p>
          <p className="mb-0" onClick={() => (redirect('/admin/cryptocommodities'))} >INVESTOR: Find Cryptocommodity</p>
          <p className="mb-0" onClick={() => (redirect('/admin/accounts'))} >INVESTOR: Invest Token</p>
          <p className="mb-0" onClick={() => (redirect('/admin/accounts'))} >INVESTOR: Invest Coin</p>
          <p className="mb-0" onClick={() => (redirect('/rounds/antiwhale'))} >ISSUER: Whitelist Investor</p>
          <p className="mb-0" onClick={() => (redirect('/admin/accounts'))} >INVESTOR: Invest Token</p>
          <p className="mb-0" onClick={() => (redirect('/admin/accounts'))} >INVESTOR: Invest Coin</p>
					<br/>

					<p className="fs-4">Finalize Funding Round with Failure</p>
					<p className="mb-0" onClick={() => (redirect('/rounds/operations'))} >ISSUER: Finalize Funding Round</p>
					<p className="mb-0" onClick={() => (redirect('/rounds/operations'))} >INVESTOR: Refund invested tokens</p>
					<p className="mb-0" onClick={() => (redirect('/rounds/operations'))} >INVESTOR: Refund invested coins</p>
					<p className="mb-0" onClick={() => (redirect('/rounds/operations'))} >ISSUER: Reset Funding Round</p>
					<br/>

					<p className="fs-4">Finalize Funding Round with Success</p>
					<p className="mb-0" onClick={() => (redirect('/rounds/operations'))} >ISSUER: Finalize Funding Round</p>
					<p className="mb-0" onClick={() => (redirect('/rounds/operations'))} >ISSUER: Enter Vesting Address in Crowdsale</p>
					<p className="mb-0" onClick={() => (redirect('/rounds/operations'))} >ISSUER: Enter Token Address in Crowdsale</p>
					<p className="mb-0" onClick={() => (redirect('/vesting/operations'))} >ISSUER: Enter Token Address in Vesting</p>
					<p className="mb-0" onClick={() => (redirect('/vesting/operations'))} >ISSUER: Enter Crowdsale Address as Vesting Grantor</p>
					<p className="mb-0" onClick={() => (redirect('/rounds/operations'))} >ISSUER: Transfers to Crowdsale Total Cryptocommodities purchased</p>
					<p className="mb-0" onClick={() => (redirect('/admin/accounts'))} >INVESTOR: Claims purchased Cryptocommodities</p>
					<p className="mb-0" onClick={() => (redirect('/vesting/operations'))} >INVESTOR: Waits Vesting Periods</p>
					<p className="mb-0" onClick={() => (redirect('/vesting/operations'))} >INVESTOR: Release Vesting Slides</p>
					<p className="mb-0" onClick={() => (redirect('/rounds/operations'))} >ISSUER: Configures Withdraw Wallet</p>
					<p className="mb-0" onClick={() => (redirect('/rounds/operations'))} >ISSUER: Withdraws Funds to Wallet</p>
					<p className="mb-0" onClick={() => (redirect('/admin/contract'))} >ISSUER: Runs TGE to Exchanges (Optionally)</p>
					<br/>

        </Offcanvas.Body>
      </Offcanvas>

			{/*
			
			https://codepen.io/rvanlaak/pen/dympKXQ 
			
			{show ?
			<div className="bg-secondary-subtle offcanvas offcanvas-end show" tabIndex={-1}>
				<div className="offcanvas-header">
					<div className="offcanvas-title h5">Responsive offcanvas</div>
					<button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
				</div>
				<div className="offcanvas-body">
					<p className="mb-0">This is content within an <code>.offcanvas-lg</code>.</p>
				</div>
			</div>
			: ""}*/}

    </>
  );
}

export default OffCanvas;