import { useState } from 'react'
import Navbar from './components/Navbar.jsx';
import { Routes, Route, Link} from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx'
import LogActivity from './pages/LogActivity.jsx'
import LogHistory from './pages/LogHistory.jsx'
import Settings from './pages/Settings.jsx'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar />
    <div>
      <hr />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="Dashboard" element={<Dashboard />} />
        <Route path="log-activity" element={<LogActivity />} />
        <Route path="log-history" element={<LogHistory />} />
      </Routes>
    </div>
    </>
  )
}

export default App
