import UserEntry from './pages/userEntry'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/userEntry' element={<UserEntry />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App
