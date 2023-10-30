// src/pages/_app.tsx
import type { AppProps } from 'next/app'

import { AdminLayout } from 'layout'
import { SimpleLayout } from 'layout/SimpleLayout';

import '@fortawesome/fontawesome-svg-core/styles.css'
import '../styles/globals.scss'
import '../styles/_app.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AdminLayout>
      <Component {...pageProps} />
    </AdminLayout>
  )
}

export default MyApp
