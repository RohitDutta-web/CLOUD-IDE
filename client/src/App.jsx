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
import ProtectedRoute from './security/protectedRoute';
import VerificationPop from './components/verificationPop';




function App() {




  const dispatch = useDispatch();
  useEffect(() => {
    if (!document.cookie.includes("token")) {
      dispatch(logOut())
      return;
    }


    return;
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/userEntry' element={<UserEntry />} />
        <Route path='/playground' element={
          <ProtectedRoute>
            <Playground />
          </ProtectedRoute>

        } />
        <Route path='/room/:roomId' element={
          <ProtectedRoute>
            <Room />
          </ProtectedRoute>} />
        <Route path='/' element={<Home />} />
        <Route path='/codingPlayGround' element={
          <ProtectedRoute>
          <CodingPlayGround />
        </ProtectedRoute>} />
        <Route path='/details' element={<ProtectedRoute>
          <UserDetails />
        </ProtectedRoute>} />
      </Routes>

      <VerificationPop/>


    </BrowserRouter>
  )
}

export default App
