import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

import { NotFound } from '../pages/NotFound'
import { duration, ease } from '../lib/motion'
import { createStore, StoreProvider, useAppState } from '../lib/store'
import { Admin } from './Admin'
import { AppShell } from './AppShell'
import { Dashboard } from './Dashboard'
import { FloorMap } from './FloorMap'
import { MyBookings } from './MyBookings'
import { nav, adminNav } from './nav'
import { Onboarding } from './Onboarding'
import { Parking } from './Parking'
import { Rooms } from './Rooms'
import { Team } from './Team'
import { Week } from './Week'

const screens: Record<string, () => React.ReactNode> = {
  '/app': () => <Dashboard />,
  '/app/floor': () => <FloorMap />,
  '/app/rooms': () => <Rooms />,
  '/app/bookings': () => <MyBookings />,
  '/app/parking': () => <Parking />,
  '/app/team': () => <Team />,
  '/app/week': () => <Week />,
  '/app/admin': () => <Admin />,
}

/** The real app: a persisted store, onboarding on first run, then the shell. */
export default function AppRoot({ path }: { path: string }) {
  const [store] = useState(() => createStore({ persist: true }))
  return (
    <StoreProvider store={store}>
      <Routes path={path.replace(/\/$/, '') || '/app'} />
    </StoreProvider>
  )
}

function Routes({ path }: { path: string }) {
  const { profile } = useAppState()
  const screen = screens[path]
  const label = [...nav, ...adminNav].find((n) => n.path === path)?.label
  useEffect(() => {
    document.title = profile.onboarded ? `${label ?? 'Not found'} · DeskFlow` : 'Welcome · DeskFlow'
  }, [label, profile.onboarded])
  if (!screen) return <NotFound />
  if (!profile.onboarded) return <Onboarding />
  return (
    <AppShell path={path}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={path} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: duration.fast, ease }}>
          {screen()}
        </motion.div>
      </AnimatePresence>
    </AppShell>
  )
}
