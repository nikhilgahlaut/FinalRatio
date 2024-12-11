import React from 'react';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Work from './Components/Work';
import TaskForm from './Components/work-form';
import { Toaster } from 'react-hot-toast';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import axios from 'axios';
import Navbar from './Components/Navbar';
import LandingPage from './Components/LandingPage';
import Access from './Components/Access';
import Time from './Components/timeTracking';
import RequireAuth from './Components/RequireAuth'; // Import the authentication HOC

axios.defaults.baseURL = `http://localhost:5000/`;
axios.defaults.withCredentials = true;

function App() {
  return (
    <div>
      <Toaster position="bottom-right" toastOptions={{ duration: 5000 }} />
      <Navbar />
      {/* Add the margin-top class to create space below the fixed navbar */}
      <div className="mt-16">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<p>Path not resolved</p>} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/access" element={<RequireAuth><Access /></RequireAuth>} />
          <Route path="/time" element={<RequireAuth><Time /></RequireAuth>} />
          {/* Uncomment the below routes if they are needed */}
          {/* <Route path="/work" element={<RequireAuth><Work /></RequireAuth>} />
          <Route path="/workform" element={<RequireAuth><TaskForm /></RequireAuth>} /> */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
