import { useState } from 'react'
import './App.css'
import Signup from './Components/Signup'
import Login from './Components/Login'
import { Toaster } from 'react-hot-toast'
import { Routes,Route } from 'react-router-dom'
import Home from './Components/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Toaster position='bottom-right' toastOptions={{duration:10000}}/>
      <Routes>
        <Route path='/' element = {<Home/>}/>
        <Route path='/signup' element = {<Signup/>}/>
        <Route path='/login' element = {<Login/>}/>
      </Routes>
    </>
  )
}

export default App
