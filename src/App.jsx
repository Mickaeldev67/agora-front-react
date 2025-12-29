import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import Thread from './pages/Thread'
import Community from './pages/Community'
import Register from './pages/Register'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/thread/:id" element={<Thread />} />
        <Route path="/community/:id" element={<Community />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </>
  )
}

export default App
