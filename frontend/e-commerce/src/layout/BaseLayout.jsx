import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../customer/components/Footer/Footer';
import Navigation from '../customer/components/Navigation/Navigation'
import { ToastContainer } from 'react-toastify';
const BaseLayout = () => {
  return (
    <div>
        <Navigation />
        <Outlet />
        <Footer className="px-4 sm:px-6 lg:px-8"/>
        <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default BaseLayout;
