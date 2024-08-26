import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../customer/components/Footer/Footer';
import Navigation from '../customer/components/Navigation/Navigation'
const BaseLayout = () => {
  return (
    <div>
        <Navigation />
        <Outlet />
        <Footer className="px-4 sm:px-6 lg:px-8"/>
    </div>
  );
};

export default BaseLayout;
