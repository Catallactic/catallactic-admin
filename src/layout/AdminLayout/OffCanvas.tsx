import { faBook } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { TUTORIAL } from 'config/config';

function OffCanvas(props: { process: string }) {
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
          <Offcanvas.Title className="fs-3 fw-bold">{TUTORIAL[props.process][0].text}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>

					{ TUTORIAL[props.process].map( (item:any) => (
						item.type == "H2" ?
							<p className="fs-4 mt-2">{item.text}</p>
						: item.type == "H3" ?
							<p className="mb-0" onClick={() => (redirect(item.URL))} >{item.text}</p>
						: ''
					))}

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