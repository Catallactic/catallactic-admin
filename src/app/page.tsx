import { redirect } from 'next/navigation';
import { Container } from 'react-bootstrap';

// when navigating to '/', NextJS throws a 404 on RSC and kills the session
// so do not come to '/'
// Maybe a bug but not fixed by one year
// GET https://catallactic.github.io/catallactic-admin.txt?_rsc=3lb4g 404 (Not Found)
// https://thiraphat-ps-dev.medium.com/mastering-next-js-app-router-best-practices-for-structuring-your-application-3f8cf0c76580
export default async function Home({ }) {
  //redirect('/dashboard');
  // ...

	return (

    <div className="bg-page d-flex flex-row align-items-center dark:bg-transparent">
      <Container className='mw-100'>

				<div>Please Connect your Wallet</div>

			</Container>
		</div>

	);
}