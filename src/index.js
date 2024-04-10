import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider } from './components/Auth/AuthProvider'; 

import App from './App';
import Demo from './components/DemoPage/Demo';

import  Dashboard  from './components/DashboardPage/Dashboard';
import PurchaseBill from './components/PurchaseBillPage/PurchaseBill';
import BookDetails from './components/PurchaseBillPage/BookDetails';

import PurchaseTablePage from './components/PurchaseBillPage/PurchaseTablePage ';
import LandingPage from './components/LandingPages/LandingPage';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AuthProvider> 
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/demo" element={<Demo />} />

          <Route path="/sidebar" element={<Dashboard />} />
          <Route path="/purchasebillpage" element={<PurchaseBill />} />
          <Route path="/bookdetailspage" element={<BookDetails />} />

          <Route path="/Purchasetablepage" element={<PurchaseTablePage />} />
          <Route path="/landingpage" element={<LandingPage />} />


        </Routes>

      </AuthProvider>
      
    </Router>
    <ToastContainer />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
