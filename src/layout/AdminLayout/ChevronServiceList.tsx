import { redirect } from 'next/navigation'
import { Col, Row } from 'react-bootstrap'


function Chevron(text: any) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" version="1.2" preserveAspectRatio="xMaxYMid" viewBox="0 0 150 35">
			<path fill="#FFFFFF99" d="M 148.29233,16.152561 118.48449,1.4051792 A 8.3666232,2.7596038 0 0 0 111.50924,0.17383038 H 2.7216526 A 2.7945122,0.92172748 0 0 0 0.39656831,1.6068035 L 31.863622,17.17711 a 2.7873514,0.91936558 0 0 1 -3.41e-4,1.022523 L 0.39656831,33.765879 A 2.7942398,0.92163764 0 0 0 2.7216526,35.198853 H 111.50923 a 8.3659805,2.7593918 0 0 0 6.97525,-1.231123 l 29.80784,-14.747382 a 8.363172,2.7584654 0 0 0 1e-5,-3.067787 z m -4.6505,2.045277 -29.8075,14.747382 a 2.7876379,0.9194601 0 0 1 -2.32509,0.410224 H 7.9435332 L 36.513427,19.222152 a 8.3614115,2.7578848 0 0 0 3.43e-4,-3.06757 L 7.9428486,2.0172439 H 111.50923 a 2.7891748,0.91996702 0 0 1 2.32508,0.4104494 l 29.8075,14.7473817 a 2.7884691,0.91973429 0 0 1 0,1.022749 z" />
			<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF99" font-size="15">` + text + `</text>
		</svg>`
	)
};

export default function ChevronServiceList() {
  return (
		<div className='m-2'>
			<Row className='overflow-x-auto d-flex flex-row flex-nowrap'>
				<Col className='m-0 p-0'><img src={`data:image/svg+xml;utf8,${encodeURIComponent(Chevron('Payments'))}`} onClick={() => (redirect('/erc20/features'))} /></Col>
				<Col className='m-0 p-0'><img src={`data:image/svg+xml;utf8,${encodeURIComponent(Chevron('Transfers'))}`} onClick={() => (redirect('/erc20/holders'))} /></Col>
				<Col className='m-0 p-0'><img src={`data:image/svg+xml;utf8,${encodeURIComponent(Chevron('Lending'))}`} onClick={() => (redirect('/erc20/features'))} /></Col>
				<Col className='m-0 p-0'></Col>
				<Col className='m-0 p-0'></Col>
				<Col className='m-0 p-0'></Col>
				<Col className='m-0 p-0'></Col>
				<Col className='m-0 p-0'></Col>
			</Row>
	  </div>
  )
}
