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
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<p>Path not resolved</p>} />
          <Route path="/access" element={<Access />} />
          {/* <Route path="/work" element={<Work />} />
          <Route path="/workform" element={<TaskForm />} /> */}
          <Route path="/time" element={<Time />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
