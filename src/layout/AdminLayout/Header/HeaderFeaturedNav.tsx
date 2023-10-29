import Link from 'next/link'
import { Nav } from 'react-bootstrap'

export default function HeaderFeaturedNav() {
  return (
    <Nav>
      <Nav.Item>
        <Link href="/" passHref legacyBehavior>
          <Nav.Link className="p-2">Environment</Nav.Link>
        </Link>
      </Nav.Item>
      <Nav.Item>
        <Link href="#" passHref legacyBehavior>
          <Nav.Link className="p-2">Cryptocommodities</Nav.Link>
        </Link>
      </Nav.Item>
      <Nav.Item>
        <Link href="#" passHref legacyBehavior>
          <Nav.Link className="p-2">Accounts</Nav.Link>
        </Link>
      </Nav.Item>
    </Nav>
  )
}
