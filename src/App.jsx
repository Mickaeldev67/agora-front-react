import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import Thread from './pages/Thread'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/thread/:id" element={<Thread />} />
      </Routes>
    </>
  )
}

export default App
