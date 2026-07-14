import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import PhoneFrame from './components/PhoneFrame'
import TabBar from './components/TabBar'

import Home from './pages/Home'
import FitnessPlans from './pages/FitnessPlans'
import EditFitnessPlan from './pages/EditFitnessPlan'
import CreateExercises from './pages/CreateExercises'
import EditExercise from './pages/EditExercise'
import RestTimer from './pages/RestTimer'
import Workout from './pages/Workout'
import Statistics from './pages/Statistics'

import './App.css'

// Routes that render without the floating tab bar (full-screen / pushed flows).
// The exercise editor keeps the tab bar; the plan editor and live workout
// use their own bottom-anchored controls instead.
const FULLSCREEN = ['/workout', '/rest']
const isFullscreen = (path) =>
  FULLSCREEN.includes(path) ||
  (path.startsWith('/plans/') && path.endsWith('/edit'))

const pageMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
}

function AnimatedPage({ children }) {
  return (
    <motion.div className="page" {...pageMotion}>
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()
  const showTabBar = !isFullscreen(location.pathname)

  return (
    <PhoneFrame>
      <div className="app">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <AnimatedPage>
                  <Home />
                </AnimatedPage>
              }
            />
            <Route
              path="/plans"
              element={
                <AnimatedPage>
                  <FitnessPlans />
                </AnimatedPage>
              }
            />
            <Route
              path="/plans/:planId/edit"
              element={
                <AnimatedPage>
                  <EditFitnessPlan />
                </AnimatedPage>
              }
            />
            <Route
              path="/exercises"
              element={
                <AnimatedPage>
                  <CreateExercises />
                </AnimatedPage>
              }
            />
            <Route
              path="/exercises/:exerciseId/edit"
              element={
                <AnimatedPage>
                  <EditExercise />
                </AnimatedPage>
              }
            />
            <Route
              path="/rest"
              element={
                <AnimatedPage>
                  <RestTimer />
                </AnimatedPage>
              }
            />
            <Route
              path="/workout"
              element={
                <AnimatedPage>
                  <Workout />
                </AnimatedPage>
              }
            />
            <Route
              path="/statistics"
              element={
                <AnimatedPage>
                  <Statistics />
                </AnimatedPage>
              }
            />
          </Routes>
        </AnimatePresence>

        {showTabBar && <TabBar />}
      </div>
    </PhoneFrame>
  )
}
