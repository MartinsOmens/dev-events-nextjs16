// app/components/FontsWrapper.tsx
'use client'

import { ReactNode } from 'react'

interface FontsWrapperProps {
  children: ReactNode
  schibsted: string
  martian: string
}

export default function FontsWrapper({ children, schibsted, martian }: FontsWrapperProps) {
  return (
    <div suppressHydrationWarning className={`${schibsted} ${martian} min-h-screen antialiased`}>
      {children}
    </div>
  )
}
