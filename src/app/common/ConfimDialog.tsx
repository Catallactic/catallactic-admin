import { Button, Modal } from 'react-bootstrap'

interface IProps {
	text: string;
	show: boolean;
	onClose: () => void;
	onAccept: () => void;
}

const ConfimDialog = (props: IProps) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >

      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
				Confirmation Message
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h4>Please answer the question below</h4>
        <p>
          {props.text}
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button className="btn btn-secondary" onClick={props.onClose}>Close</Button>
        <Button className="btn btn-primary" onClick={props.onAccept}>LogOff</Button>
      </Modal.Footer>

    </Modal>
  )
}
export default ConfimDialog
