// src/pages/_app.tsx
import type { AppProps } from 'next/app'
import { AdminLayout } from 'layout'

import '@fortawesome/fontawesome-svg-core/styles.css'
import '../styles/globals.scss'
import '../styles/_app.css';
import { SimpleLayout } from 'layout/SimpleLayout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AdminLayout>
      <Component {...pageProps} />
    </AdminLayout>
  )
}

export default MyApp
