import { faBook } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
          <Offcanvas.Title>Responsive offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <p className="mb-0">
            This is content within an <code>.offcanvas-lg</code>.
          </p>
        </Offcanvas.Body>
      </Offcanvas>

			{/*{show ?
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