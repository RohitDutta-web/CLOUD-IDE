import UserEntry from './pages/userEntry'
import Playground from './pages/playground'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logOut } from './utils/userSlice';
import Room from './pages/room'
import './App.css'
import Home from './pages/home'
import CodingPlayGround from './pages/codingPlayGround';
import UserDetails from './pages/userDetails';



function App() {

  const dispatch = useDispatch();
  useEffect(() => {
    if (!document.cookie.includes("token")) {
      dispatch(logOut())
      return;
    }

    return;
  },[])

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/userEntry' element={<UserEntry />} />
        <Route path='/playground' element={<Playground />} />
        <Route path='/room/:roomId' element={<Room />} />
        <Route path='/' element={<Home />} />
        <Route path='/codingPlayGround' element={<CodingPlayGround />} />
        <Route path='/details' element={<UserDetails />} />
      </Routes>
    

    </BrowserRouter>
  )
}

export default App
