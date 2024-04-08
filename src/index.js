import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider } from './components/Auth/AuthProvider'; // Import the AuthProvider component

import App from './App';
import Purchase from './components/PurchaseBill/Purchase';
import Demo from './components/DemoPage/Demo';

import SideBar from './components/SideBar/SideBar';
import PurchaseBill from './components/PurchaseBillPage/PurchaseBillPage';
import BookDetailsPage from './components/PurchaseBillPage/BookDetailsPage';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AuthProvider> {/* Wrap the entire application with AuthProvider */}
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/demo" element={<Demo />} />

          <Route path="/sidebar" element={<SideBar />} />
          <Route path="/purchasebillpage" element={<PurchaseBill />} />
          <Route path="/bookdetailspage" element={<BookDetailsPage />} />

        </Routes>
      </AuthProvider>
    </Router>
    <ToastContainer />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
