import UserEntry from './pages/userEntry'
import Playground from './pages/playground'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Room from './pages/room'
import './App.css'
import Home from './pages/home'

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/userEntry' element={<UserEntry />} />
        <Route path='/playground' element={<Playground />} />
        <Route path='/room/:roomId' element={<Room />} />
        <Route path='/' element={<Home />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App
