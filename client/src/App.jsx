
import Signup from './Components/Signup'
import Login from './Components/Login'
import Work from './Components/Work'
import TaskForm from './Components/work-form'
import { Toaster } from 'react-hot-toast'
import { Routes, Route } from 'react-router-dom'
import Home from './Components/Home'
import axios from 'axios'
import Navbar from './Components/Navbar'


axios.defaults.baseURL = 'http://localhost:5000/'
axios.defaults.withCredentials = true;

function App() {
  return (
    <div>
      <Toaster position='bottom-right' toastOptions={{ duration: 10000 }} />
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/work' element={<Work />} />
        <Route path='/workform' element={<TaskForm />} />
      </Routes>
    </div>
  )
}

export default App
