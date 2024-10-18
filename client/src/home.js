import {Link} from 'react-router-dom'
import * as React from 'react'
import './home.css'
import { useNavigate } from "react-router-dom";
//import 'bootstrap/dist/css/bootstrap.css';
//import Container from 'react-bootstrap/Container';
const Header =()=>{
    const navigate = useNavigate();
   return (
<div id='mainDiv'>
{/*<marquee className="mar1">Welcome</marquee>*/}

 {/*  <Container> <row> */}
{/*  </row> <row> */}

    <ul className='nav1'>
    <li className='link1'>
        <Link to="/" className='link1'>Home</Link>
    </li>
    
    <li className='link1'>
        <Link to="/about" className='link1'>Your Account</Link>
    </li>
    
    <li className='link1'>
     {/* <Link to="/test" className='link1'>Test1</Link>  */}
       <a href="https://www.aboutamazon.in/?utm_source=gateway&utm_medium=footer" className="link1">About Us</a>
    </li>
    <li className='link1'>
        <Link to="/login" className='link1'>Login/Signup</Link>
    </li>

    </ul>

    {/*   </row> </Container>*/}
</div>
   

    
)

   }

export default Header