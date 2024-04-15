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
import Demo from './components/Zdemo/Demo';
import PurchaseTablePage from './components/PurchaseBillPage/PurchaseTablePage ';


import LandingPage from './components/LandingPages/LandingPage';
import ContactUs from './components/MyAboutInfo/ContactUs';
import AboutUs from './components/MyAboutInfo/AboutUs';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import DashboardNew from './components/DashboardPage/Dashboard';


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AuthProvider> 
        <Routes>
          {/* <Route path="/" element={<App />} /> */}
          <Route path="/demo" element={<Demo />} />
          <Route path="/Purchasetablepage" element={<PurchaseTablePage />} />


          <Route path="/" element={<LandingPage />} />

          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />

          <Route path="/dashboard" element={<DashboardNew />} />

        </Routes>

      </AuthProvider>
      
    </Router>
    <ToastContainer />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
