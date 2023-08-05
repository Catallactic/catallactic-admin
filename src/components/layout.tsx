// src/components/layout.tsx
import React, { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function Layout(props: Props) {
  return (
    <div className="css-1m25bqz">
      {props.children}
    </div>
  )
}
