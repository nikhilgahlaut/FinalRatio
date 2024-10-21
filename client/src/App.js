import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route,Routes} from "react-router-dom"
import * as React from 'react'
import Home from './home.js'

import Home1 from './Home1.js'

const App = ()=>(
  
  <BrowserRouter>
    <Home/>
<Routes>

  <Route path="/" element={<Home1/>} />
   
</Routes>
</BrowserRouter>
)
export default App;
