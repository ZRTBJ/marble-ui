import React from 'react'
import { AppLayout } from '../components/Layout/AppLayout'
import Homepage from '../features/home'

export default function Home() {
  return (
    <AppLayout fullWidth={false}>
      <Homepage />
    </AppLayout>
  )
}
