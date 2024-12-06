import { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';

const ScrollWrapper = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return <Outlet />;
};

export default ScrollWrapper; 