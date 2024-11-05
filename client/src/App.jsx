
import Signup from './Components/Signup'
import Login from './Components/Login'
import { Toaster } from 'react-hot-toast'
import { Routes, Route } from 'react-router-dom'
import Home from './Components/Home'
import axios from 'axios'
import Navbar from './Components/Navbar'
import LandingPage from './Components/LandingPage'
// import TokenComponents from './Components/TokenComponents'
//import bg from './assets/'

// const endpoint = 'user';

axios.defaults.baseURL = `http://localhost:5000/`
axios.defaults.withCredentials = true;

function App() {
  return (
    <div>
      <Toaster position='bottom-right' toastOptions={{ duration: 5000 }} />
      <Navbar/>
      <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/dashboard' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path="*" element={<p>Path not resolved</p>} />
      </Routes>
    </div>
  )
}

export default App
