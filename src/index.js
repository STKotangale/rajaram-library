import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider } from './components/Auth/AuthProvider'; 

// import App from './App';
import LoginPage from './components/Auth/LoginPage';

import Dashboard from './components/CommonFiles/Dashboard';

import ContactUs from './components/CommonFiles/ContactUs';
import AboutUs from './components/CommonFiles/AboutUs';
import ForgotPassword from './components/Auth/ForgotPassword';
import MemberDashboard from './components/CommonFiles/MemberDashboard';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AuthProvider> 
        <Routes>
          {/* <Route path="/" element={<App />} /> */}
      
          <Route path="/" element={<LoginPage />} />

          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/memberdashboard" element={<MemberDashboard />} />


        </Routes>

      </AuthProvider>
      
    </Router>
    <ToastContainer />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
