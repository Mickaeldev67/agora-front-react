import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import Thread from './pages/Thread'
import Community from './pages/Community'
import Register from './pages/Register'
import Login from './pages/Login'
import MenuLeft from './components/MenuLeft'
import Header from './components/Header'
import { UserCommunitiesProvider } from "./context/UserCommunitiesContext";
import NewThread from './pages/newThread'
import EditThread from './pages/EditThread'

function App() {

  return (
    <>
      <UserCommunitiesProvider>
        <Header />
        <main className="bg-gray-50 h-[95vh] flex justify-between">
          <MenuLeft />
          <div className='flex-1 overflow-auto p-5'>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/thread/:id" element={<Thread />} />
              <Route path="/community/:id" element={<Community />} />
              <Route path='/register' element={<Register />} />
              <Route path='/login' element={<Login />} />
              <Route path='/newThread' element={<NewThread />} />
              <Route path='/editThread' element={<EditThread />} />
            </Routes>
          </div>

          <div></div>
        </main>
      </UserCommunitiesProvider>
      
    </>
  )
}

export default App
