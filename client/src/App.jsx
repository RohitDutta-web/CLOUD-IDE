import UserEntry from './pages/userEntry'
import Playground from './pages/playground'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/userEntry' element={<UserEntry />} />
        <Route path='/playground' element={<Playground />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App
